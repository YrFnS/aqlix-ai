#!/usr/bin/env python3
"""
🇮🇶 Iraqi Government UI Components System
========================================

Comprehensive UI component library for Iraqi government applications with
cultural intelligence, Islamic compliance, and Arabic-first design patterns.

Features:
- RTL-first responsive components with Arabic typography optimization
- Islamic design principles with culturally appropriate color schemes
- Government-grade accessibility (WCAG 2.1 AA+) with Arabic screen reader support
- Professional Iraqi government branding and visual hierarchy
- Prayer time accommodation and Islamic calendar integration
- Multi-language support (Arabic, Kurdish, English) with dialect awareness
- Cultural validation and Islamic compliance for all UI elements

Author: Iraqi AI Development Team
Date: August 20, 2025
Version: 2.1.0
License: Government Use Only - Iraqi Ministry of Digital Transformation
"""

import asyncio
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple, Union, Callable
from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path
import aiofiles
from abc import ABC, abstractmethod

# Cultural and accessibility imports
from cultural_validation import IraqiCulturalValidator, IslamicComplianceChecker
from arabic_processor import ArabicDialectProcessor, RTLTextAnalyzer
from accessibility_checker import WCAGComplianceValidator, ArabicScreenReaderOptimizer


class UITheme(Enum):
    """Iraqi government UI themes with cultural appropriateness"""
    GOVERNMENT_FORMAL = "government_formal"
    MINISTRY_PROFESSIONAL = "ministry_professional"
    PUBLIC_SERVICE = "public_service"
    ISLAMIC_HERITAGE = "islamic_heritage"
    MODERN_IRAQI = "modern_iraqi"


class ComponentSize(Enum):
    """Component size variants for responsive design"""
    SMALL = "small"
    MEDIUM = "medium"
    LARGE = "large"
    EXTRA_LARGE = "extra_large"


class ComponentState(Enum):
    """Interactive component states with Arabic context"""
    DEFAULT = "default"
    HOVER = "hover"
    ACTIVE = "active"
    DISABLED = "disabled"
    FOCUSED = "focused"
    LOADING = "loading"
    ERROR = "error"
    SUCCESS = "success"


class AccessibilityLevel(Enum):
    """Accessibility compliance levels"""
    BASIC = "basic"          # WCAG 2.1 A
    STANDARD = "standard"    # WCAG 2.1 AA
    ENHANCED = "enhanced"    # WCAG 2.1 AAA
    GOVERNMENT = "government" # Iraqi Government Standards


class LanguageDirection(Enum):
    """Text direction support for multilingual interfaces"""
    RTL = "rtl"  # Arabic, Kurdish Sorani
    LTR = "ltr"  # English, Kurdish Kurmanji
    AUTO = "auto"  # Automatic detection


@dataclass
class ColorPalette:
    """Iraqi government color palette with cultural significance"""
    # Primary government colors
    primary: str = "#1a4b3a"      # Iraqi flag green
    secondary: str = "#c41e3a"    # Iraqi flag red
    accent: str = "#000000"       # Iraqi flag black
    
    # Islamic-appropriate colors
    islamic_gold: str = "#d4af37"  # Traditional Islamic gold
    masjid_blue: str = "#4a69bd"   # Mosque architecture blue
    calligraphy_brown: str = "#8b4513"  # Traditional calligraphy ink
    
    # Professional government colors
    gov_dark_blue: str = "#1e3a5f"
    gov_light_blue: str = "#4a90c2"
    official_gray: str = "#6c757d"
    document_beige: str = "#f8f6f0"
    
    # Status and feedback colors
    success: str = "#28a745"      # Halal green
    warning: str = "#ffc107"      # Attention amber
    error: str = "#dc3545"        # Error red (muted for cultural sensitivity)
    info: str = "#17a2b8"         # Information blue
    
    # Neutral colors for backgrounds and text
    white: str = "#ffffff"
    light_gray: str = "#f8f9fa"
    medium_gray: str = "#dee2e6"
    dark_gray: str = "#495057"
    black: str = "#212529"


@dataclass
class Typography:
    """Arabic-first typography system with cultural optimization"""
    # Arabic fonts (primary)
    arabic_primary: str = "Amiri, 'Times New Roman', serif"
    arabic_secondary: str = "Noto Sans Arabic, Arial, sans-serif"
    arabic_monospace: str = "Courier New, monospace"
    
    # English fonts (secondary)
    english_primary: str = "Georgia, 'Times New Roman', serif"
    english_secondary: str = "Inter, 'Segoe UI', sans-serif"
    english_monospace: str = "Consolas, Monaco, monospace"
    
    # Font sizes (optimized for Arabic readability)
    text_xs: str = "12px"
    text_sm: str = "14px"
    text_base: str = "16px"
    text_lg: str = "18px"
    text_xl: str = "20px"
    text_2xl: str = "24px"
    text_3xl: str = "30px"
    text_4xl: str = "36px"
    
    # Line heights (adjusted for Arabic typography)
    line_height_tight: str = "1.25"
    line_height_normal: str = "1.6"
    line_height_relaxed: str = "1.75"
    
    # Letter spacing (Arabic-optimized)
    letter_spacing_tight: str = "-0.025em"
    letter_spacing_normal: str = "0em"
    letter_spacing_wide: str = "0.025em"


@dataclass
class Spacing:
    """Consistent spacing system for Iraqi government interfaces"""
    # Base spacing unit (rem-based for accessibility)
    xs: str = "0.25rem"   # 4px
    sm: str = "0.5rem"    # 8px
    md: str = "1rem"      # 16px
    lg: str = "1.5rem"    # 24px
    xl: str = "2rem"      # 32px
    xxl: str = "3rem"     # 48px
    xxxl: str = "4rem"    # 64px
    
    # Component-specific spacing
    button_padding_x: str = "1.5rem"
    button_padding_y: str = "0.75rem"
    input_padding_x: str = "1rem"
    input_padding_y: str = "0.75rem"
    card_padding: str = "1.5rem"
    section_margin: str = "2rem"


