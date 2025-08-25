"""Iraqi DOM Processor with Cultural Validation and Arabic RTL Processing.

Specialized DOM processing system for Iraqi AI applications with comprehensive
cultural validation, Arabic RTL support, and Islamic compliance checking.
"""

import asyncio
import logging
from typing import Dict, List, Optional, Any, Union
from dataclasses import dataclass
from enum import Enum

from .service import DomService
from .views import (
    EnhancedDOMTreeNode,
    DOMRect,
    NodeType,
    CulturalValidationLevel,
    AccessibilityLevel,
    SerializedDOMState,
)


class IraqiValidationResult(Enum):
    """Iraqi validation result levels."""
    APPROVED = "approved"
    WARNING = "warning" 
    REJECTED = "rejected"
    REQUIRES_REVIEW = "requires_review"


@dataclass
class IraqiDOMValidation:
    """Comprehensive Iraqi DOM validation result."""
    overall_score: float
    cultural_compliance: float
    islamic_compliance: float
    accessibility_score: float
    arabic_support_quality: float
    government_compliance: Optional[float] = None
    
    violations: List[str] = None
    recommendations: List[str] = None
    arabic_elements_processed: int = 0
    rtl_layout_quality: float = 1.0
    
    validation_level: CulturalValidationLevel = CulturalValidationLevel.MODERATE
    result: IraqiValidationResult = IraqiValidationResult.APPROVED
    
    def __post_init__(self):
        """Post-initialization validation processing."""
        if self.violations is None:
            self.violations = []
        if self.recommendations is None:
            self.recommendations = []
            
        self._determine_result()
    
    def _determine_result(self):
        """Determine validation result based on scores."""
        if self.cultural_compliance < 0.3 or self.islamic_compliance < 0.3:
            self.result = IraqiValidationResult.REJECTED
        elif self.cultural_compliance < 0.6 or self.islamic_compliance < 0.6:
            self.result = IraqiValidationResult.WARNING
        elif self.overall_score < 0.7:
            self.result = IraqiValidationResult.REQUIRES_REVIEW
        else:
            self.result = IraqiValidationResult.APPROVED
    
    def is_approved(self) -> bool:
        """Check if validation is approved."""
        return self.result == IraqiValidationResult.APPROVED
    
    def has_warnings(self) -> bool:
        """Check if validation has warnings."""
        return self.result in [IraqiValidationResult.WARNING, IraqiValidationResult.REQUIRES_REVIEW]
    
    def is_rejected(self) -> bool:
        """Check if validation is rejected."""
        return self.result == IraqiValidationResult.REJECTED
    
    def get_summary(self) -> Dict[str, Any]:
        """Get comprehensive validation summary."""
        return {
            'result': self.result.value,
            'scores': {
                'overall': self.overall_score,
                'cultural_compliance': self.cultural_compliance,
                'islamic_compliance': self.islamic_compliance,
                'accessibility': self.accessibility_score,
                'arabic_support': self.arabic_support_quality,
                'rtl_layout': self.rtl_layout_quality,
                'government_compliance': self.government_compliance,
            },
            'analysis': {
                'arabic_elements_processed': self.arabic_elements_processed,
                'violations_count': len(self.violations),
                'recommendations_count': len(self.recommendations),
                'validation_level': self.validation_level.value,
            },
            'details': {
                'violations': self.violations,
                'recommendations': self.recommendations,
            }
        }


