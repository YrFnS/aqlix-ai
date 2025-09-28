"""
Iraqi Enhanced Reasoning Patterns Module for HRM System

This module implements specialized reasoning patterns that combine HRM's hierarchical
approach with Iraqi cultural intelligence, Islamic principles, and Arabic processing.
The patterns are designed for real-time cultural reasoning with <200ms response times.

Key Features:
- Islamic principle-based reasoning patterns
- Iraqi cultural context reasoning
- Professional domain expertise (legal, medical, educational)
- Arabic-English bilingual reasoning
- Cultural appropriateness scoring
- Professional etiquette validation
"""

from typing import Dict, Any, List, Optional, Union, Tuple
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from enum import Enum
import asyncio
import time
import logging
from contextlib import asynccontextmanager


# Core reasoning types
class ReasoningType(Enum):
    """Types of reasoning patterns supported"""

    ISLAMIC_PRINCIPLE = "islamic_principle"
    IRAQI_CULTURAL = "iraqi_cultural"
    PROFESSIONAL_DOMAIN = "professional_domain"
    LANGUAGE_PROCESSING = "language_processing"
    ETHICAL_VALIDATION = "ethical_validation"
    CONTEXTUAL_ADAPTATION = "contextual_adaptation"


class CulturalComplexity(Enum):
    """Cultural complexity levels for reasoning depth"""

    SIMPLE = "simple"  # Basic interactions, greetings
    MODERATE = "moderate"  # Professional communication
    COMPLEX = "complex"  # Cultural sensitivities, religious topics
    CRITICAL = "critical"  # Legal/medical/educational domains


@dataclass
class ReasoningContext:
    """Context for reasoning patterns"""

    user_query: str
    cultural_domain: str = "general"
    professional_context: Optional[str] = None
    language_preference: str = "bilingual"  # arabic, english, bilingual
    urgency_level: str = "normal"  # low, normal, high, critical
    cultural_sensitivity: CulturalComplexity = CulturalComplexity.MODERATE
    islamic_principles_applicable: bool = True
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class ReasoningResult:
    """Result from reasoning pattern execution"""

    reasoning_type: ReasoningType
    cultural_appropriateness_score: float
    islamic_compliance_score: float
    professional_accuracy_score: float
    response_content: Dict[str, Any]
    confidence_level: float
    execution_time_ms: float
    metadata: Dict[str, Any] = field(default_factory=dict)


class BaseReasoningPattern(ABC):
    """Base class for all reasoning patterns"""

    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.logger = logging.getLogger(self.__class__.__name__)
        self.performance_metrics = {
            "total_queries": 0,
            "average_response_time_ms": 0,
            "success_rate": 0.0,
            "cultural_accuracy": 0.0,
        }

    @abstractmethod
    async def reason(self, context: ReasoningContext) -> ReasoningResult:
        """Execute reasoning pattern"""
        pass

    async def validate_cultural_appropriateness(
        self, content: str, context: ReasoningContext
    ) -> float:
        """Base cultural validation - override in subclasses"""
        # Simple keyword-based validation as fallback
        sensitive_topics = ["politics", "sectarian", "tribal"]
        islamic_values = ["respect", "courtesy", "honesty", "justice"]

        score = 0.8  # Base score

        # Check for sensitive topics
        for topic in sensitive_topics:
            if topic.lower() in content.lower():
                score -= 0.2

        # Boost for Islamic values
        for value in islamic_values:
            if value.lower() in content.lower():
                score += 0.1

        return min(1.0, max(0.0, score))

    def _update_performance_metrics(
        self, execution_time_ms: float, success: bool, cultural_score: float
    ):
        """Update performance tracking"""
        self.performance_metrics["total_queries"] += 1

        # Update average response time
        total_time = (
            self.performance_metrics["average_response_time_ms"]
            * (self.performance_metrics["total_queries"] - 1)
            + execution_time_ms
        )
        self.performance_metrics["average_response_time_ms"] = (
            total_time / self.performance_metrics["total_queries"]
        )

        # Update success rate
        if success:
            successes = (
                self.performance_metrics["success_rate"]
                * (self.performance_metrics["total_queries"] - 1)
                + 1
            )
            self.performance_metrics["success_rate"] = (
                successes / self.performance_metrics["total_queries"]
            )

        # Update cultural accuracy
        total_cultural = (
            self.performance_metrics["cultural_accuracy"]
            * (self.performance_metrics["total_queries"] - 1)
            + cultural_score
        )
        self.performance_metrics["cultural_accuracy"] = (
            total_cultural / self.performance_metrics["total_queries"]
        )