class BaseComponent(ABC):
    """Abstract base class for all Iraqi government UI components"""
    
    def __init__(
        self,
        component_id: str,
        theme: UITheme = UITheme.GOVERNMENT_FORMAL,
        accessibility_level: AccessibilityLevel = AccessibilityLevel.GOVERNMENT,
        language_direction: LanguageDirection = LanguageDirection.RTL,
        cultural_validation: bool = True
    ):
        self.component_id = component_id
        self.theme = theme
        self.accessibility_level = accessibility_level
        self.language_direction = language_direction
        self.cultural_validation = cultural_validation
        
        # Initialize validators
        self.cultural_validator = IraqiCulturalValidator() if cultural_validation else None
        self.islamic_checker = IslamicComplianceChecker() if cultural_validation else None
        self.accessibility_validator = WCAGComplianceValidator()
        self.rtl_processor = RTLTextAnalyzer()
        
        # Design system
        self.colors = ColorPalette()
        self.typography = Typography()
        self.spacing = Spacing()
        
        # Component state
        self.state = ComponentState.DEFAULT
        self.is_mounted = False
        self.validation_results = {}
        
        # Event handlers
        self.event_handlers: Dict[str, List[Callable]] = {}
        
        # Setup logging
        self.logger = logging.getLogger(f'IraqiGovUI-{self.__class__.__name__}')
    
    @abstractmethod
    async def render(self) -> str:
        """Render component as HTML with cultural and accessibility compliance"""
        pass
    
    @abstractmethod
    async def get_styles(self) -> str:
        """Generate CSS styles with RTL support and cultural appropriateness"""
        pass
    
    async def validate_cultural_compliance(self, content: str) -> Dict[str, Any]:
        """Validate component content for Iraqi cultural appropriateness"""
        if not self.cultural_validation:
            return {"compliant": True, "score": 1.0}
        
        try:
            cultural_result = await self.cultural_validator.validate_content(
                content,
                context_type="ui_component",
                component_type=self.__class__.__name__
            )
            
            islamic_result = await self.islamic_checker.check_compliance(
                content,
                check_level='comprehensive'
            )
            
            return {
                "compliant": cultural_result.get('compliant', True) and islamic_result.get('compliant', True),
                "cultural_score": cultural_result.get('compliance_score', 1.0),
                "islamic_score": islamic_result.get('compliance_score', 1.0),
                "issues": cultural_result.get('issues', []) + islamic_result.get('issues', []),
                "recommendations": cultural_result.get('recommendations', [])
            }
            
        except Exception as e:
            self.logger.error(f"Cultural validation error: {e}")
            return {"compliant": False, "error": str(e)}
    
    async def validate_accessibility(self, html_content: str) -> Dict[str, Any]:
        """Validate component for WCAG compliance and Arabic screen reader support"""
        try:
            wcag_result = await self.accessibility_validator.validate_html(
                html_content,
                level=self.accessibility_level.value
            )
            
            arabic_result = await ArabicScreenReaderOptimizer().validate_arabic_accessibility(
                html_content,
                language_direction=self.language_direction.value
            )
            
            return {
                "wcag_compliant": wcag_result.get('compliant', False),
                "arabic_accessible": arabic_result.get('accessible', False),
                "wcag_score": wcag_result.get('score', 0.0),
                "arabic_score": arabic_result.get('score', 0.0),
                "issues": wcag_result.get('issues', []) + arabic_result.get('issues', []),
                "recommendations": wcag_result.get('recommendations', [])
            }
            
        except Exception as e:
            self.logger.error(f"Accessibility validation error: {e}")
            return {"wcag_compliant": False, "arabic_accessible": False, "error": str(e)}
    
    def add_event_handler(self, event_type: str, handler: Callable):
        """Add event handler with cultural context awareness"""
        if event_type not in self.event_handlers:
            self.event_handlers[event_type] = []
        self.event_handlers[event_type].append(handler)
    
    def get_rtl_classes(self) -> str:
        """Get RTL CSS classes based on language direction"""
        if self.language_direction == LanguageDirection.RTL:
            return "dir-rtl text-right"
        elif self.language_direction == LanguageDirection.LTR:
            return "dir-ltr text-left"
        else:
            return "dir-auto"
    
    def get_theme_classes(self) -> str:
        """Get theme-specific CSS classes"""
        theme_map = {
            UITheme.GOVERNMENT_FORMAL: "theme-gov-formal",
            UITheme.MINISTRY_PROFESSIONAL: "theme-ministry-pro",
            UITheme.PUBLIC_SERVICE: "theme-public-service",
            UITheme.ISLAMIC_HERITAGE: "theme-islamic-heritage",
            UITheme.MODERN_IRAQI: "theme-modern-iraqi"
        }
        return theme_map.get(self.theme, "theme-gov-formal")
    
    def get_accessibility_attributes(self) -> str:
        """Get accessibility attributes for WCAG and Arabic screen reader compliance"""
        attrs = []
        
        # ARIA attributes
        attrs.append(f'role="region"')
        attrs.append(f'aria-label="{self.component_id}"')
        
        # Language direction
        if self.language_direction != LanguageDirection.AUTO:
            attrs.append(f'dir="{self.language_direction.value}"')
        
        # Cultural context
        attrs.append(f'data-cultural-context="iraqi-government"')
        attrs.append(f'data-theme="{self.theme.value}"')
        
        return " ".join(attrs)


