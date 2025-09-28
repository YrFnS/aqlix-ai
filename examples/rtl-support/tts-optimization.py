"""
Arabic TTS Optimization for Iraqi Dialect
OpenAI TTS-1-HD configuration and enhancement patterns
"""

import openai
import re
import asyncio
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
from enum import Enum
import json
import time
import hashlib
from pathlib import Path


class IraqiDialect(Enum):
    BAGHDAD = "baghdad"
    BASRA = "basra"
    MOSUL = "mosul"
    GENERAL = "general"


class ProfessionalContext(Enum):
    LEGAL = "legal"
    MEDICAL = "medical"
    EDUCATIONAL = "educational"
    BUSINESS = "business"
    CASUAL = "casual"


@dataclass
class VoiceSettings:
    voice: str = "nova"  # Best for Arabic
    speed: float = 0.9  # Slower for better comprehension
    model: str = "tts-1-hd"
    format: str = "mp3"


@dataclass
class OptimizationResult:
    optimized_text: str
    original_text: str
    processing_time: float
    enhancements: List[str]
    dialect: IraqiDialect
    context: ProfessionalContext


class IraqiTTSOptimizer:
    """TTS optimizer specifically for Iraqi Arabic dialects and professional contexts"""

    def __init__(self, openai_api_key: str, cache_dir: str = "./tts_cache"):
        self.client = openai.AsyncOpenAI(api_key=openai_api_key)
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(exist_ok=True)

        # Voice selection based on context and gender preference
        self.voice_recommendations = {
            ProfessionalContext.LEGAL: {
                "primary": "nova",  # Authoritative, clear
                "alternative": "echo",  # Deep, professional
            },
            ProfessionalContext.MEDICAL: {
                "primary": "nova",  # Clear, trustworthy
                "alternative": "alloy",  # Calm, reassuring
            },
            ProfessionalContext.EDUCATIONAL: {
                "primary": "alloy",  # Friendly, engaging
                "alternative": "nova",  # Clear instruction
            },
            ProfessionalContext.BUSINESS: {
                "primary": "echo",  # Professional, confident
                "alternative": "nova",  # Clear communication
            },
            ProfessionalContext.CASUAL: {
                "primary": "alloy",  # Natural, conversational
                "alternative": "shimmer",  # Friendly, approachable
            },
        }

        # Speed optimization by context
        self.speed_settings = {
            ProfessionalContext.LEGAL: 0.85,  # Slower for legal precision
            ProfessionalContext.MEDICAL: 0.9,  # Clear medical communication
            ProfessionalContext.EDUCATIONAL: 0.95,  # Slightly faster for engagement
            ProfessionalContext.BUSINESS: 0.9,  # Professional pace
            ProfessionalContext.CASUAL: 1.0,  # Natural conversation speed
        }

        # Iraqi dialect vocabulary patterns for enhancement
        self.dialect_enhancements = {
            IraqiDialect.BAGHDAD: {
                # Common Baghdad dialect replacements for better TTS
                "شلونك": "شلونك؟",  # Add question mark for better intonation
                "وين": "وين راح",  # Complete phrases sound better
                "شگد": "شگد السعر",  # Context helps pronunciation
                "أكو": "يوجد",  # Standard Arabic for clarity in formal contexts
                "مو": "ليس",  # Standard for professional contexts
                "بيه": "به",  # Standardize for TTS
                "هواية": "كثيراً",  # Better TTS pronunciation
            },
            IraqiDialect.BASRA: {
                "شلونكم": "شلونكم؟",
                "وين": "أين",
                "هوايه": "كثيراً",
                "جان": "كان",
                "گال": "قال",
            },
            IraqiDialect.MOSUL: {
                "شلونكم": "شلونكم؟",
                "وين": "أين",
                "شگد": "كم",
                "مو": "لا",
                "گال": "قال",
            },
        }

        # Professional terminology improvements
        self.professional_enhancements = {
            ProfessionalContext.LEGAL: {
                "محكمة": "المحكمة",
                "قاضي": "القاضي",
                "دعوى": "الدعوى القضائية",
                "عقد": "العقد القانوني",
                "مادة": "المادة القانونية",
            },
            ProfessionalContext.MEDICAL: {
                "طبيب": "الطبيب المختص",
                "مرض": "الحالة المرضية",
                "علاج": "العلاج الطبي",
                "دواء": "الدواء الموصوف",
                "فحص": "الفحص الطبي",
            },
            ProfessionalContext.EDUCATIONAL: {
                "درس": "الدرس التعليمي",
                "امتحان": "الامتحان الدراسي",
                "طالب": "الطالب المتعلم",
                "معلم": "المعلم المختص",
                "منهاج": "المنهاج الدراسي",
            },
            ProfessionalContext.BUSINESS: {
                "شركة": "الشركة التجارية",
                "عمل": "العمل المهني",
                "موظف": "الموظف المختص",
                "راتب": "الراتب الشهري",
                "اجتماع": "الاجتماع الرسمي",
            },
        }

        # Punctuation optimization for Arabic TTS
        self.punctuation_patterns = {
            # Add pauses for better speech flow
            r"([.!?])(\s*)([A-Za-z\u0600-\u06FF])": r"\1، \3",  # Add comma after sentence end
            r"(\d+)": r" \1 ",  # Space around numbers for clarity
            r"([،؛:])([^\s])": r"\1 \2",  # Space after Arabic punctuation
            r"([.!?])([^\s])": r"\1 \2",  # Space after sentence terminators
        }

    def detect_dialect(self, text: str) -> IraqiDialect:
        """Detect Iraqi dialect from text patterns"""
        dialect_indicators = {
            IraqiDialect.BAGHDAD: ["شلونك", "وين", "شگد", "أكو", "هواية", "بيه"],
            IraqiDialect.BASRA: ["شلونكم", "جان", "هوايه", "گال"],
            IraqiDialect.MOSUL: ["شلونكم", "وين راح", "شگد"],
        }

        text_lower = text.lower()
        scores = {}

        for dialect, indicators in dialect_indicators.items():
            score = sum(1 for indicator in indicators if indicator in text_lower)
            scores[dialect] = score

        if max(scores.values()) > 0:
            return max(scores, key=scores.get)
        else:
            return IraqiDialect.GENERAL

    def detect_professional_context(self, text: str) -> ProfessionalContext:
        """Detect professional context from text content"""
        context_keywords = {
            ProfessionalContext.LEGAL: [
                "محكمة",
                "قاضي",
                "عقد",
                "قانون",
                "دعوى",
                "محامي",
                "مادة",
            ],
            ProfessionalContext.MEDICAL: [
                "طبيب",
                "مرض",
                "علاج",
                "مستشفى",
                "دواء",
                "فحص",
                "صحة",
            ],
            ProfessionalContext.EDUCATIONAL: [
                "مدرسة",
                "طالب",
                "معلم",
                "درس",
                "امتحان",
                "منهاج",
                "تعليم",
            ],
            ProfessionalContext.BUSINESS: [
                "شركة",
                "عمل",
                "موظف",
                "راتب",
                "اجتماع",
                "مكتب",
                "تجارة",
            ],
        }

        text_lower = text.lower()
        scores = {}

        for context, keywords in context_keywords.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            scores[context] = score

        if max(scores.values()) > 0:
            return max(scores, key=scores.get)
        else:
            return ProfessionalContext.CASUAL

    def optimize_text_for_tts(
        self,
        text: str,
        dialect: Optional[IraqiDialect] = None,
        context: Optional[ProfessionalContext] = None,
    ) -> OptimizationResult:
        """Optimize Arabic text for better TTS pronunciation"""
        start_time = time.time()
        original_text = text
        enhancements = []

        # Auto-detect if not provided
        if dialect is None:
            dialect = self.detect_dialect(text)
            enhancements.append(f"Detected dialect: {dialect.value}")

        if context is None:
            context = self.detect_professional_context(text)
            enhancements.append(f"Detected context: {context.value}")

        optimized_text = text

        # Apply dialect-specific enhancements
        if dialect in self.dialect_enhancements:
            replacements = self.dialect_enhancements[dialect]
            for iraqi_word, standard_word in replacements.items():
                if iraqi_word in optimized_text:
                    optimized_text = optimized_text.replace(iraqi_word, standard_word)
                    enhancements.append(
                        f"Replaced '{iraqi_word}' with '{standard_word}'"
                    )

        # Apply professional context enhancements
        if context in self.professional_enhancements:
            replacements = self.professional_enhancements[context]
            for term, enhanced_term in replacements.items():
                if term in optimized_text:
                    optimized_text = optimized_text.replace(term, enhanced_term)
                    enhancements.append(
                        f"Enhanced '{term}' to '{enhanced_term}' for {context.value} context"
                    )

        # Apply punctuation optimizations
        for pattern, replacement in self.punctuation_patterns.items():
            new_text = re.sub(pattern, replacement, optimized_text)
            if new_text != optimized_text:
                optimized_text = new_text
                enhancements.append("Optimized punctuation for speech flow")

        # Add breathing pauses for long sentences (>15 words)
        sentences = re.split(r"[.!?؟]", optimized_text)
        processed_sentences = []

        for sentence in sentences:
            words = sentence.strip().split()
            if len(words) > 15:
                # Insert pause markers in long sentences
                mid_point = len(words) // 2
                words.insert(mid_point, "،")
                enhancements.append("Added pause marker in long sentence")
            processed_sentences.append(" ".join(words))

        optimized_text = ". ".join(filter(None, processed_sentences))

        processing_time = time.time() - start_time

        return OptimizationResult(
            optimized_text=optimized_text,
            original_text=original_text,
            processing_time=processing_time,
            enhancements=enhancements,
            dialect=dialect,
            context=context,
        )

    def get_optimal_voice_settings(
        self, context: ProfessionalContext, user_preference: Optional[str] = None
    ) -> VoiceSettings:
        """Get optimal voice settings for given context"""

        # Use user preference if provided and valid
        if user_preference and user_preference in [
            "nova",
            "alloy",
            "echo",
            "fable",
            "onyx",
            "shimmer",
        ]:
            voice = user_preference
        else:
            voice = self.voice_recommendations[context]["primary"]

        speed = self.speed_settings[context]

        return VoiceSettings(voice=voice, speed=speed, model="tts-1-hd", format="mp3")

    async def generate_optimized_speech(
        self,
        text: str,
        dialect: Optional[IraqiDialect] = None,
        context: Optional[ProfessionalContext] = None,
        user_voice_preference: Optional[str] = None,
        use_cache: bool = True,
    ) -> Tuple[bytes, OptimizationResult]:
        """Generate optimized speech audio for Iraqi Arabic"""

        # Optimize text first
        optimization = self.optimize_text_for_tts(text, dialect, context)

        # Get optimal voice settings
        voice_settings = self.get_optimal_voice_settings(
            optimization.context, user_voice_preference
        )

        # Check cache
        if use_cache:
            cache_key = hashlib.md5(
                f"{optimization.optimized_text}_{voice_settings.voice}_{voice_settings.speed}".encode()
            ).hexdigest()
            cache_file = self.cache_dir / f"{cache_key}.mp3"

            if cache_file.exists():
                with open(cache_file, "rb") as f:
                    audio_data = f.read()
                optimization.enhancements.append("Retrieved from cache")
                return audio_data, optimization

        # Generate speech with optimized settings
        try:
            response = await self.client.audio.speech.create(
                model=voice_settings.model,
                voice=voice_settings.voice,
                input=optimization.optimized_text,
                speed=voice_settings.speed,
                response_format=voice_settings.format,
            )

            audio_data = response.content

            # Cache the result
            if use_cache:
                with open(cache_file, "wb") as f:
                    f.write(audio_data)
                optimization.enhancements.append("Cached for future use")

            optimization.enhancements.append(
                f"Generated with voice '{voice_settings.voice}' at {voice_settings.speed}x speed"
            )

            return audio_data, optimization

        except Exception as e:
            raise Exception(f"TTS generation failed: {str(e)}")

    async def batch_generate_common_phrases(
        self, phrases: Dict[str, str], dialect: IraqiDialect
    ):
        """Pre-generate and cache common phrases for faster response"""
        results = {}

        for phrase_id, phrase_text in phrases.items():
            try:
                audio_data, optimization = await self.generate_optimized_speech(
                    phrase_text, dialect=dialect, use_cache=True
                )
                results[phrase_id] = {
                    "audio_size": len(audio_data),
                    "optimization": optimization,
                    "cached": True,
                }

                # Small delay to avoid rate limiting
                await asyncio.sleep(0.1)

            except Exception as e:
                results[phrase_id] = {"error": str(e)}

        return results

    def get_pronunciation_tips(self, context: ProfessionalContext) -> Dict[str, str]:
        """Get pronunciation tips for specific professional contexts"""
        tips = {
            ProfessionalContext.LEGAL: {
                "محكمة": "Emphasize the 'mah-ka-mah' with clear consonants",
                "قانون": "Pronounce as 'qa-noon' with strong 'q' sound",
                "عقد": "Clear 'aqd' pronunciation, avoid rushing",
                "دعوى": "Da'wa with proper Arabic 'ain sound",
            },
            ProfessionalContext.MEDICAL: {
                "طبيب": "Ta-beeb with clear 'b' sounds",
                "علاج": "'I-laj with proper 'ain pronunciation",
                "صحة": "Sih-ha with aspirated 'h'",
                "دواء": "Da-wa with clear vowel separation",
            },
            ProfessionalContext.EDUCATIONAL: {
                "تعليم": "Ta'leem with emphasized 'ta' and long 'ee'",
                "طالب": "Ta-lib with clear consonants",
                "معلم": "Mu'allim with doubled 'l'",
                "درس": "Dars with rolled 'r'",
            },
        }

        return tips.get(context, {})


