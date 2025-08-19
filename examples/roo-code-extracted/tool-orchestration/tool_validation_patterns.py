"""
Tool Validation Patterns - Islamic compliance validation for Iraqi AI tools
Part of Roo-Code extraction with comprehensive Iraqi cultural compliance

Implements Islamic compliance validation patterns for tool usage, extending Roo-Code's
validation approach with comprehensive Sharia-compliant tool evaluation, halal/haram
classification, and scholar consultation integration for Iraqi AI systems.
error handling strategies.

Features:
- Multi-step validation pipeline (Mode → Requirements → Parameters → Cultural)
- Advanced parameter validation with Iraqi cultural context
- Sophisticated error handling and recovery mechanisms  
- Performance optimization with validation caching
- Comprehensive audit logging for compliance tracking
- Tool orchestration patterns for complex workflows

Based on: RooCodeInc/Roo-Code tool validation patterns
Enhanced for: Iraqi AI Chat System with comprehensive compliance validation
"""

from typing import Dict, List, Optional, Any, Tuple, Union, Callable
from dataclasses import dataclass, field
from enum import Enum
import asyncio
import json
import re
from datetime import datetime, timedelta
from pathlib import Path
import logging


class ValidationStage(Enum):
    """Validation pipeline stages"""
    MODE_VALIDATION = "mode_validation"
    REQUIREMENT_CHECKING = "requirement_checking"
    PARAMETER_VALIDATION = "parameter_validation"
    CULTURAL_VALIDATION = "cultural_validation"
    SECURITY_VALIDATION = "security_validation"
    FINAL_APPROVAL = "final_approval"


class ParameterType(Enum):
    """Parameter types for validation"""
    STRING = "string"
    INTEGER = "integer"
    FLOAT = "float"
    BOOLEAN = "boolean"
    ARRAY = "array"
    OBJECT = "object"
    FILE_PATH = "file_path"
    URL = "url"
    EMAIL = "email"
    ARABIC_TEXT = "arabic_text"
    IRAQI_PHONE = "iraqi_phone"
    IRAQI_ID = "iraqi_id"
    PROFESSIONAL_ID = "professional_id"


class ValidationSeverity(Enum):
    """Validation error severity levels"""
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"
    SECURITY = "security"
    CULTURAL = "cultural"
    ISLAMIC = "islamic"


@dataclass
class ParameterSpec:
    """Parameter specification for validation"""
    name: str
    type: ParameterType
    required: bool = True
    default_value: Any = None
    min_length: Optional[int] = None
    max_length: Optional[int] = None
    min_value: Optional[Union[int, float]] = None
    max_value: Optional[Union[int, float]] = None
    pattern: Optional[str] = None
    allowed_values: Optional[List[Any]] = None
    
    # Iraqi-specific validations
    cultural_validation_required: bool = False
    islamic_compliance_required: bool = False
    arabic_text_validation: bool = False
    professional_domain_validation: Optional[str] = None
    government_clearance_required: bool = False
    
    # Custom validation functions
    custom_validators: List[Callable] = field(default_factory=list)
    transform_functions: List[Callable] = field(default_factory=list)


@dataclass
class ValidationError:
    """Validation error with detailed context"""
    stage: ValidationStage
    severity: ValidationSeverity
    code: str
    message: str
    parameter: Optional[str] = None
    expected: Any = None
    actual: Any = None
    suggestions: List[str] = field(default_factory=list)
    cultural_context: Optional[Dict[str, Any]] = None
    recovery_actions: List[str] = field(default_factory=list)


@dataclass
class ValidationResult:
    """Comprehensive validation result"""
    success: bool
    stage: ValidationStage
    errors: List[ValidationError] = field(default_factory=list)
    warnings: List[ValidationError] = field(default_factory=list)
    validated_parameters: Dict[str, Any] = field(default_factory=dict)
    cultural_compliance_score: float = 1.0
    islamic_compliance_score: float = 1.0
    performance_metrics: Dict[str, Any] = field(default_factory=dict)
    
    # Execution metadata
    validation_duration: float = 0.0
    cache_hit: bool = False
    audit_log_id: Optional[str] = None