class IraqiDOMProcessor(DomService):
    """Enhanced DOM processor with comprehensive Iraqi AI integration.
    
    Extends the base DomService with Iraqi-specific processing:
    - Cultural content validation with Islamic compliance
    - Arabic RTL layout processing and optimization
    - Government portal form processing
    - Accessibility enhancements for Arabic content
    - Performance optimization for Iraqi network conditions
    """

    def __init__(
        self,
        browser_session=None,
        logger=None,
        cultural_validation_level: CulturalValidationLevel = CulturalValidationLevel.MODERATE,
        enable_islamic_compliance: bool = True,
        enable_government_optimization: bool = False,
        **config
    ):
        """Initialize Iraqi DOM processor with cultural validation.
        
        Args:
            browser_session: Browser session for DOM operations
            logger: Optional logger instance
            cultural_validation_level: Level of cultural validation to apply
            enable_islamic_compliance: Enable Islamic compliance checking
            enable_government_optimization: Enable Iraqi government portal optimizations
            **config: Additional configuration options
        """
        # Enhanced configuration for Iraqi processing
        iraqi_config = {
            'cultural_validation_enabled': True,
            'arabic_rtl_support_enabled': True,
            'islamic_compliance_enabled': enable_islamic_compliance,
            'government_portal_optimization': enable_government_optimization,
            'accessibility_enhancement_level': AccessibilityLevel.WCAG_AA.value,
            'arabic_font_optimization': True,
            'rtl_coordinate_adjustment': True,
            **config
        }
        
        super().__init__(
            browser_session=browser_session,
            logger=logger,
            cross_origin_iframes=True,
            accessibility_tree_enabled=True,
            device_pixel_ratio_handling=True,
            enhanced_visibility_detection=True,
            performance_optimization_enabled=True,
            **iraqi_config
        )
        
        self.cultural_validation_level = cultural_validation_level
        self.enable_islamic_compliance = enable_islamic_compliance
        self.enable_government_optimization = enable_government_optimization
        
        # Iraqi-specific metrics
        self.iraqi_metrics = {
            'arabic_elements_processed': 0,
            'cultural_violations_detected': 0,
            'islamic_compliance_checks': 0,
            'rtl_layout_corrections': 0,
            'government_forms_optimized': 0,
            'accessibility_improvements': 0,
        }
        
        # Cultural validation patterns
        self.inappropriate_content_patterns = [
            'alcohol', 'beer', 'wine', 'vodka', 'whiskey',
            'pork', 'bacon', 'ham', 'sausage',
            'gambling', 'casino', 'poker', 'betting',
            'dating', 'hookup', 'adult', 'sexy',
            'nudity', 'naked', 'strip', 'bikini'
        ]
        
        self.islamic_compliant_patterns = [
            'halal', 'islamic', 'muslim', 'quran', 'mosque',
            'prayer', 'ramadan', 'eid', 'hajj', 'umrah'
        ]
        
        self.government_portal_patterns = [
            'ministry', 'government', 'official', 'national',
            'iraq', 'iraqi', 'baghdad', 'basra', 'mosul',
            'kurdistan', 'erbil', 'sulaymaniyah'
        ]
    
    async def validate_cultural_compliance(
        self, 
        dom_tree: EnhancedDOMTreeNode
    ) -> IraqiDOMValidation:
        """Perform comprehensive cultural compliance validation.
        
        Args:
            dom_tree: Enhanced DOM tree to validate
            
        Returns:
            Comprehensive Iraqi validation result
        """
        validation = IraqiDOMValidation(
            overall_score=0.0,
            cultural_compliance=0.0,
            islamic_compliance=0.0,
            accessibility_score=0.0,
            arabic_support_quality=0.0,
            validation_level=self.cultural_validation_level
        )
        
        # Collect all nodes for analysis
        all_nodes = self._collect_all_nodes(dom_tree)
        
        if not all_nodes:
            validation.overall_score = 0.5  # Neutral score for empty content
            return validation
        
        # Analyze each node
        cultural_scores = []
        islamic_scores = []
        accessibility_scores = []
        arabic_quality_scores = []
        
        for node in all_nodes:
            node_analysis = await self._analyze_node_cultural_compliance(node)
            
            cultural_scores.append(node_analysis['cultural_score'])
            islamic_scores.append(node_analysis['islamic_score'])
            accessibility_scores.append(node_analysis['accessibility_score'])
            arabic_quality_scores.append(node_analysis['arabic_quality_score'])
            
            # Collect violations and recommendations
            validation.violations.extend(node_analysis.get('violations', []))
            validation.recommendations.extend(node_analysis.get('recommendations', []))
            
            if node_analysis.get('is_arabic_element'):
                validation.arabic_elements_processed += 1
                self.iraqi_metrics['arabic_elements_processed'] += 1
        
        # Calculate average scores
        validation.cultural_compliance = sum(cultural_scores) / len(cultural_scores)
        validation.islamic_compliance = sum(islamic_scores) / len(islamic_scores)
        validation.accessibility_score = sum(accessibility_scores) / len(accessibility_scores)
        validation.arabic_support_quality = sum(arabic_quality_scores) / len(arabic_quality_scores)
        
        # Calculate overall score
        weights = {
            'cultural': 0.3,
            'islamic': 0.25,
            'accessibility': 0.25,
            'arabic': 0.2
        }
        
        validation.overall_score = (
            validation.cultural_compliance * weights['cultural'] +
            validation.islamic_compliance * weights['islamic'] +
            validation.accessibility_score * weights['accessibility'] +
            validation.arabic_support_quality * weights['arabic']
        )
        
        # Government compliance scoring if enabled
        if self.enable_government_optimization:
            validation.government_compliance = self._calculate_government_compliance(all_nodes)
            validation.overall_score = (validation.overall_score * 0.8 + 
                                      validation.government_compliance * 0.2)
        
        # RTL layout quality assessment
        validation.rtl_layout_quality = self._assess_rtl_layout_quality(all_nodes)
        
        self.logger.info(f"Cultural validation completed - Score: {validation.overall_score:.2f}, "
                        f"Result: {validation.result.value}, Arabic elements: {validation.arabic_elements_processed}")
        
        return validation
    
    async def _analyze_node_cultural_compliance(
        self, 
        node: EnhancedDOMTreeNode
    ) -> Dict[str, Any]:
        """Analyze individual node for cultural compliance.
        
        Args:
            node: DOM node to analyze
            
        Returns:
            Node analysis result with scores and findings
        """
        analysis = {
            'cultural_score': 1.0,
            'islamic_score': 1.0,
            'accessibility_score': 0.5,
            'arabic_quality_score': 1.0,
            'violations': [],
            'recommendations': [],
            'is_arabic_element': False,
        }
        
        # Collect text content for analysis
        text_content = self._extract_node_text_content(node)
        
        if not text_content:
            return analysis
        
        text_lower = text_content.lower()
        
        # Cultural compliance analysis
        inappropriate_found = []
        for pattern in self.inappropriate_content_patterns:
            if pattern in text_lower:
                inappropriate_found.append(pattern)
                analysis['cultural_score'] -= 0.2
                analysis['violations'].append(f"Inappropriate content detected: {pattern}")
        
        # Islamic compliance analysis
        if self.enable_islamic_compliance:
            islamic_violations = []
            for pattern in self.inappropriate_content_patterns:
                if pattern in text_lower:
                    islamic_violations.append(pattern)
                    analysis['islamic_score'] -= 0.3
            
            # Bonus for Islamic content
            islamic_content_found = any(
                pattern in text_lower for pattern in self.islamic_compliant_patterns
            )
            if islamic_content_found:
                analysis['islamic_score'] = min(1.0, analysis['islamic_score'] + 0.1)
        
        # Arabic content analysis
        arabic_chars = self._count_arabic_characters(text_content)
        if arabic_chars > 0:
            analysis['is_arabic_element'] = True
            
            # Analyze RTL support
            rtl_quality = self._analyze_rtl_support(node)
            analysis['arabic_quality_score'] = rtl_quality
            
            if rtl_quality < 0.5:
                analysis['recommendations'].append("Improve RTL layout support for Arabic text")
        
        # Accessibility analysis
        accessibility_score = self._analyze_node_accessibility(node)
        analysis['accessibility_score'] = accessibility_score
        
        if accessibility_score < 0.6:
            analysis['recommendations'].append("Enhance accessibility features")
        
        # Apply validation level adjustments
        if self.cultural_validation_level == CulturalValidationLevel.STRICT:
            # Stricter scoring for government or sensitive contexts
            analysis['cultural_score'] *= 0.9
            analysis['islamic_score'] *= 0.9
        elif self.cultural_validation_level == CulturalValidationLevel.PERMISSIVE:
            # More lenient scoring for general content
            analysis['cultural_score'] = min(1.0, analysis['cultural_score'] * 1.1)
            analysis['islamic_score'] = min(1.0, analysis['islamic_score'] * 1.1)
        
        # Government portal optimizations
        if self.enable_government_optimization:
            gov_score = self._analyze_government_compliance(node, text_content)
            analysis['government_score'] = gov_score
        
        return analysis
    
    def _extract_node_text_content(self, node: EnhancedDOMTreeNode) -> str:
        """Extract all text content from a node including attributes."""
        content_parts = []
        
        # Node value (text content)
        if node.node_value:
            content_parts.append(node.node_value)
        
        # Relevant attributes
        if node.attributes:
            relevant_attrs = ['title', 'alt', 'placeholder', 'aria-label', 'value', 'name']
            for attr in relevant_attrs:
                if attr in node.attributes:
                    content_parts.append(node.attributes[attr])
        
        return ' '.join(content_parts)
    
    def _count_arabic_characters(self, text: str) -> int:
        """Count Arabic characters in text."""
        arabic_count = 0
        for char in text:
            if ('\u0600' <= char <= '\u06FF' or  # Arabic
                '\u0750' <= char <= '\u077F' or  # Arabic Supplement
                '\u08A0' <= char <= '\u08FF'):   # Arabic Extended-A
                arabic_count += 1
        return arabic_count
    
    def _analyze_rtl_support(self, node: EnhancedDOMTreeNode) -> float:
        """Analyze RTL layout support quality for a node."""
        rtl_score = 1.0
        
        if not node.attributes:
            return 0.5  # No attributes to analyze
        
        # Check for explicit RTL direction
        dir_attr = node.attributes.get('dir', '').lower()
        if dir_attr == 'rtl':
            rtl_score += 0.2
        elif dir_attr == 'ltr':  # Explicit LTR for Arabic content is problematic
            rtl_score -= 0.3
        
        # Check CSS classes for RTL support
        class_attr = node.attributes.get('class', '').lower()
        rtl_indicators = ['rtl', 'arabic', 'right-to-left']
        if any(indicator in class_attr for indicator in rtl_indicators):
            rtl_score += 0.1
        
        # Check styling for text alignment
        if node.snapshot_node and node.snapshot_node.computed_styles:
            text_align = node.snapshot_node.computed_styles.get('text-align', '').lower()
            direction = node.snapshot_node.computed_styles.get('direction', '').lower()
            
            if direction == 'rtl':
                rtl_score += 0.2
            if text_align == 'right':
                rtl_score += 0.1
        
        return min(1.0, max(0.0, rtl_score))
    
    def _analyze_node_accessibility(self, node: EnhancedDOMTreeNode) -> float:
        """Analyze accessibility features of a node."""
        accessibility_score = 0.5  # Base score
        
        if not node.tag_name:
            return accessibility_score
        
        tag_name = node.tag_name.lower()
        
        # Interactive elements need accessibility features
        interactive_tags = ['button', 'input', 'select', 'textarea', 'a']
        
        if tag_name in interactive_tags:
            # Check for accessibility attributes
            if node.attributes:
                accessibility_features = 0
                
                if 'aria-label' in node.attributes:
                    accessibility_features += 1
                if 'aria-describedby' in node.attributes:
                    accessibility_features += 1
                if 'role' in node.attributes:
                    accessibility_features += 1
                if tag_name == 'img' and 'alt' in node.attributes:
                    accessibility_features += 1
                if 'tabindex' in node.attributes:
                    accessibility_features += 1
                
                # Score based on accessibility features
                accessibility_score += (accessibility_features * 0.1)
        
        # Check accessibility tree node
        if node.ax_node:
            if node.ax_node.name:
                accessibility_score += 0.1
            if node.ax_node.description:
                accessibility_score += 0.1
            if node.ax_node.role:
                accessibility_score += 0.05
        
        return min(1.0, accessibility_score)
    
    def _analyze_government_compliance(
        self, 
        node: EnhancedDOMTreeNode, 
        text_content: str
    ) -> float:
        """Analyze government portal compliance."""
        gov_score = 0.5  # Base score
        
        text_lower = text_content.lower()
        
        # Check for government-related content
        gov_indicators = sum(
            1 for pattern in self.government_portal_patterns
            if pattern in text_lower
        )
        
        if gov_indicators > 0:
            gov_score += 0.2
            
            # Government content should have higher accessibility standards
            if node.attributes:
                if 'aria-label' in node.attributes:
                    gov_score += 0.1
                if node.tag_name and node.tag_name.lower() == 'form':
                    # Government forms need special attention
                    if 'novalidate' not in node.attributes:
                        gov_score += 0.1
                    self.iraqi_metrics['government_forms_optimized'] += 1
        
        return min(1.0, gov_score)
    
    def _calculate_government_compliance(self, all_nodes: List[EnhancedDOMTreeNode]) -> float:
        """Calculate overall government compliance score."""
        gov_scores = []
        
        for node in all_nodes:
            text_content = self._extract_node_text_content(node)
            if text_content:
                gov_score = self._analyze_government_compliance(node, text_content)
                gov_scores.append(gov_score)
        
        return sum(gov_scores) / len(gov_scores) if gov_scores else 0.5
    
    def _assess_rtl_layout_quality(self, all_nodes: List[EnhancedDOMTreeNode]) -> float:
        """Assess overall RTL layout quality."""
        rtl_scores = []
        
        for node in all_nodes:
            text_content = self._extract_node_text_content(node)
            if self._count_arabic_characters(text_content) > 0:
                rtl_score = self._analyze_rtl_support(node)
                rtl_scores.append(rtl_score)
        
        return sum(rtl_scores) / len(rtl_scores) if rtl_scores else 1.0
    
    def _collect_all_nodes(self, root: EnhancedDOMTreeNode) -> List[EnhancedDOMTreeNode]:
        """Collect all nodes in the DOM tree."""
        nodes = [root]
        
        if root.children_nodes:
            for child in root.children_nodes:
                nodes.extend(self._collect_all_nodes(child))
        
        if root.content_document:
            nodes.extend(self._collect_all_nodes(root.content_document))
        
        if root.shadow_roots:
            for shadow_root in root.shadow_roots:
                nodes.extend(self._collect_all_nodes(shadow_root))
        
        return nodes
    
    async def process_arabic_content(
        self, 
        dom_tree: EnhancedDOMTreeNode
    ) -> Dict[str, Any]:
        """Process and optimize Arabic content in the DOM tree.
        
        Args:
            dom_tree: Enhanced DOM tree to process
            
        Returns:
            Arabic content processing results
        """
        arabic_elements = []
        rtl_corrections = []
        font_optimizations = []
        
        all_nodes = self._collect_all_nodes(dom_tree)
        
        for node in all_nodes:
            text_content = self._extract_node_text_content(node)
            arabic_chars = self._count_arabic_characters(text_content)
            
            if arabic_chars > 0:
                element_info = {
                    'node_id': node.node_id,
                    'tag_name': node.tag_name,
                    'arabic_char_count': arabic_chars,
                    'text_preview': text_content[:100],
                    'rtl_support_score': self._analyze_rtl_support(node),
                    'needs_optimization': False,
                    'optimizations': []
                }
                
                # Check if RTL optimization is needed
                if element_info['rtl_support_score'] < 0.7:
                    element_info['needs_optimization'] = True
                    
                    # Suggest RTL improvements
                    if not node.attributes.get('dir'):
                        element_info['optimizations'].append('Add dir="rtl" attribute')
                        rtl_corrections.append(f"Node {node.node_id}: Add RTL direction")
                    
                    if node.snapshot_node and node.snapshot_node.computed_styles:
                        text_align = node.snapshot_node.computed_styles.get('text-align', '').lower()
                        if text_align not in ['right', 'center']:
                            element_info['optimizations'].append('Adjust text alignment for RTL')
                            rtl_corrections.append(f"Node {node.node_id}: Fix text alignment")
                
                # Check font optimization
                if node.snapshot_node and node.snapshot_node.computed_styles:
                    font_family = node.snapshot_node.computed_styles.get('font-family', '').lower()
                    arabic_fonts = ['amiri', 'scheherazade', 'lateef', 'arabic', 'naskh']
                    
                    has_arabic_font = any(af in font_family for af in arabic_fonts)
                    if not has_arabic_font:
                        element_info['optimizations'].append('Use Arabic-optimized fonts')
                        font_optimizations.append(f"Node {node.node_id}: Improve Arabic font")
                
                arabic_elements.append(element_info)
        
        # Update metrics
        self.iraqi_metrics['rtl_layout_corrections'] += len(rtl_corrections)
        
        return {
            'arabic_elements_found': len(arabic_elements),
            'elements_needing_optimization': sum(1 for e in arabic_elements if e['needs_optimization']),
            'rtl_corrections_suggested': len(rtl_corrections),
            'font_optimizations_suggested': len(font_optimizations),
            'detailed_analysis': arabic_elements,
            'correction_summary': rtl_corrections,
            'font_optimization_summary': font_optimizations,
        }
    
    def get_iraqi_metrics(self) -> Dict[str, Any]:
        """Get comprehensive Iraqi processing metrics."""
        performance_metrics = self.performance_metrics.copy()
        
        return {
            'processing_metrics': performance_metrics,
            'cultural_metrics': self.iraqi_metrics,
            'configuration': {
                'cultural_validation_level': self.cultural_validation_level.value,
                'islamic_compliance_enabled': self.enable_islamic_compliance,
                'government_optimization_enabled': self.enable_government_optimization,
            },
            'capabilities': {
                'arabic_processing': True,
                'rtl_layout_optimization': True,
                'cultural_validation': True,
                'islamic_compliance_checking': True,
                'government_portal_support': self.enable_government_optimization,
                'accessibility_enhancement': True,
            }
        }