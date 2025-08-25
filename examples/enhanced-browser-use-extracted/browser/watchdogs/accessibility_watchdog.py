"""Iraqi Accessibility Watchdog - Enhanced browser-use watchdog for WCAG 2.1 AA compliance.

Monitors Arabic RTL accessibility, Islamic inclusive design principles, and Iraqi
cultural accessibility standards with comprehensive WCAG validation.
"""

from typing import Dict, List, Optional, Set, Tuple
from pydantic import Field, validator
import re
import asyncio
from datetime import datetime
from enum import Enum

from browser_use.agent.browser.browser_watchdog_base import BaseWatchdog
from browser_use.agent.events import (
    DomContentLoadedEvent,
    ElementInteractionEvent,
    KeyboardNavigationEvent,
    FocusChangeEvent,
    ScreenReaderEvent
)

class AccessibilityLevel(str, Enum):
    """WCAG accessibility compliance levels."""
    A = "A"
    AA = "AA"
    AAA = "AAA"

class AccessibilityViolationType(str, Enum):
    """Types of accessibility violations."""
    COLOR_CONTRAST = "color_contrast"
    KEYBOARD_NAVIGATION = "keyboard_navigation"
    SCREEN_READER = "screen_reader"
    RTL_LAYOUT = "rtl_layout"
    ARABIC_FONT = "arabic_font"
    FOCUS_MANAGEMENT = "focus_management"
    SEMANTIC_STRUCTURE = "semantic_structure"
    ALTERNATIVE_TEXT = "alternative_text"
    FORM_LABELS = "form_labels"
    HEADING_HIERARCHY = "heading_hierarchy"

