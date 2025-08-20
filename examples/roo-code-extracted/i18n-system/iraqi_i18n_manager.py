"""
Iraqi I18n Manager - Enhanced Internationalization with Cultural Intelligence

Extracted from Roo-Code i18n/index.ts and enhanced with Iraqi cultural patterns,
Arabic language support, and professional domain localization.

Key enhancements:
- Iraqi dialect recognition and processing
- RTL (Right-to-Left) text formatting
- Cultural context-aware translations
- Professional domain terminology management
- Islamic calendar and number formatting
- Gender-appropriate language handling
"""

from dataclasses import dataclass
from enum import Enum
from typing import Dict, List, Any, Optional, Union, Callable
import json
import asyncio
import logging
from pathlib import Path
from datetime import datetime
import re

class IraqiDialect(Enum):
    BAGHDADI = "baghdadi"
    BASRAWI = "basrawi"
    MOSLAWI = "moslawi"
    KURDISH_ARABIC = "kurdish_arabic"
    STANDARD_ARABIC = "standard_arabic"
    MIXED = "mixed"

class ProfessionalDomain(Enum):
    LEGAL = "legal"
    MEDICAL = "medical"
    EDUCATIONAL = "educational"
    GOVERNMENT = "government"
    BUSINESS = "business"
    TECHNICAL = "technical"
    RELIGIOUS = "religious"
    GENERAL = "general"

class GenderContext(Enum):
    MALE = "male"
    FEMALE = "female"
    NEUTRAL = "neutral"
    MIXED_AUDIENCE = "mixed"

@dataclass
class LocalizationContext:
    """Context information for culturally appropriate localization"""
    dialect: IraqiDialect
    domain: ProfessionalDomain
    gender_context: GenderContext
    formality_level: str  # casual, formal, very_formal
    target_audience: str  # students, professionals, general_public
    religious_sensitivity: bool
    political_neutrality: bool
    
@dataclass
class TranslationEntry:
    """Translation entry with cultural metadata"""
    key: str
    arabic_text: str
    english_text: str
    dialect: IraqiDialect
    domain: ProfessionalDomain
    rtl_formatted: str
    cultural_notes: Optional[str]
    gender_variants: Optional[Dict[str, str]]
    formality_variants: Optional[Dict[str, str]]
    
