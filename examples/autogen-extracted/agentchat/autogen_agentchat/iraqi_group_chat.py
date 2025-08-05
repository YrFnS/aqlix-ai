"""
Iraqi Group Chat System for AutoGen Multi-Agent Coordination

Enhanced group chat system with Iraqi cultural context, Arabic language support,
and Islamic compliance validation for professional team coordination.
"""

import asyncio
from typing import Any, Dict, List, Optional, Union, Callable, Sequence
from dataclasses import dataclass, field
from enum import Enum
import json
from datetime import datetime

from autogen_core import AgentId, MessageContext
from .base import ChatAgent
from .messages import ChatMessage, MessageType
from .teams._group_chat import BaseGroupChat, BaseGroupChatManager

# Import Iraqi enhancements
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'core', 'iraqi_enhancements'))

from cultural_validator import (
    IraqiCulturalValidator, 
    CulturalValidationResult,
    ProfessionalDomain,
    CulturalCompliance
)
from arabic_agent_base import ArabicProcessingConfig


class IraqiDecisionPattern(Enum):
    """Iraqi decision-making patterns for group coordination"""
    HIERARCHICAL = "hierarchical"  # Senior-led decisions
    CONSENSUS_BUILDING = "consensus_building"  # Traditional Iraqi consensus
    EXPERT_CONSULTATION = "expert_consultation"  # Specialist-led decisions
    RELIGIOUS_VALIDATION = "religious_validation"  # Islamic compliance required
    COLLABORATIVE = "collaborative"  # Equal participation


class IraqiGroupRole(Enum):
    """Iraqi professional group roles with cultural hierarchy"""
    SENIOR_EXECUTIVE = "senior_executive"  # رئيس تنفيذي أول
    DEPARTMENT_HEAD = "department_head"  # رئيس قسم
    SENIOR_PROFESSIONAL = "senior_professional"  # مختص أول
    MID_PROFESSIONAL = "mid_professional"  # مختص
    JUNIOR_PROFESSIONAL = "junior_professional"  # مختص مبتدئ
    ADVISOR = "advisor"  # مستشار
    RELIGIOUS_ADVISOR = "religious_advisor"  # مستشار شرعي
    CULTURAL_LIAISON = "cultural_liaison"  # منسق ثقافي


@dataclass
class IraqiGroupConfig:
    """Configuration for Iraqi group chat coordination"""
    professional_domain: ProfessionalDomain
    decision_pattern: IraqiDecisionPattern
    islamic_compliance_required: bool = True
    arabic_language_support: bool = True
    cultural_sensitivity_level: str = "high"  # low, medium, high, religious
    hierarchy_enforcement: bool = True
    prayer_time_awareness: bool = True
    ramadan_schedule_adjustment: bool = True
    cultural_holidays_awareness: bool = True


@dataclass 
class IraqiParticipant:
    """Iraqi professional participant with cultural context"""
    agent: ChatAgent
    role: IraqiGroupRole
    seniority_level: int  # 1-10 scale
    specialization: str
    cultural_background: str = "iraqi"
    language_preference: str = "arabic"  # arabic, english, mixed
    religious_role: bool = False
    decision_weight: float = 1.0


