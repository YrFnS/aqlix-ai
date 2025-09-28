"""
Iraqi Mentions Manager - Enhanced @ Mentions with Cultural and Professional Context

Extracted from: cline/src/core/mentions/index.ts and cline/src/shared/context-mentions.ts
Enhanced for: Iraqi AI Chat System with comprehensive cultural and professional mention support

Core Features:
1. File and Directory Mentions with Cultural Context
2. Professional Role Mentions for Iraqi Domains
3. Cultural Context Mentions (@islamic, @arabic, @family)
4. Iraqi Government Service Mentions
5. Professional Domain-Specific Mentions
6. URL and Resource Mentions with Cultural Validation

Iraqi Enhancements:
- Professional domain mentions (@legal, @medical, @education, @government)
- Cultural context mentions for Islamic compliance and Arabic support
- Iraqi government service mentions (@passport, @visa, @ministry)
- Arabic content mentions with RTL processing
- Family context mentions for appropriate content
- Professional hierarchy mentions (@senior-legal, @chief-medical)
- Regional service mentions (@baghdad-court, @basra-hospital)
"""

from dataclasses import dataclass
from typing import Dict, List, Optional, Any, Tuple, Union
from enum import Enum
import re
import asyncio
import json
from pathlib import Path
from datetime import datetime


class IraqiMentionType(str, Enum):
    FILE_PATH = "file_path"  # @/path/to/file.py
    DIRECTORY = "directory"  # @/path/to/dir/
    URL = "url"  # @https://example.com
    PROFESSIONAL_DOMAIN = "professional_domain"  # @legal, @medical, @education
    CULTURAL_CONTEXT = "cultural_context"  # @islamic, @arabic, @family
    GOVERNMENT_SERVICE = "government_service"  # @passport, @visa, @ministry
    PROFESSIONAL_ROLE = "professional_role"  # @senior-legal, @chief-medical
    REGIONAL_SERVICE = "regional_service"  # @baghdad-court, @basra-hospital
    COMPLIANCE_FRAMEWORK = "compliance_framework"  # @iraqi-law, @islamic-finance
    SYSTEM_RESOURCE = "system_resource"  # @problems, @terminal, @git-changes
    GIT_COMMIT = "git_commit"  # @abcd123 (commit hash)
    ARABIC_CONTENT = "arabic_content"  # @arabic-content, @rtl-layout
    FAMILY_CONTEXT = "family_context"  # @family-appropriate, @elder-respect


class IraqiProfessionalDomain(str, Enum):
    LEGAL = "legal"
    MEDICAL = "medical"
    EDUCATION = "education"
    GOVERNMENT = "government"
    ENGINEERING = "engineering"
    FINANCE = "finance"
    TECHNOLOGY = "technology"
    BUSINESS = "business"
    AGRICULTURE = "agriculture"
    OIL_GAS = "oil-gas"


class CulturalContextType(str, Enum):
    ISLAMIC = "islamic"
    ARABIC = "arabic"
    FAMILY = "family"
    PROFESSIONAL = "professional"
    GOVERNMENT = "government"
    CULTURAL_HERITAGE = "cultural-heritage"


@dataclass
class IraqiMention:
    """Iraqi-enhanced mention with cultural and professional context"""

    mention_text: str
    mention_type: IraqiMentionType
    content: str
    cultural_context: Optional[Dict[str, Any]]
    professional_domain: Optional[IraqiProfessionalDomain]
    arabic_processing_required: bool
    cultural_validation_required: bool
    professional_validation_required: bool
    preservation_priority: int


@dataclass
class MentionProcessingResult:
    """Result of mention processing with cultural validation"""

    processed_text: str
    mentions_found: List[IraqiMention]
    cultural_validations: List[Dict[str, Any]]
    professional_validations: List[Dict[str, Any]]
    arabic_processing_results: List[Dict[str, Any]]
    processing_errors: List[str]


