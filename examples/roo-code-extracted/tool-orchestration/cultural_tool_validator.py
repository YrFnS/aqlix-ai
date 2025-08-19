"""
Cultural Tool Validator - Professional Iraqi contexts tool validation
Part of Roo-Code extraction with comprehensive Iraqi cultural compliance

Extends Roo-Code's tool validation patterns with Iraqi cultural modes, Islamic compliance
checking, professional domain restrictions, and government service integration for
culturally-appropriate tool usage in Iraqi professional environments.
- Islamic compliance validation for tool usage
- Arabic language tool validation with RTL awareness
- Family context sensitivity for tool access
- Government service tool security validation

Based on: RooCodeInc/Roo-Code tool validation patterns
Enhanced for: Iraqi AI Chat System with comprehensive cultural compliance
"""

from typing import Dict, List, Optional, Any, Tuple, Set
from dataclasses import dataclass, field
from enum import Enum
import asyncio
import json
from datetime import datetime, time
from pathlib import Path


class IraqiMode(Enum):
    """Iraqi-specific modes with cultural context"""
    GENERAL = "general"                    # General usage
    PROFESSIONAL = "professional"         # Professional domain work
    FAMILY = "family"                     # Family-sensitive context
    ISLAMIC = "islamic"                   # Islamic compliance required
    GOVERNMENT = "government"             # Government service interaction
    EDUCATION = "education"               # Educational context
    MEDICAL = "medical"                   # Medical professional context
    LEGAL = "legal"                       # Legal professional context
    BUSINESS = "business"                 # Business context
    CULTURAL = "cultural"                 # Cultural preservation work


class ToolSecurityLevel(Enum):
    """Security levels for tool access"""
    PUBLIC = "public"                     # No restrictions
    RESTRICTED = "restricted"             # Basic restrictions
    PROFESSIONAL = "professional"        # Professional verification required
    GOVERNMENT = "government"             # Government authorization required
    SENSITIVE = "sensitive"               # High sensitivity, special approval
    CLASSIFIED = "classified"             # Classified access only


class ValidationResult(Enum):
    """Tool validation results"""
    APPROVED = "approved"
    RESTRICTED = "restricted"
    DENIED = "denied"
    REQUIRES_APPROVAL = "requires_approval"
    CULTURAL_REVIEW = "cultural_review"
    ISLAMIC_REVIEW = "islamic_review"


@dataclass
class ToolRequirement:
    """Tool requirement specification"""
    name: str
    required: bool = True
    minimum_version: Optional[str] = None
    cultural_compliance_level: float = 0.95
    islamic_approval_required: bool = False
    professional_domain_restricted: bool = False
    family_context_safe: bool = True
    government_authorized: bool = False


@dataclass
class IraqiToolConfig:
    """Tool configuration with Iraqi cultural context"""
    tool_name: str
    security_level: ToolSecurityLevel
    allowed_modes: Set[IraqiMode]
    cultural_requirements: Dict[str, Any]
    islamic_compliance: Dict[str, Any]
    professional_domains: Set[str] = field(default_factory=set)
    
    # Usage restrictions
    max_daily_usage: Optional[int] = None
    time_restrictions: Optional[Dict[str, Any]] = None
    family_context_restrictions: Dict[str, Any] = field(default_factory=dict)
    
    # Arabic language support
    arabic_language_support: bool = False
    rtl_interface_required: bool = False
    iraqi_dialect_support: bool = False
    
    # Government service integration
    government_portal_access: bool = False
    requires_government_auth: bool = False
    classified_access_level: Optional[str] = None


@dataclass
class ToolValidationContext:
    """Context for tool validation"""
    user_id: str
    current_mode: IraqiMode
    professional_domain: Optional[str] = None
    cultural_context: Dict[str, Any] = field(default_factory=dict)
    islamic_context: Dict[str, Any] = field(default_factory=dict)
    family_context: Dict[str, Any] = field(default_factory=dict)
    government_context: Dict[str, Any] = field(default_factory=dict)
    
    # User credentials and permissions
    professional_credentials: Dict[str, Any] = field(default_factory=dict)
    government_clearance: Optional[str] = None
    cultural_validation_level: float = 0.95
    
    # Session context
    session_start_time: datetime = field(default_factory=datetime.now)
    current_time: datetime = field(default_factory=datetime.now)
    prayer_schedule: Dict[str, time] = field(default_factory=dict)


