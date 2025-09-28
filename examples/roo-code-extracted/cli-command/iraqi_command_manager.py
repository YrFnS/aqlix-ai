"""
Iraqi Enhanced CLI Command System

Sophisticated command management system based on Roo-Code patterns with comprehensive
Iraqi cultural integration, professional domain support, and Arabic language processing.

Key Features:
- Cultural command validation with Islamic compliance
- Professional domain-specific command sets (legal, medical, educational, government)
- Arabic language support with RTL command processing
- Iraqi government service integration
- Security-first command validation with threat detection
- Intelligent command completion and suggestion system
- Performance monitoring with cultural context awareness

Based on Roo-Code's command system patterns:
- src/services/command/commands.ts - Command discovery and loading
- webview-ui/src/utils/command-parser.ts - Command parsing and pattern extraction
- webview-ui/src/utils/command-validation.ts - Security validation and approval logic
- src/activate/registerCommands.ts - Command registration and lifecycle management
"""

import asyncio
import json
import logging
import os
import re
import time
from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple, Union, Callable, TypedDict
from abc import ABC, abstractmethod

import yaml
from datetime import datetime, timedelta


class ProfessionalDomain(Enum):
    """Iraqi professional domains with specialized command requirements"""

    LEGAL = "legal"  # Legal professionals, courts, law firms
    MEDICAL = "medical"  # Doctors, hospitals, medical institutions
    EDUCATIONAL = "educational"  # Universities, schools, educational institutions
    GOVERNMENT = "government"  # Government employees, ministries, public sector
    ENGINEERING = "engineering"  # Engineers, construction, technical professions
    BUSINESS = "business"  # Business professionals, commerce, trade
    BANKING = "banking"  # Financial sector, banks, financial institutions
    MEDIA = "media"  # Journalists, media companies, broadcasting
    AGRICULTURE = "agriculture"  # Farmers, agricultural sector, rural communities
    RELIGIOUS = "religious"  # Religious scholars, Islamic institutions
    SECURITY = "security"  # Security forces, defense, law enforcement
    GENERAL = "general"  # General users, mixed domains


class CommandSource(Enum):
    """Command source types following Roo-Code patterns"""

    GLOBAL = "global"  # System-wide commands
    PROJECT = "project"  # Project-specific commands
    USER = "user"  # User-defined commands
    CULTURAL = "cultural"  # Iraqi cultural commands


class CulturalCommandCategory(Enum):
    """Iraqi cultural command categories"""

    ISLAMIC = "islamic"  # Islamic-compliant commands
    FAMILY = "family"  # Family-oriented commands
    PROFESSIONAL = "professional"  # Professional domain commands
    GOVERNMENT = "government"  # Government service commands
    ARABIC = "arabic"  # Arabic language processing
    GENERAL = "general"  # General cultural commands


class CommandSecurityLevel(Enum):
    """Security levels for command validation"""

    SAFE = "safe"  # Always safe to execute
    REVIEW = "review"  # Requires cultural review
    RESTRICTED = "restricted"  # Limited access
    FORBIDDEN = "forbidden"  # Never allowed
    CULTURAL_REVIEW = "cultural_review"  # Requires Islamic/cultural validation


@dataclass
class CulturalValidationResult:
    """Result of cultural validation for commands"""

    is_compliant: bool
    compliance_score: float  # 0.0 to 1.0
    validation_reasons: List[str]
    cultural_category: CulturalCommandCategory
    professional_compatibility: Dict[ProfessionalDomain, bool]
    islamic_compliance: bool
    family_appropriateness: bool
    government_compatibility: bool
    requires_review: bool
    suggested_alternatives: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for serialization"""
        return {
            "is_compliant": self.is_compliant,
            "compliance_score": self.compliance_score,
            "validation_reasons": self.validation_reasons,
            "cultural_category": self.cultural_category.value,
            "professional_compatibility": {
                domain.value: compatible
                for domain, compatible in self.professional_compatibility.items()
            },
            "islamic_compliance": self.islamic_compliance,
            "family_appropriateness": self.family_appropriateness,
            "government_compatibility": self.government_compatibility,
            "requires_review": self.requires_review,
            "suggested_alternatives": self.suggested_alternatives,
        }


@dataclass
class CommandMetadata:
    """Enhanced command metadata with Iraqi cultural context"""

    name: str
    description: str
    description_arabic: Optional[str] = None
    argument_hint: Optional[str] = None
    argument_hint_arabic: Optional[str] = None
    source: CommandSource = CommandSource.GLOBAL
    file_path: Optional[str] = None
    professional_domains: Set[ProfessionalDomain] = field(default_factory=set)
    cultural_category: CulturalCommandCategory = CulturalCommandCategory.GENERAL
    security_level: CommandSecurityLevel = CommandSecurityLevel.SAFE
    requires_cultural_validation: bool = False
    is_arabic_compatible: bool = True
    is_rtl_aware: bool = False
    creation_time: datetime = field(default_factory=datetime.now)
    last_used: Optional[datetime] = None
    usage_count: int = 0
    cultural_validation: Optional[CulturalValidationResult] = None

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for serialization"""
        return {
            "name": self.name,
            "description": self.description,
            "description_arabic": self.description_arabic,
            "argument_hint": self.argument_hint,
            "argument_hint_arabic": self.argument_hint_arabic,
            "source": self.source.value,
            "file_path": self.file_path,
            "professional_domains": [
                domain.value for domain in self.professional_domains
            ],
            "cultural_category": self.cultural_category.value,
            "security_level": self.security_level.value,
            "requires_cultural_validation": self.requires_cultural_validation,
            "is_arabic_compatible": self.is_arabic_compatible,
            "is_rtl_aware": self.is_rtl_aware,
            "creation_time": self.creation_time.isoformat()
            if self.creation_time
            else None,
            "last_used": self.last_used.isoformat() if self.last_used else None,
            "usage_count": self.usage_count,
            "cultural_validation": self.cultural_validation.to_dict()
            if self.cultural_validation
            else None,
        }


