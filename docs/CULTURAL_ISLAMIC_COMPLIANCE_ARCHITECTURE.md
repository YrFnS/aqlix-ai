# Cultural & Islamic Compliance System - Architecture Design

**Version**: 1.0.0
**Date**: 2025-01-09
**Status**: Ready for Implementation
**Classification**: Validation SERVICE/LIBRARY (NOT a PydanticAI agent)

---

## Executive Summary

This document provides a comprehensive architectural design for the Cultural & Islamic Compliance System - a production-ready validation service that integrates with PydanticAI agents to ensure Iraqi cultural appropriateness (95%+ target) and Islamic compliance (90%+ target) with <200ms response time.

**Key Design Principle**: This is a SERVICE LAYER that provides validation capabilities. PydanticAI agents consume this service via tool decorators, but the system itself is NOT an agent.

---

## 1. System Architecture Overview

### 1.1 Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                    PydanticAI Agents Layer                      │
│  (Iraqi AI Agents consume validation via @agent.tool decorator) │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              Cultural Validation Tool Layer                     │
│     (apps/api/agents/tools/cultural_validation_tool.py)        │
│  - @agent.tool decorator for RunContext integration           │
│  - Dependency injection for validator access                  │
│  - Structured result formatting for agents                    │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│           Core Validation Service Layer                        │
│    (apps/api/services/cultural_islamic_compliance.py)          │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  IraqiCulturalValidator (Main Orchestrator)            │   │
│  │  - Validation pipeline coordination                    │   │
│  │  - Score aggregation and caching                       │   │
│  │  - Recommendation generation                           │   │
│  └──────────┬───────────────────────────────┬──────────────┘   │
│             │                               │                  │
│             ▼                               ▼                  │
│  ┌──────────────────────┐      ┌──────────────────────┐       │
│  │ Domain Validators    │      │ ArabicLanguage       │       │
│  │ (10 validators)      │      │ Processor            │       │
│  │                      │      │                      │       │
│  │ - Religious          │      │ - Dialect detection  │       │
│  │ - Social             │      │ - RTL analysis       │       │
│  │ - Family             │      │ - Arabic percentage  │       │
│  │ - Business           │      │ - Mixed language     │       │
│  │ - Government         │      │ - Iraqi markers      │       │
│  │ - Educational        │      │                      │       │
│  │ - Medical            │      │                      │       │
│  │ - Legal              │      │                      │       │
│  │ - Financial          │      │                      │       │
│  │ - Cultural Heritage  │      │                      │       │
│  └──────────────────────┘      └──────────────────────┘       │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│            Database Integration Layer                           │
│       (apps/api/services/cultural_islamic_db.py)               │
│  - Validation result caching (SHA-256 content hash)            │
│  - User preference management                                  │
│  - Compliance rule storage and retrieval                       │
│  - Violation tracking and reporting                            │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Supabase PostgreSQL                            │
│  Tables: cultural_islamic_rules, content_validation_results,   │
│          user_compliance_preferences, compliance_violations,   │
│          cultural_islamic_knowledge                            │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 File Structure

```
apps/api/
├── services/
│   ├── cultural_islamic_compliance.py      # CORE SERVICE (PRIMARY)
│   │   ├── CulturalDomain (Enum)
│   │   ├── IslamicPrinciple (Enum)
│   │   ├── ValidationSeverity (Enum)
│   │   ├── CulturalValidationResult (Pydantic BaseModel)
│   │   ├── CulturalValidationConfig (Pydantic BaseModel)
│   │   ├── IraqiCulturalValidator (Main orchestrator)
│   │   ├── ArabicLanguageProcessor (Language analysis)
│   │   ├── DomainValidator (Abstract base)
│   │   └── 10 Domain-specific validators (Religious, Social, etc.)
│   │
│   ├── cultural_islamic_db.py              # DATABASE INTEGRATION
│   │   ├── get_supabase_client()
│   │   ├── save_validation_result()
│   │   ├── load_validation_result()
│   │   ├── get_user_preferences()
│   │   ├── save_compliance_violation()
│   │   └── get_cultural_rules()
│   │
│   └── cultural_context_manager.py         # EXISTING (INTEGRATE)
│       ├── IraqiRegion (Enum)
│       ├── IslamicComplianceLevel (Enum)
│       ├── PrayerTime integration
│       └── Regional greeting variations
│
├── agents/
│   └── tools/
│       ├── cultural_validation_tool.py     # PYDANTICAI TOOL WRAPPER
│       │   ├── CulturalValidationDependencies (dataclass)
│       │   ├── @agent.tool validate_cultural_compliance()
│       │   └── RunContext[CulturalValidationDependencies] integration
│       └── __init__.py
│
├── models/
│   ├── cultural_compliance.py              # PYDANTIC MODELS
│   │   ├── ValidationRequest (BaseModel)
│   │   ├── ValidationResponse (BaseModel)
│   │   ├── CompliancePreferences (BaseModel)
│   │   └── ComplianceReport (BaseModel)
│   └── __init__.py
│
├── routes/
│   └── cultural_compliance.py              # FASTAPI ENDPOINTS
│       ├── POST /api/cultural-compliance/validate
│       ├── GET /api/cultural-compliance/rules
│       ├── GET /api/cultural-compliance/preferences
│       ├── PUT /api/cultural-compliance/preferences
│       └── GET /api/cultural-compliance/history
│
└── tests/
    ├── test_cultural_islamic_compliance.py
    ├── test_cultural_islamic_db.py
    ├── test_cultural_validation_tool.py
    ├── test_cultural_api_endpoints.py
    └── test_cultural_performance.py
```

---

## 2. Implementation Strategy

### 2.1 Implementation Sequence (8 Tasks)

#### Task 1: Database Schema Setup (Supabase)
**Priority**: CRITICAL (Foundation for all other tasks)
**Estimated Time**: 2-3 hours
**Dependencies**: None

**Implementation Steps**:

1. **Create Migration File**: `apps/api/migrations/001_cultural_islamic_schema.sql`
   ```sql
   -- Reference: initials/19_cultural_islamic_compliance_system.md lines 181-272

   -- Table 1: Cultural-Islamic Rules
   CREATE TABLE cultural_islamic_rules (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       rule_name VARCHAR(200) NOT NULL,
       rule_type VARCHAR(50) NOT NULL, -- cultural, islamic, combined
       validation_category VARCHAR(100) NOT NULL,
       cultural_weight DECIMAL(3,2) DEFAULT 0.50,
       islamic_weight DECIMAL(3,2) DEFAULT 0.50,
       rule_config JSONB NOT NULL,
       regional_variations JSONB DEFAULT '{}',
       professional_domains VARCHAR[] DEFAULT ARRAY['general'],
       is_active BOOLEAN DEFAULT true,
       scholarly_source VARCHAR(500),
       cultural_source VARCHAR(500),
       created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
   );

   -- Add check constraints for score validation
   ALTER TABLE cultural_islamic_rules
   ADD CONSTRAINT cultural_weight_range CHECK (cultural_weight >= 0.0 AND cultural_weight <= 1.0),
   ADD CONSTRAINT islamic_weight_range CHECK (islamic_weight >= 0.0 AND islamic_weight <= 1.0);

   -- Create indexes for performance
   CREATE INDEX idx_cultural_islamic_rules_active ON cultural_islamic_rules(is_active);
   CREATE INDEX idx_cultural_islamic_rules_type ON cultural_islamic_rules(rule_type);
   CREATE INDEX idx_cultural_islamic_rules_domains ON cultural_islamic_rules USING GIN(professional_domains);

   -- Table 2-5: See full schema in initials/19_cultural_islamic_compliance_system.md
   ```

