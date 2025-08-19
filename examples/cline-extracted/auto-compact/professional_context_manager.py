"""
Professional Context Manager - Iraqi Professional Domain Context Preservation for Auto Compact

Extracted from: cline/src/core/prompts/contextManagement.ts
Enhanced for: Iraqi AI Chat System with comprehensive professional domain context preservation

Core Features:
1. Professional Domain Context Preservation
2. Iraqi Professional Standards Tracking
3. Domain-Specific Decision Management
4. Professional Terminology Preservation
5. Compliance Requirements Validation

Iraqi Enhancements:
- Iraqi professional standards integration
- Domain-specific cultural context preservation
- Professional terminology in Arabic and English
- Iraqi regulatory compliance tracking
- Professional workflow state preservation
- Cross-domain professional interaction patterns
- Iraqi professional hierarchy and etiquette
"""

from dataclasses import dataclass
from typing import Dict, List, Optional, Any, Tuple
from enum import Enum
from datetime import datetime
import asyncio
import json

class IraqiProfessionalDomain(str, Enum):
    LEGAL = "legal"                      # Iraqi legal system, courts, law
    MEDICAL = "medical"                  # Healthcare, hospitals, medical practice
    EDUCATION = "education"              # Schools, universities, academic institutions
    GOVERNMENT = "government"            # Ministries, public service, bureaucracy
    ENGINEERING = "engineering"          # Construction, infrastructure, technical
    FINANCE = "finance"                  # Banking, investment, financial services
    TECHNOLOGY = "technology"            # IT, software, digital services
    BUSINESS = "business"                # Commerce, trade, entrepreneurship
    AGRICULTURE = "agriculture"          # Farming, irrigation, rural development
    OIL_GAS = "oil_gas"                 # Petroleum, energy sector
    GENERAL = "general"                  # General professional context

class ProfessionalContextType(str, Enum):
    DECISION_MAKING = "decision_making"         # Professional decisions and rationale
    TERMINOLOGY = "terminology"                 # Domain-specific terminology
    WORKFLOW = "workflow"                       # Professional workflows and processes
    COMPLIANCE = "compliance"                   # Regulatory and standards compliance
    HIERARCHY = "hierarchy"                     # Professional hierarchy and authority
    COMMUNICATION = "communication"             # Professional communication patterns
    STANDARDS = "standards"                     # Professional standards and practices

class IraqiComplianceFramework(str, Enum):
    IRAQI_LAW = "iraqi_law"                    # Iraqi legal framework
    MINISTRY_REGULATIONS = "ministry_regulations"   # Ministry-specific regulations
    PROFESSIONAL_ETHICS = "professional_ethics"     # Professional ethics codes
    ISLAMIC_FINANCE = "islamic_finance"        # Islamic finance principles
    GOVERNMENT_STANDARDS = "government_standards"   # Government service standards
    INTERNATIONAL_STANDARDS = "international_standards"  # International compliance
    CULTURAL_REQUIREMENTS = "cultural_requirements"     # Cultural compliance needs

@dataclass
class ProfessionalDecision:
    """Professional decision with Iraqi context"""
    decision_id: str
    domain: IraqiProfessionalDomain
    context_type: ProfessionalContextType
    content: str
    arabic_terminology: List[str]
    english_terminology: List[str]
    compliance_frameworks: List[IraqiComplianceFramework]
    cultural_considerations: Dict[str, Any]
    hierarchy_level: str
    preservation_priority: int
    professional_impact_score: float

@dataclass
class IraqiProfessionalStandards:
    """Iraqi professional standards and requirements"""
    domain: IraqiProfessionalDomain
    regulatory_requirements: List[str]
    cultural_requirements: List[str]
    language_requirements: Dict[str, Any]
    hierarchy_structure: Dict[str, Any]
    communication_protocols: List[str]
    compliance_thresholds: Dict[str, float]

@dataclass
class ProfessionalWorkflowState:
    """Professional workflow state preservation"""
    workflow_id: str
    domain: IraqiProfessionalDomain
    current_stage: str
    completed_stages: List[str]
    pending_stages: List[str]
    decision_points: List[Dict[str, Any]]
    stakeholder_context: Dict[str, Any]
    compliance_status: Dict[str, Any]
    preservation_requirements: List[str]

