#!/usr/bin/env python3
"""
Iraqi GitHub Integration System
Enhanced GitHub integration with cultural validation, Arabic processing, and professional domain compliance.

Based on Open-SWE's proven patterns with Iraqi cultural intelligence.

Author: Iraqi Workflow Orchestration Specialist
Version: 1.0.0
License: MIT
"""

import json
import time
import asyncio
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Union, Any, Tuple
from dataclasses import dataclass, asdict
from enum import Enum
import jwt
import httpx
from urllib.parse import quote
import re
import hashlib

# Configure logging with cultural context
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("IraqiGitHubIntegration")


class CulturalValidationLevel(Enum):
    """Cultural validation levels for Iraqi compliance."""

    MINIMAL = "minimal"  # Basic Islamic compliance
    STANDARD = "standard"  # Full cultural appropriateness
    PROFESSIONAL = "professional"  # Professional domain validation
    GOVERNMENT = "government"  # Government service standards


class IraqiLanguageType(Enum):
    """Iraqi language processing types."""

    ARABIC = "arabic"  # Standard Arabic
    IRAQI_DIALECT = "iraqi_dialect"  # Iraqi Arabic dialect
    ENGLISH = "english"  # English
    MIXED = "mixed"  # Mixed Arabic-English content


class ProfessionalDomain(Enum):
    """Iraqi professional domain types."""

    LEGAL = "legal"  # Legal services
    MEDICAL = "medical"  # Healthcare services
    EDUCATIONAL = "educational"  # Educational institutions
    GOVERNMENT = "government"  # Government services
    BUSINESS = "business"  # Business/commercial
    TECHNICAL = "technical"  # Technical/IT


@dataclass
class CulturalValidationResult:
    """Result of cultural validation process."""

    is_compliant: bool
    compliance_score: float  # 0.0 to 1.0
    islamic_compliance: float  # 0.0 to 1.0
    cultural_issues: List[str]
    recommendations: List[str]
    validation_timestamp: str


@dataclass
class ArabicProcessingResult:
    """Result of Arabic text processing."""

    rtl_accuracy: float  # 0.0 to 1.0
    dialect_recognition: float  # 0.0 to 1.0
    mixed_content_handling: float  # 0.0 to 1.0
    processing_issues: List[str]
    suggested_improvements: List[str]


@dataclass
class IraqiTaskPlan:
    """Enhanced task plan with Iraqi cultural context."""

    tasks: List[Dict[str, Any]]
    active_task_index: int
    cultural_validation: CulturalValidationResult
    language_processing: Optional[ArabicProcessingResult]
    professional_domain: Optional[ProfessionalDomain]
    islamic_compliance_verified: bool
    created_timestamp: str
    last_updated: str


@dataclass
class GitHubRepositoryInfo:
    """GitHub repository information."""

    owner: str
    repo: str
    installation_id: str
    cultural_validation_level: CulturalValidationLevel
    supported_languages: List[IraqiLanguageType]
    professional_domains: List[ProfessionalDomain]


class IraqiGitHubAuth:
    """Iraqi-enhanced GitHub authentication with cultural context."""

    def __init__(self, app_id: str, private_key: str, encryption_key: str):
        self.app_id = app_id
        self.private_key = private_key.replace("\\n", "\n")
        self.encryption_key = encryption_key
        self.token_cache: Dict[str, Tuple[str, datetime]] = {}

    def generate_jwt_token(self) -> str:
        """Generate JWT token for GitHub App authentication."""
        try:
            now = int(time.time())
            payload = {
                "iat": now - 60,  # Issued 60 seconds ago to account for clock drift
                "exp": now + (10 * 60),  # Expires in 10 minutes
                "iss": self.app_id,
            }

            token = jwt.encode(payload, self.private_key, algorithm="RS256")
            logger.info("✅ Generated JWT token for GitHub App authentication")
            return token

        except Exception as e:
            logger.error(f"❌ Failed to generate JWT token: {str(e)}")
            raise

    async def get_installation_token(self, installation_id: str) -> Optional[str]:
        """Get installation access token with caching and retry logic."""
        # Check cache first
        cache_key = f"installation_{installation_id}"
        if cache_key in self.token_cache:
            token, expires_at = self.token_cache[cache_key]
            if datetime.now() + timedelta(minutes=5) < expires_at:
                logger.info("🔄 Using cached installation token")
                return token

        try:
            jwt_token = self.generate_jwt_token()

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"https://api.github.com/app/installations/{installation_id}/access_tokens",
                    headers={
                        "Authorization": f"Bearer {jwt_token}",
                        "Accept": "application/vnd.github.v3+json",
                        "User-Agent": "Iraqi-AI-Agent/1.0",
                    },
                )

                if response.status_code == 201:
                    data = response.json()
                    token = data.get("token")
                    if token:
                        # Cache token (expires in 1 hour, cache for 55 minutes)
                        expires_at = datetime.now() + timedelta(minutes=55)
                        self.token_cache[cache_key] = (token, expires_at)
                        logger.info("✅ Successfully obtained installation token")
                        return token

                logger.error(
                    f"❌ Failed to get installation token: {response.status_code} - {response.text}"
                )
                return None

        except Exception as e:
            logger.error(f"❌ Failed to get installation token: {str(e)}")
            return None


