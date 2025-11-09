"""
Cultural & Islamic Compliance - Database Integration Layer
Provides Supabase database operations with intelligent caching and performance optimization

This module handles:
1. Validation result caching (SHA-256 content hashing, 24-hour TTL)
2. User preference management
3. Cultural-Islamic rule retrieval
4. Compliance violation tracking

Performance Optimizations:
- SHA-256 content hashing for O(1) cache lookups
- Async/await throughout for non-blocking I/O
- Connection pooling via Supabase client
- Batch operations where possible
- Index-optimized queries (<50ms target)

Architecture:
    IraqiCulturalValidator → cultural_islamic_db.py → Supabase PostgreSQL
                               (Cache layer)           (5 tables with RLS)

Usage:
    # Save validation result with automatic caching
    result_id = await save_validation_result(
        content="Your content here",
        cultural_score=0.95,
        islamic_score=0.90
    )

    # Load cached result (60%+ cache hit rate)
    cached_result = await load_validation_result("Your content here")
    if cached_result and not is_expired(cached_result):
        return cached_result

Dependencies:
    - supabase-py: Supabase Python client
    - python-dotenv: Environment variable management
"""

from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timedelta, timezone
from pydantic import BaseModel
import hashlib
import logging
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Supabase client (lazy initialization)
_supabase_client = None

try:
    from supabase import create_client, Client
except ImportError:
    logging.warning("supabase-py not installed. Install with: pip install supabase")
    create_client = None
    Client = None


# ============================================================================
# PYDANTIC MODELS FOR DATABASE OPERATIONS
# ============================================================================


class ValidationResultCache(BaseModel):
    """Cached validation result from database"""

    id: str
    content_hash: str
    content_type: str
    cultural_score: float
    islamic_score: float
    overall_compliance_score: float
    validation_status: str
    cultural_issues: List[Dict[str, Any]]
    islamic_issues: List[Dict[str, Any]]
    recommendations: List[str]
    regional_context: Optional[str] = None
    professional_domain: str = "general"
    validation_agent: Optional[str] = None
    validation_metadata: Dict[str, Any] = {}
    expires_at: Optional[datetime] = None
    created_at: datetime


class UserCompliancePreference(BaseModel):
    """User-specific compliance preferences"""

    id: str
    user_id: str
    cultural_sensitivity_level: str = "standard"
    islamic_compliance_level: str = "standard"
    regional_preference: str = "general"
    professional_domain: str = "general"
    enable_cultural_guidance: bool = True
    enable_islamic_guidance: bool = True
    enable_real_time_validation: bool = True
    preferred_feedback_language: str = "ar-IQ"
    custom_sensitivity_rules: Dict[str, Any] = {}
    created_at: datetime
    updated_at: datetime


class CulturalIslamicRule(BaseModel):
    """Cultural-Islamic validation rule"""

    id: str
    rule_name: str
    rule_type: str  # cultural, islamic, combined
    validation_category: str  # content_filter, behavioral_guide, terminology_check
    cultural_weight: float
    islamic_weight: float
    rule_config: Dict[str, Any]
    regional_variations: Dict[str, Any] = {}
    professional_domains: List[str] = ["general"]
    is_active: bool = True
    scholarly_source: Optional[str] = None
    cultural_source: Optional[str] = None
    created_at: datetime
    updated_at: datetime


# ============================================================================
# SUPABASE CLIENT INITIALIZATION
# ============================================================================


def get_supabase_client() -> Optional[Client]:
    """
    Get or create Supabase client (singleton pattern)

    Environment Variables Required:
        SUPABASE_URL: Supabase project URL
        SUPABASE_SERVICE_ROLE_KEY: Service role key for admin operations

    Returns:
        Supabase client or None if not configured
    """
    global _supabase_client

    if _supabase_client is None:
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

        if not supabase_url or not supabase_key:
            logging.warning(
                "SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set. "
                "Database operations will not work."
            )
            return None

        if create_client is None:
            logging.error(
                "supabase-py not installed. Install with: pip install supabase"
            )
            return None

        try:
            _supabase_client = create_client(supabase_url, supabase_key)
            logging.info("Supabase client initialized successfully")
        except Exception as e:
            logging.error(f"Failed to initialize Supabase client: {str(e)}")
            return None

    return _supabase_client


# ============================================================================
# CONTENT HASHING UTILITIES
# ============================================================================


def compute_content_hash(content: str) -> str:
    """
    Compute SHA-256 hash of content for cache key

    This provides:
    - Fast O(1) lookups in database (indexed on content_hash)
    - Content deduplication (same content = same hash)
    - 64-character unique identifier

    Args:
        content: Text content to hash

    Returns:
        64-character hexadecimal SHA-256 hash
    """
    return hashlib.sha256(content.encode("utf-8")).hexdigest()