class IslamicPrincipleReasoner(BaseReasoningPattern):
    """Reasoning pattern based on Islamic principles and values"""

    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.islamic_principles = {
            "justice": "العدل - Fair treatment and equity in all matters",
            "compassion": "الرحمة - Mercy and kindness in interactions",
            "honesty": "الصدق - Truthfulness and transparency",
            "respect": "الاحترام - Dignity and respect for all individuals",
            "modesty": "التواضع - Humility and modesty in communication",
            "wisdom": "الحكمة - Thoughtful and wise decision-making",
        }
        self.forbidden_topics = [
            "gambling",
            "interest_based_finance",
            "alcohol",
            "inappropriate_relationships",
            "disrespectful_content",
        ]

    async def reason(self, context: ReasoningContext) -> ReasoningResult:
        """Apply Islamic principle-based reasoning"""
        start_time = time.time()

        try:
            # Analyze query against Islamic principles
            principle_analysis = await self._analyze_islamic_principles(
                context.user_query
            )

            # Check for forbidden content
            forbidden_content_score = await self._check_forbidden_content(
                context.user_query
            )

            # Generate culturally appropriate response
            response_content = await self._generate_islamic_compliant_response(
                context, principle_analysis, forbidden_content_score
            )

            # Calculate scores
            islamic_compliance_score = min(
                1.0, principle_analysis["compliance_score"] * forbidden_content_score
            )
            cultural_appropriateness_score = (
                await self.validate_cultural_appropriateness(
                    str(response_content), context
                )
            )

            execution_time_ms = (time.time() - start_time) * 1000

            result = ReasoningResult(
                reasoning_type=ReasoningType.ISLAMIC_PRINCIPLE,
                cultural_appropriateness_score=cultural_appropriateness_score,
                islamic_compliance_score=islamic_compliance_score,
                professional_accuracy_score=0.8,  # Default for principle-based reasoning
                response_content=response_content,
                confidence_level=min(
                    islamic_compliance_score, cultural_appropriateness_score
                ),
                execution_time_ms=execution_time_ms,
                metadata={
                    "principles_applied": principle_analysis["principles_applied"],
                    "forbidden_content_detected": forbidden_content_score < 1.0,
                    "cultural_context": context.cultural_domain,
                },
            )

            self._update_performance_metrics(
                execution_time_ms, True, cultural_appropriateness_score
            )
            return result

        except Exception as e:
            execution_time_ms = (time.time() - start_time) * 1000
            self.logger.error(f"Islamic principle reasoning failed: {e}")
            self._update_performance_metrics(execution_time_ms, False, 0.0)
            raise

    async def _analyze_islamic_principles(self, query: str) -> Dict[str, Any]:
        """Analyze query against Islamic principles"""
        principles_applied = []
        compliance_score = 1.0

        query_lower = query.lower()

        # Check which principles apply
        if any(word in query_lower for word in ["fair", "justice", "equal", "rights"]):
            principles_applied.append("justice")

        if any(word in query_lower for word in ["help", "support", "care", "kindness"]):
            principles_applied.append("compassion")

        if any(word in query_lower for word in ["truth", "honest", "accurate", "fact"]):
            principles_applied.append("honesty")

        if any(word in query_lower for word in ["respect", "dignity", "courtesy"]):
            principles_applied.append("respect")

        # Default to wisdom for complex queries
        if not principles_applied:
            principles_applied.append("wisdom")

        return {
            "principles_applied": principles_applied,
            "compliance_score": compliance_score,
            "analysis_confidence": 0.9,
        }

    async def _check_forbidden_content(self, query: str) -> float:
        """Check for content that violates Islamic principles"""
        query_lower = query.lower()

        for forbidden_topic in self.forbidden_topics:
            if forbidden_topic.replace("_", " ") in query_lower:
                return 0.3  # Severely penalize forbidden content

        return 1.0  # No forbidden content detected

    async def _generate_islamic_compliant_response(
        self,
        context: ReasoningContext,
        principle_analysis: Dict[str, Any],
        forbidden_score: float,
    ) -> Dict[str, Any]:
        """Generate response that complies with Islamic principles"""

        if forbidden_score < 1.0:
            return {
                "response_type": "guidance",
                "message": "I understand your question, but I'm designed to provide guidance that aligns with Islamic values and Iraqi cultural norms. Perhaps I can help you with an alternative approach that respects these principles?",
                "arabic_message": "أفهم سؤالك، لكنني مصمم لتقديم إرشادات تتماشى مع القيم الإسلامية والثقافة العراقية. ربما يمكنني مساعدتك بطريقة بديلة تحترم هذه المبادئ؟",
                "suggested_alternatives": [
                    "Ask about Islamic-compliant alternatives",
                    "Seek guidance on ethical approaches",
                    "Request information about cultural appropriateness",
                ],
            }

        # Generate principle-based response
        applied_principles = principle_analysis["principles_applied"]

        response = {
            "response_type": "principle_based",
            "primary_principle": applied_principles[0]
            if applied_principles
            else "wisdom",
            "principle_explanation": self.islamic_principles.get(
                applied_principles[0], "Wisdom-based guidance"
            ),
            "cultural_context": context.cultural_domain,
            "guidance_level": "standard",
        }

        # Add bilingual support if requested
        if context.language_preference in ["bilingual", "arabic"]:
            response["arabic_support"] = True
            response["rtl_formatting"] = True

        return response