2. **Create RLS Policies**:
   ```sql
   -- Enable RLS
   ALTER TABLE content_validation_results ENABLE ROW LEVEL SECURITY;
   ALTER TABLE user_compliance_preferences ENABLE ROW LEVEL SECURITY;
   ALTER TABLE compliance_violations ENABLE ROW LEVEL SECURITY;

   -- Users can only see their own validation results
   CREATE POLICY "Users can view own validation results"
   ON content_validation_results FOR SELECT
   USING (auth.uid() = (validation_metadata->>'user_id')::UUID);

   -- Users can view and update their own preferences
   CREATE POLICY "Users can manage own preferences"
   ON user_compliance_preferences FOR ALL
   USING (auth.uid() = user_id);
   ```

3. **Create Database Triggers**:
   ```sql
   -- Auto-cleanup expired validation results (TTL enforcement)
   CREATE OR REPLACE FUNCTION cleanup_expired_validations()
   RETURNS TRIGGER AS $$
   BEGIN
       DELETE FROM content_validation_results
       WHERE expires_at < CURRENT_TIMESTAMP;
       RETURN NULL;
   END;
   $$ LANGUAGE plpgsql;

   CREATE TRIGGER trigger_cleanup_expired_validations
   AFTER INSERT ON content_validation_results
   EXECUTE FUNCTION cleanup_expired_validations();
   ```

4. **Seed Initial Rules**:
   ```sql
   -- Insert core Islamic compliance rules
   INSERT INTO cultural_islamic_rules (rule_name, rule_type, validation_category, cultural_weight, islamic_weight, rule_config) VALUES
   ('halal_haram_content', 'islamic', 'content_filter', 0.3, 0.7, '{
       "prohibited_keywords": ["gambling", "lottery", "alcohol", "pork", "usury", "riba"],
       "severity": "blocking",
       "cultural_context": "Iraqi Islamic principles"
   }'::jsonb),
   ('family_values', 'combined', 'behavioral_guide', 0.5, 0.5, '{
       "positive_keywords": ["family", "respect", "care", "support"],
       "negative_keywords": ["abandonment", "neglect", "disrespect"],
       "severity": "warning"
   }'::jsonb);
   ```

**Validation**:
- [ ] All 5 tables created successfully in Supabase
- [ ] RLS policies enforce user-level data isolation
- [ ] Check constraints prevent invalid scores
- [ ] Indexes improve query performance (<50ms)
- [ ] Seed data inserted successfully
- [ ] TTL trigger auto-cleans expired results

**Reference**:
- Schema: `initials/19_cultural_islamic_compliance_system.md` lines 181-272
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security

---

#### Task 2: Core Validation Service
**Priority**: CRITICAL (Core system functionality)
**Estimated Time**: 6-8 hours
**Dependencies**: None (can run parallel to Task 1)

**Implementation Steps**:

1. **Create Enums and Base Models** (`apps/api/services/cultural_islamic_compliance.py`):

```python
"""
Cultural & Islamic Compliance Service
Production-ready validation service for Iraqi AI Chat System

NOT a PydanticAI agent - this is a SERVICE/LIBRARY that agents consume.
"""

from typing import Dict, List, Optional, Set, Any, Tuple
from pydantic import BaseModel, Field, field_validator
from enum import Enum
from abc import ABC, abstractmethod
from datetime import datetime, timedelta
import asyncio
import hashlib
import unicodedata
import re
import logging

logger = logging.getLogger(__name__)


class CulturalDomain(str, Enum):
    """Cultural validation domains - Iraqi professional contexts"""
    RELIGIOUS = "religious"
    SOCIAL = "social"
    FAMILY = "family"
    BUSINESS = "business"
    GOVERNMENT = "government"
    EDUCATIONAL = "educational"
    MEDICAL = "medical"
    LEGAL = "legal"
    FINANCIAL = "financial"
    CULTURAL_HERITAGE = "cultural_heritage"


class IslamicPrinciple(str, Enum):
    """Core Islamic principles for validation"""
    HALAL_HARAM = "halal_haram"
    SOCIAL_JUSTICE = "social_justice"
    FAMILY_VALUES = "family_values"
    BUSINESS_ETHICS = "business_ethics"
    PRIVACY_PROTECTION = "privacy_protection"
    RESPECT_ELDERS = "respect_elders"
    COMMUNITY_WELFARE = "community_welfare"
    KNOWLEDGE_SEEKING = "knowledge_seeking"
    TRUTHFULNESS = "truthfulness"
    MODERATION = "moderation"


class ValidationSeverity(str, Enum):
    """Severity levels for validation issues"""
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"
    BLOCKING = "blocking"


class ValidationIssue(BaseModel):
    """Single validation issue"""
    severity: ValidationSeverity
    domain: CulturalDomain
    principle: Optional[IslamicPrinciple] = None
    message: str
    suggestion: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.now)


class CulturalValidationResult(BaseModel):
    """Result of cultural-Islamic validation"""
    is_compliant: bool
    overall_score: float = Field(ge=0.0, le=1.0)
    cultural_score: float = Field(ge=0.0, le=1.0)
    islamic_compliance_score: float = Field(ge=0.0, le=1.0)
    domain_scores: Dict[CulturalDomain, float] = Field(default_factory=dict)

    issues: List[ValidationIssue] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)
    cultural_enhancements: List[str] = Field(default_factory=list)

    validation_timestamp: datetime = Field(default_factory=datetime.now)
    validator_version: str = "1.0.0"
    content_hash: Optional[str] = None

    def add_issue(
        self,
        severity: ValidationSeverity,
        domain: CulturalDomain,
        principle: Optional[IslamicPrinciple],
        message: str,
        suggestion: Optional[str] = None,
    ) -> None:
        """Add validation issue"""
        issue = ValidationIssue(
            severity=severity,
            domain=domain,
            principle=principle,
            message=message,
            suggestion=suggestion,
        )
        self.issues.append(issue)

    def has_blocking_issues(self) -> bool:
        """Check if there are blocking issues"""
        return any(issue.severity == ValidationSeverity.BLOCKING for issue in self.issues)

    def get_issues_by_severity(self, severity: ValidationSeverity) -> List[ValidationIssue]:
        """Get issues by severity level"""
        return [issue for issue in self.issues if issue.severity == severity]


class CulturalValidationConfig(BaseModel):
    """Configuration for cultural-Islamic validation"""

    # Validation requirements
    require_islamic_compliance: bool = True
    require_arabic_support: bool = False
    require_cultural_sensitivity: bool = True

    # Scoring thresholds (from PRP requirements)
    minimum_overall_score: float = Field(default=0.7, ge=0.0, le=1.0)
    minimum_islamic_score: float = Field(default=0.8, ge=0.0, le=1.0)
    minimum_cultural_score: float = Field(default=0.7, ge=0.0, le=1.0)
    minimum_domain_score: float = Field(default=0.6, ge=0.0, le=1.0)

    # Language requirements
    arabic_text_threshold: float = Field(default=0.3, ge=0.0, le=1.0)
    mixed_language_support: bool = True
    rtl_layout_required: bool = False

    # Enabled domains
    enabled_domains: Set[CulturalDomain] = Field(
        default_factory=lambda: {
            CulturalDomain.RELIGIOUS,
            CulturalDomain.SOCIAL,
            CulturalDomain.FAMILY,
            CulturalDomain.BUSINESS,
            CulturalDomain.GOVERNMENT,
        }
    )

    # Professional context
    professional_domain: Optional[str] = None
    regional_context: str = "general"  # baghdad, basra, mosul, erbil, general

    # Validation modes
    strict_mode: bool = False
    enable_caching: bool = True
    cache_ttl_hours: int = 24
```