class IraqiCulturalValidator:
    """Cultural validation service for Iraqi compliance."""

    @staticmethod
    async def validate_content(
        content: str,
        validation_level: CulturalValidationLevel = CulturalValidationLevel.STANDARD,
        professional_domain: Optional[ProfessionalDomain] = None,
    ) -> CulturalValidationResult:
        """Validate content for Iraqi cultural compliance."""
        try:
            issues = []
            recommendations = []

            # Islamic compliance checks
            islamic_score = await IraqiCulturalValidator._validate_islamic_compliance(
                content
            )
            if islamic_score < 0.9:
                issues.append("Content may not fully comply with Islamic values")
                recommendations.append("Review content for Islamic compliance")

            # Political neutrality checks
            political_score = (
                await IraqiCulturalValidator._validate_political_neutrality(content)
            )
            if political_score < 0.95:
                issues.append("Content may contain politically sensitive material")
                recommendations.append("Ensure political neutrality in all content")

            # Professional domain validation
            domain_score = 1.0
            if professional_domain:
                domain_score = (
                    await IraqiCulturalValidator._validate_professional_domain(
                        content, professional_domain
                    )
                )
                if domain_score < 0.85:
                    issues.append(
                        f"Content may not meet {professional_domain.value} domain standards"
                    )
                    recommendations.append(
                        f"Ensure compliance with Iraqi {professional_domain.value} requirements"
                    )

            # Calculate overall compliance score
            compliance_score = min(islamic_score, political_score, domain_score)
            is_compliant = compliance_score >= 0.95

            return CulturalValidationResult(
                is_compliant=is_compliant,
                compliance_score=compliance_score,
                islamic_compliance=islamic_score,
                cultural_issues=issues,
                recommendations=recommendations,
                validation_timestamp=datetime.now().isoformat(),
            )

        except Exception as e:
            logger.error(f"❌ Cultural validation failed: {str(e)}")
            return CulturalValidationResult(
                is_compliant=False,
                compliance_score=0.0,
                islamic_compliance=0.0,
                cultural_issues=[f"Validation error: {str(e)}"],
                recommendations=["Re-run cultural validation"],
                validation_timestamp=datetime.now().isoformat(),
            )

    @staticmethod
    async def _validate_islamic_compliance(content: str) -> float:
        """Validate Islamic compliance of content."""
        # Check for haram content patterns
        haram_patterns = [
            r"\b(alcohol|wine|beer|gambling|casino|lottery|interest|riba)\b",
            r"\b(pork|ham|bacon|gambling)\b",
        ]

        content_lower = content.lower()
        violations = 0

        for pattern in haram_patterns:
            if re.search(pattern, content_lower):
                violations += 1

        # Score based on violations (fewer violations = higher score)
        base_score = 1.0
        if violations > 0:
            base_score = max(0.0, 1.0 - (violations * 0.2))

        return base_score

    @staticmethod
    async def _validate_political_neutrality(content: str) -> float:
        """Validate political neutrality of content."""
        # Check for politically sensitive terms
        sensitive_patterns = [
            r"\b(sectarian|sunni|shia|kurdish|arab)\b",
            r"\b(political party|election|government criticism)\b",
        ]

        content_lower = content.lower()
        violations = 0

        for pattern in sensitive_patterns:
            if re.search(pattern, content_lower):
                violations += 1

        base_score = 1.0
        if violations > 0:
            base_score = max(0.0, 1.0 - (violations * 0.1))

        return base_score

    @staticmethod
    async def _validate_professional_domain(
        content: str, domain: ProfessionalDomain
    ) -> float:
        """Validate content for specific professional domain requirements."""
        domain_requirements = {
            ProfessionalDomain.LEGAL: ["legal disclaimer", "iraqi law", "compliance"],
            ProfessionalDomain.MEDICAL: [
                "medical disclaimer",
                "healthcare standards",
                "patient privacy",
            ],
            ProfessionalDomain.EDUCATIONAL: [
                "educational content",
                "learning objectives",
                "curriculum",
            ],
            ProfessionalDomain.GOVERNMENT: [
                "government service",
                "citizen privacy",
                "official procedures",
            ],
        }

        requirements = domain_requirements.get(domain, [])
        if not requirements:
            return 1.0

        content_lower = content.lower()
        met_requirements = sum(1 for req in requirements if req in content_lower)

        return met_requirements / len(requirements) if requirements else 1.0