class IraqiButton(BaseComponent):
    """
    Iraqi government button component with cultural intelligence and accessibility
    """
    
    def __init__(
        self,
        text: str,
        button_id: str,
        button_type: str = "button",
        size: ComponentSize = ComponentSize.MEDIUM,
        variant: str = "primary",
        disabled: bool = False,
        **kwargs
    ):
        super().__init__(component_id=button_id, **kwargs)
        self.text = text
        self.button_type = button_type
        self.size = size
        self.variant = variant
        self.disabled = disabled
        self.icon = None
        self.loading = False
    
    async def render(self) -> str:
        """Render Iraqi government button with cultural compliance"""
        # Validate text content
        validation = await self.validate_cultural_compliance(self.text)
        if not validation.get("compliant", True):
            self.logger.warning(f"Button text cultural validation failed: {validation.get('issues', [])}")
        
        # Determine button classes
        classes = [
            "iraqi-button",
            f"button-{self.variant}",
            f"button-{self.size.value}",
            self.get_rtl_classes(),
            self.get_theme_classes()
        ]
        
        if self.disabled:
            classes.append("button-disabled")
        if self.loading:
            classes.append("button-loading")
        if self.state != ComponentState.DEFAULT:
            classes.append(f"button-{self.state.value}")
        
        # Accessibility attributes
        accessibility_attrs = self.get_accessibility_attributes()
        
        # Loading spinner for Arabic interfaces
        loading_html = ""
        if self.loading:
            loading_html = '''
            <span class="button-spinner" aria-hidden="true">
                <svg class="animate-spin" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" opacity="0.75"/>
                </svg>
            </span>
            '''
        
        # Icon rendering
        icon_html = ""
        if self.icon:
            icon_position = "button-icon-start" if self.language_direction == LanguageDirection.LTR else "button-icon-end"
            icon_html = f'<i class="button-icon {icon_position} {self.icon}" aria-hidden="true"></i>'
        
        html = f'''
        <button
            id="{self.component_id}"
            type="{self.button_type}"
            class="{' '.join(classes)}"
            {accessibility_attrs}
            {"disabled" if self.disabled else ""}
            aria-busy="{str(self.loading).lower()}"
            data-validation-score="{validation.get('cultural_score', 1.0)}"
        >
            {loading_html}
            {icon_html}
            <span class="button-text">{self.text}</span>
        </button>
        '''
        
        # Validate final HTML for accessibility
        accessibility_validation = await self.validate_accessibility(html)
        if not accessibility_validation.get("wcag_compliant", False):
            self.logger.warning(f"Button accessibility validation issues: {accessibility_validation.get('issues', [])}")
        
        return html.strip()
    
    async def get_styles(self) -> str:
        """Generate CSS styles for Iraqi government button"""
        return f'''
        .iraqi-button {{
            /* Base button styles with Arabic typography */
            font-family: {self.typography.arabic_secondary};
            font-size: {self.typography.text_base};
            font-weight: 500;
            line-height: {self.typography.line_height_normal};
            
            /* Layout and spacing */
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: {self.spacing.sm};
            padding: {self.spacing.button_padding_y} {self.spacing.button_padding_x};
            min-height: 44px; /* WCAG touch target minimum */
            
            /* Visual design */
            border: 2px solid transparent;
            border-radius: 6px;
            background: {self.colors.primary};
            color: {self.colors.white};
            
            /* Transitions */
            transition: all 0.2s ease-in-out;
            
            /* Accessibility */
            cursor: pointer;
            user-select: none;
            outline: none;
            position: relative;
        }}
        
        /* Size variants */
        .button-small {{
            font-size: {self.typography.text_sm};
            padding: {self.spacing.xs} {self.spacing.md};
            min-height: 36px;
        }}
        
        .button-large {{
            font-size: {self.typography.text_lg};
            padding: {self.spacing.lg} {self.spacing.xl};
            min-height: 52px;
        }}
        
        .button-extra_large {{
            font-size: {self.typography.text_xl};
            padding: {self.spacing.xl} {self.spacing.xxl};
            min-height: 60px;
        }}
        
        /* Variants */
        .button-primary {{
            background: {self.colors.primary};
            color: {self.colors.white};
            border-color: {self.colors.primary};
        }}
        
        .button-secondary {{
            background: {self.colors.secondary};
            color: {self.colors.white};
            border-color: {self.colors.secondary};
        }}
        
        .button-outline {{
            background: transparent;
            color: {self.colors.primary};
            border-color: {self.colors.primary};
        }}
        
        .button-ghost {{
            background: transparent;
            color: {self.colors.primary};
            border-color: transparent;
        }}
        
        /* States */
        .iraqi-button:hover:not(.button-disabled) {{
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(26, 75, 58, 0.3);
            filter: brightness(1.1);
        }}
        
        .iraqi-button:active:not(.button-disabled) {{
            transform: translateY(0);
            box-shadow: 0 2px 6px rgba(26, 75, 58, 0.2);
        }}
        
        .iraqi-button:focus-visible {{
            outline: 3px solid {self.colors.islamic_gold};
            outline-offset: 2px;
        }}
        
        .button-disabled {{
            opacity: 0.6;
            cursor: not-allowed;
            transform: none !important;
            box-shadow: none !important;
        }}
        
        .button-loading {{
            color: transparent;
        }}
        
        /* Loading spinner */
        .button-spinner {{
            position: absolute;
            width: 20px;
            height: 20px;
        }}
        
        .animate-spin {{
            animation: spin 1s linear infinite;
        }}
        
        @keyframes spin {{
            from {{ transform: rotate(0deg); }}
            to {{ transform: rotate(360deg); }}
        }}
        
        /* RTL support */
        .dir-rtl .button-icon-start {{
            order: 2;
        }}
        
        .dir-rtl .button-text {{
            order: 1;
        }}
        
        /* Theme variations */
        .theme-islamic-heritage .iraqi-button {{
            background: linear-gradient(135deg, {self.colors.islamic_gold}, {self.colors.masjid_blue});
            border: none;
            color: {self.colors.white};
            font-family: {self.typography.arabic_primary};
        }}
        
        .theme-ministry-pro .iraqi-button {{
            background: {self.colors.gov_dark_blue};
            border-radius: 4px;
            font-weight: 600;
        }}
        
        /* High contrast mode support */
        @media (prefers-contrast: high) {{
            .iraqi-button {{
                border-width: 3px;
                font-weight: 700;
            }}
        }}
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {{
            .iraqi-button {{
                transition: none;
            }}
            
            .animate-spin {{
                animation: none;
            }}
        }}
        
        /* Arabic font optimization */
        .dir-rtl .iraqi-button {{
            font-family: {self.typography.arabic_secondary};
            letter-spacing: {self.typography.letter_spacing_normal};
        }}
        
        .dir-ltr .iraqi-button {{
            font-family: {self.typography.english_secondary};
            letter-spacing: {self.typography.letter_spacing_tight};
        }}
        '''