@dataclass
class ToolValidationResult:
    """Comprehensive tool validation result"""
    result: ValidationResult
    tool_name: str
    mode: IraqiMode
    allowed: bool
    
    # Validation scores
    cultural_compliance_score: float
    islamic_compliance_score: float
    professional_compliance_score: float
    family_safety_score: float
    
    # Detailed feedback
    reasons: List[str] = field(default_factory=list)
    restrictions: List[str] = field(default_factory=list)
    requirements: List[str] = field(default_factory=list)
    alternatives: List[str] = field(default_factory=list)
    
    # Usage metadata
    usage_count_today: int = 0
    last_used: Optional[datetime] = None
    approval_required: bool = False
    human_review_required: bool = False


class IslamicToolValidator:
    """Islamic compliance validation for tools"""
    
    def __init__(self):
        # Tools that are inherently halal/encouraged
        self.encouraged_tools = {
            "knowledge_search", "educational_content", "family_communication",
            "prayer_reminder", "quran_search", "islamic_calendar",
            "charity_calculator", "halal_business_tools"
        }
        
        # Tools that require careful usage
        self.conditional_tools = {
            "web_search": {"conditions": ["content_filtering", "time_limits"]},
            "image_generator": {"conditions": ["no_animate_beings", "islamic_content_only"]},
            "social_media": {"conditions": ["family_appropriate", "no_gossip"]},
            "finance_tools": {"conditions": ["sharia_compliant", "no_interest"]}
        }
        
        # Tools that are generally discouraged
        self.discouraged_tools = {
            "gambling_simulator", "interest_calculator", "dating_tools",
            "alcohol_tracker", "music_generator"
        }
        
        # Prayer time restrictions
        self.prayer_time_restrictions = {
            "before_prayer": timedelta(minutes=15),
            "during_prayer": timedelta(minutes=30),
            "friday_sermon": timedelta(hours=2)
        }
    
    async def validate_islamic_compliance(self, 
                                        tool_name: str, 
                                        islamic_context: Dict[str, Any],
                                        usage_context: Dict[str, Any]) -> Tuple[bool, float, List[str]]:
        """Validate tool against Islamic principles"""
        
        concerns = []
        compliance_score = 1.0
        
        # Check if tool is explicitly discouraged
        if tool_name in self.discouraged_tools:
            concerns.append(f"Tool {tool_name} conflicts with Islamic principles")
            compliance_score = 0.0
            return False, compliance_score, concerns
        
        # Check encouraged tools
        if tool_name in self.encouraged_tools:
            return True, 1.0, []
        
        # Check conditional tools
        if tool_name in self.conditional_tools:
            conditions = self.conditional_tools[tool_name]["conditions"]
            for condition in conditions:
                if not usage_context.get(condition, False):
                    concerns.append(f"Islamic condition not met: {condition}")
                    compliance_score -= 0.3
        
        # Prayer time validation
        current_time = usage_context.get("current_time", datetime.now())
        if await self._is_prayer_time_restricted(current_time, islamic_context):
            concerns.append("Tool usage restricted during prayer time")
            compliance_score -= 0.5
        
        # Family time validation
        if islamic_context.get("family_time_active", False):
            if tool_name not in ["family_communication", "prayer_reminder", "emergency_tools"]:
                concerns.append("Non-essential tool usage during family time")
                compliance_score -= 0.2
        
        # Ramadan considerations
        if islamic_context.get("ramadan_month", False):
            if tool_name in ["food_ordering", "entertainment_tools"]:
                if islamic_context.get("fasting_hours", True):
                    concerns.append("Tool usage may conflict with Ramadan fasting")
                    compliance_score -= 0.3
        
        is_compliant = compliance_score >= 0.7 and len([c for c in concerns if "conflicts" in c]) == 0
        return is_compliant, max(0.0, compliance_score), concerns
    
    async def _is_prayer_time_restricted(self, current_time: datetime, islamic_context: Dict[str, Any]) -> bool:
        """Check if current time falls within prayer time restrictions"""
        
        prayer_schedule = islamic_context.get("prayer_schedule", {})
        if not prayer_schedule:
            return False
        
        current_time_only = current_time.time()
        
        # Check each prayer time
        for prayer_name, prayer_time in prayer_schedule.items():
            if isinstance(prayer_time, str):
                prayer_time = datetime.strptime(prayer_time, "%H:%M").time()
            
            # Create time windows around prayer times
            prayer_datetime = datetime.combine(current_time.date(), prayer_time)
            before_prayer = prayer_datetime - timedelta(minutes=10)
            after_prayer = prayer_datetime + timedelta(minutes=25)
            
            if before_prayer.time() <= current_time_only <= after_prayer.time():
                return True
        
        return False