class IraqiArabicProcessor:
    """Arabic text processing with RTL support and Iraqi dialect recognition."""

    @staticmethod
    async def process_arabic_content(content: str) -> ArabicProcessingResult:
        """Process Arabic content for RTL accuracy and dialect recognition."""
        try:
            # Check for Arabic content
            arabic_pattern = (
                r"[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]"
            )
            has_arabic = bool(re.search(arabic_pattern, content))

            if not has_arabic:
                return ArabicProcessingResult(
                    rtl_accuracy=1.0,  # No Arabic content to validate
                    dialect_recognition=1.0,
                    mixed_content_handling=1.0,
                    processing_issues=[],
                    suggested_improvements=[],
                )

            # Calculate RTL accuracy
            rtl_accuracy = await IraqiArabicProcessor._calculate_rtl_accuracy(content)

            # Calculate Iraqi dialect recognition
            dialect_recognition = await IraqiArabicProcessor._recognize_iraqi_dialect(
                content
            )

            # Calculate mixed content handling
            mixed_handling = await IraqiArabicProcessor._validate_mixed_content(content)

            issues = []
            improvements = []

            if rtl_accuracy < 0.99:
                issues.append("RTL layout accuracy below required threshold")
                improvements.append("Implement proper RTL text direction handling")

            if dialect_recognition < 0.85:
                issues.append("Iraqi dialect recognition below required threshold")
                improvements.append("Enhance Iraqi Arabic dialect processing")

            if mixed_handling < 0.90:
                issues.append("Mixed Arabic-English content handling needs improvement")
                improvements.append("Optimize mixed content text processing")

            return ArabicProcessingResult(
                rtl_accuracy=rtl_accuracy,
                dialect_recognition=dialect_recognition,
                mixed_content_handling=mixed_handling,
                processing_issues=issues,
                suggested_improvements=improvements,
            )

        except Exception as e:
            logger.error(f"❌ Arabic processing failed: {str(e)}")
            return ArabicProcessingResult(
                rtl_accuracy=0.0,
                dialect_recognition=0.0,
                mixed_content_handling=0.0,
                processing_issues=[f"Processing error: {str(e)}"],
                suggested_improvements=["Re-run Arabic processing"],
            )

    @staticmethod
    async def _calculate_rtl_accuracy(content: str) -> float:
        """Calculate RTL text layout accuracy."""
        # Simple RTL accuracy based on proper Arabic text handling
        arabic_chars = len(re.findall(r"[\u0600-\u06FF]", content))
        if arabic_chars == 0:
            return 1.0

        # Check for common RTL issues
        rtl_issues = len(
            re.findall(r"[a-zA-Z][\u0600-\u06FF]", content)
        )  # Latin before Arabic
        rtl_issues += len(
            re.findall(r"[\u0600-\u06FF][a-zA-Z]", content)
        )  # Arabic before Latin

        accuracy = max(0.0, 1.0 - (rtl_issues * 0.1))
        return min(1.0, accuracy)

    @staticmethod
    async def _recognize_iraqi_dialect(content: str) -> float:
        """Recognize Iraqi Arabic dialect patterns."""
        iraqi_patterns = [
            r"\b(شلون|شكو|هسه|جان|وياه|بيه|گاع|چان)\b",  # Common Iraqi words
            r"\b(ماكو|شكو ماكو|لتكثر|بس|يمه|باجر)\b",  # More Iraqi expressions
        ]

        total_patterns = len(iraqi_patterns)
        found_patterns = 0

        for pattern in iraqi_patterns:
            if re.search(pattern, content):
                found_patterns += 1

        # Base recognition plus pattern matching
        base_recognition = 0.5 if re.search(r"[\u0600-\u06FF]", content) else 1.0
        pattern_bonus = (found_patterns / total_patterns) * 0.5

        return min(1.0, base_recognition + pattern_bonus)

    @staticmethod
    async def _validate_mixed_content(content: str) -> float:
        """Validate mixed Arabic-English content handling."""
        has_arabic = bool(re.search(r"[\u0600-\u06FF]", content))
        has_latin = bool(re.search(r"[a-zA-Z]", content))

        if not (has_arabic and has_latin):
            return 1.0  # Not mixed content

        # Check for proper spacing and direction handling
        mixed_issues = 0

        # Check for missing spaces around mixed content
        mixed_transitions = re.findall(
            r"[a-zA-Z][\u0600-\u06FF]|[\u0600-\u06FF][a-zA-Z]", content
        )
        if len(mixed_transitions) > 5:  # Too many abrupt transitions
            mixed_issues += 1

        accuracy = max(0.0, 1.0 - (mixed_issues * 0.2))
        return accuracy