class IraqiCard(BaseComponent):
    """
    Iraqi government card component with Islamic design principles
    """
    
    def __init__(
        self,
        title: str,
        content: str,
        card_id: str,
        header_actions: Optional[List[Dict[str, Any]]] = None,
        footer_content: Optional[str] = None,
        elevated: bool = True,
        **kwargs
    ):
        super().__init__(component_id=card_id, **kwargs)
        self.title = title
        self.content = content
        self.header_actions = header_actions or []
        self.footer_content = footer_content
        self.elevated = elevated
    
    async def render(self) -> str:
        """Render Iraqi government card with cultural compliance"""
        # Validate content
        title_validation = await self.validate_cultural_compliance(self.title)
        content_validation = await self.validate_cultural_compliance(self.content)
        
        # Card classes
        classes = [
            "iraqi-card",
            self.get_rtl_classes(),
            self.get_theme_classes()
        ]
        
        if self.elevated:
            classes.append("card-elevated")
        
        # Header actions
        actions_html = ""
        if self.header_actions:
            actions = []
            for action in self.header_actions:
                action_html = f'''
                <button class="card-action" onclick="{action.get('onclick', '')}" 
                        aria-label="{action.get('label', '')}">
                    <i class="{action.get('icon', '')}" aria-hidden="true"></i>
                </button>
                '''
                actions.append(action_html)
            actions_html = f'<div class="card-actions">{"".join(actions)}</div>'
        
        # Footer
        footer_html = ""
        if self.footer_content:
            footer_validation = await self.validate_cultural_compliance(self.footer_content)
            footer_html = f'''
            <div class="card-footer" data-validation-score="{footer_validation.get('cultural_score', 1.0)}">
                {self.footer_content}
            </div>
            '''
        
        html = f'''
        <div
            id="{self.component_id}"
            class="{' '.join(classes)}"
            {self.get_accessibility_attributes()}
            data-title-validation="{title_validation.get('cultural_score', 1.0)}"
            data-content-validation="{content_validation.get('cultural_score', 1.0)}"
        >
            <div class="card-header">
                <h3 class="card-title">{self.title}</h3>
                {actions_html}
            </div>
            <div class="card-body">
                <div class="card-content">{self.content}</div>
            </div>
            {footer_html}
        </div>
        '''
        
        return html.strip()
    
    async def get_styles(self) -> str:
        """Generate CSS styles for Iraqi government card"""
        return f'''
        .iraqi-card {{
            /* Base card structure */
            background: {self.colors.white};
            border: 1px solid {self.colors.medium_gray};
            border-radius: 8px;
            overflow: hidden;
            
            /* Typography */
            font-family: {self.typography.arabic_secondary};
            color: {self.colors.dark_gray};
            
            /* Layout */
            display: flex;
            flex-direction: column;
            min-width: 0; /* Prevent flex items from overflowing */
        }}
        
        .card-elevated {{
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            border: none;
        }}
        
        .card-header {{
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: {self.spacing.lg};
            border-bottom: 1px solid {self.colors.light_gray};
            background: {self.colors.document_beige};
        }}
        
        .card-title {{
            margin: 0;
            font-size: {self.typography.text_xl};
            font-weight: 600;
            color: {self.colors.primary};
            font-family: {self.typography.arabic_primary};
        }}
        
        .card-actions {{
            display: flex;
            gap: {self.spacing.sm};
        }}
        
        .card-action {{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border: none;
            border-radius: 4px;
            background: transparent;
            color: {self.colors.official_gray};
            cursor: pointer;
            transition: all 0.2s ease;
        }}
        
        .card-action:hover {{
            background: {self.colors.light_gray};
            color: {self.colors.primary};
        }}
        
        .card-body {{
            flex: 1;
            padding: {self.spacing.lg};
        }}
        
        .card-content {{
            line-height: {self.typography.line_height_relaxed};
            font-size: {self.typography.text_base};
        }}
        
        .card-footer {{
            padding: {self.spacing.md} {self.spacing.lg};
            background: {self.colors.light_gray};
            border-top: 1px solid {self.colors.medium_gray};
            font-size: {self.typography.text_sm};
            color: {self.colors.official_gray};
        }}
        
        /* RTL optimizations */
        .dir-rtl .card-header {{
            text-align: right;
        }}
        
        .dir-rtl .card-title {{
            font-family: {self.typography.arabic_primary};
        }}
        
        .dir-ltr .card-title {{
            font-family: {self.typography.english_primary};
        }}
        
        /* Theme variations */
        .theme-islamic-heritage .card-header {{
            background: linear-gradient(135deg, {self.colors.islamic_gold}20, {self.colors.masjid_blue}20);
            border-bottom-color: {self.colors.islamic_gold};
        }}
        
        .theme-islamic-heritage .card-title {{
            color: {self.colors.masjid_blue};
        }}
        
        /* Accessibility enhancements */
        .card-action:focus-visible {{
            outline: 2px solid {self.colors.islamic_gold};
            outline-offset: 2px;
        }}
        
        @media (max-width: 768px) {{
            .card-header {{
                padding: {self.spacing.md};
            }}
            
            .card-body {{
                padding: {self.spacing.md};
            }}
            
            .card-title {{
                font-size: {self.typography.text_lg};
            }}
        }}
        '''


