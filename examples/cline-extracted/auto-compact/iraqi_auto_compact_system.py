"""
Iraqi Auto-Compact System - Intelligent compression with cultural preservation
Part of Cline extraction with Iraqi government service integration

Implements advanced auto-compact functionality with Arabic text preservation,
cultural context maintenance, and Islamic compliance validation.
"""

from typing import Dict, List, Optional, Union, Any, Tuple, Set
from dataclasses import dataclass, field
from enum import Enum
import asyncio
import json
import time
from datetime import datetime
import re
import unicodedata
from collections import defaultdict
import hashlib
import logging

class CompactLevel(Enum):
    """Compression levels for different contexts"""
    MINIMAL = "minimal"           # 10-20% compression
    STANDARD = "standard"         # 30-50% compression
    AGGRESSIVE = "aggressive"     # 60-80% compression
    EMERGENCY = "emergency"       # 80-95% compression

class ContentType(Enum):
    """Content types for context-aware compression"""
    ARABIC_TEXT = "arabic_text"
    ENGLISH_TEXT = "english_text"
    MIXED_LANGUAGE = "mixed_language"
    CODE_CONTENT = "code_content"
    TECHNICAL_DOCS = "technical_docs"
    CULTURAL_CONTENT = "cultural_content"
    GOVERNMENT_FORMS = "government_forms"
    LEGAL_DOCUMENTS = "legal_documents"

class CulturalPreservationLevel(Enum):
    """Levels of cultural context preservation"""
    BASIC = "basic"               # Essential cultural markers only
    STANDARD = "standard"         # Important cultural context
    COMPREHENSIVE = "comprehensive"  # Full cultural preservation
    CRITICAL = "critical"         # No cultural information loss

@dataclass
class CompressionMetrics:
    """Metrics for compression effectiveness"""
    original_length: int
    compressed_length: int
    compression_ratio: float
    cultural_preservation_score: float
    information_loss_score: float
    processing_time: float
    content_type: ContentType
    compression_level: CompactLevel

@dataclass
class CulturalMarker:
    """Cultural significance marker for preservation"""
    text: str
    category: str
    importance: float
    islamic_relevance: bool
    government_relevance: bool
    citizen_impact: bool
    preservation_required: bool

@dataclass
class CompressionContext:
    """Context information for intelligent compression"""
    user_type: str = "citizen"  # citizen, government, ministry, developer
    domain: str = "general"     # legal, medical, educational, government
    urgency: str = "normal"     # low, normal, high, critical
    cultural_sensitivity: str = "standard"  # low, standard, high, critical
    arabic_content_ratio: float = 0.0
    government_classification: Optional[str] = None
    ministry_coordination: bool = False