class IraqiGroupChatManager(BaseGroupChatManager):
    """
    Iraqi-aware group chat manager with cultural context and Islamic compliance
    """
    
    def __init__(
        self,
        model_client: Any,
        config: IraqiGroupConfig,
        participants: List[IraqiParticipant],
        max_turns: int = 20,
        **kwargs
    ):
        super().__init__(
            participants=[p.agent for p in participants],
            model_client=model_client,
            max_turns=max_turns,
            **kwargs
        )
        
        self.config = config
        self.iraqi_participants = {p.agent.id: p for p in participants}
        self.cultural_validator = IraqiCulturalValidator()
        self.arabic_config = ArabicProcessingConfig()
        
        # Iraqi-specific state
        self.cultural_context: Dict[str, Any] = {}
        self.decision_history: List[Dict[str, Any]] = []
        self.islamic_compliance_log: List[Dict[str, Any]] = []
        self.hierarchy_violations: List[Dict[str, Any]] = []
        
        # Initialize cultural context
        self._initialize_cultural_context()
    
    def _initialize_cultural_context(self) -> None:
        """Initialize Iraqi cultural context for the group"""
        self.cultural_context = {
            'group_id': f"iraqi_group_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            'domain': self.config.professional_domain.value,
            'decision_pattern': self.config.decision_pattern.value,
            'participants_count': len(self.iraqi_participants),
            'hierarchy_levels': self._analyze_hierarchy(),
            'cultural_norms': self._get_cultural_norms(),
            'session_start': datetime.now().isoformat(),
            'language_matrix': self._build_language_matrix()
        }
    
    def _analyze_hierarchy(self) -> Dict[str, Any]:
        """Analyze participant hierarchy for Iraqi context"""
        hierarchy = {}
        
        # Group by role and seniority
        roles_distribution = {}
        seniority_range = {'min': 10, 'max': 0}
        
        for participant in self.iraqi_participants.values():
            role = participant.role.value
            if role not in roles_distribution:
                roles_distribution[role] = 0
            roles_distribution[role] += 1
            
            seniority_range['min'] = min(seniority_range['min'], participant.seniority_level)
            seniority_range['max'] = max(seniority_range['max'], participant.seniority_level)
        
        hierarchy = {
            'roles_distribution': roles_distribution,
            'seniority_range': seniority_range,
            'decision_makers': self._identify_decision_makers(),
            'religious_advisors': self._identify_religious_advisors(),
            'cultural_hierarchy_respected': True
        }
        
        return hierarchy
    
    def _identify_decision_makers(self) -> List[str]:
        """Identify primary decision makers based on Iraqi hierarchy"""
        decision_makers = []
        
        # Senior executives always included
        for agent_id, participant in self.iraqi_participants.items():
            if participant.role in [IraqiGroupRole.SENIOR_EXECUTIVE, IraqiGroupRole.DEPARTMENT_HEAD]:
                decision_makers.append(agent_id)
            elif participant.seniority_level >= 8:  # Very senior professionals
                decision_makers.append(agent_id)
        
        # If no clear hierarchy, use consensus
        if not decision_makers:
            decision_makers = list(self.iraqi_participants.keys())
        
        return decision_makers
    
    def _identify_religious_advisors(self) -> List[str]:
        """Identify religious advisors for Islamic compliance"""
        religious_advisors = []
        
        for agent_id, participant in self.iraqi_participants.items():
            if (participant.role == IraqiGroupRole.RELIGIOUS_ADVISOR or 
                participant.religious_role or
                'islamic' in participant.specialization.lower() or
                'shariah' in participant.specialization.lower()):
                religious_advisors.append(agent_id)
        
        return religious_advisors
    
    def _get_cultural_norms(self) -> Dict[str, Any]:
        """Get Iraqi cultural norms for the professional domain"""
        base_norms = {
            'respect_hierarchy': True,
            'islamic_greeting': True,
            'consensus_preferred': True,
            'elder_respect': True,
            'gender_considerations': True,
            'prayer_time_respect': self.config.prayer_time_awareness,
            'ramadan_awareness': self.config.ramadan_schedule_adjustment
        }
        
        # Domain-specific norms
        domain_norms = {}
        if self.config.professional_domain == ProfessionalDomain.LEGAL:
            domain_norms.update({
                'shariah_compliance_required': True,
                'formal_language_preferred': True,
                'case_confidentiality': True
            })
        elif self.config.professional_domain == ProfessionalDomain.MEDICAL:
            domain_norms.update({
                'patient_privacy': True,
                'islamic_medical_ethics': True,
                'family_consultation': True
            })
        elif self.config.professional_domain == ProfessionalDomain.EDUCATIONAL:
            domain_norms.update({
                'islamic_education_values': True,
                'student_respect': True,
                'knowledge_sharing': True
            })
        
        return {**base_norms, **domain_norms}
    
    def _build_language_matrix(self) -> Dict[str, Any]:
        """Build language preference matrix for participants"""
        language_matrix = {
            'arabic_speakers': 0,
            'english_speakers': 0,
            'mixed_preference': 0,
            'primary_language': 'arabic',
            'translation_needed': False
        }
        
        for participant in self.iraqi_participants.values():
            if participant.language_preference == 'arabic':
                language_matrix['arabic_speakers'] += 1
            elif participant.language_preference == 'english':
                language_matrix['english_speakers'] += 1
            else:  # mixed
                language_matrix['mixed_preference'] += 1
        
        # Determine primary language
        if language_matrix['arabic_speakers'] >= language_matrix['english_speakers']:
            language_matrix['primary_language'] = 'arabic'
        else:
            language_matrix['primary_language'] = 'english'
        
        # Check if translation needed
        language_matrix['translation_needed'] = (
            language_matrix['arabic_speakers'] > 0 and 
            language_matrix['english_speakers'] > 0
        )
        
        return language_matrix
    
    async def select_speaker(
        self, 
        messages: List[ChatMessage], 
        ctx: MessageContext
    ) -> AgentId:
        """
        Select next speaker based on Iraqi decision patterns and cultural hierarchy
        """
        # Validate current message culturally
        if messages:
            await self._validate_cultural_appropriateness(messages[-1])
        
        # Apply Iraqi decision pattern
        if self.config.decision_pattern == IraqiDecisionPattern.HIERARCHICAL:
            return await self._select_hierarchical_speaker(messages, ctx)
        elif self.config.decision_pattern == IraqiDecisionPattern.CONSENSUS_BUILDING:
            return await self._select_consensus_speaker(messages, ctx)
        elif self.config.decision_pattern == IraqiDecisionPattern.EXPERT_CONSULTATION:
            return await self._select_expert_speaker(messages, ctx)
        elif self.config.decision_pattern == IraqiDecisionPattern.RELIGIOUS_VALIDATION:
            return await self._select_religious_speaker(messages, ctx)
        else:  # COLLABORATIVE
            return await self._select_collaborative_speaker(messages, ctx)
    
    async def _select_hierarchical_speaker(
        self, 
        messages: List[ChatMessage], 
        ctx: MessageContext
    ) -> AgentId:
        """Select speaker based on Iraqi hierarchical patterns"""
        
        # Senior executives speak first or make final decisions
        senior_executives = [
            agent_id for agent_id, participant in self.iraqi_participants.items()
            if participant.role == IraqiGroupRole.SENIOR_EXECUTIVE
        ]
        
        if senior_executives and (len(messages) == 0 or len(messages) % 5 == 0):
            return AgentId(senior_executives[0])
        
        # Department heads coordinate their domains
        if len(messages) > 0:
            last_message = messages[-1]
            
            # Find department heads in relevant domain
            relevant_heads = [
                agent_id for agent_id, participant in self.iraqi_participants.items()
                if (participant.role == IraqiGroupRole.DEPARTMENT_HEAD and
                    self._is_relevant_to_domain(last_message.content, participant.specialization))
            ]
            
            if relevant_heads:
                return AgentId(relevant_heads[0])
        
        # Fall back to seniority-based selection
        sorted_participants = sorted(
            self.iraqi_participants.items(),
            key=lambda x: x[1].seniority_level,
            reverse=True
        )
        
        # Skip participants who have recently spoken
        recent_speakers = [msg.source for msg in messages[-3:]] if len(messages) >= 3 else []
        
        for agent_id, participant in sorted_participants:
            if AgentId(agent_id) not in recent_speakers:
                return AgentId(agent_id)
        
        # Default to first participant
        return AgentId(list(self.iraqi_participants.keys())[0])
    
    async def _select_consensus_speaker(
        self, 
        messages: List[ChatMessage], 
        ctx: MessageContext
    ) -> AgentId:
        """Select speaker for Iraqi consensus-building patterns"""
        
        # Round-robin with cultural considerations
        if not messages:
            # Start with cultural greeting from senior member
            senior_member = max(
                self.iraqi_participants.items(),
                key=lambda x: x[1].seniority_level
            )
            return AgentId(senior_member[0])
        
        # Ensure everyone has had a chance to speak
        participant_speak_count = {}
        for agent_id in self.iraqi_participants.keys():
            participant_speak_count[agent_id] = sum(
                1 for msg in messages if msg.source == AgentId(agent_id)
            )
        
        # Find participant who has spoken least
        min_speaks = min(participant_speak_count.values())
        candidates = [
            agent_id for agent_id, count in participant_speak_count.items()
            if count == min_speaks
        ]
        
        # Among candidates, prefer those with higher cultural decision weight
        if len(candidates) > 1:
            weighted_candidates = [
                (agent_id, self.iraqi_participants[agent_id].decision_weight)
                for agent_id in candidates
            ]
            weighted_candidates.sort(key=lambda x: x[1], reverse=True)
            return AgentId(weighted_candidates[0][0])
        
        return AgentId(candidates[0])
    
    async def _select_expert_speaker(
        self, 
        messages: List[ChatMessage], 
        ctx: MessageContext
    ) -> AgentId:
        """Select speaker based on expertise relevance"""
        
        if not messages:
            # Start with most senior expert
            experts = [
                (agent_id, participant) for agent_id, participant in self.iraqi_participants.items()
                if participant.seniority_level >= 7
            ]
            if experts:
                expert = max(experts, key=lambda x: x[1].seniority_level)
                return AgentId(expert[0])
        
        # Analyze last message for topic
        last_message = messages[-1]
        topic_keywords = self._extract_topic_keywords(last_message.content)
        
        # Find most relevant expert
        relevance_scores = {}
        for agent_id, participant in self.iraqi_participants.items():
            score = self._calculate_expertise_relevance(
                participant.specialization, 
                topic_keywords
            )
            relevance_scores[agent_id] = score
        
        # Select expert with highest relevance
        best_expert = max(relevance_scores.items(), key=lambda x: x[1])
        return AgentId(best_expert[0])
    
    async def _select_religious_speaker(
        self, 
        messages: List[ChatMessage], 
        ctx: MessageContext
    ) -> AgentId:
        """Select religious advisor for Islamic compliance validation"""
        
        religious_advisors = self.cultural_context['hierarchy_levels']['religious_advisors']
        
        if religious_advisors:
            return AgentId(religious_advisors[0])
        
        # If no dedicated religious advisor, find participant with Islamic expertise
        islamic_experts = [
            agent_id for agent_id, participant in self.iraqi_participants.items()
            if ('islamic' in participant.specialization.lower() or
                'shariah' in participant.specialization.lower() or
                participant.religious_role)
        ]
        
        if islamic_experts:
            return AgentId(islamic_experts[0])
        
        # Fall back to senior member
        senior_member = max(
            self.iraqi_participants.items(),
            key=lambda x: x[1].seniority_level
        )
        return AgentId(senior_member[0])
    
    async def _select_collaborative_speaker(
        self, 
        messages: List[ChatMessage], 
        ctx: MessageContext
    ) -> AgentId:
        """Select speaker for collaborative Iraqi coordination"""
        
        # Balance participation while respecting cultural hierarchy
        participation_balance = self._calculate_participation_balance(messages)
        
        # Find underrepresented participants with appropriate cultural weight
        candidates = []
        for agent_id, participation_ratio in participation_balance.items():
            participant = self.iraqi_participants[agent_id]
            cultural_weight = participant.decision_weight * participant.seniority_level
            
            # Prioritize underrepresented participants with higher cultural weight
            candidates.append((
                agent_id, 
                (1.0 - participation_ratio) * cultural_weight
            ))
        
        # Select candidate with highest priority score
        candidates.sort(key=lambda x: x[1], reverse=True)
        return AgentId(candidates[0][0])
    
    def _calculate_participation_balance(self, messages: List[ChatMessage]) -> Dict[str, float]:
        """Calculate participation balance across participants"""
        if not messages:
            return {agent_id: 0.0 for agent_id in self.iraqi_participants.keys()}
        
        participation_count = {}
        total_messages = len(messages)
        
        for agent_id in self.iraqi_participants.keys():
            count = sum(1 for msg in messages if msg.source == AgentId(agent_id))
            participation_count[agent_id] = count / total_messages if total_messages > 0 else 0.0
        
        return participation_count
    
    async def _validate_cultural_appropriateness(self, message: ChatMessage) -> None:
        """Validate message for Iraqi cultural appropriateness"""
        
        validation_result = self.cultural_validator.validate_message_content(
            content=message.content,
            domain=self.config.professional_domain,
            context={
                'speaker_role': self._get_participant_role(message.source),
                'group_context': self.cultural_context,
                'islamic_compliance_required': self.config.islamic_compliance_required
            }
        )
        
        # Log validation result
        self.islamic_compliance_log.append({
            'timestamp': datetime.now().isoformat(),
            'message_id': str(message.source),
            'compliance_level': validation_result.compliance_level.value,
            'issues': validation_result.issues,
            'confidence_score': validation_result.confidence_score
        })
        
        # Handle non-compliance
        if validation_result.compliance_level == CulturalCompliance.NON_COMPLIANT:
            await self._handle_cultural_violation(message, validation_result)
        elif validation_result.requires_human_review:
            await self._flag_for_human_review(message, validation_result)
    
    async def _handle_cultural_violation(
        self, 
        message: ChatMessage, 
        validation_result: CulturalValidationResult
    ) -> None:
        """Handle cultural or Islamic compliance violations"""
        
        violation_record = {
            'timestamp': datetime.now().isoformat(),
            'message_source': str(message.source),
            'violation_type': 'cultural_non_compliance',
            'issues': validation_result.issues,
            'severity': 'high' if 'islamic' in str(validation_result.issues).lower() else 'medium'
        }
        
        self.hierarchy_violations.append(violation_record)
        
        # In a real system, you might:
        # 1. Request message revision
        # 2. Escalate to human moderator
        # 3. Apply automatic filtering
        # 4. Provide cultural guidance
        
        print(f"Cultural violation detected: {validation_result.issues}")
    
    async def _flag_for_human_review(
        self, 
        message: ChatMessage, 
        validation_result: CulturalValidationResult
    ) -> None:
        """Flag message for human review"""
        
        review_flag = {
            'timestamp': datetime.now().isoformat(),
            'message_source': str(message.source),
            'review_reason': 'cultural_sensitivity',
            'issues': validation_result.issues,
            'recommendations': validation_result.recommendations,
            'priority': 'high' if validation_result.confidence_score < 0.5 else 'medium'
        }
        
        # In a real system, this would trigger human moderator notification
        print(f"Message flagged for human review: {review_flag}")
    
    def _get_participant_role(self, agent_id: AgentId) -> str:
        """Get participant role from agent ID"""
        participant = self.iraqi_participants.get(str(agent_id))
        return participant.role.value if participant else "unknown"
    
    def _is_relevant_to_domain(self, content: str, specialization: str) -> bool:
        """Check if content is relevant to participant's domain"""
        
        # Simple keyword-based relevance check
        spec_keywords = specialization.lower().split('_')
        content_lower = content.lower()
        
        return any(keyword in content_lower for keyword in spec_keywords)
    
    def _extract_topic_keywords(self, content: str) -> List[str]:
        """Extract key topics from message content"""
        
        # Simple keyword extraction - in production, use NLP
        common_words = {'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'}
        
        words = re.findall(r'\b\w+\b', content.lower())
        keywords = [word for word in words if len(word) > 3 and word not in common_words]
        
        return keywords[:10]  # Top 10 keywords
    
    def _calculate_expertise_relevance(self, specialization: str, keywords: List[str]) -> float:
        """Calculate how relevant an expert is to the current topic"""
        
        spec_terms = specialization.lower().replace('_', ' ').split()
        relevance_score = 0.0
        
        for keyword in keywords:
            for spec_term in spec_terms:
                if keyword in spec_term or spec_term in keyword:
                    relevance_score += 1.0
                elif abs(len(keyword) - len(spec_term)) <= 2:  # Similar length heuristic
                    relevance_score += 0.3
        
        return relevance_score / len(keywords) if keywords else 0.0
    
    def get_cultural_context_summary(self) -> Dict[str, Any]:
        """Get summary of cultural context and compliance"""
        
        return {
            'group_id': self.cultural_context['group_id'],
            'domain': self.cultural_context['domain'],
            'decision_pattern': self.cultural_context['decision_pattern'],
            'participants_count': self.cultural_context['participants_count'],
            'cultural_compliance': {
                'total_validations': len(self.islamic_compliance_log),
                'violations': len(self.hierarchy_violations),
                'average_compliance': self._calculate_average_compliance(),
                'islamic_compliance_required': self.config.islamic_compliance_required
            },
            'hierarchy_analysis': self.cultural_context['hierarchy_levels'],
            'language_preferences': self.cultural_context['language_matrix'],
            'session_duration': self._calculate_session_duration()
        }
    
    def _calculate_average_compliance(self) -> float:
        """Calculate average cultural compliance score"""
        
        if not self.islamic_compliance_log:
            return 1.0
        
        total_score = sum(
            entry['confidence_score'] for entry in self.islamic_compliance_log
        )
        
        return total_score / len(self.islamic_compliance_log)
    
    def _calculate_session_duration(self) -> str:
        """Calculate session duration"""
        
        start_time = datetime.fromisoformat(self.cultural_context['session_start'])
        duration = datetime.now() - start_time
        
        hours, remainder = divmod(duration.total_seconds(), 3600)
        minutes, seconds = divmod(remainder, 60)
        
        return f"{int(hours):02d}:{int(minutes):02d}:{int(seconds):02d}"