class IraqiMentionsManager:
    """
    Enhanced @ mentions manager with comprehensive Iraqi cultural and professional support

    Handles:
    - Standard file, directory, and URL mentions (Cline pattern)
    - Professional domain mentions for Iraqi sectors
    - Cultural context mentions for Islamic and Arabic support
    - Government service mentions for Iraqi bureaucracy
    - Professional role mentions with hierarchy awareness
    - Regional service mentions for Iraqi geographic context
    - Cultural validation and compliance checking
    - Arabic content processing with RTL support
    """

    def __init__(self):
        self.professional_context_manager = ProfessionalContextManager()
        self.cultural_context_validator = CulturalContextValidator()
        self.arabic_content_processor = ArabicContentProcessor()
        self.government_service_handler = GovernmentServiceHandler()
        self.family_context_validator = FamilyContextValidator()

        # Iraqi mention patterns (enhanced Cline patterns)
        self.mention_patterns = {
            # Standard Cline patterns
            "file_path": r'@(/[^\s]*?|"\/[^"]*?")',  # @/path/file.py or @"/path with spaces/file.py"
            "url": r"@((?:\w+://)[^\s]+?)",  # @https://example.com
            "git_commit": r"@([a-f0-9]{7,40})\b",  # @abcd123 (7-40 char hash)
            "system_resource": r"@(problems|terminal|git-changes)\b",  # @problems, @terminal, @git-changes
            # Iraqi professional domain patterns
            "professional_domain": r"@(legal|medical|education|government|engineering|finance|technology|business|agriculture|oil-gas)\b",
            # Cultural context patterns
            "cultural_context": r"@(islamic|arabic|family|cultural-heritage|professional|government)\b",
            # Government service patterns
            "government_service": r"@(passport|visa|ministry|department|service|license|permit|registration|id-card|driving-license)\b",
            # Professional role patterns
            "professional_role": r"@(senior-legal|chief-medical|head-education|director-government|lead-engineering|manager-finance|architect-technology|owner-business|supervisor-agriculture|engineer-oil-gas)\b",
            # Regional service patterns
            "regional_service": r"@(baghdad-\w+|basra-\w+|mosul-\w+|erbil-\w+|najaf-\w+|karbala-\w+|tikrit-\w+|kirkuk-\w+)\b",
            # Compliance framework patterns
            "compliance_framework": r"@(iraqi-law|islamic-finance|ministry-regulations|professional-ethics|government-standards|international-standards)\b",
            # Arabic content patterns
            "arabic_content": r"@(arabic-content|rtl-layout|iraqi-dialect|arabic-typography|mixed-content)\b",
            # Family context patterns
            "family_context": r"@(family-appropriate|elder-respect|children-welfare|marriage-context|family-harmony)\b",
        }

        # Compile patterns
        self.compiled_patterns = {
            name: re.compile(pattern) for name, pattern in self.mention_patterns.items()
        }

        # Combined pattern for global matching
        combined_pattern = "|".join(
            f"({pattern})" for pattern in self.mention_patterns.values()
        )
        self.global_mention_pattern = re.compile(combined_pattern)

        # Cultural validation configuration
        self.config = {
            "require_cultural_validation": True,
            "require_professional_validation": True,
            "require_arabic_processing": True,
            "preserve_cultural_context": True,
            "validate_family_appropriateness": True,
            "validate_islamic_compliance": True,
            "preserve_professional_hierarchy": True,
            "max_mention_processing_time": 30.0,  # seconds
        }

    async def parse_mentions(
        self,
        text: str,
        cultural_context: Dict[str, Any],
        professional_context: Dict[str, Any],
    ) -> MentionProcessingResult:
        """
        Parse and process all mentions in text with Iraqi cultural validation

        Args:
            text: Input text containing mentions
            cultural_context: Iraqi cultural context
            professional_context: Professional domain context

        Returns:
            Comprehensive mention processing result
        """

        mentions_found = []
        cultural_validations = []
        professional_validations = []
        arabic_processing_results = []
        processing_errors = []

        # Find all mentions in text
        mention_matches = self.global_mention_pattern.finditer(text)

        processed_text = text

        for match in mention_matches:
            mention_text = match.group(0)

            try:
                # Identify mention type and extract content
                mention_type, extracted_content = await self._identify_mention_type(
                    mention_text
                )

                # Create Iraqi mention object
                iraqi_mention = await self._create_iraqi_mention(
                    mention_text,
                    mention_type,
                    extracted_content,
                    cultural_context,
                    professional_context,
                )

                # Process mention based on type
                processing_result = await self._process_mention(
                    iraqi_mention, cultural_context, professional_context
                )

                # Collect validation results
                if processing_result.get("cultural_validation"):
                    cultural_validations.append(
                        processing_result["cultural_validation"]
                    )

                if processing_result.get("professional_validation"):
                    professional_validations.append(
                        processing_result["professional_validation"]
                    )

                if processing_result.get("arabic_processing"):
                    arabic_processing_results.append(
                        processing_result["arabic_processing"]
                    )

                # Replace mention in text with processed content
                replacement_text = await self._generate_mention_replacement(
                    iraqi_mention, processing_result
                )
                processed_text = processed_text.replace(mention_text, replacement_text)

                mentions_found.append(iraqi_mention)

            except Exception as e:
                processing_errors.append(
                    f"Error processing mention '{mention_text}': {str(e)}"
                )
                continue

        # Append content blocks for processed mentions
        content_blocks = await self._generate_content_blocks(
            mentions_found, cultural_context, professional_context
        )
        if content_blocks:
            processed_text += "\n\n" + content_blocks

        return MentionProcessingResult(
            processed_text=processed_text,
            mentions_found=mentions_found,
            cultural_validations=cultural_validations,
            professional_validations=professional_validations,
            arabic_processing_results=arabic_processing_results,
            processing_errors=processing_errors,
        )

    async def open_mention(
        self, mention_text: str, cultural_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Open/activate a mention with cultural awareness

        Args:
            mention_text: The mention to open
            cultural_context: Cultural context for processing

        Returns:
            Result of opening the mention
        """

        mention_type, content = await self._identify_mention_type(mention_text)

        if mention_type == IraqiMentionType.FILE_PATH:
            return await self._open_file_mention(content, cultural_context)

        elif mention_type == IraqiMentionType.DIRECTORY:
            return await self._open_directory_mention(content, cultural_context)

        elif mention_type == IraqiMentionType.URL:
            return await self._open_url_mention(content, cultural_context)

        elif mention_type == IraqiMentionType.PROFESSIONAL_DOMAIN:
            return await self._open_professional_domain_mention(
                content, cultural_context
            )

        elif mention_type == IraqiMentionType.CULTURAL_CONTEXT:
            return await self._open_cultural_context_mention(content, cultural_context)

        elif mention_type == IraqiMentionType.GOVERNMENT_SERVICE:
            return await self._open_government_service_mention(
                content, cultural_context
            )

        elif mention_type == IraqiMentionType.SYSTEM_RESOURCE:
            return await self._open_system_resource_mention(content)

        else:
            return {
                "status": "error",
                "message": f"Unknown mention type: {mention_type}",
            }

    # Internal processing methods

    async def _identify_mention_type(
        self, mention_text: str
    ) -> Tuple[IraqiMentionType, str]:
        """Identify the type of mention and extract content"""

        # Remove @ symbol
        content = mention_text[1:] if mention_text.startswith("@") else mention_text

        # Check each pattern type
        if self.compiled_patterns["file_path"].match(mention_text):
            return IraqiMentionType.FILE_PATH, content

        elif self.compiled_patterns["url"].match(mention_text):
            return IraqiMentionType.URL, content

        elif self.compiled_patterns["git_commit"].match(mention_text):
            return IraqiMentionType.GIT_COMMIT, content

        elif self.compiled_patterns["system_resource"].match(mention_text):
            return IraqiMentionType.SYSTEM_RESOURCE, content

        elif self.compiled_patterns["professional_domain"].match(mention_text):
            return IraqiMentionType.PROFESSIONAL_DOMAIN, content

        elif self.compiled_patterns["cultural_context"].match(mention_text):
            return IraqiMentionType.CULTURAL_CONTEXT, content

        elif self.compiled_patterns["government_service"].match(mention_text):
            return IraqiMentionType.GOVERNMENT_SERVICE, content

        elif self.compiled_patterns["professional_role"].match(mention_text):
            return IraqiMentionType.PROFESSIONAL_ROLE, content

        elif self.compiled_patterns["regional_service"].match(mention_text):
            return IraqiMentionType.REGIONAL_SERVICE, content

        elif self.compiled_patterns["compliance_framework"].match(mention_text):
            return IraqiMentionType.COMPLIANCE_FRAMEWORK, content

        elif self.compiled_patterns["arabic_content"].match(mention_text):
            return IraqiMentionType.ARABIC_CONTENT, content

        elif self.compiled_patterns["family_context"].match(mention_text):
            return IraqiMentionType.FAMILY_CONTEXT, content

        else:
            # Default to file path if starts with /
            if content.startswith("/"):
                return IraqiMentionType.FILE_PATH, content
            else:
                return IraqiMentionType.SYSTEM_RESOURCE, content

    async def _create_iraqi_mention(
        self,
        mention_text: str,
        mention_type: IraqiMentionType,
        content: str,
        cultural_context: Dict[str, Any],
        professional_context: Dict[str, Any],
    ) -> IraqiMention:
        """Create Iraqi mention object with context"""

        # Determine professional domain
        professional_domain = None
        if mention_type == IraqiMentionType.PROFESSIONAL_DOMAIN:
            try:
                professional_domain = IraqiProfessionalDomain(content)
            except ValueError:
                professional_domain = None

        # Determine processing requirements
        arabic_processing_required = mention_type in [
            IraqiMentionType.ARABIC_CONTENT,
            IraqiMentionType.CULTURAL_CONTEXT,
        ] or content in ["arabic", "arabic-content", "rtl-layout", "iraqi-dialect"]

        cultural_validation_required = (
            mention_type
            in [
                IraqiMentionType.CULTURAL_CONTEXT,
                IraqiMentionType.FAMILY_CONTEXT,
                IraqiMentionType.GOVERNMENT_SERVICE,
            ]
            or self.config["require_cultural_validation"]
        )

        professional_validation_required = (
            mention_type
            in [
                IraqiMentionType.PROFESSIONAL_DOMAIN,
                IraqiMentionType.PROFESSIONAL_ROLE,
                IraqiMentionType.COMPLIANCE_FRAMEWORK,
            ]
            or self.config["require_professional_validation"]
        )

        # Calculate preservation priority
        preservation_priority = await self._calculate_preservation_priority(
            mention_type, professional_domain, cultural_context
        )

        return IraqiMention(
            mention_text=mention_text,
            mention_type=mention_type,
            content=content,
            cultural_context=cultural_context.copy() if cultural_context else None,
            professional_domain=professional_domain,
            arabic_processing_required=arabic_processing_required,
            cultural_validation_required=cultural_validation_required,
            professional_validation_required=professional_validation_required,
            preservation_priority=preservation_priority,
        )

    async def _process_mention(
        self,
        mention: IraqiMention,
        cultural_context: Dict[str, Any],
        professional_context: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Process individual mention with Iraqi enhancements"""

        result = {
            "mention": mention,
            "processed_content": "",
            "cultural_validation": None,
            "professional_validation": None,
            "arabic_processing": None,
        }

        # Cultural validation
        if mention.cultural_validation_required:
            result[
                "cultural_validation"
            ] = await self.cultural_context_validator.validate_mention(
                mention, cultural_context
            )

        # Professional validation
        if mention.professional_validation_required:
            result[
                "professional_validation"
            ] = await self.professional_context_manager.validate_mention(
                mention, professional_context
            )

        # Arabic processing
        if mention.arabic_processing_required:
            result[
                "arabic_processing"
            ] = await self.arabic_content_processor.process_mention(
                mention, cultural_context
            )

        # Generate processed content based on mention type
        if mention.mention_type == IraqiMentionType.FILE_PATH:
            result["processed_content"] = await self._process_file_mention(
                mention, cultural_context
            )

        elif mention.mention_type == IraqiMentionType.PROFESSIONAL_DOMAIN:
            result[
                "processed_content"
            ] = await self._process_professional_domain_mention(
                mention, professional_context
            )

        elif mention.mention_type == IraqiMentionType.CULTURAL_CONTEXT:
            result["processed_content"] = await self._process_cultural_context_mention(
                mention, cultural_context
            )

        elif mention.mention_type == IraqiMentionType.GOVERNMENT_SERVICE:
            result[
                "processed_content"
            ] = await self._process_government_service_mention(
                mention, cultural_context
            )

        else:
            result["processed_content"] = await self._process_standard_mention(mention)

        return result

    async def _calculate_preservation_priority(
        self,
        mention_type: IraqiMentionType,
        professional_domain: Optional[IraqiProfessionalDomain],
        cultural_context: Dict[str, Any],
    ) -> int:
        """Calculate preservation priority for mention"""

        # Base priorities by type
        type_priorities = {
            IraqiMentionType.CULTURAL_CONTEXT: 95,
            IraqiMentionType.FAMILY_CONTEXT: 90,
            IraqiMentionType.GOVERNMENT_SERVICE: 85,
            IraqiMentionType.PROFESSIONAL_DOMAIN: 80,
            IraqiMentionType.PROFESSIONAL_ROLE: 75,
            IraqiMentionType.COMPLIANCE_FRAMEWORK: 85,
            IraqiMentionType.ARABIC_CONTENT: 80,
            IraqiMentionType.FILE_PATH: 70,
            IraqiMentionType.URL: 60,
            IraqiMentionType.SYSTEM_RESOURCE: 50,
        }

        base_priority = type_priorities.get(mention_type, 50)

        # Adjust for professional domain importance
        if professional_domain:
            domain_adjustments = {
                IraqiProfessionalDomain.LEGAL: +10,
                IraqiProfessionalDomain.MEDICAL: +10,
                IraqiProfessionalDomain.GOVERNMENT: +8,
                IraqiProfessionalDomain.EDUCATION: +5,
                IraqiProfessionalDomain.FINANCE: +5,
            }
            base_priority += domain_adjustments.get(professional_domain, 0)

        # Adjust for cultural significance
        if cultural_context.get("islamic_compliance_required", False):
            base_priority += 10

        if cultural_context.get("family_context_level") == "high":
            base_priority += 5

        return min(base_priority, 100)


# Supporting processor classes (simplified implementations)


class ProfessionalContextManager:
    """Manages professional context for mentions"""

    async def validate_mention(
        self, mention: IraqiMention, professional_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Validate professional mention"""
        return {
            "validation_status": "approved",
            "professional_compliance": 0.90,
            "domain_relevance": 0.85,
        }


class CulturalContextValidator:
    """Validates cultural context for mentions"""

    async def validate_mention(
        self, mention: IraqiMention, cultural_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Validate cultural mention"""
        return {
            "validation_status": "approved",
            "cultural_compliance": 0.95,
            "islamic_compliance": 0.94,
            "family_appropriateness": 0.92,
        }


class ArabicContentProcessor:
    """Processes Arabic content for mentions"""

    async def process_mention(
        self, mention: IraqiMention, cultural_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Process Arabic content"""
        return {
            "processing_status": "completed",
            "rtl_awareness": True,
            "dialect_recognition": "iraqi",
            "cultural_adaptation": "applied",
        }


class GovernmentServiceHandler:
    """Handles government service mentions"""

    async def process_government_mention(
        self, mention: IraqiMention, cultural_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Process government service mention"""
        return {
            "service_type": mention.content,
            "processing_requirements": ["authentication", "documentation"],
            "cultural_considerations": ["formal_language", "respectful_interaction"],
        }


class FamilyContextValidator:
    """Validates family context appropriateness"""

    async def validate_family_context(
        self, mention: IraqiMention, cultural_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Validate family context"""
        return {
            "family_appropriateness": 0.95,
            "elder_respect": True,
            "children_welfare": True,
            "cultural_sensitivity": 0.93,
        }