class IraqiParameterValidator:
    """Iraqi-specific parameter validation"""
    
    def __init__(self):
        # Arabic text patterns
        self.arabic_pattern = re.compile(r'[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+')
        self.iraqi_dialect_markers = [
            'شلونك', 'شكو ماكو', 'وين رايح', 'كلش', 'شدعوة', 'مدري', 'خوش'
        ]
        
        # Iraqi phone number patterns
        self.iraqi_phone_patterns = [
            re.compile(r'^(\+964|0964|964)?[17]\d{8}$'),  # Mobile numbers
            re.compile(r'^(\+964|0964|964)?[1-9]\d{6,7}$')  # Landline numbers
        ]
        
        # Iraqi ID patterns
        self.iraqi_id_pattern = re.compile(r'^\d{12}$')  # 12-digit Iraqi ID
        
        # Professional ID patterns
        self.professional_id_patterns = {
            'medical': re.compile(r'^MED\d{6}$'),
            'legal': re.compile(r'^LAW\d{6}$'),
            'education': re.compile(r'^EDU\d{6}$'),
            'engineering': re.compile(r'^ENG\d{6}$')
        }
    
    async def validate_arabic_text(self, value: str, context: Dict[str, Any]) -> Tuple[bool, List[str]]:
        """Validate Arabic text with cultural considerations"""
        
        issues = []
        
        if not isinstance(value, str):
            issues.append("Arabic text must be a string")
            return False, issues
        
        # Check if text contains Arabic characters
        if not self.arabic_pattern.search(value):
            issues.append("Text does not contain Arabic characters")
        
        # Check for Iraqi dialect markers (bonus points)
        dialect_score = sum(1 for marker in self.iraqi_dialect_markers if marker in value)
        if dialect_score > 0:
            context['iraqi_dialect_detected'] = True
            context['dialect_score'] = dialect_score
        
        # Check for inappropriate content (placeholder - would use actual content filtering)
        if await self._contains_inappropriate_arabic_content(value):
            issues.append("Text contains culturally inappropriate content")
        
        # Check text direction and formatting
        if not await self._validate_rtl_formatting(value):
            issues.append("Text formatting may not display correctly in RTL layout")
        
        # Validate religious content appropriateness
        if context.get('religious_context', False):
            if not await self._validate_religious_arabic_content(value, context):
                issues.append("Religious content does not meet Islamic standards")
        
        return len(issues) == 0, issues
    
    async def validate_iraqi_phone(self, value: str, context: Dict[str, Any]) -> Tuple[bool, List[str]]:
        """Validate Iraqi phone numbers"""
        
        issues = []
        
        if not isinstance(value, str):
            issues.append("Phone number must be a string")
            return False, issues
        
        # Clean phone number (remove spaces, dashes, etc.)
        cleaned_phone = re.sub(r'[^\d+]', '', value)
        
        # Check against Iraqi phone patterns
        is_valid = any(pattern.match(cleaned_phone) for pattern in self.iraqi_phone_patterns)
        
        if not is_valid:
            issues.append("Invalid Iraqi phone number format")
            issues.append("Expected formats: +964XXXXXXXXX, 07XXXXXXXX, or landline")
        
        # Validate area codes for governorates
        if cleaned_phone.startswith(('0964', '964', '+964')):
            area_code_validation = await self._validate_iraqi_area_code(cleaned_phone)
            if not area_code_validation['valid']:
                issues.append(f"Invalid area code: {area_code_validation['message']}")
        
        return len(issues) == 0, issues
    
    async def validate_iraqi_id(self, value: str, context: Dict[str, Any]) -> Tuple[bool, List[str]]:
        """Validate Iraqi national ID"""
        
        issues = []
        
        if not isinstance(value, str):
            issues.append("Iraqi ID must be a string")
            return False, issues
        
        # Clean ID (remove spaces, dashes)
        cleaned_id = re.sub(r'[^\d]', '', value)
        
        # Check pattern
        if not self.iraqi_id_pattern.match(cleaned_id):
            issues.append("Iraqi ID must be 12 digits")
            return False, issues
        
        # Validate checksum (simplified - actual algorithm would be more complex)
        if not await self._validate_iraqi_id_checksum(cleaned_id):
            issues.append("Invalid Iraqi ID checksum")
        
        # Check for privacy concerns
        if context.get('family_context', {}).get('children_present', False):
            issues.append("ID validation not appropriate when children are present")
        
        return len(issues) == 0, issues
    
    async def validate_professional_id(self, value: str, domain: str, context: Dict[str, Any]) -> Tuple[bool, List[str]]:
        """Validate professional ID for Iraqi domains"""
        
        issues = []
        
        if domain not in self.professional_id_patterns:
            issues.append(f"Unknown professional domain: {domain}")
            return False, issues
        
        pattern = self.professional_id_patterns[domain]
        
        if not pattern.match(value):
            issues.append(f"Invalid {domain} professional ID format")
            issues.append(f"Expected format: {pattern.pattern}")
        
        # Additional domain-specific validation
        if domain == 'medical':
            if not await self._validate_medical_license(value, context):
                issues.append("Medical license validation failed")
        elif domain == 'legal':
            if not await self._validate_legal_license(value, context):
                issues.append("Legal practice license validation failed")
        
        return len(issues) == 0, issues
    
    async def _contains_inappropriate_arabic_content(self, text: str) -> bool:
        """Check for inappropriate Arabic content (placeholder implementation)"""
        # In real implementation, this would use sophisticated content filtering
        inappropriate_terms = ['سيء', 'غير مناسب']  # Placeholder terms
        return any(term in text for term in inappropriate_terms)
    
    async def _validate_rtl_formatting(self, text: str) -> bool:
        """Validate RTL text formatting"""
        # Check for proper RTL markers and formatting
        # This is a simplified check - real implementation would be more sophisticated
        return not any(char in text for char in ['<', '>', '{', '}']) or '&rlm;' in text
    
    async def _validate_religious_arabic_content(self, text: str, context: Dict[str, Any]) -> bool:
        """Validate religious Arabic content appropriateness"""
        # Check for proper religious terminology and context
        religious_terms = ['الله', 'الرحمن', 'الرحيم', 'صلى الله عليه وسلم']
        if any(term in text for term in religious_terms):
            # Ensure proper context and respect
            return context.get('religious_context_validated', True)
        return True
    
    async def _validate_iraqi_area_code(self, phone: str) -> Dict[str, Any]:
        """Validate Iraqi area codes"""
        # Simplified area code validation
        area_codes = {
            '07': 'Mobile networks',
            '01': 'Baghdad',
            '030': 'Basra',
            '040': 'Mosul',
            '050': 'Erbil'
        }
        
        for code, region in area_codes.items():
            if phone.endswith(phone.replace('+964', '').replace('0964', '').replace('964', '').startswith(code)):
                return {'valid': True, 'region': region}
        
        return {'valid': False, 'message': 'Unknown area code'}
    
    async def _validate_iraqi_id_checksum(self, id_number: str) -> bool:
        """Validate Iraqi ID checksum (simplified)"""
        # Simplified checksum validation - real implementation would use official algorithm
        return len(id_number) == 12 and id_number.isdigit()
    
    async def _validate_medical_license(self, license_id: str, context: Dict[str, Any]) -> bool:
        """Validate medical license"""
        # In real implementation, this would check against medical board database
        return license_id.startswith('MED') and len(license_id) == 9
    
    async def _validate_legal_license(self, license_id: str, context: Dict[str, Any]) -> bool:
        """Validate legal practice license"""
        # In real implementation, this would check against bar association database
        return license_id.startswith('LAW') and len(license_id) == 9


