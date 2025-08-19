"""
Cultural Validation Middleware for Iraqi API Router
Enhanced middleware with comprehensive cultural validation, Islamic compliance, and professional domain awareness.

Key Features:
- Pre-request cultural validation with Islamic compliance checking
- Post-response cultural appropriateness validation 
- Professional domain context validation for Iraqi sectors
- Arabic content validation and RTL processing verification
- Family context sensitivity and religious appropriateness checking
- Performance monitoring with cultural metrics tracking
"""

from typing import Dict, List, Optional, Any, Union, Callable, Awaitable
from enum import Enum
from dataclasses import dataclass, field
from datetime import datetime
import asyncio
import logging
import json
from abc import ABC, abstractmethod

# Enhanced imports for cultural validation
from arabic_support import ArabicContentValidator, RTLValidationEngine
from islamic_compliance import IslamicComplianceValidator, HalalContentChecker
from professional_domains import IraqiLegalValidator, IraqiMedicalValidator, IraqiEducationValidator

class CulturalValidationLevel(Enum):
    """Cultural validation levels for Iraqi middleware"""
    BASIC = "basic"                    # Basic cultural appropriateness
    STANDARD = "standard"              # Standard Islamic compliance
    COMPREHENSIVE = "comprehensive"    # Full cultural + professional validation
    STRICT = "strict"                 # Maximum validation for sensitive contexts

class ValidationResult(Enum):
    """Validation result types"""
    APPROVED = "approved"              # Content is culturally appropriate
    APPROVED_WITH_WARNINGS = "approved_with_warnings"  # Approved but has minor issues
    REQUIRES_MODIFICATION = "requires_modification"     # Needs changes before approval
    REJECTED = "rejected"              # Content is culturally inappropriate
    ERROR = "error"                   # Validation failed due to technical error

@dataclass
class CulturalValidationConfig:
    """Configuration for cultural validation middleware"""
    # Validation levels
    default_validation_level: CulturalValidationLevel = CulturalValidationLevel.STANDARD
    islamic_compliance_required: bool = True
    family_context_validation: bool = True
    professional_domain_validation: bool = True
    arabic_content_validation: bool = True
    
    # Thresholds
    cultural_appropriateness_threshold: float = 0.8
    islamic_compliance_threshold: float = 0.9
    professional_compliance_threshold: float = 0.85
    arabic_processing_threshold: float = 0.8
    
    # Performance settings
    enable_caching: bool = True
    cache_duration_minutes: int = 60
    enable_async_validation: bool = True
    validation_timeout_seconds: int = 30
    
    # Response handling
    block_inappropriate_content: bool = True
    add_validation_headers: bool = True
    log_validation_decisions: bool = True
    
    # Emergency settings
    bypass_validation_on_error: bool = False
    fallback_to_basic_validation: bool = True

@dataclass
class ValidationContext:
    """Context for cultural validation"""
    request_id: str
    user_context: Dict[str, Any] = field(default_factory=dict)
    cultural_context: Dict[str, Any] = field(default_factory=dict)
    professional_domain: Optional[str] = None
    family_context: bool = False
    religious_context: bool = False
    government_context: bool = False
    regional_context: Optional[str] = None
    validation_level: CulturalValidationLevel = CulturalValidationLevel.STANDARD
    timestamp: datetime = field(default_factory=datetime.now)

@dataclass
class ValidationReport:
    """Comprehensive validation report"""
    result: ValidationResult
    confidence_score: float
    cultural_score: float
    islamic_compliance_score: float
    professional_compliance_score: float
    arabic_processing_score: float
    
    # Detailed findings
    cultural_findings: Dict[str, Any] = field(default_factory=dict)
    islamic_findings: Dict[str, Any] = field(default_factory=dict)
    professional_findings: Dict[str, Any] = field(default_factory=dict)
    arabic_findings: Dict[str, Any] = field(default_factory=dict)
    
    # Issues and recommendations
    warnings: List[str] = field(default_factory=list)
    errors: List[str] = field(default_factory=list)
    recommendations: List[str] = field(default_factory=list)
    
    # Metadata
    validation_duration: float = 0.0
    validated_components: List[str] = field(default_factory=list)
    validation_timestamp: datetime = field(default_factory=datetime.now)

