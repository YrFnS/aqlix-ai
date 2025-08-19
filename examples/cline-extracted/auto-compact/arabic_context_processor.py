"""
Arabic Context Processor - Arabic Content Compression and RTL Awareness for Auto Compact

Extracted from: cline/src/core/prompts/contextManagement.ts
Enhanced for: Iraqi AI Chat System with comprehensive Arabic language processing

Core Features:
1. Arabic Content Compression with RTL Awareness
2. Iraqi Dialect Recognition and Preservation
3. Mixed Arabic-English Content Processing
4. RTL Layout Pattern Preservation
5. Arabic Typography and Cultural Context

Iraqi Enhancements:
- Iraqi dialect recognition and preservation
- RTL layout pattern tracking
- Mixed Arabic-English content optimization
- Cultural context-aware Arabic compression
- Professional Arabic terminology preservation
- Arabic script processing and validation
- Regional variation support (Baghdad, Basra, Kurdistan)
"""

from dataclasses import dataclass
from typing import Dict, List, Optional, Any, Tuple
from enum import Enum
from datetime import datetime
import re
import asyncio
import json

class ArabicContentType(str, Enum):
    PURE_ARABIC = "pure_arabic"
    MIXED_CONTENT = "mixed_content"
    ARABIC_TRANSLITERATION = "arabic_transliteration"
    ARABIC_PROFESSIONAL = "arabic_professional"
    IRAQI_DIALECT = "iraqi_dialect"
    STANDARD_ARABIC = "standard_arabic"

class RTLLayoutPattern(str, Enum):
    RIGHT_ALIGN = "right_align"
    MIXED_DIRECTION = "mixed_direction"
    COMPLEX_LAYOUT = "complex_layout"
    FORM_RTL = "form_rtl"
    NAVIGATION_RTL = "navigation_rtl"
    CONTENT_RTL = "content_rtl"

class IraqiDialectRegion(str, Enum):
    BAGHDAD = "baghdad"
    BASRA = "basra"
    MOSUL = "mosul"
    ERBIL = "erbil"
    NAJAF = "najaf"
    KARBALA = "karbala"
    GENERAL = "general"

@dataclass
class ArabicContentSegment:
    """Individual Arabic content segment with metadata"""
    segment_id: str
    content: str
    content_type: ArabicContentType
    rtl_patterns: List[RTLLayoutPattern]
    dialect_region: IraqiDialectRegion
    compression_priority: int
    cultural_significance: float
    professional_relevance: float
    preservation_score: float

@dataclass
class RTLInteractionPattern:
    """RTL interaction pattern with context"""
    pattern_id: str
    pattern_type: RTLLayoutPattern
    interaction_context: str
    layout_requirements: Dict[str, Any]
    validation_rules: List[str]
    preservation_priority: int

@dataclass
class ArabicProcessingResult:
    """Result of Arabic content processing"""
    original_content_length: int
    compressed_content_length: int
    compression_ratio: float
    preserved_segments: List[ArabicContentSegment]
    rtl_patterns_preserved: List[RTLInteractionPattern]
    dialect_recognition_summary: Dict[str, Any]
    arabic_processing_decisions: List[str]
    compression_impact_assessment: Dict[str, Any]