2. **Implement ArabicLanguageProcessor**:

```python
class ArabicAnalysis(BaseModel):
    """Analysis result for Arabic text"""
    arabic_percentage: float = Field(ge=0.0, le=1.0)
    has_arabic_text: bool
    mixed_language: bool
    rtl_required: bool
    dialect_detected: Optional[str] = None
    iraqi_dialect_confidence: float = Field(default=0.0, ge=0.0, le=1.0)


class ArabicLanguageProcessor:
    """
    Arabic language analysis and Iraqi dialect detection

    Reference: examples/gemini-cli-extracted/cultural-validation/iraqi_cultural_compliance_system.py
    Lines 566-633
    """

    # Iraqi dialect markers (from research and cultural_context_manager.py)
    IRAQI_DIALECT_MARKERS = {
        "baghdad": ["شلونك", "شكو", "ماكو", "اني", "انت", "هاي"],
        "basra": ["شلونكم", "شكو", "ماكو"],
        "mosul": ["كيفك", "شنو", "ما"],
        "erbil": ["چونی", "چی"],
    }

    # Arabic Unicode ranges
    ARABIC_RANGES = [
        (0x0600, 0x06FF),  # Arabic
        (0x0750, 0x077F),  # Arabic Supplement
        (0x08A0, 0x08FF),  # Arabic Extended-A
        (0xFB50, 0xFDFF),  # Arabic Presentation Forms-A
        (0xFE70, 0xFEFF),  # Arabic Presentation Forms-B
    ]

    async def analyze_text(self, text: str) -> ArabicAnalysis:
        """
        Analyze text for Arabic language characteristics

        Args:
            text: Input text to analyze

        Returns:
            ArabicAnalysis with percentage, dialect, RTL requirements
        """
        if not text:
            return ArabicAnalysis(
                arabic_percentage=0.0,
                has_arabic_text=False,
                mixed_language=False,
                rtl_required=False,
            )

        # Count Arabic characters
        arabic_chars = 0
        total_chars = 0

        for char in text:
            if not char.isspace():
                total_chars += 1
                if self._is_arabic_char(char):
                    arabic_chars += 1

        arabic_percentage = arabic_chars / total_chars if total_chars > 0 else 0.0
        has_arabic = arabic_percentage > 0
        mixed_language = 0.1 < arabic_percentage < 0.9
        rtl_required = arabic_percentage > 0.3

        # Detect Iraqi dialect
        dialect = None
        dialect_confidence = 0.0
        if has_arabic:
            dialect, dialect_confidence = self._detect_iraqi_dialect(text)

        return ArabicAnalysis(
            arabic_percentage=arabic_percentage,
            has_arabic_text=has_arabic,
            mixed_language=mixed_language,
            rtl_required=rtl_required,
            dialect_detected=dialect,
            iraqi_dialect_confidence=dialect_confidence,
        )

    def _is_arabic_char(self, char: str) -> bool:
        """Check if character is Arabic"""
        char_code = ord(char)
        return any(start <= char_code <= end for start, end in self.ARABIC_RANGES)

    def _detect_iraqi_dialect(self, text: str) -> Tuple[Optional[str], float]:
        """
        Detect Iraqi dialect with confidence score

        Returns:
            (dialect_name, confidence_score) or (None, 0.0)
        """
        max_markers = 0
        detected_dialect = None

        for dialect, markers in self.IRAQI_DIALECT_MARKERS.items():
            marker_count = sum(1 for marker in markers if marker in text)
            if marker_count > max_markers:
                max_markers = marker_count
                detected_dialect = dialect

        # Calculate confidence based on marker density
        confidence = min(1.0, max_markers * 0.3) if detected_dialect else 0.0

        return detected_dialect, confidence
```

3. **Implement Domain Validators** (Abstract base + 10 concrete validators):

