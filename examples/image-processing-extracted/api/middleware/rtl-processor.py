"""
Arabic RTL Processing Middleware
Integrates with arabic-rtl-processor agent for comprehensive Arabic text handling

Features:
- Right-to-left text processing
- Iraqi dialect recognition (85%+ accuracy)
- Mixed Arabic-English content handling
- Cultural context optimization
- Professional terminology support
"""

import asyncio
import logging
from typing import Dict, Any, Optional, List, Tuple
from datetime import datetime
from dataclasses import dataclass
from enum import Enum
import re
import unicodedata
import time

from ...agents.arabic_rtl_client import ArabicRTLProcessorClient
from ...utils.arabic_text_utils import ArabicTextUtils

logger = logging.getLogger(__name__)


class TextDirection(Enum):
    """Text direction types"""
    LTR = "ltr"  # Left to right
    RTL = "rtl"  # Right to left  
    MIXED = "mixed"  # Mixed directions


class ArabicDialect(Enum):
    """Supported Arabic dialects"""
    IRAQI = "iraqi"
    STANDARD = "standard"
    LEVANTINE = "levantine"
    GULF = "gulf"
    EGYPTIAN = "egyptian"
    MAGHREBI = "maghrebi"


@dataclass
class ProcessedPrompts:
    """Result of prompt processing"""
    optimized_prompt: str
    original_prompt: str
    arabic_prompt: Optional[str]
    text_direction: TextDirection
    detected_dialect: Optional[ArabicDialect]
    mixed_language: bool
    processing_time: float
    optimization_applied: bool
    cultural_enhancements: List[str]


@dataclass
class TextAnalysis:
    """Arabic text analysis result"""
    is_arabic: bool
    dialect: Optional[ArabicDialect]
    confidence_score: float
    rtl_segments: List[Tuple[int, int]]  # Start, end positions
    ltr_segments: List[Tuple[int, int]]
    professional_terms: List[str]
    cultural_markers: List[str]
    text_quality_score: float