class ArabicContextProcessor:
    """
    Processes and preserves Arabic context during Auto Compact summarization
    
    Handles:
    - Arabic content compression with RTL awareness
    - Iraqi dialect recognition and preservation
    - Mixed Arabic-English content processing
    - RTL layout pattern preservation
    - Arabic typography and cultural context
    - Professional Arabic terminology preservation
    """
    
    def __init__(self):
        self.dialect_recognizer = IraqiDialectRecognizer()
        self.rtl_pattern_analyzer = RTLPatternAnalyzer()
        self.arabic_compressor = ArabicContentCompressor()
        self.mixed_content_processor = MixedContentProcessor()
        self.arabic_validator = ArabicContentValidator()
        
        # Arabic processing configuration
        self.config = {
            "min_arabic_preservation": 0.85,
            "max_compression_ratio": 0.40,    # Max 40% compression for Arabic
            "preserve_dialect_markers": True,
            "preserve_rtl_patterns": True,
            "preserve_professional_arabic": True,
            "min_cultural_significance": 0.70,
            "max_segments_preserved": 100,
            "compression_tolerance": {
                "pure_arabic": 0.20,          # 20% max compression
                "mixed_content": 0.30,        # 30% max compression
                "iraqi_dialect": 0.15,        # 15% max compression
                "professional_arabic": 0.25   # 25% max compression
            }
        }
    
    async def extract_arabic_interactions(self, 
                                        conversation_history: List[Dict[str, Any]], 
                                        cultural_context: Dict[str, Any], 
                                        compression_level: str) -> Dict[str, Any]:
        """
        Extract and process Arabic content for preservation
        
        Args:
            conversation_history: Complete conversation history
            cultural_context: Iraqi cultural context
            compression_level: Compression level (minimal, moderate, aggressive)
            
        Returns:
            Comprehensive Arabic processing summary
        """
        
        # Extract Arabic content segments
        arabic_segments = await self._extract_arabic_segments(conversation_history, cultural_context)
        
        # Analyze RTL interaction patterns
        rtl_patterns = await self._analyze_rtl_patterns(conversation_history, cultural_context)
        
        # Recognize Iraqi dialect variations
        dialect_analysis = await self._analyze_iraqi_dialects(arabic_segments)
        
        # Process mixed Arabic-English content
        mixed_content_analysis = await self._process_mixed_content(arabic_segments)
        
        # Apply compression based on level and priorities
        compressed_segments = await self._compress_arabic_content(
            arabic_segments, compression_level, cultural_context
        )
        
        # Validate preservation quality
        preservation_quality = await self._validate_arabic_preservation(
            compressed_segments, arabic_segments
        )
        
        # Generate Arabic processing decisions
        processing_decisions = await self._generate_processing_decisions(
            compressed_segments, rtl_patterns, dialect_analysis
        )
        
        return {
            "rtl_layout_patterns": [
                {
                    "pattern_type": pattern.pattern_type.value,
                    "interaction_context": pattern.interaction_context,
                    "preservation_priority": pattern.preservation_priority
                }
                for pattern in rtl_patterns
            ],
            "dialect_recognition_patterns": [
                f"{dialect_analysis['primary_region']} dialect recognized",
                f"Regional variations: {', '.join(dialect_analysis['regional_variations'])}",
                f"Dialect confidence: {dialect_analysis['confidence']:.2f}"
            ],
            "arabic_processing_decisions": processing_decisions,
            "mixed_content_handling": mixed_content_analysis,
            "compression_applied": compression_level,
            "preservation_quality_score": preservation_quality["overall_score"],
            "arabic_segments_preserved": len(compressed_segments),
            "total_arabic_segments": len(arabic_segments),
            "preservation_priority": "high",
            "cultural_significance_preserved": preservation_quality["cultural_significance"],
            "professional_terminology_preserved": preservation_quality["professional_terminology"]
        }
    
    async def validate_preservation(self, 
                                  summary: Dict[str, Any], 
                                  original_context: Dict[str, Any]) -> float:
        """
        Validate quality of Arabic content preservation
        
        Args:
            summary: Arabic processing summary
            original_context: Original Arabic context
            
        Returns:
            Arabic preservation quality score (0.0-1.0)
        """
        
        # Validate RTL pattern preservation
        rtl_preservation = await self._validate_rtl_preservation(summary, original_context)
        
        # Validate dialect recognition preservation
        dialect_preservation = await self._validate_dialect_preservation(summary, original_context)
        
        # Validate mixed content preservation
        mixed_content_preservation = await self._validate_mixed_content_preservation(summary, original_context)
        
        # Validate cultural significance preservation
        cultural_preservation = await self._validate_cultural_significance_preservation(summary, original_context)
        
        # Calculate weighted preservation score
        weighted_score = (
            rtl_preservation * 0.30 +
            dialect_preservation * 0.25 +
            mixed_content_preservation * 0.25 +
            cultural_preservation * 0.20
        )
        
        return min(weighted_score, 1.0)
    
    # Internal processing methods
    
    async def _extract_arabic_segments(self, 
                                     conversation_history: List[Dict[str, Any]], 
                                     cultural_context: Dict[str, Any]) -> List[ArabicContentSegment]:
        """Extract Arabic content segments from conversation"""
        segments = []
        
        for i, message in enumerate(conversation_history):
            content = str(message.get("content", ""))
            
            # Check for Arabic content
            if await self._contains_arabic_text(content):
                
                # Identify Arabic content type
                content_type = await self._identify_arabic_content_type(content)
                
                # Detect RTL patterns
                rtl_patterns = await self._detect_rtl_patterns(content)
                
                # Recognize dialect region
                dialect_region = await self._recognize_dialect_region(content)
                
                # Calculate preservation scores
                cultural_significance = await self._calculate_cultural_significance(content, cultural_context)
                professional_relevance = await self._calculate_professional_relevance(content, cultural_context)
                preservation_score = await self._calculate_preservation_score(
                    content, content_type, cultural_significance, professional_relevance
                )
                
                segment = ArabicContentSegment(
                    segment_id=f"arabic_{i}_{datetime.now().strftime('%H%M%S')}",
                    content=content,
                    content_type=content_type,
                    rtl_patterns=rtl_patterns,
                    dialect_region=dialect_region,
                    compression_priority=await self._calculate_compression_priority(content_type, preservation_score),
                    cultural_significance=cultural_significance,
                    professional_relevance=professional_relevance,
                    preservation_score=preservation_score
                )
                segments.append(segment)
        
        return segments
    
    async def _analyze_rtl_patterns(self, 
                                  conversation_history: List[Dict[str, Any]], 
                                  cultural_context: Dict[str, Any]) -> List[RTLInteractionPattern]:
        """Analyze RTL interaction patterns in conversation"""
        patterns = []
        
        for i, message in enumerate(conversation_history):
            content = str(message.get("content", ""))
            
            # Look for RTL-related content
            if await self._contains_rtl_indicators(content):
                
                # Identify RTL pattern types
                pattern_types = await self._identify_rtl_pattern_types(content)
                
                for pattern_type in pattern_types:
                    pattern = RTLInteractionPattern(
                        pattern_id=f"rtl_{i}_{pattern_type.value}_{datetime.now().strftime('%H%M%S')}",
                        pattern_type=pattern_type,
                        interaction_context=await self._extract_rtl_context(content, pattern_type),
                        layout_requirements=await self._extract_layout_requirements(content, pattern_type),
                        validation_rules=await self._extract_validation_rules(content, pattern_type),
                        preservation_priority=await self._calculate_rtl_preservation_priority(pattern_type)
                    )
                    patterns.append(pattern)
        
        return patterns
    
    async def _analyze_iraqi_dialects(self, 
                                    arabic_segments: List[ArabicContentSegment]) -> Dict[str, Any]:
        """Analyze Iraqi dialect variations in Arabic segments"""
        
        dialect_counts = {region.value: 0 for region in IraqiDialectRegion}
        dialect_patterns = []
        total_confidence = 0.0
        
        for segment in arabic_segments:
            if segment.content_type == ArabicContentType.IRAQI_DIALECT:
                dialect_counts[segment.dialect_region.value] += 1
                
                # Extract dialect-specific patterns
                patterns = await self._extract_dialect_patterns(segment.content, segment.dialect_region)
                dialect_patterns.extend(patterns)
                
                # Calculate confidence based on dialect markers
                confidence = await self._calculate_dialect_confidence(segment.content)
                total_confidence += confidence
        
        primary_region = max(dialect_counts, key=dialect_counts.get) if any(dialect_counts.values()) else "general"
        average_confidence = total_confidence / len(arabic_segments) if arabic_segments else 0.0
        regional_variations = [region for region, count in dialect_counts.items() if count > 0]
        
        return {
            "primary_region": primary_region,
            "regional_variations": regional_variations,
            "dialect_patterns": dialect_patterns,
            "confidence": average_confidence,
            "total_dialect_segments": sum(dialect_counts.values())
        }
    
    async def _process_mixed_content(self, 
                                   arabic_segments: List[ArabicContentSegment]) -> Dict[str, Any]:
        """Process mixed Arabic-English content"""
        
        mixed_segments = [s for s in arabic_segments if s.content_type == ArabicContentType.MIXED_CONTENT]
        
        processing_strategies = []
        directional_patterns = []
        
        for segment in mixed_segments:
            # Analyze directional patterns
            directions = await self._analyze_text_directions(segment.content)
            directional_patterns.extend(directions)
            
            # Determine processing strategy
            strategy = await self._determine_mixed_content_strategy(segment)
            processing_strategies.append(strategy)
        
        return {
            "mixed_content_segments": len(mixed_segments),
            "processing_strategies": processing_strategies,
            "directional_patterns": directional_patterns,
            "preservation_approach": "context_aware_separation"
        }
    
    async def _compress_arabic_content(self, 
                                     arabic_segments: List[ArabicContentSegment], 
                                     compression_level: str, 
                                     cultural_context: Dict[str, Any]) -> List[ArabicContentSegment]:
        """Compress Arabic content based on priorities and compression level"""
        
        # Sort segments by preservation priority
        sorted_segments = sorted(arabic_segments, key=lambda s: s.preservation_score, reverse=True)
        
        # Apply compression tolerance based on content type
        compression_ratios = self.config["compression_tolerance"]
        
        compressed_segments = []
        
        for segment in sorted_segments:
            # Determine if segment should be preserved
            should_preserve = await self._should_preserve_segment(segment, compression_level, cultural_context)
            
            if should_preserve:
                # Apply content-type specific compression
                compressed_content = await self._apply_arabic_compression(
                    segment, compression_ratios[segment.content_type.value]
                )
                
                # Update segment with compressed content
                compressed_segment = ArabicContentSegment(
                    segment_id=segment.segment_id,
                    content=compressed_content,
                    content_type=segment.content_type,
                    rtl_patterns=segment.rtl_patterns,
                    dialect_region=segment.dialect_region,
                    compression_priority=segment.compression_priority,
                    cultural_significance=segment.cultural_significance,
                    professional_relevance=segment.professional_relevance,
                    preservation_score=segment.preservation_score
                )
                compressed_segments.append(compressed_segment)
            
            # Limit total preserved segments
            if len(compressed_segments) >= self.config["max_segments_preserved"]:
                break
        
        return compressed_segments
    
    # Helper methods for Arabic content detection and analysis
    
    async def _contains_arabic_text(self, content: str) -> bool:
        """Check if content contains Arabic text"""
        # Check for Arabic Unicode characters (U+0600 to U+06FF)
        arabic_pattern = re.compile(r'[\u0600-\u06FF]')
        return bool(arabic_pattern.search(content))
    
    async def _identify_arabic_content_type(self, content: str) -> ArabicContentType:
        """Identify the type of Arabic content"""
        
        # Check for mixed content (Arabic + Latin characters)
        has_arabic = await self._contains_arabic_text(content)
        has_latin = bool(re.search(r'[a-zA-Z]', content))
        
        if has_arabic and has_latin:
            return ArabicContentType.MIXED_CONTENT
        elif has_arabic:
            # Check for Iraqi dialect markers
            if await self._contains_iraqi_dialect_markers(content):
                return ArabicContentType.IRAQI_DIALECT
            elif await self._contains_professional_arabic(content):
                return ArabicContentType.ARABIC_PROFESSIONAL
            else:
                return ArabicContentType.PURE_ARABIC
        else:
            return ArabicContentType.STANDARD_ARABIC
    
    async def _contains_iraqi_dialect_markers(self, content: str) -> bool:
        """Check for Iraqi dialect markers"""
        iraqi_markers = [
            "شلونك", "شلونج", "اكو", "ماكو", "شوية", "هواية", "زين", "مزبوط",
            "خوش", "طلع", "ويا", "آني", "انتة", "هاي", "ذاك"
        ]
        return any(marker in content for marker in iraqi_markers)
    
    async def _contains_professional_arabic(self, content: str) -> bool:
        """Check for professional Arabic terminology"""
        professional_terms = [
            "قانون", "طبي", "تعليم", "حكومة", "وزارة", "جامعة", "مستشفى", 
            "محكمة", "شركة", "مؤسسة", "خدمة", "طلب"
        ]
        return any(term in content for term in professional_terms)
    
    async def _detect_rtl_patterns(self, content: str) -> List[RTLLayoutPattern]:
        """Detect RTL patterns in content"""
        patterns = []
        
        # Check for form-related RTL patterns
        if any(word in content.lower() for word in ["form", "input", "field", "button"]):
            patterns.append(RTLLayoutPattern.FORM_RTL)
        
        # Check for navigation RTL patterns
        if any(word in content.lower() for word in ["menu", "navigation", "nav", "link"]):
            patterns.append(RTLLayoutPattern.NAVIGATION_RTL)
        
        # Check for content RTL patterns
        if await self._contains_arabic_text(content):
            patterns.append(RTLLayoutPattern.CONTENT_RTL)
        
        # Check for mixed direction patterns
        if await self._identify_arabic_content_type(content) == ArabicContentType.MIXED_CONTENT:
            patterns.append(RTLLayoutPattern.MIXED_DIRECTION)
        
        return patterns if patterns else [RTLLayoutPattern.RIGHT_ALIGN]
    
    async def _recognize_dialect_region(self, content: str) -> IraqiDialectRegion:
        """Recognize Iraqi dialect region"""
        
        # Baghdad dialect markers
        baghdad_markers = ["شلونك", "وين", "آني", "انتة"]
        
        # Basra dialect markers
        basra_markers = ["چاي", "گلت", "گول"]
        
        # Mosul dialect markers
        mosul_markers = ["هیچ", "ایش"]
        
        if any(marker in content for marker in baghdad_markers):
            return IraqiDialectRegion.BAGHDAD
        elif any(marker in content for marker in basra_markers):
            return IraqiDialectRegion.BASRA
        elif any(marker in content for marker in mosul_markers):
            return IraqiDialectRegion.MOSUL
        else:
            return IraqiDialectRegion.GENERAL


# Supporting processor classes (simplified implementations)

class IraqiDialectRecognizer:
    """Recognizes Iraqi dialect variations"""
    
    async def recognize_dialect(self, content: str) -> IraqiDialectRegion:
        """Recognize Iraqi dialect region"""
        return IraqiDialectRegion.GENERAL

class RTLPatternAnalyzer:
    """Analyzes RTL layout patterns"""
    
    async def analyze_patterns(self, content: str) -> List[RTLLayoutPattern]:
        """Analyze RTL patterns"""
        return [RTLLayoutPattern.RIGHT_ALIGN]

class ArabicContentCompressor:
    """Compresses Arabic content intelligently"""
    
    async def compress_content(self, content: str, ratio: float) -> str:
        """Compress Arabic content"""
        return content  # Simplified - no actual compression

class MixedContentProcessor:
    """Processes mixed Arabic-English content"""
    
    async def process_mixed_content(self, content: str) -> Dict[str, Any]:
        """Process mixed content"""
        return {"status": "processed", "method": "direction_aware"}

class ArabicContentValidator:
    """Validates Arabic content processing"""
    
    async def validate_processing(self, original: str, processed: str) -> float:
        """Validate processing quality"""
        return 0.92