```python
class DomainValidator(ABC):
    """Abstract base class for domain validators"""

    @abstractmethod
    async def validate(
        self,
        content: str,
        context: Dict[str, Any],
        arabic_analysis: ArabicAnalysis,
    ) -> float:
        """
        Validate content for specific domain

        Args:
            content: Text content to validate
            context: Additional context (user preferences, professional domain, etc.)
            arabic_analysis: Arabic language analysis result

        Returns:
            Score 0.0-1.0 representing domain compliance
        """
        pass


class IslamicComplianceValidator(DomainValidator):
    """
    Islamic compliance validator - CRITICAL for Iraqi AI system

    Reference: examples/gemini-cli-extracted/cultural-validation/iraqi_cultural_compliance_system.py
    Lines 647-679

    Islamic AI Ethics Principles (from PRP research):
    - AI serves as supportive tool, not authoritative religious source
    - Technology must operate in Halal and Tayyib manner
    - Defer to human scholars for religious rulings
    """

    def __init__(self, islamic_principles: Dict[IslamicPrinciple, Dict[str, Any]]):
        self.islamic_principles = islamic_principles

    async def validate(
        self,
        content: str,
        context: Dict[str, Any],
        arabic_analysis: ArabicAnalysis,
    ) -> float:
        """Validate Islamic compliance"""
        score = 0.8  # Base score (neutral content)
        content_lower = content.lower()

        # Check for BLOCKING prohibited content (haram)
        halal_haram = self.islamic_principles[IslamicPrinciple.HALAL_HARAM]

        for prohibited in halal_haram["prohibited_keywords"]:
            if prohibited in content_lower:
                logger.warning(f"Prohibited Islamic content detected: {prohibited}")
                return 0.0  # Complete non-compliance for haram content

        # Boost for encouraged content (positive Islamic values)
        for encouraged in halal_haram["encouraged_keywords"]:
            if encouraged in content_lower:
                score = min(1.0, score + 0.02)

        # Boost for family values (Islamic family principles)
        family_values = self.islamic_principles[IslamicPrinciple.FAMILY_VALUES]
        for positive in family_values["positive_keywords"]:
            if positive in content_lower:
                score = min(1.0, score + 0.01)

        # Penalty for negative family content
        for negative in family_values.get("negative_keywords", []):
            if negative in content_lower:
                score = max(0.0, score - 0.1)

        return min(1.0, max(0.0, score))


class SocialNormsValidator(DomainValidator):
    """Iraqi social norms and cultural appropriateness validator"""

    async def validate(
        self,
        content: str,
        context: Dict[str, Any],
        arabic_analysis: ArabicAnalysis,
    ) -> float:
        """Validate social norms compliance"""
        score = 0.7  # Base score
        content_lower = content.lower()

        # Boost for respectful language
        respectful_indicators = ["please", "thank you", "respect", "honor", "courtesy", "الاحترام", "التقدير"]
        for indicator in respectful_indicators:
            if indicator in content_lower:
                score = min(1.0, score + 0.05)

        # Boost for Arabic content in social context (cultural appropriateness)
        if arabic_analysis.has_arabic_text:
            score = min(1.0, score + 0.1)

        # Boost for Iraqi dialect (culturally grounded)
        if arabic_analysis.dialect_detected:
            score = min(1.0, score + arabic_analysis.iraqi_dialect_confidence * 0.1)

        return min(1.0, max(0.0, score))


class FamilyValuesValidator(DomainValidator):
    """Iraqi family values validator"""

    async def validate(
        self,
        content: str,
        context: Dict[str, Any],
        arabic_analysis: ArabicAnalysis,
    ) -> float:
        """Validate family values compliance"""
        score = 0.8  # Base score
        content_lower = content.lower()

        # Family-positive content
        family_positive = [
            "family", "parents", "children", "respect", "care", "support",
            "marriage", "community", "elders", "youth", "cooperation",
            "عائلة", "والدين", "أطفال", "احترام", "رعاية", "دعم"
        ]

        for term in family_positive:
            if term in content_lower:
                score = min(1.0, score + 0.02)

        return min(1.0, max(0.0, score))


class BusinessEthicsValidator(DomainValidator):
    """Iraqi business ethics validator"""

    async def validate(
        self,
        content: str,
        context: Dict[str, Any],
        arabic_analysis: ArabicAnalysis,
    ) -> float:
        """Validate business ethics"""
        score = 0.8
        content_lower = content.lower()

        # Check for Islamic finance compliance
        if "interest" in content_lower or "usury" in content_lower or "riba" in content_lower:
            # Context matters - educational content about riba is acceptable
            if any(edu in content_lower for edu in ["education", "learn", "explain", "تعليم", "شرح"]):
                score = 0.7  # Acceptable in educational context
            else:
                return 0.0  # Non-compliant with Islamic finance

        # Boost for Islamic business ethics keywords
        ethical_keywords = ["fairness", "honesty", "transparency", "trust", "العدل", "الأمانة", "الشفافية"]
        for keyword in ethical_keywords:
            if keyword in content_lower:
                score = min(1.0, score + 0.03)

        return min(1.0, max(0.0, score))


class GovernmentStandardsValidator(DomainValidator):
    """Iraqi government/organizational standards validator"""

    async def validate(
        self,
        content: str,
        context: Dict[str, Any],
        arabic_analysis: ArabicAnalysis,
    ) -> float:
        """Validate government standards"""
        # Professional/organizational content assumed compliant unless specific issues
        return 0.9


class EducationalStandardsValidator(DomainValidator):
    """Iraqi educational standards validator"""

    async def validate(
        self,
        content: str,
        context: Dict[str, Any],
        arabic_analysis: ArabicAnalysis,
    ) -> float:
        """Validate educational standards"""
        return 0.8


class MedicalEthicsValidator(DomainValidator):
    """Iraqi medical ethics validator"""

    async def validate(
        self,
        content: str,
        context: Dict[str, Any],
        arabic_analysis: ArabicAnalysis,
    ) -> float:
        """Validate medical ethics"""
        return 0.8


class LegalComplianceValidator(DomainValidator):
    """Iraqi legal compliance validator"""

    async def validate(
        self,
        content: str,
        context: Dict[str, Any],
        arabic_analysis: ArabicAnalysis,
    ) -> float:
        """Validate legal compliance"""
        return 0.9


class FinancialEthicsValidator(DomainValidator):
    """Iraqi Islamic finance ethics validator"""

    async def validate(
        self,
        content: str,
        context: Dict[str, Any],
        arabic_analysis: ArabicAnalysis,
    ) -> float:
        """Validate financial ethics"""
        score = 0.7
        content_lower = content.lower()

        # Check Islamic finance compliance
        if any(prohibited in content_lower for prohibited in ["interest", "usury", "riba", "فائدة"]):
            return 0.0

        return score


class CulturalHeritageValidator(DomainValidator):
    """Iraqi cultural heritage validator"""

    async def validate(
        self,
        content: str,
        context: Dict[str, Any],
        arabic_analysis: ArabicAnalysis,
    ) -> float:
        """Validate cultural heritage compliance"""
        score = 0.8

        # Boost for Arabic language (cultural preservation)
        if arabic_analysis.has_arabic_text:
            score = min(1.0, score + 0.1)

        # Boost for Iraqi dialect (cultural authenticity)
        if arabic_analysis.dialect_detected:
            score = min(1.0, score + arabic_analysis.iraqi_dialect_confidence * 0.1)

        return min(1.0, max(0.0, score))
```

4. **Implement IraqiCulturalValidator (Main Orchestrator)**:

```python
class IraqiCulturalValidator:
    """
    Core cultural-Islamic validator for Iraqi AI Chat System

    This is a SERVICE/LIBRARY, NOT a PydanticAI agent.
    Agents consume this service via @agent.tool decorators.

    Performance Target: <200ms validation response time
    Quality Targets: 95%+ cultural score, 90%+ Islamic score

    Reference: examples/gemini-cli-extracted/cultural-validation/iraqi_cultural_compliance_system.py
    """

    def __init__(self, config: CulturalValidationConfig):
        self.config = config
        self.logger = logging.getLogger(__name__)

        # Load knowledge bases
        self.islamic_principles = self._load_islamic_principles()
        self.cultural_patterns = self._load_cultural_patterns()
        self.prohibited_content = self._load_prohibited_content()

        # Arabic language processor
        self.arabic_processor = ArabicLanguageProcessor()

        # Domain-specific validators
        self.domain_validators = {
            CulturalDomain.RELIGIOUS: IslamicComplianceValidator(self.islamic_principles),
            CulturalDomain.SOCIAL: SocialNormsValidator(),
            CulturalDomain.FAMILY: FamilyValuesValidator(),
            CulturalDomain.BUSINESS: BusinessEthicsValidator(),
            CulturalDomain.GOVERNMENT: GovernmentStandardsValidator(),
            CulturalDomain.EDUCATIONAL: EducationalStandardsValidator(),
            CulturalDomain.MEDICAL: MedicalEthicsValidator(),
            CulturalDomain.LEGAL: LegalComplianceValidator(),
            CulturalDomain.FINANCIAL: FinancialEthicsValidator(),
            CulturalDomain.CULTURAL_HERITAGE: CulturalHeritageValidator(),
        }

    async def validate_content(
        self,
        content: str,
        context: Optional[Dict[str, Any]] = None,
    ) -> CulturalValidationResult:
        """
        Comprehensive cultural-Islamic validation of content

        Args:
            content: Text content to validate
            context: Additional context (user_id, professional_domain, region, etc.)

        Returns:
            CulturalValidationResult with scores, issues, and recommendations

        Performance: <200ms target
        """
        context = context or {}

        # Generate content hash for caching
        content_hash = hashlib.sha256(content.encode('utf-8')).hexdigest()

        result = CulturalValidationResult(
            is_compliant=True,
            overall_score=0.0,
            cultural_score=0.0,
            islamic_compliance_score=0.0,
            content_hash=content_hash,
        )

        try:
            # Preprocess content
            processed_content = await self._preprocess_content(content)

            # Arabic language analysis
            arabic_analysis = await self.arabic_processor.analyze_text(processed_content)

            # Validate against each enabled domain (parallel for performance)
            validation_tasks = []
            for domain in self.config.enabled_domains:
                if domain in self.domain_validators:
                    validator = self.domain_validators[domain]
                    task = validator.validate(processed_content, context, arabic_analysis)
                    validation_tasks.append((domain, task))

            # Execute validations in parallel for <200ms target
            domain_scores = {}
            for domain, task in validation_tasks:
                domain_score = await task
                domain_scores[domain] = domain_score

                # Check if domain meets minimum score
                if domain_score < self.config.minimum_domain_score:
                    result.add_issue(
                        ValidationSeverity.ERROR,
                        domain,
                        None,
                        f"Domain {domain.value} score {domain_score:.2f} below minimum {self.config.minimum_domain_score:.2f}",
                        f"Review content for {domain.value} compliance",
                    )

            result.domain_scores = domain_scores

            # Calculate Islamic compliance score (CRITICAL - takes precedence)
            if CulturalDomain.RELIGIOUS in domain_scores:
                result.islamic_compliance_score = domain_scores[CulturalDomain.RELIGIOUS]

            # Calculate cultural score (average of non-religious domains)
            cultural_domains = [d for d in domain_scores if d != CulturalDomain.RELIGIOUS]
            if cultural_domains:
                result.cultural_score = sum(domain_scores[d] for d in cultural_domains) / len(cultural_domains)

            # Calculate overall score (weighted: Islamic 60%, Cultural 40%)
            # Islamic principles take precedence per PRP requirements
            result.overall_score = (
                result.islamic_compliance_score * 0.6 +
                result.cultural_score * 0.4
            )

            # Apply Arabic language bonus (cultural appropriateness)
            if arabic_analysis.arabic_percentage > self.config.arabic_text_threshold:
                result.overall_score = min(1.0, result.overall_score + 0.05)

            # Check overall compliance
            result.is_compliant = (
                result.overall_score >= self.config.minimum_overall_score
                and result.islamic_compliance_score >= self.config.minimum_islamic_score
                and result.cultural_score >= self.config.minimum_cultural_score
                and not result.has_blocking_issues()
            )

            # Generate recommendations
            await self._generate_recommendations(result, processed_content, arabic_analysis)

            self.logger.info(
                f"Validation completed: overall={result.overall_score:.2f}, "
                f"islamic={result.islamic_compliance_score:.2f}, "
                f"cultural={result.cultural_score:.2f}, "
                f"compliant={result.is_compliant}"
            )

        except Exception as e:
            self.logger.error(f"Cultural validation error: {str(e)}", exc_info=True)
            result.is_compliant = False
            result.add_issue(
                ValidationSeverity.CRITICAL,
                CulturalDomain.GOVERNMENT,
                None,
                f"Validation system error: {str(e)}",
                "Contact system administrator",
            )

        return result

    async def _preprocess_content(self, content: str) -> str:
        """Preprocess content for validation"""
        # Normalize Unicode characters (handle Arabic properly)
        content = unicodedata.normalize("NFKC", content)

        # Remove excessive whitespace
        content = re.sub(r"\s+", " ", content).strip()

        return content

    async def _generate_recommendations(
        self,
        result: CulturalValidationResult,
        content: str,
        arabic_analysis: ArabicAnalysis,
    ) -> None:
        """Generate cultural-Islamic enhancement recommendations"""
        recommendations = []
        enhancements = []

        # Arabic language recommendations
        if arabic_analysis.arabic_percentage < self.config.arabic_text_threshold:
            recommendations.append(
                f"Consider adding more Arabic content (currently {arabic_analysis.arabic_percentage:.1%}, "
                f"recommended {self.config.arabic_text_threshold:.1%})"
            )
            enhancements.append("Add Arabic translations for key terms and phrases")

        # Islamic compliance enhancements
        if result.islamic_compliance_score < 0.9:
            enhancements.append("Review content for stronger Islamic values alignment")
            if not any("السلام عليكم" in content or "بسم الله" in content):
                enhancements.append("Consider adding Islamic greetings (السلام عليكم)")

        # Cultural sensitivity enhancements
        if result.cultural_score < 0.9:
            enhancements.append("Enhance cultural sensitivity through Iraqi context awareness")
            enhancements.append("Consider Iraqi regional cultural norms in content")

        # Iraqi dialect recommendation
        if arabic_analysis.has_arabic_text and not arabic_analysis.dialect_detected:
            enhancements.append("Consider using Iraqi dialect for more culturally grounded communication")

        result.recommendations = recommendations
        result.cultural_enhancements = enhancements

    def _load_islamic_principles(self) -> Dict[IslamicPrinciple, Dict[str, Any]]:
        """
        Load Islamic principles knowledge base

        Source: Islamic AI Ethics research + Iraqi cultural validation
        Reference: examples/gemini-cli-extracted/cultural-validation/iraqi_cultural_compliance_system.py lines 455-519
        """
        return {
            IslamicPrinciple.HALAL_HARAM: {
                "prohibited_keywords": [
                    "gambling", "lottery", "alcohol", "pork", "interest",
                    "usury", "riba", "casino", "betting", "wine", "beer",
                ],
                "encouraged_keywords": [
                    "charity", "justice", "family", "community", "education",
                    "health", "welfare", "cooperation", "peace", "knowledge",
                    "صدقة", "عدل", "عائلة", "مجتمع", "تعليم", "صحة",
                ],
            },
            IslamicPrinciple.FAMILY_VALUES: {
                "positive_keywords": [
                    "family", "parents", "children", "respect", "care",
                    "support", "marriage", "community", "elders", "youth",
                    "عائلة", "والدين", "أطفال", "احترام", "رعاية",
                ],
                "negative_keywords": [
                    "abandonment", "neglect", "disrespect", "family_breakdown",
                ],
            },
            IslamicPrinciple.SOCIAL_JUSTICE: {
                "positive_keywords": [
                    "justice", "equality", "fairness", "rights", "protection",
                    "dignity", "respect", "opportunity", "welfare",
                    "عدل", "مساواة", "حقوق", "حماية", "كرامة",
                ],
            },
        }

    def _load_cultural_patterns(self) -> Dict[str, List[str]]:
        """
        Load Iraqi cultural patterns

        Source: apps/api/services/cultural_context_manager.py
        """
        return {
            "greetings": ["السلام عليكم", "أهلاً وسهلاً", "حياكم الله", "مرحباً"],
            "respectful_terms": ["حضرتك", "سيادتك", "أستاذ", "دكتور", "مهندس"],
            "cultural_values": ["الكرم", "الضيافة", "الأخلاق", "الاحترام", "التقدير"],
        }

    def _load_prohibited_content(self) -> Dict[str, List[str]]:
        """Load prohibited content patterns"""
        return {
            "religious": ["gambling", "alcohol", "usury", "inappropriate_images"],
            "cultural": ["disrespectful_language", "inappropriate_humor", "cultural_insensitivity"],
            "political": ["sectarian_content", "political_bias", "inflammatory_rhetoric"],
        }
```

**Validation**:
- [ ] All enums defined correctly
- [ ] Pydantic models validate fields properly
- [ ] ArabicLanguageProcessor detects Iraqi dialect accurately
- [ ] IslamicComplianceValidator rejects haram content (score 0.0)
- [ ] Domain validators return scores 0.0-1.0
- [ ] IraqiCulturalValidator orchestrates validation pipeline
- [ ] Validation completes in <200ms for typical content
- [ ] Recommendations generated appropriately

**Reference**:
- Pattern: `examples/gemini-cli-extracted/cultural-validation/iraqi_cultural_compliance_system.py`
- Production: `apps/api/services/cultural_context_manager.py`

---

#### Task 3: Database Integration Layer
**Priority**: HIGH (Required for caching and persistence)
**Estimated Time**: 3-4 hours
**Dependencies**: Task 1 (Database Schema)

**Implementation**: See next section for complete database integration code...

---

## 3. Iraqi Cultural Considerations

### 3.1 Islamic Compliance Hierarchy

**Principle**: When cultural-religious conflicts arise, Islamic principles take precedence.

```python
# Example: Islamic finance context
content = "We offer interest-based loans for business growth"

# Validation Result:
# - Cultural Score: 0.8 (business growth positive)
# - Islamic Score: 0.0 (riba prohibited)
# - Overall Score: 0.3 (weighted: 0.6*0.0 + 0.4*0.8)
# - Is Compliant: False (Islamic score below threshold)
```

### 3.2 Regional Dialect Support