class IraqiGitHubIntegration:
    """Enhanced GitHub integration with Iraqi cultural intelligence."""

    # Iraqi-enhanced XML-like tags for issue task plans
    IRAQI_TASK_OPEN_TAG = "<iraqi-ai-task-plan>"
    IRAQI_TASK_CLOSE_TAG = "</iraqi-ai-task-plan>"
    IRAQI_CULTURAL_VALIDATION_TAG = "<iraqi-cultural-validation>"
    IRAQI_CULTURAL_VALIDATION_CLOSE_TAG = "</iraqi-cultural-validation>"
    IRAQI_ARABIC_PROCESSING_TAG = "<iraqi-arabic-processing>"
    IRAQI_ARABIC_PROCESSING_CLOSE_TAG = "</iraqi-arabic-processing>"

    def __init__(
        self,
        app_id: str,
        private_key: str,
        encryption_key: str,
        cultural_validation_level: CulturalValidationLevel = CulturalValidationLevel.STANDARD,
    ):
        self.auth = IraqiGitHubAuth(app_id, private_key, encryption_key)
        self.cultural_validator = IraqiCulturalValidator()
        self.arabic_processor = IraqiArabicProcessor()
        self.cultural_validation_level = cultural_validation_level

    async def with_github_retry(
        self,
        operation,
        installation_token: str,
        error_message: str,
        max_retries: int = 2,
        **kwargs,
    ) -> Optional[Any]:
        """
        Generic utility for handling GitHub API calls with automatic retry on 401 errors.
        Enhanced with cultural validation and Arabic processing.
        """
        for attempt in range(max_retries + 1):
            try:
                result = await operation(installation_token, **kwargs)

                # Cultural validation for any content creation/update operations
                if hasattr(result, "body") and result.body:
                    validation_result = await self.cultural_validator.validate_content(
                        result.body, self.cultural_validation_level
                    )
                    if not validation_result.is_compliant:
                        logger.warning(
                            f"⚠️ Cultural validation issues detected: {validation_result.cultural_issues}"
                        )

                return result

            except Exception as error:
                if attempt < max_retries and "401" in str(error):
                    logger.warning(
                        f"🔄 Retrying operation due to 401 error (attempt {attempt + 1})"
                    )
                    # Get fresh installation token
                    fresh_token = await self.auth.get_installation_token(
                        kwargs.get("installation_id", "")
                    )
                    if fresh_token:
                        installation_token = fresh_token
                        continue

                logger.error(f"❌ {error_message}: {str(error)}")
                if attempt == max_retries:
                    return None

        return None

    async def create_culturally_compliant_pull_request(
        self,
        repo_info: GitHubRepositoryInfo,
        head_branch: str,
        title: str,
        body: str,
        base_branch: Optional[str] = None,
        draft: bool = False,
        professional_domain: Optional[ProfessionalDomain] = None,
    ) -> Optional[Dict[str, Any]]:
        """Create pull request with Iraqi cultural validation."""
        try:
            # Cultural validation
            logger.info("🔍 Validating cultural compliance for PR content...")
            cultural_validation = await self.cultural_validator.validate_content(
                f"{title}\n\n{body}",
                self.cultural_validation_level,
                professional_domain,
            )

            if not cultural_validation.is_compliant:
                logger.error(
                    f"❌ PR content fails cultural validation: {cultural_validation.cultural_issues}"
                )
                return None

            # Arabic processing if needed
            arabic_result = None
            if any(
                lang
                in [
                    IraqiLanguageType.ARABIC,
                    IraqiLanguageType.IRAQI_DIALECT,
                    IraqiLanguageType.MIXED,
                ]
                for lang in repo_info.supported_languages
            ):
                logger.info("🔤 Processing Arabic content...")
                arabic_result = await self.arabic_processor.process_arabic_content(
                    f"{title}\n\n{body}"
                )

                if arabic_result.rtl_accuracy < 0.99:
                    logger.warning(
                        f"⚠️ RTL accuracy below threshold: {arabic_result.rtl_accuracy}"
                    )

                if arabic_result.dialect_recognition < 0.85:
                    logger.warning(
                        f"⚠️ Iraqi dialect recognition below threshold: {arabic_result.dialect_recognition}"
                    )

            # Enhance body with Iraqi validation results
            enhanced_body = await self._enhance_content_with_validation(
                body, cultural_validation, arabic_result
            )

            installation_token = await self.auth.get_installation_token(
                repo_info.installation_id
            )
            if not installation_token:
                logger.error("❌ Failed to get installation token")
                return None

            async def create_pr_operation(
                token: str, **kwargs
            ) -> Optional[Dict[str, Any]]:
                async with httpx.AsyncClient() as client:
                    # Get default branch if not specified
                    if not base_branch:
                        repo_response = await client.get(
                            f"https://api.github.com/repos/{repo_info.owner}/{repo_info.repo}",
                            headers={
                                "Authorization": f"token {token}",
                                "Accept": "application/vnd.github.v3+json",
                                "User-Agent": "Iraqi-AI-Agent/1.0",
                            },
                        )

                        if repo_response.status_code == 200:
                            repo_data = repo_response.json()
                            default_branch = repo_data.get("default_branch", "main")
                        else:
                            default_branch = "main"
                    else:
                        default_branch = base_branch

                    # Create pull request
                    pr_data = {
                        "title": title,
                        "body": enhanced_body,
                        "head": head_branch,
                        "base": default_branch,
                        "draft": draft,
                    }

                    response = await client.post(
                        f"https://api.github.com/repos/{repo_info.owner}/{repo_info.repo}/pulls",
                        headers={
                            "Authorization": f"token {token}",
                            "Accept": "application/vnd.github.v3+json",
                            "User-Agent": "Iraqi-AI-Agent/1.0",
                        },
                        json=pr_data,
                    )

                    if response.status_code in [200, 201]:
                        pr_result = response.json()
                        logger.info(
                            f"✅ Pull request created successfully: {pr_result.get('html_url')}"
                        )

                        # Add Iraqi AI label
                        await self._add_iraqi_ai_label(
                            token, repo_info, pr_result["number"]
                        )

                        return pr_result

                    logger.error(
                        f"❌ Failed to create PR: {response.status_code} - {response.text}"
                    )
                    return None

            return await self.with_github_retry(
                create_pr_operation,
                installation_token,
                "Failed to create culturally compliant pull request",
                installation_id=repo_info.installation_id,
            )

        except Exception as e:
            logger.error(f"❌ Failed to create culturally compliant PR: {str(e)}")
            return None

    async def get_issue_with_iraqi_task_plan(
        self, repo_info: GitHubRepositoryInfo, issue_number: int
    ) -> Tuple[Optional[Dict[str, Any]], Optional[IraqiTaskPlan]]:
        """Get GitHub issue and extract Iraqi-enhanced task plan."""
        try:
            installation_token = await self.auth.get_installation_token(
                repo_info.installation_id
            )
            if not installation_token:
                logger.error("❌ Failed to get installation token")
                return None, None

            async def get_issue_operation(
                token: str, **kwargs
            ) -> Optional[Dict[str, Any]]:
                async with httpx.AsyncClient() as client:
                    response = await client.get(
                        f"https://api.github.com/repos/{repo_info.owner}/{repo_info.repo}/issues/{issue_number}",
                        headers={
                            "Authorization": f"token {token}",
                            "Accept": "application/vnd.github.v3+json",
                            "User-Agent": "Iraqi-AI-Agent/1.0",
                        },
                    )

                    if response.status_code == 200:
                        return response.json()

                    logger.error(
                        f"❌ Failed to get issue: {response.status_code} - {response.text}"
                    )
                    return None

            issue = await self.with_github_retry(
                get_issue_operation,
                installation_token,
                f"Failed to get issue #{issue_number}",
                installation_id=repo_info.installation_id,
            )

            if not issue or not issue.get("body"):
                return issue, None

            # Extract Iraqi task plan
            task_plan = await self._extract_iraqi_task_plan_from_content(issue["body"])

            return issue, task_plan

        except Exception as e:
            logger.error(f"❌ Failed to get issue with Iraqi task plan: {str(e)}")
            return None, None

    async def update_issue_with_iraqi_task_plan(
        self,
        repo_info: GitHubRepositoryInfo,
        issue_number: int,
        task_plan: IraqiTaskPlan,
        title: Optional[str] = None,
    ) -> Optional[Dict[str, Any]]:
        """Update GitHub issue with Iraqi-enhanced task plan."""
        try:
            # Get current issue
            issue, _ = await self.get_issue_with_iraqi_task_plan(
                repo_info, issue_number
            )
            if not issue:
                logger.error(f"❌ Issue #{issue_number} not found")
                return None

            # Insert Iraqi task plan into issue body
            new_body = await self._insert_iraqi_task_plan_to_body(
                issue.get("body", ""), task_plan
            )

            installation_token = await self.auth.get_installation_token(
                repo_info.installation_id
            )
            if not installation_token:
                logger.error("❌ Failed to get installation token")
                return None

            async def update_issue_operation(
                token: str, **kwargs
            ) -> Optional[Dict[str, Any]]:
                async with httpx.AsyncClient() as client:
                    update_data = {"body": new_body}
                    if title:
                        update_data["title"] = title

                    response = await client.patch(
                        f"https://api.github.com/repos/{repo_info.owner}/{repo_info.repo}/issues/{issue_number}",
                        headers={
                            "Authorization": f"token {token}",
                            "Accept": "application/vnd.github.v3+json",
                            "User-Agent": "Iraqi-AI-Agent/1.0",
                        },
                        json=update_data,
                    )

                    if response.status_code == 200:
                        result = response.json()
                        logger.info(
                            f"✅ Issue #{issue_number} updated with Iraqi task plan"
                        )
                        return result

                    logger.error(
                        f"❌ Failed to update issue: {response.status_code} - {response.text}"
                    )
                    return None

            return await self.with_github_retry(
                update_issue_operation,
                installation_token,
                f"Failed to update issue #{issue_number} with Iraqi task plan",
                installation_id=repo_info.installation_id,
            )

        except Exception as e:
            logger.error(f"❌ Failed to update issue with Iraqi task plan: {str(e)}")
            return None

    async def create_issue_comment_with_cultural_validation(
        self,
        repo_info: GitHubRepositoryInfo,
        issue_number: int,
        comment_body: str,
        professional_domain: Optional[ProfessionalDomain] = None,
    ) -> Optional[Dict[str, Any]]:
        """Create issue comment with cultural validation."""
        try:
            # Cultural validation
            logger.info("🔍 Validating cultural compliance for comment...")
            cultural_validation = await self.cultural_validator.validate_content(
                comment_body, self.cultural_validation_level, professional_domain
            )

            if not cultural_validation.is_compliant:
                logger.error(
                    f"❌ Comment fails cultural validation: {cultural_validation.cultural_issues}"
                )
                return None

            # Arabic processing if needed
            arabic_result = None
            if any(
                lang
                in [
                    IraqiLanguageType.ARABIC,
                    IraqiLanguageType.IRAQI_DIALECT,
                    IraqiLanguageType.MIXED,
                ]
                for lang in repo_info.supported_languages
            ):
                logger.info("🔤 Processing Arabic content in comment...")
                arabic_result = await self.arabic_processor.process_arabic_content(
                    comment_body
                )

            # Enhance comment with validation footer
            enhanced_comment = await self._enhance_comment_with_validation(
                comment_body, cultural_validation, arabic_result
            )

            installation_token = await self.auth.get_installation_token(
                repo_info.installation_id
            )
            if not installation_token:
                logger.error("❌ Failed to get installation token")
                return None

            async def create_comment_operation(
                token: str, **kwargs
            ) -> Optional[Dict[str, Any]]:
                async with httpx.AsyncClient() as client:
                    response = await client.post(
                        f"https://api.github.com/repos/{repo_info.owner}/{repo_info.repo}/issues/{issue_number}/comments",
                        headers={
                            "Authorization": f"token {token}",
                            "Accept": "application/vnd.github.v3+json",
                            "User-Agent": "Iraqi-AI-Agent/1.0",
                        },
                        json={"body": enhanced_comment},
                    )

                    if response.status_code == 201:
                        result = response.json()
                        logger.info(
                            f"✅ Comment created successfully on issue #{issue_number}"
                        )
                        return result

                    logger.error(
                        f"❌ Failed to create comment: {response.status_code} - {response.text}"
                    )
                    return None

            return await self.with_github_retry(
                create_comment_operation,
                installation_token,
                f"Failed to create comment on issue #{issue_number}",
                installation_id=repo_info.installation_id,
            )

        except Exception as e:
            logger.error(f"❌ Failed to create culturally validated comment: {str(e)}")
            return None

    async def get_issue_comments_filtered(
        self,
        repo_info: GitHubRepositoryInfo,
        issue_number: int,
        filter_bot_comments: bool = True,
        cultural_filter: bool = True,
    ) -> Optional[List[Dict[str, Any]]]:
        """Get issue comments with bot filtering and cultural compliance checking."""
        try:
            installation_token = await self.auth.get_installation_token(
                repo_info.installation_id
            )
            if not installation_token:
                logger.error("❌ Failed to get installation token")
                return None

            async def get_comments_operation(
                token: str, **kwargs
            ) -> Optional[List[Dict[str, Any]]]:
                async with httpx.AsyncClient() as client:
                    response = await client.get(
                        f"https://api.github.com/repos/{repo_info.owner}/{repo_info.repo}/issues/{issue_number}/comments",
                        headers={
                            "Authorization": f"token {token}",
                            "Accept": "application/vnd.github.v3+json",
                            "User-Agent": "Iraqi-AI-Agent/1.0",
                        },
                    )

                    if response.status_code == 200:
                        comments = response.json()

                        # Filter bot comments if requested
                        if filter_bot_comments:
                            comments = [
                                comment
                                for comment in comments
                                if comment.get("user", {}).get("type") != "Bot"
                                and "[bot]"
                                not in comment.get("user", {}).get("login", "")
                            ]

                        # Cultural filtering if requested
                        if cultural_filter:
                            filtered_comments = []
                            for comment in comments:
                                if comment.get("body"):
                                    validation = (
                                        await self.cultural_validator.validate_content(
                                            comment["body"],
                                            CulturalValidationLevel.MINIMAL,
                                        )
                                    )
                                    if validation.is_compliant:
                                        filtered_comments.append(comment)
                                    else:
                                        logger.info(
                                            f"ℹ️ Filtered comment due to cultural compliance issues"
                                        )
                                else:
                                    filtered_comments.append(comment)
                            comments = filtered_comments

                        logger.info(
                            f"✅ Retrieved {len(comments)} filtered comments for issue #{issue_number}"
                        )
                        return comments

                    logger.error(
                        f"❌ Failed to get comments: {response.status_code} - {response.text}"
                    )
                    return None

            return await self.with_github_retry(
                get_comments_operation,
                installation_token,
                f"Failed to get comments for issue #{issue_number}",
                installation_id=repo_info.installation_id,
            )

        except Exception as e:
            logger.error(f"❌ Failed to get filtered comments: {str(e)}")
            return None

    async def get_branch_info(
        self, repo_info: GitHubRepositoryInfo, branch_name: str
    ) -> Optional[Dict[str, Any]]:
        """Get branch information with cultural context."""
        try:
            installation_token = await self.auth.get_installation_token(
                repo_info.installation_id
            )
            if not installation_token:
                logger.error("❌ Failed to get installation token")
                return None

            async def get_branch_operation(
                token: str, **kwargs
            ) -> Optional[Dict[str, Any]]:
                async with httpx.AsyncClient() as client:
                    response = await client.get(
                        f"https://api.github.com/repos/{repo_info.owner}/{repo_info.repo}/branches/{branch_name}",
                        headers={
                            "Authorization": f"token {token}",
                            "Accept": "application/vnd.github.v3+json",
                            "User-Agent": "Iraqi-AI-Agent/1.0",
                        },
                    )

                    if response.status_code == 200:
                        result = response.json()
                        logger.info(f"✅ Retrieved branch info for '{branch_name}'")
                        return result

                    logger.error(
                        f"❌ Failed to get branch info: {response.status_code} - {response.text}"
                    )
                    return None

            return await self.with_github_retry(
                get_branch_operation,
                installation_token,
                f"Failed to get branch info for '{branch_name}'",
                installation_id=repo_info.installation_id,
            )

        except Exception as e:
            logger.error(f"❌ Failed to get branch info: {str(e)}")
            return None

    # Helper methods

    async def _enhance_content_with_validation(
        self,
        content: str,
        cultural_validation: CulturalValidationResult,
        arabic_result: Optional[ArabicProcessingResult],
    ) -> str:
        """Enhance content with validation results."""
        enhanced_content = content

        # Add cultural validation details
        validation_section = f"""
{self.IRAQI_CULTURAL_VALIDATION_TAG}
{json.dumps(asdict(cultural_validation), indent=2, ensure_ascii=False)}
{self.IRAQI_CULTURAL_VALIDATION_CLOSE_TAG}
"""

        enhanced_content += validation_section

        # Add Arabic processing results if available
        if arabic_result:
            arabic_section = f"""
{self.IRAQI_ARABIC_PROCESSING_TAG}
{json.dumps(asdict(arabic_result), indent=2, ensure_ascii=False)}
{self.IRAQI_ARABIC_PROCESSING_CLOSE_TAG}
"""
            enhanced_content += arabic_section

        return enhanced_content

    async def _enhance_comment_with_validation(
        self,
        comment: str,
        cultural_validation: CulturalValidationResult,
        arabic_result: Optional[ArabicProcessingResult],
    ) -> str:
        """Enhance comment with validation footer."""
        enhanced_comment = comment

        # Add compact validation footer
        footer_parts = [
            f"🇮🇶 **Iraqi AI**: Cultural Compliance {cultural_validation.compliance_score:.1%}"
        ]

        if cultural_validation.islamic_compliance < 1.0:
            footer_parts.append(
                f"☪️ Islamic Compliance {cultural_validation.islamic_compliance:.1%}"
            )

        if arabic_result and arabic_result.rtl_accuracy < 1.0:
            footer_parts.append(f"🔤 RTL Accuracy {arabic_result.rtl_accuracy:.1%}")

        footer = "\n\n---\n" + " | ".join(footer_parts)
        enhanced_comment += footer

        return enhanced_comment

    async def _extract_iraqi_task_plan_from_content(
        self, content: str
    ) -> Optional[IraqiTaskPlan]:
        """Extract Iraqi task plan from issue content."""
        if (
            self.IRAQI_TASK_OPEN_TAG not in content
            or self.IRAQI_TASK_CLOSE_TAG not in content
        ):
            return None

        try:
            task_plan_str = (
                content.split(self.IRAQI_TASK_OPEN_TAG)[1]
                .split(self.IRAQI_TASK_CLOSE_TAG)[0]
                .strip()
            )
            task_plan_data = json.loads(task_plan_str)

            # Convert dict to IraqiTaskPlan
            cultural_validation_data = task_plan_data.get("cultural_validation", {})
            cultural_validation = CulturalValidationResult(**cultural_validation_data)

            arabic_processing_data = task_plan_data.get("language_processing")
            language_processing = None
            if arabic_processing_data:
                language_processing = ArabicProcessingResult(**arabic_processing_data)

            professional_domain = None
            if task_plan_data.get("professional_domain"):
                professional_domain = ProfessionalDomain(
                    task_plan_data["professional_domain"]
                )

            task_plan = IraqiTaskPlan(
                tasks=task_plan_data["tasks"],
                active_task_index=task_plan_data["active_task_index"],
                cultural_validation=cultural_validation,
                language_processing=language_processing,
                professional_domain=professional_domain,
                islamic_compliance_verified=task_plan_data.get(
                    "islamic_compliance_verified", False
                ),
                created_timestamp=task_plan_data["created_timestamp"],
                last_updated=task_plan_data["last_updated"],
            )

            logger.info("✅ Successfully extracted Iraqi task plan from content")
            return task_plan

        except Exception as e:
            logger.error(f"❌ Failed to extract Iraqi task plan: {str(e)}")
            return None

    async def _insert_iraqi_task_plan_to_body(
        self, body: str, task_plan: IraqiTaskPlan
    ) -> str:
        """Insert Iraqi task plan into issue body."""
        task_plan_json = json.dumps(asdict(task_plan), indent=2, ensure_ascii=False)
        wrapped_plan = (
            f"{self.IRAQI_TASK_OPEN_TAG}\n{task_plan_json}\n{self.IRAQI_TASK_CLOSE_TAG}"
        )

        if (
            self.IRAQI_TASK_OPEN_TAG not in body
            and self.IRAQI_TASK_CLOSE_TAG not in body
        ):
            # Add new task plan
            return f"{body}\n\n<details>\n<summary>🇮🇶 Iraqi AI Task Plan</summary>\n\n{wrapped_plan}\n\n</details>"
        else:
            # Replace existing task plan
            content_before = body.split(self.IRAQI_TASK_OPEN_TAG)[0]
            content_after = (
                body.split(self.IRAQI_TASK_CLOSE_TAG)[1]
                if self.IRAQI_TASK_CLOSE_TAG in body
                else ""
            )
            return f"{content_before}{wrapped_plan}{content_after}"

    async def _add_iraqi_ai_label(
        self, token: str, repo_info: GitHubRepositoryInfo, pr_number: int
    ) -> None:
        """Add Iraqi AI label to pull request."""
        try:
            async with httpx.AsyncClient() as client:
                await client.post(
                    f"https://api.github.com/repos/{repo_info.owner}/{repo_info.repo}/issues/{pr_number}/labels",
                    headers={
                        "Authorization": f"token {token}",
                        "Accept": "application/vnd.github.v3+json",
                        "User-Agent": "Iraqi-AI-Agent/1.0",
                    },
                    json={
                        "labels": ["iraqi-ai", "cultural-validated", "arabic-processed"]
                    },
                )
                logger.info(f"✅ Added Iraqi AI labels to PR #{pr_number}")
        except Exception as e:
            logger.warning(f"⚠️ Failed to add Iraqi AI labels: {str(e)}")


