"""
Iraqi Podcast Generator - Multi-modal audio content creation

Generates educational podcasts in Arabic with Iraqi dialect support,
Islamic compliance validation, and cultural context preservation.
"""

from typing import Dict, List, Optional, Any, Union
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
import json
import asyncio
from pathlib import Path
import tempfile
import subprocess

from pydantic import BaseModel, Field


class PodcastType(Enum):
    """Types of podcasts for Iraqi context"""
    EDUCATIONAL = "educational"
    NEWS_SUMMARY = "news_summary"
    RESEARCH_OVERVIEW = "research_overview" 
    LEGAL_BRIEFING = "legal_briefing"
    MEDICAL_EDUCATION = "medical_education"
    BUSINESS_INSIGHTS = "business_insights"
    CULTURAL_DISCUSSION = "cultural_discussion"
    RELIGIOUS_GUIDANCE = "religious_guidance"
    INTERVIEW = "interview"
    DEBATE = "debate"


class AudioFormat(Enum):
    """Supported audio formats"""
    MP3 = "mp3"
    WAV = "wav"
    AAC = "aac"
    M4A = "m4a"


class VoiceStyle(Enum):
    """Arabic voice styles for different contexts"""
    FORMAL_ARABIC = "formal_arabic"
    IRAQI_DIALECT = "iraqi_dialect"
    EDUCATIONAL = "educational"
    NEWS_PRESENTER = "news_presenter"
    CONVERSATIONAL = "conversational"
    AUTHORITATIVE = "authoritative"
    FRIENDLY = "friendly"
    PROFESSIONAL = "professional"


@dataclass
class PodcastScript:
    """Represents a podcast script with Iraqi cultural context"""
    
    # Script identification
    script_id: str
    title: str
    description: str
    podcast_type: PodcastType
    
    # Content structure
    introduction: str
    main_content: List[str]
    conclusion: str
    segments: List[Dict[str, str]] = field(default_factory=list)
    
    # Iraqi cultural context
    language: str = "arabic"
    dialect: str = "iraqi"
    cultural_context: str = "iraqi"
    islamic_compliance: bool = True
    
    # Audio specifications
    voice_style: VoiceStyle = VoiceStyle.FORMAL_ARABIC
    duration_minutes: Optional[int] = None
    target_audience: str = "general"
    
    # Metadata
    author: Optional[str] = None
    organization: Optional[str] = None
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    
    # Validation
    validated: bool = False
    validation_errors: List[str] = field(default_factory=list)


@dataclass
class AudioSegment:
    """Represents an audio segment with timing"""
    
    segment_id: str
    text: str
    voice_style: VoiceStyle
    start_time: float = 0.0
    duration: float = 0.0
    audio_file: Optional[str] = None
    
    # Arabic-specific properties
    pronunciation_guide: Optional[Dict[str, str]] = None
    emphasis_words: List[str] = field(default_factory=list)
    pause_after: float = 0.0


