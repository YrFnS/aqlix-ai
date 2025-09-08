"""
Iraqi Cultural Validation Middleware
Integrates with specialized Iraqi AI agents for comprehensive cultural compliance

Features:
- 95%+ cultural appropriateness validation
- Islamic compliance verification
- Professional domain context validation
- Arabic prompt processing
- Content policy enforcement
"""

import asyncio
import logging
from typing import Dict, Any, Optional, List
from datetime import datetime
from dataclasses import dataclass
from enum import Enum
import base64
import json
import aiohttp
import time

from ...agents.cultural_validator_client import IraqiCulturalValidatorClient
from ...utils.arabic_processor import ArabicTextProcessor

logger = logging.getLogger(__name__)


class ValidationSeverity(Enum):
    """Validation result severity levels"""
    APPROVED = "approved"
    WARNING = "warning"
    BLOCKED = "blocked"


class ProfessionalDomain(Enum):
    """Iraqi professional domains"""
    LEGAL = "legal"
    MEDICAL = "medical"
    EDUCATIONAL = "educational"
    BUSINESS = "business"
    ENGINEERING = "engineering"
    GENERAL = "general"


@dataclass
class ValidationResult:
    """Cultural validation result"""
    is_valid: bool
    cultural_score: float
    islamic_compliant: bool
    professional_appropriate: bool
    severity: ValidationSeverity
    reason: str
    recommendations: List[str]
    processing_time: float
    optimized_prompt: Optional[str] = None
    dialect_recognized: Optional[str] = None


@dataclass
class ImageValidationResult:
    """Image content validation result"""
    is_valid: bool
    cultural_score: float
    islamic_compliant: bool
    professional_appropriate: bool
    content_analysis: Dict[str, Any]
    processing_time: float
    detected_elements: List[str]
    recommendations: List[str]