class ProfessionalDomainValidator:
    """Professional domain validation for Iraqi contexts"""
    
    def __init__(self):
        self.domain_tool_restrictions = {
            "medical": {
                "required_tools": ["medical_terminology", "patient_privacy_protector", "hipaa_compliance"],
                "restricted_tools": ["social_media", "entertainment", "personal_finance"],
                "approved_tools": ["medical_search", "diagnosis_support", "treatment_planner", "arabic_medical_translator"]
            },
            "legal": {
                "required_tools": ["legal_terminology", "confidentiality_protector", "iraqi_law_database"],
                "restricted_tools": ["social_media", "entertainment", "personal_content"],
                "approved_tools": ["case_search", "legal_document_processor", "court_filing_helper", "arabic_legal_translator"]
            },
            "education": {
                "required_tools": ["educational_content_filter", "student_privacy_protector"],
                "restricted_tools": ["inappropriate_content", "non_educational_games"],
                "approved_tools": ["curriculum_planner", "student_assessment", "educational_content_creator", "arabic_education_tools"]
            },
            "government": {
                "required_tools": ["security_clearance_validator", "citizen_privacy_protector", "audit_logger"],
                "restricted_tools": ["personal_tools", "entertainment", "external_communication"],
                "approved_tools": ["citizen_service_portal", "government_document_processor", "official_translator"]
            }
        }
        
        self.domain_qualifications = {
            "medical": ["medical_license", "continuing_education", "malpractice_insurance"],
            "legal": ["bar_association_membership", "practicing_license", "ethical_compliance"],
            "education": ["teaching_license", "educational_qualification", "background_check"],
            "government": ["security_clearance", "government_employment", "oath_of_office"]
        }
    
    async def validate_professional_domain(self, 
                                         tool_name: str, 
                                         domain: str, 
                                         credentials: Dict[str, Any]) -> Tuple[bool, float, List[str]]:
        """Validate tool usage for specific professional domain"""
        
        if domain not in self.domain_tool_restrictions:
            return True, 1.0, []  # Unknown domain, allow
        
        domain_config = self.domain_tool_restrictions[domain]
        concerns = []
        compliance_score = 1.0
        
        # Check if tool is restricted for this domain
        if tool_name in domain_config["restricted_tools"]:
            concerns.append(f"Tool {tool_name} is restricted in {domain} domain")
            return False, 0.0, concerns
        
        # Check professional qualifications
        required_qualifications = self.domain_qualifications.get(domain, [])
        for qualification in required_qualifications:
            if not credentials.get(qualification, False):
                concerns.append(f"Missing required qualification: {qualification}")
                compliance_score -= 0.4
        
        # Check required tools are available
        required_tools = domain_config["required_tools"]
        for required_tool in required_tools:
            if not credentials.get(f"has_{required_tool}", False):
                concerns.append(f"Required domain tool not available: {required_tool}")
                compliance_score -= 0.2
        
        # Bonus for using approved tools
        if tool_name in domain_config["approved_tools"]:
            compliance_score = min(1.0, compliance_score + 0.1)
        
        is_approved = compliance_score >= 0.6 and len([c for c in concerns if "restricted" in c]) == 0
        return is_approved, max(0.0, compliance_score), concerns


class FamilyContextValidator:
    """Family context validation for Iraqi cultural norms"""
    
    def __init__(self):
        self.family_safe_tools = {
            "educational_content", "family_communication", "prayer_tools",
            "halal_recipes", "islamic_stories", "family_planner",
            "children_educational_games", "arabic_learning_tools"
        }
        
        self.family_restricted_tools = {
            "adult_content", "violent_games", "inappropriate_social_media",
            "gambling_tools", "dating_apps", "alcohol_related_tools"
        }
        
        self.children_present_restrictions = {
            "news_with_violence", "adult_conversations", "work_stress_tools",
            "complex_professional_tools", "financial_worry_tools"
        }
    
    async def validate_family_context(self, 
                                    tool_name: str, 
                                    family_context: Dict[str, Any]) -> Tuple[bool, float, List[str]]:
        """Validate tool usage in family context"""
        
        concerns = []
        safety_score = 1.0
        
        # Check explicitly family-safe tools
        if tool_name in self.family_safe_tools:
            return True, 1.0, []
        
        # Check explicitly restricted tools
        if tool_name in self.family_restricted_tools:
            concerns.append(f"Tool {tool_name} is not appropriate for family context")
            return False, 0.0, concerns
        
        # Additional restrictions when children are present
        if family_context.get("children_present", False):
            if tool_name in self.children_present_restrictions:
                concerns.append(f"Tool {tool_name} not suitable when children are present")
                safety_score -= 0.6
        
        # Check family meal time
        if family_context.get("family_meal_time", False):
            if tool_name not in ["emergency_tools", "prayer_reminder"]:
                concerns.append("Non-essential tool usage during family meal time")
                safety_score -= 0.3
        
        # Check family gathering time
        if family_context.get("family_gathering", False):
            work_tools = ["professional_email", "business_tools", "work_scheduling"]
            if tool_name in work_tools:
                concerns.append("Work tools not appropriate during family gathering")
                safety_score -= 0.4
        
        # Check respect for elders present
        if family_context.get("elders_present", False):
            if tool_name in ["loud_notifications", "disruptive_tools"]:
                concerns.append("Tool may be disruptive to elders")
                safety_score -= 0.2
        
        is_safe = safety_score >= 0.7
        return is_safe, max(0.0, safety_score), concerns