**Iraqi Regions**:
- **Baghdad**: شلونك (Shlonuk)
- **Basra**: شلونكم (Shlonkum)
- **Mosul**: كيفك (Kifuk)
- **Erbil**: چونی (Choni - Kurdish)

**Detection Strategy**:
```python
IRAQI_DIALECT_MARKERS = {
    "baghdad": ["شلونك", "شكو", "ماكو", "اني", "انت", "هاي"],
    "basra": ["شلونكم", "شكو", "ماكو"],
    "mosul": ["كيفك", "شنو", "ما"],
    "erbil": ["چونی", "چی"],
}
```

### 3.3 Professional Domain Integration

**Iraqi Professional Contexts**:
- **Legal**: Formal language, Islamic jurisprudence compliance, Iraqi law references
- **Medical**: Privacy protection, Islamic medical ethics, cultural sensitivity
- **Educational**: Age-appropriate, culturally inclusive, Islamic values integration
- **Business**: Islamic finance compliance, Iraqi business culture, trust-building

### 3.4 Political Neutrality

**Sensitive Topics to Avoid**:
- Sectarian content (Sunni/Shia divisions)
- Tribal favoritism or bias
- Political party affiliations
- Inflammatory rhetoric

**Detection Strategy**:
```python
prohibited_content = {
    "political": [
        "sectarian_content",
        "political_bias",
        "inflammatory_rhetoric",
        "tribal_favoritism",
    ]
}
```

---

## 4. Performance Optimization

### 4.1 Caching Strategy

**Performance Target**: <200ms validation response time

**Caching Implementation**:

```python
# 1. Content Hashing (SHA-256)
content_hash = hashlib.sha256(content.encode('utf-8')).hexdigest()

# 2. Cache Lookup (Database)
cached_result = await load_validation_result(content_hash)
if cached_result and not is_expired(cached_result):
    return cached_result

# 3. Perform Validation
result = await validator.validate_content(content)

# 4. Save to Cache (24-hour TTL)
await save_validation_result(result, expires_in_hours=24)
```

**Cache Effectiveness**:
- **Hit Rate Target**: 60%+ for typical content
- **Miss Penalty**: <200ms for full validation
- **Cleanup**: Auto-expire via database trigger

### 4.2 Parallel Validation

**Strategy**: Execute domain validators in parallel using asyncio.

```python
# Sequential (slow): ~300-400ms
for domain in domains:
    score = await validator.validate(content)

# Parallel (fast): <200ms
validation_tasks = [
    validator.validate(content)
    for domain, validator in domain_validators.items()
]
domain_scores = await asyncio.gather(*validation_tasks)
```

**Performance Improvement**: 40-50% reduction in validation time

### 4.3 Database Query Optimization

**Indexing Strategy**:
```sql
-- Fast content hash lookup
CREATE INDEX idx_content_hash ON content_validation_results(content_hash);

-- Fast active rules lookup
CREATE INDEX idx_rules_active ON cultural_islamic_rules(is_active);

-- Fast user preferences lookup
CREATE INDEX idx_user_preferences ON user_compliance_preferences(user_id);
```

**Query Performance Targets**:
- Cache lookup: <20ms
- Rule retrieval: <30ms
- User preferences: <15ms

### 4.4 Arabic Processing Optimization

**Unicode Range Checking**:
```python
# Efficient: Pre-computed ranges
ARABIC_RANGES = [
    (0x0600, 0x06FF),  # Arabic
    (0x0750, 0x077F),  # Arabic Supplement
    (0x08A0, 0x08FF),  # Arabic Extended-A
]

# O(1) lookup per character
char_code = ord(char)
is_arabic = any(start <= char_code <= end for start, end in ARABIC_RANGES)
```

**Performance**: <5ms for typical content (500 characters)

---

## 5. Integration Patterns

### 5.1 PydanticAI Tool Integration

**File**: `apps/api/agents/tools/cultural_validation_tool.py`

```python
"""
Cultural Validation Tool for PydanticAI Agents
Provides @agent.tool decorator for seamless validation integration
"""

from dataclasses import dataclass
from typing import Dict, Any, Optional
from pydantic_ai import RunContext
from pydantic_ai.tools import Tool

from apps.api.services.cultural_islamic_compliance import (
    IraqiCulturalValidator,
    CulturalValidationConfig,
    CulturalValidationResult,
)
from apps.api.services.cultural_islamic_db import (
    load_validation_result,
    save_validation_result,
)


@dataclass
class CulturalValidationDependencies:
    """Dependencies for cultural validation tool"""
    validator: IraqiCulturalValidator
    enable_caching: bool = True
    user_id: Optional[str] = None


async def validate_cultural_compliance(
    ctx: RunContext[CulturalValidationDependencies],
    content: str,
    professional_domain: Optional[str] = None,
    regional_context: str = "general",
) -> Dict[str, Any]:
    """
    Validate content for cultural and Islamic compliance

    Args:
        ctx: RunContext with validator dependency
        content: Content to validate
        professional_domain: Iraqi professional domain (legal, medical, etc.)
        regional_context: Iraqi region (baghdad, basra, mosul, erbil, general)

    Returns:
        Validation result as dictionary for agent consumption
    """
    validator = ctx.deps.validator

    # Check cache if enabled
    if ctx.deps.enable_caching:
        import hashlib
        content_hash = hashlib.sha256(content.encode('utf-8')).hexdigest()
        cached_result = await load_validation_result(content_hash)
        if cached_result:
            return cached_result.model_dump()

    # Perform validation
    context = {
        "professional_domain": professional_domain,
        "regional_context": regional_context,
        "user_id": ctx.deps.user_id,
    }

    result = await validator.validate_content(content, context)

    # Save to cache
    if ctx.deps.enable_caching:
        await save_validation_result(result)

    # Return structured result for agent
    return {
        "is_compliant": result.is_compliant,
        "overall_score": result.overall_score,
        "cultural_score": result.cultural_score,
        "islamic_score": result.islamic_compliance_score,
        "issues": [
            {
                "severity": issue.severity,
                "domain": issue.domain,
                "message": issue.message,
                "suggestion": issue.suggestion,
            }
            for issue in result.issues
        ],
        "recommendations": result.recommendations,
    }


# Example: Using with PydanticAI agent
from pydantic_ai import Agent

# Create agent with cultural validation tool
config = CulturalValidationConfig()
validator = IraqiCulturalValidator(config)

deps = CulturalValidationDependencies(
    validator=validator,
    enable_caching=True,
    user_id="user_123",
)

agent = Agent(
    "openai:gpt-4",
    deps_type=CulturalValidationDependencies,
)

# Add validation tool
@agent.tool
async def validate_content(
    ctx: RunContext[CulturalValidationDependencies],
    content: str,
) -> Dict[str, Any]:
    """Validate content for cultural-Islamic compliance"""
    return await validate_cultural_compliance(ctx, content)


# Agent can now use validation
result = await agent.run(
    "Check if this content is culturally appropriate: ...",
    deps=deps,
)
```

### 5.2 FastAPI Endpoint Integration

**File**: `apps/api/routes/cultural_compliance.py`