class IraqiAutoCompactSystem:
    """
    Intelligent Auto-Compact System for Iraqi Government Services
    
    Provides context-aware compression with cultural preservation,
    Arabic text optimization, and Islamic compliance maintenance.
    """
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.logger = logging.getLogger(__name__)
        
        # Cultural and language analyzers
        self.arabic_analyzer = ArabicTextAnalyzer()
        self.cultural_analyzer = IraqiCulturalAnalyzer()
        self.islamic_validator = IslamicContentValidator()
        
        # Compression engines
        self.text_compressor = IntelligentTextCompressor()
        self.code_compressor = CodeAwareCompressor()
        self.cultural_preservor = CulturalContextPreservation()
        
        # Performance tracking
        self.compression_stats = defaultdict(list)
        self.cultural_preservation_stats = defaultdict(float)
        
        # Configuration
        self.default_compression_level = CompactLevel.STANDARD
        self.cultural_preservation_threshold = 0.85
        self.arabic_preservation_priority = True
        self.islamic_compliance_required = True
    
    async def auto_compact(self, content: str, 
                          context: Optional[CompressionContext] = None,
                          target_compression: Optional[CompactLevel] = None) -> Dict[str, Any]:
        """
        Automatically compress content with cultural awareness
        
        Args:
            content: Text content to compress
            context: Compression context information
            target_compression: Desired compression level
            
        Returns:
            Compression results with metrics and cultural validation
        """
        start_time = time.time()
        context = context or CompressionContext()
        target_compression = target_compression or self.default_compression_level
        
        try:
            # Analyze content characteristics
            content_analysis = await self._analyze_content(content, context)
            
            # Identify cultural markers for preservation
            cultural_markers = await self._identify_cultural_markers(content, context)
            
            # Select appropriate compression strategy
            compression_strategy = await self._select_compression_strategy(
                content_analysis, cultural_markers, target_compression, context
            )
            
            # Execute compression with cultural preservation
            compressed_result = await self._execute_compression(
                content, compression_strategy, cultural_markers, context
            )
            
            # Validate cultural integrity
            cultural_validation = await self._validate_cultural_integrity(
                content, compressed_result["compressed_content"], cultural_markers
            )
            
            # Calculate metrics
            metrics = CompressionMetrics(
                original_length=len(content),
                compressed_length=len(compressed_result["compressed_content"]),
                compression_ratio=compressed_result["compression_ratio"],
                cultural_preservation_score=cultural_validation["preservation_score"],
                information_loss_score=cultural_validation["information_loss"],
                processing_time=time.time() - start_time,
                content_type=content_analysis["primary_type"],
                compression_level=target_compression
            )
            
            # Compile results
            result = {
                "success": True,
                "original_content": content,
                "compressed_content": compressed_result["compressed_content"],
                "compression_details": compressed_result,
                "cultural_validation": cultural_validation,
                "metrics": metrics,
                "recommendations": await self._generate_recommendations(metrics, cultural_validation)
            }
            
            # Update statistics
            await self._update_compression_statistics(metrics, cultural_validation)
            
            self.logger.info(f"Auto-compact completed: {metrics.compression_ratio:.1%} compression, "
                           f"{metrics.cultural_preservation_score:.2f} cultural preservation")
            
            return result
            
        except Exception as e:
            self.logger.error(f"Auto-compact failed: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "original_content": content,
                "compressed_content": content,  # Return original on failure
                "metrics": None
            }
    
    async def _analyze_content(self, content: str, context: CompressionContext) -> Dict[str, Any]:
        """Analyze content characteristics for compression planning"""
        
        # Basic content statistics
        content_stats = {
            "length": len(content),
            "word_count": len(content.split()),
            "line_count": len(content.splitlines()),
            "paragraph_count": len([p for p in content.split('\n\n') if p.strip()])
        }
        
        # Language analysis
        arabic_analysis = await self.arabic_analyzer.analyze_content(content)
        content_stats.update(arabic_analysis)
        
        # Content type detection
        content_type = await self._detect_content_type(content, arabic_analysis)
        
        # Technical content analysis
        technical_analysis = await self._analyze_technical_content(content)
        
        # Cultural significance analysis
        cultural_analysis = await self.cultural_analyzer.analyze_significance(content, context)
        
        return {
            "primary_type": content_type,
            "content_stats": content_stats,
            "arabic_analysis": arabic_analysis,
            "technical_analysis": technical_analysis,
            "cultural_analysis": cultural_analysis,
            "compressibility_score": await self._calculate_compressibility(content, content_type)
        }
    
    async def _identify_cultural_markers(self, content: str, 
                                       context: CompressionContext) -> List[CulturalMarker]:
        """Identify cultural markers that require preservation"""
        markers = []
        
        # Islamic terms and concepts
        islamic_markers = await self.islamic_validator.identify_islamic_content(content)
        for marker in islamic_markers:
            markers.append(CulturalMarker(
                text=marker["text"],
                category="islamic",
                importance=marker["importance"],
                islamic_relevance=True,
                government_relevance=marker.get("government_relevant", False),
                citizen_impact=marker.get("citizen_impact", True),
                preservation_required=True
            ))
        
        # Iraqi cultural references
        cultural_markers = await self.cultural_analyzer.identify_cultural_references(content)
        for marker in cultural_markers:
            markers.append(CulturalMarker(
                text=marker["text"],
                category="cultural",
                importance=marker["importance"],
                islamic_relevance=marker.get("islamic_relevance", False),
                government_relevance=marker.get("government_relevance", False),
                citizen_impact=marker.get("citizen_impact", True),
                preservation_required=marker["importance"] > 0.7
            ))
        
        # Government and legal terms
        if context.domain in ["government", "legal"]:
            gov_markers = await self._identify_government_markers(content, context)
            markers.extend(gov_markers)
        
        # Arabic linguistic markers
        arabic_markers = await self.arabic_analyzer.identify_linguistic_markers(content)
        for marker in arabic_markers:
            markers.append(CulturalMarker(
                text=marker["text"],
                category="linguistic",
                importance=marker["importance"],
                islamic_relevance=False,
                government_relevance=False,
                citizen_impact=True,
                preservation_required=marker["importance"] > 0.6
            ))
        
        return markers
    
    async def _select_compression_strategy(self, content_analysis: Dict[str, Any],
                                         cultural_markers: List[CulturalMarker],
                                         target_compression: CompactLevel,
                                         context: CompressionContext) -> Dict[str, Any]:
        """Select optimal compression strategy based on analysis"""
        
        strategy = {
            "compression_level": target_compression,
            "preserve_cultural_markers": True,
            "preserve_arabic_integrity": True,
            "preserve_islamic_content": self.islamic_compliance_required,
            "compression_techniques": []
        }
        
        # Adjust strategy based on content type
        content_type = content_analysis["primary_type"]
        
        if content_type == ContentType.ARABIC_TEXT:
            strategy["compression_techniques"].extend([
                "arabic_aware_abbreviation",
                "rtl_layout_preservation",
                "arabic_punctuation_optimization",
                "diacritic_preservation"
            ])
        
        elif content_type == ContentType.MIXED_LANGUAGE:
            strategy["compression_techniques"].extend([
                "language_boundary_preservation",
                "code_switching_awareness",
                "bilingual_optimization"
            ])
        
        elif content_type == ContentType.CODE_CONTENT:
            strategy["compression_techniques"].extend([
                "syntax_aware_compression",
                "comment_optimization",
                "variable_name_preservation",
                "structure_maintenance"
            ])
        
        elif content_type in [ContentType.GOVERNMENT_FORMS, ContentType.LEGAL_DOCUMENTS]:
            strategy["compression_techniques"].extend([
                "legal_term_preservation",
                "formal_structure_maintenance",
                "official_language_preservation",
                "ministry_reference_preservation"
            ])
        
        # Adjust for cultural preservation requirements
        high_cultural_importance = any(m.importance > 0.8 for m in cultural_markers)
        if high_cultural_importance:
            strategy["cultural_preservation_level"] = CulturalPreservationLevel.COMPREHENSIVE
            strategy["compression_level"] = min(strategy["compression_level"], CompactLevel.STANDARD)
        
        # Adjust for context requirements
        if context.cultural_sensitivity == "critical":
            strategy["cultural_preservation_level"] = CulturalPreservationLevel.CRITICAL
            strategy["compression_level"] = CompactLevel.MINIMAL
        
        if context.government_classification in ["restricted", "confidential"]:
            strategy["compression_techniques"].append("classification_aware_compression")
        
        return strategy
    
    async def _execute_compression(self, content: str, strategy: Dict[str, Any],
                                 cultural_markers: List[CulturalMarker],
                                 context: CompressionContext) -> Dict[str, Any]:
        """Execute compression using selected strategy"""
        
        compressed_content = content
        compression_steps = []
        
        # Apply compression techniques in order
        for technique in strategy["compression_techniques"]:
            if technique == "arabic_aware_abbreviation":
                result = await self.text_compressor.apply_arabic_abbreviations(
                    compressed_content, cultural_markers
                )
                compressed_content = result["content"]
                compression_steps.append(result["step_info"])
            
            elif technique == "rtl_layout_preservation":
                result = await self.text_compressor.preserve_rtl_structure(compressed_content)
                compressed_content = result["content"]
                compression_steps.append(result["step_info"])
            
            elif technique == "syntax_aware_compression":
                result = await self.code_compressor.compress_code_content(compressed_content)
                compressed_content = result["content"]
                compression_steps.append(result["step_info"])
            
            elif technique == "cultural_marker_preservation":
                result = await self.cultural_preservor.preserve_markers(
                    compressed_content, cultural_markers
                )
                compressed_content = result["content"]
                compression_steps.append(result["step_info"])
            
            # Additional technique implementations...
        
        # Apply general text compression
        if strategy["compression_level"] != CompactLevel.MINIMAL:
            result = await self.text_compressor.apply_general_compression(
                compressed_content, strategy["compression_level"], cultural_markers
            )
            compressed_content = result["content"]
            compression_steps.append(result["step_info"])
        
        # Calculate final compression ratio
        original_length = len(content)
        compressed_length = len(compressed_content)
        compression_ratio = 1.0 - (compressed_length / original_length)
        
        return {
            "compressed_content": compressed_content,
            "compression_ratio": compression_ratio,
            "compression_steps": compression_steps,
            "strategy_used": strategy,
            "original_length": original_length,
            "compressed_length": compressed_length
        }
    
    async def _validate_cultural_integrity(self, original: str, compressed: str,
                                         cultural_markers: List[CulturalMarker]) -> Dict[str, Any]:
        """Validate that cultural integrity is maintained after compression"""
        
        validation_results = {
            "preservation_score": 0.0,
            "information_loss": 0.0,
            "cultural_markers_preserved": 0,
            "cultural_markers_lost": 0,
            "islamic_compliance_maintained": True,
            "arabic_integrity_maintained": True,
            "validation_details": []
        }
        
        # Check preservation of cultural markers
        preserved_markers = 0
        for marker in cultural_markers:
            if marker.text in compressed or await self._check_semantic_preservation(marker, compressed):
                preserved_markers += 1
            else:
                validation_results["validation_details"].append({
                    "issue": f"Cultural marker lost: {marker.text}",
                    "category": marker.category,
                    "importance": marker.importance
                })
        
        validation_results["cultural_markers_preserved"] = preserved_markers
        validation_results["cultural_markers_lost"] = len(cultural_markers) - preserved_markers
        
        # Calculate preservation score
        if cultural_markers:
            preservation_ratio = preserved_markers / len(cultural_markers)
            validation_results["preservation_score"] = preservation_ratio
        else:
            validation_results["preservation_score"] = 1.0
        
        # Validate Islamic compliance
        islamic_validation = await self.islamic_validator.validate_compressed_content(
            original, compressed
        )
        validation_results["islamic_compliance_maintained"] = islamic_validation["compliant"]
        
        # Validate Arabic text integrity
        if await self.arabic_analyzer.has_arabic_content(original):
            arabic_validation = await self.arabic_analyzer.validate_compression_integrity(
                original, compressed
            )
            validation_results["arabic_integrity_maintained"] = arabic_validation["integrity_maintained"]
            validation_results["validation_details"].extend(arabic_validation["details"])
        
        # Calculate information loss score
        semantic_similarity = await self._calculate_semantic_similarity(original, compressed)
        validation_results["information_loss"] = 1.0 - semantic_similarity
        
        return validation_results
    
    async def _detect_content_type(self, content: str, arabic_analysis: Dict[str, Any]) -> ContentType:
        """Detect the primary content type for compression optimization"""
        
        arabic_ratio = arabic_analysis.get("arabic_percentage", 0.0)
        
        # Check for code content
        if await self._is_code_content(content):
            return ContentType.CODE_CONTENT
        
        # Check language composition
        if arabic_ratio > 0.8:
            return ContentType.ARABIC_TEXT
        elif arabic_ratio > 0.2:
            return ContentType.MIXED_LANGUAGE
        elif arabic_ratio < 0.1:
            return ContentType.ENGLISH_TEXT
        
        # Check for government/legal content
        if await self._is_government_content(content):
            return ContentType.GOVERNMENT_FORMS
        
        if await self._is_legal_content(content):
            return ContentType.LEGAL_DOCUMENTS
        
        # Check for cultural significance
        if await self.cultural_analyzer.has_significant_cultural_content(content):
            return ContentType.CULTURAL_CONTENT
        
        # Check for technical documentation
        if await self._is_technical_docs(content):
            return ContentType.TECHNICAL_DOCS
        
        # Default based on language composition
        return ContentType.MIXED_LANGUAGE if arabic_ratio > 0 else ContentType.ENGLISH_TEXT
    
    async def _generate_recommendations(self, metrics: CompressionMetrics,
                                      cultural_validation: Dict[str, Any]) -> List[str]:
        """Generate recommendations for improving compression"""
        recommendations = []
        
        # Compression effectiveness recommendations
        if metrics.compression_ratio < 0.2:
            recommendations.append("Consider using more aggressive compression techniques for better space savings")
        elif metrics.compression_ratio > 0.8:
            recommendations.append("Compression may be too aggressive - consider preserving more original content")
        
        # Cultural preservation recommendations
        if cultural_validation["preservation_score"] < 0.8:
            recommendations.append("Cultural preservation could be improved - consider adjusting compression strategy")
        
        if not cultural_validation["islamic_compliance_maintained"]:
            recommendations.append("Islamic compliance issues detected - review compressed content carefully")
        
        if not cultural_validation["arabic_integrity_maintained"]:
            recommendations.append("Arabic text integrity compromised - consider Arabic-specific compression techniques")
        
        # Performance recommendations
        if metrics.processing_time > 5.0:
            recommendations.append("Processing time is high - consider optimizing compression pipeline")
        
        # Content-specific recommendations
        if metrics.content_type == ContentType.ARABIC_TEXT:
            recommendations.append("For Arabic content, ensure RTL layout and diacritics are properly preserved")
        
        if metrics.content_type == ContentType.GOVERNMENT_FORMS:
            recommendations.append("Government content requires careful preservation of official terminology")
        
        return recommendations
    
    async def _update_compression_statistics(self, metrics: CompressionMetrics,
                                           cultural_validation: Dict[str, Any]):
        """Update compression statistics for performance monitoring"""
        
        content_type = metrics.content_type.value
        
        # Update compression ratio statistics
        self.compression_stats[f"{content_type}_compression_ratio"].append(metrics.compression_ratio)
        
        # Update cultural preservation statistics
        self.cultural_preservation_stats[f"{content_type}_preservation"] = cultural_validation["preservation_score"]
        
        # Update processing time statistics
        self.compression_stats[f"{content_type}_processing_time"].append(metrics.processing_time)
        
        # Log performance metrics
        self.logger.info(f"Updated stats for {content_type}: "
                        f"compression={metrics.compression_ratio:.2%}, "
                        f"preservation={cultural_validation['preservation_score']:.2f}, "
                        f"time={metrics.processing_time:.2f}s")