class CulturalToolValidator:
    """
    Comprehensive tool validator for Iraqi cultural compliance
    Based on Roo-Code's isToolAllowedForMode with extensive Iraqi enhancements
    """
    
    def __init__(self):
        self.islamic_validator = IslamicToolValidator()
        self.professional_validator = ProfessionalDomainValidator()
        self.family_validator = FamilyContextValidator()
        
        # Load tool configurations
        self.tool_configs: Dict[str, IraqiToolConfig] = {}
        self._initialize_default_tool_configs()
        
        # Usage tracking
        self.usage_tracker: Dict[str, Dict[str, Any]] = {}
        
        # Validation cache for performance
        self.validation_cache: Dict[str, ToolValidationResult] = {}
    
    def _initialize_default_tool_configs(self):
        """Initialize default tool configurations for Iraqi context"""
        
        # Professional tools
        self.tool_configs["legal_document_processor"] = IraqiToolConfig(
            tool_name="legal_document_processor",
            security_level=ToolSecurityLevel.PROFESSIONAL,
            allowed_modes={IraqiMode.LEGAL, IraqiMode.PROFESSIONAL},
            cultural_requirements={"iraqi_law_compliance": True, "arabic_legal_terminology": True},
            islamic_compliance={"halal_business_practices": True, "islamic_finance_aware": True},
            professional_domains={"legal"},
            arabic_language_support=True,
            rtl_interface_required=True,
            max_daily_usage=50
        )
        
        self.tool_configs["medical_diagnosis_helper"] = IraqiToolConfig(
            tool_name="medical_diagnosis_helper",
            security_level=ToolSecurityLevel.PROFESSIONAL,
            allowed_modes={IraqiMode.MEDICAL, IraqiMode.PROFESSIONAL},
            cultural_requirements={"patient_privacy_iraqi": True, "medical_ethics_iraqi": True},
            islamic_compliance={"halal_medical_practices": True},
            professional_domains={"medical"},
            arabic_language_support=True,
            max_daily_usage=30
        )
        
        # Government tools
        self.tool_configs["citizen_service_portal"] = IraqiToolConfig(
            tool_name="citizen_service_portal",
            security_level=ToolSecurityLevel.GOVERNMENT,
            allowed_modes={IraqiMode.GOVERNMENT, IraqiMode.PROFESSIONAL},
            cultural_requirements={"government_protocols_iraqi": True},
            islamic_compliance={"government_service_halal": True},
            government_portal_access=True,
            requires_government_auth=True,
            arabic_language_support=True,
            rtl_interface_required=True
        )
        
        # Family tools
        self.tool_configs["family_planner"] = IraqiToolConfig(
            tool_name="family_planner",
            security_level=ToolSecurityLevel.PUBLIC,
            allowed_modes={IraqiMode.FAMILY, IraqiMode.GENERAL, IraqiMode.ISLAMIC},
            cultural_requirements={"family_values_iraqi": True},
            islamic_compliance={"family_planning_islamic": True, "prayer_time_aware": True},
            family_context_restrictions={"children_safe": True, "elders_respectful": True},
            arabic_language_support=True,
            iraqi_dialect_support=True
        )
        
        # Educational tools
        self.tool_configs["arabic_learning_assistant"] = IraqiToolConfig(
            tool_name="arabic_learning_assistant",
            security_level=ToolSecurityLevel.PUBLIC,
            allowed_modes={IraqiMode.EDUCATION, IraqiMode.CULTURAL, IraqiMode.FAMILY},
            cultural_requirements={"arabic_cultural_accuracy": True, "iraqi_dialect_support": True},
            islamic_compliance={"islamic_values_education": True},
            arabic_language_support=True,
            rtl_interface_required=True,
            iraqi_dialect_support=True
        )
    
    async def is_tool_allowed_for_mode(self, 
                                     tool_name: str, 
                                     context: ToolValidationContext,
                                     tool_requirements: Optional[Dict[str, Any]] = None,
                                     tool_params: Optional[Dict[str, Any]] = None) -> ToolValidationResult:
        """
        Comprehensive tool validation for Iraqi modes
        Based on Roo-Code's isToolAllowedForMode with Iraqi enhancements
        """
        
        # Create cache key
        cache_key = f"{tool_name}_{context.current_mode.value}_{context.user_id}_{hash(str(context.cultural_context))}"
        
        # Check cache first (with time validation)
        if cache_key in self.validation_cache:
            cached_result = self.validation_cache[cache_key]
            if (datetime.now() - cached_result.last_used).seconds < 300:  # 5 minute cache
                return cached_result
        
        # Get tool configuration
        tool_config = self.tool_configs.get(tool_name)
        if not tool_config:
            # Create default configuration for unknown tools
            tool_config = self._create_default_tool_config(tool_name, context)
        
        # Initialize validation result
        result = ToolValidationResult(
            result=ValidationResult.APPROVED,
            tool_name=tool_name,
            mode=context.current_mode,
            allowed=True,
            cultural_compliance_score=1.0,
            islamic_compliance_score=1.0,
            professional_compliance_score=1.0,
            family_safety_score=1.0
        )
        
        # Mode compatibility check
        if context.current_mode not in tool_config.allowed_modes:
            result.allowed = False
            result.result = ValidationResult.DENIED
            result.reasons.append(f"Tool not allowed in {context.current_mode.value} mode")
            return result
        
        # Security level validation
        security_check = await self._validate_security_level(tool_config, context)
        if not security_check["approved"]:
            result.allowed = False
            result.result = ValidationResult.DENIED
            result.reasons.extend(security_check["reasons"])
            return result
        
        # Islamic compliance validation
        islamic_approved, islamic_score, islamic_concerns = await self.islamic_validator.validate_islamic_compliance(
            tool_name, context.islamic_context, {
                "current_time": context.current_time,
                "prayer_schedule": context.prayer_schedule,
                **tool_params or {}
            }
        )
        result.islamic_compliance_score = islamic_score
        if islamic_concerns:
            result.reasons.extend(islamic_concerns)
        if not islamic_approved:
            result.allowed = False
            result.result = ValidationResult.ISLAMIC_REVIEW
        
        # Professional domain validation
        if context.professional_domain and tool_config.professional_domains:
            if context.professional_domain in tool_config.professional_domains:
                prof_approved, prof_score, prof_concerns = await self.professional_validator.validate_professional_domain(
                    tool_name, context.professional_domain, context.professional_credentials
                )
                result.professional_compliance_score = prof_score
                if prof_concerns:
                    result.reasons.extend(prof_concerns)
                if not prof_approved:
                    result.allowed = False
                    result.result = ValidationResult.REQUIRES_APPROVAL
        
        # Family context validation
        if context.family_context:
            family_safe, family_score, family_concerns = await self.family_validator.validate_family_context(
                tool_name, context.family_context
            )
            result.family_safety_score = family_score
            if family_concerns:
                result.reasons.extend(family_concerns)
            if not family_safe:
                result.allowed = False
                result.result = ValidationResult.CULTURAL_REVIEW
        
        # Cultural requirements validation
        cultural_validation = await self._validate_cultural_requirements(tool_config, context)
        result.cultural_compliance_score = cultural_validation["score"]
        if cultural_validation["concerns"]:
            result.reasons.extend(cultural_validation["concerns"])
        if not cultural_validation["approved"]:
            result.allowed = False
            result.result = ValidationResult.CULTURAL_REVIEW
        
        # Usage limits validation
        usage_validation = await self._validate_usage_limits(tool_config, context)
        if not usage_validation["approved"]:
            result.allowed = False
            result.result = ValidationResult.RESTRICTED
            result.reasons.extend(usage_validation["reasons"])
        
        # Time restrictions validation
        time_validation = await self._validate_time_restrictions(tool_config, context)
        if not time_validation["approved"]:
            result.allowed = False
            result.result = ValidationResult.RESTRICTED
            result.reasons.extend(time_validation["reasons"])
        
        # Generate alternatives if tool is not allowed
        if not result.allowed:
            result.alternatives = await self._suggest_alternatives(tool_name, context)
        
        # Generate usage requirements
        result.requirements = await self._generate_requirements(tool_config, context)
        
        # Update usage tracking
        await self._update_usage_tracking(tool_name, context, result)
        
        # Cache result
        result.last_used = datetime.now()
        self.validation_cache[cache_key] = result
        
        return result
    
    def _create_default_tool_config(self, tool_name: str, context: ToolValidationContext) -> IraqiToolConfig:
        """Create default configuration for unknown tools"""
        
        # Determine security level based on tool name patterns
        if any(keyword in tool_name.lower() for keyword in ["government", "official", "classified"]):
            security_level = ToolSecurityLevel.GOVERNMENT
        elif any(keyword in tool_name.lower() for keyword in ["medical", "legal", "professional"]):
            security_level = ToolSecurityLevel.PROFESSIONAL
        elif any(keyword in tool_name.lower() for keyword in ["sensitive", "private", "confidential"]):
            security_level = ToolSecurityLevel.SENSITIVE
        else:
            security_level = ToolSecurityLevel.PUBLIC
        
        # Determine allowed modes
        allowed_modes = {IraqiMode.GENERAL}
        if "family" in tool_name.lower():
            allowed_modes.add(IraqiMode.FAMILY)
        if "professional" in tool_name.lower():
            allowed_modes.add(IraqiMode.PROFESSIONAL)
        if "islamic" in tool_name.lower() or "prayer" in tool_name.lower():
            allowed_modes.add(IraqiMode.ISLAMIC)
        
        return IraqiToolConfig(
            tool_name=tool_name,
            security_level=security_level,
            allowed_modes=allowed_modes,
            cultural_requirements={"basic_cultural_compliance": True},
            islamic_compliance={"basic_islamic_compliance": True},
            arabic_language_support="arabic" in tool_name.lower(),
            rtl_interface_required="arabic" in tool_name.lower()
        )
    
    async def _validate_security_level(self, tool_config: IraqiToolConfig, context: ToolValidationContext) -> Dict[str, Any]:
        """Validate security level requirements"""
        
        security_level = tool_config.security_level
        reasons = []
        
        if security_level == ToolSecurityLevel.GOVERNMENT:
            if not context.government_clearance:
                reasons.append("Government clearance required")
                return {"approved": False, "reasons": reasons}
            if tool_config.requires_government_auth and not context.government_context.get("authenticated", False):
                reasons.append("Government authentication required")
                return {"approved": False, "reasons": reasons}
        
        elif security_level == ToolSecurityLevel.PROFESSIONAL:
            if not context.professional_domain:
                reasons.append("Professional domain context required")
                return {"approved": False, "reasons": reasons}
            if not context.professional_credentials:
                reasons.append("Professional credentials required")
                return {"approved": False, "reasons": reasons}
        
        elif security_level == ToolSecurityLevel.SENSITIVE:
            if context.cultural_validation_level < 0.9:
                reasons.append("Higher cultural validation level required for sensitive tools")
                return {"approved": False, "reasons": reasons}
        
        return {"approved": True, "reasons": []}
    
    async def _validate_cultural_requirements(self, tool_config: IraqiToolConfig, context: ToolValidationContext) -> Dict[str, Any]:
        """Validate cultural requirements"""
        
        concerns = []
        score = 1.0
        
        cultural_reqs = tool_config.cultural_requirements
        cultural_context = context.cultural_context
        
        for requirement, required_value in cultural_reqs.items():
            if requirement not in cultural_context:
                concerns.append(f"Missing cultural requirement: {requirement}")
                score -= 0.3
            elif cultural_context[requirement] != required_value:
                concerns.append(f"Cultural requirement not met: {requirement}")
                score -= 0.2
        
        # Arabic language support validation
        if tool_config.arabic_language_support:
            if not cultural_context.get("arabic_language_enabled", False):
                concerns.append("Arabic language support required but not enabled")
                score -= 0.4
        
        # Iraqi dialect support validation
        if tool_config.iraqi_dialect_support:
            if not cultural_context.get("iraqi_dialect_enabled", False):
                concerns.append("Iraqi dialect support required but not enabled")
                score -= 0.3
        
        approved = score >= 0.7 and len(concerns) <= 2
        return {"approved": approved, "score": max(0.0, score), "concerns": concerns}
    
    async def _validate_usage_limits(self, tool_config: IraqiToolConfig, context: ToolValidationContext) -> Dict[str, Any]:
        """Validate usage limits"""
        
        if not tool_config.max_daily_usage:
            return {"approved": True, "reasons": []}
        
        # Get today's usage count
        today = datetime.now().date()
        usage_key = f"{context.user_id}_{tool_config.tool_name}_{today}"
        today_usage = self.usage_tracker.get(usage_key, {}).get("count", 0)
        
        if today_usage >= tool_config.max_daily_usage:
            return {
                "approved": False, 
                "reasons": [f"Daily usage limit exceeded ({today_usage}/{tool_config.max_daily_usage})"]
            }
        
        return {"approved": True, "reasons": []}
    
    async def _validate_time_restrictions(self, tool_config: IraqiToolConfig, context: ToolValidationContext) -> Dict[str, Any]:
        """Validate time-based restrictions"""
        
        if not tool_config.time_restrictions:
            return {"approved": True, "reasons": []}
        
        current_time = context.current_time.time()
        restrictions = tool_config.time_restrictions
        reasons = []
        
        # Check allowed hours
        if "allowed_hours" in restrictions:
            allowed_start = datetime.strptime(restrictions["allowed_hours"]["start"], "%H:%M").time()
            allowed_end = datetime.strptime(restrictions["allowed_hours"]["end"], "%H:%M").time()
            
            if not (allowed_start <= current_time <= allowed_end):
                reasons.append(f"Tool only available between {restrictions['allowed_hours']['start']} and {restrictions['allowed_hours']['end']}")
        
        # Check forbidden hours
        if "forbidden_hours" in restrictions:
            for forbidden_period in restrictions["forbidden_hours"]:
                forbidden_start = datetime.strptime(forbidden_period["start"], "%H:%M").time()
                forbidden_end = datetime.strptime(forbidden_period["end"], "%H:%M").time()
                
                if forbidden_start <= current_time <= forbidden_end:
                    reasons.append(f"Tool not available during {forbidden_period['reason']}")
        
        approved = len(reasons) == 0
        return {"approved": approved, "reasons": reasons}
    
    async def _suggest_alternatives(self, tool_name: str, context: ToolValidationContext) -> List[str]:
        """Suggest alternative tools"""
        
        alternatives = []
        
        # Mode-specific alternatives
        mode_alternatives = {
            IraqiMode.FAMILY: ["family_safe_version", "children_appropriate_tool"],
            IraqiMode.ISLAMIC: ["islamic_compliant_version", "halal_alternative"],
            IraqiMode.PROFESSIONAL: ["professional_grade_tool", "domain_specific_tool"],
            IraqiMode.GOVERNMENT: ["government_approved_tool", "official_portal_tool"]
        }
        
        if context.current_mode in mode_alternatives:
            alternatives.extend(mode_alternatives[context.current_mode])
        
        # Tool-specific alternatives
        tool_alternatives = {
            "web_search": ["knowledge_base_search", "professional_database_search", "curated_content_search"],
            "content_generator": ["template_system", "guided_content_creator", "professional_content_library"],
            "social_media": ["family_communication_tool", "professional_network", "community_bulletin"]
        }
        
        base_tool = tool_name.split("_")[0] if "_" in tool_name else tool_name
        if base_tool in tool_alternatives:
            alternatives.extend(tool_alternatives[base_tool])
        
        return alternatives[:5]  # Limit to top 5 alternatives
    
    async def _generate_requirements(self, tool_config: IraqiToolConfig, context: ToolValidationContext) -> List[str]:
        """Generate usage requirements"""
        
        requirements = []
        
        # Security requirements
        if tool_config.security_level == ToolSecurityLevel.PROFESSIONAL:
            requirements.append("Professional credentials verification required")
        elif tool_config.security_level == ToolSecurityLevel.GOVERNMENT:
            requirements.append("Government authorization and security clearance required")
        
        # Cultural requirements
        if tool_config.cultural_requirements:
            requirements.append("Cultural compliance validation required")
        
        # Islamic compliance requirements
        if tool_config.islamic_compliance:
            requirements.append("Islamic compliance verification required")
        
        # Language requirements
        if tool_config.arabic_language_support:
            requirements.append("Arabic language interface enabled")
        if tool_config.rtl_interface_required:
            requirements.append("RTL (Right-to-Left) layout required")
        
        # Professional domain requirements
        if tool_config.professional_domains:
            requirements.append(f"Professional domain validation required: {', '.join(tool_config.professional_domains)}")
        
        return requirements
    
    async def _update_usage_tracking(self, tool_name: str, context: ToolValidationContext, result: ToolValidationResult):
        """Update usage tracking for analytics"""
        
        today = datetime.now().date()
        usage_key = f"{context.user_id}_{tool_name}_{today}"
        
        if usage_key not in self.usage_tracker:
            self.usage_tracker[usage_key] = {
                "count": 0,
                "first_used": datetime.now(),
                "last_used": datetime.now(),
                "approvals": 0,
                "denials": 0
            }
        
        usage_data = self.usage_tracker[usage_key]
        usage_data["count"] += 1
        usage_data["last_used"] = datetime.now()
        
        if result.allowed:
            usage_data["approvals"] += 1
        else:
            usage_data["denials"] += 1
        
        result.usage_count_today = usage_data["count"]
        result.last_used = usage_data["last_used"]
    
    async def get_usage_analytics(self, user_id: str, days: int = 7) -> Dict[str, Any]:
        """Get usage analytics for monitoring"""
        
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=days)
        
        analytics = {
            "period": {"start": start_date.isoformat(), "end": end_date.isoformat()},
            "total_requests": 0,
            "total_approvals": 0,
            "total_denials": 0,
            "tools_used": {},
            "modes_used": {},
            "cultural_compliance_rate": 0.0,
            "islamic_compliance_rate": 0.0
        }
        
        # Aggregate usage data
        for usage_key, usage_data in self.usage_tracker.items():
            if usage_key.startswith(user_id):
                date_str = usage_key.split("_")[-1]
                usage_date = datetime.strptime(date_str, "%Y-%m-%d").date()
                
                if start_date <= usage_date <= end_date:
                    analytics["total_requests"] += usage_data["count"]
                    analytics["total_approvals"] += usage_data["approvals"]
                    analytics["total_denials"] += usage_data["denials"]
                    
                    tool_name = "_".join(usage_key.split("_")[1:-1])
                    analytics["tools_used"][tool_name] = analytics["tools_used"].get(tool_name, 0) + usage_data["count"]
        
        # Calculate rates
        if analytics["total_requests"] > 0:
            analytics["approval_rate"] = analytics["total_approvals"] / analytics["total_requests"]
            analytics["denial_rate"] = analytics["total_denials"] / analytics["total_requests"]
        
        return analytics
    
    async def export_tool_catalog(self, file_path: Path) -> Dict[str, Any]:
        """Export comprehensive tool catalog for documentation"""
        
        catalog = {
            "generated_at": datetime.now().isoformat(),
            "total_tools": len(self.tool_configs),
            "tools": {},
            "modes": [mode.value for mode in IraqiMode],
            "security_levels": [level.value for level in ToolSecurityLevel]
        }
        
        for tool_name, config in self.tool_configs.items():
            catalog["tools"][tool_name] = {
                "security_level": config.security_level.value,
                "allowed_modes": [mode.value for mode in config.allowed_modes],
                "cultural_requirements": config.cultural_requirements,
                "islamic_compliance": config.islamic_compliance,
                "professional_domains": list(config.professional_domains),
                "arabic_support": config.arabic_language_support,
                "rtl_required": config.rtl_interface_required,
                "iraqi_dialect_support": config.iraqi_dialect_support,
                "max_daily_usage": config.max_daily_usage,
                "government_portal_access": config.government_portal_access
            }
        
        # Save catalog
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(catalog, f, indent=2, ensure_ascii=False)
        
        return catalog