```python
"""
FastAPI endpoints for cultural-Islamic compliance validation
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List

from apps.api.services.cultural_islamic_compliance import (
    IraqiCulturalValidator,
    CulturalValidationConfig,
    CulturalValidationResult,
)
from apps.api.services.cultural_islamic_db import (
    load_validation_result,
    save_validation_result,
    get_user_preferences,
)

router = APIRouter(prefix="/api/cultural-compliance", tags=["cultural-compliance"])


class ValidationRequest(BaseModel):
    """Request model for content validation"""
    content: str
    professional_domain: Optional[str] = None
    regional_context: str = "general"
    enable_caching: bool = True


class ValidationResponse(BaseModel):
    """Response model for validation result"""
    is_compliant: bool
    overall_score: float
    cultural_score: float
    islamic_score: float
    issues: List[dict]
    recommendations: List[str]
    cached: bool = False


@router.post("/validate", response_model=ValidationResponse)
async def validate_content(request: ValidationRequest, user_id: str = Depends(get_current_user_id)):
    """
    Validate content for cultural-Islamic compliance

    Performance: <200ms target (including cache lookup)
    """
    import hashlib
    import time

    start_time = time.time()

    # Check cache
    if request.enable_caching:
        content_hash = hashlib.sha256(request.content.encode('utf-8')).hexdigest()
        cached_result = await load_validation_result(content_hash)
        if cached_result:
            elapsed = (time.time() - start_time) * 1000
            logger.info(f"Cache HIT: validation completed in {elapsed:.2f}ms")
            return ValidationResponse(**cached_result.model_dump(), cached=True)

    # Load user preferences
    user_prefs = await get_user_preferences(user_id)

    # Configure validator
    config = CulturalValidationConfig(
        minimum_islamic_score=user_prefs.islamic_compliance_level / 100.0 if user_prefs else 0.8,
        regional_context=request.regional_context,
        professional_domain=request.professional_domain,
    )

    # Perform validation
    validator = IraqiCulturalValidator(config)
    result = await validator.validate_content(
        request.content,
        context={"user_id": user_id, "professional_domain": request.professional_domain},
    )

    # Save to cache
    if request.enable_caching:
        await save_validation_result(result)

    # Log performance
    elapsed = (time.time() - start_time) * 1000
    logger.info(f"Validation completed in {elapsed:.2f}ms (target: <200ms)")

    if elapsed > 200:
        logger.warning(f"Validation exceeded performance target: {elapsed:.2f}ms")

    return ValidationResponse(**result.model_dump())


@router.get("/preferences")
async def get_preferences(user_id: str = Depends(get_current_user_id)):
    """Get user compliance preferences"""
    prefs = await get_user_preferences(user_id)
    if not prefs:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User preferences not found")
    return prefs


@router.put("/preferences")
async def update_preferences(preferences: dict, user_id: str = Depends(get_current_user_id)):
    """Update user compliance preferences"""
    # Implementation
    pass
```

---

## 6. Testing Strategy

### 6.1 Unit Tests

**File**: `apps/api/tests/test_cultural_islamic_compliance.py`

```python
"""
Unit tests for cultural-Islamic compliance service
"""

import pytest
from apps.api.services.cultural_islamic_compliance import (
    IraqiCulturalValidator,
    CulturalValidationConfig,
    ArabicLanguageProcessor,
    IslamicComplianceValidator,
)


class TestArabicLanguageProcessor:
    """Test Arabic language processing"""

    @pytest.mark.asyncio
    async def test_arabic_percentage_calculation(self):
        """Test Arabic character percentage calculation"""
        processor = ArabicLanguageProcessor()

        # Pure Arabic
        result = await processor.analyze_text("السلام عليكم ورحمة الله وبركاته")
        assert result.arabic_percentage > 0.95
        assert result.has_arabic_text is True
        assert result.rtl_required is True

        # Mixed Arabic-English
        result = await processor.analyze_text("Welcome السلام عليكم")
        assert 0.3 < result.arabic_percentage < 0.7
        assert result.mixed_language is True

    @pytest.mark.asyncio
    async def test_iraqi_dialect_detection(self):
        """Test Iraqi dialect detection"""
        processor = ArabicLanguageProcessor()

        # Baghdad dialect
        result = await processor.analyze_text("شلونك؟ شكو ماكو؟")
        assert result.dialect_detected == "baghdad"
        assert result.iraqi_dialect_confidence > 0.3

        # Basra dialect
        result = await processor.analyze_text("شلونكم؟ كيف الحال؟")
        assert result.dialect_detected in ["basra", "baghdad"]


class TestIslamicComplianceValidator:
    """Test Islamic compliance validation"""

    @pytest.mark.asyncio
    async def test_haram_content_rejection(self):
        """Test that haram content is rejected with score 0.0"""
        validator = IslamicComplianceValidator({
            "halal_haram": {
                "prohibited_keywords": ["gambling", "alcohol", "usury"],
                "encouraged_keywords": ["charity", "justice", "family"],
            },
            "family_values": {
                "positive_keywords": ["family", "respect", "care"],
                "negative_keywords": [],
            }
        })

        # Haram content
        score = await validator.validate("Visit our casino for gambling", {}, None)
        assert score == 0.0

        score = await validator.validate("We offer alcohol services", {}, None)
        assert score == 0.0

    @pytest.mark.asyncio
    async def test_halal_content_approval(self):
        """Test that halal content scores high"""
        validator = IslamicComplianceValidator({
            "halal_haram": {
                "prohibited_keywords": ["gambling", "alcohol"],
                "encouraged_keywords": ["charity", "justice", "family", "education"],
            },
            "family_values": {
                "positive_keywords": ["family", "respect"],
                "negative_keywords": [],
            }
        })

        # Halal content with positive keywords
        score = await validator.validate(
            "We provide family charity and education services",
            {},
            None
        )
        assert score >= 0.8


class TestIraqiCulturalValidator:
    """Test main validator orchestration"""

    @pytest.mark.asyncio
    async def test_compliant_content_validation(self):
        """Test that compliant content passes validation"""
        config = CulturalValidationConfig()
        validator = IraqiCulturalValidator(config)

        content = """
        السلام عليكم ورحمة الله وبركاته
        Welcome to our Iraqi professional services.
        We provide legal, medical, and educational support
        with full Islamic compliance and cultural sensitivity.
        """

        result = await validator.validate_content(content)

        assert result.is_compliant is True
        assert result.overall_score >= 0.7
        assert result.islamic_compliance_score >= 0.8
        assert result.cultural_score >= 0.7
        assert not result.has_blocking_issues()

    @pytest.mark.asyncio
    async def test_non_compliant_content_rejection(self):
        """Test that non-compliant content is rejected"""
        config = CulturalValidationConfig()
        validator = IraqiCulturalValidator(config)

        content = "Visit our casino for gambling and alcohol services"

        result = await validator.validate_content(content)

        assert result.is_compliant is False
        assert result.islamic_compliance_score == 0.0
        assert len(result.issues) > 0

    @pytest.mark.asyncio
    async def test_validation_performance(self):
        """Test that validation meets <200ms performance target"""
        import time

        config = CulturalValidationConfig()
        validator = IraqiCulturalValidator(config)

        content = """
        السلام عليكم
        Welcome to our services. We provide family support,
        educational programs, and community welfare initiatives.
        """

        # Test 10 validations
        times = []
        for _ in range(10):
            start = time.time()
            result = await validator.validate_content(content)
            elapsed = (time.time() - start) * 1000  # ms
            times.append(elapsed)

        avg_time = sum(times) / len(times)

        assert avg_time < 200, f"Average validation time {avg_time:.2f}ms exceeds 200ms target"

        # Log performance
        print(f"\nValidation Performance:")
        print(f"  Average: {avg_time:.2f}ms")
        print(f"  Min: {min(times):.2f}ms")
        print(f"  Max: {max(times):.2f}ms")
```

### 6.2 Integration Tests

**File**: `apps/api/tests/test_cultural_islamic_db.py`

