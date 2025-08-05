"""
Iraqi Cultural Validator for AutoGen Multi-Agent Systems

Provides Islamic compliance validation, Arabic language processing,
and Iraqi cultural appropriateness checks for multi-agent interactions.
"""

from typing import Any, Dict, List, Optional, Union
from enum import Enum
from dataclasses import dataclass
from datetime import datetime
import re
import json


class CulturalCompliance(Enum):
    """Levels of Islamic and cultural compliance"""
    COMPLIANT = "compliant"
    QUESTIONABLE = "questionable" 
    NON_COMPLIANT = "non_compliant"
    REQUIRES_REVIEW = "requires_review"


class ProfessionalDomain(Enum):
    """Iraqi professional domains with specific cultural requirements"""
    LEGAL = "legal"
    MEDICAL = "medical"
    EDUCATIONAL = "educational"
    GOVERNMENT = "government"
    BUSINESS = "business"
    ENGINEERING = "engineering"
    RELIGIOUS = "religious"
    GENERAL = "general"


@dataclass
class CulturalValidationResult:
    """Result of cultural validation check"""
    compliance_level: CulturalCompliance
    domain: ProfessionalDomain
    issues: List[str]
    recommendations: List[str]
    confidence_score: float
    requires_human_review: bool = False


class IraqiCulturalValidator:
    """
    Validates multi-agent communications for Islamic compliance
    and Iraqi cultural appropriateness.
    """
    
    def __init__(self):
        # Islamic compliance keywords
        self.prohibited_terms = {
            # Financial/Business - Haram practices
            'riba', 'interest_banking', 'gambling', 'lottery', 'casino',
            'alcohol_trade', 'pork_industry', 'adult_entertainment',
            
            # Religious - Sensitive terms requiring careful handling
            'shirk', 'kufr', 'bidah', 'sectarian_conflict',
            
            # Cultural - Inappropriate social practices
            'mixed_gender_private', 'unmarried_cohabitation',
            'public_drinking', 'nightclub_culture'
        }
        
        # Professional hierarchy respect terms
        self.respect_indicators = {
            'ustaz', 'doctor', 'mohandis', 'hajj', 'haji',
            'sayyid', 'sheikh', 'professor', 'director',
            'minister', 'excellency', 'your_honor'
        }
        
        # Iraqi dialect terms (positive cultural markers)
        self.iraqi_dialect_markers = {
            'shlonak', 'aku', 'maku', 'yalla', 'habibi',
            'wallah', 'inshallah', 'mashallah', 'barakallahu_feek'
        }
        
        # Professional domains context
        self.domain_contexts = {
            ProfessionalDomain.LEGAL: {
                'required_terms': ['shariah_compliant', 'halal_practice', 'islamic_law'],
                'prohibited_terms': ['interest_based', 'haram_contract', 'riba_transaction']
            },
            ProfessionalDomain.MEDICAL: {
                'required_terms': ['patient_dignity', 'gender_appropriate', 'family_consent'],
                'prohibited_terms': ['mixed_gender_treatment', 'against_islamic_ethics']
            },
            ProfessionalDomain.EDUCATIONAL: {
                'required_terms': ['islamic_values', 'cultural_respect', 'moral_education'],
                'prohibited_terms': ['secular_only', 'anti_religious']
            }
        }
    
    def validate_message_content(
        self, 
        content: str, 
        domain: ProfessionalDomain = ProfessionalDomain.GENERAL,
        sender_role: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> CulturalValidationResult:
        """
        Validate message content for cultural appropriateness
        
        Args:
            content: Message content to validate
            domain: Professional domain context
            sender_role: Role of the message sender (for hierarchy respect)
            context: Additional context for validation
            
        Returns:
            CulturalValidationResult with compliance assessment
        """
        issues = []
        recommendations = []
        compliance_level = CulturalCompliance.COMPLIANT
        confidence_score = 0.9
        
        # Check for prohibited terms
        content_lower = content.lower()
        found_prohibited = [term for term in self.prohibited_terms 
                          if term in content_lower]
        
        if found_prohibited:
            issues.append(f"Contains prohibited terms: {found_prohibited}")
            compliance_level = CulturalCompliance.NON_COMPLIANT
            recommendations.append("Remove or replace prohibited terms with Islamic alternatives")
            confidence_score -= 0.3
        
        # Check professional hierarchy respect
        if sender_role and not self._shows_appropriate_respect(content, sender_role):
            issues.append("Does not show appropriate professional hierarchy respect")
            compliance_level = CulturalCompliance.QUESTIONABLE
            recommendations.append("Add appropriate respectful address and language")
            confidence_score -= 0.2
        
        # Check domain-specific requirements
        domain_issues = self._validate_domain_requirements(content, domain)
        issues.extend(domain_issues)
        if domain_issues:
            compliance_level = CulturalCompliance.REQUIRES_REVIEW
            recommendations.append(f"Ensure content meets {domain.value} professional standards")
            confidence_score -= 0.1
        
        # Check for cultural sensitivity
        sensitivity_issues = self._check_cultural_sensitivity(content)
        issues.extend(sensitivity_issues)
        if sensitivity_issues:
            compliance_level = CulturalCompliance.QUESTIONABLE
            recommendations.append("Review content for cultural sensitivity")
            confidence_score -= 0.1
        
        # Positive indicators (Iraqi dialect, respect terms)
        if any(marker in content_lower for marker in self.iraqi_dialect_markers):
            confidence_score += 0.1
            recommendations.append("Good use of Iraqi cultural expressions")
        
        if any(respect in content_lower for respect in self.respect_indicators):
            confidence_score += 0.1
            recommendations.append("Appropriate use of respectful language")
        
        # Final confidence adjustment
        confidence_score = max(0.0, min(1.0, confidence_score))
        
        return CulturalValidationResult(
            compliance_level=compliance_level,
            domain=domain,
            issues=issues,
            recommendations=recommendations,
            confidence_score=confidence_score,
            requires_human_review=(
                compliance_level in [CulturalCompliance.NON_COMPLIANT, 
                                   CulturalCompliance.REQUIRES_REVIEW]
                or confidence_score < 0.6
            )
        )
    
    def validate_multi_agent_conversation(
        self,
        messages: List[Dict[str, Any]],
        conversation_context: Dict[str, Any]
    ) -> CulturalValidationResult:
        """
        Validate entire multi-agent conversation for cultural appropriateness
        
        Args:
            messages: List of messages in conversation
            conversation_context: Context including participants, domain, etc.
            
        Returns:
            Overall cultural validation result
        """
        all_issues = []
        all_recommendations = []
        overall_compliance = CulturalCompliance.COMPLIANT
        confidence_scores = []
        
        domain = ProfessionalDomain(conversation_context.get('domain', 'general'))
        
        for i, message in enumerate(messages):
            content = message.get('content', '')
            sender = message.get('sender', 'unknown')
            role = message.get('role', None)
            
            # Validate individual message
            result = self.validate_message_content(
                content=content,
                domain=domain,
                sender_role=role,
                context=conversation_context
            )
            
            # Collect issues and recommendations
            if result.issues:
                all_issues.extend([f"Message {i+1} ({sender}): {issue}" 
                                 for issue in result.issues])
            all_recommendations.extend(result.recommendations)
            confidence_scores.append(result.confidence_score)
            
            # Update overall compliance (worst case)
            if (result.compliance_level == CulturalCompliance.NON_COMPLIANT 
                or overall_compliance == CulturalCompliance.COMPLIANT):
                overall_compliance = result.compliance_level
        
        # Check conversation-level patterns
        conversation_issues = self._validate_conversation_patterns(
            messages, conversation_context
        )
        all_issues.extend(conversation_issues)
        
        # Calculate overall confidence
        overall_confidence = sum(confidence_scores) / len(confidence_scores) if confidence_scores else 0.5
        
        return CulturalValidationResult(
            compliance_level=overall_compliance,
            domain=domain,
            issues=list(set(all_issues)),  # Remove duplicates
            recommendations=list(set(all_recommendations)),
            confidence_score=overall_confidence,
            requires_human_review=(
                overall_compliance in [CulturalCompliance.NON_COMPLIANT,
                                     CulturalCompliance.REQUIRES_REVIEW]
                or overall_confidence < 0.6
            )
        )
    
    def get_cultural_guidelines(self, domain: ProfessionalDomain) -> Dict[str, Any]:
        """
        Get cultural guidelines for specific professional domain
        
        Args:
            domain: Professional domain
            
        Returns:
            Dictionary of cultural guidelines and requirements
        """
        base_guidelines = {
            'language': {
                'required': [
                    'Use respectful address (Ustaz, Doctor, etc.)',
                    'Include Islamic greetings when appropriate',
                    'Acknowledge Allah\'s will (Inshallah, Mashallah)'
                ],
                'prohibited': [
                    'Disrespectful language',
                    'Inappropriate mixing of genders in context',
                    'References to haram activities'
                ]
            },
            'behavior': {
                'required': [
                    'Show respect for hierarchy',
                    'Maintain professional boundaries',
                    'Consider family and community impact'
                ],
                'prohibited': [
                    'Disregard for Islamic principles',
                    'Inappropriate social suggestions',
                    'Disrespect for cultural values'
                ]
            }
        }
        
        # Add domain-specific guidelines
        if domain in self.domain_contexts:
            domain_specific = self.domain_contexts[domain]
            base_guidelines['domain_specific'] = domain_specific
        
        return base_guidelines
    
    def _shows_appropriate_respect(self, content: str, sender_role: str) -> bool:
        """Check if content shows appropriate hierarchy respect"""
        content_lower = content.lower()
        
        # If sender is junior, should show respect to seniors
        junior_roles = ['assistant', 'junior', 'student', 'intern']
        senior_roles = ['doctor', 'professor', 'director', 'manager', 'senior']
        
        if sender_role.lower() in junior_roles:
            # Should contain respectful language
            return any(respect in content_lower for respect in self.respect_indicators)
        
        # Senior roles have more flexibility but should still be respectful
        return True
    
    def _validate_domain_requirements(self, content: str, domain: ProfessionalDomain) -> List[str]:
        """Validate domain-specific cultural requirements"""
        issues = []
        
        if domain not in self.domain_contexts:
            return issues
        
        domain_config = self.domain_contexts[domain]
        content_lower = content.lower()
        
        # Check required terms for domain
        required_terms = domain_config.get('required_terms', [])
        if required_terms:
            missing_required = [term for term in required_terms 
                              if term not in content_lower]
            if missing_required and len(content) > 100:  # Only for substantial content
                issues.append(f"Missing {domain.value} required elements: {missing_required}")
        
        # Check prohibited terms for domain
        prohibited_terms = domain_config.get('prohibited_terms', [])
        found_prohibited = [term for term in prohibited_terms 
                          if term in content_lower]
        if found_prohibited:
            issues.append(f"Contains {domain.value} prohibited elements: {found_prohibited}")
        
        return issues
    
    def _check_cultural_sensitivity(self, content: str) -> List[str]:
        """Check for cultural sensitivity issues"""
        issues = []
        
        # Check for potential cultural insensitivity patterns
        sensitive_patterns = [
            (r'\b(sect|sunni|shia)\b', "Avoid sectarian references"),
            (r'\b(politics|political party)\b', "Avoid political discussions"),
            (r'\b(tribe|tribal)\b', "Be careful with tribal references"),
            (r'\b(western culture|foreign values)\b', "Be respectful when discussing cultural differences")
        ]
        
        for pattern, message in sensitive_patterns:
            if re.search(pattern, content, re.IGNORECASE):
                issues.append(message)
        
        return issues
    
    def _validate_conversation_patterns(
        self, 
        messages: List[Dict[str, Any]], 
        context: Dict[str, Any]
    ) -> List[str]:
        """Validate conversation-level cultural patterns"""
        issues = []
        
        # Check for appropriate conversation flow
        if len(messages) > 1:
            # First message should include greeting in Iraqi professional context
            first_message = messages[0].get('content', '').lower()
            if 'salam' not in first_message and 'greeting' not in first_message:
                issues.append("Professional conversations should begin with appropriate greeting")
        
        # Check for gender-appropriate communication patterns
        mixed_gender_participants = context.get('mixed_gender', False)
        if mixed_gender_participants:
            # Ensure professional boundaries are maintained
            personal_topics = ['family', 'personal life', 'private matters']
            for message in messages:
                content = message.get('content', '').lower()
                if any(topic in content for topic in personal_topics):
                    issues.append("Maintain professional boundaries in mixed-gender discussions")
                    break
        
        return issues


class IraqiProfessionalHierarchy:
    """
    Manages Iraqi professional hierarchy patterns for multi-agent coordination
    """
    
    def __init__(self):
        self.hierarchy_levels = {
            'senior_executive': 5,  # Minister, CEO, Director General
            'senior_professional': 4,  # Doctor, Professor, Senior Engineer
            'mid_professional': 3,  # Manager, Senior Staff
            'junior_professional': 2,  # Staff, Assistant
            'trainee': 1  # Intern, Student
        }
        
        self.decision_patterns = {
            'consensus_required': ['religious_matters', 'cultural_policies'],
            'senior_approval': ['budget_decisions', 'policy_changes'],
            'collaborative': ['project_planning', 'professional_consultation'],
            'individual': ['routine_tasks', 'specialized_knowledge']
        }
    
    def get_coordination_pattern(
        self, 
        participants: List[Dict[str, Any]], 
        task_type: str
    ) -> Dict[str, Any]:
        """
        Determine appropriate coordination pattern based on Iraqi hierarchy
        
        Args:
            participants: List of agent participants with roles and levels
            task_type: Type of task for coordination
            
        Returns:
            Coordination pattern with decision flow and communication rules
        """
        # Determine highest hierarchy level
        max_level = max(
            self.hierarchy_levels.get(p.get('level', 'junior_professional'), 2)
            for p in participants
        )
        
        # Determine decision pattern
        decision_type = 'individual'
        for pattern_type, task_types in self.decision_patterns.items():
            if task_type in task_types:
                decision_type = pattern_type
                break
        
        return {
            'decision_type': decision_type,
            'primary_authority': max_level,
            'communication_rules': self._get_communication_rules(participants),
            'cultural_considerations': self._get_cultural_considerations(task_type)
        }
    
    def _get_communication_rules(self, participants: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Get communication rules based on participant hierarchy"""
        return {
            'respect_hierarchy': True,
            'formal_address': True,
            'senior_speaks_first': True,
            'consensus_building': 'iraqi_style',
            'cultural_greetings': True
        }
    
    def _get_cultural_considerations(self, task_type: str) -> List[str]:
        """Get cultural considerations for task type"""
        considerations = [
            'Maintain Islamic values',
            'Respect professional hierarchy',
            'Consider family and community impact',
            'Build consensus respectfully'
        ]
        
        if 'legal' in task_type:
            considerations.extend([
                'Ensure Shariah compliance',
                'Consider Iraqi legal framework',
                'Respect traditional legal practices'
            ])
        elif 'medical' in task_type:
            considerations.extend([
                'Maintain patient dignity',
                'Consider gender-appropriate care',
                'Involve family in decisions when appropriate'
            ])
        elif 'educational' in task_type:
            considerations.extend([
                'Integrate Islamic values',
                'Respect parental authority',
                'Consider community standards'
            ])
        
        return considerations