class IraqiI18nManager:
    """Enhanced internationalization manager with Iraqi cultural intelligence"""
    
    def __init__(self, default_dialect: IraqiDialect = IraqiDialect.STANDARD_ARABIC):
        self.default_dialect = default_dialect
        self.translations: Dict[str, Dict[str, TranslationEntry]] = {}
        self.cultural_formatters: Dict[str, Callable] = {}
        self.dialect_processors: Dict[IraqiDialect, Callable] = {}
        self.domain_terminologies: Dict[ProfessionalDomain, Dict[str, str]] = {}
        self.rtl_processors: Dict[str, Callable] = {}
        self._setup_logging()
        self._initialize_cultural_systems()
        
    def _setup_logging(self):
        """Setup culturally appropriate logging with Arabic support"""
        self.logger = logging.getLogger("iraqi_i18n_manager")
        self.logger.setLevel(logging.INFO)
        
        # Custom formatter that handles Arabic text properly
        class CulturalFormatter(logging.Formatter):
            def format(self, record):
                formatted = super().format(record)
                # Ensure proper RTL formatting for Arabic content
                if self._contains_arabic(formatted):
                    formatted = self._apply_rtl_formatting(formatted)
                return formatted
                
            def _contains_arabic(self, text: str) -> bool:
                arabic_range = range(0x0600, 0x06FF + 1)
                return any(ord(char) in arabic_range for char in text)
                
            def _apply_rtl_formatting(self, text: str) -> str:
                # Simple RTL formatting with direction markers
                return f"‏{text}‏"
        
        handler = logging.StreamHandler()
        handler.setFormatter(CulturalFormatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
        self.logger.addHandler(handler)
    
    def _initialize_cultural_systems(self):
        """Initialize cultural and linguistic processing systems"""
        
        # Setup dialect processors
        self.dialect_processors = {
            IraqiDialect.BAGHDADI: self._process_baghdadi_dialect,
            IraqiDialect.BASRAWI: self._process_basrawi_dialect,
            IraqiDialect.MOSLAWI: self._process_moslawi_dialect,
            IraqiDialect.KURDISH_ARABIC: self._process_kurdish_arabic_dialect,
            IraqiDialect.STANDARD_ARABIC: self._process_standard_arabic,
            IraqiDialect.MIXED: self._process_mixed_dialect
        }
        
        # Setup cultural formatters
        self.cultural_formatters = {
            'date': self._format_islamic_date,
            'time': self._format_islamic_time,
            'number': self._format_arabic_numbers,
            'currency': self._format_iraqi_currency,
            'name': self._format_arabic_name,
            'address': self._format_iraqi_address,
            'phone': self._format_iraqi_phone
        }
        
        # Setup RTL processors
        self.rtl_processors = {
            'text': self._format_rtl_text,
            'mixed': self._format_mixed_content,
            'list': self._format_rtl_list,
            'table': self._format_rtl_table
        }
        
        # Initialize professional domain terminologies
        self._load_professional_terminologies()
    
    async def register_translations(self, translations: Dict[str, Any], 
                                  context: LocalizationContext) -> bool:
        """Register translations with cultural context"""
        try:
            language_key = f"{context.dialect.value}_{context.domain.value}"
            
            if language_key not in self.translations:
                self.translations[language_key] = {}
            
            for key, translation_data in translations.items():
                # Create translation entry with cultural enhancement
                entry = await self._create_translation_entry(
                    key, translation_data, context
                )
                
                self.translations[language_key][key] = entry
            
            self.logger.info(f"Registered {len(translations)} translations for {language_key}")
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to register translations: {str(e)}")
            return False
    
    async def translate(self, key: str, context: LocalizationContext,
                       parameters: Optional[Dict[str, Any]] = None) -> str:
        """Translate with cultural context and parameter substitution"""
        
        # Try to find translation in order of preference
        language_key = f"{context.dialect.value}_{context.domain.value}"
        
        # Try specific dialect + domain combination first
        if language_key in self.translations and key in self.translations[language_key]:
            entry = self.translations[language_key][key]
        else:
            # Fallback to standard Arabic + domain
            fallback_key = f"{IraqiDialect.STANDARD_ARABIC.value}_{context.domain.value}"
            if fallback_key in self.translations and key in self.translations[fallback_key]:
                entry = self.translations[fallback_key][key]
            else:
                # Final fallback to standard Arabic + general domain
                general_key = f"{IraqiDialect.STANDARD_ARABIC.value}_{ProfessionalDomain.GENERAL.value}"
                if general_key in self.translations and key in self.translations[general_key]:
                    entry = self.translations[general_key][key]
                else:
                    self.logger.warning(f"Translation not found for key: {key}")
                    return key  # Return key as fallback
        
        # Get appropriate text variant based on context
        text = await self._select_text_variant(entry, context)
        
        # Apply parameter substitution if provided
        if parameters:
            text = await self._apply_parameter_substitution(text, parameters, context)
        
        # Apply cultural formatting
        text = await self._apply_cultural_formatting(text, context)
        
        return text
    
    async def detect_dialect(self, text: str) -> IraqiDialect:
        """Detect Iraqi dialect from text content"""
        
        # Dialect-specific patterns and indicators
        dialect_patterns = {
            IraqiDialect.BAGHDADI: [
                r'\bشلونك\b',  # How are you (Baghdadi)
                r'\bماكو\b',   # There isn't (Baghdadi)
                r'\bوية\b',    # Very (Baghdadi)
                r'\bشگد\b'     # How much (Baghdadi)
            ],
            IraqiDialect.BASRAWI: [
                r'\bشلونكم\b', # How are you (Basrawi)
                r'\bماكو شي\b', # Nothing (Basrawi)
                r'\bهوايا\b'    # A lot (Basrawi)
            ],
            IraqiDialect.MOSLAWI: [
                r'\bشلوناتكم\b', # How are you (Moslawi)
                r'\bليت\b',      # Nothing (Moslawi)
                r'\bجثير\b'      # A lot (Moslawi)
            ],
            IraqiDialect.KURDISH_ARABIC: [
                r'\bچوني\b',    # How (Kurdish Arabic)
                r'\bهانا\b',    # Here (Kurdish Arabic)
                r'\bچ\b'        # What (Kurdish Arabic)
            ]
        }
        
        # Count matches for each dialect
        dialect_scores = {}
        
        for dialect, patterns in dialect_patterns.items():
            score = 0
            for pattern in patterns:
                matches = len(re.findall(pattern, text, re.UNICODE))
                score += matches * 2  # Weight dialect-specific terms heavily
            
            dialect_scores[dialect] = score
        
        # Check for standard Arabic patterns
        standard_arabic_patterns = [
            r'\bكيف حالك\b',  # How are you (Standard)
            r'\bلا يوجد\b',   # There isn't (Standard)
            r'\bجداً\b',      # Very (Standard)
            r'\bكم\b'        # How much (Standard)
        ]
        
        standard_score = 0
        for pattern in standard_arabic_patterns:
            matches = len(re.findall(pattern, text, re.UNICODE))
            standard_score += matches
        
        dialect_scores[IraqiDialect.STANDARD_ARABIC] = standard_score
        
        # Return dialect with highest score, or mixed if close scores
        if not dialect_scores or max(dialect_scores.values()) == 0:
            return self.default_dialect
        
        max_score = max(dialect_scores.values())
        best_dialects = [d for d, s in dialect_scores.items() if s == max_score]
        
        if len(best_dialects) > 1:
            return IraqiDialect.MIXED
        
        return best_dialects[0]
    
    def format_cultural_content(self, content_type: str, value: Any, 
                              context: LocalizationContext) -> str:
        """Format content according to Iraqi cultural conventions"""
        
        if content_type in self.cultural_formatters:
            formatter = self.cultural_formatters[content_type]
            return formatter(value, context)
        else:
            self.logger.warning(f"No formatter found for content type: {content_type}")
            return str(value)
    
    def apply_rtl_formatting(self, text: str, content_type: str = 'text') -> str:
        """Apply RTL (Right-to-Left) formatting to Arabic content"""
        
        if content_type in self.rtl_processors:
            processor = self.rtl_processors[content_type]
            return processor(text)
        else:
            # Default RTL formatting
            return self._format_rtl_text(text)
    
    # Dialect processors
    def _process_baghdadi_dialect(self, text: str) -> str:
        """Process text for Baghdadi dialect conventions"""
        # Convert standard Arabic greetings to Baghdadi
        text = re.sub(r'\bكيف حالك\b', 'شلونك', text)
        text = re.sub(r'\bلا يوجد\b', 'ماكو', text)
        text = re.sub(r'\bجداً\b', 'وية', text)
        return text
    
    def _process_basrawi_dialect(self, text: str) -> str:
        """Process text for Basrawi dialect conventions"""
        text = re.sub(r'\bكيف حالكم\b', 'شلونكم', text)
        text = re.sub(r'\bكثير\b', 'هوايا', text)
        return text
    
    def _process_moslawi_dialect(self, text: str) -> str:
        """Process text for Moslawi dialect conventions"""
        text = re.sub(r'\bكيف حالكم\b', 'شلوناتكم', text)
        text = re.sub(r'\bكثير\b', 'جثير', text)
        return text
    
    def _process_kurdish_arabic_dialect(self, text: str) -> str:
        """Process text for Kurdish Arabic dialect conventions"""
        text = re.sub(r'\bكيف\b', 'چوني', text)
        text = re.sub(r'\bهنا\b', 'هانا', text)
        return text
    
    def _process_standard_arabic(self, text: str) -> str:
        """Process text for Standard Arabic conventions"""
        # Ensure proper diacritics and formal structure
        return text  # Standard Arabic typically doesn't need conversion
    
    def _process_mixed_dialect(self, text: str) -> str:
        """Process text that contains mixed dialectal elements"""
        # Apply light processing that works across dialects
        return text
    
    # Cultural formatters
    def _format_islamic_date(self, date_value: datetime, context: LocalizationContext) -> str:
        """Format dates according to Islamic calendar preferences"""
        # This would integrate with Islamic calendar conversion
        gregorian_format = date_value.strftime("%Y/%m/%d")
        
        # Add Arabic month names if appropriate
        arabic_months = [
            "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
            "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
        ]
        
        if context.dialect in [IraqiDialect.STANDARD_ARABIC, IraqiDialect.MIXED]:
            month_name = arabic_months[date_value.month - 1]
            return f"{date_value.day} {month_name} {date_value.year}"
        
        return gregorian_format
    
    def _format_islamic_time(self, time_value: datetime, context: LocalizationContext) -> str:
        """Format time with cultural considerations"""
        # Use 12-hour format which is common in Iraq
        time_str = time_value.strftime("%I:%M %p")
        
        # Convert AM/PM to Arabic if context requires
        if context.dialect in [IraqiDialect.STANDARD_ARABIC, IraqiDialect.MIXED]:
            time_str = time_str.replace("AM", "صباحاً").replace("PM", "مساءً")
        
        return time_str
    
    def _format_arabic_numbers(self, number: Union[int, float], context: LocalizationContext) -> str:
        """Format numbers using Arabic-Indic digits when appropriate"""
        # Arabic-Indic digits mapping
        arabic_digits = str.maketrans('0123456789', '٠١٢٣٤٥٦٧٨٩')
        
        if context.dialect == IraqiDialect.STANDARD_ARABIC:
            return str(number).translate(arabic_digits)
        else:
            # Use Western Arabic numerals (0-9) for dialects
            return str(number)
    
    def _format_iraqi_currency(self, amount: float, context: LocalizationContext) -> str:
        """Format currency amounts in Iraqi Dinar"""
        formatted_amount = f"{amount:,.0f}"
        
        if context.dialect == IraqiDialect.STANDARD_ARABIC:
            formatted_amount = self._format_arabic_numbers(formatted_amount, context)
            return f"{formatted_amount} دينار عراقي"
        else:
            return f"{formatted_amount} IQD"
    
    def _format_arabic_name(self, name: str, context: LocalizationContext) -> str:
        """Format Arabic names according to cultural conventions"""
        # Apply proper name formatting with cultural considerations
        if context.gender_context == GenderContext.FEMALE and context.formality_level == "formal":
            # Add appropriate feminine markers if needed
            pass
        
        return name
    
    def _format_iraqi_address(self, address: Dict[str, str], context: LocalizationContext) -> str:
        """Format Iraqi addresses according to local conventions"""
        parts = []
        
        # Iraqi address format: Street, District, City, Province
        if 'street' in address:
            parts.append(address['street'])
        if 'district' in address:
            parts.append(address['district'])
        if 'city' in address:
            parts.append(address['city'])
        if 'province' in address:
            parts.append(address['province'])
        
        formatted_address = '، '.join(parts)  # Arabic comma separator
        
        if context.dialect != IraqiDialect.STANDARD_ARABIC:
            formatted_address = ', '.join(parts)  # Western comma for dialects
        
        return formatted_address
    
    def _format_iraqi_phone(self, phone: str, context: LocalizationContext) -> str:
        """Format Iraqi phone numbers according to local conventions"""
        # Clean phone number
        cleaned = re.sub(r'[^\d+]', '', phone)
        
        # Iraqi mobile format: +964 XXX XXX XXXX
        if cleaned.startswith('+964'):
            formatted = f"+964 {cleaned[4:7]} {cleaned[7:10]} {cleaned[10:]}"
        elif cleaned.startswith('964'):
            formatted = f"+964 {cleaned[3:6]} {cleaned[6:9]} {cleaned[9:]}"
        else:
            formatted = phone
        
        return formatted
    
    # RTL processors
    def _format_rtl_text(self, text: str) -> str:
        """Apply RTL formatting to Arabic text"""
        if self._contains_arabic(text):
            # Add RTL direction markers
            return f"‏{text}‏"
        return text
    
    def _format_mixed_content(self, text: str) -> str:
        """Format mixed Arabic-English content with proper directionality"""
        # Split text into segments and apply appropriate direction markers
        segments = []
        current_segment = ""
        current_is_arabic = False
        
        for char in text:
            char_is_arabic = self._is_arabic_char(char)
            
            if current_is_arabic != char_is_arabic and current_segment:
                # Direction change detected
                if current_is_arabic:
                    segments.append(f"‏{current_segment}‏")  # RTL
                else:
                    segments.append(f"‎{current_segment}‎")  # LTR
                current_segment = ""
            
            current_segment += char
            current_is_arabic = char_is_arabic
        
        # Add final segment
        if current_segment:
            if current_is_arabic:
                segments.append(f"‏{current_segment}‏")
            else:
                segments.append(f"‎{current_segment}‎")
        
        return "".join(segments)
    
    def _format_rtl_list(self, items: List[str]) -> str:
        """Format lists with RTL considerations"""
        formatted_items = [self._format_rtl_text(item) for item in items]
        return "، ".join(formatted_items)  # Arabic comma separator
    
    def _format_rtl_table(self, table_data: List[List[str]]) -> str:
        """Format table data with RTL alignment"""
        # This would generate RTL-appropriate table formatting
        formatted_rows = []
        for row in table_data:
            formatted_row = " | ".join([self._format_rtl_text(cell) for cell in reversed(row)])
            formatted_rows.append(formatted_row)
        
        return "\n".join(formatted_rows)
    
    # Helper methods
    def _contains_arabic(self, text: str) -> bool:
        """Check if text contains Arabic characters"""
        arabic_range = range(0x0600, 0x06FF + 1)
        return any(ord(char) in arabic_range for char in text)
    
    def _is_arabic_char(self, char: str) -> bool:
        """Check if a character is Arabic"""
        return 0x0600 <= ord(char) <= 0x06FF
    
    async def _create_translation_entry(self, key: str, translation_data: Any,
                                      context: LocalizationContext) -> TranslationEntry:
        """Create enhanced translation entry with cultural metadata"""
        
        if isinstance(translation_data, str):
            # Simple string translation
            arabic_text = translation_data
            english_text = key  # Use key as English fallback
        elif isinstance(translation_data, dict):
            arabic_text = translation_data.get('ar', translation_data.get('arabic', key))
            english_text = translation_data.get('en', translation_data.get('english', key))
        else:
            arabic_text = str(translation_data)
            english_text = key
        
        # Apply dialect processing
        if context.dialect in self.dialect_processors:
            processor = self.dialect_processors[context.dialect]
            arabic_text = processor(arabic_text)
        
        # Format for RTL
        rtl_formatted = self.apply_rtl_formatting(arabic_text)
        
        # Extract variants if available
        gender_variants = None
        formality_variants = None
        
        if isinstance(translation_data, dict):
            gender_variants = translation_data.get('gender_variants')
            formality_variants = translation_data.get('formality_variants')
        
        return TranslationEntry(
            key=key,
            arabic_text=arabic_text,
            english_text=english_text,
            dialect=context.dialect,
            domain=context.domain,
            rtl_formatted=rtl_formatted,
            cultural_notes=translation_data.get('cultural_notes') if isinstance(translation_data, dict) else None,
            gender_variants=gender_variants,
            formality_variants=formality_variants
        )
    
    async def _select_text_variant(self, entry: TranslationEntry, 
                                 context: LocalizationContext) -> str:
        """Select appropriate text variant based on context"""
        
        # Check for gender-specific variants
        if (entry.gender_variants and 
            context.gender_context != GenderContext.NEUTRAL):
            
            gender_key = context.gender_context.value
            if gender_key in entry.gender_variants:
                return entry.gender_variants[gender_key]
        
        # Check for formality variants
        if entry.formality_variants and context.formality_level in entry.formality_variants:
            return entry.formality_variants[context.formality_level]
        
        # Return default Arabic text
        return entry.arabic_text
    
    async def _apply_parameter_substitution(self, text: str, parameters: Dict[str, Any],
                                          context: LocalizationContext) -> str:
        """Apply parameter substitution with cultural formatting"""
        
        for param_name, param_value in parameters.items():
            placeholder = f"{{{param_name}}}"
            
            if placeholder in text:
                # Apply cultural formatting to parameter value
                if isinstance(param_value, datetime):
                    formatted_value = self._format_islamic_date(param_value, context)
                elif isinstance(param_value, (int, float)) and param_name.endswith('_amount'):
                    formatted_value = self._format_iraqi_currency(param_value, context)
                elif isinstance(param_value, (int, float)):
                    formatted_value = self._format_arabic_numbers(param_value, context)
                else:
                    formatted_value = str(param_value)
                
                text = text.replace(placeholder, formatted_value)
        
        return text
    
    async def _apply_cultural_formatting(self, text: str, context: LocalizationContext) -> str:
        """Apply final cultural formatting to translated text"""
        
        # Apply RTL formatting if needed
        if self._contains_arabic(text):
            text = self.apply_rtl_formatting(text, 'mixed' if self._has_mixed_content(text) else 'text')
        
        return text
    
    def _has_mixed_content(self, text: str) -> bool:
        """Check if text contains both Arabic and Latin characters"""
        has_arabic = self._contains_arabic(text)
        has_latin = any(char.isascii() and char.isalpha() for char in text)
        return has_arabic and has_latin
    
    def _load_professional_terminologies(self):
        """Load professional domain terminologies"""
        # This would typically load from configuration files
        self.domain_terminologies = {
            ProfessionalDomain.LEGAL: {
                'contract': 'عقد',
                'court': 'محكمة',
                'lawyer': 'محامي',
                'evidence': 'دليل',
                'judgment': 'حكم'
            },
            ProfessionalDomain.MEDICAL: {
                'patient': 'مريض',
                'doctor': 'طبيب',
                'medicine': 'دواء',
                'hospital': 'مستشفى',
                'diagnosis': 'تشخيص'
            },
            ProfessionalDomain.EDUCATIONAL: {
                'student': 'طالب',
                'teacher': 'معلم',
                'school': 'مدرسة',
                'lesson': 'درس',
                'exam': 'امتحان'
            }
        }

# Example usage
async def main():
    """Example usage of Iraqi I18n Manager"""
    i18n = IraqiI18nManager(default_dialect=IraqiDialect.STANDARD_ARABIC)
    
    # Setup localization context
    context = LocalizationContext(
        dialect=IraqiDialect.BAGHDADI,
        domain=ProfessionalDomain.LEGAL,
        gender_context=GenderContext.MIXED_AUDIENCE,
        formality_level="formal",
        target_audience="professionals",
        religious_sensitivity=True,
        political_neutrality=True
    )
    
    # Register translations
    translations = {
        'welcome_message': {
            'arabic': 'أهلاً وسهلاً بكم في نظام المحكمة الإلكترونية',
            'english': 'Welcome to the Electronic Court System',
            'formality_variants': {
                'formal': 'أهلاً وسهلاً بكم في نظام المحكمة الإلكترونية',
                'casual': 'مرحبا بيكم في نظام المحكمة'
            }
        },
        'case_number': 'رقم القضية: {case_id}',
        'total_amount': 'المبلغ الإجمالي: {amount}'
    }
    
    await i18n.register_translations(translations, context)
    
    # Test translations
    welcome = await i18n.translate('welcome_message', context)
    print(f"Welcome message: {welcome}")
    
    case_msg = await i18n.translate('case_number', context, {'case_id': '2025/123'})
    print(f"Case message: {case_msg}")
    
    amount_msg = await i18n.translate('total_amount', context, {'amount': 150000})
    print(f"Amount message: {amount_msg}")
    
    # Test dialect detection
    test_text = "شلونك اليوم؟ شكو ماكو؟"
    detected_dialect = await i18n.detect_dialect(test_text)
    print(f"Detected dialect: {detected_dialect.value}")

if __name__ == "__main__":
    asyncio.run(main())