# Usage example and configuration
class IraqiGitHubConfig:
    """Configuration for Iraqi GitHub integration."""

    @staticmethod
    def create_default_config() -> Dict[str, Any]:
        """Create default configuration for Iraqi projects."""
        return {
            "cultural_validation_level": CulturalValidationLevel.STANDARD.value,
            "supported_languages": [
                IraqiLanguageType.ARABIC.value,
                IraqiLanguageType.ENGLISH.value,
                IraqiLanguageType.MIXED.value,
            ],
            "professional_domains": [
                ProfessionalDomain.TECHNICAL.value,
                ProfessionalDomain.BUSINESS.value,
            ],
            "islamic_compliance_required": True,
            "rtl_accuracy_threshold": 0.99,
            "dialect_recognition_threshold": 0.85,
            "cultural_compliance_threshold": 0.95,
        }

    @staticmethod
    def create_government_config() -> Dict[str, Any]:
        """Create configuration for Iraqi government projects."""
        config = IraqiGitHubConfig.create_default_config()
        config.update(
            {
                "cultural_validation_level": CulturalValidationLevel.GOVERNMENT.value,
                "professional_domains": [ProfessionalDomain.GOVERNMENT.value],
                "cultural_compliance_threshold": 0.98,
            }
        )
        return config

    @staticmethod
    def create_medical_config() -> Dict[str, Any]:
        """Create configuration for Iraqi medical projects."""
        config = IraqiGitHubConfig.create_default_config()
        config.update(
            {
                "cultural_validation_level": CulturalValidationLevel.PROFESSIONAL.value,
                "professional_domains": [ProfessionalDomain.MEDICAL.value],
                "cultural_compliance_threshold": 0.97,
            }
        )
        return config