# Usage examples and testing
async def main():
    """Example usage of the Iraqi TTS Optimizer"""

    optimizer = IraqiTTSOptimizer(
        openai_api_key="your_api_key_here", cache_dir="./iraqi_tts_cache"
    )

    # Example texts in different contexts
    test_texts = {
        "legal": "المحكمة قررت في هذه الدعوى أن العقد صحيح ونافذ",
        "medical": "الطبيب قال إن الدواء هذا مفيد للعلاج",
        "educational": "المعلم شرح الدرس للطلاب في الصف",
        "casual": "شلونك؟ وين رحت اليوم؟ شگد الجو حار!",
    }

    for context_name, text in test_texts.items():
        print(f"\n=== {context_name.upper()} CONTEXT ===")
        print(f"Original: {text}")

        try:
            audio_data, optimization = await optimizer.generate_optimized_speech(text)

            print(f"Optimized: {optimization.optimized_text}")
            print(f"Detected dialect: {optimization.dialect.value}")
            print(f"Detected context: {optimization.context.value}")
            print(f"Audio size: {len(audio_data)} bytes")
            print(f"Enhancements: {', '.join(optimization.enhancements)}")

        except Exception as e:
            print(f"Error: {e}")


if __name__ == "__main__":
    asyncio.run(main())