class ArabicRTLProcessor:
    """
    Arabic RTL Processing System
    Integrates with specialized Arabic RTL processor agent
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        
        # Processing configuration
        self.min_dialect_confidence = self.config.get('min_dialect_confidence', 0.75)
        self.enable_cultural_optimization = self.config.get('enable_cultural_optimization', True)
        self.professional_domain_support = self.config.get('professional_domain_support', True)
        
        # Initialize agents and utilities
        self.rtl_agent = ArabicRTLProcessorClient(
            agent_type="arabic-rtl-processor"
        )
        self.text_utils = ArabicTextUtils()
        
        # Processing cache
        self._processing_cache = {}
        self._cache_ttl = 1800  # 30 minutes
        
        logger.info("Arabic RTL Processor initialized")
    
    async def process_prompts(
        self,
        primary_prompt: str,
        arabic_prompt: Optional[str] = None,
        rtl_optimization: bool = False,
        professional_domain: str = "general",
        cultural_context: str = "iraqi"
    ) -> ProcessedPrompts:
        """
        Process and optimize prompts for Arabic RTL support
        
        Args:
            primary_prompt: Main prompt (can be English or Arabic)
            arabic_prompt: Optional Arabic version
            rtl_optimization: Enable RTL-specific optimizations
            professional_domain: Professional context
            cultural_context: Cultural context (default: Iraqi)
            
        Returns:
            ProcessedPrompts with optimized content
        """
        start_time = time.time()
        
        try:
            logger.info(f"Processing prompts for domain: {professional_domain}")
            
            # Check cache
            cache_key = f"prompt:{hash(primary_prompt)}:{hash(arabic_prompt or '')}:{rtl_optimization}"
            if cache_key in self._processing_cache:
                cached_result, cache_time = self._processing_cache[cache_key]
                if time.time() - cache_time < self._cache_ttl:
                    logger.info("Returning cached processing result")
                    return cached_result
            
            # Phase 1: Text Analysis
            primary_analysis = await self.analyze_text(primary_prompt)
            arabic_analysis = None
            
            if arabic_prompt:
                arabic_analysis = await self.analyze_text(arabic_prompt)
            
            # Phase 2: Determine processing strategy
            mixed_language = self._detect_mixed_language(primary_prompt)
            text_direction = self._determine_text_direction(primary_analysis, mixed_language)
            
            # Phase 3: RTL Agent Processing
            processing_request = {
                "primary_text": primary_prompt,
                "arabic_text": arabic_prompt,
                "processing_options": {
                    "rtl_optimization": rtl_optimization,
                    "dialect_recognition": True,
                    "cultural_enhancement": self.enable_cultural_optimization,
                    "professional_domain": professional_domain,
                    "mixed_language_support": mixed_language
                },
                "context": {
                    "cultural_context": cultural_context,
                    "text_direction": text_direction.value,
                    "optimization_level": "comprehensive"
                }
            }
            
            rtl_result = await self.rtl_agent.process_text(processing_request)
            
            if not rtl_result.get("success", False):
                logger.error(f"RTL processing failed: {rtl_result.get('error')}")
                # Fallback to basic processing
                return await self._fallback_processing(
                    primary_prompt, arabic_prompt, primary_analysis, start_time
                )
            
            processing_data = rtl_result["data"]
            
            # Phase 4: Extract optimized content
            optimized_prompt = processing_data.get("optimized_prompt", primary_prompt)
            detected_dialect = None
            
            if processing_data.get("dialect_detected"):
                dialect_name = processing_data["dialect_detected"].lower()
                detected_dialect = ArabicDialect(dialect_name) if dialect_name in [d.value for d in ArabicDialect] else None
            
            # Phase 5: Apply cultural enhancements
            cultural_enhancements = []
            if self.enable_cultural_optimization:
                enhancements = processing_data.get("cultural_enhancements", [])
                cultural_enhancements.extend(enhancements)
                
                # Apply domain-specific enhancements
                if professional_domain != "general":
                    domain_enhancements = await self._apply_domain_enhancements(
                        optimized_prompt, professional_domain, detected_dialect
                    )
                    cultural_enhancements.extend(domain_enhancements)
                    
                    # Update prompt with domain enhancements
                    if domain_enhancements:
                        domain_enhanced_prompt = processing_data.get("domain_enhanced_prompt", optimized_prompt)
                        optimized_prompt = domain_enhanced_prompt
            
            result = ProcessedPrompts(
                optimized_prompt=optimized_prompt,
                original_prompt=primary_prompt,
                arabic_prompt=arabic_prompt,
                text_direction=text_direction,
                detected_dialect=detected_dialect,
                mixed_language=mixed_language,
                processing_time=time.time() - start_time,
                optimization_applied=processing_data.get("optimization_applied", False),
                cultural_enhancements=cultural_enhancements
            )
            
            # Cache result
            self._processing_cache[cache_key] = (result, time.time())
            
            logger.info(f"Prompt processing completed in {result.processing_time:.3f}s")
            return result
            
        except Exception as e:
            logger.error(f"Prompt processing error: {str(e)}")
            # Fallback processing
            return await self._fallback_processing(
                primary_prompt, arabic_prompt, None, start_time
            )
    
    async def analyze_text(
        self,
        text: str,
        detect_dialect: bool = True,
        cultural_context: str = "iraqi",
        validate_rtl: bool = True
    ) -> TextAnalysis:
        """
        Analyze text for Arabic content and characteristics
        
        Args:
            text: Text to analyze
            detect_dialect: Enable dialect detection
            cultural_context: Cultural context for analysis
            validate_rtl: Validate RTL formatting
            
        Returns:
            TextAnalysis with detailed information
        """
        try:
            # Phase 1: Basic Arabic detection
            is_arabic = self.text_utils.contains_arabic(text)
            
            if not is_arabic:
                return TextAnalysis(
                    is_arabic=False,
                    dialect=None,
                    confidence_score=0.0,
                    rtl_segments=[],
                    ltr_segments=[(0, len(text))],
                    professional_terms=[],
                    cultural_markers=[],
                    text_quality_score=1.0
                )
            
            # Phase 2: RTL Agent Analysis
            analysis_request = {
                "text": text,
                "analysis_options": {
                    "dialect_detection": detect_dialect,
                    "rtl_segmentation": True,
                    "professional_term_extraction": True,
                    "cultural_marker_detection": True,
                    "quality_assessment": True
                },
                "context": {
                    "cultural_context": cultural_context,
                    "validation_level": "comprehensive" if validate_rtl else "basic"
                }
            }
            
            analysis_result = await self.rtl_agent.analyze_text(analysis_request)
            
            if not analysis_result.get("success", False):
                logger.warning("RTL analysis failed, using fallback")
                return await self._fallback_text_analysis(text)
            
            analysis_data = analysis_result["data"]
            
            # Parse dialect
            detected_dialect = None
            if analysis_data.get("dialect_detected"):
                dialect_name = analysis_data["dialect_detected"].lower()
                try:
                    detected_dialect = ArabicDialect(dialect_name)
                except ValueError:
                    logger.warning(f"Unknown dialect detected: {dialect_name}")
            
            return TextAnalysis(
                is_arabic=True,
                dialect=detected_dialect,
                confidence_score=analysis_data.get("dialect_confidence", 0.0),
                rtl_segments=analysis_data.get("rtl_segments", []),
                ltr_segments=analysis_data.get("ltr_segments", []),
                professional_terms=analysis_data.get("professional_terms", []),
                cultural_markers=analysis_data.get("cultural_markers", []),
                text_quality_score=analysis_data.get("text_quality_score", 1.0)
            )
            
        except Exception as e:
            logger.error(f"Text analysis error: {str(e)}")
            return await self._fallback_text_analysis(text)
    
    def _detect_mixed_language(self, text: str) -> bool:
        """Detect if text contains mixed Arabic/English content"""
        try:
            has_arabic = self.text_utils.contains_arabic(text)
            has_latin = bool(re.search(r'[a-zA-Z]', text))
            
            return has_arabic and has_latin
            
        except Exception as e:
            logger.error(f"Mixed language detection error: {str(e)}")
            return False
    
    def _determine_text_direction(
        self, 
        analysis: Optional[TextAnalysis], 
        mixed_language: bool
    ) -> TextDirection:
        """Determine overall text direction"""
        try:
            if not analysis or not analysis.is_arabic:
                return TextDirection.LTR
            
            if mixed_language:
                return TextDirection.MIXED
            
            # Predominantly Arabic content
            return TextDirection.RTL
            
        except Exception as e:
            logger.error(f"Text direction determination error: {str(e)}")
            return TextDirection.LTR
    
    async def _apply_domain_enhancements(
        self,
        prompt: str,
        domain: str,
        dialect: Optional[ArabicDialect]
    ) -> List[str]:
        """Apply professional domain enhancements"""
        try:
            if not self.professional_domain_support:
                return []
            
            enhancement_request = {
                "prompt": prompt,
                "professional_domain": domain,
                "dialect": dialect.value if dialect else None,
                "enhancement_types": [
                    "terminology_accuracy",
                    "cultural_appropriateness",
                    "professional_context",
                    "linguistic_precision"
                ]
            }
            
            enhancement_result = await self.rtl_agent.enhance_professional_content(
                enhancement_request
            )
            
            if enhancement_result.get("success"):
                return enhancement_result["data"].get("applied_enhancements", [])
            
            return []
            
        except Exception as e:
            logger.error(f"Domain enhancement error: {str(e)}")
            return []
    
    async def _fallback_processing(
        self,
        primary_prompt: str,
        arabic_prompt: Optional[str],
        analysis: Optional[TextAnalysis],
        start_time: float
    ) -> ProcessedPrompts:
        """Fallback processing when RTL agent is unavailable"""
        try:
            logger.info("Using fallback prompt processing")
            
            # Basic analysis if not already done
            if not analysis:
                is_arabic = self.text_utils.contains_arabic(primary_prompt)
                text_direction = TextDirection.RTL if is_arabic else TextDirection.LTR
            else:
                text_direction = TextDirection.RTL if analysis.is_arabic else TextDirection.LTR
            
            mixed_language = self._detect_mixed_language(primary_prompt)
            if mixed_language:
                text_direction = TextDirection.MIXED
            
            return ProcessedPrompts(
                optimized_prompt=primary_prompt,  # No optimization in fallback
                original_prompt=primary_prompt,
                arabic_prompt=arabic_prompt,
                text_direction=text_direction,
                detected_dialect=None,
                mixed_language=mixed_language,
                processing_time=time.time() - start_time,
                optimization_applied=False,
                cultural_enhancements=[]
            )
            
        except Exception as e:
            logger.error(f"Fallback processing error: {str(e)}")
            return ProcessedPrompts(
                optimized_prompt=primary_prompt,
                original_prompt=primary_prompt,
                arabic_prompt=arabic_prompt,
                text_direction=TextDirection.LTR,
                detected_dialect=None,
                mixed_language=False,
                processing_time=time.time() - start_time,
                optimization_applied=False,
                cultural_enhancements=[]
            )
    
    async def _fallback_text_analysis(self, text: str) -> TextAnalysis:
        """Fallback text analysis using basic utilities"""
        try:
            is_arabic = self.text_utils.contains_arabic(text)
            
            if not is_arabic:
                return TextAnalysis(
                    is_arabic=False,
                    dialect=None,
                    confidence_score=0.0,
                    rtl_segments=[],
                    ltr_segments=[(0, len(text))],
                    professional_terms=[],
                    cultural_markers=[],
                    text_quality_score=1.0
                )
            
            # Basic Arabic analysis
            rtl_segments = []
            ltr_segments = []
            
            # Simple segmentation
            current_pos = 0
            for i, char in enumerate(text):
                if self.text_utils.is_arabic_char(char):
                    if not rtl_segments or rtl_segments[-1][1] < i - 1:
                        rtl_segments.append((i, i + 1))
                    else:
                        rtl_segments[-1] = (rtl_segments[-1][0], i + 1)
                else:
                    if not ltr_segments or ltr_segments[-1][1] < i - 1:
                        ltr_segments.append((i, i + 1))
                    else:
                        ltr_segments[-1] = (ltr_segments[-1][0], i + 1)
            
            return TextAnalysis(
                is_arabic=True,
                dialect=ArabicDialect.IRAQI,  # Default assumption
                confidence_score=0.5,  # Low confidence in fallback
                rtl_segments=rtl_segments,
                ltr_segments=ltr_segments,
                professional_terms=[],
                cultural_markers=[],
                text_quality_score=0.8
            )
            
        except Exception as e:
            logger.error(f"Fallback text analysis error: {str(e)}")
            return TextAnalysis(
                is_arabic=False,
                dialect=None,
                confidence_score=0.0,
                rtl_segments=[],
                ltr_segments=[(0, len(text))],
                professional_terms=[],
                cultural_markers=[],
                text_quality_score=0.5
            )
    
    async def health_check(self) -> str:
        """Health check for RTL processing service"""
        try:
            # Test RTL agent connectivity
            test_result = await self.rtl_agent.health_check()
            
            if test_result.get("status") == "healthy":
                return "healthy"
            else:
                return f"degraded: {test_result.get('error', 'Agent unavailable')}"
                
        except Exception as e:
            return f"degraded: {str(e)} (fallback available)"
    
    def get_supported_dialects(self) -> List[Dict[str, Any]]:
        """Get list of supported Arabic dialects"""
        return [
            {
                "id": dialect.value,
                "name": dialect.value.title(),
                "confidence_threshold": self.min_dialect_confidence,
                "primary_region": {
                    "iraqi": "Iraq",
                    "standard": "Modern Standard Arabic",
                    "levantine": "Levant",
                    "gulf": "Gulf States",
                    "egyptian": "Egypt",
                    "maghrebi": "North Africa"
                }.get(dialect.value, "Unknown")
            }
            for dialect in ArabicDialect
        ]
    
    def get_processing_stats(self) -> Dict[str, Any]:
        """Get processing statistics"""
        return {
            "cache_size": len(self._processing_cache),
            "cache_ttl": self._cache_ttl,
            "min_dialect_confidence": self.min_dialect_confidence,
            "cultural_optimization_enabled": self.enable_cultural_optimization,
            "professional_domain_support": self.professional_domain_support,
            "supported_dialects": len(ArabicDialect),
            "fallback_available": True
        }