# Supporting analyzer classes (simplified implementations)

class ArabicTextAnalyzer:
    async def analyze_content(self, content: str) -> Dict[str, Any]:
        # Simplified Arabic analysis
        arabic_chars = sum(1 for c in content if '\u0600' <= c <= '\u06FF')
        total_chars = len(content)
        arabic_percentage = arabic_chars / total_chars if total_chars > 0 else 0.0
        
        return {
            "arabic_percentage": arabic_percentage,
            "has_arabic": arabic_percentage > 0,
            "has_rtl": arabic_percentage > 0.1,
            "mixed_content": 0.1 < arabic_percentage < 0.9
        }
    
    async def has_arabic_content(self, content: str) -> bool:
        return any('\u0600' <= c <= '\u06FF' for c in content)
    
    async def identify_linguistic_markers(self, content: str) -> List[Dict[str, Any]]:
        return [{"text": "مرحبا", "importance": 0.8}]  # Example
    
    async def validate_compression_integrity(self, original: str, compressed: str) -> Dict[str, Any]:
        return {"integrity_maintained": True, "details": []}

class IraqiCulturalAnalyzer:
    async def analyze_significance(self, content: str, context: CompressionContext) -> Dict[str, Any]:
        return {"cultural_significance": 0.5, "preservation_priority": "standard"}
    
    async def identify_cultural_references(self, content: str) -> List[Dict[str, Any]]:
        return [{"text": "العراق", "importance": 0.9, "category": "country_reference"}]
    
    async def has_significant_cultural_content(self, content: str) -> bool:
        cultural_terms = ["العراق", "بغداد", "الإسلام", "المسلم"]
        return any(term in content for term in cultural_terms)

