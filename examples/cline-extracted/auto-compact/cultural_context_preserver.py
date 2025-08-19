"""
Cultural Context Preserver - Detailed Cultural Context Preservation for Auto Compact

Extracted from: cline/src/core/prompts/contextManagement.ts
Enhanced for: Iraqi AI Chat System with comprehensive cultural context preservation

Core Features:
1. Cultural Decision Tracking and Preservation
2. Islamic Compliance Context Management
3. Iraqi Professional Standards Preservation
4. Cultural Pattern Recognition and Validation
5. Family Context Sensitivity Maintenance

Iraqi Enhancements:
- Cultural compliance decision tracking
- Islamic principles preservation during summarization
- Iraqi professional context maintenance
- Family appropriateness validation preservation
- Cultural pattern recognition and classification
- Government service context preservation
- Cultural sensitivity scoring and validation
"""

from dataclasses import dataclass
from typing import Dict, List, Optional, Any, Tuple
from enum import Enum
from datetime import datetime
import asyncio
import json

class CulturalDecisionType(str, Enum):
    ISLAMIC_COMPLIANCE = "islamic_compliance"
    PROFESSIONAL_STANDARD = "professional_standard"
    FAMILY_APPROPRIATENESS = "family_appropriateness"
    GOVERNMENT_SERVICE = "government_service"
    CULTURAL_PATTERN = "cultural_pattern"
    LANGUAGE_PREFERENCE = "language_preference"

class CulturalValidationLevel(str, Enum):
    CRITICAL = "critical"      # Must preserve (95%+ compliance required)
    HIGH = "high"             # Should preserve (90%+ compliance required)
    MEDIUM = "medium"         # Nice to preserve (85%+ compliance required)
    LOW = "low"               # Can compress (75%+ compliance required)

@dataclass
class CulturalDecision:
    """Individual cultural decision with context"""
    decision_id: str
    decision_type: CulturalDecisionType
    content: str
    validation_level: CulturalValidationLevel
    compliance_score: float
    cultural_context: Dict[str, Any]
    timestamp: str
    decision_rationale: str
    preservation_priority: int

@dataclass
class CulturalContext:
    """Comprehensive cultural context structure"""
    primary_culture: str
    professional_domain: str
    islamic_compliance_level: str
    family_context_level: str
    government_service_context: bool
    arabic_language_support: bool
    iraqi_dialect_support: bool
    cultural_sensitivity_score: float
    preservation_requirements: Dict[str, Any]

@dataclass
class CulturalPreservationResult:
    """Result of cultural context preservation"""
    preserved_decisions: List[CulturalDecision]
    cultural_compliance_summary: Dict[str, Any]
    islamic_context_summary: Dict[str, Any]
    professional_context_summary: Dict[str, Any]
    family_context_summary: Dict[str, Any]
    government_context_summary: Optional[Dict[str, Any]]
    preservation_quality_score: float
    compression_impact_assessment: Dict[str, Any]