class CulturalContextValidator:
    """Cultural context validation for Iraqi parameters"""
    
    def __init__(self):
        self.cultural_rules = {
            'family_context_sensitive': self._validate_family_sensitivity,
            'islamic_compliance': self._validate_islamic_compliance,
            'professional_appropriateness': self._validate_professional_appropriateness,
            'government_protocol_compliance': self._validate_government_protocols,
            'arabic_cultural_accuracy': self._validate_arabic_cultural_accuracy
        }
    
    async def validate_cultural_context(self, parameters: Dict[str, Any], context: Dict[str, Any]) -> Tuple[bool, List[str], float]:
        """Validate parameters against Iraqi cultural context"""
        
        issues = []
        cultural_score = 1.0
        
        for rule_name, rule_func in self.cultural_rules.items():
            if context.get(f'{rule_name}_required', False):
                is_valid, rule_issues, rule_score = await rule_func(parameters, context)
                if not is_valid:
                    issues.extend(rule_issues)
                cultural_score = min(cultural_score, rule_score)
        
        return len(issues) == 0, issues, cultural_score
    
    async def _validate_family_sensitivity(self, parameters: Dict[str, Any], context: Dict[str, Any]) -> Tuple[bool, List[str], float]:
        """Validate family context sensitivity"""
        
        issues = []
        score = 1.0
        
        family_context = context.get('family_context', {})
        
        if family_context.get('children_present', False):
            # Check for child-appropriate content
            for param_name, param_value in parameters.items():
                if isinstance(param_value, str) and len(param_value) > 100:
                    if await self._contains_adult_content(param_value):
                        issues.append(f"Parameter {param_name} contains content not suitable for children")
                        score -= 0.4
        
        if family_context.get('elders_present', False):
            # Check for respectful language and content
            for param_name, param_value in parameters.items():
                if isinstance(param_value, str):
                    if await self._contains_disrespectful_content(param_value):
                        issues.append(f"Parameter {param_name} contains content not respectful to elders")
                        score -= 0.3
        
        return len(issues) == 0, issues, max(0.0, score)
    
    async def _validate_islamic_compliance(self, parameters: Dict[str, Any], context: Dict[str, Any]) -> Tuple[bool, List[str], float]:
        """Validate Islamic compliance"""
        
        issues = []
        score = 1.0
        
        islamic_context = context.get('islamic_context', {})
        
        # Check for prayer time considerations
        if islamic_context.get('prayer_time_approaching', False):
            for param_name, param_value in parameters.items():
                if param_name in ['notification_sound', 'alert_volume']:
                    if isinstance(param_value, (int, float)) and param_value > 5:
                        issues.append(f"High {param_name} not appropriate near prayer time")
                        score -= 0.2
        
        # Check for Ramadan considerations
        if islamic_context.get('ramadan_month', False) and islamic_context.get('fasting_hours', False):
            food_related_params = ['meal_reminder', 'food_notification', 'restaurant_search']
            for param_name in food_related_params:
                if param_name in parameters:
                    issues.append(f"Parameter {param_name} not appropriate during Ramadan fasting hours")
                    score -= 0.3
        
        # Check for halal compliance in business contexts
        if context.get('business_context', False):
            financial_params = ['interest_rate', 'loan_terms', 'investment_type']
            for param_name in financial_params:
                if param_name in parameters and parameters[param_name]:
                    if not await self._validate_sharia_compliance(param_name, parameters[param_name]):
                        issues.append(f"Parameter {param_name} may not be Sharia-compliant")
                        score -= 0.4
        
        return len(issues) == 0, issues, max(0.0, score)
    
    async def _validate_professional_appropriateness(self, parameters: Dict[str, Any], context: Dict[str, Any]) -> Tuple[bool, List[str], float]:
        """Validate professional appropriateness"""
        
        issues = []
        score = 1.0
        
        professional_domain = context.get('professional_domain')
        if not professional_domain:
            return True, [], 1.0
        
        domain_rules = {
            'medical': {
                'required_disclaimers': ['medical_advice_disclaimer'],
                'prohibited_claims': ['guarantee_cure', 'medical_diagnosis_final'],
                'privacy_requirements': ['patient_consent', 'data_anonymization']
            },
            'legal': {
                'required_disclaimers': ['legal_advice_disclaimer'],
                'prohibited_claims': ['guaranteed_outcome', 'court_victory_promise'],
                'privacy_requirements': ['client_confidentiality', 'attorney_client_privilege']
            }
        }
        
        if professional_domain in domain_rules:
            rules = domain_rules[professional_domain]
            
            # Check required disclaimers
            for required_disclaimer in rules['required_disclaimers']:
                if required_disclaimer not in parameters:
                    issues.append(f"Missing required {professional_domain} disclaimer: {required_disclaimer}")
                    score -= 0.3
            
            # Check for prohibited claims
            for param_name, param_value in parameters.items():
                if isinstance(param_value, str):
                    for prohibited_claim in rules['prohibited_claims']:
                        if prohibited_claim.replace('_', ' ') in param_value.lower():
                            issues.append(f"Prohibited {professional_domain} claim in {param_name}")
                            score -= 0.5
        
        return len(issues) == 0, issues, max(0.0, score)
    
    async def _validate_government_protocols(self, parameters: Dict[str, Any], context: Dict[str, Any]) -> Tuple[bool, List[str], float]:
        """Validate government protocol compliance"""
        
        issues = []
        score = 1.0
        
        government_context = context.get('government_context', {})
        if not government_context:
            return True, [], 1.0
        
        # Check security clearance requirements
        required_clearance = government_context.get('required_clearance_level')
        user_clearance = government_context.get('user_clearance_level')
        
        if required_clearance and user_clearance:
            clearance_levels = ['public', 'restricted', 'confidential', 'secret', 'top_secret']
            if clearance_levels.index(user_clearance) < clearance_levels.index(required_clearance):
                issues.append(f"Insufficient clearance level: {user_clearance} < {required_clearance}")
                score = 0.0
        
        # Check for classified information handling
        for param_name, param_value in parameters.items():
            if isinstance(param_value, str) and 'classified' in param_value.lower():
                if not government_context.get('classified_handling_authorized', False):
                    issues.append(f"Classified content in {param_name} without proper authorization")
                    score -= 0.8
        
        return len(issues) == 0, issues, max(0.0, score)
    
    async def _validate_arabic_cultural_accuracy(self, parameters: Dict[str, Any], context: Dict[str, Any]) -> Tuple[bool, List[str], float]:
        """Validate Arabic cultural accuracy"""
        
        issues = []
        score = 1.0
        
        arabic_context = context.get('arabic_context', {})
        
        for param_name, param_value in parameters.items():
            if isinstance(param_value, str) and await self._contains_arabic_text(param_value):
                # Check cultural appropriateness
                if not await self._validate_arabic_cultural_appropriateness(param_value, arabic_context):
                    issues.append(f"Arabic content in {param_name} may not be culturally appropriate")
                    score -= 0.3
                
                # Check dialect accuracy
                if arabic_context.get('iraqi_dialect_required', False):
                    if not await self._contains_iraqi_dialect_markers(param_value):
                        issues.append(f"Iraqi dialect expected in {param_name}")
                        score -= 0.2
        
        return len(issues) == 0, issues, max(0.0, score)
    
    async def _contains_adult_content(self, text: str) -> bool:
        """Check for adult content (placeholder)"""
        # Real implementation would use sophisticated content filtering
        return False
    
    async def _contains_disrespectful_content(self, text: str) -> bool:
        """Check for disrespectful content (placeholder)"""
        # Real implementation would check against cultural norms
        return False
    
    async def _validate_sharia_compliance(self, param_name: str, param_value: Any) -> bool:
        """Validate Sharia compliance for financial parameters"""
        # Simplified Sharia compliance check
        if param_name == 'interest_rate' and isinstance(param_value, (int, float)):
            return param_value == 0  # No interest allowed
        return True
    
    async def _contains_arabic_text(self, text: str) -> bool:
        """Check if text contains Arabic characters"""
        arabic_pattern = re.compile(r'[\u0600-\u06FF]')
        return bool(arabic_pattern.search(text))
    
    async def _validate_arabic_cultural_appropriateness(self, text: str, context: Dict[str, Any]) -> bool:
        """Validate Arabic cultural appropriateness"""
        # Placeholder implementation
        return True
    
    async def _contains_iraqi_dialect_markers(self, text: str) -> bool:
        """Check for Iraqi dialect markers"""
        iraqi_markers = ['شلونك', 'شكو ماكو', 'كلش']
        return any(marker in text for marker in iraqi_markers)