async def main():
    """Example usage of Iraqi GitHub Integration."""
    # Configuration
    app_id = "your_github_app_id"
    private_key = "your_private_key"
    encryption_key = "your_encryption_key"

    # Initialize Iraqi GitHub integration
    github_integration = IraqiGitHubIntegration(
        app_id=app_id,
        private_key=private_key,
        encryption_key=encryption_key,
        cultural_validation_level=CulturalValidationLevel.STANDARD,
    )

    # Repository information
    repo_info = GitHubRepositoryInfo(
        owner="iraqi-organization",
        repo="iraqi-project",
        installation_id="12345",
        cultural_validation_level=CulturalValidationLevel.STANDARD,
        supported_languages=[IraqiLanguageType.ARABIC, IraqiLanguageType.ENGLISH],
        professional_domains=[ProfessionalDomain.TECHNICAL],
    )

    # Example: Create culturally compliant pull request
    pr_result = await github_integration.create_culturally_compliant_pull_request(
        repo_info=repo_info,
        head_branch="feature/iraqi-enhancement",
        title="تحسين النظام العراقي - Iraqi System Enhancement",
        body="هذا تحسين للنظام يتوافق مع القيم الإسلامية والثقافة العراقية\n\nThis enhancement complies with Islamic values and Iraqi culture.",
        professional_domain=ProfessionalDomain.TECHNICAL,
    )

    if pr_result:
        print(f"✅ Successfully created PR: {pr_result['html_url']}")
    else:
        print("❌ Failed to create PR")

    # Example: Get issue with Iraqi task plan
    issue, task_plan = await github_integration.get_issue_with_iraqi_task_plan(
        repo_info=repo_info, issue_number=1
    )

    if task_plan:
        print(f"✅ Found Iraqi task plan with {len(task_plan.tasks)} tasks")
        print(
            f"Cultural compliance: {task_plan.cultural_validation.compliance_score:.1%}"
        )

    # Example: Create culturally validated comment
    comment_result = await github_integration.create_issue_comment_with_cultural_validation(
        repo_info=repo_info,
        issue_number=1,
        comment_body="تم مراجعة المتطلبات بنجاح وهي متوافقة مع المعايير العراقية\n\nRequirements reviewed successfully and comply with Iraqi standards.",
        professional_domain=ProfessionalDomain.TECHNICAL,
    )

    if comment_result:
        print("✅ Successfully created culturally validated comment")


if __name__ == "__main__":
    asyncio.run(main())