class IraqiGroupChat(BaseGroupChat):
    """
    Iraqi-enhanced group chat with cultural context and multi-agent coordination
    """
    
    def __init__(
        self,
        participants: List[IraqiParticipant],
        model_client: Any,
        config: Optional[IraqiGroupConfig] = None,
        max_turns: int = 20,
        **kwargs
    ):
        # Set default config if not provided
        if config is None:
            config = IraqiGroupConfig(
                professional_domain=ProfessionalDomain.GENERAL,
                decision_pattern=IraqiDecisionPattern.COLLABORATIVE
            )
        
        # Create Iraqi group chat manager
        manager = IraqiGroupChatManager(
            model_client=model_client,
            config=config,
            participants=participants,
            max_turns=max_turns
        )
        
        super().__init__(
            participants=[p.agent for p in participants],
            group_chat_manager=manager,
            max_turns=max_turns,
            **kwargs
        )
        
        self.config = config
        self.iraqi_participants = participants
        self.manager = manager
    
    async def run_iraqi_consultation(
        self,
        initial_message: str,
        cultural_context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Run Iraqi group consultation with cultural validation
        
        Args:
            initial_message: Starting message for consultation
            cultural_context: Additional cultural context
            
        Returns:
            Consultation results with cultural compliance metrics
        """
        
        # Prepare culturally appropriate initial message
        formatted_message = self._format_cultural_greeting(initial_message)
        
        # Add cultural context if provided
        if cultural_context:
            self.manager.cultural_context.update(cultural_context)
        
        # Run group chat
        result = await self.run(stream=False, message=formatted_message)
        
        # Add cultural compliance summary
        cultural_summary = self.manager.get_cultural_context_summary()
        
        return {
            'consultation_result': result,
            'cultural_compliance': cultural_summary,
            'participants': [
                {
                    'id': p.agent.id,
                    'role': p.role.value,
                    'seniority': p.seniority_level,
                    'specialization': p.specialization
                }
                for p in self.iraqi_participants
            ],
            'decision_pattern': self.config.decision_pattern.value,
            'islamic_compliance_verified': all(
                entry['compliance_level'] != 'non_compliant' 
                for entry in self.manager.islamic_compliance_log
            )
        }
    
    def _format_cultural_greeting(self, message: str) -> str:
        """Format message with appropriate cultural greeting"""
        
        if self.config.islamic_compliance_required:
            if self.config.cultural_sensitivity_level == "religious":
                greeting = "بسم الله الرحمن الرحيم\nالسلام عليكم ورحمة الله وبركاته\n\n"
            else:
                greeting = "السلام عليكم ورحمة الله\n\n"
        else:
            greeting = "تحية طيبة وبعد\n\n"
        
        return greeting + message
    
    def get_participant_summary(self) -> Dict[str, Any]:
        """Get summary of Iraqi participants and their roles"""
        
        return {
            'total_participants': len(self.iraqi_participants),
            'role_distribution': {
                role.value: sum(1 for p in self.iraqi_participants if p.role == role)
                for role in IraqiGroupRole
            },
            'seniority_distribution': {
                'senior': sum(1 for p in self.iraqi_participants if p.seniority_level >= 8),
                'mid': sum(1 for p in self.iraqi_participants if 5 <= p.seniority_level < 8),
                'junior': sum(1 for p in self.iraqi_participants if p.seniority_level < 5)
            },
            'specializations': list(set(p.specialization for p in self.iraqi_participants)),
            'language_preferences': {
                'arabic': sum(1 for p in self.iraqi_participants if p.language_preference == 'arabic'),
                'english': sum(1 for p in self.iraqi_participants if p.language_preference == 'english'),
                'mixed': sum(1 for p in self.iraqi_participants if p.language_preference == 'mixed')
            },
            'cultural_context': {
                'domain': self.config.professional_domain.value,
                'decision_pattern': self.config.decision_pattern.value,
                'islamic_compliance': self.config.islamic_compliance_required,
                'cultural_sensitivity': self.config.cultural_sensitivity_level
            }
        }