class IraqiCulturalValidator:
    """
    Iraqi Cultural Validation System
    Integrates with specialized Iraqi AI agents for comprehensive validation
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        
        # Validation thresholds
        self.min_cultural_score = self.config.get('min_cultural_score', 0.95)
        self.require_islamic_compliance = self.config.get('require_islamic_compliance', True)
        self.strict_professional_validation = self.config.get('strict_professional_validation', True)
        
        # Initialize agents
        self.cultural_agent = IraqiCulturalValidatorClient(
            agent_type="iraqi-cultural-validator"
        )
        self.arabic_processor = ArabicTextProcessor()
        
        # Validation cache for performance
        self._validation_cache = {}
        self._cache_ttl = 3600  # 1 hour
        
        logger.info("Iraqi Cultural Validator initialized")
    
    async def validate_prompt(
        self, 
        prompt: str, 
        domain: str = "general",
        islamic_compliance: bool = True,
        user_id: str = None
    ) -> ValidationResult:
        """
        Validate text prompt for cultural appropriateness
        
        Args:
            prompt: Text prompt to validate
            domain: Professional domain context
            islamic_compliance: Require Islamic compliance
            user_id: User identifier for logging
            
        Returns:
            ValidationResult with detailed validation information
        """
        start_time = time.time()
        
        try:
            logger.info(f"Validating prompt for user {user_id} in domain {domain}")
            
            # Check cache first
            cache_key = f"prompt:{hash(prompt)}:{domain}:{islamic_compliance}"
            if cache_key in self._validation_cache:
                cached_result, cache_time = self._validation_cache[cache_key]
                if time.time() - cache_time < self._cache_ttl:
                    logger.info("Returning cached validation result")
                    return cached_result
            
            # Phase 1: Basic content screening
            basic_issues = await self._screen_basic_content(prompt)
            if basic_issues:
                return ValidationResult(
                    is_valid=False,
                    cultural_score=0.0,
                    islamic_compliant=False,
                    professional_appropriate=False,
                    severity=ValidationSeverity.BLOCKED,
                    reason=f"Basic content screening failed: {', '.join(basic_issues)}",
                    recommendations=[
                        "Remove inappropriate content",
                        "Use respectful language",
                        "Ensure Islamic compliance"
                    ],
                    processing_time=time.time() - start_time
                )
            
            # Phase 2: Iraqi Cultural Agent Validation
            cultural_validation = await self.cultural_agent.validate_content({
                "content": prompt,
                "content_type": "prompt",
                "professional_domain": domain,
                "islamic_compliance_required": islamic_compliance,
                "validation_level": "comprehensive",
                "user_context": {
                    "user_id": user_id,
                    "timestamp": datetime.utcnow().isoformat()
                }
            })
            
            if not cultural_validation.get("success", False):
                logger.error(f"Cultural validation failed: {cultural_validation.get('error')}")
                return ValidationResult(
                    is_valid=False,
                    cultural_score=0.0,
                    islamic_compliant=False,
                    professional_appropriate=False,
                    severity=ValidationSeverity.BLOCKED,
                    reason=cultural_validation.get("error", "Cultural validation service unavailable"),
                    recommendations=["Please try again later"],
                    processing_time=time.time() - start_time
                )
            
            validation_data = cultural_validation["data"]
            
            # Phase 3: Arabic Text Processing (if applicable)
            arabic_analysis = None
            if self.arabic_processor.contains_arabic(prompt):
                logger.info("Processing Arabic content in prompt")
                arabic_analysis = await self.arabic_processor.analyze_text(
                    text=prompt,
                    detect_dialect=True,
                    cultural_context="iraqi"
                )
            
            # Phase 4: Professional Domain Validation
            professional_score = await self._validate_professional_context(
                prompt, domain, validation_data
            )
            
            # Phase 5: Aggregate Results
            cultural_score = validation_data.get("cultural_appropriateness_score", 0.0)
            islamic_compliant = validation_data.get("islamic_compliant", False)
            professional_appropriate = professional_score >= 0.8
            
            # Determine overall validity
            is_valid = (
                cultural_score >= self.min_cultural_score and
                (not self.require_islamic_compliance or islamic_compliant) and
                (not self.strict_professional_validation or professional_appropriate)
            )
            
            # Determine severity
            if is_valid:
                severity = ValidationSeverity.APPROVED
            elif cultural_score >= 0.7 and islamic_compliant:
                severity = ValidationSeverity.WARNING
            else:
                severity = ValidationSeverity.BLOCKED
            
            # Generate recommendations
            recommendations = []
            if cultural_score < self.min_cultural_score:
                recommendations.extend(validation_data.get("cultural_recommendations", []))
            
            if not islamic_compliant and self.require_islamic_compliance:
                recommendations.extend(validation_data.get("islamic_recommendations", []))
            
            if not professional_appropriate:
                recommendations.append(f"Ensure content is appropriate for {domain} professional context")
            
            # Create optimized prompt if available
            optimized_prompt = validation_data.get("optimized_prompt")
            if not optimized_prompt and validation_data.get("suggested_improvements"):
                optimized_prompt = validation_data["suggested_improvements"].get("improved_prompt")
            
            result = ValidationResult(
                is_valid=is_valid,
                cultural_score=cultural_score,
                islamic_compliant=islamic_compliant,
                professional_appropriate=professional_appropriate,
                severity=severity,
                reason=validation_data.get("validation_summary", "Validation completed"),
                recommendations=recommendations,
                processing_time=time.time() - start_time,
                optimized_prompt=optimized_prompt,
                dialect_recognized=arabic_analysis.get("dialect") if arabic_analysis else None
            )
            
            # Cache result
            self._validation_cache[cache_key] = (result, time.time())
            
            logger.info(f"Prompt validation completed: score={cultural_score:.3f}, valid={is_valid}")
            return result
            
        except Exception as e:
            logger.error(f"Prompt validation error: {str(e)}")
            return ValidationResult(
                is_valid=False,
                cultural_score=0.0,
                islamic_compliant=False,
                professional_appropriate=False,
                severity=ValidationSeverity.BLOCKED,
                reason=f"Validation error: {str(e)}",
                recommendations=["Please try again later"],
                processing_time=time.time() - start_time
            )
    
    async def validate_arabic_prompt(
        self, 
        prompt: str, 
        domain: str = "general"
    ) -> ValidationResult:
        """
        Specialized validation for Arabic prompts
        
        Args:
            prompt: Arabic text prompt
            domain: Professional domain
            
        Returns:
            ValidationResult with Arabic-specific analysis
        """
        start_time = time.time()
        
        try:
            # Arabic text processing
            arabic_analysis = await self.arabic_processor.analyze_text(
                text=prompt,
                detect_dialect=True,
                cultural_context="iraqi",
                validate_rtl=True
            )
            
            if not arabic_analysis.get("is_valid_arabic", False):
                return ValidationResult(
                    is_valid=False,
                    cultural_score=0.0,
                    islamic_compliant=False,
                    professional_appropriate=False,
                    severity=ValidationSeverity.BLOCKED,
                    reason="Invalid Arabic text format",
                    recommendations=["Please provide valid Arabic text"],
                    processing_time=time.time() - start_time
                )
            
            # Use Arabic-specialized cultural validation
            arabic_validation = await self.cultural_agent.validate_arabic_content({
                "arabic_text": prompt,
                "dialect": arabic_analysis.get("dialect", "iraqi"),
                "professional_domain": domain,
                "rtl_validation": True,
                "cultural_sensitivity_check": True
            })
            
            validation_data = arabic_validation.get("data", {})
            
            result = ValidationResult(
                is_valid=validation_data.get("is_valid", False),
                cultural_score=validation_data.get("cultural_score", 0.0),
                islamic_compliant=validation_data.get("islamic_compliant", False),
                professional_appropriate=validation_data.get("professional_appropriate", False),
                severity=ValidationSeverity.APPROVED if validation_data.get("is_valid") else ValidationSeverity.BLOCKED,
                reason=validation_data.get("validation_reason", "Arabic validation completed"),
                recommendations=validation_data.get("recommendations", []),
                processing_time=time.time() - start_time,
                dialect_recognized=arabic_analysis.get("dialect")
            )
            
            return result
            
        except Exception as e:
            logger.error(f"Arabic prompt validation error: {str(e)}")
            return ValidationResult(
                is_valid=False,
                cultural_score=0.0,
                islamic_compliant=False,
                professional_appropriate=False,
                severity=ValidationSeverity.BLOCKED,
                reason=f"Arabic validation error: {str(e)}",
                recommendations=["Please check Arabic text format"],
                processing_time=time.time() - start_time
            )
    
    async def validate_image_content(
        self,
        image_data: str,
        domain: str = "general",
        islamic_compliance: bool = True,
        user_id: str = None
    ) -> ImageValidationResult:
        """
        Validate generated image content for cultural appropriateness
        
        Args:
            image_data: Base64 encoded image data
            domain: Professional domain context
            islamic_compliance: Require Islamic compliance
            user_id: User identifier
            
        Returns:
            ImageValidationResult with detailed analysis
        """
        start_time = time.time()
        
        try:
            logger.info(f"Validating image content for user {user_id} in domain {domain}")
            
            # Phase 1: Image Content Analysis
            content_analysis = await self.cultural_agent.validate_image({
                "image_data": image_data,
                "analysis_type": "cultural_compliance",
                "professional_domain": domain,
                "islamic_compliance_required": islamic_compliance,
                "detection_categories": [
                    "people", "clothing", "symbols", "text", "activities", 
                    "religious_elements", "cultural_elements", "inappropriate_content"
                ]
            })
            
            if not content_analysis.get("success", False):
                return ImageValidationResult(
                    is_valid=False,
                    cultural_score=0.0,
                    islamic_compliant=False,
                    professional_appropriate=False,
                    content_analysis={},
                    processing_time=time.time() - start_time,
                    detected_elements=[],
                    recommendations=["Image analysis failed - please try again"]
                )
            
            analysis_data = content_analysis["data"]
            
            # Phase 2: Cultural Scoring
            cultural_score = analysis_data.get("cultural_appropriateness_score", 0.0)
            islamic_compliant = analysis_data.get("islamic_compliant", False)
            professional_appropriate = analysis_data.get("professional_appropriate", False)
            
            # Phase 3: Content Policy Check
            policy_violations = analysis_data.get("policy_violations", [])
            detected_elements = analysis_data.get("detected_elements", [])
            
            is_valid = (
                cultural_score >= self.min_cultural_score and
                (not self.require_islamic_compliance or islamic_compliant) and
                len(policy_violations) == 0
            )
            
            # Generate recommendations
            recommendations = []
            if policy_violations:
                recommendations.extend([f"Address: {violation}" for violation in policy_violations])
            
            if cultural_score < self.min_cultural_score:
                recommendations.extend(analysis_data.get("cultural_recommendations", []))
            
            if not islamic_compliant and self.require_islamic_compliance:
                recommendations.extend(analysis_data.get("islamic_recommendations", []))
            
            result = ImageValidationResult(
                is_valid=is_valid,
                cultural_score=cultural_score,
                islamic_compliant=islamic_compliant,
                professional_appropriate=professional_appropriate,
                content_analysis=analysis_data,
                processing_time=time.time() - start_time,
                detected_elements=detected_elements,
                recommendations=recommendations
            )
            
            logger.info(f"Image validation completed: score={cultural_score:.3f}, valid={is_valid}")
            return result
            
        except Exception as e:
            logger.error(f"Image validation error: {str(e)}")
            return ImageValidationResult(
                is_valid=False,
                cultural_score=0.0,
                islamic_compliant=False,
                professional_appropriate=False,
                content_analysis={"error": str(e)},
                processing_time=time.time() - start_time,
                detected_elements=[],
                recommendations=["Image validation failed - please try again"]
            )
    
    async def validate_generated_image(
        self,
        image_data: str,
        original_prompt: str,
        domain: str = "general",
        user_id: str = None,
        operation: str = "generation"
    ) -> ImageValidationResult:
        """
        Validate generated/edited image against original prompt
        
        Args:
            image_data: Base64 encoded image
            original_prompt: Original generation prompt
            domain: Professional domain
            user_id: User identifier
            operation: Type of operation (generation/edit/variation)
            
        Returns:
            ImageValidationResult with prompt-image alignment analysis
        """
        start_time = time.time()
        
        try:
            # Standard image validation
            base_validation = await self.validate_image_content(
                image_data=image_data,
                domain=domain,
                user_id=user_id
            )
            
            if not base_validation.is_valid:
                return base_validation
            
            # Enhanced validation with prompt alignment
            alignment_analysis = await self.cultural_agent.validate_prompt_image_alignment({
                "image_data": image_data,
                "original_prompt": original_prompt,
                "operation_type": operation,
                "professional_domain": domain,
                "cultural_context": "iraqi"
            })
            
            alignment_data = alignment_analysis.get("data", {})
            
            # Combine results
            combined_score = min(
                base_validation.cultural_score,
                alignment_data.get("alignment_score", 1.0)
            )
            
            return ImageValidationResult(
                is_valid=base_validation.is_valid and alignment_data.get("alignment_appropriate", True),
                cultural_score=combined_score,
                islamic_compliant=base_validation.islamic_compliant,
                professional_appropriate=base_validation.professional_appropriate,
                content_analysis={
                    **base_validation.content_analysis,
                    "prompt_alignment": alignment_data
                },
                processing_time=time.time() - start_time,
                detected_elements=base_validation.detected_elements,
                recommendations=base_validation.recommendations + alignment_data.get("recommendations", [])
            )
            
        except Exception as e:
            logger.error(f"Generated image validation error: {str(e)}")
            return ImageValidationResult(
                is_valid=False,
                cultural_score=0.0,
                islamic_compliant=False,
                professional_appropriate=False,
                content_analysis={"error": str(e)},
                processing_time=time.time() - start_time,
                detected_elements=[],
                recommendations=["Validation failed - please try again"]
            )
    
    async def _screen_basic_content(self, prompt: str) -> List[str]:
        """Basic content screening for obvious violations"""
        issues = []
        
        # Check for explicit forbidden content
        forbidden_terms = [
            # This would be loaded from a comprehensive config
            # Basic inappropriate terms would be checked here
        ]
        
        prompt_lower = prompt.lower()
        for term in forbidden_terms:
            if term in prompt_lower:
                issues.append(f"Contains inappropriate term: {term}")
        
        return issues
    
    async def _validate_professional_context(
        self, 
        prompt: str, 
        domain: str, 
        validation_data: Dict[str, Any]
    ) -> float:
        """Validate prompt against professional domain requirements"""
        try:
            if domain == "general":
                return 1.0
            
            # Domain-specific validation would be implemented here
            # This would check for appropriate professional terminology,
            # context, and compliance requirements
            
            professional_score = validation_data.get("professional_context_score", 0.8)
            return professional_score
            
        except Exception as e:
            logger.error(f"Professional validation error: {str(e)}")
            return 0.0
    
    async def health_check(self) -> str:
        """Health check for cultural validation service"""
        try:
            # Test cultural agent connectivity
            test_result = await self.cultural_agent.health_check()
            
            if test_result.get("status") == "healthy":
                return "healthy"
            else:
                return f"unhealthy: {test_result.get('error', 'Unknown error')}"
                
        except Exception as e:
            return f"unhealthy: {str(e)}"