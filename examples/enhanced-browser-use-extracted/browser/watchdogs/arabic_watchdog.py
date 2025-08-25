"""
Arabic content processing watchdog.
Specialized monitoring for Arabic RTL text processing and Iraqi dialect recognition.
"""

import asyncio
import time
from typing import TYPE_CHECKING, ClassVar, Dict, List, Optional, Set
import re
from collections import defaultdict

from bubus import BaseEvent
from pydantic import Field, PrivateAttr

from ..watchdog_base import (
    BaseWatchdog,
    ArabicContentProcessedEvent
)

if TYPE_CHECKING:
    pass


class ArabicContentWatchdog(BaseWatchdog):
    """
    Arabic content processing watchdog.
    
    Specialized for:
    - Arabic RTL text detection and processing
    - Iraqi dialect recognition and preservation
    - Mixed Arabic-English content handling
    - Typography and rendering optimization
    - Cultural context preservation
    """
    
    # Event contracts
    LISTENS_TO: ClassVar[list[type[BaseEvent]]] = []  # Will be populated from browser events
    EMITS: ClassVar[list[type[BaseEvent]]] = [
        ArabicContentProcessedEvent,
    ]
    
    # Arabic processing configuration
    arabic_rtl_processing_enabled: bool = Field(default=True)
    iraqi_dialect_recognition_enabled: bool = Field(default=True)
    mixed_content_optimization: bool = Field(default=True)
    arabic_typography_enhancement: bool = Field(default=True)
    
    # Recognition thresholds
    arabic_content_threshold: float = Field(default=0.1, ge=0.0, le=1.0)  # 10% Arabic chars minimum
    iraqi_dialect_confidence_threshold: float = Field(default=0.7, ge=0.0, le=1.0)
    mixed_content_threshold: float = Field(default=0.2, ge=0.0, le=1.0)  # 20% mixed content
    
    # Processing performance
    processing_timeout_seconds: float = Field(default=2.0, gt=0.0)
    batch_processing_size: int = Field(default=100, gt=0)
    enable_caching: bool = Field(default=True)
    
    # Iraqi dialect patterns
    iraqi_dialect_patterns: Dict[str, float] = Field(default_factory=lambda: {
        # Common Iraqi greetings and expressions
        'شلونك': 0.95,      # How are you (Iraqi)
        'شلونكم': 0.95,     # How are you (plural, Iraqi)
        'شكو ماكو': 0.98,   # What's up (very Iraqi)
        'شكو': 0.90,        # What (Iraqi)
        'شنو': 0.85,        # What (Iraqi variant)
        'ماكو': 0.90,       # There isn't (Iraqi)
        'وين': 0.80,        # Where (Iraqi)
        'وينك': 0.85,       # Where are you (Iraqi)
        'اجه': 0.75,         # Come (Iraqi)
        'روح': 0.70,        # Go (Iraqi)
        'خلاص': 0.65,       # Finished/enough (Iraqi)
        'زين': 0.80,        # Good (Iraqi)
        'لو سمحت': 0.70,    # Please (Iraqi)
        'شكرا الك': 0.75,   # Thank you (Iraqi)
        
        # Iraqi-specific terms
        'بغدادي': 0.90,     # Baghdadi
        'عراقي': 0.85,      # Iraqi
        'دينار': 0.80,      # Iraqi Dinar
        'الفرات': 0.75,     # Euphrates
        'دجلة': 0.75,       # Tigris
        
        # Cultural and religious (common in Iraq)
        'والله': 0.60,      # By God
        'انشالله': 0.55,    # God willing
        'بسم الله': 0.50,   # In the name of God
    })
    
    # Arabic typography patterns
    arabic_typography_rules: Dict[str, str] = Field(default_factory=lambda: {
        'rtl_direction': '\u202B',      # RLE - Right-to-Left Embedding
        'rtl_override': '\u202E',       # RLO - Right-to-Left Override
        'ltr_direction': '\u202A',      # LRE - Left-to-Right Embedding
        'pop_directional': '\u202C',    # PDF - Pop Directional Formatting
        'arabic_comma': '،',            # Arabic comma
        'arabic_semicolon': '؛',        # Arabic semicolon
        'arabic_question': '؟',         # Arabic question mark
        'arabic_percent': '٪',          # Arabic percent sign
    })
    
    # Private state
    _arabic_content_cache: Dict[str, dict] = PrivateAttr(default_factory=dict)
    _dialect_recognition_stats: Dict[str, int] = PrivateAttr(default_factory=lambda: defaultdict(int))
    _processing_performance: List[dict] = PrivateAttr(default_factory=list)
    _mixed_content_patterns: Set[str] = PrivateAttr(default_factory=set)

    async def on_NavigationCompleteEvent(self, event) -> None:
        """
        Process Arabic content after page navigation.
        
        Args:
            event: NavigationCompleteEvent with page details
        """
        if not self.arabic_rtl_processing_enabled:
            return
            
        url = getattr(event, 'url', '')
        
        try:
            # Extract and process page content
            page_content = await self._extract_page_text_content(url, event)
            
            if page_content and self._contains_arabic_content(page_content):
                processing_result = await self._process_arabic_content(
                    content=page_content,
                    source_url=url,
                    content_type='page_content'
                )
                
                # Emit processing event
                await self.emit_arabic_content_processed(
                    content=page_content[:200],  # First 200 chars
                    processing_type='page_navigation',
                    result=processing_result
                )
                
        except Exception as e:
            self.logger.error(f'Error processing Arabic content on navigation: {e}')

    async def on_InputEvent(self, event) -> None:
        """
        Process Arabic content in user input.
        
        Args:
            event: InputEvent with user input details
        """
        if not self.arabic_rtl_processing_enabled:
            return
            
        try:
            input_text = getattr(event, 'text', '')
            
            if input_text and self._contains_arabic_content(input_text):
                processing_result = await self._process_arabic_content(
                    content=input_text,
                    source_url='user_input',
                    content_type='user_input'
                )
                
                # Apply RTL formatting if needed
                if processing_result['rtl_formatting_needed']:
                    formatted_text = self._apply_rtl_formatting(input_text)
                    processing_result['formatted_text'] = formatted_text
                
                await self.emit_arabic_content_processed(
                    content=input_text[:100],  # First 100 chars for privacy
                    processing_type='user_input',
                    result=processing_result
                )
                
        except Exception as e:
            self.logger.error(f'Error processing Arabic input: {e}')

    async def on_DomChangeEvent(self, event) -> None:
        """
        Process Arabic content in DOM changes.
        
        Args:
            event: DomChangeEvent with DOM modification details
        """
        if not self.arabic_rtl_processing_enabled:
            return
            
        try:
            changed_content = self._extract_changed_text_content(event)
            
            if changed_content and self._contains_arabic_content(changed_content):
                processing_result = await self._process_arabic_content(
                    content=changed_content,
                    source_url='dom_change',
                    content_type='dynamic_content'
                )
                
                await self.emit_arabic_content_processed(
                    content=changed_content[:150],  # First 150 chars
                    processing_type='dom_change',
                    result=processing_result
                )
                
        except Exception as e:
            self.logger.error(f'Error processing Arabic content in DOM change: {e}')

    def _contains_arabic_content(self, text: str) -> bool:
        """
        Check if text contains Arabic content above threshold.
        
        Args:
            text: Text to check
            
        Returns:
            True if Arabic content is above threshold
        """
        if not text:
            return False
        
        # Count Arabic characters
        arabic_pattern = r'[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]'
        arabic_chars = len(re.findall(arabic_pattern, text))
        total_chars = len([c for c in text if c.isalnum()])
        
        if total_chars == 0:
            return False
        
        arabic_ratio = arabic_chars / total_chars
        return arabic_ratio >= self.arabic_content_threshold

    async def _process_arabic_content(self, content: str, source_url: str, content_type: str) -> Dict[str, any]:
        """
        Comprehensive Arabic content processing.
        
        Args:
            content: Arabic content to process
            source_url: Source URL or identifier
            content_type: Type of content (page_content, user_input, dynamic_content)
            
        Returns:
            Processing results dictionary
        """
        start_time = time.time()
        
        # Check cache first
        if self.enable_caching:
            cache_key = self._generate_cache_key(content, content_type)
            if cache_key in self._arabic_content_cache:
                cached_result = self._arabic_content_cache[cache_key].copy()
                cached_result['cache_hit'] = True
                return cached_result
        
        processing_result = {
            'source_url': source_url,
            'content_type': content_type,
            'content_length': len(content),
            'processing_timestamp': start_time,
            'cache_hit': False
        }
        
        try:
            # Arabic content analysis
            arabic_analysis = await self._analyze_arabic_content(content)
            processing_result['arabic_analysis'] = arabic_analysis
            
            # Iraqi dialect recognition
            if self.iraqi_dialect_recognition_enabled:
                dialect_analysis = await self._recognize_iraqi_dialect(content)
                processing_result['dialect_analysis'] = dialect_analysis
            
            # Mixed content handling
            if self.mixed_content_optimization:
                mixed_content_analysis = await self._analyze_mixed_content(content)
                processing_result['mixed_content_analysis'] = mixed_content_analysis
            
            # RTL formatting recommendations
            rtl_analysis = await self._analyze_rtl_formatting_needs(content, arabic_analysis)
            processing_result['rtl_analysis'] = rtl_analysis
            processing_result['rtl_formatting_needed'] = rtl_analysis['formatting_needed']
            
            # Typography enhancement
            if self.arabic_typography_enhancement:
                typography_analysis = await self._analyze_typography_needs(content)
                processing_result['typography_analysis'] = typography_analysis
            
            # Performance metrics
            processing_time_ms = (time.time() - start_time) * 1000
            processing_result['processing_time_ms'] = processing_time_ms
            processing_result['success'] = True
            
            # Cache result
            if self.enable_caching:
                self._arabic_content_cache[cache_key] = processing_result.copy()
            
            # Update performance tracking
            self._processing_performance.append({
                'timestamp': start_time,
                'content_type': content_type,
                'content_length': len(content),
                'processing_time_ms': processing_time_ms,
                'dialect_confidence': processing_result.get('dialect_analysis', {}).get('confidence', 0.0)
            })
            
            # Update dialect statistics
            if 'dialect_analysis' in processing_result:
                dialect_type = processing_result['dialect_analysis'].get('detected_dialect', 'unknown')
                self._dialect_recognition_stats[dialect_type] += 1
            
        except Exception as e:
            processing_result['success'] = False
            processing_result['error'] = str(e)
            processing_result['processing_time_ms'] = (time.time() - start_time) * 1000
            self.logger.error(f'Error in Arabic content processing: {e}')
        
        # Cleanup old performance data
        await self._cleanup_performance_data()
        
        return processing_result

    async def _analyze_arabic_content(self, content: str) -> Dict[str, any]:
        """
        Analyze Arabic content characteristics.
        
        Args:
            content: Content to analyze
            
        Returns:
            Arabic content analysis
        """
        # Character analysis
        arabic_pattern = r'[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]'
        arabic_chars = re.findall(arabic_pattern, content)
        total_chars = len([c for c in content if c.isalnum()])
        
        arabic_char_count = len(arabic_chars)
        arabic_percentage = (arabic_char_count / total_chars) if total_chars > 0 else 0.0
        
        # Text direction analysis
        has_rtl_content = arabic_char_count > 0
        
        # Word analysis
        words = content.split()
        arabic_words = [word for word in words if re.search(arabic_pattern, word)]
        
        # Sentence analysis
        sentences = re.split(r'[.!?؟]', content)
        arabic_sentences = [s for s in sentences if re.search(arabic_pattern, s)]
        
        return {
            'total_characters': len(content),
            'arabic_characters': arabic_char_count,
            'arabic_percentage': arabic_percentage,
            'has_rtl_content': has_rtl_content,
            'total_words': len(words),
            'arabic_words': len(arabic_words),
            'total_sentences': len(sentences),
            'arabic_sentences': len(arabic_sentences),
            'unique_arabic_chars': len(set(arabic_chars)),
            'predominant_direction': 'rtl' if arabic_percentage > 0.5 else 'mixed' if arabic_percentage > 0.1 else 'ltr'
        }

    async def _recognize_iraqi_dialect(self, content: str) -> Dict[str, any]:
        """
        Recognize Iraqi dialect patterns in content.
        
        Args:
            content: Content to analyze for Iraqi dialect
            
        Returns:
            Iraqi dialect recognition results
        """
        dialect_matches = []
        total_confidence = 0.0
        
        # Check for Iraqi dialect patterns
        for pattern, confidence in self.iraqi_dialect_patterns.items():
            if pattern in content:
                match_count = content.count(pattern)
                match_info = {
                    'pattern': pattern,
                    'confidence': confidence,
                    'match_count': match_count,
                    'positions': [m.start() for m in re.finditer(re.escape(pattern), content)]
                }
                dialect_matches.append(match_info)
                total_confidence += confidence * match_count
        
        # Calculate overall dialect confidence
        if dialect_matches:
            # Normalize confidence by content length and pattern strength
            content_words = len(content.split())
            normalized_confidence = min(1.0, total_confidence / max(1, content_words * 0.1))
        else:
            normalized_confidence = 0.0
        
        # Determine dialect classification
        if normalized_confidence >= self.iraqi_dialect_confidence_threshold:
            detected_dialect = 'iraqi_arabic'
        elif normalized_confidence >= 0.3:
            detected_dialect = 'possible_iraqi'
        elif len([m for m in dialect_matches if m['confidence'] > 0.8]) > 0:
            detected_dialect = 'iraqi_influenced'
        else:
            detected_dialect = 'standard_arabic'
        
        return {
            'detected_dialect': detected_dialect,
            'confidence': normalized_confidence,
            'pattern_matches': dialect_matches,
            'total_matches': len(dialect_matches),
            'strongest_patterns': sorted(
                dialect_matches, 
                key=lambda x: x['confidence'] * x['match_count'], 
                reverse=True
            )[:5]
        }

    async def _analyze_mixed_content(self, content: str) -> Dict[str, any]:
        """
        Analyze mixed Arabic-English content.
        
        Args:
            content: Content to analyze
            
        Returns:
            Mixed content analysis results
        """
        # Language distribution
        arabic_pattern = r'[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]'
        english_pattern = r'[a-zA-Z]'
        
        arabic_chars = len(re.findall(arabic_pattern, content))
        english_chars = len(re.findall(english_pattern, content))
        total_chars = arabic_chars + english_chars
        
        if total_chars == 0:
            return {
                'is_mixed_content': False,
                'arabic_percentage': 0.0,
                'english_percentage': 0.0,
                'mixing_complexity': 'none'
            }
        
        arabic_percentage = arabic_chars / total_chars
        english_percentage = english_chars / total_chars
        
        # Analyze mixing patterns
        is_mixed = min(arabic_percentage, english_percentage) >= self.mixed_content_threshold
        
        # Complexity analysis
        if not is_mixed:
            mixing_complexity = 'none'
        elif abs(arabic_percentage - english_percentage) < 0.2:  # Nearly equal
            mixing_complexity = 'high'
        elif min(arabic_percentage, english_percentage) > 0.3:  # Substantial mixing
            mixing_complexity = 'medium'
        else:  # Light mixing
            mixing_complexity = 'low'
        
        # Find code-switching points
        words = content.split()
        switching_points = []
        
        for i in range(len(words) - 1):
            current_has_arabic = bool(re.search(arabic_pattern, words[i]))
            next_has_arabic = bool(re.search(arabic_pattern, words[i + 1]))
            
            if current_has_arabic != next_has_arabic:
                switching_points.append({
                    'position': i,
                    'from_language': 'arabic' if current_has_arabic else 'english',
                    'to_language': 'arabic' if next_has_arabic else 'english'
                })
        
        return {
            'is_mixed_content': is_mixed,
            'arabic_percentage': arabic_percentage,
            'english_percentage': english_percentage,
            'mixing_complexity': mixing_complexity,
            'switching_points': switching_points,
            'switching_frequency': len(switching_points) / max(1, len(words))
        }

    async def _analyze_rtl_formatting_needs(self, content: str, arabic_analysis: Dict) -> Dict[str, any]:
        """
        Analyze RTL formatting requirements.
        
        Args:
            content: Content to analyze
            arabic_analysis: Previous Arabic analysis results
            
        Returns:
            RTL formatting analysis
        """
        formatting_needed = False
        recommendations = []
        
        # Check if RTL formatting is needed
        if arabic_analysis['has_rtl_content']:
            formatting_needed = True
            
            # Specific formatting recommendations
            if arabic_analysis['arabic_percentage'] > 0.8:
                recommendations.append('apply_full_rtl_formatting')
            elif arabic_analysis['arabic_percentage'] > 0.3:
                recommendations.append('apply_mixed_content_formatting')
            else:
                recommendations.append('apply_inline_rtl_formatting')
            
            # Check for directional markers
            has_existing_markers = any(marker in content for marker in ['\u202B', '\u202E', '\u202A', '\u202C'])
            
            if not has_existing_markers:
                recommendations.append('add_directional_markers')
            
            # Typography recommendations
            if arabic_analysis['predominant_direction'] == 'rtl':
                recommendations.append('set_rtl_text_direction')
                recommendations.append('align_text_right')
            
        return {
            'formatting_needed': formatting_needed,
            'recommendations': recommendations,
            'predominant_direction': arabic_analysis['predominant_direction'],
            'requires_bidi_support': arabic_analysis['has_rtl_content'] and arabic_analysis['arabic_percentage'] < 0.9
        }

    async def _analyze_typography_needs(self, content: str) -> Dict[str, any]:
        """
        Analyze Arabic typography enhancement needs.
        
        Args:
            content: Content to analyze
            
        Returns:
            Typography analysis results
        """
        enhancements = []
        
        # Check for Arabic punctuation
        latin_punctuation = ['.', ',', ';', '?', '!', '%']
        arabic_punctuation = ['؟', '،', '؛', '٪']
        
        has_latin_punct = any(punct in content for punct in latin_punctuation)
        has_arabic_punct = any(punct in content for punct in arabic_punctuation)
        
        if has_latin_punct and not has_arabic_punct:
            enhancements.append('convert_punctuation_to_arabic')
        
        # Check for numeric formatting
        if re.search(r'\d', content):
            enhancements.append('consider_arabic_indic_digits')
        
        # Font recommendations
        arabic_char_count = len(re.findall(r'[\u0600-\u06FF]', content))
        if arabic_char_count > 0:
            enhancements.append('use_arabic_font_family')
        
        return {
            'enhancements_needed': enhancements,
            'has_mixed_punctuation': has_latin_punct and has_arabic_punct,
            'punctuation_conversion_needed': has_latin_punct and not has_arabic_punct,
            'font_optimization_needed': arabic_char_count > 10
        }

    def _apply_rtl_formatting(self, text: str) -> str:
        """
        Apply RTL formatting to Arabic text.
        
        Args:
            text: Text to format
            
        Returns:
            RTL formatted text
        """
        # Apply RTL embedding markers
        rtl_marker = self.arabic_typography_rules['rtl_direction']
        pop_marker = self.arabic_typography_rules['pop_directional']
        
        return f"{rtl_marker}{text}{pop_marker}"

    def _generate_cache_key(self, content: str, content_type: str) -> str:
        """
        Generate cache key for Arabic content.
        
        Args:
            content: Content to cache
            content_type: Type of content
            
        Returns:
            Cache key string
        """
        import hashlib
        
        # Use content hash + type for cache key
        content_hash = hashlib.md5(content.encode('utf-8')).hexdigest()[:12]
        return f"{content_type}_{content_hash}_{len(content)}"

    async def _extract_page_text_content(self, url: str, event) -> str:
        """
        Extract text content from page.
        
        Args:
            url: Page URL
            event: Navigation event
            
        Returns:
            Extracted text content
        """
        # In real implementation, would extract actual page text content
        # For now, simulate based on available event data
        
        content_parts = []
        
        # Add page title
        title = getattr(event, 'title', '')
        if title:
            content_parts.append(title)
        
        # Add meta description
        description = getattr(event, 'description', '')
        if description:
            content_parts.append(description)
        
        # Simulate content based on URL
        if self.is_iraqi_government_url(url):
            content_parts.append('محتوى حكومي عراقي')  # Iraqi government content
        
        return ' '.join(content_parts)

    def _extract_changed_text_content(self, event) -> str:
        """
        Extract text content from DOM change event.
        
        Args:
            event: DOM change event
            
        Returns:
            Changed text content
        """
        # Extract text from various event attributes
        content_parts = []
        
        for attr in ['text', 'added_text', 'modified_text', 'element_text', 'innerHTML']:
            if hasattr(event, attr):
                text = getattr(event, attr, '')
                if text:
                    content_parts.append(text)
        
        return ' '.join(content_parts)

    async def _cleanup_performance_data(self) -> None:
        """Clean up old performance tracking data."""
        current_time = time.time()
        retention_seconds = 3600  # Keep 1 hour of data
        
        # Clean performance history
        self._processing_performance = [
            entry for entry in self._processing_performance
            if current_time - entry.get('timestamp', 0) < retention_seconds
        ]
        
        # Clean cache (keep 100 most recent entries)
        if len(self._arabic_content_cache) > 100:
            # Keep most recently used entries
            sorted_cache = sorted(
                self._arabic_content_cache.items(),
                key=lambda x: x[1].get('processing_timestamp', 0),
                reverse=True
            )
            self._arabic_content_cache = dict(sorted_cache[:100])

    def get_arabic_processing_summary(self) -> Dict[str, any]:
        """
        Get comprehensive Arabic processing summary.
        
        Returns:
            Processing summary dictionary
        """
        current_time = time.time()
        
        return {
            'timestamp': current_time,
            'total_processed': len(self._processing_performance),
            'cache_size': len(self._arabic_content_cache),
            'dialect_statistics': dict(self._dialect_recognition_stats),
            'recent_performance': {
                'average_processing_time_ms': (
                    sum(entry['processing_time_ms'] for entry in self._processing_performance[-50:]) /
                    max(1, len(self._processing_performance[-50:]))
                ),
                'total_recent_processed': len(self._processing_performance[-50:])
            },
            'configuration': {
                'arabic_rtl_processing_enabled': self.arabic_rtl_processing_enabled,
                'iraqi_dialect_recognition_enabled': self.iraqi_dialect_recognition_enabled,
                'mixed_content_optimization': self.mixed_content_optimization,
                'arabic_typography_enhancement': self.arabic_typography_enhancement,
                'enable_caching': self.enable_caching
            },
            'thresholds': {
                'arabic_content_threshold': self.arabic_content_threshold,
                'iraqi_dialect_confidence_threshold': self.iraqi_dialect_confidence_threshold,
                'mixed_content_threshold': self.mixed_content_threshold
            }
        }