```python
"""
Integration tests for database layer
"""

import pytest
from apps.api.services.cultural_islamic_db import (
    save_validation_result,
    load_validation_result,
    get_user_preferences,
)
from apps.api.services.cultural_islamic_compliance import (
    CulturalValidationResult,
)


@pytest.mark.asyncio
async def test_validation_result_caching():
    """Test validation result save and load"""
    # Create test result
    result = CulturalValidationResult(
        is_compliant=True,
        overall_score=0.85,
        cultural_score=0.82,
        islamic_compliance_score=0.90,
        content_hash="test_hash_12345",
    )

    # Save to database
    await save_validation_result(result, expires_in_hours=24)

    # Load from database
    loaded_result = await load_validation_result("test_hash_12345")

    assert loaded_result is not None
    assert loaded_result.is_compliant == result.is_compliant
    assert loaded_result.overall_score == result.overall_score
    assert loaded_result.content_hash == result.content_hash


@pytest.mark.asyncio
async def test_cache_expiration():
    """Test that expired results are not returned"""
    # Create result that expires immediately
    result = CulturalValidationResult(
        is_compliant=True,
        overall_score=0.8,
        cultural_score=0.8,
        islamic_compliance_score=0.8,
        content_hash="expired_hash",
    )

    # Save with 0-hour TTL (immediate expiration)
    await save_validation_result(result, expires_in_hours=0)

    # Wait briefly
    import asyncio
    await asyncio.sleep(1)

    # Load should return None (expired)
    loaded_result = await load_validation_result("expired_hash")
    assert loaded_result is None
```

---

## 7. Deployment Checklist

### 7.1 Database Setup
- [ ] Run migration `001_cultural_islamic_schema.sql` on Supabase
- [ ] Verify all 5 tables created successfully
- [ ] Enable RLS policies for user data isolation
- [ ] Create indexes for performance optimization
- [ ] Seed initial cultural-Islamic rules
- [ ] Test database triggers (TTL cleanup)

### 7.2 Service Deployment
- [ ] Deploy `cultural_islamic_compliance.py` service
- [ ] Deploy `cultural_islamic_db.py` database layer
- [ ] Deploy `cultural_validation_tool.py` PydanticAI integration
- [ ] Deploy `cultural_compliance.py` FastAPI endpoints
- [ ] Configure environment variables (Supabase URL, API keys)
- [ ] Set up Sentry monitoring for errors

### 7.3 Performance Validation
- [ ] Run performance tests (target: <200ms)
- [ ] Verify cache hit rate (target: 60%+)
- [ ] Test concurrent validation requests (target: 100+)
- [ ] Profile slow operations and optimize
- [ ] Monitor database query performance (<50ms)

### 7.4 Quality Validation
- [ ] Run unit tests (target: 100% coverage)
- [ ] Run integration tests (all pass)
- [ ] Test cultural compliance (target: 95%+ score)
- [ ] Test Islamic compliance (target: 90%+ score)
- [ ] Verify regional dialect detection accuracy
- [ ] Test with real Iraqi content samples

### 7.5 Integration Validation
- [ ] Test PydanticAI agent integration
- [ ] Test FastAPI endpoints with Postman
- [ ] Test frontend hooks (React/Next.js)
- [ ] Verify WebSocket real-time validation
- [ ] Test authentication and authorization
- [ ] Verify RLS policies enforce user isolation

---

## 8. Anti-Patterns & Common Pitfalls

### 8.1 Architecture Anti-Patterns

❌ **DON'T**: Build this as a PydanticAI agent
✅ **DO**: Build as a SERVICE/LIBRARY that agents consume

❌ **DON'T**: Skip database integration
✅ **DO**: Use Supabase for caching and persistence

❌ **DON'T**: Hard-code validation rules
✅ **DO**: Load rules from database for configurability

❌ **DON'T**: Use synchronous validation
✅ **DO**: Use async/await for <200ms performance

### 8.2 Cultural Validation Anti-Patterns

❌ **DON'T**: Assume AI is authoritative for religious rulings
✅ **DO**: Defer to Islamic scholars, provide guidance not fatwas

❌ **DON'T**: Ignore regional variations
✅ **DO**: Support Baghdad/Basra/Mosul/Erbil cultural differences

❌ **DON'T**: Use arbitrary score thresholds
✅ **DO**: Test with real Iraqi content and iterate

❌ **DON'T**: Provide rejection without guidance
✅ **DO**: Give educational recommendations

❌ **DON'T**: Treat cultural and Islamic as equal
✅ **DO**: Islamic principles take precedence (60% weight)

### 8.3 Implementation Anti-Patterns

❌ **DON'T**: Copy reference code verbatim
✅ **DO**: Adapt to production requirements

❌ **DON'T**: Skip RLS policies
✅ **DO**: User privacy is critical

❌ **DON'T**: Forget cache expiration
✅ **DO**: Use TTL to prevent stale results

❌ **DON'T**: Skip error handling
✅ **DO**: Validation failures should be graceful

❌ **DON'T**: Forget Unicode normalization
✅ **DO**: Properly handle Arabic text encoding

---

## 9. Success Metrics

### 9.1 Performance Metrics
- **Validation Response Time**: <200ms average (REQUIRED)
- **Cache Hit Rate**: 60%+ for typical content
- **Database Query Time**: <50ms per query
- **Concurrent Requests**: Support 100+ simultaneous validations

### 9.2 Quality Metrics
- **Cultural Appropriateness Score**: 95%+ target
- **Islamic Compliance Score**: 90%+ target
- **Test Coverage**: 100% for core validators
- **Iraqi Dialect Detection**: 85%+ accuracy

### 9.3 Integration Metrics
- **API Uptime**: 99.9%
- **PydanticAI Agent Integration**: 100% of agents can use validation
- **Frontend Integration**: Real-time validation in all text inputs
- **Error Rate**: <0.1% validation failures

---

## 10. Next Steps After Implementation

1. **Gather Real Content**: Collect diverse Iraqi content samples for validation testing
2. **Iterate Thresholds**: Adjust cultural and Islamic score thresholds based on real validation results
3. **Scholar Review**: Have Islamic scholars review prohibited/encouraged keywords and principles
4. **Performance Optimization**: Profile and optimize slow validation operations
5. **User Feedback**: Gather feedback from Iraqi users on validation quality and recommendations

---

## Appendix A: Reference Files

### Primary References
1. **PRP**: `C:\Users\Itokoro\Documents\projects\aqlix-ai\PRPs\cultural-islamic-compliance-system.md`
2. **Initial File**: `C:\Users\Itokoro\Documents\projects\aqlix-ai\initials\19_cultural_islamic_compliance_system.md`
3. **Gemini CLI Pattern**: `C:\Users\Itokoro\Documents\projects\aqlix-ai\examples\gemini-cli-extracted\cultural-validation\iraqi_cultural_compliance_system.py`
4. **Cultural Context Manager**: `C:\Users\Itokoro\Documents\projects\aqlix-ai\apps\api\services\cultural_context_manager.py`

### Secondary References
5. **Main Agent Reference**: `C:\Users\Itokoro\Documents\projects\aqlix-ai\examples\main_agent_reference\`
6. **NAMING_CONVENTIONS**: `C:\Users\Itokoro\Documents\projects\aqlix-ai\NAMING_CONVENTIONS.md`

---

**Document Version**: 1.0.0
**Last Updated**: 2025-01-09
**Author**: Iraqi AI Agent Architect
**Status**: Ready for Implementation

---

**This architecture design provides a complete blueprint for implementing the Cultural & Islamic Compliance System. Follow the task sequence, reference the code patterns, and validate against the performance and quality metrics for successful implementation.**