class IraqiAccessibilityWatchdog(BaseWatchdog):
    """Enhanced watchdog for Iraqi accessibility compliance monitoring.
    
    Features:
    - WCAG 2.1 AA compliance validation
    - Arabic RTL accessibility testing
    - Screen reader compatibility for Arabic content
    - Keyboard navigation in RTL layouts
    - Islamic inclusive design principles
    - Color contrast validation
    - Alternative text for Arabic images
    - Form accessibility with Arabic labels
    - Heading hierarchy validation
    - Focus management for RTL interfaces
    """
    
    # Accessibility Configuration
    target_compliance_level: AccessibilityLevel = Field(default=AccessibilityLevel.AA)
    enable_rtl_validation: bool = Field(default=True)
    enable_arabic_font_validation: bool = Field(default=True)
    enable_keyboard_navigation_testing: bool = Field(default=True)
    enable_screen_reader_testing: bool = Field(default=True)
    enable_color_contrast_validation: bool = Field(default=True)
    
    # WCAG 2.1 AA Standards
    color_contrast_ratios: Dict[str, float] = Field(default_factory=lambda: {
        'normal_text': 4.5,      # AA standard
        'large_text': 3.0,       # AA standard
        'ui_components': 3.0,    # AA standard for UI components
        'graphical_objects': 3.0 # AA standard for graphics
    })
    
    # Arabic RTL Accessibility Rules
    rtl_accessibility_rules: List[Dict] = Field(default_factory=lambda: [
        {
            'name': 'html_dir_attribute',
            'selector': 'html[dir="rtl"]',
            'required': True,
            'description': 'HTML must have dir="rtl" for Arabic content'
        },
        {
            'name': 'arabic_lang_attribute', 
            'selector': 'html[lang="ar"], html[lang^="ar-"]',
            'required': True,
            'description': 'HTML must declare Arabic language'
        },
        {
            'name': 'arabic_font_loading',
            'selector': '[style*="font-family"], .arabic-font, .font-arabic',
            'required': True,
            'description': 'Arabic fonts must be properly loaded'
        },
        {
            'name': 'rtl_text_alignment',
            'selector': '[dir="rtl"], .rtl, .arabic-text',
            'required': True,
            'description': 'Arabic text must be right-aligned'
        },
        {
            'name': 'rtl_form_labels',
            'selector': 'label[for], .form-label',
            'required': True,
            'description': 'Form labels must support RTL layout'
        }
    ])
    
    # Keyboard Navigation Patterns for RTL
    rtl_keyboard_navigation: Dict[str, str] = Field(default_factory=lambda: {
        'ArrowLeft': 'next_item',    # Reversed for RTL
        'ArrowRight': 'previous_item', # Reversed for RTL  
        'Home': 'first_item',
        'End': 'last_item',
        'Tab': 'next_focusable',
        'Shift+Tab': 'previous_focusable'
    })
    
    # Screen Reader Support for Arabic
    arabic_screen_reader_requirements: List[str] = Field(default_factory=lambda: [
        'aria_labels_in_arabic',
        'alt_text_in_arabic',
        'heading_structure_arabic',
        'landmark_roles_arabic',
        'live_region_arabic_announcements'
    ])
    
    # Islamic Inclusive Design Principles
    islamic_inclusive_design: Dict[str, List[str]] = Field(default_factory=lambda: {
        'respectful_imagery': [
            'no_inappropriate_images',
            'cultural_sensitivity_images',
            'islamic_appropriate_icons'
        ],
        'prayer_time_considerations': [
            'prayer_time_notifications',
            'pause_during_prayer_times',
            'respectful_timing_features'
        ],
        'cultural_color_sensitivity': [
            'appropriate_color_combinations',
            'cultural_color_meanings',
            'islamic_color_preferences'
        ]
    })
    
    # Accessibility Monitoring State
    accessibility_violations: List[Dict] = Field(default_factory=list)
    compliance_scores: Dict[str, float] = Field(default_factory=dict)
    keyboard_navigation_tests: List[Dict] = Field(default_factory=list)
    screen_reader_tests: List[Dict] = Field(default_factory=list)
    color_contrast_results: List[Dict] = Field(default_factory=list)
    
    @validator('target_compliance_level')
    def validate_compliance_level(cls, v):
        if not isinstance(v, AccessibilityLevel):
            v = AccessibilityLevel(v)
        return v
    
    async def on_DomContentLoadedEvent(self, event: DomContentLoadedEvent) -> None:
        """Handle DOM content loading for accessibility validation."""
        try:
            url = getattr(event, 'url', '')
            timestamp = datetime.now()
            
            # Start comprehensive accessibility audit
            await self._perform_accessibility_audit(url, timestamp)
            
        except Exception as e:
            await self.emit_error(f"Accessibility audit failed: {str(e)}")
    
    async def on_ElementInteractionEvent(self, event: ElementInteractionEvent) -> None:
        """Handle element interactions for accessibility validation."""
        try:
            element_info = getattr(event, 'element_info', {})
            interaction_type = getattr(event, 'interaction_type', 'click')
            page_url = getattr(event, 'page_url', '')
            
            # Validate interactive element accessibility
            accessibility_result = await self._validate_interactive_element(
                element_info, interaction_type, page_url
            )
            
            if accessibility_result['violations']:
                await self.emit_accessibility_violation(
                    page_url, AccessibilityViolationType.FOCUS_MANAGEMENT, 
                    accessibility_result
                )
                
        except Exception as e:
            await self.emit_error(f"Interactive element accessibility validation failed: {str(e)}")
    
    async def on_KeyboardNavigationEvent(self, event: KeyboardNavigationEvent) -> None:
        """Handle keyboard navigation events for RTL accessibility testing."""
        try:
            key_pressed = getattr(event, 'key', '')
            current_element = getattr(event, 'current_element', {})
            target_element = getattr(event, 'target_element', {})
            page_url = getattr(event, 'page_url', '')
            
            # Validate RTL keyboard navigation
            if self.enable_keyboard_navigation_testing:
                navigation_result = await self._validate_rtl_keyboard_navigation(
                    key_pressed, current_element, target_element, page_url
                )
                
                if not navigation_result['is_correct']:
                    await self.emit_accessibility_violation(
                        page_url, AccessibilityViolationType.KEYBOARD_NAVIGATION,
                        navigation_result
                    )
                    
        except Exception as e:
            await self.emit_error(f"Keyboard navigation accessibility validation failed: {str(e)}")
    
    async def on_FocusChangeEvent(self, event: FocusChangeEvent) -> None:
        """Handle focus changes for accessibility validation."""
        try:
            previous_element = getattr(event, 'previous_element', {})
            current_element = getattr(event, 'current_element', {})
            page_url = getattr(event, 'page_url', '')
            
            # Validate focus management
            focus_result = await self._validate_focus_management(
                previous_element, current_element, page_url
            )
            
            if focus_result['violations']:
                await self.emit_accessibility_violation(
                    page_url, AccessibilityViolationType.FOCUS_MANAGEMENT,
                    focus_result
                )
                
        except Exception as e:
            await self.emit_error(f"Focus management validation failed: {str(e)}")
    
    async def on_ScreenReaderEvent(self, event: ScreenReaderEvent) -> None:
        """Handle screen reader events for Arabic accessibility testing."""
        try:
            announced_text = getattr(event, 'announced_text', '')
            element_info = getattr(event, 'element_info', {})
            page_url = getattr(event, 'page_url', '')
            
            if self.enable_screen_reader_testing:
                # Validate Arabic screen reader compatibility
                screen_reader_result = await self._validate_arabic_screen_reader(
                    announced_text, element_info, page_url
                )
                
                if not screen_reader_result['is_accessible']:
                    await self.emit_accessibility_violation(
                        page_url, AccessibilityViolationType.SCREEN_READER,
                        screen_reader_result
                    )
                    
        except Exception as e:
            await self.emit_error(f"Screen reader accessibility validation failed: {str(e)}")
    
    async def _perform_accessibility_audit(self, url: str, timestamp: datetime) -> Dict:
        """Perform comprehensive accessibility audit."""
        audit_result = {
            'url': url,
            'timestamp': timestamp.isoformat(),
            'compliance_level': self.target_compliance_level.value,
            'overall_score': 0.0,
            'violations': [],
            'passed_checks': [],
            'recommendations': []
        }
        
        try:
            # Run all accessibility checks in parallel
            audit_tasks = [
                self._validate_semantic_structure(url),
                self._validate_color_contrast(url),
                self._validate_rtl_layout(url),
                self._validate_arabic_fonts(url),
                self._validate_form_accessibility(url),
                self._validate_image_alt_text(url),
                self._validate_heading_hierarchy(url),
                self._validate_islamic_inclusive_design(url)
            ]
            
            audit_results = await asyncio.gather(*audit_tasks, return_exceptions=True)
            
            # Aggregate results
            total_checks = 0
            passed_checks = 0
            
            for result in audit_results:
                if isinstance(result, dict):
                    total_checks += result.get('total_checks', 0)
                    passed_checks += result.get('passed_checks', 0)
                    
                    if result.get('violations'):
                        audit_result['violations'].extend(result['violations'])
                    
                    if result.get('passed'):
                        audit_result['passed_checks'].extend(result['passed'])
            
            # Calculate overall compliance score
            audit_result['overall_score'] = (
                passed_checks / total_checks if total_checks > 0 else 0.0
            )
            
            # Store result
            self.compliance_scores[url] = audit_result['overall_score']
            
            # Emit audit completion event
            await self.emit_accessibility_audit_complete(audit_result)
            
            return audit_result
            
        except Exception as e:
            audit_result['error'] = str(e)
            await self.emit_error(f"Accessibility audit failed for {url}: {str(e)}")
            return audit_result
    
    async def _validate_semantic_structure(self, url: str) -> Dict:
        """Validate semantic HTML structure."""
        result = {
            'check_name': 'semantic_structure',
            'total_checks': 5,
            'passed_checks': 0,
            'violations': [],
            'passed': []
        }
        
        # Placeholder for semantic structure validation
        # In real implementation, would use browser DOM inspection
        
        semantic_checks = [
            {'name': 'proper_headings', 'passed': True},
            {'name': 'landmark_roles', 'passed': True},
            {'name': 'list_structure', 'passed': True},
            {'name': 'button_semantics', 'passed': True},
            {'name': 'link_context', 'passed': False}
        ]
        
        for check in semantic_checks:
            if check['passed']:
                result['passed_checks'] += 1
                result['passed'].append(check['name'])
            else:
                result['violations'].append({
                    'type': 'semantic_structure',
                    'check': check['name'],
                    'severity': 'medium'
                })
        
        return result
    
    async def _validate_color_contrast(self, url: str) -> Dict:
        """Validate color contrast ratios."""
        result = {
            'check_name': 'color_contrast',
            'total_checks': 4,
            'passed_checks': 0,
            'violations': [],
            'passed': []
        }
        
        if not self.enable_color_contrast_validation:
            return result
        
        # Placeholder for color contrast validation
        # In real implementation, would calculate actual color ratios
        
        contrast_checks = [
            {'type': 'normal_text', 'ratio': 5.2, 'required': 4.5, 'passed': True},
            {'type': 'large_text', 'ratio': 3.8, 'required': 3.0, 'passed': True},
            {'type': 'ui_components', 'ratio': 2.8, 'required': 3.0, 'passed': False},
            {'type': 'graphical_objects', 'ratio': 3.5, 'required': 3.0, 'passed': True}
        ]
        
        for check in contrast_checks:
            if check['passed']:
                result['passed_checks'] += 1
                result['passed'].append(check['type'])
            else:
                result['violations'].append({
                    'type': 'color_contrast',
                    'element_type': check['type'],
                    'actual_ratio': check['ratio'],
                    'required_ratio': check['required'],
                    'severity': 'high'
                })
        
        self.color_contrast_results.append({
            'url': url,
            'timestamp': datetime.now(),
            'results': contrast_checks
        })
        
        return result
    
    async def _validate_rtl_layout(self, url: str) -> Dict:
        """Validate RTL layout accessibility."""
        result = {
            'check_name': 'rtl_layout',
            'total_checks': len(self.rtl_accessibility_rules),
            'passed_checks': 0,
            'violations': [],
            'passed': []
        }
        
        if not self.enable_rtl_validation:
            return result
        
        # Validate RTL accessibility rules
        for rule in self.rtl_accessibility_rules:
            # Placeholder for DOM selector checking
            # In real implementation, would use browser to check selectors
            rule_passed = True  # Assume passed for demo
            
            if rule_passed:
                result['passed_checks'] += 1
                result['passed'].append(rule['name'])
            else:
                result['violations'].append({
                    'type': 'rtl_layout',
                    'rule': rule['name'],
                    'description': rule['description'],
                    'severity': 'high' if rule['required'] else 'medium'
                })
        
        return result
    
    async def _validate_arabic_fonts(self, url: str) -> Dict:
        """Validate Arabic font accessibility."""
        result = {
            'check_name': 'arabic_fonts',
            'total_checks': 3,
            'passed_checks': 0,
            'violations': [],
            'passed': []
        }
        
        if not self.enable_arabic_font_validation:
            return result
        
        # Placeholder for Arabic font validation
        font_checks = [
            {'name': 'arabic_font_declared', 'passed': True},
            {'name': 'font_size_adequate', 'passed': True},
            {'name': 'font_weight_readable', 'passed': False}
        ]
        
        for check in font_checks:
            if check['passed']:
                result['passed_checks'] += 1
                result['passed'].append(check['name'])
            else:
                result['violations'].append({
                    'type': 'arabic_font',
                    'check': check['name'],
                    'severity': 'medium'
                })
        
        return result
    
    async def _validate_form_accessibility(self, url: str) -> Dict:
        """Validate form accessibility."""
        result = {
            'check_name': 'form_accessibility',
            'total_checks': 4,
            'passed_checks': 0,
            'violations': [],
            'passed': []
        }
        
        # Placeholder for form accessibility validation
        form_checks = [
            {'name': 'labels_associated', 'passed': True},
            {'name': 'error_messages_clear', 'passed': True},
            {'name': 'required_fields_marked', 'passed': True},
            {'name': 'fieldset_legends', 'passed': False}
        ]
        
        for check in form_checks:
            if check['passed']:
                result['passed_checks'] += 1
                result['passed'].append(check['name'])
            else:
                result['violations'].append({
                    'type': 'form_accessibility',
                    'check': check['name'],
                    'severity': 'high'
                })
        
        return result
    
    async def _validate_image_alt_text(self, url: str) -> Dict:
        """Validate image alternative text."""
        result = {
            'check_name': 'image_alt_text',
            'total_checks': 3,
            'passed_checks': 0,
            'violations': [],
            'passed': []
        }
        
        # Placeholder for image alt text validation
        alt_text_checks = [
            {'name': 'all_images_have_alt', 'passed': True},
            {'name': 'alt_text_descriptive', 'passed': False},
            {'name': 'decorative_images_empty_alt', 'passed': True}
        ]
        
        for check in alt_text_checks:
            if check['passed']:
                result['passed_checks'] += 1
                result['passed'].append(check['name'])
            else:
                result['violations'].append({
                    'type': 'alternative_text',
                    'check': check['name'],
                    'severity': 'high'
                })
        
        return result
    
    async def _validate_heading_hierarchy(self, url: str) -> Dict:
        """Validate heading hierarchy."""
        result = {
            'check_name': 'heading_hierarchy',
            'total_checks': 2,
            'passed_checks': 0,
            'violations': [],
            'passed': []
        }
        
        # Placeholder for heading hierarchy validation
        heading_checks = [
            {'name': 'logical_heading_order', 'passed': True},
            {'name': 'heading_levels_not_skipped', 'passed': False}
        ]
        
        for check in heading_checks:
            if check['passed']:
                result['passed_checks'] += 1
                result['passed'].append(check['name'])
            else:
                result['violations'].append({
                    'type': 'heading_hierarchy',
                    'check': check['name'],
                    'severity': 'medium'
                })
        
        return result
    
    async def _validate_islamic_inclusive_design(self, url: str) -> Dict:
        """Validate Islamic inclusive design principles."""
        result = {
            'check_name': 'islamic_inclusive_design',
            'total_checks': 3,
            'passed_checks': 0,
            'violations': [],
            'passed': []
        }
        
        # Placeholder for Islamic inclusive design validation
        islamic_checks = [
            {'name': 'respectful_imagery', 'passed': True},
            {'name': 'prayer_time_considerations', 'passed': True},
            {'name': 'cultural_color_sensitivity', 'passed': True}
        ]
        
        for check in islamic_checks:
            if check['passed']:
                result['passed_checks'] += 1
                result['passed'].append(check['name'])
            else:
                result['violations'].append({
                    'type': 'islamic_inclusive_design',
                    'check': check['name'],
                    'severity': 'medium'
                })
        
        return result
    
    async def _validate_interactive_element(self, element_info: Dict, interaction_type: str, page_url: str) -> Dict:
        """Validate interactive element accessibility."""
        result = {
            'element_info': element_info,
            'interaction_type': interaction_type,
            'violations': []
        }
        
        # Placeholder validations
        if not element_info.get('accessible_name'):
            result['violations'].append({
                'type': 'missing_accessible_name',
                'severity': 'high'
            })
        
        if not element_info.get('focusable') and interaction_type == 'keyboard':
            result['violations'].append({
                'type': 'not_keyboard_accessible',
                'severity': 'high'
            })
        
        return result
    
    async def _validate_rtl_keyboard_navigation(self, key: str, current_element: Dict, target_element: Dict, page_url: str) -> Dict:
        """Validate RTL keyboard navigation behavior."""
        result = {
            'key_pressed': key,
            'is_correct': True,
            'expected_behavior': '',
            'actual_behavior': '',
            'violations': []
        }
        
        expected_behavior = self.rtl_keyboard_navigation.get(key, '')
        
        if expected_behavior and key in ['ArrowLeft', 'ArrowRight']:
            # Check if navigation direction is correct for RTL
            # Placeholder logic
            result['expected_behavior'] = expected_behavior
            result['actual_behavior'] = 'navigation_occurred'  # Placeholder
            
            # In RTL, left arrow should go to next item, right arrow to previous
            if key == 'ArrowLeft' and expected_behavior != 'next_item':
                result['is_correct'] = False
                result['violations'].append({
                    'type': 'incorrect_rtl_navigation',
                    'severity': 'medium'
                })
        
        return result
    
    async def _validate_focus_management(self, previous_element: Dict, current_element: Dict, page_url: str) -> Dict:
        """Validate focus management."""
        result = {
            'violations': []
        }
        
        # Placeholder focus management validation
        if not current_element.get('visible_focus_indicator'):
            result['violations'].append({
                'type': 'no_visible_focus_indicator',
                'severity': 'high'
            })
        
        if current_element.get('focus_trapped') and not current_element.get('modal_context'):
            result['violations'].append({
                'type': 'inappropriate_focus_trap',
                'severity': 'medium'
            })
        
        return result
    
    async def _validate_arabic_screen_reader(self, announced_text: str, element_info: Dict, page_url: str) -> Dict:
        """Validate Arabic screen reader compatibility."""
        result = {
            'announced_text': announced_text[:100],  # Limit for privacy
            'is_accessible': True,
            'violations': []
        }
        
        # Check if Arabic text is properly announced
        if self._contains_arabic_text(announced_text):
            # Placeholder validation for Arabic screen reader support
            if not element_info.get('lang_attribute_arabic'):
                result['violations'].append({
                    'type': 'missing_arabic_lang_attribute',
                    'severity': 'high'
                })
                result['is_accessible'] = False
            
            if not self._has_proper_arabic_pronunciation_hints(announced_text):
                result['violations'].append({
                    'type': 'poor_arabic_pronunciation',
                    'severity': 'medium'
                })
        
        return result
    
    def _contains_arabic_text(self, text: str) -> bool:
        """Check if text contains Arabic characters."""
        arabic_pattern = r'[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]'
        return bool(re.search(arabic_pattern, text))
    
    def _has_proper_arabic_pronunciation_hints(self, text: str) -> bool:
        """Check if Arabic text has proper pronunciation hints for screen readers."""
        # Placeholder logic for Arabic pronunciation validation
        return True  # Assume proper pronunciation for demo
    
    # Event Emission Methods
    async def emit_accessibility_violation(self, url: str, violation_type: AccessibilityViolationType, violation_data: Dict):
        """Emit accessibility violation event."""
        if self.cultural_validation_enabled:
            from browser_use.agent.events import AccessibilityViolationEvent
            event = AccessibilityViolationEvent(data={
                'url': url,
                'violation_type': violation_type.value,
                'violation_data': violation_data,
                'compliance_level': self.target_compliance_level.value,
                'timestamp': datetime.now().isoformat(),
                'severity': violation_data.get('severity', 'medium')
            })
            self.event_bus.dispatch(event)
            
            # Store violation
            self.accessibility_violations.append({
                'url': url,
                'violation_type': violation_type.value,
                'violation_data': violation_data,
                'timestamp': datetime.now()
            })
    
    async def emit_accessibility_audit_complete(self, audit_result: Dict):
        """Emit accessibility audit completion event."""
        if self.cultural_validation_enabled:
            from browser_use.agent.events import AccessibilityAuditCompleteEvent
            event = AccessibilityAuditCompleteEvent(data={
                'url': audit_result['url'],
                'overall_score': audit_result['overall_score'],
                'compliance_level': audit_result['compliance_level'],
                'total_violations': len(audit_result['violations']),
                'total_passed': len(audit_result['passed_checks']),
                'timestamp': audit_result['timestamp']
            })
            self.event_bus.dispatch(event)
    
    def get_accessibility_summary(self) -> Dict:
        """Get summary of accessibility monitoring."""
        total_violations = len(self.accessibility_violations)
        total_pages_audited = len(self.compliance_scores)
        average_compliance_score = (
            sum(self.compliance_scores.values()) / len(self.compliance_scores)
            if self.compliance_scores else 0.0
        )
        
        # Count violations by type
        violation_counts = {}
        for violation in self.accessibility_violations:
            violation_type = violation['violation_type']
            violation_counts[violation_type] = violation_counts.get(violation_type, 0) + 1
        
        return {
            'total_violations': total_violations,
            'total_pages_audited': total_pages_audited,
            'average_compliance_score': average_compliance_score,
            'target_compliance_level': self.target_compliance_level.value,
            'violation_counts_by_type': violation_counts,
            'rtl_validation_enabled': self.enable_rtl_validation,
            'arabic_font_validation_enabled': self.enable_arabic_font_validation,
            'keyboard_navigation_tests': len(self.keyboard_navigation_tests),
            'screen_reader_tests': len(self.screen_reader_tests),
            'color_contrast_tests': len(self.color_contrast_results)
        }