# Example usage and testing
if __name__ == "__main__":
    async def test_cultural_tool_validator():
        """Test the cultural tool validator with various scenarios"""
        
        validator = CulturalToolValidator()
        
        # Test scenarios
        test_cases = [
            {
                "name": "Medical Professional Using Diagnosis Tool",
                "tool_name": "medical_diagnosis_helper",
                "context": ToolValidationContext(
                    user_id="dr_ahmed_123",
                    current_mode=IraqiMode.MEDICAL,
                    professional_domain="medical",
                    cultural_context={"arabic_language_enabled": True, "medical_ethics_iraqi": True},
                    islamic_context={"prayer_time_approaching": False, "halal_medical_practices": True},
                    professional_credentials={"medical_license": True, "continuing_education": True}
                )
            },
            {
                "name": "Family Context Arabic Learning",
                "tool_name": "arabic_learning_assistant",
                "context": ToolValidationContext(
                    user_id="family_user_456",
                    current_mode=IraqiMode.FAMILY,
                    cultural_context={"arabic_language_enabled": True, "iraqi_dialect_enabled": True},
                    islamic_context={"family_time_active": True},
                    family_context={"children_present": True, "elders_present": True}
                )
            },
            {
                "name": "Government Service Portal Access",
                "tool_name": "citizen_service_portal",
                "context": ToolValidationContext(
                    user_id="citizen_789",
                    current_mode=IraqiMode.GOVERNMENT,
                    cultural_context={"government_protocols_iraqi": True},
                    government_context={"authenticated": True},
                    government_clearance="level_2"
                )
            }
        ]
        
        # Run tests
        for test_case in test_cases:
            print(f"\n🧪 Testing: {test_case['name']}")
            
            result = await validator.is_tool_allowed_for_mode(
                test_case["tool_name"],
                test_case["context"]
            )
            
            print(f"  Result: {'✅ Allowed' if result.allowed else '❌ Denied'} ({result.result.value})")
            print(f"  Cultural Compliance: {result.cultural_compliance_score:.2%}")
            print(f"  Islamic Compliance: {result.islamic_compliance_score:.2%}")
            print(f"  Professional Compliance: {result.professional_compliance_score:.2%}")
            print(f"  Family Safety: {result.family_safety_score:.2%}")
            
            if result.reasons:
                print(f"  Reasons: {', '.join(result.reasons[:2])}")
            if result.alternatives:
                print(f"  Alternatives: {', '.join(result.alternatives[:2])}")
        
        # Export tool catalog
        print(f"\n📊 Exporting tool catalog...")
        catalog_path = Path("iraqi_tool_catalog.json")
        catalog = await validator.export_tool_catalog(catalog_path)
        print(f"  Catalog exported with {catalog['total_tools']} tools")
    
    # Run the test
    asyncio.run(test_cultural_tool_validator())