def is_expired(cached_result: ValidationResultCache) -> bool:
    """
    Check if cached validation result has expired

    Args:
        cached_result: Cached validation result from database

    Returns:
        True if expired, False if still valid or no expiration set
        Note: Records without expires_at are considered valid indefinitely
    """
    if not cached_result.expires_at:
        return False  # No expiration = treat as valid (never expires)

    return datetime.now(timezone.utc) > cached_result.expires_at


# ============================================================================
# VALIDATION RESULT CACHING
# ============================================================================


async def save_validation_result(
    content: str,
    content_type: str,
    cultural_score: float,
    islamic_score: float,
    overall_score: float,
    validation_status: str,
    cultural_issues: List[Dict[str, Any]] = None,
    islamic_issues: List[Dict[str, Any]] = None,
    recommendations: List[str] = None,
    regional_context: Optional[str] = None,
    professional_domain: str = "general",
    validation_agent: str = "iraqi-cultural-validator",
    validation_metadata: Dict[str, Any] = None,
    cache_ttl_hours: int = 24,
) -> Optional[str]:
    """
    Save validation result to database with automatic caching

    This function:
    1. Computes SHA-256 content hash for cache key
    2. Inserts/updates validation result in content_validation_results table
    3. Sets TTL expiration (default 24 hours)
    4. Returns result ID for tracking

    Performance: <50ms target (index-optimized INSERT/UPDATE)

    Args:
        content: Text content that was validated
        content_type: Type of content (text, audio, image, video)
        cultural_score: Cultural appropriateness score (0.0-1.0)
        islamic_score: Islamic compliance score (0.0-1.0)
        overall_score: Overall compliance score (0.0-1.0)
        validation_status: Status (approved, warning, rejected)
        cultural_issues: List of cultural issues found
        islamic_issues: List of Islamic issues found
        recommendations: List of improvement recommendations
        regional_context: Iraqi region (baghdad, basra, mosul, erbil, general)
        professional_domain: Professional context (legal, medical, etc.)
        validation_agent: Agent that performed validation
        validation_metadata: Additional metadata
        cache_ttl_hours: Cache expiration in hours (default 24)

    Returns:
        Result ID (UUID) or None if operation failed
    """
    client = get_supabase_client()
    if not client:
        return None

    try:
        # Compute content hash
        content_hash = compute_content_hash(content)

        # Calculate expiration timestamp (UTC)
        expires_at = datetime.now(timezone.utc) + timedelta(hours=cache_ttl_hours)

        # Prepare data
        data = {
            "content_hash": content_hash,
            "content_type": content_type,
            "cultural_score": cultural_score,
            "islamic_score": islamic_score,
            "overall_compliance_score": overall_score,
            "validation_status": validation_status,
            "cultural_issues": cultural_issues or [],
            "islamic_issues": islamic_issues or [],
            "recommendations": recommendations or [],
            "regional_context": regional_context,
            "professional_domain": professional_domain,
            "validation_agent": validation_agent,
            "validation_metadata": validation_metadata or {},
            "expires_at": expires_at.isoformat(),
        }

        # Upsert (insert or update if content_hash exists)
        response = (
            client.table("content_validation_results")
            .upsert(
                data,
                on_conflict="content_hash",  # Unique constraint on content_hash
            )
            .execute()
        )

        if response.data:
            result_id = response.data[0]["id"]
            logging.info(
                f"Saved validation result: {result_id} (hash: {content_hash[:8]}...)"
            )
            return result_id

        return None

    except Exception as e:
        logging.error(f"Error saving validation result: {str(e)}")
        return None


async def load_validation_result(content: str) -> Optional[ValidationResultCache]:
    """
    Load cached validation result from database

    This function:
    1. Computes SHA-256 content hash
    2. Queries content_validation_results table (indexed on content_hash)
    3. Returns cached result if found and not expired

    Cache Hit Rate: Target 60%+ for typical usage patterns
    Performance: <20ms target (index-optimized SELECT)

    Args:
        content: Text content to lookup

    Returns:
        ValidationResultCache if found and not expired, None otherwise
    """
    client = get_supabase_client()
    if not client:
        return None

    try:
        # Compute content hash
        content_hash = compute_content_hash(content)

        # Query database
        response = (
            client.table("content_validation_results")
            .select("*")
            .eq("content_hash", content_hash)
            .execute()
        )

        if response.data and len(response.data) > 0:
            cached_data = response.data[0]

            # Parse to Pydantic model
            cached_result = ValidationResultCache(**cached_data)

            # Check expiration
            if is_expired(cached_result):
                logging.info(f"Cache expired for hash: {content_hash[:8]}...")
                return None

            logging.info(f"Cache HIT for hash: {content_hash[:8]}...")
            return cached_result

        logging.info(f"Cache MISS for hash: {content_hash[:8]}...")
        return None

    except Exception as e:
        logging.error(f"Error loading validation result: {str(e)}")
        return None


