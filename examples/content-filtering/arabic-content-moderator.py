"""
Arabic Content Moderation System for Iraqi Cultural Context
Advanced filtering with political, sectarian, and tribal sensitivity detection
"""

from typing import Dict, List, Optional, Tuple, Set
from dataclasses import dataclass
from enum import Enum
import re
import json
from pathlib import Path
import asyncio
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ContentCategory(Enum):
    APPROPRIATE = "appropriate"
    POLITICAL = "political"
    SECTARIAN = "sectarian"
    TRIBAL = "tribal"
    PROFANITY = "profanity"
    INAPPROPRIATE = "inappropriate"
    SENSITIVE_HISTORICAL = "sensitive_historical"
    RELIGIOUS_INAPPROPRIATE = "religious_inappropriate"

class SeverityLevel(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

@dataclass
class ModerationResult:
    is_appropriate: bool
    overall_score: float  # 0.0 (completely inappropriate) to 1.0 (completely appropriate)
    categories: List[ContentCategory]
    severity: SeverityLevel
    flagged_phrases: List[str]
    suggestions: List[str]
    confidence: float
    processing_time: float
    requires_human_review: bool

class IraqiContentModerator:
    """Advanced content moderator specifically designed for Iraqi cultural context"""
    
    def __init__(self, config_path: Optional[str] = None):
        self.config_path = Path(config_path) if config_path else Path("./cultural_config")
        self._load_cultural_keywords()
        self._load_professional_terms()
        self._initialize_patterns()
        
        # Scoring weights for different categories
        self.category_weights = {
            ContentCategory.POLITICAL: 0.8,      # High weight - very sensitive
            ContentCategory.SECTARIAN: 0.9,     # Highest weight - extremely sensitive
            ContentCategory.TRIBAL: 0.7,        # High weight - culturally sensitive
            ContentCategory.PROFANITY: 0.6,     # Medium-high weight
            ContentCategory.SENSITIVE_HISTORICAL: 0.8,  # High weight
            ContentCategory.RELIGIOUS_INAPPROPRIATE: 0.9  # Highest weight
        }
        
        # Thresholds for different actions
        self.thresholds = {
            'auto_approve': 0.8,      # Auto-approve if score >= 0.8
            'human_review': 0.5,      # Human review if 0.5 <= score < 0.8
            'auto_block': 0.3         # Auto-block if score < 0.3
        }

    def _load_cultural_keywords(self):
        """Load culturally sensitive keywords and phrases"""
        # Political keywords (parties, leaders, movements)
        self.political_keywords = {
            # Political parties and movements
            'حزب البعث', 'البعثيين', 'صدام حسين', 'دولة القانون', 'حزب الدعوة',
            'التيار الصدري', 'مقتدى الصدر', 'تيار الحكمة', 'الحشد الشعبي',
            'القوات العراقية', 'الفتح', 'النصر', 'ائتلاف الوطنية',
            
            # Political terms
            'انقلاب', 'ثورة', 'انتفاضة', 'احتلال', 'غزو', 'حرب أهلية',
            'طائفة', 'طائفي', 'طائفية', 'فتنة طائفية',
            
            # English political terms
            'baath party', 'saddam hussein', 'isis', 'daesh', 'al-qaeda',
            'militia', 'sectarian violence', 'civil war', 'occupation',
        }
        
        # Sectarian keywords
        self.sectarian_keywords = {
            # Sectarian terms (both inflammatory and potentially divisive)
            'سني', 'شيعي', 'شيعة', 'سنة', 'وهابي', 'صفوي',
            'رافضي', 'ناصبي', 'تكفيري', 'مجوسي', 'صفوية',
            'أهل البيت', 'أهل السنة والجماعة', 'الشيعة الروافض',
            
            # Religious figures that can be sectarian triggers
            'يزيد', 'معاوية', 'عمر بن الخطاب', 'علي بن أبي طالب',
            'الحسين', 'الحسن', 'عائشة', 'فاطمة',
            
            # English sectarian terms
            'sunni', 'shia', 'shiite', 'wahabi', 'safavid', 'rafidhi'
        }
        
        # Tribal keywords
        self.tribal_keywords = {
            # General tribal terms
            'قبيلة', 'عشيرة', 'شيخ القبيلة', 'شيخ العشيرة',
            'صراع قبلي', 'ثار قبلي', 'فصل عشائري',
            'عشائر', 'قبائل', 'شيوخ العشائر',
            
            # Specific tribal conflicts (avoid naming specific tribes)
            'صراع عشائري', 'نزاع قبلي', 'فتنة عشائرية',
            'انتقام عشائري', 'ثأر قبلي',
            
            # English tribal terms
            'tribal conflict', 'tribal war', 'clan dispute', 'tribal revenge'
        }
        
        # Historical sensitivity keywords
        self.historical_sensitive = {
            # Iran-Iraq War
            'حرب الخليج الأولى', 'الحرب العراقية الإيرانية', 'حرب الثمان سنوات',
            'قادسية صدام', 'كيماوي حلبجة',
            
            # Gulf War and aftermath  
            'حرب الخليج الثانية', 'عاصفة الصحراء', 'غزو الكويت',
            'الحصار الاقتصادي', 'النفط مقابل الغذاء',
            
            # 2003 and aftermath
            'غزو العراق', 'احتلال العراق', 'سقوط بغداد', 'إعدام صدام',
            'حل الجيش العراقي', 'اجتثاث البعث',
            
            # ISIS period
            'داعش', 'الدولة الإسلامية', 'خلافة داعش', 'سقوط الموصل',
            'سبايا يزيديات', 'إبادة يزيدية',
            
            # English historical terms
            'iran-iraq war', 'gulf war', 'iraq invasion', 'saddam execution',
            'isis', 'islamic state', 'fall of mosul', 'yazidi genocide'
        }
        
        # Profanity and inappropriate content (Arabic)
        self.profanity_keywords = {
            # Common Arabic profanity (censored/abbreviated)
            'كلب', 'حمار', 'قحبة', 'عاهرة', 'لعين', 'ملعون',
            # Note: In production, use a comprehensive profanity database
        }

    def _load_professional_terms(self):
        """Load professional terms that should be treated with respect"""
        self.professional_positive = {
            # Legal profession
            'محامي', 'قاضي', 'محكمة', 'قانون', 'عدالة', 'قضية',
            'أستاذ المحامي', 'السيد القاضي', 'حضرة المحامي',
            
            # Medical profession
            'طبيب', 'دكتور', 'طبيبة', 'دكتورة', 'مستشفى', 'علاج',
            'الطبيب المحترم', 'الدكتور الفاضل', 'الطبيبة المحترمة',
            
            # Educational profession
            'معلم', 'أستاذ', 'معلمة', 'أستاذة', 'مدرسة', 'تعليم',
            'الأستاذ الفاضل', 'المعلمة الفاضلة', 'الأستاذة المحترمة',
            
            # Religious terms (positive)
            'الله', 'رسول الله', 'القرآن', 'السنة النبوية',
            'بارك الله فيك', 'جزاك الله خيراً', 'إن شاء الله',
            'الحمد لله', 'سبحان الله', 'أستغفر الله'
        }

    def _initialize_patterns(self):
        """Initialize regex patterns for content analysis"""
        # Patterns for detecting inflammatory language
        self.inflammatory_patterns = [
            r'يسقط\s+[\w\s]+',  # "Down with..."
            r'الموت\s+لـ\s*[\w\s]+',  # "Death to..."
            r'اقتلوا\s+[\w\s]+',  # "Kill..."
            r'اذبحوا\s+[\w\s]+',  # "Slaughter..."
            r'احرقوا\s+[\w\s]+',  # "Burn..."
        ]
        
        # Patterns for sectarian incitement
        self.sectarian_patterns = [
            r'[\w\s]*الشيعة[\w\s]*كفار[\w\s]*',
            r'[\w\s]*السنة[\w\s]*إرهابيين[\w\s]*',
            r'[\w\s]*يستحقون[\w\s]*القتل[\w\s]*',
        ]
        
        # Patterns for positive Islamic expressions
        self.positive_islamic_patterns = [
            r'بسم\s+الله',  # "In the name of Allah"
            r'الحمد\s+لله',  # "Praise be to Allah"
            r'صلى\s+الله\s+عليه\s+وسلم',  # "Peace be upon him"
            r'رضي\s+الله\s+عنه',  # "May Allah be pleased with him"
            r'جزاك\s+الله\s+خيراً',  # "May Allah reward you with good"
        ]

    def _calculate_keyword_score(self, text: str, keywords: Set[str], weight: float) -> Tuple[float, List[str]]:
        """Calculate score based on keyword matches"""
        text_lower = text.lower()
        found_keywords = []
        score_penalty = 0.0
        
        for keyword in keywords:
            if keyword.lower() in text_lower:
                found_keywords.append(keyword)
                # Penalty based on keyword frequency and length
                frequency = text_lower.count(keyword.lower())
                keyword_penalty = (frequency * weight) / len(text.split())
                score_penalty += keyword_penalty
        
        # Normalize penalty to 0-1 range
        normalized_penalty = min(score_penalty, 1.0)
        score = max(0.0, 1.0 - normalized_penalty)
        
        return score, found_keywords

    def _calculate_pattern_score(self, text: str, patterns: List[str], weight: float) -> Tuple[float, List[str]]:
        """Calculate score based on regex pattern matches"""
        found_patterns = []
        score_penalty = 0.0
        
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                found_patterns.extend(matches)
                # Higher penalty for inflammatory patterns
                score_penalty += len(matches) * weight * 0.3
        
        normalized_penalty = min(score_penalty, 1.0)
        score = max(0.0, 1.0 - normalized_penalty)
        
        return score, found_patterns

    def _calculate_positive_score(self, text: str) -> float:
        """Calculate positive score based on respectful/professional language"""
        positive_score = 0.0
        text_lower = text.lower()
        
        # Check for professional terms
        for term in self.professional_positive:
            if term.lower() in text_lower:
                positive_score += 0.1
        
        # Check for positive Islamic expressions
        for pattern in self.positive_islamic_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            positive_score += len(matches) * 0.05
        
        return min(positive_score, 0.3)  # Cap at 0.3 bonus

    async def moderate_content(self, text: str, context: Optional[Dict] = None) -> ModerationResult:
        """
        Main content moderation function
        
        Args:
            text: Content to moderate
            context: Optional context (user profile, professional domain, etc.)
            
        Returns:
            ModerationResult with detailed analysis
        """
        start_time = datetime.now()
        
        if not text or not text.strip():
            return ModerationResult(
                is_appropriate=True,
                overall_score=1.0,
                categories=[ContentCategory.APPROPRIATE],
                severity=SeverityLevel.LOW,
                flagged_phrases=[],
                suggestions=[],
                confidence=1.0,
                processing_time=0.0,
                requires_human_review=False
            )
        
        # Initialize scoring
        scores = {}
        flagged_phrases = []
        detected_categories = []
        
        # Check political content
        political_score, political_phrases = self._calculate_keyword_score(
            text, self.political_keywords, self.category_weights[ContentCategory.POLITICAL]
        )
        if political_phrases:
            detected_categories.append(ContentCategory.POLITICAL)
            flagged_phrases.extend(political_phrases)
        scores['political'] = political_score
        
        # Check sectarian content
        sectarian_score, sectarian_phrases = self._calculate_keyword_score(
            text, self.sectarian_keywords, self.category_weights[ContentCategory.SECTARIAN]
        )
        sectarian_pattern_score, sectarian_patterns = self._calculate_pattern_score(
            text, self.sectarian_patterns, self.category_weights[ContentCategory.SECTARIAN]
        )
        final_sectarian_score = min(sectarian_score, sectarian_pattern_score)
        
        if sectarian_phrases or sectarian_patterns:
            detected_categories.append(ContentCategory.SECTARIAN)
            flagged_phrases.extend(sectarian_phrases)
            flagged_phrases.extend(sectarian_patterns)
        scores['sectarian'] = final_sectarian_score
        
        # Check tribal content
        tribal_score, tribal_phrases = self._calculate_keyword_score(
            text, self.tribal_keywords, self.category_weights[ContentCategory.TRIBAL]
        )
        if tribal_phrases:
            detected_categories.append(ContentCategory.TRIBAL)
            flagged_phrases.extend(tribal_phrases)
        scores['tribal'] = tribal_score
        
        # Check historical sensitivity
        historical_score, historical_phrases = self._calculate_keyword_score(
            text, self.historical_sensitive, self.category_weights[ContentCategory.SENSITIVE_HISTORICAL]
        )
        if historical_phrases:
            detected_categories.append(ContentCategory.SENSITIVE_HISTORICAL)
            flagged_phrases.extend(historical_phrases)
        scores['historical'] = historical_score
        
        # Check profanity
        profanity_score, profanity_phrases = self._calculate_keyword_score(
            text, self.profanity_keywords, self.category_weights[ContentCategory.PROFANITY]
        )
        if profanity_phrases:
            detected_categories.append(ContentCategory.PROFANITY)
            flagged_phrases.extend(profanity_phrases)
        scores['profanity'] = profanity_score
        
        # Check inflammatory patterns
        inflammatory_score, inflammatory_patterns = self._calculate_pattern_score(
            text, self.inflammatory_patterns, 0.9
        )
        if inflammatory_patterns:
            detected_categories.append(ContentCategory.INAPPROPRIATE)
            flagged_phrases.extend(inflammatory_patterns)
        scores['inflammatory'] = inflammatory_score
        
        # Calculate positive score bonus
        positive_bonus = self._calculate_positive_score(text)
        
        # Calculate overall score
        # Use minimum of all category scores (most restrictive approach)
        base_score = min(scores.values())
        overall_score = min(1.0, base_score + positive_bonus)
        
        # Determine severity
        if overall_score >= 0.8:
            severity = SeverityLevel.LOW
        elif overall_score >= 0.5:
            severity = SeverityLevel.MEDIUM
        elif overall_score >= 0.3:
            severity = SeverityLevel.HIGH
        else:
            severity = SeverityLevel.CRITICAL
        
        # Determine if content is appropriate
        is_appropriate = overall_score >= self.thresholds['auto_approve']
        
        # Determine if human review is needed
        requires_human_review = (
            self.thresholds['auto_block'] < overall_score < self.thresholds['human_review']
        )
        
        # Generate suggestions
        suggestions = self._generate_suggestions(detected_categories, context)
        
        # Calculate confidence (based on score certainty and pattern matches)
        confidence = self._calculate_confidence(overall_score, len(flagged_phrases), len(detected_categories))
        
        # Processing time
        processing_time = (datetime.now() - start_time).total_seconds()
        
        # If no problematic categories detected, mark as appropriate
        if not detected_categories:
            detected_categories = [ContentCategory.APPROPRIATE]
        
        return ModerationResult(
            is_appropriate=is_appropriate,
            overall_score=overall_score,
            categories=detected_categories,
            severity=severity,
            flagged_phrases=flagged_phrases,
            suggestions=suggestions,
            confidence=confidence,
            processing_time=processing_time,
            requires_human_review=requires_human_review
        )

    def _generate_suggestions(self, categories: List[ContentCategory], context: Optional[Dict]) -> List[str]:
        """Generate suggestions for improving content"""
        suggestions = []
        
        if ContentCategory.POLITICAL in categories:
            suggestions.append("تجنب المحتوى السياسي. ركز على المساعدة المهنية والتعليمية.")
            suggestions.append("Avoid political content. Focus on professional and educational assistance.")
        
        if ContentCategory.SECTARIAN in categories:
            suggestions.append("تجنب المحتوى الطائفي. احترم جميع المذاهب والأديان.")
            suggestions.append("Avoid sectarian content. Respect all denominations and religions.")
        
        if ContentCategory.TRIBAL in categories:
            suggestions.append("تجنب الإشارة إلى النزاعات القبلية. ركز على الوحدة والتفاهم.")
            suggestions.append("Avoid references to tribal conflicts. Focus on unity and understanding.")
        
        if ContentCategory.PROFANITY in categories:
            suggestions.append("استخدم لغة مهذبة ومحترمة مناسبة للسياق المهني.")
            suggestions.append("Use polite and respectful language appropriate for professional context.")
        
        if ContentCategory.SENSITIVE_HISTORICAL in categories:
            suggestions.append("تجنب إثارة الأحداث التاريخية الحساسة. ركز على المستقبل الإيجابي.")
            suggestions.append("Avoid raising sensitive historical events. Focus on a positive future.")
        
        return suggestions

    def _calculate_confidence(self, score: float, num_flagged: int, num_categories: int) -> float:
        """Calculate confidence in moderation decision"""
        base_confidence = 0.8
        
        # Higher confidence for extreme scores
        if score >= 0.9 or score <= 0.2:
            base_confidence += 0.15
        
        # Lower confidence for borderline scores
        if 0.4 <= score <= 0.6:
            base_confidence -= 0.2
        
        # Adjust based on number of flags
        if num_flagged > 0:
            base_confidence += min(0.1, num_flagged * 0.02)
        
        # Adjust based on category diversity
        if num_categories > 2:
            base_confidence += 0.05
        
        return min(1.0, max(0.3, base_confidence))

    def get_moderation_summary(self, results: List[ModerationResult]) -> Dict:
        """Generate summary statistics for multiple moderation results"""
        if not results:
            return {}
        
        total = len(results)
        appropriate_count = sum(1 for r in results if r.is_appropriate)
        
        category_counts = {}
        severity_counts = {}
        
        for result in results:
            for category in result.categories:
                category_counts[category.value] = category_counts.get(category.value, 0) + 1
            severity_counts[result.severity.value] = severity_counts.get(result.severity.value, 0) + 1
        
        avg_score = sum(r.overall_score for r in results) / total
        avg_confidence = sum(r.confidence for r in results) / total
        human_review_needed = sum(1 for r in results if r.requires_human_review)
        
        return {
            'total_analyzed': total,
            'appropriate_count': appropriate_count,
            'inappropriate_count': total - appropriate_count,
            'approval_rate': appropriate_count / total * 100,
            'average_score': round(avg_score, 3),
            'average_confidence': round(avg_confidence, 3),
            'human_review_needed': human_review_needed,
            'category_distribution': category_counts,
            'severity_distribution': severity_counts,
            'processing_stats': {
                'avg_time': round(sum(r.processing_time for r in results) / total, 4),
                'max_time': max(r.processing_time for r in results),
                'min_time': min(r.processing_time for r in results)
            }
        }

# Usage examples and testing
async def main():
    """Example usage of the Iraqi Content Moderator"""
    
    moderator = IraqiContentModerator()
    
    # Test cases covering different scenarios
    test_cases = [
        # Appropriate content
        "أستاذ محمد، أريد استشارة قانونية حول عقد الإيجار. شكراً لك.",
        "الحمد لله، الدكتور ساعدني كثيراً في العلاج. بارك الله فيه.",
        "Hello, I need help with my legal documents. Thank you for your assistance.",
        
        # Political content (should be flagged)
        "يسقط حزب الدعوة وجميع الأحزاب الفاسدة في العراق",
        "صدام حسين كان أفضل من هؤلاء الفاسدين الحاليين",
        
        # Sectarian content (should be flagged)  
        "الشيعة كلهم عملاء إيران والسنة إرهابيون",
        "علي بن أبي طالب أحق بالخلافة من عمر بن الخطاب",
        
        # Tribal content (should be flagged)
        "قبيلة شمر أشرف من قبيلة العنزة",
        "الصراع العشائري في البصرة وصل لحد القتل",
        
        # Historical sensitivity (should be flagged)
        "داعش كان محق في قتل اليزيديين",
        "حرب الخليج كانت مؤامرة أمريكية ضد العراق"
    ]
    
    results = []
    
    print("=== Iraqi Content Moderation Test Results ===\n")
    
    for i, text in enumerate(test_cases, 1):
        print(f"Test Case {i}: {text[:50]}...")
        
        result = await moderator.moderate_content(text)
        results.append(result)
        
        print(f"  ✓ Appropriate: {result.is_appropriate}")
        print(f"  ✓ Score: {result.overall_score:.3f}")
        print(f"  ✓ Severity: {result.severity.value}")
        print(f"  ✓ Categories: {[cat.value for cat in result.categories]}")
        print(f"  ✓ Confidence: {result.confidence:.3f}")
        print(f"  ✓ Human Review: {result.requires_human_review}")
        
        if result.flagged_phrases:
            print(f"  ⚠ Flagged: {result.flagged_phrases}")
        
        if result.suggestions:
            print(f"  💡 Suggestions: {result.suggestions[0]}")
        
        print(f"  ⏱ Processing: {result.processing_time:.4f}s")
        print()
    
    # Generate summary
    summary = moderator.get_moderation_summary(results)
    print("=== Moderation Summary ===")
    print(json.dumps(summary, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    asyncio.run(main())