class ToolValidationPatterns:
    """
    Comprehensive tool validation patterns with Iraqi cultural enhancements
    Based on Roo-Code's multi-step validation approach
    """
    
    def __init__(self):
        self.iraqi_validator = IraqiParameterValidator()
        self.cultural_validator = CulturalContextValidator()
        
        # Validation cache for performance
        self.validation_cache: Dict[str, ValidationResult] = {}
        self.cache_ttl = 300  # 5 minutes
        
        # Audit logging
        self.audit_logger = logging.getLogger('iraqi_tool_validation')
        self.audit_events: List[Dict[str, Any]] = []
        
        # Performance metrics
        self.validation_metrics = {
            "total_validations": 0,
            "cache_hits": 0,
            "average_duration": 0.0,
            "error_count": 0,
            "cultural_violations": 0
        }
    
    async def validate_tool_parameters(self, 
                                     tool_name: str,
                                     parameters: Dict[str, Any],
                                     parameter_specs: List[ParameterSpec],
                                     context: Dict[str, Any]) -> ValidationResult:
        """
        Comprehensive tool parameter validation with Iraqi cultural compliance
        Following Roo-Code's multi-step validation approach
        """
        
        start_time = datetime.now()
        self.validation_metrics["total_validations"] += 1
        
        # Create cache key
        cache_key = f"{tool_name}_{hash(str(parameters))}_{hash(str(context))}"
        
        # Check cache
        if cache_key in self.validation_cache:
            cached_result = self.validation_cache[cache_key]
            if (datetime.now() - datetime.fromisoformat(cached_result.performance_metrics.get('timestamp', '1970-01-01'))).seconds < self.cache_ttl:
                cached_result.cache_hit = True
                self.validation_metrics["cache_hits"] += 1
                return cached_result
        
        # Initialize validation result
        result = ValidationResult(
            success=True,
            stage=ValidationStage.MODE_VALIDATION,
            performance_metrics={'timestamp': datetime.now().isoformat()}
        )
        
        try:
            # Stage 1: Mode Validation
            await self._validate_mode_compatibility(tool_name, context, result)
            if not result.success:
                return await self._finalize_result(result, start_time, cache_key)
            
            # Stage 2: Requirement Checking
            result.stage = ValidationStage.REQUIREMENT_CHECKING
            await self._validate_requirements(tool_name, context, result)
            if not result.success:
                return await self._finalize_result(result, start_time, cache_key)
            
            # Stage 3: Parameter Validation
            result.stage = ValidationStage.PARAMETER_VALIDATION
            await self._validate_parameters(parameters, parameter_specs, context, result)
            if not result.success:
                return await self._finalize_result(result, start_time, cache_key)
            
            # Stage 4: Cultural Validation
            result.stage = ValidationStage.CULTURAL_VALIDATION
            await self._validate_cultural_compliance(parameters, context, result)
            if not result.success:
                return await self._finalize_result(result, start_time, cache_key)
            
            # Stage 5: Security Validation
            result.stage = ValidationStage.SECURITY_VALIDATION
            await self._validate_security_requirements(tool_name, parameters, context, result)
            if not result.success:
                return await self._finalize_result(result, start_time, cache_key)
            
            # Stage 6: Final Approval
            result.stage = ValidationStage.FINAL_APPROVAL
            await self._generate_final_approval(tool_name, parameters, context, result)
            
        except Exception as e:
            error = ValidationError(
                stage=result.stage,
                severity=ValidationSeverity.CRITICAL,
                code="VALIDATION_EXCEPTION",
                message=f"Validation failed with exception: {str(e)}",
                recovery_actions=["Review input parameters", "Check system configuration", "Contact system administrator"]
            )
            result.errors.append(error)
            result.success = False
            self.validation_metrics["error_count"] += 1
        
        return await self._finalize_result(result, start_time, cache_key)
    
    async def _validate_mode_compatibility(self, tool_name: str, context: Dict[str, Any], result: ValidationResult):
        """Validate tool compatibility with current mode"""
        
        current_mode = context.get('current_mode', 'general')
        tool_modes = context.get('tool_allowed_modes', {}).get(tool_name, ['general'])
        
        if current_mode not in tool_modes:
            error = ValidationError(
                stage=ValidationStage.MODE_VALIDATION,
                severity=ValidationSeverity.ERROR,
                code="MODE_INCOMPATIBLE",
                message=f"Tool {tool_name} not compatible with mode {current_mode}",
                expected=tool_modes,
                actual=current_mode,
                suggestions=[f"Switch to compatible mode: {', '.join(tool_modes)}"],
                recovery_actions=["Change mode", "Use alternative tool"]
            )
            result.errors.append(error)
            result.success = False
    
    async def _validate_requirements(self, tool_name: str, context: Dict[str, Any], result: ValidationResult):
        """Validate tool requirements"""
        
        tool_requirements = context.get('tool_requirements', {}).get(tool_name, {})
        
        for requirement, required_value in tool_requirements.items():
            if requirement not in context:
                error = ValidationError(
                    stage=ValidationStage.REQUIREMENT_CHECKING,
                    severity=ValidationSeverity.ERROR,
                    code="MISSING_REQUIREMENT",
                    message=f"Missing required context: {requirement}",
                    parameter=requirement,
                    expected=required_value,
                    recovery_actions=["Provide missing requirement", "Use different tool"]
                )
                result.errors.append(error)
                result.success = False
            elif context[requirement] != required_value:
                error = ValidationError(
                    stage=ValidationStage.REQUIREMENT_CHECKING,
                    severity=ValidationSeverity.WARNING,
                    code="REQUIREMENT_MISMATCH",
                    message=f"Requirement mismatch for {requirement}",
                    parameter=requirement,
                    expected=required_value,
                    actual=context[requirement],
                    suggestions=["Update context to match requirements"]
                )
                result.warnings.append(error)
    
    async def _validate_parameters(self, 
                                 parameters: Dict[str, Any], 
                                 parameter_specs: List[ParameterSpec], 
                                 context: Dict[str, Any], 
                                 result: ValidationResult):
        """Comprehensive parameter validation"""
        
        validated_params = {}
        
        # Create parameter spec lookup
        spec_lookup = {spec.name: spec for spec in parameter_specs}
        
        # Validate required parameters
        for spec in parameter_specs:
            if spec.required and spec.name not in parameters:
                error = ValidationError(
                    stage=ValidationStage.PARAMETER_VALIDATION,
                    severity=ValidationSeverity.ERROR,
                    code="MISSING_REQUIRED_PARAMETER",
                    message=f"Missing required parameter: {spec.name}",
                    parameter=spec.name,
                    recovery_actions=["Provide required parameter", "Use default value if available"]
                )
                result.errors.append(error)
                result.success = False
                continue
            elif not spec.required and spec.name not in parameters:
                # Use default value
                if spec.default_value is not None:
                    validated_params[spec.name] = spec.default_value
                continue
            
            # Get parameter value
            param_value = parameters[spec.name]
            
            # Type validation
            type_valid, type_errors = await self._validate_parameter_type(param_value, spec)
            if not type_valid:
                for error_msg in type_errors:
                    error = ValidationError(
                        stage=ValidationStage.PARAMETER_VALIDATION,
                        severity=ValidationSeverity.ERROR,
                        code="PARAMETER_TYPE_ERROR",
                        message=error_msg,
                        parameter=spec.name,
                        expected=spec.type.value,
                        actual=type(param_value).__name__,
                        recovery_actions=["Convert parameter to correct type", "Provide valid parameter value"]
                    )
                    result.errors.append(error)
                    result.success = False
                continue
            
            # Iraqi-specific validation
            if spec.type in [ParameterType.ARABIC_TEXT, ParameterType.IRAQI_PHONE, ParameterType.IRAQI_ID, ParameterType.PROFESSIONAL_ID]:
                iraqi_valid, iraqi_errors = await self._validate_iraqi_parameter(param_value, spec, context)
                if not iraqi_valid:
                    for error_msg in iraqi_errors:
                        error = ValidationError(
                            stage=ValidationStage.PARAMETER_VALIDATION,
                            severity=ValidationSeverity.ERROR,
                            code="IRAQI_VALIDATION_ERROR",
                            message=error_msg,
                            parameter=spec.name,
                            cultural_context=context.get('cultural_context'),
                            recovery_actions=["Correct parameter format", "Verify Iraqi-specific requirements"]
                        )
                        result.errors.append(error)
                        result.success = False
                    continue
            
            # Custom validators
            if spec.custom_validators:
                for validator in spec.custom_validators:
                    try:
                        validator_result = await validator(param_value, context)
                        if not validator_result.get('valid', True):
                            error = ValidationError(
                                stage=ValidationStage.PARAMETER_VALIDATION,
                                severity=ValidationSeverity.ERROR,
                                code="CUSTOM_VALIDATION_ERROR",
                                message=validator_result.get('message', 'Custom validation failed'),
                                parameter=spec.name,
                                recovery_actions=validator_result.get('recovery_actions', ["Fix parameter value"])
                            )
                            result.errors.append(error)
                            result.success = False
                    except Exception as e:
                        error = ValidationError(
                            stage=ValidationStage.PARAMETER_VALIDATION,
                            severity=ValidationSeverity.WARNING,
                            code="CUSTOM_VALIDATOR_ERROR",
                            message=f"Custom validator failed: {str(e)}",
                            parameter=spec.name
                        )
                        result.warnings.append(error)
            
            # Apply transformations
            transformed_value = param_value
            if spec.transform_functions:
                for transform in spec.transform_functions:
                    try:
                        transformed_value = await transform(transformed_value, context)
                    except Exception as e:
                        error = ValidationError(
                            stage=ValidationStage.PARAMETER_VALIDATION,
                            severity=ValidationSeverity.WARNING,
                            code="TRANSFORM_ERROR",
                            message=f"Parameter transformation failed: {str(e)}",
                            parameter=spec.name
                        )
                        result.warnings.append(error)
            
            validated_params[spec.name] = transformed_value
        
        # Check for unexpected parameters
        for param_name in parameters:
            if param_name not in spec_lookup:
                error = ValidationError(
                    stage=ValidationStage.PARAMETER_VALIDATION,
                    severity=ValidationSeverity.WARNING,
                    code="UNEXPECTED_PARAMETER",
                    message=f"Unexpected parameter: {param_name}",
                    parameter=param_name,
                    suggestions=["Remove unexpected parameter", "Check parameter specification"]
                )
                result.warnings.append(error)
        
        result.validated_parameters = validated_params
    
    async def _validate_parameter_type(self, value: Any, spec: ParameterSpec) -> Tuple[bool, List[str]]:
        """Validate parameter type"""
        
        errors = []
        
        # Type checking
        if spec.type == ParameterType.STRING:
            if not isinstance(value, str):
                errors.append(f"Expected string, got {type(value).__name__}")
            elif spec.min_length and len(value) < spec.min_length:
                errors.append(f"String too short: {len(value)} < {spec.min_length}")
            elif spec.max_length and len(value) > spec.max_length:
                errors.append(f"String too long: {len(value)} > {spec.max_length}")
            elif spec.pattern and not re.match(spec.pattern, value):
                errors.append(f"String does not match pattern: {spec.pattern}")
        
        elif spec.type == ParameterType.INTEGER:
            if not isinstance(value, int):
                errors.append(f"Expected integer, got {type(value).__name__}")
            elif spec.min_value is not None and value < spec.min_value:
                errors.append(f"Value too small: {value} < {spec.min_value}")
            elif spec.max_value is not None and value > spec.max_value:
                errors.append(f"Value too large: {value} > {spec.max_value}")
        
        elif spec.type == ParameterType.FLOAT:
            if not isinstance(value, (int, float)):
                errors.append(f"Expected number, got {type(value).__name__}")
            elif spec.min_value is not None and value < spec.min_value:
                errors.append(f"Value too small: {value} < {spec.min_value}")
            elif spec.max_value is not None and value > spec.max_value:
                errors.append(f"Value too large: {value} > {spec.max_value}")
        
        elif spec.type == ParameterType.BOOLEAN:
            if not isinstance(value, bool):
                errors.append(f"Expected boolean, got {type(value).__name__}")
        
        elif spec.type == ParameterType.ARRAY:
            if not isinstance(value, list):
                errors.append(f"Expected array, got {type(value).__name__}")
            elif spec.min_length and len(value) < spec.min_length:
                errors.append(f"Array too short: {len(value)} < {spec.min_length}")
            elif spec.max_length and len(value) > spec.max_length:
                errors.append(f"Array too long: {len(value)} > {spec.max_length}")
        
        # Check allowed values
        if spec.allowed_values and value not in spec.allowed_values:
            errors.append(f"Value not in allowed list: {spec.allowed_values}")
        
        return len(errors) == 0, errors
    
    async def _validate_iraqi_parameter(self, value: Any, spec: ParameterSpec, context: Dict[str, Any]) -> Tuple[bool, List[str]]:
        """Validate Iraqi-specific parameters"""
        
        if spec.type == ParameterType.ARABIC_TEXT:
            return await self.iraqi_validator.validate_arabic_text(value, context)
        elif spec.type == ParameterType.IRAQI_PHONE:
            return await self.iraqi_validator.validate_iraqi_phone(value, context)
        elif spec.type == ParameterType.IRAQI_ID:
            return await self.iraqi_validator.validate_iraqi_id(value, context)
        elif spec.type == ParameterType.PROFESSIONAL_ID:
            domain = spec.professional_domain_validation or context.get('professional_domain', 'general')
            return await self.iraqi_validator.validate_professional_id(value, domain, context)
        
        return True, []
    
    async def _validate_cultural_compliance(self, parameters: Dict[str, Any], context: Dict[str, Any], result: ValidationResult):
        """Validate cultural compliance"""
        
        cultural_valid, cultural_issues, cultural_score = await self.cultural_validator.validate_cultural_context(
            parameters, context
        )
        
        result.cultural_compliance_score = cultural_score
        
        if not cultural_valid:
            for issue in cultural_issues:
                error = ValidationError(
                    stage=ValidationStage.CULTURAL_VALIDATION,
                    severity=ValidationSeverity.CULTURAL,
                    code="CULTURAL_COMPLIANCE_ERROR",
                    message=issue,
                    cultural_context=context.get('cultural_context'),
                    recovery_actions=["Review cultural requirements", "Adjust parameters for cultural appropriateness"]
                )
                result.errors.append(error)
            
            if cultural_score < 0.7:
                result.success = False
                self.validation_metrics["cultural_violations"] += 1
    
    async def _validate_security_requirements(self, tool_name: str, parameters: Dict[str, Any], context: Dict[str, Any], result: ValidationResult):
        """Validate security requirements"""
        
        security_context = context.get('security_context', {})
        
        # Check for sensitive data in parameters
        for param_name, param_value in parameters.items():
            if isinstance(param_value, str):
                if await self._contains_sensitive_data(param_value):
                    error = ValidationError(
                        stage=ValidationStage.SECURITY_VALIDATION,
                        severity=ValidationSeverity.SECURITY,
                        code="SENSITIVE_DATA_DETECTED",
                        message=f"Sensitive data detected in parameter: {param_name}",
                        parameter=param_name,
                        recovery_actions=["Remove sensitive data", "Use data anonymization", "Apply encryption"]
                    )
                    result.errors.append(error)
                    result.success = False
        
        # Check encryption requirements
        if security_context.get('encryption_required', False):
            for param_name, param_value in parameters.items():
                if isinstance(param_value, str) and len(param_value) > 50:
                    if not param_value.startswith('encrypted:'):
                        error = ValidationError(
                            stage=ValidationStage.SECURITY_VALIDATION,
                            severity=ValidationSeverity.SECURITY,
                            code="ENCRYPTION_REQUIRED",
                            message=f"Parameter {param_name} requires encryption",
                            parameter=param_name,
                            recovery_actions=["Apply encryption to parameter", "Use secure parameter handling"]
                        )
                        result.errors.append(error)
                        result.success = False
    
    async def _generate_final_approval(self, tool_name: str, parameters: Dict[str, Any], context: Dict[str, Any], result: ValidationResult):
        """Generate final approval decision"""
        
        # Calculate overall compliance score
        overall_score = (
            result.cultural_compliance_score * 0.4 +
            result.islamic_compliance_score * 0.3 +
            (1.0 if len(result.errors) == 0 else 0.5) * 0.3
        )
        
        # Set Islamic compliance score if not set
        if result.islamic_compliance_score == 1.0 and context.get('islamic_context'):
            # Calculate based on validation results
            islamic_errors = [e for e in result.errors if e.severity == ValidationSeverity.ISLAMIC]
            result.islamic_compliance_score = max(0.0, 1.0 - len(islamic_errors) * 0.3)
        
        # Final decision
        if overall_score >= 0.8 and len([e for e in result.errors if e.severity in [ValidationSeverity.CRITICAL, ValidationSeverity.SECURITY]]) == 0:
            result.success = True
        else:
            result.success = False
            
            if overall_score < 0.8:
                error = ValidationError(
                    stage=ValidationStage.FINAL_APPROVAL,
                    severity=ValidationSeverity.ERROR,
                    code="OVERALL_COMPLIANCE_LOW",
                    message=f"Overall compliance score too low: {overall_score:.2%}",
                    recovery_actions=["Improve cultural compliance", "Fix validation errors", "Review Islamic compliance"]
                )
                result.errors.append(error)
    
    async def _contains_sensitive_data(self, text: str) -> bool:
        """Check for sensitive data patterns"""
        
        sensitive_patterns = [
            r'\b\d{12}\b',  # Iraqi ID pattern
            r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b',  # Credit card pattern
            r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',  # Email pattern
            r'\b(?:\+964|0964|964)?[17]\d{8}\b'  # Iraqi phone pattern
        ]
        
        for pattern in sensitive_patterns:
            if re.search(pattern, text):
                return True
        
        return False
    
    async def _finalize_result(self, result: ValidationResult, start_time: datetime, cache_key: str) -> ValidationResult:
        """Finalize validation result with metrics and caching"""
        
        # Calculate duration
        duration = (datetime.now() - start_time).total_seconds()
        result.validation_duration = duration
        
        # Update metrics
        self.validation_metrics["average_duration"] = (
            (self.validation_metrics["average_duration"] * (self.validation_metrics["total_validations"] - 1) + duration) /
            self.validation_metrics["total_validations"]
        )
        
        # Cache successful results
        if result.success:
            self.validation_cache[cache_key] = result
        
        # Log audit event
        audit_event = {
            "timestamp": datetime.now().isoformat(),
            "success": result.success,
            "stage": result.stage.value,
            "duration": duration,
            "error_count": len(result.errors),
            "warning_count": len(result.warnings),
            "cultural_score": result.cultural_compliance_score,
            "islamic_score": result.islamic_compliance_score
        }
        
        self.audit_events.append(audit_event)
        result.audit_log_id = str(len(self.audit_events))
        
        return result
    
    async def get_validation_metrics(self) -> Dict[str, Any]:
        """Get comprehensive validation metrics"""
        
        return {
            **self.validation_metrics,
            "cache_hit_rate": self.validation_metrics["cache_hits"] / max(1, self.validation_metrics["total_validations"]),
            "error_rate": self.validation_metrics["error_count"] / max(1, self.validation_metrics["total_validations"]),
            "cultural_violation_rate": self.validation_metrics["cultural_violations"] / max(1, self.validation_metrics["total_validations"]),
            "recent_audit_events": self.audit_events[-10:]  # Last 10 events
        }
    
    async def export_audit_log(self, file_path: Path) -> Dict[str, Any]:
        """Export comprehensive audit log"""
        
        audit_summary = {
            "generated_at": datetime.now().isoformat(),
            "total_events": len(self.audit_events),
            "metrics": await self.get_validation_metrics(),
            "events": self.audit_events
        }
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(audit_summary, f, indent=2, ensure_ascii=False)
        
        return audit_summary