class CulturalContextPreserver:
    """
    Preserves Iraqi cultural context during Auto Compact summarization
    
    Handles:
    - Cultural decision tracking and preservation
    - Islamic compliance context management
    - Iraqi professional standards preservation
    - Family context sensitivity maintenance
    - Government service context preservation
    - Cultural pattern recognition and validation
    """
    
    def __init__(self):
        self.cultural_decision_tracker = CulturalDecisionTracker()
        self.islamic_compliance_validator = IslamicComplianceValidator()
        self.professional_context_analyzer = ProfessionalContextAnalyzer()
        self.family_context_validator = FamilyContextValidator()
        self.government_service_tracker = GovernmentServiceTracker()
        self.cultural_pattern_recognizer = CulturalPatternRecognizer()
        
        # Cultural preservation configuration
        self.config = {
            "min_cultural_compliance": 0.95,
            "min_islamic_compliance": 0.94,
            "min_professional_compliance": 0.90,
            "min_family_appropriateness": 0.92,
            "preserve_government_context": True,
            "preserve_cultural_patterns": True,
            "cultural_decision_retention": 50,  # Max decisions to preserve
            "compression_tolerance": 0.30       # Max compression for cultural content
        }
    
    async def extract_cultural_decisions(self, 
                                       conversation_history: List[Dict[str, Any]], 
                                       cultural_context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Extract and preserve cultural decisions from conversation
        
        Args:
            conversation_history: Complete conversation history
            cultural_context: Iraqi cultural context
            
        Returns:
            Comprehensive cultural preservation summary
        """
        
        # Extract cultural decisions by type
        islamic_decisions = await self._extract_islamic_decisions(conversation_history, cultural_context)
        professional_decisions = await self._extract_professional_decisions(conversation_history, cultural_context)
        family_decisions = await self._extract_family_decisions(conversation_history, cultural_context)
        government_decisions = await self._extract_government_decisions(conversation_history, cultural_context)
        cultural_pattern_decisions = await self._extract_cultural_pattern_decisions(conversation_history, cultural_context)
        
        # Combine and prioritize decisions
        all_decisions = (
            islamic_decisions + professional_decisions + family_decisions + 
            government_decisions + cultural_pattern_decisions
        )
        
        # Sort by preservation priority (critical first)
        prioritized_decisions = sorted(all_decisions, key=lambda d: d.preservation_priority, reverse=True)
        
        # Limit to configuration maximum
        preserved_decisions = prioritized_decisions[:self.config["cultural_decision_retention"]]
        
        # Generate cultural compliance summary
        cultural_summary = await self._generate_cultural_summary(preserved_decisions, cultural_context)
        
        # Calculate preservation metrics
        preservation_metrics = await self._calculate_preservation_metrics(preserved_decisions, all_decisions)
        
        return {
            "cultural_compliance_decisions": [
                {
                    "id": decision.decision_id,
                    "type": decision.decision_type.value,
                    "content": decision.content,
                    "compliance_score": decision.compliance_score,
                    "preservation_priority": decision.preservation_priority
                }
                for decision in preserved_decisions
            ],
            "cultural_patterns_identified": cultural_summary["patterns"],
            "cultural_validation_results": {
                "average_compliance_score": preservation_metrics["average_compliance"],
                "total_decisions_preserved": len(preserved_decisions),
                "total_decisions_identified": len(all_decisions),
                "preservation_ratio": preservation_metrics["preservation_ratio"]
            },
            "islamic_compliance_summary": cultural_summary["islamic"],
            "professional_standards_summary": cultural_summary["professional"],
            "family_context_summary": cultural_summary["family"],
            "government_service_summary": cultural_summary.get("government"),
            "preservation_priority": "critical",
            "compression_impact": preservation_metrics["compression_impact"]
        }
    
    async def validate_preservation(self, 
                                  summary: Dict[str, Any], 
                                  original_context: Dict[str, Any]) -> float:
        """
        Validate quality of cultural preservation
        
        Args:
            summary: Cultural preservation summary
            original_context: Original cultural context
            
        Returns:
            Cultural preservation quality score (0.0-1.0)
        """
        
        # Validate cultural compliance preservation
        cultural_validation = await self._validate_cultural_compliance_preservation(summary, original_context)
        
        # Validate Islamic context preservation
        islamic_validation = await self._validate_islamic_context_preservation(summary, original_context)
        
        # Validate professional context preservation
        professional_validation = await self._validate_professional_context_preservation(summary, original_context)
        
        # Validate family context preservation
        family_validation = await self._validate_family_context_preservation(summary, original_context)
        
        # Calculate weighted preservation score
        weighted_score = (
            cultural_validation * 0.35 +
            islamic_validation * 0.30 +
            professional_validation * 0.20 +
            family_validation * 0.15
        )
        
        return min(weighted_score, 1.0)
    
    # Internal extraction methods
    
    async def _extract_islamic_decisions(self, 
                                       conversation_history: List[Dict[str, Any]], 
                                       cultural_context: Dict[str, Any]) -> List[CulturalDecision]:
        """Extract Islamic compliance decisions"""
        decisions = []
        
        for i, message in enumerate(conversation_history):
            content = str(message.get("content", ""))
            
            # Check for Islamic compliance keywords
            if await self._contains_islamic_content(content):
                decision = CulturalDecision(
                    decision_id=f"islamic_{i}_{datetime.now().strftime('%H%M%S')}",
                    decision_type=CulturalDecisionType.ISLAMIC_COMPLIANCE,
                    content=await self._extract_islamic_context(content),
                    validation_level=CulturalValidationLevel.CRITICAL,
                    compliance_score=await self._calculate_islamic_compliance_score(content),
                    cultural_context=cultural_context,
                    timestamp=datetime.now().isoformat(),
                    decision_rationale="Islamic compliance validation required",
                    preservation_priority=100
                )
                decisions.append(decision)
        
        return decisions
    
    async def _extract_professional_decisions(self, 
                                            conversation_history: List[Dict[str, Any]], 
                                            cultural_context: Dict[str, Any]) -> List[CulturalDecision]:
        """Extract professional domain decisions"""
        decisions = []
        professional_domain = cultural_context.get("professional_domain", "general")
        
        for i, message in enumerate(conversation_history):
            content = str(message.get("content", ""))
            
            if await self._contains_professional_content(content, professional_domain):
                decision = CulturalDecision(
                    decision_id=f"professional_{i}_{datetime.now().strftime('%H%M%S')}",
                    decision_type=CulturalDecisionType.PROFESSIONAL_STANDARD,
                    content=await self._extract_professional_context(content, professional_domain),
                    validation_level=CulturalValidationLevel.HIGH,
                    compliance_score=await self._calculate_professional_compliance_score(content, professional_domain),
                    cultural_context=cultural_context,
                    timestamp=datetime.now().isoformat(),
                    decision_rationale=f"Iraqi {professional_domain} professional standards",
                    preservation_priority=85
                )
                decisions.append(decision)
        
        return decisions
    
    async def _extract_family_decisions(self, 
                                      conversation_history: List[Dict[str, Any]], 
                                      cultural_context: Dict[str, Any]) -> List[CulturalDecision]:
        """Extract family context decisions"""
        decisions = []
        
        for i, message in enumerate(conversation_history):
            content = str(message.get("content", ""))
            
            if await self._contains_family_content(content):
                decision = CulturalDecision(
                    decision_id=f"family_{i}_{datetime.now().strftime('%H%M%S')}",
                    decision_type=CulturalDecisionType.FAMILY_APPROPRIATENESS,
                    content=await self._extract_family_context(content),
                    validation_level=CulturalValidationLevel.HIGH,
                    compliance_score=await self._calculate_family_appropriateness_score(content),
                    cultural_context=cultural_context,
                    timestamp=datetime.now().isoformat(),
                    decision_rationale="Family appropriateness validation",
                    preservation_priority=80
                )
                decisions.append(decision)
        
        return decisions
    
    async def _extract_government_decisions(self, 
                                          conversation_history: List[Dict[str, Any]], 
                                          cultural_context: Dict[str, Any]) -> List[CulturalDecision]:
        """Extract government service decisions"""
        decisions = []
        
        if not cultural_context.get("government_service_context", False):
            return decisions
        
        for i, message in enumerate(conversation_history):
            content = str(message.get("content", ""))
            
            if await self._contains_government_content(content):
                decision = CulturalDecision(
                    decision_id=f"government_{i}_{datetime.now().strftime('%H%M%S')}",
                    decision_type=CulturalDecisionType.GOVERNMENT_SERVICE,
                    content=await self._extract_government_context(content),
                    validation_level=CulturalValidationLevel.CRITICAL,
                    compliance_score=await self._calculate_government_compliance_score(content),
                    cultural_context=cultural_context,
                    timestamp=datetime.now().isoformat(),
                    decision_rationale="Government service workflow preservation",
                    preservation_priority=95
                )
                decisions.append(decision)
        
        return decisions
    
    async def _extract_cultural_pattern_decisions(self, 
                                                conversation_history: List[Dict[str, Any]], 
                                                cultural_context: Dict[str, Any]) -> List[CulturalDecision]:
        """Extract cultural pattern decisions"""
        decisions = []
        
        for i, message in enumerate(conversation_history):
            content = str(message.get("content", ""))
            
            if await self._contains_cultural_patterns(content):
                decision = CulturalDecision(
                    decision_id=f"pattern_{i}_{datetime.now().strftime('%H%M%S')}",
                    decision_type=CulturalDecisionType.CULTURAL_PATTERN,
                    content=await self._extract_cultural_patterns(content),
                    validation_level=CulturalValidationLevel.MEDIUM,
                    compliance_score=await self._calculate_cultural_pattern_score(content),
                    cultural_context=cultural_context,
                    timestamp=datetime.now().isoformat(),
                    decision_rationale="Iraqi cultural pattern recognition",
                    preservation_priority=70
                )
                decisions.append(decision)
        
        return decisions
    
    # Helper methods for content detection
    
    async def _contains_islamic_content(self, content: str) -> bool:
        """Check if content contains Islamic context"""
        islamic_keywords = [
            "halal", "haram", "islamic", "quran", "hadith", "prayer", "mosque", 
            "ramadan", "eid", "hajj", "umrah", "zakat", "imam", "allah", "prophet"
        ]
        content_lower = content.lower()
        return any(keyword in content_lower for keyword in islamic_keywords)
    
    async def _contains_professional_content(self, content: str, professional_domain: str) -> bool:
        """Check if content contains professional domain context"""
        content_lower = content.lower()
        
        domain_keywords = {
            "legal": ["law", "legal", "court", "judge", "lawyer", "contract", "regulation"],
            "medical": ["medical", "health", "doctor", "patient", "treatment", "diagnosis", "hospital"],
            "education": ["education", "school", "university", "student", "teacher", "curriculum", "exam"],
            "government": ["government", "ministry", "passport", "visa", "service", "official", "bureaucracy"]
        }
        
        keywords = domain_keywords.get(professional_domain, [])
        return any(keyword in content_lower for keyword in keywords)
    
    async def _contains_family_content(self, content: str) -> bool:
        """Check if content contains family context"""
        family_keywords = [
            "family", "children", "parents", "wife", "husband", "son", "daughter", 
            "elder", "respect", "honor", "tradition", "marriage", "wedding"
        ]
        content_lower = content.lower()
        return any(keyword in content_lower for keyword in family_keywords)
    
    async def _contains_government_content(self, content: str) -> bool:
        """Check if content contains government service context"""
        government_keywords = [
            "passport", "visa", "id", "license", "permit", "registration", 
            "ministry", "department", "official", "service", "application"
        ]
        content_lower = content.lower()
        return any(keyword in content_lower for keyword in government_keywords)
    
    async def _contains_cultural_patterns(self, content: str) -> bool:
        """Check if content contains Iraqi cultural patterns"""
        cultural_keywords = [
            "iraqi", "baghdad", "basra", "kurdish", "arabic", "mesopotamian", 
            "tribal", "cultural", "tradition", "custom", "heritage"
        ]
        content_lower = content.lower()
        return any(keyword in content_lower for keyword in cultural_keywords)
    
    # Content extraction methods
    
    async def _extract_islamic_context(self, content: str) -> str:
        """Extract Islamic context from content"""
        # Simplified extraction - in production would use NLP
        sentences = content.split('.')
        islamic_sentences = [s.strip() for s in sentences if await self._contains_islamic_content(s)]
        return '. '.join(islamic_sentences[:3])  # Keep top 3 sentences
    
    async def _extract_professional_context(self, content: str, professional_domain: str) -> str:
        """Extract professional context from content"""
        sentences = content.split('.')
        professional_sentences = [s.strip() for s in sentences if await self._contains_professional_content(s, professional_domain)]
        return '. '.join(professional_sentences[:3])
    
    async def _extract_family_context(self, content: str) -> str:
        """Extract family context from content"""
        sentences = content.split('.')
        family_sentences = [s.strip() for s in sentences if await self._contains_family_content(s)]
        return '. '.join(family_sentences[:3])
    
    async def _extract_government_context(self, content: str) -> str:
        """Extract government context from content"""
        sentences = content.split('.')
        government_sentences = [s.strip() for s in sentences if await self._contains_government_content(s)]
        return '. '.join(government_sentences[:3])
    
    async def _extract_cultural_patterns(self, content: str) -> str:
        """Extract cultural patterns from content"""
        sentences = content.split('.')
        cultural_sentences = [s.strip() for s in sentences if await self._contains_cultural_patterns(s)]
        return '. '.join(cultural_sentences[:3])
    
    # Compliance scoring methods
    
    async def _calculate_islamic_compliance_score(self, content: str) -> float:
        """Calculate Islamic compliance score"""
        # Simplified scoring - in production would use specialized Islamic compliance validator
        if await self._contains_islamic_content(content):
            return 0.95  # High compliance assumed for Islamic content
        return 0.85  # Default compliance
    
    async def _calculate_professional_compliance_score(self, content: str, professional_domain: str) -> float:
        """Calculate professional compliance score"""
        if await self._contains_professional_content(content, professional_domain):
            return 0.90  # High compliance for professional content
        return 0.80  # Default compliance
    
    async def _calculate_family_appropriateness_score(self, content: str) -> float:
        """Calculate family appropriateness score"""
        if await self._contains_family_content(content):
            return 0.92  # High appropriateness for family content
        return 0.85  # Default appropriateness
    
    async def _calculate_government_compliance_score(self, content: str) -> float:
        """Calculate government compliance score"""
        if await self._contains_government_content(content):
            return 0.95  # High compliance for government content
        return 0.82  # Default compliance
    
    async def _calculate_cultural_pattern_score(self, content: str) -> float:
        """Calculate cultural pattern score"""
        if await self._contains_cultural_patterns(content):
            return 0.88  # Good cultural pattern recognition
        return 0.75  # Default cultural score


# Supporting tracker classes (simplified implementations)

class CulturalDecisionTracker:
    """Tracks cultural decisions across conversation"""
    
    async def track_decision(self, decision: CulturalDecision):
        """Track a cultural decision"""
        pass

class IslamicComplianceValidator:
    """Validates Islamic compliance"""
    
    async def validate_compliance(self, content: str) -> float:
        """Validate Islamic compliance"""
        return 0.95

class ProfessionalContextAnalyzer:
    """Analyzes professional context"""
    
    async def analyze_context(self, content: str, domain: str) -> Dict[str, Any]:
        """Analyze professional context"""
        return {"domain": domain, "compliance": 0.90}

class FamilyContextValidator:
    """Validates family context appropriateness"""
    
    async def validate_appropriateness(self, content: str) -> float:
        """Validate family appropriateness"""
        return 0.92

class GovernmentServiceTracker:
    """Tracks government service workflows"""
    
    async def track_workflow(self, content: str) -> Dict[str, Any]:
        """Track government workflow"""
        return {"status": "active", "compliance": 0.95}

class CulturalPatternRecognizer:
    """Recognizes Iraqi cultural patterns"""
    
    async def recognize_patterns(self, content: str) -> List[str]:
        """Recognize cultural patterns"""
        return ["Iraqi professional context", "Islamic principles", "Family values"]