@dataclass
class ProfessionalContextSummary:
    """Professional context preservation summary"""
    primary_domain: IraqiProfessionalDomain
    preserved_decisions: List[ProfessionalDecision]
    active_workflows: List[ProfessionalWorkflowState]
    professional_terminology: Dict[str, List[str]]
    compliance_status: Dict[str, Any]
    cultural_adaptations: Dict[str, Any]
    hierarchy_interactions: List[str]
    preservation_quality_score: float

class ProfessionalContextManager:
    """
    Manages Iraqi professional domain context preservation during Auto Compact
    
    Handles:
    - Professional domain context preservation across Iraqi sectors
    - Domain-specific decision tracking and validation
    - Professional terminology preservation (Arabic/English)
    - Iraqi regulatory compliance context management
    - Professional workflow state preservation
    - Cultural adaptation for professional interactions
    - Professional hierarchy and authority patterns
    """
    
    def __init__(self):
        self.domain_analyzer = ProfessionalDomainAnalyzer()
        self.terminology_manager = ProfessionalTerminologyManager()
        self.compliance_tracker = IraqiComplianceTracker()
        self.workflow_state_manager = WorkflowStateManager()
        self.hierarchy_analyzer = ProfessionalHierarchyAnalyzer()
        self.cultural_adapter = ProfessionalCulturalAdapter()
        
        # Professional context configuration
        self.config = {
            "min_professional_preservation": 0.90,
            "preserve_terminology": True,
            "preserve_workflows": True,
            "preserve_compliance_context": True,
            "preserve_hierarchy_patterns": True,
            "max_decisions_preserved": 75,
            "domain_preservation_weights": {
                "legal": 0.95,           # Highest - legal decisions critical
                "medical": 0.94,         # High - patient safety critical
                "government": 0.93,      # High - public service critical
                "education": 0.90,       # High - educational standards important
                "finance": 0.92,         # High - financial compliance important
                "engineering": 0.89,     # Medium-high - safety standards
                "technology": 0.85,      # Medium - less regulated
                "business": 0.82,        # Medium - commercial context
                "agriculture": 0.80,     # Medium-low - traditional practices
                "oil_gas": 0.91,        # High - strategic sector
                "general": 0.75         # Lower - general professional context
            }
        }
    
    async def extract_professional_decisions(self, 
                                           conversation_history: List[Dict[str, Any]], 
                                           professional_domain: str) -> Dict[str, Any]:
        """
        Extract professional domain decisions and context
        
        Args:
            conversation_history: Complete conversation history
            professional_domain: Primary professional domain
            
        Returns:
            Comprehensive professional context summary
        """
        
        # Convert domain string to enum
        domain_enum = self._convert_to_domain_enum(professional_domain)
        
        # Extract professional decisions by type
        decisions = await self._extract_professional_decisions_by_type(
            conversation_history, domain_enum
        )
        
        # Analyze professional workflows
        workflows = await self._analyze_professional_workflows(
            conversation_history, domain_enum
        )
        
        # Extract professional terminology
        terminology = await self._extract_professional_terminology(
            conversation_history, domain_enum
        )
        
        # Analyze compliance requirements
        compliance = await self._analyze_compliance_requirements(
            conversation_history, domain_enum
        )
        
        # Extract hierarchy and authority patterns
        hierarchy_patterns = await self._extract_hierarchy_patterns(
            conversation_history, domain_enum
        )
        
        # Analyze cultural adaptations
        cultural_adaptations = await self._analyze_cultural_adaptations(
            conversation_history, domain_enum
        )
        
        # Prioritize and filter decisions
        prioritized_decisions = await self._prioritize_professional_decisions(
            decisions, domain_enum
        )
        
        # Calculate preservation metrics
        preservation_metrics = await self._calculate_professional_preservation_metrics(
            prioritized_decisions, terminology, compliance, workflows
        )
        
        return {
            "primary_domain": professional_domain,
            "professional_decisions": [
                {
                    "id": decision.decision_id,
                    "type": decision.context_type.value,
                    "content": decision.content,
                    "arabic_terminology": decision.arabic_terminology,
                    "english_terminology": decision.english_terminology,
                    "compliance_frameworks": [cf.value for cf in decision.compliance_frameworks],
                    "preservation_priority": decision.preservation_priority
                }
                for decision in prioritized_decisions
            ],
            "domain_expertise_applied": [
                f"{professional_domain} terminology preservation",
                f"Iraqi {professional_domain} standards compliance",
                f"Cultural adaptation for {professional_domain} context"
            ],
            "compliance_requirements": compliance,
            "professional_workflows": [
                {
                    "workflow_id": wf.workflow_id,
                    "current_stage": wf.current_stage,
                    "completion_status": len(wf.completed_stages) / (len(wf.completed_stages) + len(wf.pending_stages)) if (wf.completed_stages or wf.pending_stages) else 1.0,
                    "compliance_status": wf.compliance_status
                }
                for wf in workflows
            ],
            "terminology_preservation": terminology,
            "hierarchy_patterns": hierarchy_patterns,
            "cultural_adaptations": cultural_adaptations,
            "preservation_priority": "high",
            "preservation_quality_score": preservation_metrics["overall_score"],
            "domain_compliance_score": preservation_metrics["compliance_score"]
        }
    
    async def validate_preservation(self, 
                                  summary: Dict[str, Any], 
                                  original_context: Dict[str, Any]) -> float:
        """
        Validate quality of professional context preservation
        
        Args:
            summary: Professional context summary
            original_context: Original professional context
            
        Returns:
            Professional preservation quality score (0.0-1.0)
        """
        
        domain = summary.get("primary_domain", "general")
        domain_weight = self.config["domain_preservation_weights"].get(domain, 0.75)
        
        # Validate decision preservation
        decision_preservation = await self._validate_decision_preservation(summary, original_context)
        
        # Validate terminology preservation
        terminology_preservation = await self._validate_terminology_preservation(summary, original_context)
        
        # Validate compliance preservation
        compliance_preservation = await self._validate_compliance_preservation(summary, original_context)
        
        # Validate workflow preservation
        workflow_preservation = await self._validate_workflow_preservation(summary, original_context)
        
        # Calculate weighted preservation score
        weighted_score = (
            decision_preservation * 0.35 +
            terminology_preservation * 0.25 +
            compliance_preservation * 0.25 +
            workflow_preservation * 0.15
        ) * domain_weight
        
        return min(weighted_score, 1.0)
    
    # Internal extraction methods
    
    async def _extract_professional_decisions_by_type(self, 
                                                    conversation_history: List[Dict[str, Any]], 
                                                    domain: IraqiProfessionalDomain) -> List[ProfessionalDecision]:
        """Extract professional decisions categorized by type"""
        decisions = []
        
        for i, message in enumerate(conversation_history):
            content = str(message.get("content", ""))
            
            # Check for professional content relevant to domain
            if await self._contains_professional_content(content, domain):
                
                # Identify professional context type
                context_type = await self._identify_professional_context_type(content, domain)
                
                # Extract terminology
                arabic_terms = await self._extract_arabic_terminology(content, domain)
                english_terms = await self._extract_english_terminology(content, domain)
                
                # Identify compliance frameworks
                compliance_frameworks = await self._identify_compliance_frameworks(content, domain)
                
                # Analyze cultural considerations
                cultural_considerations = await self._analyze_cultural_considerations(content, domain)
                
                # Determine hierarchy level
                hierarchy_level = await self._determine_hierarchy_level(content, domain)
                
                # Calculate preservation priority and impact
                preservation_priority = await self._calculate_professional_preservation_priority(
                    context_type, domain, compliance_frameworks
                )
                impact_score = await self._calculate_professional_impact_score(
                    content, domain, context_type
                )
                
                decision = ProfessionalDecision(
                    decision_id=f"prof_{domain.value}_{i}_{datetime.now().strftime('%H%M%S')}",
                    domain=domain,
                    context_type=context_type,
                    content=content,
                    arabic_terminology=arabic_terms,
                    english_terminology=english_terms,
                    compliance_frameworks=compliance_frameworks,
                    cultural_considerations=cultural_considerations,
                    hierarchy_level=hierarchy_level,
                    preservation_priority=preservation_priority,
                    professional_impact_score=impact_score
                )
                decisions.append(decision)
        
        return decisions
    
    async def _analyze_professional_workflows(self, 
                                            conversation_history: List[Dict[str, Any]], 
                                            domain: IraqiProfessionalDomain) -> List[ProfessionalWorkflowState]:
        """Analyze professional workflows in conversation"""
        workflows = []
        
        # Look for workflow indicators
        workflow_keywords = {
            IraqiProfessionalDomain.LEGAL: ["case", "hearing", "filing", "review", "judgment"],
            IraqiProfessionalDomain.MEDICAL: ["diagnosis", "treatment", "consultation", "follow-up", "discharge"],
            IraqiProfessionalDomain.EDUCATION: ["enrollment", "assessment", "graduation", "curriculum", "examination"],
            IraqiProfessionalDomain.GOVERNMENT: ["application", "approval", "processing", "verification", "issuance"],
            IraqiProfessionalDomain.ENGINEERING: ["design", "planning", "construction", "testing", "commissioning"],
            IraqiProfessionalDomain.FINANCE: ["application", "assessment", "approval", "disbursement", "monitoring"],
            IraqiProfessionalDomain.TECHNOLOGY: ["development", "testing", "deployment", "maintenance", "upgrade"],
            IraqiProfessionalDomain.BUSINESS: ["planning", "execution", "monitoring", "review", "optimization"]
        }
        
        domain_keywords = workflow_keywords.get(domain, ["process", "step", "stage", "phase"])
        
        for i, message in enumerate(conversation_history):
            content = str(message.get("content", "")).lower()
            
            # Check for workflow indicators
            if any(keyword in content for keyword in domain_keywords):
                
                # Extract workflow context
                workflow_context = await self._extract_workflow_context(content, domain)
                
                if workflow_context:
                    workflow = ProfessionalWorkflowState(
                        workflow_id=f"workflow_{domain.value}_{i}_{datetime.now().strftime('%H%M%S')}",
                        domain=domain,
                        current_stage=workflow_context.get("current_stage", "in_progress"),
                        completed_stages=workflow_context.get("completed_stages", []),
                        pending_stages=workflow_context.get("pending_stages", []),
                        decision_points=workflow_context.get("decision_points", []),
                        stakeholder_context=workflow_context.get("stakeholders", {}),
                        compliance_status=workflow_context.get("compliance", {}),
                        preservation_requirements=workflow_context.get("preservation_requirements", [])
                    )
                    workflows.append(workflow)
        
        return workflows
    
    async def _extract_professional_terminology(self, 
                                              conversation_history: List[Dict[str, Any]], 
                                              domain: IraqiProfessionalDomain) -> Dict[str, List[str]]:
        """Extract professional terminology in Arabic and English"""
        
        # Domain-specific terminology dictionaries
        domain_terminology = {
            IraqiProfessionalDomain.LEGAL: {
                "arabic": ["قانون", "محكمة", "قاضي", "محامي", "دعوى", "حكم", "قرار", "مرافعة"],
                "english": ["law", "court", "judge", "lawyer", "case", "judgment", "ruling", "hearing"]
            },
            IraqiProfessionalDomain.MEDICAL: {
                "arabic": ["طب", "طبيب", "مريض", "علاج", "تشخيص", "فحص", "وصفة", "مستشفى"],
                "english": ["medicine", "doctor", "patient", "treatment", "diagnosis", "examination", "prescription", "hospital"]
            },
            IraqiProfessionalDomain.EDUCATION: {
                "arabic": ["تعليم", "مدرسة", "جامعة", "طالب", "أستاذ", "منهج", "امتحان", "شهادة"],
                "english": ["education", "school", "university", "student", "professor", "curriculum", "exam", "certificate"]
            },
            IraqiProfessionalDomain.GOVERNMENT: {
                "arabic": ["حكومة", "وزارة", "موظف", "خدمة", "طلب", "موافقة", "رخصة", "تصريح"],
                "english": ["government", "ministry", "employee", "service", "application", "approval", "license", "permit"]
            }
        }
        
        terminology = {
            "arabic": [],
            "english": [],
            "technical": [],
            "cultural": []
        }
        
        domain_terms = domain_terminology.get(domain, {"arabic": [], "english": []})
        
        for message in conversation_history:
            content = str(message.get("content", ""))
            
            # Extract Arabic terminology
            for term in domain_terms["arabic"]:
                if term in content:
                    terminology["arabic"].append(term)
            
            # Extract English terminology
            for term in domain_terms["english"]:
                if term.lower() in content.lower():
                    terminology["english"].append(term)
            
            # Extract technical terminology
            technical_terms = await self._extract_technical_terminology(content, domain)
            terminology["technical"].extend(technical_terms)
            
            # Extract cultural terminology
            cultural_terms = await self._extract_cultural_terminology(content, domain)
            terminology["cultural"].extend(cultural_terms)
        
        # Remove duplicates and limit results
        for key in terminology:
            terminology[key] = list(set(terminology[key]))[:20]  # Limit to 20 terms per category
        
        return terminology
    
    # Helper methods
    
    def _convert_to_domain_enum(self, domain_str: str) -> IraqiProfessionalDomain:
        """Convert domain string to enum"""
        try:
            return IraqiProfessionalDomain(domain_str.lower())
        except ValueError:
            return IraqiProfessionalDomain.GENERAL
    
    async def _contains_professional_content(self, content: str, domain: IraqiProfessionalDomain) -> bool:
        """Check if content contains professional domain content"""
        content_lower = content.lower()
        
        domain_keywords = {
            IraqiProfessionalDomain.LEGAL: ["legal", "law", "court", "lawyer", "case", "judgment"],
            IraqiProfessionalDomain.MEDICAL: ["medical", "health", "doctor", "patient", "treatment", "diagnosis"],
            IraqiProfessionalDomain.EDUCATION: ["education", "school", "university", "student", "teacher", "curriculum"],
            IraqiProfessionalDomain.GOVERNMENT: ["government", "ministry", "service", "application", "approval", "license"],
            IraqiProfessionalDomain.ENGINEERING: ["engineering", "construction", "design", "technical", "infrastructure"],
            IraqiProfessionalDomain.FINANCE: ["finance", "bank", "investment", "loan", "credit", "payment"],
            IraqiProfessionalDomain.TECHNOLOGY: ["technology", "software", "system", "development", "programming"],
            IraqiProfessionalDomain.BUSINESS: ["business", "company", "management", "strategy", "marketing"],
            IraqiProfessionalDomain.AGRICULTURE: ["agriculture", "farming", "crop", "irrigation", "harvest"],
            IraqiProfessionalDomain.OIL_GAS: ["oil", "gas", "petroleum", "energy", "refinery", "drilling"]
        }
        
        keywords = domain_keywords.get(domain, ["professional", "work", "service"])
        return any(keyword in content_lower for keyword in keywords)
    
    async def _identify_professional_context_type(self, content: str, domain: IraqiProfessionalDomain) -> ProfessionalContextType:
        """Identify the type of professional context"""
        content_lower = content.lower()
        
        if any(word in content_lower for word in ["decision", "decide", "choose", "select"]):
            return ProfessionalContextType.DECISION_MAKING
        elif any(word in content_lower for word in ["workflow", "process", "procedure", "step"]):
            return ProfessionalContextType.WORKFLOW
        elif any(word in content_lower for word in ["compliance", "regulation", "standard", "requirement"]):
            return ProfessionalContextType.COMPLIANCE
        elif any(word in content_lower for word in ["hierarchy", "authority", "management", "supervisor"]):
            return ProfessionalContextType.HIERARCHY
        elif any(word in content_lower for word in ["communication", "meeting", "discussion", "presentation"]):
            return ProfessionalContextType.COMMUNICATION
        elif any(word in content_lower for word in ["terminology", "term", "definition", "vocabulary"]):
            return ProfessionalContextType.TERMINOLOGY
        else:
            return ProfessionalContextType.STANDARDS