class IraqiCulturalReasoner(BaseReasoningPattern):
    """Reasoning pattern for Iraqi cultural context and social norms"""

    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.cultural_contexts = {
            "family": "Family-oriented society with strong extended family bonds",
            "professional": "Respect for hierarchy, experience, and educational credentials",
            "social": "Hospitality, generosity, and social harmony are highly valued",
            "religious": "Islam as central organizing principle of society",
            "educational": "High respect for knowledge, teachers, and scholarly achievement",
            "business": "Relationship-based business culture with emphasis on trust",
        }
        self.dialect_patterns = {
            "greetings": ["شلونك", "أهلاً وسهلاً", "مرحبا"],
            "courtesy": ["لو سمحت", "بإذنك", "تكرم"],
            "gratitude": ["شكراً", "يسلمو", "الله يعطيك العافية"],
        }

    async def reason(self, context: ReasoningContext) -> ReasoningResult:
        """Apply Iraqi cultural reasoning"""
        start_time = time.time()

        try:
            # Analyze cultural context
            cultural_analysis = await self._analyze_cultural_context(context)

            # Assess regional considerations
            regional_factors = await self._assess_regional_factors(context.user_query)

            # Generate culturally appropriate response
            response_content = await self._generate_culturally_appropriate_response(
                context, cultural_analysis, regional_factors
            )

            # Calculate cultural appropriateness score
            cultural_score = await self._calculate_cultural_appropriateness(
                response_content, cultural_analysis
            )

            execution_time_ms = (time.time() - start_time) * 1000

            result = ReasoningResult(
                reasoning_type=ReasoningType.IRAQI_CULTURAL,
                cultural_appropriateness_score=cultural_score,
                islamic_compliance_score=0.9,  # Generally Islamic-compliant
                professional_accuracy_score=regional_factors.get(
                    "professional_relevance", 0.8
                ),
                response_content=response_content,
                confidence_level=cultural_score,
                execution_time_ms=execution_time_ms,
                metadata={
                    "cultural_context": cultural_analysis["primary_context"],
                    "regional_factors": regional_factors,
                    "dialect_used": response_content.get("dialect_elements", []),
                },
            )

            self._update_performance_metrics(execution_time_ms, True, cultural_score)
            return result

        except Exception as e:
            execution_time_ms = (time.time() - start_time) * 1000
            self.logger.error(f"Iraqi cultural reasoning failed: {e}")
            self._update_performance_metrics(execution_time_ms, False, 0.0)
            raise

    async def _analyze_cultural_context(
        self, context: ReasoningContext
    ) -> Dict[str, Any]:
        """Analyze the cultural context of the query"""
        query_lower = context.user_query.lower()

        # Determine primary cultural context
        primary_context = "general"
        confidence = 0.7

        if any(word in query_lower for word in ["family", "عائلة", "أهل"]):
            primary_context = "family"
            confidence = 0.9
        elif any(word in query_lower for word in ["work", "job", "عمل", "وظيفة"]):
            primary_context = "professional"
            confidence = 0.85
        elif any(
            word in query_lower for word in ["education", "school", "تعليم", "مدرسة"]
        ):
            primary_context = "educational"
            confidence = 0.9
        elif any(word in query_lower for word in ["business", "تجارة", "أعمال"]):
            primary_context = "business"
            confidence = 0.8

        return {
            "primary_context": primary_context,
            "context_description": self.cultural_contexts.get(
                primary_context, "General cultural context"
            ),
            "confidence": confidence,
            "cultural_sensitivity_required": context.cultural_sensitivity.value,
        }

    async def _assess_regional_factors(self, query: str) -> Dict[str, Any]:
        """Assess regional cultural factors specific to Iraq"""

        # Basic regional assessment - can be enhanced with more sophisticated analysis
        regional_factors = {
            "hospitality_relevance": 0.8,  # Default high for Iraqi culture
            "hierarchy_consideration": 0.7,
            "religious_sensitivity": 0.9,
            "professional_relevance": 0.8,
            "family_orientation": 0.9,
        }

        query_lower = query.lower()

        # Adjust based on query content
        if "guest" in query_lower or "ضيف" in query_lower:
            regional_factors["hospitality_relevance"] = 1.0

        if any(word in query_lower for word in ["boss", "manager", "teacher", "استاذ"]):
            regional_factors["hierarchy_consideration"] = 1.0

        if any(word in query_lower for word in ["prayer", "صلاة", "mosque", "جامع"]):
            regional_factors["religious_sensitivity"] = 1.0

        return regional_factors

    async def _generate_culturally_appropriate_response(
        self,
        context: ReasoningContext,
        cultural_analysis: Dict[str, Any],
        regional_factors: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Generate response that fits Iraqi cultural norms"""

        response = {
            "response_type": "cultural",
            "cultural_context": cultural_analysis["primary_context"],
            "formality_level": self._determine_formality_level(
                context, cultural_analysis
            ),
            "regional_adaptation": True,
        }

        # Add appropriate dialect elements based on context
        if context.language_preference in ["bilingual", "arabic"]:
            response["dialect_elements"] = self._select_appropriate_dialect(
                cultural_analysis
            )
            response["rtl_support"] = True

        # Add cultural guidance based on context
        if cultural_analysis["primary_context"] == "family":
            response["cultural_guidance"] = (
                "Family relationships are central to Iraqi society"
            )
            response["arabic_guidance"] = "العلاقات الأسرية هي محور المجتمع العراقي"

        elif cultural_analysis["primary_context"] == "professional":
            response["cultural_guidance"] = (
                "Professional respect and hierarchy are important"
            )
            response["arabic_guidance"] = "الاحترام المهني والتسلسل الهرمي مهمان"

        # Add hospitality elements if relevant
        if regional_factors["hospitality_relevance"] > 0.8:
            response["hospitality_elements"] = {
                "welcome_phrase": "أهلاً وسهلاً",
                "courtesy_level": "high",
                "generosity_consideration": True,
            }

        return response

    def _determine_formality_level(
        self, context: ReasoningContext, cultural_analysis: Dict[str, Any]
    ) -> str:
        """Determine appropriate formality level"""

        if cultural_analysis["primary_context"] in ["professional", "educational"]:
            return "formal"
        elif cultural_analysis["primary_context"] == "family":
            return "informal"
        else:
            return "moderate"

    def _select_appropriate_dialect(
        self, cultural_analysis: Dict[str, Any]
    ) -> List[str]:
        """Select appropriate Iraqi dialect elements"""

        context = cultural_analysis["primary_context"]

        if context == "family":
            return (
                self.dialect_patterns["greetings"] + self.dialect_patterns["courtesy"]
            )
        elif context in ["professional", "educational"]:
            return (
                self.dialect_patterns["courtesy"] + self.dialect_patterns["gratitude"]
            )
        else:
            return self.dialect_patterns["greetings"]

    async def _calculate_cultural_appropriateness(
        self, response_content: Dict[str, Any], cultural_analysis: Dict[str, Any]
    ) -> float:
        """Calculate how culturally appropriate the response is"""

        base_score = 0.8

        # Boost for cultural context awareness
        if "cultural_context" in response_content:
            base_score += 0.1

        # Boost for appropriate formality
        if "formality_level" in response_content:
            base_score += 0.05

        # Boost for dialect usage
        if "dialect_elements" in response_content:
            base_score += 0.05

        return min(1.0, base_score)


class ProfessionalDomainReasoner(BaseReasoningPattern):
    """Reasoning pattern for Iraqi professional domains (legal, medical, educational)"""

    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.professional_domains = {
            "legal": {
                "terminology": ["قانون", "محكمة", "حقوق", "law", "court", "rights"],
                "formality": "very_high",
                "cultural_sensitivity": "critical",
                "islamic_jurisprudence": True,
            },
            "medical": {
                "terminology": ["طب", "صحة", "مرض", "medicine", "health", "treatment"],
                "formality": "high",
                "cultural_sensitivity": "high",
                "islamic_ethics": True,
            },
            "educational": {
                "terminology": [
                    "تعليم",
                    "مدرسة",
                    "جامعة",
                    "education",
                    "school",
                    "university",
                ],
                "formality": "high",
                "cultural_sensitivity": "moderate",
                "respect_for_knowledge": True,
            },
            "organizational": {
                "terminology": [
                    "إدارة",
                    "منظمة",
                    "عمل",
                    "management",
                    "organization",
                    "work",
                ],
                "formality": "moderate",
                "cultural_sensitivity": "moderate",
                "hierarchy_awareness": True,
            },
        }

    async def reason(self, context: ReasoningContext) -> ReasoningResult:
        """Apply professional domain reasoning"""
        start_time = time.time()

        try:
            # Identify professional domain
            domain_analysis = await self._identify_professional_domain(context)

            # Apply domain-specific reasoning
            professional_response = await self._apply_domain_reasoning(
                context, domain_analysis
            )

            # Validate professional accuracy
            accuracy_score = await self._validate_professional_accuracy(
                professional_response, domain_analysis
            )

            # Calculate cultural appropriateness for professional context
            cultural_score = await self._calculate_professional_cultural_score(
                professional_response, domain_analysis
            )

            execution_time_ms = (time.time() - start_time) * 1000

            result = ReasoningResult(
                reasoning_type=ReasoningType.PROFESSIONAL_DOMAIN,
                cultural_appropriateness_score=cultural_score,
                islamic_compliance_score=0.95,  # Professional domains typically compliant
                professional_accuracy_score=accuracy_score,
                response_content=professional_response,
                confidence_level=min(accuracy_score, cultural_score),
                execution_time_ms=execution_time_ms,
                metadata={
                    "professional_domain": domain_analysis["domain"],
                    "formality_level": domain_analysis["formality"],
                    "cultural_sensitivity": domain_analysis["cultural_sensitivity"],
                },
            )

            self._update_performance_metrics(execution_time_ms, True, cultural_score)
            return result

        except Exception as e:
            execution_time_ms = (time.time() - start_time) * 1000
            self.logger.error(f"Professional domain reasoning failed: {e}")
            self._update_performance_metrics(execution_time_ms, False, 0.0)
            raise

    async def _identify_professional_domain(
        self, context: ReasoningContext
    ) -> Dict[str, Any]:
        """Identify the professional domain of the query"""

        query_lower = context.user_query.lower()
        domain_scores = {}

        # Score each domain based on terminology presence
        for domain, config in self.professional_domains.items():
            score = 0
            for term in config["terminology"]:
                if term in query_lower:
                    score += 1

            if score > 0:
                domain_scores[domain] = score

        # Determine primary domain
        if domain_scores:
            primary_domain = max(domain_scores, key=domain_scores.get)
            confidence = domain_scores[primary_domain] / len(
                self.professional_domains[primary_domain]["terminology"]
            )
        else:
            primary_domain = "organizational"  # Default
            confidence = 0.3

        domain_config = self.professional_domains[primary_domain]

        return {
            "domain": primary_domain,
            "confidence": min(1.0, confidence),
            "formality": domain_config["formality"],
            "cultural_sensitivity": domain_config["cultural_sensitivity"],
            "special_considerations": {
                k: v
                for k, v in domain_config.items()
                if k not in ["terminology", "formality", "cultural_sensitivity"]
            },
        }

    async def _apply_domain_reasoning(
        self, context: ReasoningContext, domain_analysis: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Apply reasoning specific to the professional domain"""

        domain = domain_analysis["domain"]

        base_response = {
            "response_type": "professional",
            "domain": domain,
            "formality_level": domain_analysis["formality"],
            "cultural_sensitivity_level": domain_analysis["cultural_sensitivity"],
        }

        # Domain-specific enhancements
        if domain == "legal":
            base_response.update(
                {
                    "legal_disclaimer": "This is general information only, not legal advice",
                    "arabic_disclaimer": "هذه معلومات عامة فقط، وليست استشارة قانونية",
                    "islamic_jurisprudence_note": "Consider Islamic legal principles where applicable",
                    "referral_suggestion": "Consult qualified legal professional for specific cases",
                }
            )

        elif domain == "medical":
            base_response.update(
                {
                    "medical_disclaimer": "This is general health information, not medical advice",
                    "arabic_disclaimer": "هذه معلومات صحية عامة، وليست نصيحة طبية",
                    "islamic_medical_ethics": "Respects Islamic medical ethics and patient dignity",
                    "referral_suggestion": "Consult qualified healthcare professional for medical concerns",
                }
            )

        elif domain == "educational":
            base_response.update(
                {
                    "educational_context": "Supports Iraqi educational system and standards",
                    "respect_for_knowledge": "Emphasizes Islamic value of seeking knowledge",
                    "arabic_educational_support": "يدعم النظام التعليمي العراقي والمعايير",
                    "cultural_learning_approach": "Incorporates Iraqi cultural learning preferences",
                }
            )

        elif domain == "organizational":
            base_response.update(
                {
                    "organizational_context": "Considers Iraqi organizational culture",
                    "hierarchy_awareness": "Respects professional hierarchy and authority",
                    "arabic_professional_terms": "Uses appropriate Arabic professional terminology",
                    "team_collaboration": "Emphasizes collective success and team harmony",
                }
            )

        # Add bilingual support for all professional domains
        if context.language_preference in ["bilingual", "arabic"]:
            base_response["bilingual_support"] = True
            base_response["professional_arabic_terms"] = True
            base_response["rtl_formatting"] = True

        return base_response

    async def _validate_professional_accuracy(
        self, response: Dict[str, Any], domain_analysis: Dict[str, Any]
    ) -> float:
        """Validate professional accuracy of the response"""

        accuracy_score = 0.8  # Base score

        domain = domain_analysis["domain"]

        # Check for domain-specific requirements
        if domain == "legal" and "legal_disclaimer" in response:
            accuracy_score += 0.1

        if domain == "medical" and "medical_disclaimer" in response:
            accuracy_score += 0.1

        if domain == "educational" and "educational_context" in response:
            accuracy_score += 0.05

        if domain == "organizational" and "organizational_context" in response:
            accuracy_score += 0.05

        # Check for appropriate formality level
        expected_formality = domain_analysis["formality"]
        actual_formality = response.get("formality_level")

        if expected_formality == actual_formality:
            accuracy_score += 0.05

        return min(1.0, accuracy_score)

    async def _calculate_professional_cultural_score(
        self, response: Dict[str, Any], domain_analysis: Dict[str, Any]
    ) -> float:
        """Calculate cultural appropriateness for professional context"""

        cultural_score = 0.85  # Base score for professional context

        # Boost for cultural sensitivity awareness
        if domain_analysis["cultural_sensitivity"] in ["high", "critical"]:
            cultural_score += 0.05

        # Boost for bilingual support
        if response.get("bilingual_support"):
            cultural_score += 0.05

        # Boost for Islamic considerations
        islamic_keys = [
            "islamic_jurisprudence_note",
            "islamic_medical_ethics",
            "respect_for_knowledge",
        ]
        if any(key in response for key in islamic_keys):
            cultural_score += 0.05

        return min(1.0, cultural_score)


class IraqiReasoningPatterns:
    """Main class that orchestrates all Iraqi reasoning patterns"""

    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.logger = logging.getLogger(__name__)

        # Initialize reasoning patterns
        self.islamic_reasoner = IslamicPrincipleReasoner(config)
        self.cultural_reasoner = IraqiCulturalReasoner(config)
        self.professional_reasoner = ProfessionalDomainReasoner(config)

        # Performance tracking
        self.total_queries = 0
        self.pattern_usage_stats = {
            ReasoningType.ISLAMIC_PRINCIPLE: 0,
            ReasoningType.IRAQI_CULTURAL: 0,
            ReasoningType.PROFESSIONAL_DOMAIN: 0,
        }

    async def reason_with_cultural_intelligence(
        self, context: ReasoningContext
    ) -> Dict[str, ReasoningResult]:
        """Apply multiple reasoning patterns and return comprehensive results"""

        self.total_queries += 1

        results = {}

        try:
            # Always apply Islamic principle reasoning
            if context.islamic_principles_applicable:
                islamic_result = await self.islamic_reasoner.reason(context)
                results["islamic_principles"] = islamic_result
                self.pattern_usage_stats[ReasoningType.ISLAMIC_PRINCIPLE] += 1

            # Apply cultural reasoning for Iraqi context
            cultural_result = await self.cultural_reasoner.reason(context)
            results["iraqi_cultural"] = cultural_result
            self.pattern_usage_stats[ReasoningType.IRAQI_CULTURAL] += 1

            # Apply professional domain reasoning if applicable
            if context.professional_context or self._has_professional_indicators(
                context.user_query
            ):
                professional_result = await self.professional_reasoner.reason(context)
                results["professional_domain"] = professional_result
                self.pattern_usage_stats[ReasoningType.PROFESSIONAL_DOMAIN] += 1

            return results

        except Exception as e:
            self.logger.error(f"Cultural intelligence reasoning failed: {e}")
            raise

    async def select_best_reasoning_result(
        self, results: Dict[str, ReasoningResult], context: ReasoningContext
    ) -> ReasoningResult:
        """Select the best reasoning result based on context and scores"""

        if not results:
            raise ValueError("No reasoning results provided")

        # Weight factors for selection
        weights = {
            "cultural_appropriateness": 0.35,
            "islamic_compliance": 0.25,
            "professional_accuracy": 0.25,
            "confidence": 0.15,
        }

        best_score = 0
        best_result = None
        best_pattern = None

        for pattern, result in results.items():
            # Calculate weighted score
            score = (
                result.cultural_appropriateness_score
                * weights["cultural_appropriateness"]
                + result.islamic_compliance_score * weights["islamic_compliance"]
                + result.professional_accuracy_score * weights["professional_accuracy"]
                + result.confidence_level * weights["confidence"]
            )

            # Adjust score based on context priorities
            if context.cultural_sensitivity == CulturalComplexity.CRITICAL:
                if pattern == "islamic_principles":
                    score *= 1.2
                elif pattern == "professional_domain":
                    score *= 1.1

            if score > best_score:
                best_score = score
                best_result = result
                best_pattern = pattern

        # Add metadata about selection
        if best_result:
            best_result.metadata["selected_pattern"] = best_pattern
            best_result.metadata["selection_score"] = best_score
            best_result.metadata["all_patterns_evaluated"] = list(results.keys())

        return best_result

    def _has_professional_indicators(self, query: str) -> bool:
        """Check if query has professional domain indicators"""

        professional_keywords = [
            "legal",
            "law",
            "court",
            "قانون",
            "محكمة",
            "medical",
            "health",
            "doctor",
            "طب",
            "صحة",
            "دكتور",
            "education",
            "school",
            "university",
            "تعليم",
            "مدرسة",
            "جامعة",
            "work",
            "job",
            "organization",
            "عمل",
            "وظيفة",
            "منظمة",
        ]

        query_lower = query.lower()
        return any(keyword in query_lower for keyword in professional_keywords)

    def get_performance_stats(self) -> Dict[str, Any]:
        """Get performance statistics for all reasoning patterns"""

        stats = {
            "total_queries": self.total_queries,
            "pattern_usage": self.pattern_usage_stats.copy(),
            "pattern_performance": {
                "islamic_principles": self.islamic_reasoner.performance_metrics,
                "iraqi_cultural": self.cultural_reasoner.performance_metrics,
                "professional_domain": self.professional_reasoner.performance_metrics,
            },
        }

        # Calculate usage percentages
        if self.total_queries > 0:
            stats["pattern_usage_percentages"] = {
                pattern_type: (count / self.total_queries) * 100
                for pattern_type, count in self.pattern_usage_stats.items()
            }

        return stats

    @asynccontextmanager
    async def reasoning_session(self, context: ReasoningContext):
        """Context manager for reasoning sessions with cleanup"""

        session_start = time.time()
        try:
            yield
        finally:
            session_duration = time.time() - session_start
            self.logger.info(f"Reasoning session completed in {session_duration:.2f}s")


# Export main classes for use in HRM system
__all__ = [
    "IraqiReasoningPatterns",
    "IslamicPrincipleReasoner",
    "IraqiCulturalReasoner",
    "ProfessionalDomainReasoner",
    "ReasoningContext",
    "ReasoningResult",
    "ReasoningType",
    "CulturalComplexity",
]