class IraqiFormInput(BaseComponent):
    """
    Iraqi government form input component with Arabic validation
    """
    
    def __init__(
        self,
        label: str,
        input_id: str,
        input_type: str = "text",
        placeholder: str = "",
        required: bool = False,
        disabled: bool = False,
        validation_rules: Optional[Dict[str, Any]] = None,
        help_text: Optional[str] = None,
        **kwargs
    ):
        super().__init__(component_id=input_id, **kwargs)
        self.label = label
        self.input_type = input_type
        self.placeholder = placeholder
        self.required = required
        self.disabled = disabled
        self.validation_rules = validation_rules or {}
        self.help_text = help_text
        self.value = ""
        self.error_message = ""
        self.is_valid = True
    
    async def render(self) -> str:
        """Render Iraqi government form input with cultural validation"""
        # Validate label and placeholder
        label_validation = await self.validate_cultural_compliance(self.label)
        placeholder_validation = await self.validate_cultural_compliance(self.placeholder)
        
        # Input classes
        input_classes = [
            "iraqi-input",
            self.get_rtl_classes().replace("text-", ""),
            self.get_theme_classes()
        ]
        
        if self.error_message:
            input_classes.append("input-error")
        if self.disabled:
            input_classes.append("input-disabled")
        
        # Container classes
        container_classes = [
            "input-container",
            self.get_rtl_classes(),
            self.get_theme_classes()
        ]
        
        # Required indicator
        required_html = ""
        if self.required:
            required_html = '<span class="input-required" aria-hidden="true">*</span>'
        
        # Help text
        help_html = ""
        if self.help_text:
            help_validation = await self.validate_cultural_compliance(self.help_text)
            help_html = f'''
            <div class="input-help" id="{self.component_id}-help" 
                 data-validation-score="{help_validation.get('cultural_score', 1.0)}">
                {self.help_text}
            </div>
            '''
        
        # Error message
        error_html = ""
        if self.error_message:
            error_html = f'''
            <div class="input-error-message" id="{self.component_id}-error" role="alert">
                <i class="error-icon" aria-hidden="true">⚠</i>
                {self.error_message}
            </div>
            '''
        
        # ARIA attributes
        aria_attrs = []
        if self.help_text:
            aria_attrs.append(f'aria-describedby="{self.component_id}-help"')
        if self.error_message:
            aria_attrs.append(f'aria-describedby="{self.component_id}-error"')
        if not self.is_valid:
            aria_attrs.append('aria-invalid="true"')
        
        html = f'''
        <div class="{' '.join(container_classes)}" {self.get_accessibility_attributes()}>
            <label for="{self.component_id}" class="input-label"
                   data-validation-score="{label_validation.get('cultural_score', 1.0)}">
                {self.label}
                {required_html}
            </label>
            <input
                id="{self.component_id}"
                type="{self.input_type}"
                class="{' '.join(input_classes)}"
                placeholder="{self.placeholder}"
                value="{self.value}"
                {"required" if self.required else ""}
                {"disabled" if self.disabled else ""}
                {' '.join(aria_attrs)}
                data-placeholder-validation="{placeholder_validation.get('cultural_score', 1.0)}"
                autocomplete="off"
            />
            {help_html}
            {error_html}
        </div>
        '''
        
        return html.strip()
    
    async def validate_input(self, value: str) -> Dict[str, Any]:
        """Validate input value against cultural and business rules"""
        validation_result = {
            "is_valid": True,
            "errors": [],
            "cultural_score": 1.0
        }
        
        # Cultural validation
        if self.cultural_validation:
            cultural_result = await self.validate_cultural_compliance(value)
            validation_result["cultural_score"] = cultural_result.get("cultural_score", 1.0)
            
            if not cultural_result.get("compliant", True):
                validation_result["is_valid"] = False
                validation_result["errors"].extend(cultural_result.get("issues", []))
        
        # Business rule validation
        if self.validation_rules:
            if "min_length" in self.validation_rules:
                min_len = self.validation_rules["min_length"]
                if len(value) < min_len:
                    validation_result["is_valid"] = False
                    validation_result["errors"].append(f"يجب أن يكون النص {min_len} أحرف على الأقل")
            
            if "max_length" in self.validation_rules:
                max_len = self.validation_rules["max_length"]
                if len(value) > max_len:
                    validation_result["is_valid"] = False
                    validation_result["errors"].append(f"يجب أن يكون النص {max_len} أحرف كحد أقصى")
            
            if "pattern" in self.validation_rules:
                import re
                pattern = self.validation_rules["pattern"]
                if not re.match(pattern, value):
                    validation_result["is_valid"] = False
                    validation_result["errors"].append("تنسيق غير صحيح")
        
        return validation_result
    
    async def get_styles(self) -> str:
        """Generate CSS styles for Iraqi government form input"""
        return f'''
        .input-container {{
            display: flex;
            flex-direction: column;
            gap: {self.spacing.sm};
            margin-bottom: {self.spacing.lg};
        }}
        
        .input-label {{
            font-family: {self.typography.arabic_secondary};
            font-size: {self.typography.text_base};
            font-weight: 500;
            color: {self.colors.dark_gray};
            display: flex;
            align-items: center;
            gap: {self.spacing.xs};
        }}
        
        .input-required {{
            color: {self.colors.error};
            font-weight: bold;
        }}
        
        .iraqi-input {{
            /* Base input styling */
            font-family: {self.typography.arabic_secondary};
            font-size: {self.typography.text_base};
            line-height: {self.typography.line_height_normal};
            
            /* Layout */
            width: 100%;
            padding: {self.spacing.input_padding_y} {self.spacing.input_padding_x};
            min-height: 44px; /* WCAG touch target */
            
            /* Visual design */
            border: 2px solid {self.colors.medium_gray};
            border-radius: 6px;
            background: {self.colors.white};
            color: {self.colors.dark_gray};
            
            /* Transitions */
            transition: all 0.2s ease-in-out;
            
            /* Remove default styling */
            outline: none;
            appearance: none;
        }}
        
        .iraqi-input:focus {{
            border-color: {self.colors.primary};
            box-shadow: 0 0 0 3px {self.colors.primary}20;
        }}
        
        .iraqi-input:hover:not(:disabled) {{
            border-color: {self.colors.gov_light_blue};
        }}
        
        .iraqi-input::placeholder {{
            color: {self.colors.official_gray};
            opacity: 1;
        }}
        
        .input-error .iraqi-input {{
            border-color: {self.colors.error};
        }}
        
        .input-error .iraqi-input:focus {{
            border-color: {self.colors.error};
            box-shadow: 0 0 0 3px {self.colors.error}20;
        }}
        
        .input-disabled .iraqi-input {{
            background: {self.colors.light_gray};
            color: {self.colors.official_gray};
            cursor: not-allowed;
            opacity: 0.7;
        }}
        
        .input-help {{
            font-size: {self.typography.text_sm};
            color: {self.colors.official_gray};
            line-height: {self.typography.line_height_normal};
        }}
        
        .input-error-message {{
            display: flex;
            align-items: center;
            gap: {self.spacing.xs};
            font-size: {self.typography.text_sm};
            color: {self.colors.error};
            font-weight: 500;
        }}
        
        .error-icon {{
            font-style: normal;
            font-weight: bold;
        }}
        
        /* RTL optimizations */
        .dir-rtl .iraqi-input {{
            text-align: right;
            font-family: {self.typography.arabic_secondary};
        }}
        
        .dir-ltr .iraqi-input {{
            text-align: left;
            font-family: {self.typography.english_secondary};
        }}
        
        /* Theme variations */
        .theme-islamic-heritage .input-label {{
            color: {self.colors.masjid_blue};
            font-family: {self.typography.arabic_primary};
        }}
        
        .theme-islamic-heritage .iraqi-input:focus {{
            border-color: {self.colors.islamic_gold};
            box-shadow: 0 0 0 3px {self.colors.islamic_gold}20;
        }}
        
        /* Accessibility enhancements */
        @media (prefers-contrast: high) {{
            .iraqi-input {{
                border-width: 3px;
            }}
        }}
        
        @media (prefers-reduced-motion: reduce) {{
            .iraqi-input {{
                transition: none;
            }}
        }}
        
        /* Mobile responsiveness */
        @media (max-width: 768px) {{
            .iraqi-input {{
                font-size: 16px; /* Prevent zoom on iOS */
                padding: {self.spacing.md};
                min-height: 48px;
            }}
        }}
        '''