class CulturalValidator(ABC):
    """Abstract base for cultural validators"""
    
    @abstractmethod
    async def validate(self, content: Any, context: ValidationContext) -> ValidationReport:
        """Validate content with cultural context"""
        pass

class IslamicComplianceMiddleware(CulturalValidator):
    """Islamic compliance validation middleware"""
    
    def __init__(self):
        self.compliance_validator = IslamicComplianceValidator()
        self.halal_checker = HalalContentChecker()
        self.logger = logging.getLogger("IslamicComplianceMiddleware")
    
    async def validate(self, content: Any, context: ValidationContext) -> ValidationReport:
        """Validate Islamic compliance"""
        
        validation_start = datetime.now()
        
        try:
            # Core Islamic compliance check
            compliance_result = await self.compliance_validator.validate_content(
                content=content,
                context_type=context.cultural_context.get("context_type", "general"),
                family_context=context.family_context,
                religious_context=context.religious_context
            )
            
            # Halal content verification
            halal_result = await self.halal_checker.verify_content_halal(
                content=content,
                strict_mode=context.validation_level == CulturalValidationLevel.STRICT
            )
            
            # Calculate overall Islamic compliance score
            islamic_score = (compliance_result["score"] + halal_result["score"]) / 2
            
            # Determine validation result
            if islamic_score >= 0.95:
                result = ValidationResult.APPROVED
            elif islamic_score >= 0.8:
                result = ValidationResult.APPROVED_WITH_WARNINGS
            elif islamic_score >= 0.6:
                result = ValidationResult.REQUIRES_MODIFICATION
            else:
                result = ValidationResult.REJECTED
            
            # Compile findings
            islamic_findings = {
                "compliance_details": compliance_result,
                "halal_verification": halal_result,
                "family_appropriateness": compliance_result.get("family_appropriate", True),
                "religious_sensitivity": compliance_result.get("religiously_sensitive", False),
                "prayer_time_awareness": halal_result.get("prayer_time_sensitive", False)
            }
            
            # Generate warnings and recommendations
            warnings = []
            recommendations = []
            
            if compliance_result.get("minor_issues"):
                warnings.extend(compliance_result["minor_issues"])
            
            if halal_result.get("improvement_suggestions"):
                recommendations.extend(halal_result["improvement_suggestions"])
            
            validation_duration = (datetime.now() - validation_start).total_seconds()
            
            return ValidationReport(
                result=result,
                confidence_score=min(compliance_result["confidence"], halal_result["confidence"]),
                cultural_score=0.0,  # Will be set by main validator
                islamic_compliance_score=islamic_score,
                professional_compliance_score=0.0,  # Will be set by professional validator
                arabic_processing_score=0.0,  # Will be set by Arabic validator
                islamic_findings=islamic_findings,
                warnings=warnings,
                recommendations=recommendations,
                validation_duration=validation_duration,
                validated_components=["islamic_compliance", "halal_content"]
            )
            
        except Exception as e:
            self.logger.error(f"Islamic compliance validation failed: {str(e)}")
            
            return ValidationReport(
                result=ValidationResult.ERROR,
                confidence_score=0.0,
                cultural_score=0.0,
                islamic_compliance_score=0.0,
                professional_compliance_score=0.0,
                arabic_processing_score=0.0,
                errors=[f"Islamic compliance validation error: {str(e)}"],
                validation_duration=(datetime.now() - validation_start).total_seconds(),
                validated_components=[]
            )