class IslamicContentValidator:
    async def identify_islamic_content(self, content: str) -> List[Dict[str, Any]]:
        islamic_terms = ["الله", "الإسلام", "المسجد", "الصلاة", "القرآن"]
        found_terms = []
        for term in islamic_terms:
            if term in content:
                found_terms.append({
                    "text": term,
                    "importance": 1.0,
                    "government_relevant": False,
                    "citizen_impact": True
                })
        return found_terms
    
    async def validate_compressed_content(self, original: str, compressed: str) -> Dict[str, Any]:
        return {"compliant": True, "issues": []}

class IntelligentTextCompressor:
    async def apply_arabic_abbreviations(self, content: str, markers: List[CulturalMarker]) -> Dict[str, Any]:
        # Simplified Arabic abbreviation
        abbreviated = content.replace("وعليكم السلام", "وع.س")  # Example
        return {
            "content": abbreviated,
            "step_info": {"technique": "arabic_abbreviation", "reduction": len(content) - len(abbreviated)}
        }
    
    async def preserve_rtl_structure(self, content: str) -> Dict[str, Any]:
        return {"content": content, "step_info": {"technique": "rtl_preservation", "reduction": 0}}
    
    async def apply_general_compression(self, content: str, level: CompactLevel, 
                                      markers: List[CulturalMarker]) -> Dict[str, Any]:
        # Simple compression simulation
        compression_ratios = {
            CompactLevel.MINIMAL: 0.1,
            CompactLevel.STANDARD: 0.3,
            CompactLevel.AGGRESSIVE: 0.6,
            CompactLevel.EMERGENCY: 0.8
        }
        
        ratio = compression_ratios[level]
        target_length = int(len(content) * (1 - ratio))
        compressed = content[:target_length] + "..."
        
        return {
            "content": compressed,
            "step_info": {"technique": "general_compression", "reduction": len(content) - len(compressed)}
        }

class CodeAwareCompressor:
    async def compress_code_content(self, content: str) -> Dict[str, Any]:
        # Simplified code compression
        compressed = re.sub(r'\s+', ' ', content)  # Remove extra whitespace
        return {
            "content": compressed,
            "step_info": {"technique": "code_compression", "reduction": len(content) - len(compressed)}
        }

class CulturalContextPreservation:
    async def preserve_markers(self, content: str, markers: List[CulturalMarker]) -> Dict[str, Any]:
        # Ensure cultural markers are preserved
        preserved_content = content
        preservation_count = 0
        
        for marker in markers:
            if marker.preservation_required and marker.text not in preserved_content:
                preserved_content += f" {marker.text}"
                preservation_count += 1
        
        return {
            "content": preserved_content,
            "step_info": {"technique": "cultural_preservation", "markers_preserved": preservation_count}
        }