async def cleanup_expired_results() -> int:
    """
    Cleanup expired validation results from database

    This should be called periodically (e.g., hourly cron job) to maintain
    database performance and storage efficiency.

    Returns:
        Number of expired records deleted
    """
    client = get_supabase_client()
    if not client:
        return 0

    try:
        # Delete expired results
        response = (
            client.table("content_validation_results")
            .delete()
            .lt("expires_at", datetime.now().isoformat())
            .execute()
        )

        deleted_count = len(response.data) if response.data else 0
        logging.info(f"Cleaned up {deleted_count} expired validation results")
        return deleted_count

    except Exception as e:
        logging.error(f"Error cleaning up expired results: {str(e)}")
        return 0


# ============================================================================
# USER PREFERENCES
# ============================================================================


async def get_user_preferences(user_id: str) -> Optional[UserCompliancePreference]:
    """
    Get user's compliance preferences

    Args:
        user_id: User UUID

    Returns:
        UserCompliancePreference or None if not found
    """
    client = get_supabase_client()
    if not client:
        return None

    try:
        response = (
            client.table("user_compliance_preferences")
            .select("*")
            .eq("user_id", user_id)
            .execute()
        )

        if response.data and len(response.data) > 0:
            return UserCompliancePreference(**response.data[0])

        return None

    except Exception as e:
        logging.error(f"Error getting user preferences: {str(e)}")
        return None


async def save_user_preferences(
    user_id: str, preferences: Dict[str, Any]
) -> Optional[str]:
    """
    Save user's compliance preferences

    Args:
        user_id: User UUID
        preferences: Dictionary of preference values

    Returns:
        Preference record ID or None if operation failed
    """
    client = get_supabase_client()
    if not client:
        return None

    try:
        data = {"user_id": user_id, **preferences}

        response = (
            client.table("user_compliance_preferences")
            .upsert(data, on_conflict="user_id")
            .execute()
        )

        if response.data:
            return response.data[0]["id"]

        return None

    except Exception as e:
        logging.error(f"Error saving user preferences: {str(e)}")
        return None


# ============================================================================
# CULTURAL-ISLAMIC RULES
# ============================================================================


async def get_cultural_rules(
    professional_domain: str = "general", is_active: bool = True
) -> List[CulturalIslamicRule]:
    """
    Get active cultural-Islamic validation rules

    This function:
    1. Queries cultural_islamic_rules table (indexed on is_active)
    2. Filters by professional_domain if specified
    3. Returns list of active rules ordered by weight

    Performance: <30ms target for typical rule set (50-100 rules)

    Args:
        professional_domain: Filter by professional domain (legal, medical, etc.)
        is_active: Only return active rules (default True)

    Returns:
        List of CulturalIslamicRule objects
    """
    client = get_supabase_client()
    if not client:
        return []

    try:
        query = client.table("cultural_islamic_rules").select("*")

        # Filter by active status
        if is_active:
            query = query.eq("is_active", True)

        # Filter by professional domain (array contains check)
        if professional_domain != "general":
            query = query.filter(
                "professional_domains", "cs", f"{{{professional_domain}}}"
            )

        # Execute query and order by Islamic weight (Islamic takes precedence)
        response = query.order("islamic_weight", desc=True).execute()

        if response.data:
            return [CulturalIslamicRule(**rule) for rule in response.data]

        return []

    except Exception as e:
        logging.error(f"Error getting cultural rules: {str(e)}")
        return []


async def create_cultural_rule(rule_data: Dict[str, Any]) -> Optional[str]:
    """
    Create new cultural-Islamic rule

    Args:
        rule_data: Dictionary with rule configuration

    Returns:
        Rule ID or None if operation failed
    """
    client = get_supabase_client()
    if not client:
        return None

    try:
        response = client.table("cultural_islamic_rules").insert(rule_data).execute()

        if response.data:
            return response.data[0]["id"]

        return None

    except Exception as e:
        logging.error(f"Error creating cultural rule: {str(e)}")
        return None


# ============================================================================
# COMPLIANCE VIOLATIONS
# ============================================================================