class IraqiNavigationBar(BaseComponent):
    """
    Iraqi government navigation bar with ministry branding and cultural compliance
    """
    
    def __init__(
        self,
        nav_id: str,
        ministry_name: str,
        logo_url: str = "",
        navigation_items: Optional[List[Dict[str, Any]]] = None,
        user_menu_items: Optional[List[Dict[str, Any]]] = None,
        show_prayer_times: bool = True,
        **kwargs
    ):
        super().__init__(component_id=nav_id, **kwargs)
        self.ministry_name = ministry_name
        self.logo_url = logo_url
        self.navigation_items = navigation_items or []
        self.user_menu_items = user_menu_items or []
        self.show_prayer_times = show_prayer_times
        self.current_time = datetime.now()
    
    async def render(self) -> str:
        """Render Iraqi government navigation bar"""
        # Validate ministry name
        ministry_validation = await self.validate_cultural_compliance(self.ministry_name)
        
        # Logo section
        logo_html = ""
        if self.logo_url:
            logo_html = f'''
            <img src="{self.logo_url}" alt="شعار {self.ministry_name}" 
                 class="nav-logo" loading="lazy" />
            '''
        
        # Ministry name
        ministry_html = f'''
        <div class="nav-ministry" data-validation-score="{ministry_validation.get('cultural_score', 1.0)}">
            <h1 class="ministry-name">{self.ministry_name}</h1>
            <span class="ministry-subtitle">جمهورية العراق</span>
        </div>
        '''
        
        # Navigation items
        nav_items_html = ""
        if self.navigation_items:
            items = []
            for item in self.navigation_items:
                item_validation = await self.validate_cultural_compliance(item.get('label', ''))
                active_class = "nav-item-active" if item.get('active', False) else ""
                
                item_html = f'''
                <li class="nav-item {active_class}">
                    <a href="{item.get('href', '#')}" class="nav-link"
                       data-validation-score="{item_validation.get('cultural_score', 1.0)}"
                       {"aria-current='page'" if item.get('active', False) else ""}>
                        {f"<i class='{item.get('icon', '')}' aria-hidden='true'></i>" if item.get('icon') else ""}
                        <span>{item.get('label', '')}</span>
                    </a>
                </li>
                '''
                items.append(item_html)
            
            nav_items_html = f'''
            <nav class="nav-items" role="navigation" aria-label="القائمة الرئيسية">
                <ul class="nav-list">
                    {"".join(items)}
                </ul>
            </nav>
            '''
        
        # Prayer times (if enabled)
        prayer_times_html = ""
        if self.show_prayer_times:
            try:
                # This would integrate with a prayer times service
                prayer_times_html = f'''
                <div class="prayer-times" role="complementary" aria-label="أوقات الصلاة">
                    <i class="prayer-icon" aria-hidden="true">🕌</i>
                    <span class="next-prayer">المغرب: 6:45 PM</span>
                </div>
                '''
            except Exception as e:
                self.logger.warning(f"Prayer times integration error: {e}")
        
        # User menu
        user_menu_html = ""
        if self.user_menu_items:
            menu_items = []
            for item in self.user_menu_items:
                item_validation = await self.validate_cultural_compliance(item.get('label', ''))
                menu_items.append(f'''
                <li class="user-menu-item">
                    <a href="{item.get('href', '#')}" class="user-menu-link"
                       data-validation-score="{item_validation.get('cultural_score', 1.0)}">
                        {f"<i class='{item.get('icon', '')}' aria-hidden='true'></i>" if item.get('icon') else ""}
                        {item.get('label', '')}
                    </a>
                </li>
                ''')
            
            user_menu_html = f'''
            <div class="user-menu" role="menu" aria-label="قائمة المستخدم">
                <button class="user-menu-trigger" aria-haspopup="true" aria-expanded="false">
                    <i class="user-icon" aria-hidden="true">👤</i>
                    <span class="sr-only">قائمة المستخدم</span>
                </button>
                <ul class="user-menu-dropdown">
                    {"".join(menu_items)}
                </ul>
            </div>
            '''
        
        html = f'''
        <header
            id="{self.component_id}"
            class="iraqi-navbar {self.get_rtl_classes()} {self.get_theme_classes()}"
            {self.get_accessibility_attributes()}
            role="banner"
        >
            <div class="navbar-container">
                <div class="navbar-brand">
                    {logo_html}
                    {ministry_html}
                </div>
                
                <div class="navbar-center">
                    {nav_items_html}
                </div>
                
                <div class="navbar-end">
                    {prayer_times_html}
                    {user_menu_html}
                </div>
            </div>
        </header>
        '''
        
        return html.strip()
    
    async def get_styles(self) -> str:
        """Generate CSS styles for Iraqi government navigation bar"""
        return f'''
        .iraqi-navbar {{
            /* Base navbar structure */
            width: 100%;
            background: linear-gradient(135deg, {self.colors.primary}, {self.colors.gov_dark_blue});
            color: {self.colors.white};
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            position: sticky;
            top: 0;
            z-index: 1000;
        }}
        
        .navbar-container {{
            display: flex;
            align-items: center;
            justify-content: space-between;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 {self.spacing.lg};
            min-height: 64px;
        }}
        
        .navbar-brand {{
            display: flex;
            align-items: center;
            gap: {self.spacing.md};
        }}
        
        .nav-logo {{
            height: 40px;
            width: auto;
        }}
        
        .nav-ministry {{
            display: flex;
            flex-direction: column;
            line-height: 1.2;
        }}
        
        .ministry-name {{
            font-family: {self.typography.arabic_primary};
            font-size: {self.typography.text_lg};
            font-weight: 700;
            margin: 0;
            color: {self.colors.white};
        }}
        
        .ministry-subtitle {{
            font-family: {self.typography.arabic_secondary};
            font-size: {self.typography.text_sm};
            opacity: 0.9;
            color: {self.colors.islamic_gold};
        }}
        
        .navbar-center {{
            flex: 1;
            display: flex;
            justify-content: center;
        }}
        
        .nav-items {{
            display: flex;
        }}
        
        .nav-list {{
            display: flex;
            list-style: none;
            margin: 0;
            padding: 0;
            gap: {self.spacing.sm};
        }}
        
        .nav-item {{
            position: relative;
        }}
        
        .nav-link {{
            display: flex;
            align-items: center;
            gap: {self.spacing.xs};
            padding: {self.spacing.sm} {self.spacing.md};
            color: {self.colors.white};
            text-decoration: none;
            font-family: {self.typography.arabic_secondary};
            font-weight: 500;
            border-radius: 6px;
            transition: all 0.2s ease;
            min-height: 44px; /* WCAG touch target */
        }}
        
        .nav-link:hover {{
            background: rgba(255, 255, 255, 0.1);
            color: {self.colors.islamic_gold};
        }}
        
        .nav-item-active .nav-link {{
            background: rgba(255, 255, 255, 0.2);
            color: {self.colors.islamic_gold};
            font-weight: 600;
        }}
        
        .navbar-end {{
            display: flex;
            align-items: center;
            gap: {self.spacing.md};
        }}
        
        .prayer-times {{
            display: flex;
            align-items: center;
            gap: {self.spacing.xs};
            font-size: {self.typography.text_sm};
            color: {self.colors.islamic_gold};
            font-family: {self.typography.arabic_secondary};
        }}
        
        .prayer-icon {{
            font-size: 16px;
        }}
        
        .user-menu {{
            position: relative;
        }}
        
        .user-menu-trigger {{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 44px;
            height: 44px;
            border: none;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            color: {self.colors.white};
            cursor: pointer;
            transition: all 0.2s ease;
        }}
        
        .user-menu-trigger:hover {{
            background: rgba(255, 255, 255, 0.2);
            color: {self.colors.islamic_gold};
        }}
        
        .user-menu-dropdown {{
            position: absolute;
            top: 100%;
            right: 0;
            background: {self.colors.white};
            border: 1px solid {self.colors.medium_gray};
            border-radius: 8px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
            list-style: none;
            margin: {self.spacing.sm} 0 0 0;
            padding: {self.spacing.sm};
            min-width: 200px;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-8px);
            transition: all 0.2s ease;
        }}
        
        .user-menu:hover .user-menu-dropdown,
        .user-menu:focus-within .user-menu-dropdown {{
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }}
        
        .user-menu-item {{
            margin: 0;
        }}
        
        .user-menu-link {{
            display: flex;
            align-items: center;
            gap: {self.spacing.sm};
            padding: {self.spacing.sm} {self.spacing.md};
            color: {self.colors.dark_gray};
            text-decoration: none;
            font-family: {self.typography.arabic_secondary};
            border-radius: 4px;
            transition: all 0.2s ease;
        }}
        
        .user-menu-link:hover {{
            background: {self.colors.light_gray};
            color: {self.colors.primary};
        }}
        
        /* RTL optimizations */
        .dir-rtl .navbar-container {{
            direction: rtl;
        }}
        
        .dir-rtl .user-menu-dropdown {{
            right: auto;
            left: 0;
        }}
        
        .dir-rtl .ministry-name,
        .dir-rtl .ministry-subtitle,
        .dir-rtl .nav-link,
        .dir-rtl .user-menu-link {{
            font-family: {self.typography.arabic_secondary};
        }}
        
        /* Theme variations */
        .theme-islamic-heritage .iraqi-navbar {{
            background: linear-gradient(135deg, {self.colors.islamic_gold}, {self.colors.masjid_blue});
        }}
        
        .theme-ministry-pro .iraqi-navbar {{
            background: {self.colors.gov_dark_blue};
        }}
        
        /* Responsive design */
        @media (max-width: 768px) {{
            .navbar-container {{
                padding: 0 {self.spacing.md};
                min-height: 56px;
            }}
            
            .ministry-name {{
                font-size: {self.typography.text_base};
            }}
            
            .ministry-subtitle {{
                font-size: {self.typography.text_xs};
            }}
            
            .nav-items {{
                display: none; /* Hide nav items on mobile, would show in mobile menu */
            }}
            
            .prayer-times {{
                display: none; /* Hide prayer times on mobile to save space */
            }}
        }}
        
        /* Accessibility enhancements */
        .nav-link:focus-visible,
        .user-menu-trigger:focus-visible,
        .user-menu-link:focus-visible {{
            outline: 2px solid {self.colors.islamic_gold};
            outline-offset: 2px;
        }}
        
        .sr-only {{
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }}
        
        /* High contrast mode */
        @media (prefers-contrast: high) {{
            .iraqi-navbar {{
                border-bottom: 3px solid {self.colors.islamic_gold};
            }}
            
            .nav-link,
            .user-menu-trigger {{
                border: 2px solid transparent;
            }}
            
            .nav-link:hover,
            .user-menu-trigger:hover {{
                border-color: {self.colors.islamic_gold};
            }}
        }}
        '''