class IraqiPodcastGenerator:
    """
    Multi-modal audio content creation for Iraqi context
    
    Generates educational podcasts in Arabic with Iraqi dialect support,
    Islamic compliance validation, and cultural context preservation.
    """
    
    def __init__(
        self,
        tts_api_key: Optional[str] = None,
        output_directory: str = "./podcast_output",
        default_voice: str = "ar-arabic-formal",
        quality: str = "high"
    ):
        self.tts_api_key = tts_api_key
        self.output_directory = Path(output_directory)
        self.default_voice = default_voice
        self.quality = quality
        
        # Initialize storage
        self.scripts: Dict[str, PodcastScript] = {}
        self.audio_segments: Dict[str, List[AudioSegment]] = {}
        self.generated_podcasts: Dict[str, Dict[str, Any]] = {}
        
        # Cultural validators
        self.islamic_compliance_checker = None
        self.cultural_validator = None
        
        # Create output directory
        self.output_directory.mkdir(parents=True, exist_ok=True)
    
    async def create_educational_podcast(
        self,
        topic: str,
        content: str,
        target_audience: str = "university_students",
        duration_minutes: int = 15,
        include_examples: bool = True
    ) -> str:
        """Create educational podcast in Arabic"""
        
        script_id = f"edu_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Generate script structure
        script = await self._generate_educational_script(
            script_id=script_id,
            topic=topic,
            content=content,
            target_audience=target_audience,
            duration_minutes=duration_minutes,
            include_examples=include_examples
        )
        
        # Validate script
        validation_result = await self._validate_script(script)
        if not validation_result["valid"]:
            script.validation_errors = validation_result["errors"]
            return script_id
        
        # Store script
        self.scripts[script_id] = script
        
        return script_id
    
    async def create_research_overview_podcast(
        self,
        research_data: Dict[str, Any],
        academic_level: str = "graduate",
        include_methodology: bool = True,
        duration_minutes: int = 20
    ) -> str:
        """Create research overview podcast"""
        
        script_id = f"research_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Generate research script
        script = await self._generate_research_script(
            script_id=script_id,
            research_data=research_data,
            academic_level=academic_level,
            include_methodology=include_methodology,
            duration_minutes=duration_minutes
        )
        
        # Validate and store
        validation_result = await self._validate_script(script)
        if validation_result["valid"]:
            script.validated = True
        else:
            script.validation_errors = validation_result["errors"]
        
        self.scripts[script_id] = script
        return script_id
    
    async def create_legal_briefing_podcast(
        self,
        legal_topic: str,
        legal_framework: str,
        case_studies: List[Dict[str, Any]] = None,
        duration_minutes: int = 25
    ) -> str:
        """Create legal briefing podcast with Iraqi law context"""
        
        script_id = f"legal_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Generate legal script
        script = await self._generate_legal_script(
            script_id=script_id,
            legal_topic=legal_topic,
            legal_framework=legal_framework,
            case_studies=case_studies or [],
            duration_minutes=duration_minutes
        )
        
        # Extra validation for legal content
        legal_validation = await self._validate_legal_content(script)
        if not legal_validation["compliant"]:
            script.validation_errors.extend(legal_validation["violations"])
        
        self.scripts[script_id] = script
        return script_id
    
    async def generate_audio(
        self,
        script_id: str,
        voice_style: VoiceStyle = VoiceStyle.FORMAL_ARABIC,
        audio_format: AudioFormat = AudioFormat.MP3,
        include_music: bool = True,
        background_volume: float = 0.1
    ) -> Dict[str, Any]:
        """Generate audio from script"""
        
        if script_id not in self.scripts:
            return {"success": False, "error": "Script not found"}
        
        script = self.scripts[script_id]
        
        try:
            # Create audio segments
            segments = await self._create_audio_segments(script, voice_style)
            
            # Generate TTS for each segment
            audio_files = []
            total_duration = 0.0
            
            for segment in segments:
                audio_file = await self._generate_tts_audio(segment)
                if audio_file:
                    segment.audio_file = audio_file
                    audio_files.append(audio_file)
                    total_duration += segment.duration
            
            # Combine audio segments
            final_audio = await self._combine_audio_segments(
                segments, 
                include_music=include_music,
                background_volume=background_volume
            )
            
            # Store generation result
            result = {
                "success": True,
                "script_id": script_id,
                "audio_file": final_audio,
                "duration": total_duration,
                "segments": len(segments),
                "format": audio_format.value,
                "generated_at": datetime.now(timezone.utc).isoformat()
            }
            
            self.generated_podcasts[script_id] = result
            return result
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Audio generation failed: {str(e)}"
            }
    
    async def _generate_educational_script(
        self,
        script_id: str,
        topic: str,
        content: str,
        target_audience: str,
        duration_minutes: int,
        include_examples: bool
    ) -> PodcastScript:
        """Generate educational podcast script"""
        
        # Create script structure
        introduction = await self._create_introduction(
            topic, target_audience, "تعليمي"
        )
        
        # Process main content
        main_segments = await self._process_educational_content(
            content, duration_minutes, include_examples
        )
        
        # Create conclusion
        conclusion = await self._create_conclusion(topic, "educational")
        
        # Create script object
        script = PodcastScript(
            script_id=script_id,
            title=f"محاضرة تعليمية: {topic}",
            description=f"محاضرة تعليمية باللغة العربية حول {topic}",
            podcast_type=PodcastType.EDUCATIONAL,
            introduction=introduction,
            main_content=main_segments,
            conclusion=conclusion,
            language="arabic",
            dialect="iraqi",
            voice_style=VoiceStyle.EDUCATIONAL,
            duration_minutes=duration_minutes,
            target_audience=target_audience
        )
        
        return script
    
    async def _generate_research_script(
        self,
        script_id: str,
        research_data: Dict[str, Any],
        academic_level: str,
        include_methodology: bool,
        duration_minutes: int
    ) -> PodcastScript:
        """Generate research overview script"""
        
        title = research_data.get("title", "بحث أكاديمي")
        
        # Create introduction
        introduction = f"""
        مرحباً بكم في هذا العرض البحثي باللغة العربية.
        سنقوم اليوم بمراجعة البحث المعنون: {title}
        هذا العرض مخصص للطلاب والباحثين في المستوى {academic_level}
        """
        
        # Process research content
        main_segments = []
        
        # Abstract/Summary
        if "abstract" in research_data:
            main_segments.append(f"ملخص البحث: {research_data['abstract']}")
        
        # Methodology (if requested)
        if include_methodology and "methodology" in research_data:
            main_segments.append(f"منهجية البحث: {research_data['methodology']}")
        
        # Key findings
        if "findings" in research_data:
            main_segments.append(f"النتائج الرئيسية: {research_data['findings']}")
        
        # Conclusions
        if "conclusions" in research_data:
            main_segments.append(f"الخلاصة: {research_data['conclusions']}")
        
        conclusion = """
        في الختام، نأمل أن يكون هذا العرض قد قدم لكم فهماً واضحاً للبحث.
        شكراً لاستماعكم وبالتوفيق في دراساتكم.
        """
        
        script = PodcastScript(
            script_id=script_id,
            title=f"عرض بحثي: {title}",
            description=f"عرض أكاديمي للبحث: {title}",
            podcast_type=PodcastType.RESEARCH_OVERVIEW,
            introduction=introduction,
            main_content=main_segments,
            conclusion=conclusion,
            language="arabic",
            voice_style=VoiceStyle.EDUCATIONAL,
            duration_minutes=duration_minutes,
            target_audience=academic_level
        )
        
        return script
    
    async def _generate_legal_script(
        self,
        script_id: str,
        legal_topic: str,
        legal_framework: str,
        case_studies: List[Dict[str, Any]],
        duration_minutes: int
    ) -> PodcastScript:
        """Generate legal briefing script"""
        
        introduction = f"""
        أهلاً وسهلاً بكم في هذه النشرة القانونية.
        سنتناول اليوم موضوع {legal_topic} في إطار {legal_framework}
        هذا العرض مخصص للمختصين في القانون والطلاب الجامعيين.
        """
        
        main_segments = []
        
        # Legal framework overview
        main_segments.append(f"الإطار القانوني: {legal_framework}")
        
        # Main topic discussion
        main_segments.append(f"تفصيل الموضوع: {legal_topic}")
        
        # Case studies
        if case_studies:
            main_segments.append("دراسات الحالة:")
            for i, case in enumerate(case_studies, 1):
                case_text = f"الحالة {i}: {case.get('description', 'غير متوفر')}"
                main_segments.append(case_text)
        
        conclusion = f"""
        في الختام، تناولنا موضوع {legal_topic} من الناحية القانونية.
        نذكر أن هذا العرض للأغراض التعليمية فقط ولا يشكل استشارة قانونية.
        شكراً لاستماعكم.
        """
        
        script = PodcastScript(
            script_id=script_id,
            title=f"نشرة قانونية: {legal_topic}",
            description=f"عرض قانوني حول {legal_topic}",
            podcast_type=PodcastType.LEGAL_BRIEFING,
            introduction=introduction,
            main_content=main_segments,
            conclusion=conclusion,
            language="arabic",
            voice_style=VoiceStyle.PROFESSIONAL,
            duration_minutes=duration_minutes,
            target_audience="legal_professionals"
        )
        
        return script
    
    async def _validate_script(self, script: PodcastScript) -> Dict[str, Any]:
        """Validate podcast script for cultural and Islamic compliance"""
        
        errors = []
        
        # Basic validation
        if not script.title.strip():
            errors.append("عنوان البودكاست مطلوب")
        
        if not script.introduction.strip():
            errors.append("مقدمة البودكاست مطلوبة")
        
        if not script.main_content:
            errors.append("محتوى البودكاست مطلوب")
        
        # Islamic compliance validation
        if script.islamic_compliance:
            islamic_validation = await self._validate_islamic_content(script)
            if not islamic_validation:
                errors.append("المحتوى لا يتوافق مع التعاليم الإسلامية")
        
        # Cultural validation
        cultural_validation = await self._validate_cultural_content(script)
        if not cultural_validation:
            errors.append("المحتوى لا يتوافق مع الثقافة العراقية")
        
        # Duration validation
        if script.duration_minutes and script.duration_minutes > 60:
            errors.append("مدة البودكاست تتجاوز الحد المسموح (60 دقيقة)")
        
        return {
            "valid": len(errors) == 0,
            "errors": errors
        }
    
    async def _validate_legal_content(self, script: PodcastScript) -> Dict[str, Any]:
        """Validate legal content for accuracy and compliance"""
        
        violations = []
        
        # Check for legal disclaimers
        disclaimer_found = any(
            "للأغراض التعليمية" in segment or "لا يشكل استشارة قانونية" in segment
            for segment in script.main_content + [script.introduction, script.conclusion]
        )
        
        if not disclaimer_found:
            violations.append("يجب تضمين إخلاء مسؤولية قانونية")
        
        # Check for appropriate legal language
        if script.voice_style not in [VoiceStyle.PROFESSIONAL, VoiceStyle.FORMAL_ARABIC]:
            violations.append("أسلوب الصوت غير مناسب للمحتوى القانوني")
        
        return {
            "compliant": len(violations) == 0,
            "violations": violations
        }
    
    async def _create_audio_segments(
        self,
        script: PodcastScript,
        voice_style: VoiceStyle
    ) -> List[AudioSegment]:
        """Create audio segments from script"""
        
        segments = []
        segment_counter = 0
        
        # Introduction segment
        intro_segment = AudioSegment(
            segment_id=f"{script.script_id}_intro",
            text=script.introduction,
            voice_style=voice_style,
            pause_after=1.0
        )
        segments.append(intro_segment)
        segment_counter += 1
        
        # Main content segments
        for content in script.main_content:
            segment = AudioSegment(
                segment_id=f"{script.script_id}_segment_{segment_counter}",
                text=content,
                voice_style=voice_style,
                pause_after=0.5
            )
            segments.append(segment)
            segment_counter += 1
        
        # Conclusion segment
        conclusion_segment = AudioSegment(
            segment_id=f"{script.script_id}_conclusion",
            text=script.conclusion,
            voice_style=voice_style,
            pause_after=2.0
        )
        segments.append(conclusion_segment)
        
        return segments
    
    async def _generate_tts_audio(self, segment: AudioSegment) -> Optional[str]:
        """Generate TTS audio for segment"""
        
        try:
            # Create temporary file
            temp_file = tempfile.NamedTemporaryFile(suffix='.mp3', delete=False)
            output_file = temp_file.name
            temp_file.close()
            
            # TTS generation (placeholder - would use actual TTS service)
            # For demo purposes, create a silent audio file
            duration = max(len(segment.text) * 0.1, 1.0)  # Estimate duration
            segment.duration = duration
            
            # Generate silent audio as placeholder
            subprocess.run([
                'ffmpeg', '-f', 'lavfi', '-i', f'anullsrc=duration={duration}',
                '-y', output_file
            ], capture_output=True)
            
            return output_file
            
        except Exception as e:
            print(f"TTS generation failed for segment {segment.segment_id}: {str(e)}")
            return None
    
    async def _combine_audio_segments(
        self,
        segments: List[AudioSegment],
        include_music: bool = True,
        background_volume: float = 0.1
    ) -> Optional[str]:
        """Combine audio segments into final podcast"""
        
        try:
            # Create output file
            output_file = self.output_directory / f"podcast_{datetime.now().strftime('%Y%m%d_%H%M%S')}.mp3"
            
            # Combine audio files
            input_files = []
            for segment in segments:
                if segment.audio_file:
                    input_files.append(segment.audio_file)
            
            if not input_files:
                return None
            
            # Create ffmpeg command to concatenate files
            concat_file = tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False)
            for audio_file in input_files:
                concat_file.write(f"file '{audio_file}'\n")
            concat_file.close()
            
            # Concatenate audio
            subprocess.run([
                'ffmpeg', '-f', 'concat', '-safe', '0', '-i', concat_file.name,
                '-c', 'copy', '-y', str(output_file)
            ], capture_output=True)
            
            # Cleanup temporary files
            Path(concat_file.name).unlink()
            for audio_file in input_files:
                Path(audio_file).unlink()
            
            return str(output_file)
            
        except Exception as e:
            print(f"Audio combination failed: {str(e)}")
            return None
    
    async def _create_introduction(self, topic: str, audience: str, content_type: str) -> str:
        """Create Arabic introduction for podcast"""
        
        greeting = "بسم الله الرحمن الرحيم، أهلاً وسهلاً بكم"
        
        if content_type == "تعليمي":
            return f"""
            {greeting} في هذا البرنامج التعليمي.
            سنتناول اليوم موضوع {topic} المخصص لـ {audience}.
            نسأل الله أن ينفعكم بما ستسمعون.
            """
        else:
            return f"""
            {greeting} في هذا البرنامج.
            موضوعنا اليوم هو {topic}.
            نتمنى لكم استماعاً مفيداً.
            """
    
    async def _create_conclusion(self, topic: str, content_type: str) -> str:
        """Create Arabic conclusion for podcast"""
        
        return f"""
        في الختام، نكون قد انتهينا من عرض موضوع {topic}.
        نشكركم على حسن الاستماع والمتابعة.
        والسلام عليكم ورحمة الله وبركاته.
        """
    
    async def _process_educational_content(
        self,
        content: str,
        duration_minutes: int,
        include_examples: bool
    ) -> List[str]:
        """Process educational content into segments"""
        
        segments = []
        
        # Split content into logical sections
        content_sections = content.split('\n\n')
        
        for section in content_sections:
            if section.strip():
                segments.append(section.strip())
        
        # Add examples if requested
        if include_examples:
            segments.append("والآن دعونا نتناول بعض الأمثلة التوضيحية...")
        
        return segments
    
    async def _validate_islamic_content(self, script: PodcastScript) -> bool:
        """Validate content for Islamic compliance"""
        # Implementation would check Islamic guidelines
        return True  # Placeholder
    
    async def _validate_cultural_content(self, script: PodcastScript) -> bool:
        """Validate content for cultural appropriateness"""
        # Implementation would check cultural guidelines
        return True  # Placeholder
    
    async def get_script_status(self, script_id: str) -> Dict[str, Any]:
        """Get status of podcast script"""
        
        if script_id not in self.scripts:
            return {"error": "Script not found"}
        
        script = self.scripts[script_id]
        
        return {
            "script_id": script_id,
            "title": script.title,
            "type": script.podcast_type.value,
            "language": script.language,
            "duration_minutes": script.duration_minutes,
            "validated": script.validated,
            "validation_errors": script.validation_errors,
            "created_at": script.created_at.isoformat(),
            "has_audio": script_id in self.generated_podcasts
        }