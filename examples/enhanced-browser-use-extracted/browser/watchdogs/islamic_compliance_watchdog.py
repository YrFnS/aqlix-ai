"""Islamic Compliance Watchdog - Enhanced browser-use watchdog for Islamic content validation.

Monitors and validates content for Islamic compliance, Halal principles, and cultural
sensitivity according to Iraqi Islamic standards and Sharia guidelines.
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
    TextContentEvent,
    ImageLoadEvent,
    MediaPlaybackEvent,
    FormSubmissionEvent
)

class IslamicComplianceLevel(str, Enum):
    """Islamic compliance levels for content validation."""
    STRICT = "strict"        # Strictly compliant with all Islamic principles
    MODERATE = "moderate"    # Generally compliant with key Islamic values
    PERMISSIBLE = "permissible"  # Islamically permissible but not ideal
    QUESTIONABLE = "questionable"  # May conflict with some Islamic principles
    PROHIBITED = "prohibited"     # Clearly prohibited content

class ContentType(str, Enum):
    """Types of content for Islamic validation."""
    TEXT = "text"
    IMAGE = "image"
    VIDEO = "video"
    AUDIO = "audio"
    FORM = "form"
    ADVERTISEMENT = "advertisement"
    SOCIAL_MEDIA = "social_media"

class IslamicComplianceWatchdog(BaseWatchdog):
    """Enhanced watchdog for Islamic content compliance monitoring.
    
    Features:
    - Text content validation for Islamic appropriateness
    - Image content screening for Islamic guidelines
    - Media content monitoring (audio/video)
    - Form submission validation
    - Advertisement content filtering
    - Prayer time awareness and scheduling
    - Halal business practices verification
    - Cultural sensitivity monitoring
    """
    
    # Islamic Compliance Configuration
    compliance_level: IslamicComplianceLevel = Field(default=IslamicComplianceLevel.MODERATE)
    enable_strict_mode: bool = Field(default=False)
    enable_prayer_time_awareness: bool = Field(default=True)
    enable_halal_verification: bool = Field(default=True)
    enable_cultural_sensitivity: bool = Field(default=True)
    
    # Content Validation Patterns
    prohibited_text_patterns: List[str] = Field(default_factory=lambda: [
        r'\b(?:alcohol|wine|beer|vodka|whiskey)\b',  # Alcohol references
        r'\b(?:pork|ham|bacon|pepperoni)\b',         # Pork references
        r'\b(?:gambling|casino|lottery|bet)\b',      # Gambling references
        r'\b(?:interest|usury|riba)\b',              # Interest/Usury references
        r'\b(?:nude|naked|porn|adult)\b',            # Inappropriate content
    ])
    
    questionable_text_patterns: List[str] = Field(default_factory=lambda: [
        r'\b(?:dating|girlfriend|boyfriend)\b',      # Dating references
        r'\b(?:music|concert|nightclub)\b',          # Entertainment (opinion-based)
        r'\b(?:bank|loan|mortgage)\b',               # Banking (context-dependent)
    ])
    
    # Islamic Positive Indicators
    positive_islamic_patterns: List[str] = Field(default_factory=lambda: [
        r'\b(?:bismillah|alhamdulillah|subhanallah|mashaallah|inshallah)\b',
        r'\b(?:salah|prayer|mosque|quran|hadith)\b',
        r'\b(?:halal|tayyib|islamic|sharia)\b',
        r'\b(?:ramadan|hajj|umrah|zakat|charity)\b',
        r'\b(?:peace|justice|mercy|compassion)\b',
    ])
    
    # Prayer Times (Example for Baghdad)
    prayer_times: Dict[str, str] = Field(default_factory=lambda: {
        'fajr': '05:30',
        'dhuhr': '12:30',
        'asr': '15:45',
        'maghrib': '18:30',
        'isha': '19:45'
    })
    
    # Halal Business Categories
    halal_business_categories: Set[str] = Field(default_factory=lambda: {
        'food_halal', 'islamic_finance', 'islamic_education',
        'healthcare', 'technology', 'construction', 'textiles',
        'automotive', 'real_estate', 'travel_halal', 'books_islamic'
    })
    
    # Content Analysis State
    content_violations: List[Dict] = Field(default_factory=list)
    compliance_scores: Dict[str, float] = Field(default_factory=dict)
    prayer_time_notifications: List[Dict] = Field(default_factory=list)
    halal_verification_results: Dict[str, bool] = Field(default_factory=dict)
    
    @validator('compliance_level')
    def validate_compliance_level(cls, v):
        if not isinstance(v, IslamicComplianceLevel):
            v = IslamicComplianceLevel(v)
        return v
    
    async def on_DomContentLoadedEvent(self, event: DomContentLoadedEvent) -> None:
        """Handle DOM content loading for Islamic compliance validation."""
        try:
            # Extract URL and basic page info
            url = getattr(event, 'url', '')
            timestamp = datetime.now()
            
            # Check if prayer time notifications needed
            if self.enable_prayer_time_awareness:
                await self._check_prayer_time_notifications(timestamp, url)
            
            # Schedule comprehensive content validation
            await self._validate_page_islamic_compliance(url, timestamp)
            
        except Exception as e:
            await self.emit_error(f"Islamic compliance validation failed: {str(e)}")
    
    async def on_TextContentEvent(self, event: TextContentEvent) -> None:
        """Handle text content for Islamic compliance validation."""
        try:
            text_content = getattr(event, 'content', '')
            url = getattr(event, 'url', '')
            element_info = getattr(event, 'element_info', {})
            
            # Validate text content
            compliance_result = await self._validate_text_content(
                text_content, url, element_info
            )
            
            # Handle violations
            if compliance_result['violations']:
                await self.emit_islamic_content_violation(
                    url, ContentType.TEXT, compliance_result
                )
            
            # Track positive Islamic content
            if compliance_result['positive_score'] > 0.7:
                await self.emit_islamic_positive_content(
                    url, ContentType.TEXT, compliance_result['positive_score']
                )
                
        except Exception as e:
            await self.emit_error(f"Text content Islamic validation failed: {str(e)}")
    
    async def on_ImageLoadEvent(self, event: ImageLoadEvent) -> None:
        """Handle image loading for Islamic compliance validation."""
        try:
            image_url = getattr(event, 'src', '')
            alt_text = getattr(event, 'alt', '')
            page_url = getattr(event, 'page_url', '')
            
            # Validate image content (basic validation based on alt text and URL)
            compliance_result = await self._validate_image_content(
                image_url, alt_text, page_url
            )
            
            if compliance_result['compliance_level'] in [
                IslamicComplianceLevel.QUESTIONABLE,
                IslamicComplianceLevel.PROHIBITED
            ]:
                await self.emit_islamic_content_violation(
                    page_url, ContentType.IMAGE, compliance_result
                )
                
        except Exception as e:
            await self.emit_error(f"Image Islamic validation failed: {str(e)}")
    
    async def on_MediaPlaybackEvent(self, event: MediaPlaybackEvent) -> None:
        """Handle media playback for Islamic compliance validation."""
        try:
            media_url = getattr(event, 'src', '')
            media_type = getattr(event, 'type', 'unknown')
            page_url = getattr(event, 'page_url', '')
            
            # Validate media content
            compliance_result = await self._validate_media_content(
                media_url, media_type, page_url
            )
            
            # Handle music/video content based on compliance level
            if self.compliance_level == IslamicComplianceLevel.STRICT:
                if media_type == 'audio' and not self._is_permissible_audio(media_url):
                    await self.emit_islamic_content_violation(
                        page_url, ContentType.AUDIO, {
                            'violation_type': 'strict_audio_restriction',
                            'media_url': media_url,
                            'reason': 'Audio content in strict Islamic mode'
                        }
                    )
                    
        except Exception as e:
            await self.emit_error(f"Media Islamic validation failed: {str(e)}")
    
    async def on_FormSubmissionEvent(self, event: FormSubmissionEvent) -> None:
        """Handle form submissions for Islamic compliance validation."""
        try:
            form_data = getattr(event, 'data', {})
            form_action = getattr(event, 'action', '')
            page_url = getattr(event, 'page_url', '')
            
            # Validate form content and purpose
            compliance_result = await self._validate_form_submission(
                form_data, form_action, page_url
            )
            
            if not compliance_result['is_compliant']:
                await self.emit_islamic_content_violation(
                    page_url, ContentType.FORM, compliance_result
                )
                
        except Exception as e:
            await self.emit_error(f"Form submission Islamic validation failed: {str(e)}")
    
    async def _validate_page_islamic_compliance(self, url: str, timestamp: datetime) -> Dict:
        """Comprehensive Islamic compliance validation for entire page."""
        try:
            compliance_result = {
                'url': url,
                'timestamp': timestamp.isoformat(),
                'overall_score': 0.8,  # Default neutral score
                'violations': [],
                'positive_indicators': [],
                'recommendations': []
            }
            
            # Check URL for obvious violations
            url_lower = url.lower()
            for pattern in self.prohibited_text_patterns:
                if re.search(pattern, url_lower):
                    compliance_result['violations'].append({
                        'type': 'url_violation',
                        'pattern': pattern,
                        'severity': 'high'
                    })
            
            # Check for halal business indicators
            if self.enable_halal_verification:
                halal_score = await self._calculate_halal_business_score(url)
                compliance_result['halal_business_score'] = halal_score
                
                if halal_score > 0.8:
                    compliance_result['positive_indicators'].append({
                        'type': 'halal_business',
                        'score': halal_score
                    })
            
            # Calculate overall compliance score
            base_score = 0.8
            violation_penalty = len(compliance_result['violations']) * 0.1
            positive_bonus = len(compliance_result['positive_indicators']) * 0.1
            
            compliance_result['overall_score'] = max(0.0, min(1.0, 
                base_score - violation_penalty + positive_bonus
            ))
            
            # Store result
            self.compliance_scores[url] = compliance_result['overall_score']
            
            return compliance_result
            
        except Exception as e:
            await self.emit_error(f"Page Islamic compliance validation failed: {str(e)}")
            return {'overall_score': 0.5, 'violations': [], 'error': str(e)}
    
    async def _validate_text_content(self, text: str, url: str, element_info: Dict) -> Dict:
        """Validate text content for Islamic compliance."""
        result = {
            'text_sample': text[:200],  # First 200 characters
            'violations': [],
            'positive_score': 0.0,
            'compliance_level': IslamicComplianceLevel.MODERATE
        }
        
        text_lower = text.lower()
        
        # Check for prohibited content
        for pattern in self.prohibited_text_patterns:
            matches = re.findall(pattern, text_lower, re.IGNORECASE)
            if matches:
                result['violations'].append({
                    'type': 'prohibited_content',
                    'pattern': pattern,
                    'matches': matches[:5],  # Limit matches for privacy
                    'severity': 'high'
                })
                result['compliance_level'] = IslamicComplianceLevel.PROHIBITED
        
        # Check for questionable content
        if result['compliance_level'] != IslamicComplianceLevel.PROHIBITED:
            for pattern in self.questionable_text_patterns:
                matches = re.findall(pattern, text_lower, re.IGNORECASE)
                if matches:
                    result['violations'].append({
                        'type': 'questionable_content',
                        'pattern': pattern,
                        'matches': matches[:3],
                        'severity': 'medium'
                    })
                    if result['compliance_level'] == IslamicComplianceLevel.MODERATE:
                        result['compliance_level'] = IslamicComplianceLevel.QUESTIONABLE
        
        # Check for positive Islamic content
        positive_matches = []
        for pattern in self.positive_islamic_patterns:
            matches = re.findall(pattern, text_lower, re.IGNORECASE)
            positive_matches.extend(matches)
        
        if positive_matches:
            result['positive_score'] = min(1.0, len(positive_matches) * 0.1)
            if result['compliance_level'] in [IslamicComplianceLevel.MODERATE, IslamicComplianceLevel.PERMISSIBLE]:
                result['compliance_level'] = IslamicComplianceLevel.STRICT
        
        return result
    
    async def _validate_image_content(self, image_url: str, alt_text: str, page_url: str) -> Dict:
        """Validate image content for Islamic compliance."""
        result = {
            'image_url': image_url,
            'alt_text': alt_text,
            'compliance_level': IslamicComplianceLevel.MODERATE,
            'violations': []
        }
        
        # Basic validation based on URL and alt text
        combined_text = f"{image_url} {alt_text}".lower()
        
        # Check for inappropriate image indicators
        inappropriate_indicators = [
            r'\b(?:nude|naked|bikini|lingerie)\b',
            r'\b(?:alcohol|wine|beer|bottle)\b',
            r'\b(?:casino|gambling|cards)\b',
            r'\b(?:pork|ham|bacon)\b'
        ]
        
        for pattern in inappropriate_indicators:
            if re.search(pattern, combined_text):
                result['violations'].append({
                    'type': 'inappropriate_image_indicator',
                    'pattern': pattern,
                    'source': 'url_or_alt_text'
                })
                result['compliance_level'] = IslamicComplianceLevel.QUESTIONABLE
        
        return result
    
    async def _validate_media_content(self, media_url: str, media_type: str, page_url: str) -> Dict:
        """Validate media content for Islamic compliance."""
        result = {
            'media_url': media_url,
            'media_type': media_type,
            'compliance_level': IslamicComplianceLevel.MODERATE,
            'violations': []
        }
        
        # Audio content validation
        if media_type == 'audio':
            if self.compliance_level == IslamicComplianceLevel.STRICT:
                if not self._is_permissible_audio(media_url):
                    result['violations'].append({
                        'type': 'audio_restriction',
                        'reason': 'Music content in strict Islamic mode'
                    })
                    result['compliance_level'] = IslamicComplianceLevel.QUESTIONABLE
        
        # Video content validation
        elif media_type == 'video':
            # Check URL for inappropriate content indicators
            if any(term in media_url.lower() for term in ['adult', 'explicit', 'uncensored']):
                result['violations'].append({
                    'type': 'inappropriate_video_indicator',
                    'reason': 'URL contains inappropriate indicators'
                })
                result['compliance_level'] = IslamicComplianceLevel.PROHIBITED
        
        return result
    
    async def _validate_form_submission(self, form_data: Dict, form_action: str, page_url: str) -> Dict:
        """Validate form submission for Islamic compliance."""
        result = {
            'is_compliant': True,
            'violations': [],
            'form_action': form_action
        }
        
        # Check form action URL for compliance
        action_lower = form_action.lower()
        
        # Check for interest-based or gambling-related forms
        prohibited_form_indicators = ['loan', 'interest', 'gambling', 'casino', 'bet']
        for indicator in prohibited_form_indicators:
            if indicator in action_lower:
                result['violations'].append({
                    'type': 'prohibited_form_action',
                    'indicator': indicator,
                    'severity': 'high'
                })
                result['is_compliant'] = False
        
        # Validate form data (basic validation without reading actual content)
        if form_data:
            # Check for potentially inappropriate field names
            inappropriate_fields = ['dating', 'relationship_status', 'alcohol_preference']
            for field_name in form_data.keys():
                if any(term in field_name.lower() for term in inappropriate_fields):
                    result['violations'].append({
                        'type': 'inappropriate_form_field',
                        'field_name': field_name,
                        'severity': 'medium'
                    })
        
        return result
    
    async def _check_prayer_time_notifications(self, current_time: datetime, url: str) -> None:
        """Check if prayer time notifications are needed."""
        if not self.enable_prayer_time_awareness:
            return
        
        current_time_str = current_time.strftime("%H:%M")
        
        # Check if current time is within 5 minutes of any prayer time
        for prayer_name, prayer_time in self.prayer_times.items():
            prayer_datetime = datetime.strptime(prayer_time, "%H:%M").time()
            current_time_obj = current_time.time()
            
            # Calculate time difference (simplified for example)
            prayer_minutes = prayer_datetime.hour * 60 + prayer_datetime.minute
            current_minutes = current_time_obj.hour * 60 + current_time_obj.minute
            
            time_diff = abs(prayer_minutes - current_minutes)
            
            if time_diff <= 5:  # Within 5 minutes
                await self.emit_prayer_time_notification(prayer_name, prayer_time, url)
    
    async def _calculate_halal_business_score(self, url: str) -> float:
        """Calculate halal business compliance score based on URL and indicators."""
        if not self.enable_halal_verification:
            return 0.5
        
        score = 0.5  # Neutral score
        url_lower = url.lower()
        
        # Positive indicators
        halal_indicators = ['halal', 'islamic', 'sharia', 'tayyib', 'muslim']
        for indicator in halal_indicators:
            if indicator in url_lower:
                score += 0.1
        
        # Negative indicators
        haram_indicators = ['alcohol', 'casino', 'gambling', 'interest', 'loan', 'pork']
        for indicator in haram_indicators:
            if indicator in url_lower:
                score -= 0.2
        
        return max(0.0, min(1.0, score))
    
    def _is_permissible_audio(self, audio_url: str) -> bool:
        """Check if audio content is permissible in strict Islamic mode."""
        audio_url_lower = audio_url.lower()
        
        # Permissible audio types
        permissible_indicators = [
            'quran', 'hadith', 'islamic', 'nasheed', 'recitation',
            'lecture', 'sermon', 'education', 'nature', 'ambient'
        ]
        
        return any(indicator in audio_url_lower for indicator in permissible_indicators)
    
    # Event Emission Methods
    async def emit_islamic_content_violation(self, url: str, content_type: ContentType, violation_data: Dict):
        """Emit Islamic content violation event."""
        if self.cultural_validation_enabled:
            from browser_use.agent.events import IslamicContentViolationEvent
            event = IslamicContentViolationEvent(data={
                'url': url,
                'content_type': content_type.value,
                'violation_data': violation_data,
                'compliance_level': self.compliance_level.value,
                'timestamp': datetime.now().isoformat(),
                'severity': 'high' if violation_data.get('compliance_level') == 'prohibited' else 'medium'
            })
            self.event_bus.dispatch(event)
    
    async def emit_islamic_positive_content(self, url: str, content_type: ContentType, positive_score: float):
        """Emit positive Islamic content detection event."""
        if self.cultural_validation_enabled:
            from browser_use.agent.events import IslamicPositiveContentEvent
            event = IslamicPositiveContentEvent(data={
                'url': url,
                'content_type': content_type.value,
                'positive_score': positive_score,
                'timestamp': datetime.now().isoformat()
            })
            self.event_bus.dispatch(event)
    
    async def emit_prayer_time_notification(self, prayer_name: str, prayer_time: str, url: str):
        """Emit prayer time notification event."""
        if self.enable_prayer_time_awareness:
            from browser_use.agent.events import PrayerTimeNotificationEvent
            event = PrayerTimeNotificationEvent(data={
                'prayer_name': prayer_name,
                'prayer_time': prayer_time,
                'current_url': url,
                'timestamp': datetime.now().isoformat()
            })
            self.event_bus.dispatch(event)
            
            # Store notification
            self.prayer_time_notifications.append({
                'prayer_name': prayer_name,
                'prayer_time': prayer_time,
                'url': url,
                'timestamp': datetime.now()
            })
    
    def get_compliance_summary(self) -> Dict:
        """Get summary of Islamic compliance monitoring."""
        total_violations = len(self.content_violations)
        total_pages_checked = len(self.compliance_scores)
        average_compliance_score = (
            sum(self.compliance_scores.values()) / len(self.compliance_scores)
            if self.compliance_scores else 0.0
        )
        
        return {
            'total_violations': total_violations,
            'total_pages_checked': total_pages_checked,
            'average_compliance_score': average_compliance_score,
            'compliance_level': self.compliance_level.value,
            'prayer_notifications_sent': len(self.prayer_time_notifications),
            'halal_businesses_verified': len(self.halal_verification_results)
        }