# Example usage and testing
if __name__ == "__main__":
    async def test_tool_validation_patterns():
        """Test the tool validation patterns with Iraqi scenarios"""
        
        validator = ToolValidationPatterns()
        
        # Define test parameter specifications
        parameter_specs = [
            ParameterSpec(
                name="patient_name",
                type=ParameterType.ARABIC_TEXT,
                required=True,
                cultural_validation_required=True,
                arabic_text_validation=True
            ),
            ParameterSpec(
                name="patient_id",
                type=ParameterType.IRAQI_ID,
                required=True,
                islamic_compliance_required=True
            ),
            ParameterSpec(
                name="doctor_license",
                type=ParameterType.PROFESSIONAL_ID,
                required=True,
                professional_domain_validation="medical"
            ),
            ParameterSpec(
                name="appointment_notes",
                type=ParameterType.STRING,
                required=False,
                max_length=500,
                cultural_validation_required=True
            )
        ]
        
        # Test cases
        test_cases = [
            {
                "name": "Valid Medical Appointment",
                "tool_name": "medical_appointment_scheduler",
                "parameters": {
                    "patient_name": "أحمد محمد علي",
                    "patient_id": "123456789012",
                    "doctor_license": "MED123456",
                    "appointment_notes": "فحص دوري للمريض"
                },
                "context": {
                    "current_mode": "medical",
                    "professional_domain": "medical",
                    "cultural_context": {"arabic_language_enabled": True, "family_context_sensitive": True},
                    "islamic_context": {"prayer_time_approaching": False, "halal_medical_practices": True},
                    "family_context": {"children_present": False}
                }
            },
            {
                "name": "Invalid Iraqi ID",
                "tool_name": "medical_appointment_scheduler",
                "parameters": {
                    "patient_name": "أحمد محمد علي",
                    "patient_id": "invalid_id",
                    "doctor_license": "MED123456",
                    "appointment_notes": "فحص دوري للمريض"
                },
                "context": {
                    "current_mode": "medical",
                    "professional_domain": "medical",
                    "cultural_context": {"arabic_language_enabled": True},
                    "islamic_context": {"halal_medical_practices": True}
                }
            }
        ]
        
        # Run tests
        for test_case in test_cases:
            print(f"\n🧪 Testing: {test_case['name']}")
            
            result = await validator.validate_tool_parameters(
                test_case["tool_name"],
                test_case["parameters"],
                parameter_specs,
                test_case["context"]
            )
            
            print(f"  Success: {'✅' if result.success else '❌'}")
            print(f"  Stage: {result.stage.value}")
            print(f"  Cultural Score: {result.cultural_compliance_score:.2%}")
            print(f"  Islamic Score: {result.islamic_compliance_score:.2%}")
            print(f"  Duration: {result.validation_duration:.3f}s")
            print(f"  Cache Hit: {'Yes' if result.cache_hit else 'No'}")
            
            if result.errors:
                print(f"  Errors ({len(result.errors)}):")
                for error in result.errors[:2]:  # Show first 2 errors
                    print(f"    - {error.code}: {error.message}")
            
            if result.warnings:
                print(f"  Warnings ({len(result.warnings)}):")
                for warning in result.warnings[:2]:  # Show first 2 warnings
                    print(f"    - {warning.code}: {warning.message}")
        
        # Print final metrics
        print(f"\n📊 Validation Metrics:")
        metrics = await validator.get_validation_metrics()
        for key, value in metrics.items():
            if isinstance(value, float):
                print(f"  {key}: {value:.3f}")
            elif key != "recent_audit_events":
                print(f"  {key}: {value}")
    
    # Run the test
    asyncio.run(test_tool_validation_patterns())