class ProfessionalDomainMiddleware(CulturalValidator):
    """Professional domain validation middleware for Iraqi sectors"""
    
    def __init__(self):
        self.legal_validator = IraqiLegalValidator()
        self.medical_validator = IraqiMedicalValidator()
        self.education_validator = IraqiEducationValidator()
        self.logger = logging.getLogger("ProfessionalDomainMiddleware")
    
    async def validate(self, content: Any, context: ValidationContext) -> ValidationReport:
        """Validate professional domain compliance"""
        
        validation_start = datetime.now()
        
        try:
            professional_score = 0.0
            professional_findings = {}
            warnings = []
            recommendations = []
            validated_components = []
            
            # Validate based on professional domain
            if context.professional_domain == "legal":
                legal_result = await self.legal_validator.validate_legal_content(
                    content=content,
                    regional_context=context.regional_context,
                    cultural_context=context.cultural_context
                )
                professional_score = legal_result["compliance_score"]
                professional_findings["legal_validation"] = legal_result
                validated_components.append("legal_compliance")
                
                if legal_result.get("warnings"):
                    warnings.extend(legal_result["warnings"])
                if legal_result.get("recommendations"):
                    recommendations.extend(legal_result["recommendations"])
            
            elif context.professional_domain == "medical":
                medical_result = await self.medical_validator.validate_medical_content(
                    content=content,
                    patient_privacy=context.cultural_context.get("patient_privacy", True),
                    islamic_medical_ethics=True
                )
                professional_score = medical_result["compliance_score"]
                professional_findings["medical_validation"] = medical_result
                validated_components.append("medical_compliance")
                
                if medical_result.get("privacy_warnings"):
                    warnings.extend(medical_result["privacy_warnings"])
                if medical_result.get("ethics_recommendations"):
                    recommendations.extend(medical_result["ethics_recommendations"])
            
            elif context.professional_domain == "education":
                education_result = await self.education_validator.validate_educational_content(
                    content=content,
                    age_appropriate=context.cultural_context.get("age_appropriate", True),
                    cultural_sensitive=True
                )
                professional_score = education_result["compliance_score"]
                professional_findings["education_validation"] = education_result
                validated_components.append("education_compliance")
                
                if education_result.get("age_warnings"):
                    warnings.extend(education_result["age_warnings"])
                if education_result.get("cultural_recommendations"):
                    recommendations.extend(education_result["cultural_recommendations"])
            
            else:
                # General professional validation
                professional_score = 1.0  # No specific domain requirements
                professional_findings["general_professional"] = {
                    "status": "no_specific_domain_requirements",
                    "compliance_score": 1.0
                }
                validated_components.append("general_professional")
            
            # Determine result based on score
            if professional_score >= 0.9:
                result = ValidationResult.APPROVED
            elif professional_score >= 0.75:
                result = ValidationResult.APPROVED_WITH_WARNINGS
            elif professional_score >= 0.6:
                result = ValidationResult.REQUIRES_MODIFICATION
            else:
                result = ValidationResult.REJECTED
            
            validation_duration = (datetime.now() - validation_start).total_seconds()
            
            return ValidationReport(
                result=result,
                confidence_score=professional_score,
                cultural_score=0.0,
                islamic_compliance_score=0.0,
                professional_compliance_score=professional_score,
                arabic_processing_score=0.0,
                professional_findings=professional_findings,
                warnings=warnings,
                recommendations=recommendations,
                validation_duration=validation_duration,
                validated_components=validated_components
            )
            
        except Exception as e:
            self.logger.error(f"Professional domain validation failed: {str(e)}")
            
            return ValidationReport(
                result=ValidationResult.ERROR,
                confidence_score=0.0,
                cultural_score=0.0,
                islamic_compliance_score=0.0,
                professional_compliance_score=0.0,
                arabic_processing_score=0.0,
                errors=[f"Professional domain validation error: {str(e)}"],
                validation_duration=(datetime.now() - validation_start).total_seconds(),
                validated_components=[]
            )

