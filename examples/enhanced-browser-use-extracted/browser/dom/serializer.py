"""Enhanced DOM Tree Serializer with Iraqi AI Integration.

Advanced DOM serialization system for LLM consumption with Arabic RTL support,
cultural validation, and accessibility optimization.
"""

import logging
import time
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass

from .views import EnhancedDOMTreeNode, SerializedDOMState, NodeType


class DOMTreeSerializer:
    """Enhanced DOM tree serializer with Iraqi AI integration.
    
    Provides intelligent DOM serialization optimized for LLM processing
    with special handling for Arabic content, RTL layouts, and cultural
    validation requirements.
    """

    def __init__(
        self,
        dom_tree: EnhancedDOMTreeNode,
        previous_cached_state: Optional[SerializedDOMState] = None,
        enable_arabic_optimization: bool = True,
        enable_cultural_filtering: bool = True,
        max_elements: int = 1000,
        logger: Optional[logging.Logger] = None
    ):
        """Initialize enhanced DOM tree serializer.
        
        Args:
            dom_tree: Enhanced DOM tree to serialize
            previous_cached_state: Previous serialization state for optimization
            enable_arabic_optimization: Enable Arabic content optimization
            enable_cultural_filtering: Enable cultural appropriateness filtering
            max_elements: Maximum elements to include in serialization
            logger: Optional logger instance
        """
        self.dom_tree = dom_tree
        self.previous_cached_state = previous_cached_state
        self.enable_arabic_optimization = enable_arabic_optimization
        self.enable_cultural_filtering = enable_cultural_filtering
        self.max_elements = max_elements
        self.logger = logger or logging.getLogger(__name__)
        
        # Serialization metrics
        self.serialization_metrics = {
            'elements_processed': 0,
            'arabic_elements_found': 0,
            'culturally_filtered_elements': 0,
            'accessibility_enhanced_elements': 0,
            'interactive_elements': 0,
            'government_elements': 0,
            'serialization_time': 0.0,
        }
    
    def serialize_accessible_elements(self) -> Tuple[SerializedDOMState, Dict[str, float]]:
        """Serialize DOM tree with accessibility and cultural enhancements.
        
        Returns:
            Tuple of (serialized_dom_state, timing_info)
        """
        start_time = time.time()
        
        # Collect and filter elements
        accessible_elements = self._collect_accessible_elements()
        
        if self.enable_cultural_filtering:
            accessible_elements = self._filter_culturally_appropriate_elements(accessible_elements)
        
        # Apply Iraqi AI optimizations
        if self.enable_arabic_optimization:
            accessible_elements = self._optimize_arabic_elements(accessible_elements)
        
        # Serialize elements
        serialized_content = self._serialize_elements_to_text(accessible_elements)
        
        # Create serialized state
        serialized_state = SerializedDOMState(
            serialized_content=serialized_content,
            element_count=len(accessible_elements),
            arabic_elements_count=self.serialization_metrics['arabic_elements_found'],
            government_forms_detected=self.serialization_metrics['government_elements'],
        )
        
        # Add cultural validation summary
        serialized_state.cultural_validation_summary = {
            'total_elements': len(accessible_elements),
            'arabic_elements': self.serialization_metrics['arabic_elements_found'],
            'filtered_elements': self.serialization_metrics['culturally_filtered_elements'],
            'compliance_rate': self._calculate_compliance_rate(),
            'validation_timestamp': time.time()
        }
        
        # Add accessibility improvements
        serialized_state.accessibility_improvements = self._generate_accessibility_improvements()
        
        # Calculate timing
        end_time = time.time()
        serialization_time = end_time - start_time
        self.serialization_metrics['serialization_time'] = serialization_time
        
        timing_info = {
            'collect_elements': serialization_time * 0.3,  # Estimated
            'cultural_filtering': serialization_time * 0.2,  # Estimated
            'arabic_optimization': serialization_time * 0.2,  # Estimated
            'text_serialization': serialization_time * 0.3,  # Estimated
            'total_serialization': serialization_time,
        }
        
        self.logger.debug(f"DOM serialization completed in {serialization_time:.3f}s - "
                         f"Elements: {len(accessible_elements)}, "
                         f"Arabic: {self.serialization_metrics['arabic_elements_found']}")
        
        return serialized_state, timing_info
    
    def _collect_accessible_elements(self) -> List[Dict[str, Any]]:
        """Collect accessible elements from DOM tree."""
        elements = []
        element_count = 0
        
        def collect_recursive(node: EnhancedDOMTreeNode, depth: int = 0):
            nonlocal element_count
            
            if element_count >= self.max_elements:
                return
            
            # Skip if not visible
            if node.is_visible is False:
                return
            
            # Create element representation
            element_data = self._create_element_data(node, depth)
            
            if element_data:
                elements.append(element_data)
                element_count += 1
                self.serialization_metrics['elements_processed'] += 1
                
                # Update metrics based on element type
                if element_data.get('is_arabic_element'):
                    self.serialization_metrics['arabic_elements_found'] += 1
                
                if element_data.get('is_interactive'):
                    self.serialization_metrics['interactive_elements'] += 1
                
                if element_data.get('is_government_element'):
                    self.serialization_metrics['government_elements'] += 1
            
            # Process children
            if node.children_nodes:
                for child in node.children_nodes:
                    collect_recursive(child, depth + 1)
            
            # Process content documents (iframes)
            if node.content_document:
                collect_recursive(node.content_document, depth + 1)
            
            # Process shadow roots
            if node.shadow_roots:
                for shadow_root in node.shadow_roots:
                    collect_recursive(shadow_root, depth + 1)
        
        collect_recursive(self.dom_tree)
        return elements
    
    def _create_element_data(
        self, 
        node: EnhancedDOMTreeNode, 
        depth: int
    ) -> Optional[Dict[str, Any]]:
        """Create element data representation with Iraqi AI enhancements."""
        if not node.tag_name and node.node_type != NodeType.TEXT_NODE:
            return None
        
        # Extract text content
        text_content = self._extract_text_content(node)
        
        # Basic element data
        element_data = {
            'node_id': node.node_id,
            'tag_name': node.tag_name,
            'node_type': node.node_type.name,
            'depth': depth,
            'text_content': text_content,
            'attributes': node.attributes or {},
            'is_visible': node.is_visible,
            'is_interactive': node.is_interactive_element,
            'absolute_position': self._serialize_position(node.absolute_position),
        }
        
        # Iraqi AI enhancements
        element_data.update(self._analyze_iraqi_characteristics(node, text_content))
        
        # Accessibility information
        if node.ax_node:
            element_data['accessibility'] = {
                'role': node.ax_node.role,
                'name': node.ax_node.name,
                'description': node.ax_node.description,
                'accessibility_score': node.ax_node.accessibility_score,
            }
        
        # Cultural validation results
        if hasattr(node, 'cultural_validation_result') and node.cultural_validation_result:
            element_data['cultural_validation'] = node.cultural_validation_result
        
        return element_data
    
    def _extract_text_content(self, node: EnhancedDOMTreeNode) -> str:
        """Extract meaningful text content from node."""
        content_parts = []
        
        # Node value (direct text content)
        if node.node_value and node.node_value.strip():
            content_parts.append(node.node_value.strip())
        
        # Important attributes that contain text
        if node.attributes:
            text_attributes = ['title', 'alt', 'placeholder', 'aria-label', 'value']
            for attr in text_attributes:
                if attr in node.attributes and node.attributes[attr].strip():
                    content_parts.append(f"{attr}:{node.attributes[attr].strip()}")
        
        return ' '.join(content_parts)
    
    def _analyze_iraqi_characteristics(
        self, 
        node: EnhancedDOMTreeNode, 
        text_content: str
    ) -> Dict[str, Any]:
        """Analyze Iraqi-specific characteristics of the element."""
        characteristics = {
            'is_arabic_element': False,
            'arabic_char_count': 0,
            'rtl_support_score': 1.0,
            'cultural_compliance_score': 1.0,
            'is_government_element': False,
            'islamic_compliant': True,
        }
        
        if not text_content:
            return characteristics
        
        # Count Arabic characters
        arabic_count = sum(
            1 for char in text_content
            if '\u0600' <= char <= '\u06FF' or
               '\u0750' <= char <= '\u077F' or
               '\u08A0' <= char <= '\u08FF'
        )
        
        characteristics['arabic_char_count'] = arabic_count
        characteristics['is_arabic_element'] = arabic_count > 0
        
        # RTL support analysis
        if characteristics['is_arabic_element']:
            characteristics['rtl_support_score'] = self._analyze_rtl_support(node)
        
        # Government element detection
        text_lower = text_content.lower()
        government_keywords = ['ministry', 'government', 'official', 'iraq', 'baghdad']
        characteristics['is_government_element'] = any(
            keyword in text_lower for keyword in government_keywords
        )
        
        # Cultural compliance (basic check)
        inappropriate_content = ['alcohol', 'pork', 'gambling', 'dating']
        violations = sum(1 for content in inappropriate_content if content in text_lower)
        characteristics['cultural_compliance_score'] = max(0.0, 1.0 - violations * 0.3)
        characteristics['islamic_compliant'] = violations == 0
        
        return characteristics
    
    def _analyze_rtl_support(self, node: EnhancedDOMTreeNode) -> float:
        """Analyze RTL layout support for Arabic content."""
        rtl_score = 0.5  # Base score
        
        if node.attributes:
            # Check direction attribute
            if node.attributes.get('dir') == 'rtl':
                rtl_score += 0.3
            
            # Check CSS classes for RTL indicators
            class_attr = node.attributes.get('class', '').lower()
            if any(indicator in class_attr for indicator in ['rtl', 'arabic', 'right-to-left']):
                rtl_score += 0.2
        
        # Check computed styles if available
        if node.snapshot_node and node.snapshot_node.computed_styles:
            styles = node.snapshot_node.computed_styles
            
            if styles.get('direction') == 'rtl':
                rtl_score += 0.3
            
            if styles.get('text-align') == 'right':
                rtl_score += 0.1
        
        return min(1.0, rtl_score)
    
    def _serialize_position(self, position: Optional[Any]) -> Optional[Dict[str, float]]:
        """Serialize position information."""
        if not position:
            return None
        
        return {
            'x': position.x,
            'y': position.y,
            'width': position.width,
            'height': position.height,
        }
    
    def _filter_culturally_appropriate_elements(
        self, 
        elements: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """Filter elements based on cultural appropriateness."""
        if not self.enable_cultural_filtering:
            return elements
        
        filtered_elements = []
        
        for element in elements:
            cultural_score = element.get('cultural_compliance_score', 1.0)
            islamic_compliant = element.get('islamic_compliant', True)
            
            # Apply filtering based on scores
            if cultural_score >= 0.5 and islamic_compliant:
                filtered_elements.append(element)
            else:
                self.serialization_metrics['culturally_filtered_elements'] += 1
                self.logger.debug(f"Filtered culturally inappropriate element: "
                                f"score={cultural_score}, islamic={islamic_compliant}")
        
        return filtered_elements
    
    def _optimize_arabic_elements(
        self, 
        elements: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """Optimize Arabic elements for better processing."""
        if not self.enable_arabic_optimization:
            return elements
        
        optimized_elements = []
        
        for element in elements:
            if element.get('is_arabic_element'):
                # Enhance Arabic element representation
                element['arabic_optimization'] = {
                    'rtl_support_quality': element.get('rtl_support_score', 0.0),
                    'needs_rtl_improvement': element.get('rtl_support_score', 1.0) < 0.7,
                    'arabic_percentage': (
                        element.get('arabic_char_count', 0) / 
                        max(1, len(element.get('text_content', '')))
                    ),
                }
                
                # Add RTL direction hint for LLM
                if element['arabic_optimization']['needs_rtl_improvement']:
                    element['llm_hint'] = "This Arabic content may need RTL layout optimization"
                
                self.serialization_metrics['accessibility_enhanced_elements'] += 1
            
            optimized_elements.append(element)
        
        return optimized_elements
    
    def _serialize_elements_to_text(self, elements: List[Dict[str, Any]]) -> str:
        """Serialize elements to text format for LLM consumption."""
        serialized_lines = []
        serialized_lines.append("=== Enhanced DOM Tree with Iraqi AI Analysis ===")
        serialized_lines.append("")
        
        # Add summary
        total_elements = len(elements)
        arabic_elements = self.serialization_metrics['arabic_elements_found']
        interactive_elements = self.serialization_metrics['interactive_elements']
        
        serialized_lines.append(f"Summary: {total_elements} elements total, "
                               f"{arabic_elements} Arabic elements, "
                               f"{interactive_elements} interactive elements")
        serialized_lines.append("")
        
        # Serialize each element
        for i, element in enumerate(elements):
            element_line = self._format_element(element, i + 1)
            serialized_lines.append(element_line)
            
            # Add cultural validation info for important elements
            if (element.get('is_arabic_element') or 
                element.get('is_interactive') or
                element.get('is_government_element')):
                
                cultural_info = self._format_cultural_info(element)
                if cultural_info:
                    serialized_lines.append(f"  └─ {cultural_info}")
            
            serialized_lines.append("")
        
        return '\n'.join(serialized_lines)
    
    def _format_element(self, element: Dict[str, Any], index: int) -> str:
        """Format individual element for serialization."""
        tag_name = element.get('tag_name', 'text')
        text_content = element.get('text_content', '').strip()
        
        # Truncate long text content
        if len(text_content) > 100:
            text_content = text_content[:97] + "..."
        
        # Build element representation
        element_repr = f"[{index}] <{tag_name}>"
        
        # Add important attributes
        attributes = element.get('attributes', {})
        important_attrs = ['id', 'class', 'name', 'type', 'role']
        attr_parts = []
        
        for attr in important_attrs:
            if attr in attributes and attributes[attr]:
                attr_parts.append(f'{attr}="{attributes[attr]}"')
        
        if attr_parts:
            element_repr += f" {' '.join(attr_parts)}"
        
        # Add text content
        if text_content:
            element_repr += f' | Text: "{text_content}"'
        
        # Add position if available
        position = element.get('absolute_position')
        if position:
            element_repr += f' | Position: ({position["x"]:.0f}, {position["y"]:.0f})'
        
        return element_repr
    
    def _format_cultural_info(self, element: Dict[str, Any]) -> str:
        """Format cultural information for element."""
        info_parts = []
        
        if element.get('is_arabic_element'):
            arabic_count = element.get('arabic_char_count', 0)
            rtl_score = element.get('rtl_support_score', 1.0)
            info_parts.append(f"Arabic: {arabic_count} chars, RTL score: {rtl_score:.1f}")
        
        if element.get('is_government_element'):
            info_parts.append("Government portal element")
        
        cultural_score = element.get('cultural_compliance_score', 1.0)
        if cultural_score < 1.0:
            info_parts.append(f"Cultural compliance: {cultural_score:.1f}")
        
        if not element.get('islamic_compliant', True):
            info_parts.append("⚠️ Islamic compliance issue")
        
        return ' | '.join(info_parts) if info_parts else ""
    
    def _calculate_compliance_rate(self) -> float:
        """Calculate overall cultural compliance rate."""
        total_elements = self.serialization_metrics['elements_processed']
        filtered_elements = self.serialization_metrics['culturally_filtered_elements']
        
        if total_elements == 0:
            return 1.0
        
        return (total_elements - filtered_elements) / total_elements
    
    def _generate_accessibility_improvements(self) -> List[str]:
        """Generate accessibility improvement recommendations."""
        improvements = []
        
        if self.serialization_metrics['arabic_elements_found'] > 0:
            improvements.append("Consider RTL layout optimization for Arabic content")
        
        if self.serialization_metrics['interactive_elements'] > 0:
            improvements.append("Ensure all interactive elements have proper ARIA labels")
        
        if self.serialization_metrics['government_elements'] > 0:
            improvements.append("Government elements should meet WCAG AA standards")
        
        if self.serialization_metrics['culturally_filtered_elements'] > 0:
            improvements.append("Some content was filtered for cultural appropriateness")
        
        return improvements
    
    def get_serialization_metrics(self) -> Dict[str, Any]:
        """Get comprehensive serialization metrics."""
        return {
            'performance': {
                'serialization_time': self.serialization_metrics['serialization_time'],
                'elements_per_second': (
                    self.serialization_metrics['elements_processed'] / 
                    max(0.001, self.serialization_metrics['serialization_time'])
                ),
            },
            'content_analysis': self.serialization_metrics,
            'cultural_compliance': {
                'compliance_rate': self._calculate_compliance_rate(),
                'filtered_elements': self.serialization_metrics['culturally_filtered_elements'],
            },
            'configuration': {
                'arabic_optimization_enabled': self.enable_arabic_optimization,
                'cultural_filtering_enabled': self.enable_cultural_filtering,
                'max_elements': self.max_elements,
            }
        }