# Supporting analyzer classes (simplified implementations)

class ProfessionalDomainAnalyzer:
    """Analyzes professional domain context"""
    
    async def analyze_domain(self, content: str) -> IraqiProfessionalDomain:
        """Analyze professional domain"""
        return IraqiProfessionalDomain.GENERAL

class ProfessionalTerminologyManager:
    """Manages professional terminology"""
    
    async def extract_terminology(self, content: str, domain: IraqiProfessionalDomain) -> Dict[str, List[str]]:
        """Extract professional terminology"""
        return {"arabic": [], "english": [], "technical": []}

class IraqiComplianceTracker:
    """Tracks Iraqi compliance requirements"""
    
    async def track_compliance(self, content: str, domain: IraqiProfessionalDomain) -> Dict[str, Any]:
        """Track compliance requirements"""
        return {"status": "compliant", "frameworks": ["iraqi_law"]}

class WorkflowStateManager:
    """Manages professional workflow states"""
    
    async def manage_workflow(self, content: str, domain: IraqiProfessionalDomain) -> Dict[str, Any]:
        """Manage workflow state"""
        return {"current_stage": "in_progress", "completion": 0.5}

class ProfessionalHierarchyAnalyzer:
    """Analyzes professional hierarchy patterns"""
    
    async def analyze_hierarchy(self, content: str, domain: IraqiProfessionalDomain) -> List[str]:
        """Analyze hierarchy patterns"""
        return ["senior_level", "decision_maker"]

class ProfessionalCulturalAdapter:
    """Adapts professional context for Iraqi culture"""
    
    async def adapt_context(self, content: str, domain: IraqiProfessionalDomain) -> Dict[str, Any]:
        """Adapt professional context culturally"""
        return {"cultural_adaptations": ["respect_hierarchy", "formal_communication"]}