@dataclass
class IraqiCommand:
    """Enhanced command with Iraqi cultural integration"""

    metadata: CommandMetadata
    content: str
    content_arabic: Optional[str] = None
    frontmatter: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for serialization"""
        return {
            "metadata": self.metadata.to_dict(),
            "content": self.content,
            "content_arabic": self.content_arabic,
            "frontmatter": self.frontmatter,
        }


class CommandParsingResult(TypedDict):
    """Result of command parsing operations"""

    patterns: List[str]
    base_command: str
    arguments: List[str]
    flags: List[str]
    has_subshells: bool
    security_risks: List[str]
    cultural_markers: List[str]
    professional_indicators: List[ProfessionalDomain]
    arabic_content: bool
    rtl_text: bool


class CommandDecision(Enum):
    """Command execution decision types"""

    AUTO_APPROVE = "auto_approve"
    AUTO_DENY = "auto_deny"
    ASK_USER = "ask_user"
    CULTURAL_REVIEW = "cultural_review"
    PROFESSIONAL_APPROVE = "professional_approve"


class IraqiCulturalValidator:
    """Advanced cultural validation for Iraqi commands"""

    def __init__(self):
        self.islamic_keywords = {
            # Islamic concepts
            "prayer",
            "salah",
            "quran",
            "hadith",
            "mosque",
            "imam",
            "allah",
            "prophet",
            "ramadan",
            "hajj",
            "umrah",
            "zakat",
            "sunnah",
            "dua",
            "wudu",
            "qibla",
            # Arabic equivalents
            "صلاة",
            "قرآن",
            "حديث",
            "مسجد",
            "إمام",
            "الله",
            "نبي",
            "رمضان",
            "حج",
            "عمرة",
            "زكاة",
            "سنة",
            "دعاء",
            "وضوء",
            "قبلة",
        }

        self.family_keywords = {
            # Family concepts
            "family",
            "mother",
            "father",
            "child",
            "parent",
            "spouse",
            "marriage",
            "wedding",
            "brother",
            "sister",
            "son",
            "daughter",
            "home",
            "household",
            "tradition",
            # Arabic equivalents
            "عائلة",
            "أم",
            "أب",
            "طفل",
            "والد",
            "زوج",
            "زواج",
            "عرس",
            "أخ",
            "أخت",
            "ابن",
            "ابنة",
            "بيت",
            "تقليد",
        }

        self.professional_markers = {
            ProfessionalDomain.LEGAL: {
                "court",
                "judge",
                "lawyer",
                "law",
                "legal",
                "justice",
                "attorney",
                "case",
                "trial",
                "محكمة",
                "قاضي",
                "محامي",
                "قانون",
                "قانوني",
                "عدالة",
                "قضية",
                "محاكمة",
            },
            ProfessionalDomain.MEDICAL: {
                "doctor",
                "patient",
                "hospital",
                "medicine",
                "treatment",
                "diagnosis",
                "health",
                "clinic",
                "طبيب",
                "مريض",
                "مستشفى",
                "دواء",
                "علاج",
                "تشخيص",
                "صحة",
                "عيادة",
            },
            ProfessionalDomain.EDUCATIONAL: {
                "school",
                "teacher",
                "student",
                "university",
                "education",
                "classroom",
                "lesson",
                "exam",
                "مدرسة",
                "معلم",
                "طالب",
                "جامعة",
                "تعليم",
                "صف",
                "درس",
                "امتحان",
            },
            ProfessionalDomain.GOVERNMENT: {
                "ministry",
                "government",
                "public",
                "service",
                "official",
                "department",
                "citizen",
                "permit",
                "وزارة",
                "حكومة",
                "عام",
                "خدمة",
                "رسمي",
                "دائرة",
                "مواطن",
                "تصريح",
            },
        }

        self.security_sensitive_patterns = {
            # System commands
            r"\b(rm|del|format|fdisk|mkfs)\b",
            r"\b(sudo|su|admin)\b",
            r"\b(passwd|password|credential)\b",
            # Network commands
            r"\b(curl|wget|ssh|scp|ftp)\b",
            # Process commands
            r"\b(kill|pkill|killall|terminate)\b",
            # File system
            r"\b(chmod|chown|mount|umount)\b",
        }

        # Load cultural configuration
        self.cultural_config = self._load_cultural_config()

    def _load_cultural_config(self) -> Dict[str, Any]:
        """Load cultural validation configuration"""
        default_config = {
            "islamic_compliance_required": True,
            "family_values_respect": True,
            "professional_ethics": True,
            "arabic_language_support": True,
            "government_service_integration": True,
            "cultural_sensitivity_level": "high",  # low, medium, high, strict
            "validation_strictness": 0.85,  # 0.0 to 1.0
            "require_professional_approval": {
                ProfessionalDomain.LEGAL.value: True,
                ProfessionalDomain.MEDICAL.value: True,
                ProfessionalDomain.GOVERNMENT.value: True,
                ProfessionalDomain.RELIGIOUS.value: True,
            },
        }
        return default_config

    def validate_command(
        self, command: str, metadata: CommandMetadata
    ) -> CulturalValidationResult:
        """Comprehensive cultural validation of command"""
        try:
            # Initialize validation scores
            islamic_score = self._validate_islamic_compliance(command, metadata)
            family_score = self._validate_family_appropriateness(command, metadata)
            professional_scores = self._validate_professional_domains(command, metadata)
            security_score = self._validate_security_requirements(command, metadata)
            arabic_score = self._validate_arabic_compatibility(command, metadata)

            # Calculate overall compliance score
            compliance_score = (
                islamic_score * 0.25
                + family_score * 0.20
                + sum(professional_scores.values()) / len(professional_scores) * 0.25
                + security_score * 0.20
                + arabic_score * 0.10
            )

            # Determine compliance status
            is_compliant = (
                compliance_score >= self.cultural_config["validation_strictness"]
            )

            # Generate validation reasons
            validation_reasons = []
            if islamic_score < 0.8:
                validation_reasons.append("Islamic compliance review required")
            if family_score < 0.8:
                validation_reasons.append("Family values compatibility needs review")
            if security_score < 0.7:
                validation_reasons.append("Security validation failed")
            if arabic_score < 0.6:
                validation_reasons.append("Arabic language support insufficient")

            # Determine cultural category
            cultural_category = self._determine_cultural_category(command, metadata)

            # Professional compatibility analysis
            professional_compatibility = {}
            for domain in ProfessionalDomain:
                domain_score = professional_scores.get(domain, 0.5)
                professional_compatibility[domain] = domain_score >= 0.7

            # Generate suggestions for improvement
            suggested_alternatives = self._generate_alternatives(
                command, metadata, compliance_score
            )

            return CulturalValidationResult(
                is_compliant=is_compliant,
                compliance_score=compliance_score,
                validation_reasons=validation_reasons,
                cultural_category=cultural_category,
                professional_compatibility=professional_compatibility,
                islamic_compliance=islamic_score >= 0.8,
                family_appropriateness=family_score >= 0.8,
                government_compatibility=professional_scores.get(
                    ProfessionalDomain.GOVERNMENT, 0.5
                )
                >= 0.7,
                requires_review=compliance_score < 0.9,
                suggested_alternatives=suggested_alternatives,
            )

        except Exception as e:
            logging.error(f"Cultural validation error: {e}")
            # Return conservative validation result on error
            return CulturalValidationResult(
                is_compliant=False,
                compliance_score=0.0,
                validation_reasons=[f"Validation error: {str(e)}"],
                cultural_category=CulturalCommandCategory.GENERAL,
                professional_compatibility={
                    domain: False for domain in ProfessionalDomain
                },
                islamic_compliance=False,
                family_appropriateness=False,
                government_compatibility=False,
                requires_review=True,
                suggested_alternatives=[],
            )

    def _validate_islamic_compliance(
        self, command: str, metadata: CommandMetadata
    ) -> float:
        """Validate Islamic compliance requirements"""
        command_lower = command.lower()

        # Check for Islamic content markers
        islamic_content = any(
            keyword in command_lower for keyword in self.islamic_keywords
        )

        # Check for potentially problematic content
        problematic_patterns = [
            r"\b(gambling|alcohol|pork|interest|riba)\b",
            r"\b(casino|lottery|bet|wine|beer)\b",
        ]

        has_problematic_content = any(
            re.search(pattern, command_lower, re.IGNORECASE)
            for pattern in problematic_patterns
        )

        if has_problematic_content:
            return 0.1  # Very low score for problematic content

        if islamic_content:
            return 1.0  # High score for Islamic content

        # Neutral content gets moderate score
        return 0.8

    def _validate_family_appropriateness(
        self, command: str, metadata: CommandMetadata
    ) -> float:
        """Validate family values and appropriateness"""
        command_lower = command.lower()

        # Check for family-friendly content
        family_content = any(
            keyword in command_lower for keyword in self.family_keywords
        )

        # Check for inappropriate content
        inappropriate_patterns = [
            r"\b(adult|explicit|mature)\b",
            r"\b(violence|harmful|dangerous)\b",
        ]

        has_inappropriate_content = any(
            re.search(pattern, command_lower, re.IGNORECASE)
            for pattern in inappropriate_patterns
        )

        if has_inappropriate_content:
            return 0.2

        if family_content:
            return 1.0

        return 0.8

    def _validate_professional_domains(
        self, command: str, metadata: CommandMetadata
    ) -> Dict[ProfessionalDomain, float]:
        """Validate professional domain compatibility"""
        command_lower = command.lower()
        domain_scores = {}

        for domain, keywords in self.professional_markers.items():
            # Check for domain-specific content
            domain_content = any(keyword in command_lower for keyword in keywords)

            if domain_content:
                # Higher score for explicit domain content
                domain_scores[domain] = 0.9
            elif domain in metadata.professional_domains:
                # Medium score for metadata-indicated domains
                domain_scores[domain] = 0.7
            else:
                # Default score for other domains
                domain_scores[domain] = 0.6

        return domain_scores

    def _validate_security_requirements(
        self, command: str, metadata: CommandMetadata
    ) -> float:
        """Validate security requirements"""
        # Check for security-sensitive patterns
        has_security_risk = any(
            re.search(pattern, command, re.IGNORECASE)
            for pattern in self.security_sensitive_patterns
        )

        if has_security_risk:
            if metadata.security_level == CommandSecurityLevel.FORBIDDEN:
                return 0.0
            elif metadata.security_level == CommandSecurityLevel.RESTRICTED:
                return 0.3
            else:
                return 0.5

        return 1.0

    def _validate_arabic_compatibility(
        self, command: str, metadata: CommandMetadata
    ) -> float:
        """Validate Arabic language compatibility"""
        # Check for Arabic text
        has_arabic = bool(re.search(r"[\u0600-\u06FF]", command))

        if has_arabic and not metadata.is_arabic_compatible:
            return 0.2

        if has_arabic and metadata.is_rtl_aware:
            return 1.0

        if metadata.is_arabic_compatible:
            return 0.8

        return 0.6

    def _determine_cultural_category(
        self, command: str, metadata: CommandMetadata
    ) -> CulturalCommandCategory:
        """Determine the primary cultural category"""
        command_lower = command.lower()

        # Check for Islamic content
        if any(keyword in command_lower for keyword in self.islamic_keywords):
            return CulturalCommandCategory.ISLAMIC

        # Check for family content
        if any(keyword in command_lower for keyword in self.family_keywords):
            return CulturalCommandCategory.FAMILY

        # Check for professional content
        for domain, keywords in self.professional_markers.items():
            if any(keyword in command_lower for keyword in keywords):
                return CulturalCommandCategory.PROFESSIONAL

        # Check for Arabic content
        if re.search(r"[\u0600-\u06FF]", command):
            return CulturalCommandCategory.ARABIC

        return CulturalCommandCategory.GENERAL

    def _generate_alternatives(
        self, command: str, metadata: CommandMetadata, score: float
    ) -> List[str]:
        """Generate culturally appropriate alternatives"""
        alternatives = []

        if score < 0.5:
            # Low score - suggest generic alternatives
            alternatives.extend(
                [
                    "Consider using a more culturally appropriate command",
                    "Review Islamic compliance requirements",
                    "Check professional domain guidelines",
                ]
            )
        elif score < 0.8:
            # Medium score - suggest specific improvements
            alternatives.extend(
                [
                    "Add Arabic language support",
                    "Include cultural context validation",
                    "Consider family-friendly alternatives",
                ]
            )

        return alternatives


class IraqiCommandParser:
    """Advanced command parsing with Arabic and cultural awareness"""

    def __init__(self):
        self.arabic_pattern = re.compile(r"[\u0600-\u06FF]")
        self.rtl_pattern = re.compile(r"[\u0590-\u08FF]")

        # Command separators (including Arabic punctuation)
        self.command_separators = {"|", "&&", "||", ";", "،", "؛"}

        # Security-sensitive patterns
        self.subshell_patterns = [
            r"\$\([^)]*\)",  # $() command substitution
            r"`[^`]*`",  # `` backtick substitution
            r"<\([^)]*\)",  # <() process substitution
            r">\([^)]*\)",  # >() process substitution
            r"\$\(\([^)]*\)\)",  # $(()) arithmetic expansion
            r"\$\[[^\]]*\]",  # $[] arithmetic expansion
            r"\([^)]*[;&|]+[^)]*\)",  # subshell grouping
        ]

    def parse_command(self, command: str) -> CommandParsingResult:
        """Parse command with cultural and security analysis"""
        try:
            # Basic parsing
            patterns = self._extract_command_patterns(command)
            base_command, arguments, flags = self._parse_command_structure(command)

            # Security analysis
            has_subshells = self._detect_subshells(command)
            security_risks = self._identify_security_risks(command)

            # Cultural analysis
            cultural_markers = self._identify_cultural_markers(command)
            professional_indicators = self._identify_professional_indicators(command)

            # Arabic analysis
            arabic_content = bool(self.arabic_pattern.search(command))
            rtl_text = bool(self.rtl_pattern.search(command))

            return CommandParsingResult(
                patterns=patterns,
                base_command=base_command,
                arguments=arguments,
                flags=flags,
                has_subshells=has_subshells,
                security_risks=security_risks,
                cultural_markers=cultural_markers,
                professional_indicators=professional_indicators,
                arabic_content=arabic_content,
                rtl_text=rtl_text,
            )

        except Exception as e:
            logging.error(f"Command parsing error: {e}")
            return CommandParsingResult(
                patterns=[],
                base_command="",
                arguments=[],
                flags=[],
                has_subshells=True,  # Conservative approach
                security_risks=[f"Parsing error: {str(e)}"],
                cultural_markers=[],
                professional_indicators=[],
                arabic_content=False,
                rtl_text=False,
            )

    def _extract_command_patterns(self, command: str) -> List[str]:
        """Extract command patterns following Roo-Code logic"""
        if not command or not command.strip():
            return []

        patterns = set()

        # Split by command separators
        parts = self._split_by_separators(command)

        for part in parts:
            part = part.strip()
            if not part:
                continue

            # Extract tokens
            tokens = self._tokenize_command(part)
            if not tokens:
                continue

            main_cmd = tokens[0]

            # Skip numeric commands
            if main_cmd.isdigit():
                continue

            patterns.add(main_cmd)

            # Extract up to 3 levels
            max_levels = min(len(tokens), 3)
            for i in range(1, max_levels):
                arg = tokens[i]

                # Stop at flags, paths, or special characters
                if (
                    arg.startswith("-")
                    or "/" in arg
                    or "\\" in arg
                    or "~" in arg
                    or ":" in arg
                    or "." in arg
                ):
                    break

                pattern = " ".join(tokens[: i + 1])
                patterns.add(pattern.strip())

        return sorted(list(patterns))

    def _parse_command_structure(
        self, command: str
    ) -> Tuple[str, List[str], List[str]]:
        """Parse command into base command, arguments, and flags"""
        tokens = self._tokenize_command(command)

        if not tokens:
            return "", [], []

        base_command = tokens[0]
        arguments = []
        flags = []

        for token in tokens[1:]:
            if token.startswith("-"):
                flags.append(token)
            else:
                arguments.append(token)

        return base_command, arguments, flags

    def _tokenize_command(self, command: str) -> List[str]:
        """Tokenize command respecting quotes and Arabic text"""
        tokens = []
        current_token = ""
        in_quotes = False
        quote_char = None

        i = 0
        while i < len(command):
            char = command[i]

            if char in ['"', "'", '"', '"'] and not in_quotes:
                in_quotes = True
                quote_char = char
                current_token += char
            elif char == quote_char and in_quotes:
                in_quotes = False
                current_token += char
                quote_char = None
            elif char.isspace() and not in_quotes:
                if current_token:
                    tokens.append(current_token)
                    current_token = ""
            else:
                current_token += char

            i += 1

        if current_token:
            tokens.append(current_token)

        return tokens

    def _split_by_separators(self, command: str) -> List[str]:
        """Split command by separators including Arabic punctuation"""
        parts = [command]

        for separator in self.command_separators:
            new_parts = []
            for part in parts:
                new_parts.extend(part.split(separator))
            parts = new_parts

        return [part.strip() for part in parts if part.strip()]

    def _detect_subshells(self, command: str) -> bool:
        """Detect subshell usage and command substitution"""
        return any(
            re.search(pattern, command, re.IGNORECASE)
            for pattern in self.subshell_patterns
        )

    def _identify_security_risks(self, command: str) -> List[str]:
        """Identify potential security risks"""
        risks = []

        if self._detect_subshells(command):
            risks.append("Contains subshell or command substitution")

        # Check for dangerous commands
        dangerous_patterns = [
            (r"\b(rm|del)\s+.*(-rf|/)", "Dangerous file deletion"),
            (r"\b(chmod|chown)\s+777", "Unsafe permission changes"),
            (r"\b(curl|wget).*\|\s*(sh|bash)", "Remote code execution risk"),
            (r"\bsudo\s+", "Requires elevated privileges"),
            (r"\b(kill|pkill).*-9", "Force process termination"),
        ]

        for pattern, risk_desc in dangerous_patterns:
            if re.search(pattern, command, re.IGNORECASE):
                risks.append(risk_desc)

        return risks

    def _identify_cultural_markers(self, command: str) -> List[str]:
        """Identify cultural markers in command"""
        markers = []

        # Check for Arabic text
        if self.arabic_pattern.search(command):
            markers.append("contains_arabic")

        # Check for RTL text
        if self.rtl_pattern.search(command):
            markers.append("rtl_text")

        # Check for Islamic terms
        islamic_terms = ["allah", "quran", "hadith", "prayer", "mosque", "imam"]
        if any(term in command.lower() for term in islamic_terms):
            markers.append("islamic_content")

        # Check for family terms
        family_terms = ["family", "mother", "father", "child", "parent", "home"]
        if any(term in command.lower() for term in family_terms):
            markers.append("family_content")

        return markers

    def _identify_professional_indicators(
        self, command: str
    ) -> List[ProfessionalDomain]:
        """Identify professional domain indicators"""
        indicators = []
        command_lower = command.lower()

        # Legal domain
        legal_terms = ["court", "judge", "lawyer", "law", "legal", "case", "trial"]
        if any(term in command_lower for term in legal_terms):
            indicators.append(ProfessionalDomain.LEGAL)

        # Medical domain
        medical_terms = [
            "doctor",
            "patient",
            "hospital",
            "medicine",
            "health",
            "clinic",
        ]
        if any(term in command_lower for term in medical_terms):
            indicators.append(ProfessionalDomain.MEDICAL)

        # Educational domain
        education_terms = [
            "school",
            "teacher",
            "student",
            "university",
            "education",
            "class",
        ]
        if any(term in command_lower for term in education_terms):
            indicators.append(ProfessionalDomain.EDUCATIONAL)

        # Government domain
        government_terms = [
            "ministry",
            "government",
            "public",
            "service",
            "official",
            "citizen",
        ]
        if any(term in command_lower for term in government_terms):
            indicators.append(ProfessionalDomain.GOVERNMENT)

        return indicators


class IraqiCommandManager:
    """
    Enhanced command management system with comprehensive Iraqi cultural integration.

    Based on Roo-Code patterns with sophisticated cultural validation, professional domain
    support, and Arabic language processing capabilities.
    """

    def __init__(
        self,
        global_commands_dir: Optional[str] = None,
        project_commands_dir: Optional[str] = None,
        cultural_config_path: Optional[str] = None,
    ):
        """
        Initialize Iraqi Command Manager

        Args:
            global_commands_dir: Directory for global commands
            project_commands_dir: Directory for project-specific commands
            cultural_config_path: Path to cultural configuration file
        """
        self.global_commands_dir = (
            Path(global_commands_dir)
            if global_commands_dir
            else Path.home() / ".iraqi_ai" / "commands"
        )
        self.project_commands_dir = (
            Path(project_commands_dir)
            if project_commands_dir
            else Path.cwd() / ".iraqi_ai" / "commands"
        )

        # Initialize components
        self.cultural_validator = IraqiCulturalValidator()
        self.command_parser = IraqiCommandParser()

        # Command storage
        self.commands: Dict[str, IraqiCommand] = {}
        self.command_cache: Dict[str, IraqiCommand] = {}

        # Performance tracking
        self.performance_metrics = {
            "total_validations": 0,
            "cultural_compliance_rate": 0.0,
            "average_validation_time": 0.0,
            "professional_usage_stats": {
                domain.value: 0 for domain in ProfessionalDomain
            },
            "security_incidents": 0,
            "arabic_processing_success_rate": 0.0,
        }

        # Initialize directories
        self._ensure_directories_exist()

        # Load existing commands
        asyncio.create_task(self._load_all_commands())

        logging.info("Iraqi Command Manager initialized successfully")

    def _ensure_directories_exist(self):
        """Ensure command directories exist"""
        self.global_commands_dir.mkdir(parents=True, exist_ok=True)
        self.project_commands_dir.mkdir(parents=True, exist_ok=True)

        # Create default subdirectories for organization
        for domain in ProfessionalDomain:
            (self.global_commands_dir / domain.value).mkdir(exist_ok=True)
            (self.project_commands_dir / domain.value).mkdir(exist_ok=True)

    async def _load_all_commands(self):
        """Load all commands from directories"""
        try:
            start_time = time.time()

            # Load global commands
            await self._scan_command_directory(
                self.global_commands_dir, CommandSource.GLOBAL
            )

            # Load project commands (these override global ones)
            await self._scan_command_directory(
                self.project_commands_dir, CommandSource.PROJECT
            )

            load_time = time.time() - start_time
            logging.info(f"Loaded {len(self.commands)} commands in {load_time:.2f}s")

        except Exception as e:
            logging.error(f"Error loading commands: {e}")

    async def _scan_command_directory(self, directory: Path, source: CommandSource):
        """Scan directory for command files"""
        if not directory.exists():
            return

        # Scan all .md files in directory and subdirectories
        for file_path in directory.rglob("*.md"):
            try:
                command_name = self._get_command_name_from_file(file_path.name)
                command = await self._load_command_file(file_path, command_name, source)

                if command:
                    # Project commands override global ones
                    if (
                        source == CommandSource.PROJECT
                        or command_name not in self.commands
                    ):
                        self.commands[command_name] = command

            except Exception as e:
                logging.warning(f"Failed to load command from {file_path}: {e}")

    async def _load_command_file(
        self, file_path: Path, command_name: str, source: CommandSource
    ) -> Optional[IraqiCommand]:
        """Load a single command file"""
        try:
            content = file_path.read_text(encoding="utf-8")

            # Parse frontmatter and content
            frontmatter_data, command_content = self._parse_command_file_content(
                content
            )

            # Determine professional domain from path
            professional_domains = self._determine_professional_domains_from_path(
                file_path
            )

            # Create metadata
            metadata = CommandMetadata(
                name=command_name,
                description=frontmatter_data.get("description", ""),
                description_arabic=frontmatter_data.get("description_arabic"),
                argument_hint=frontmatter_data.get("argument_hint"),
                argument_hint_arabic=frontmatter_data.get("argument_hint_arabic"),
                source=source,
                file_path=str(file_path),
                professional_domains=professional_domains,
                cultural_category=CulturalCommandCategory(
                    frontmatter_data.get("cultural_category", "general")
                ),
                security_level=CommandSecurityLevel(
                    frontmatter_data.get("security_level", "safe")
                ),
                requires_cultural_validation=frontmatter_data.get(
                    "requires_cultural_validation", False
                ),
                is_arabic_compatible=frontmatter_data.get("is_arabic_compatible", True),
                is_rtl_aware=frontmatter_data.get("is_rtl_aware", False),
            )

            # Perform cultural validation
            validation_result = self.cultural_validator.validate_command(
                command_content, metadata
            )
            metadata.cultural_validation = validation_result

            # Create command object
            return IraqiCommand(
                metadata=metadata,
                content=command_content,
                content_arabic=frontmatter_data.get("content_arabic"),
                frontmatter=frontmatter_data,
            )

        except Exception as e:
            logging.error(f"Error loading command file {file_path}: {e}")
            return None

    def _parse_command_file_content(self, content: str) -> Tuple[Dict[str, Any], str]:
        """Parse command file content with frontmatter support"""
        try:
            # Try to parse with frontmatter
            if content.startswith("---"):
                parts = content.split("---", 2)
                if len(parts) >= 3:
                    frontmatter_content = parts[1].strip()
                    command_content = parts[2].strip()

                    frontmatter_data = yaml.safe_load(frontmatter_content) or {}
                    return frontmatter_data, command_content

            # No frontmatter, treat entire content as command
            return {}, content.strip()

        except Exception as e:
            logging.warning(f"Error parsing frontmatter: {e}")
            return {}, content.strip()

    def _determine_professional_domains_from_path(
        self, file_path: Path
    ) -> Set[ProfessionalDomain]:
        """Determine professional domains from file path"""
        domains = set()
        path_parts = file_path.parts

        for part in path_parts:
            for domain in ProfessionalDomain:
                if domain.value in part.lower():
                    domains.add(domain)

        return domains if domains else {ProfessionalDomain.GENERAL}

    def _get_command_name_from_file(self, filename: str) -> str:
        """Extract command name from filename"""
        if filename.lower().endswith(".md"):
            return filename[:-3]
        return filename

    async def get_commands(
        self,
        professional_domain: Optional[ProfessionalDomain] = None,
        cultural_category: Optional[CulturalCommandCategory] = None,
        include_arabic: bool = True,
    ) -> List[IraqiCommand]:
        """Get commands with optional filtering"""
        commands = list(self.commands.values())

        # Filter by professional domain
        if professional_domain:
            commands = [
                cmd
                for cmd in commands
                if professional_domain in cmd.metadata.professional_domains
            ]

        # Filter by cultural category
        if cultural_category:
            commands = [
                cmd
                for cmd in commands
                if cmd.metadata.cultural_category == cultural_category
            ]

        # Filter by Arabic support
        if not include_arabic:
            commands = [
                cmd for cmd in commands if not cmd.metadata.is_arabic_compatible
            ]

        return commands

    async def get_command(
        self, name: str, source_preference: Optional[CommandSource] = None
    ) -> Optional[IraqiCommand]:
        """Get a specific command by name with source preference"""
        # Check cache first
        cache_key = f"{name}_{source_preference.value if source_preference else 'any'}"
        if cache_key in self.command_cache:
            return self.command_cache[cache_key]

        # Try to find command with source preference
        if source_preference:
            for command in self.commands.values():
                if (
                    command.metadata.name == name
                    and command.metadata.source == source_preference
                ):
                    self.command_cache[cache_key] = command
                    return command

        # Fallback to any source (project commands override global)
        command = self.commands.get(name)
        if command:
            self.command_cache[cache_key] = command

        return command

    async def validate_command_execution(
        self,
        command_string: str,
        user_domain: ProfessionalDomain = ProfessionalDomain.GENERAL,
    ) -> Dict[str, Any]:
        """Validate command execution with comprehensive analysis"""
        start_time = time.time()

        try:
            # Parse command
            parsing_result = self.command_parser.parse_command(command_string)

            # Analyze security risks
            security_analysis = self._analyze_security_risks(parsing_result)

            # Cultural validation
            cultural_analysis = await self._analyze_cultural_compliance(
                command_string, user_domain, parsing_result
            )

            # Professional domain validation
            professional_analysis = self._analyze_professional_compatibility(
                parsing_result, user_domain
            )

            # Make execution decision
            decision = self._make_execution_decision(
                security_analysis, cultural_analysis, professional_analysis
            )

            # Update performance metrics
            validation_time = time.time() - start_time
            self._update_performance_metrics(
                validation_time, cultural_analysis, security_analysis
            )

            return {
                "decision": decision.value,
                "parsing_result": parsing_result,
                "security_analysis": security_analysis,
                "cultural_analysis": cultural_analysis,
                "professional_analysis": professional_analysis,
                "validation_time_ms": validation_time * 1000,
                "timestamp": datetime.now().isoformat(),
            }

        except Exception as e:
            logging.error(f"Command validation error: {e}")
            return {
                "decision": CommandDecision.AUTO_DENY.value,
                "error": str(e),
                "validation_time_ms": (time.time() - start_time) * 1000,
                "timestamp": datetime.now().isoformat(),
            }

    def _analyze_security_risks(
        self, parsing_result: CommandParsingResult
    ) -> Dict[str, Any]:
        """Analyze security risks from parsing result"""
        risk_level = "low"

        if parsing_result["has_subshells"]:
            risk_level = "high"
        elif parsing_result["security_risks"]:
            risk_level = "medium"

        return {
            "risk_level": risk_level,
            "has_subshells": parsing_result["has_subshells"],
            "security_risks": parsing_result["security_risks"],
            "requires_review": risk_level in ["medium", "high"],
        }

    async def _analyze_cultural_compliance(
        self,
        command_string: str,
        user_domain: ProfessionalDomain,
        parsing_result: CommandParsingResult,
    ) -> Dict[str, Any]:
        """Analyze cultural compliance"""
        # Create temporary metadata for validation
        temp_metadata = CommandMetadata(
            name="temp_validation",
            description="Temporary command for validation",
            professional_domains={user_domain},
        )

        # Perform cultural validation
        validation_result = self.cultural_validator.validate_command(
            command_string, temp_metadata
        )

        return {
            "is_compliant": validation_result.is_compliant,
            "compliance_score": validation_result.compliance_score,
            "cultural_category": validation_result.cultural_category.value,
            "islamic_compliance": validation_result.islamic_compliance,
            "family_appropriateness": validation_result.family_appropriateness,
            "cultural_markers": parsing_result["cultural_markers"],
            "validation_reasons": validation_result.validation_reasons,
            "suggested_alternatives": validation_result.suggested_alternatives,
        }

    def _analyze_professional_compatibility(
        self, parsing_result: CommandParsingResult, user_domain: ProfessionalDomain
    ) -> Dict[str, Any]:
        """Analyze professional domain compatibility"""
        detected_domains = parsing_result["professional_indicators"]

        # Check compatibility
        is_compatible = (
            not detected_domains  # No specific domain detected
            or user_domain in detected_domains  # User domain matches
            or user_domain == ProfessionalDomain.GENERAL  # General user can access most
        )

        # Check if professional approval is required
        requires_approval = any(
            domain
            in [
                ProfessionalDomain.LEGAL,
                ProfessionalDomain.MEDICAL,
                ProfessionalDomain.GOVERNMENT,
                ProfessionalDomain.RELIGIOUS,
            ]
            for domain in detected_domains
        )

        return {
            "is_compatible": is_compatible,
            "detected_domains": [domain.value for domain in detected_domains],
            "user_domain": user_domain.value,
            "requires_approval": requires_approval,
        }

    def _make_execution_decision(
        self,
        security_analysis: Dict[str, Any],
        cultural_analysis: Dict[str, Any],
        professional_analysis: Dict[str, Any],
    ) -> CommandDecision:
        """Make final execution decision"""
        # Immediate denial conditions
        if security_analysis["risk_level"] == "high":
            return CommandDecision.AUTO_DENY

        if not cultural_analysis["is_compliant"]:
            return CommandDecision.CULTURAL_REVIEW

        if not professional_analysis["is_compatible"]:
            return CommandDecision.AUTO_DENY

        # Professional approval required
        if professional_analysis["requires_approval"]:
            return CommandDecision.PROFESSIONAL_APPROVE

        # Review required conditions
        if (
            security_analysis["requires_review"]
            or cultural_analysis["compliance_score"] < 0.9
        ):
            return CommandDecision.ASK_USER

        # Auto approve
        return CommandDecision.AUTO_APPROVE

    def _update_performance_metrics(
        self,
        validation_time: float,
        cultural_analysis: Dict[str, Any],
        security_analysis: Dict[str, Any],
    ):
        """Update performance metrics"""
        self.performance_metrics["total_validations"] += 1

        # Update compliance rate
        total_validations = self.performance_metrics["total_validations"]
        current_rate = self.performance_metrics["cultural_compliance_rate"]
        is_compliant = cultural_analysis["is_compliant"]

        self.performance_metrics["cultural_compliance_rate"] = (
            current_rate * (total_validations - 1) + (1.0 if is_compliant else 0.0)
        ) / total_validations

        # Update average validation time
        current_avg = self.performance_metrics["average_validation_time"]
        self.performance_metrics["average_validation_time"] = (
            current_avg * (total_validations - 1) + validation_time
        ) / total_validations

        # Update security incidents
        if security_analysis["risk_level"] == "high":
            self.performance_metrics["security_incidents"] += 1

    async def get_command_suggestions(
        self,
        partial_input: str,
        user_domain: ProfessionalDomain = ProfessionalDomain.GENERAL,
        limit: int = 10,
    ) -> List[Dict[str, Any]]:
        """Get command suggestions based on partial input"""
        suggestions = []
        partial_lower = partial_input.lower()

        for command in self.commands.values():
            # Check if command matches partial input
            if (
                command.metadata.name.lower().startswith(partial_lower)
                or partial_lower in command.metadata.description.lower()
            ):
                # Check domain compatibility
                if (
                    user_domain in command.metadata.professional_domains
                    or ProfessionalDomain.GENERAL
                    in command.metadata.professional_domains
                ):
                    suggestion = {
                        "name": command.metadata.name,
                        "description": command.metadata.description,
                        "description_arabic": command.metadata.description_arabic,
                        "argument_hint": command.metadata.argument_hint,
                        "cultural_category": command.metadata.cultural_category.value,
                        "professional_domains": [
                            domain.value
                            for domain in command.metadata.professional_domains
                        ],
                        "is_arabic_compatible": command.metadata.is_arabic_compatible,
                        "match_score": self._calculate_match_score(
                            partial_input, command
                        ),
                    }
                    suggestions.append(suggestion)

        # Sort by match score and limit results
        suggestions.sort(key=lambda x: x["match_score"], reverse=True)
        return suggestions[:limit]

    def _calculate_match_score(
        self, partial_input: str, command: IraqiCommand
    ) -> float:
        """Calculate match score for command suggestion"""
        score = 0.0
        partial_lower = partial_input.lower()

        # Exact prefix match gets highest score
        if command.metadata.name.lower().startswith(partial_lower):
            score += 1.0

        # Description contains partial input
        if partial_lower in command.metadata.description.lower():
            score += 0.5

        # Cultural validation score bonus
        if command.metadata.cultural_validation:
            score += command.metadata.cultural_validation.compliance_score * 0.3

        # Usage frequency bonus
        score += min(command.metadata.usage_count * 0.01, 0.2)

        return score

    async def create_command(
        self,
        name: str,
        content: str,
        metadata: CommandMetadata,
        source: CommandSource = CommandSource.USER,
    ) -> bool:
        """Create a new command"""
        try:
            # Validate command content
            validation_result = self.cultural_validator.validate_command(
                content, metadata
            )

            if not validation_result.is_compliant:
                logging.warning(f"Command {name} failed cultural validation")
                return False

            # Update metadata with validation result
            metadata.cultural_validation = validation_result
            metadata.source = source

            # Create command object
            command = IraqiCommand(metadata=metadata, content=content)

            # Save to appropriate directory
            file_path = self._get_command_file_path(
                name, source, metadata.professional_domains
            )
            await self._save_command_to_file(command, file_path)

            # Add to commands dictionary
            self.commands[name] = command

            logging.info(f"Command {name} created successfully")
            return True

        except Exception as e:
            logging.error(f"Error creating command {name}: {e}")
            return False

    def _get_command_file_path(
        self, name: str, source: CommandSource, domains: Set[ProfessionalDomain]
    ) -> Path:
        """Get file path for command"""
        base_dir = (
            self.global_commands_dir
            if source == CommandSource.GLOBAL
            else self.project_commands_dir
        )

        # Use first professional domain for directory organization
        if domains and ProfessionalDomain.GENERAL not in domains:
            domain_dir = base_dir / list(domains)[0].value
        else:
            domain_dir = base_dir / "general"

        domain_dir.mkdir(exist_ok=True)
        return domain_dir / f"{name}.md"

    async def _save_command_to_file(self, command: IraqiCommand, file_path: Path):
        """Save command to file with frontmatter"""
        try:
            # Prepare frontmatter
            frontmatter_data = {
                "description": command.metadata.description,
                "cultural_category": command.metadata.cultural_category.value,
                "security_level": command.metadata.security_level.value,
                "professional_domains": [
                    domain.value for domain in command.metadata.professional_domains
                ],
                "is_arabic_compatible": command.metadata.is_arabic_compatible,
                "is_rtl_aware": command.metadata.is_rtl_aware,
                "created": command.metadata.creation_time.isoformat(),
            }

            # Add optional fields
            if command.metadata.description_arabic:
                frontmatter_data["description_arabic"] = (
                    command.metadata.description_arabic
                )
            if command.metadata.argument_hint:
                frontmatter_data["argument_hint"] = command.metadata.argument_hint
            if command.metadata.argument_hint_arabic:
                frontmatter_data["argument_hint_arabic"] = (
                    command.metadata.argument_hint_arabic
                )
            if command.content_arabic:
                frontmatter_data["content_arabic"] = command.content_arabic

            # Create file content with frontmatter
            frontmatter_yaml = yaml.dump(
                frontmatter_data, default_flow_style=False, allow_unicode=True
            )
            file_content = f"---\n{frontmatter_yaml}---\n\n{command.content}"

            # Write to file
            file_path.write_text(file_content, encoding="utf-8")

        except Exception as e:
            logging.error(f"Error saving command to {file_path}: {e}")
            raise

    def get_performance_metrics(self) -> Dict[str, Any]:
        """Get performance metrics"""
        return self.performance_metrics.copy()

    async def cleanup_cache(self):
        """Clean up command cache"""
        self.command_cache.clear()
        logging.info("Command cache cleared")


# Example usage and testing
if __name__ == "__main__":

    async def main():
        # Initialize command manager
        manager = IraqiCommandManager()

        # Example: Validate a command
        validation_result = await manager.validate_command_execution(
            "ls -la /home/user/documents", ProfessionalDomain.GENERAL
        )

        print("Command validation result:")
        print(json.dumps(validation_result, indent=2, ensure_ascii=False))

        # Example: Get command suggestions
        suggestions = await manager.get_command_suggestions(
            "git", ProfessionalDomain.GENERAL, limit=5
        )

        print("\nCommand suggestions:")
        for suggestion in suggestions:
            print(f"- {suggestion['name']}: {suggestion['description']}")

        # Example: Get performance metrics
        metrics = manager.get_performance_metrics()
        print(f"\nPerformance metrics:")
        print(json.dumps(metrics, indent=2, ensure_ascii=False))

    # Run example
    asyncio.run(main())