class ArabicContentMiddleware(CulturalValidator):
    """Arabic content and RTL validation middleware"""
    
    def __init__(self):
        self.content_validator = ArabicContentValidator()
        self.rtl_validator = RTLValidationEngine()
        self.logger = logging.getLogger("ArabicContentMiddleware")
    
    async def validate(self, content: Any, context: ValidationContext) -> ValidationReport:
        """Validate Arabic content and RTL processing"""
        
        validation_start = datetime.now()
        
        try:
            # Arabic content validation
            arabic_result = await self.content_validator.validate_arabic_content(
                content=content,
                dialect_preference=context.cultural_context.get("dialect", "iraqi"),
                mixed_language_support=True
            )
            
            # RTL layout validation
            rtl_result = await self.rtl_validator.validate_rtl_processing(
                content=content,
                layout_context=context.cultural_context.get("layout_context", "web")
            )
            
            # Calculate Arabic processing score
            arabic_score = (arabic_result["accuracy_score"] + rtl_result["layout_score"]) / 2
            
            # Determine validation result
            if arabic_score >= 0.9:
                result = ValidationResult.APPROVED
            elif arabic_score >= 0.75:
                result = ValidationResult.APPROVED_WITH_WARNINGS
            elif arabic_score >= 0.6:
                result = ValidationResult.REQUIRES_MODIFICATION
            else:
                result = ValidationResult.REJECTED
            
            # Compile Arabic findings
            arabic_findings = {
                "content_validation": arabic_result,
                "rtl_validation": rtl_result,
                "dialect_compatibility": arabic_result.get("dialect_score", 0.0),
                "mixed_language_handling": arabic_result.get("mixed_language_score", 0.0),
                "layout_appropriateness": rtl_result.get("layout_appropriateness", 0.0)
            }
            
            # Generate warnings and recommendations
            warnings = []
            recommendations = []
            
            if arabic_result.get("accuracy_issues"):
                warnings.extend(arabic_result["accuracy_issues"])
            
            if rtl_result.get("layout_suggestions"):
                recommendations.extend(rtl_result["layout_suggestions"])
            
            validation_duration = (datetime.now() - validation_start).total_seconds()
            
            return ValidationReport(
                result=result,
                confidence_score=min(arabic_result["confidence"], rtl_result["confidence"]),
                cultural_score=0.0,
                islamic_compliance_score=0.0,
                professional_compliance_score=0.0,
                arabic_processing_score=arabic_score,
                arabic_findings=arabic_findings,
                warnings=warnings,
                recommendations=recommendations,
                validation_duration=validation_duration,
                validated_components=["arabic_content", "rtl_layout"]
            )
            
        except Exception as e:
            self.logger.error(f"Arabic content validation failed: {str(e)}")
            
            return ValidationReport(
                result=ValidationResult.ERROR,
                confidence_score=0.0,
                cultural_score=0.0,
                islamic_compliance_score=0.0,
                professional_compliance_score=0.0,
                arabic_processing_score=0.0,
                errors=[f"Arabic content validation error: {str(e)}"],
                validation_duration=(datetime.now() - validation_start).total_seconds(),
                validated_components=[]
            )