async def save_compliance_violation(
    user_id: Optional[str],
    content_validation_id: Optional[str],
    violation_type: str,
    severity_level: str,
    violation_category: str,
    description: str,
    auto_resolved: bool = False,
    resolution_action: Optional[str] = None,
) -> Optional[str]:
    """
    Save compliance violation for tracking and moderation

    Args:
        user_id: User who triggered violation (optional)
        content_validation_id: Linked validation result (optional)
        violation_type: Type (cultural, islamic, both)
        severity_level: Severity (low, medium, high, critical)
        violation_category: Category (inappropriate_content, cultural_insensitivity, religious_violation)
        description: Violation description
        auto_resolved: Whether violation was auto-resolved
        resolution_action: Action taken (content_filtered, user_warned, etc.)

    Returns:
        Violation ID or None if operation failed
    """
    client = get_supabase_client()
    if not client:
        return None

    try:
        data = {
            "user_id": user_id,
            "content_validation_id": content_validation_id,
            "violation_type": violation_type,
            "severity_level": severity_level,
            "violation_category": violation_category,
            "description": description,
            "auto_resolved": auto_resolved,
            "resolution_action": resolution_action,
        }

        response = client.table("compliance_violations").insert(data).execute()

        if response.data:
            return response.data[0]["id"]

        return None

    except Exception as e:
        logging.error(f"Error saving compliance violation: {str(e)}")
        return None


async def get_user_violations(
    user_id: str, severity_level: Optional[str] = None, limit: int = 10
) -> List[Dict[str, Any]]:
    """
    Get user's compliance violations

    Args:
        user_id: User UUID
        severity_level: Filter by severity (optional)
        limit: Maximum number of results

    Returns:
        List of violation records
    """
    client = get_supabase_client()
    if not client:
        return []

    try:
        query = (
            client.table("compliance_violations")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(limit)
        )

        if severity_level:
            query = query.eq("severity_level", severity_level)

        response = query.execute()

        if response.data:
            return response.data

        return []

    except Exception as e:
        logging.error(f"Error getting user violations: {str(e)}")
        return []


# ============================================================================
# BATCH OPERATIONS (Performance Optimization)
# ============================================================================


async def batch_save_validation_results(
    results: List[Dict[str, Any]],
) -> Tuple[int, int]:
    """
    Batch save multiple validation results (performance optimization)

    This is more efficient than calling save_validation_result() multiple times
    for large datasets.

    Args:
        results: List of validation result dictionaries

    Returns:
        Tuple of (success_count, failure_count)
    """
    client = get_supabase_client()
    if not client:
        return 0, len(results)

    success_count = 0
    failure_count = 0

    try:
        # Prepare batch data (work on copies to avoid mutating input)
        batch_data = []
        for result_data in results:
            # Use .get() to avoid mutating input dictionary
            content = result_data.get("content", "")
            content_hash = compute_content_hash(content)

            # Set expiration (UTC)
            cache_ttl_hours = result_data.get("cache_ttl_hours", 24)
            expires_at = datetime.now(timezone.utc) + timedelta(hours=cache_ttl_hours)

            # Create a copy of result_data and add our fields
            batch_item = dict(result_data)
            batch_item["content_hash"] = content_hash
            batch_item["expires_at"] = expires_at.isoformat()
            batch_data.append(batch_item)

        # Batch upsert (insert or update on conflict)
        response = (
            await client.table("content_validation_results")
            .upsert(batch_data, on_conflict="content_hash")
            .execute()
        )

        if response.data:
            success_count = len(response.data)
            failure_count = len(results) - success_count

        logging.info(
            f"Batch saved {success_count} validation results, {failure_count} failures"
        )
        return success_count, failure_count

    except Exception as e:
        logging.error(f"Error in batch save: {str(e)}")
        return 0, len(results)


# ============================================================================
# STATISTICS & ANALYTICS
# ============================================================================


async def get_validation_statistics(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
) -> Dict[str, Any]:
    """
    Get validation statistics for analytics

    Args:
        start_date: Start of date range (optional)
        end_date: End of date range (optional)

    Returns:
        Dictionary with statistics (total_validations, avg_cultural_score, etc.)
    """
    client = get_supabase_client()
    if not client:
        return {}

    try:
        query = client.table("content_validation_results").select("*")

        if start_date:
            query = query.gte("created_at", start_date.isoformat())
        if end_date:
            query = query.lte("created_at", end_date.isoformat())

        response = query.execute()

        if not response.data:
            return {
                "total_validations": 0,
                "avg_cultural_score": 0.0,
                "avg_islamic_score": 0.0,
                "avg_overall_score": 0.0,
            }

        # Calculate statistics
        data = response.data
        total = len(data)
        avg_cultural = (
            sum(r["cultural_score"] for r in data) / total if total > 0 else 0.0
        )
        avg_islamic = (
            sum(r["islamic_score"] for r in data) / total if total > 0 else 0.0
        )
        avg_overall = (
            sum(r["overall_compliance_score"] for r in data) / total
            if total > 0
            else 0.0
        )

        return {
            "total_validations": total,
            "avg_cultural_score": round(avg_cultural, 3),
            "avg_islamic_score": round(avg_islamic, 3),
            "avg_overall_score": round(avg_overall, 3),
            "start_date": start_date.isoformat() if start_date else None,
            "end_date": end_date.isoformat() if end_date else None,
        }

    except Exception as e:
        logging.error(f"Error getting validation statistics: {str(e)}")
        return {}