# Component Factory and Registry
class IraqiComponentFactory:
    """
    Factory for creating Iraqi government UI components with cultural intelligence
    """
    
    def __init__(self, default_theme: UITheme = UITheme.GOVERNMENT_FORMAL):
        self.default_theme = default_theme
        self.components_registry = {
            'button': IraqiButton,
            'card': IraqiCard,
            'input': IraqiFormInput,
            'navbar': IraqiNavigationBar,
        }
        self.cultural_validator = IraqiCulturalValidator()
        self.logger = logging.getLogger('IraqiComponentFactory')
    
    async def create_component(
        self,
        component_type: str,
        component_config: Dict[str, Any]
    ) -> Optional[BaseComponent]:
        """Create component with cultural validation and compliance checking"""
        if component_type not in self.components_registry:
            self.logger.error(f"Unknown component type: {component_type}")
            return None
        
        try:
            # Add default theme if not specified
            if 'theme' not in component_config:
                component_config['theme'] = self.default_theme
            
            # Create component
            component_class = self.components_registry[component_type]
            component = component_class(**component_config)
            
            # Validate component configuration
            validation_result = await self._validate_component_config(component_config)
            if not validation_result['is_valid']:
                self.logger.warning(f"Component validation issues: {validation_result['issues']}")
            
            self.logger.info(f"Created {component_type} component: {component.component_id}")
            return component
            
        except Exception as e:
            self.logger.error(f"Error creating {component_type} component: {e}")
            return None
    
    async def _validate_component_config(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """Validate component configuration for cultural compliance"""
        validation_result = {
            'is_valid': True,
            'issues': [],
            'cultural_score': 1.0
        }
        
        # Check text content for cultural appropriateness
        text_fields = ['text', 'label', 'title', 'content', 'placeholder', 'ministry_name']
        for field in text_fields:
            if field in config and config[field]:
                cultural_check = await self.cultural_validator.validate_content(
                    config[field],
                    context_type='ui_component_config'
                )
                
                if not cultural_check.get('compliant', True):
                    validation_result['is_valid'] = False
                    validation_result['issues'].extend(cultural_check.get('issues', []))
                
                # Update overall cultural score (minimum score wins)
                field_score = cultural_check.get('compliance_score', 1.0)
                validation_result['cultural_score'] = min(validation_result['cultural_score'], field_score)
        
        return validation_result


# Example usage and testing
async def main():
    """Example usage of Iraqi Government UI Components"""
    # Initialize component factory
    factory = IraqiComponentFactory(UITheme.GOVERNMENT_FORMAL)
    
    # Create a button component
    button_config = {
        'text': 'تقديم الطلب',
        'button_id': 'submit-application-btn',
        'variant': 'primary',
        'size': ComponentSize.LARGE,
        'accessibility_level': AccessibilityLevel.GOVERNMENT
    }
    
    button = await factory.create_component('button', button_config)
    if button:
        print("=== Iraqi Government Button ===")
        print(await button.render())
        print("\n=== Button CSS ===")
        print(await button.get_styles())
        print("\n")
    
    # Create a form input component
    input_config = {
        'label': 'الاسم الكامل',
        'input_id': 'full-name-input',
        'placeholder': 'أدخل اسمك الكامل باللغة العربية',
        'required': True,
        'validation_rules': {
            'min_length': 3,
            'max_length': 100,
            'pattern': r'^[\u0600-\u06FF\s]+$'  # Arabic characters only
        },
        'help_text': 'يرجى إدخال الاسم كما هو مكتوب في الهوية العراقية'
    }
    
    input_component = await factory.create_component('input', input_config)
    if input_component:
        print("=== Iraqi Government Form Input ===")
        print(await input_component.render())
        print("\n=== Input CSS ===")
        print(await input_component.get_styles())
        print("\n")
    
    # Create a navigation bar
    navbar_config = {
        'nav_id': 'ministry-navbar',
        'ministry_name': 'وزارة التربية والتعليم العالي',
        'logo_url': '/assets/ministry-logo.svg',
        'navigation_items': [
            {'label': 'الرئيسية', 'href': '/', 'active': True, 'icon': 'home-icon'},
            {'label': 'الخدمات', 'href': '/services', 'icon': 'services-icon'},
            {'label': 'المعاملات', 'href': '/transactions', 'icon': 'transactions-icon'},
            {'label': 'التواصل', 'href': '/contact', 'icon': 'contact-icon'}
        ],
        'user_menu_items': [
            {'label': 'الملف الشخصي', 'href': '/profile', 'icon': 'profile-icon'},
            {'label': 'الإعدادات', 'href': '/settings', 'icon': 'settings-icon'},
            {'label': 'تسجيل الخروج', 'href': '/logout', 'icon': 'logout-icon'}
        ],
        'show_prayer_times': True
    }
    
    navbar = await factory.create_component('navbar', navbar_config)
    if navbar:
        print("=== Iraqi Government Navigation Bar ===")
        print(await navbar.render())
        print("\n=== Navbar CSS ===")
        print(await navbar.get_styles())
        print("\n")
    
    # Create a card component
    card_config = {
        'title': 'طلب شهادة تخرج',
        'content': 'يمكنك تقديم طلب للحصول على شهادة التخرج من خلال النظام الإلكتروني. يرجى التأكد من إدخال جميع البيانات المطلوبة بدقة.',
        'card_id': 'graduation-certificate-card',
        'header_actions': [
            {'icon': 'edit-icon', 'label': 'تحرير', 'onclick': 'editCard()'},
            {'icon': 'share-icon', 'label': 'مشاركة', 'onclick': 'shareCard()'}
        ],
        'footer_content': 'آخر تحديث: 20 أغسطس 2025',
        'elevated': True
    }
    
    card = await factory.create_component('card', card_config)
    if card:
        print("=== Iraqi Government Card ===")
        print(await card.render())
        print("\n=== Card CSS ===")
        print(await card.get_styles())


if __name__ == "__main__":
    asyncio.run(main())