class CulturalValidationMiddleware:
    """Main cultural validation middleware coordinator"""
    
    def __init__(self, config: CulturalValidationConfig = None):
        self.config = config or CulturalValidationConfig()
        
        # Initialize specialized validators
        self.islamic_middleware = IslamicComplianceMiddleware()
        self.professional_middleware = ProfessionalDomainMiddleware()
        self.arabic_middleware = ArabicContentMiddleware()
        
        self.logger = logging.getLogger("CulturalValidationMiddleware")
        
        # Performance tracking
        self.validation_history: List[Dict[str, Any]] = []
        self.performance_metrics: Dict[str, Any] = {}
        self._initialize_metrics()
        
        # Caching
        self.validation_cache: Dict[str, ValidationReport] = {}
    
    def _initialize_metrics(self):
        """Initialize performance metrics tracking"""
        self.performance_metrics = {
            "total_validations": 0,
            "approved_validations": 0,
            "rejected_validations": 0,
            "average_validation_time": 0.0,
            "islamic_compliance_rate": 0.0,
            "professional_compliance_rate": 0.0,
            "arabic_processing_rate": 0.0,
            "cache_hit_rate": 0.0,
            "validation_errors": 0,
            "start_time": datetime.now()
        }
    
    async def validate_request(self, request_data: Dict[str, Any], 
                              context: ValidationContext) -> ValidationReport:
        """Validate incoming request with comprehensive cultural validation"""
        
        validation_start = datetime.now()
        
        try:
            # Check cache first
            if self.config.enable_caching:
                cache_key = self._generate_cache_key(request_data, context)
                cached_result = self._get_cached_validation(cache_key)
                if cached_result:
                    self._update_cache_metrics(True)
                    return cached_result
                self._update_cache_metrics(False)
            
            # Perform comprehensive validation
            validation_report = await self._perform_comprehensive_validation(
                request_data, context
            )
            
            # Cache result
            if self.config.enable_caching and validation_report.result != ValidationResult.ERROR:
                self._cache_validation_result(cache_key, validation_report)
            
            # Record validation decision
            await self._record_validation_decision(request_data, context, validation_report)
            
            # Update performance metrics
            await self._update_performance_metrics(validation_report, validation_start)
            
            return validation_report
            
        except Exception as e:
            self.logger.error(f"Request validation failed: {str(e)}")
            self.performance_metrics["validation_errors"] += 1
            
            # Return error validation report
            return ValidationReport(
                result=ValidationResult.ERROR,
                confidence_score=0.0,
                cultural_score=0.0,
                islamic_compliance_score=0.0,
                professional_compliance_score=0.0,
                arabic_processing_score=0.0,
                errors=[f"Validation middleware error: {str(e)}"],
                validation_duration=(datetime.now() - validation_start).total_seconds(),
                validated_components=[]
            )
    
    async def _perform_comprehensive_validation(self, request_data: Dict[str, Any], 
                                               context: ValidationContext) -> ValidationReport:
        """Perform comprehensive validation using all validators"""
        
        validation_tasks = []
        
        # Islamic compliance validation
        if self.config.islamic_compliance_required:
            validation_tasks.append(
                self.islamic_middleware.validate(request_data, context)
            )
        
        # Professional domain validation
        if (self.config.professional_domain_validation and 
            context.professional_domain):
            validation_tasks.append(
                self.professional_middleware.validate(request_data, context)
            )
        
        # Arabic content validation
        if (self.config.arabic_content_validation and 
            self._contains_arabic_content(request_data)):
            validation_tasks.append(
                self.arabic_middleware.validate(request_data, context)
            )
        
        # Execute validations concurrently if enabled
        if self.config.enable_async_validation and len(validation_tasks) > 1:
            validation_results = await asyncio.gather(*validation_tasks, return_exceptions=True)
        else:
            validation_results = []
            for task in validation_tasks:
                result = await task
                validation_results.append(result)
        
        # Combine validation results
        return self._combine_validation_results(validation_results, context)
    
    def _combine_validation_results(self, results: List[ValidationReport], 
                                   context: ValidationContext) -> ValidationReport:
        """Combine multiple validation results into comprehensive report"""
        
        # Filter out exceptions and failed validations
        valid_results = [r for r in results if isinstance(r, ValidationReport)]
        
        if not valid_results:
            return ValidationReport(
                result=ValidationResult.ERROR,
                confidence_score=0.0,
                cultural_score=0.0,
                islamic_compliance_score=0.0,
                professional_compliance_score=0.0,
                arabic_processing_score=0.0,
                errors=["No valid validation results"],
                validated_components=[]
            )
        
        # Combine scores
        cultural_score = sum(r.cultural_score for r in valid_results) / len(valid_results)
        islamic_score = max((r.islamic_compliance_score for r in valid_results), default=0.0)
        professional_score = max((r.professional_compliance_score for r in valid_results), default=0.0)
        arabic_score = max((r.arabic_processing_score for r in valid_results), default=0.0)
        
        # Determine overall result (most restrictive wins)
        overall_result = ValidationResult.APPROVED
        for result in valid_results:
            if result.result == ValidationResult.REJECTED:
                overall_result = ValidationResult.REJECTED
                break
            elif result.result == ValidationResult.REQUIRES_MODIFICATION:
                overall_result = ValidationResult.REQUIRES_MODIFICATION
            elif (result.result == ValidationResult.APPROVED_WITH_WARNINGS and 
                  overall_result == ValidationResult.APPROVED):
                overall_result = ValidationResult.APPROVED_WITH_WARNINGS
        
        # Calculate confidence score
        confidence_scores = [r.confidence_score for r in valid_results if r.confidence_score > 0]
        overall_confidence = sum(confidence_scores) / len(confidence_scores) if confidence_scores else 0.0
        
        # Combine findings
        combined_findings = {}
        combined_warnings = []
        combined_errors = []
        combined_recommendations = []
        validated_components = []
        
        for result in valid_results:
            combined_findings.update(result.cultural_findings)
            combined_findings.update(result.islamic_findings)
            combined_findings.update(result.professional_findings)
            combined_findings.update(result.arabic_findings)
            
            combined_warnings.extend(result.warnings)
            combined_errors.extend(result.errors)
            combined_recommendations.extend(result.recommendations)
            validated_components.extend(result.validated_components)
        
        # Calculate total validation duration
        total_duration = sum(r.validation_duration for r in valid_results)
        
        return ValidationReport(
            result=overall_result,
            confidence_score=overall_confidence,
            cultural_score=cultural_score,
            islamic_compliance_score=islamic_score,
            professional_compliance_score=professional_score,
            arabic_processing_score=arabic_score,
            cultural_findings=combined_findings,
            warnings=list(set(combined_warnings)),  # Remove duplicates
            errors=list(set(combined_errors)),
            recommendations=list(set(combined_recommendations)),
            validation_duration=total_duration,
            validated_components=list(set(validated_components))
        )
    
    def _contains_arabic_content(self, request_data: Dict[str, Any]) -> bool:
        """Check if request contains Arabic content"""
        
        # Check messages
        messages = request_data.get("messages", [])
        for message in messages:
            content = str(message.get("content", ""))
            if self._has_arabic_characters(content):
                return True
        
        # Check system prompt
        system = request_data.get("system", "")
        if isinstance(system, str) and self._has_arabic_characters(system):
            return True
        
        return False
    
    def _has_arabic_characters(self, text: str) -> bool:
        """Check if text contains Arabic characters"""
        return any('\u0600' <= char <= '\u06FF' for char in text)
    
    def _generate_cache_key(self, request_data: Dict[str, Any], 
                           context: ValidationContext) -> str:
        """Generate cache key for validation result"""
        
        # Create hash-able representation
        cache_data = {
            "messages_hash": hash(str(request_data.get("messages", []))),
            "system_hash": hash(str(request_data.get("system", ""))),
            "professional_domain": context.professional_domain,
            "family_context": context.family_context,
            "religious_context": context.religious_context,
            "validation_level": context.validation_level.value
        }
        
        return f"validation_{hash(str(cache_data))}"
    
    def _get_cached_validation(self, cache_key: str) -> Optional[ValidationReport]:
        """Get cached validation result if valid"""
        
        if cache_key not in self.validation_cache:
            return None
        
        cached_result = self.validation_cache[cache_key]
        
        # Check if cache is still valid
        cache_age = (datetime.now() - cached_result.validation_timestamp).total_seconds()
        if cache_age > self.config.cache_duration_minutes * 60:
            del self.validation_cache[cache_key]
            return None
        
        return cached_result
    
    def _cache_validation_result(self, cache_key: str, result: ValidationReport):
        """Cache validation result"""
        self.validation_cache[cache_key] = result
        
        # Limit cache size
        if len(self.validation_cache) > 1000:
            # Remove oldest entries
            sorted_keys = sorted(
                self.validation_cache.keys(),
                key=lambda k: self.validation_cache[k].validation_timestamp
            )
            for key in sorted_keys[:100]:  # Remove oldest 100 entries
                del self.validation_cache[key]
    
    def _update_cache_metrics(self, cache_hit: bool):
        """Update cache performance metrics"""
        total_validations = self.performance_metrics["total_validations"]
        current_hit_rate = self.performance_metrics["cache_hit_rate"]
        
        if cache_hit:
            new_hit_rate = (current_hit_rate * total_validations + 1) / (total_validations + 1)
        else:
            new_hit_rate = (current_hit_rate * total_validations) / (total_validations + 1)
        
        self.performance_metrics["cache_hit_rate"] = new_hit_rate
    
    async def _record_validation_decision(self, request_data: Dict[str, Any],
                                         context: ValidationContext,
                                         result: ValidationReport):
        """Record validation decision for analytics"""
        
        decision_record = {
            "request_id": context.request_id,
            "validation_result": result.result.value,
            "confidence_score": result.confidence_score,
            "cultural_score": result.cultural_score,
            "islamic_compliance_score": result.islamic_compliance_score,
            "professional_compliance_score": result.professional_compliance_score,
            "arabic_processing_score": result.arabic_processing_score,
            "validation_duration": result.validation_duration,
            "validated_components": result.validated_components,
            "warnings_count": len(result.warnings),
            "errors_count": len(result.errors),
            "professional_domain": context.professional_domain,
            "family_context": context.family_context,
            "religious_context": context.religious_context,
            "timestamp": datetime.now()
        }
        
        self.validation_history.append(decision_record)
        
        # Limit history size
        if len(self.validation_history) > 1000:
            self.validation_history = self.validation_history[-1000:]
    
    async def _update_performance_metrics(self, result: ValidationReport, 
                                         validation_start: datetime):
        """Update performance metrics"""
        
        self.performance_metrics["total_validations"] += 1
        
        if result.result in [ValidationResult.APPROVED, ValidationResult.APPROVED_WITH_WARNINGS]:
            self.performance_metrics["approved_validations"] += 1
        elif result.result == ValidationResult.REJECTED:
            self.performance_metrics["rejected_validations"] += 1
        
        # Update average validation time
        total_validations = self.performance_metrics["total_validations"]
        current_avg = self.performance_metrics["average_validation_time"]
        new_time = result.validation_duration
        
        self.performance_metrics["average_validation_time"] = (
            (current_avg * (total_validations - 1) + new_time) / total_validations
        )
        
        # Update compliance rates
        if result.islamic_compliance_score > 0:
            current_islamic = self.performance_metrics["islamic_compliance_rate"]
            self.performance_metrics["islamic_compliance_rate"] = (
                (current_islamic * (total_validations - 1) + result.islamic_compliance_score) / total_validations
            )
        
        if result.professional_compliance_score > 0:
            current_professional = self.performance_metrics["professional_compliance_rate"]
            self.performance_metrics["professional_compliance_rate"] = (
                (current_professional * (total_validations - 1) + result.professional_compliance_score) / total_validations
            )
        
        if result.arabic_processing_score > 0:
            current_arabic = self.performance_metrics["arabic_processing_rate"]
            self.performance_metrics["arabic_processing_rate"] = (
                (current_arabic * (total_validations - 1) + result.arabic_processing_score) / total_validations
            )
    
    async def get_validation_analytics(self) -> Dict[str, Any]:
        """Get comprehensive validation analytics"""
        
        total_time = (datetime.now() - self.performance_metrics["start_time"]).total_seconds()
        total_validations = self.performance_metrics["total_validations"]
        
        return {
            "performance_metrics": self.performance_metrics,
            "validation_rate": total_validations / (total_time / 3600) if total_time > 0 else 0,  # per hour
            "approval_rate": (
                self.performance_metrics["approved_validations"] / total_validations * 100
                if total_validations > 0 else 0
            ),
            "rejection_rate": (
                self.performance_metrics["rejected_validations"] / total_validations * 100
                if total_validations > 0 else 0
            ),
            "cache_size": len(self.validation_cache),
            "recent_validations": self.validation_history[-10:],  # Last 10 validations
            "timestamp": datetime.now().isoformat()
        }

# Example usage
async def example_cultural_validation_middleware():
    """Example demonstrating cultural validation middleware"""
    
    # Initialize middleware
    config = CulturalValidationConfig(
        islamic_compliance_required=True,
        professional_domain_validation=True,
        arabic_content_validation=True,
        cultural_appropriateness_threshold=0.8
    )
    
    middleware = CulturalValidationMiddleware(config)
    
    # Sample request with Arabic content and medical context
    request_data = {
        "messages": [
            {
                "role": "user",
                "content": "أريد استشارة طبية حول مرض السكري وكيفية إدارته في رمضان"
            }
        ],
        "system": "أنت طبيب متخصص في الطب الإسلامي"
    }
    
    # Validation context
    context = ValidationContext(
        request_id="test_validation_001",
        professional_domain="medical",
        religious_context=True,
        family_context=False,
        validation_level=CulturalValidationLevel.COMPREHENSIVE
    )
    
    # Validate request
    validation_result = await middleware.validate_request(request_data, context)
    
    print(f"Validation result: {validation_result.result.value}")
    print(f"Islamic compliance score: {validation_result.islamic_compliance_score:.2f}")
    print(f"Professional compliance score: {validation_result.professional_compliance_score:.2f}")
    print(f"Arabic processing score: {validation_result.arabic_processing_score:.2f}")
    print(f"Warnings: {validation_result.warnings}")
    print(f"Recommendations: {validation_result.recommendations}")
    
    # Get analytics
    analytics = await middleware.get_validation_analytics()
    print(f"Validation analytics: {analytics}")
    
    return middleware

if __name__ == "__main__":
    # Run example
    asyncio.run(example_cultural_validation_middleware())