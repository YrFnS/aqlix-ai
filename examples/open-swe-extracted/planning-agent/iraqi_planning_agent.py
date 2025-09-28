#!/usr/bin/env python3
"""
Iraqi AI Planning Agent System

Section 3E: Planning Agent System - Iraqi Cultural Intelligence

Extracted and enhanced from Open-SWE Planning Agent patterns with comprehensive
Iraqi cultural compliance, Arabic processing, and professional domain expertise.

Features:
- Cultural planning intelligence with Islamic principles integration
- Arabic context processing with RTL text handling
- Professional domain planning for Iraqi sectors
- Government service workflow planning
- Cultural appropriateness validation throughout planning
- Enhanced prompt system with Iraqi cultural context

Author: Iraqi AI Development Team
Date: 2025
Version: 1.0.0
"""

import asyncio
import json
import logging
import uuid
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional, Union, Callable
from pathlib import Path

# Core AI and workflow imports
try:
    from pydantic import BaseModel, Field, validator
    from pydantic_ai import Agent, RunContext
    from pydantic_ai.messages import ModelMessage
except ImportError:
    print("Warning: PydanticAI not available. Using fallback implementations.")
    from dataclasses import dataclass as BaseModel

    def Field(**kwargs):
        return field()

    def validator(*args, **kwargs):
        return lambda f: f

    Agent = None
    RunContext = None
    ModelMessage = None

# Setup logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("IraqiPlanningAgent")


class PlanningPhase(str, Enum):
    """Planning phases for Iraqi workflow orchestration."""

    CULTURAL_ANALYSIS = "cultural_analysis"
    CONTEXT_GATHERING = "context_gathering"
    PLAN_GENERATION = "plan_generation"
    CULTURAL_VALIDATION = "cultural_validation"
    ISLAMIC_COMPLIANCE = "islamic_compliance"
    PROFESSIONAL_REVIEW = "professional_review"
    FINALIZATION = "finalization"


class IraqiDomain(str, Enum):
    """Iraqi professional domains for specialized planning."""

    GOVERNMENT = "government"  # Ministry and department workflows
    LEGAL = "legal"  # Iraqi law and court systems
    MEDICAL = "medical"  # Healthcare and medical practices
    EDUCATIONAL = "educational"  # Schools and universities
    FINANCIAL = "financial"  # Banking and payment systems
    BUSINESS = "business"  # Commercial and trade
    RELIGIOUS = "religious"  # Islamic institutions
    CULTURAL = "cultural"  # Cultural preservation
    TECHNOLOGY = "technology"  # IT and digital services
    GENERAL = "general"  # General purpose


class CulturalContext(BaseModel):
    """Cultural context for Iraqi planning decisions."""

    islamic_compliance_score: float = Field(
        default=0.0, ge=0.0, le=1.0, description="Islamic compliance score (0-1)"
    )
    political_sensitivity: str = Field(
        default="neutral", description="Political sensitivity assessment"
    )
    family_appropriateness: bool = Field(
        default=True, description="Family and community appropriateness"
    )
    professional_domain: IraqiDomain = Field(
        default=IraqiDomain.GENERAL, description="Primary professional domain"
    )
    arabic_content_ratio: float = Field(
        default=0.0, ge=0.0, le=1.0, description="Percentage of Arabic content (0-1)"
    )
    dialect_region: str = Field(default="baghdad", description="Iraqi dialect region")

    def requires_cultural_validation(self) -> bool:
        """Check if cultural validation is required."""
        return (
            self.islamic_compliance_score < 0.95
            or self.political_sensitivity != "neutral"
            or not self.family_appropriateness
            or self.arabic_content_ratio > 0.1
        )


class PlanningState(BaseModel):
    """State management for Iraqi planning workflow."""

    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    phase: PlanningPhase = Field(default=PlanningPhase.CULTURAL_ANALYSIS)
    messages: List[Dict[str, Any]] = Field(default_factory=list)
    context_notes: List[str] = Field(default_factory=list)
    cultural_context: CulturalContext = Field(default_factory=CulturalContext)
    proposed_plan: List[str] = Field(default_factory=list)
    plan_title: str = Field(default="")
    technical_notes: List[str] = Field(default_factory=list)
    validation_results: Dict[str, Any] = Field(default_factory=dict)
    performance_metrics: Dict[str, float] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.now)

    def add_message(self, role: str, content: str, metadata: Optional[Dict] = None):
        """Add a message to the planning state."""
        message = {
            "id": str(uuid.uuid4()),
            "role": role,
            "content": content,
            "timestamp": datetime.now().isoformat(),
            "metadata": metadata or {},
        }
        self.messages.append(message)

    def get_user_request(self) -> str:
        """Extract the primary user request from messages."""
        for message in self.messages:
            if message.get("role") == "user":
                return message.get("content", "")
        return ""

    def get_conversation_history(self) -> str:
        """Format conversation history for prompts."""
        history = []
        for msg in self.messages:
            role = msg.get("role", "unknown")
            content = msg.get("content", "")
            history.append(f"**{role.upper()}**: {content}")
        return "\n\n".join(history)


class IraqiPlanningPrompts:
    """Enhanced prompt system with Iraqi cultural context."""

    CULTURAL_ANALYSIS_PROMPT = """
أنت مساعد ذكي متخصص في التخطيط الثقافي العراقي
You are an Iraqi Cultural Planning Intelligence specialist.

<identity>
You are a cultural planning assistant specifically designed for Iraqi contexts,
with deep understanding of Islamic principles, Iraqi customs, and professional
standards across Iraqi sectors.
</identity>

<cultural_guidelines>
1. **Islamic Compliance**: All planning must respect Islamic values and principles
2. **Political Neutrality**: Avoid sectarian, tribal, or politically sensitive content
3. **Family Values**: Ensure all plans support Iraqi family and community structures
4. **Professional Standards**: Adhere to Iraqi professional and regulatory requirements
5. **Arabic Integration**: Handle Arabic text with RTL awareness and dialect sensitivity
6. **Cultural Sensitivity**: Respect Iraqi traditions and social norms
</cultural_guidelines>

<task>
Analyze the user request for cultural context and requirements:
- Assess Islamic compliance needs (target: >95%)
- Identify professional domain requirements
- Evaluate Arabic/RTL content needs
- Determine cultural validation requirements
- Plan cultural validation checkpoints
</task>

<user_request>
{USER_REQUEST}
</user_request>

Provide your cultural analysis in JSON format with scores and recommendations.
"""

    CONTEXT_GATHERING_PROMPT = """
<identity>
You are an Iraqi AI Context Gathering Assistant with cultural intelligence.
You excel at understanding Iraqi codebases, Arabic content, and cultural requirements.
</identity>

<role>
Context Gathering Assistant - Read-Only Analysis Phase with Cultural Intelligence
</role>

<primary_objective>
Gather comprehensive context about the codebase with special attention to:
- Iraqi cultural compliance patterns
- Arabic/RTL content and processing
- Islamic principle implementations
- Professional domain requirements
- Government service patterns
- Payment gateway integrations (ZainCash, FastPay, NassWallet)
</primary_objective>

{FOLLOWUP_MESSAGE_PROMPT}

<cultural_context_guidelines>
1. **Cultural Pattern Recognition**:
   - Look for existing cultural validation patterns
   - Identify Arabic/RTL handling implementations
   - Find Islamic compliance checks and patterns
   - Assess professional domain implementations

2. **Iraqi-Specific Analysis**:
   - Examine payment gateway integrations
   - Review government service implementations
   - Check Arabic language processing capabilities
   - Validate cultural appropriateness patterns

3. **Technical Cultural Integration**:
   - Analyze existing cultural validation workflows
   - Review Arabic NLP and RTL processing
   - Examine Islamic compliance automation
   - Check professional standard implementations
</cultural_context_guidelines>

<enhanced_search_strategy>
1. **Cultural Code Patterns**: Search for cultural validation, Islamic compliance, Arabic processing
2. **Iraqi Service Patterns**: Look for government services, ministry integrations, Iraqi workflows
3. **Payment Systems**: Examine ZainCash, FastPay, NassWallet integrations
4. **Language Processing**: Find Arabic NLP, RTL layouts, dialect handling
5. **Professional Domains**: Search for legal, medical, educational implementations
</enhanced_search_strategy>

<workspace_information>
    <current_working_directory>{CURRENT_WORKING_DIRECTORY}</current_working_directory>
    <repository_status>Iraqi AI codebase - cultural compliance enabled</repository_status>
    {LOCAL_MODE_NOTE}
    
    <codebase_tree>
        {CODEBASE_TREE}
    </codebase_tree>
</workspace_information>

<cultural_requirements>
{CUSTOM_RULES}
</cultural_requirements>

<user_request_context>
{USER_REQUEST_PROMPT}
</user_request_context>

Focus your context gathering on information that will enable culturally-compliant planning.
"""

    PLAN_GENERATION_PROMPT = """
أنت خبير في التخطيط التقني العراقي
You are an Iraqi Technical Planning Expert with cultural intelligence.

<identity>
You are a specialized Iraqi AI planning agent that creates technically excellent
and culturally compliant execution plans. You understand Iraqi professional
standards, Islamic principles, and Arabic processing requirements.
</identity>

<context>
{FOLLOWUP_MESSAGE_PROMPT}
You have gathered comprehensive context from the Iraqi AI codebase through
the conversation history below. All previous messages will be deleted after
this planning step, so your plan must be self-contained and culturally validated.
</context>

<task>
Generate a culturally-compliant execution plan to address the user's request.
Your plan will guide the implementation phase with Iraqi cultural intelligence.

<user_request>
{USER_REQUEST_PROMPT}
</user_request>
</task>

<iraqi_planning_guidelines>
1. **Cultural Integration Structure**:
   - Start each major phase with cultural validation
   - Include Islamic compliance checkpoints
   - Integrate Arabic/RTL processing where needed
   - Validate professional domain requirements

2. **Iraqi-Specific Implementation**:
   - Use Iraqi cultural validation agents
   - Implement Arabic processing with RTL support
   - Include payment gateway security (ZainCash/FastPay/NassWallet)
   - Follow Iraqi professional standards

3. **Cultural Compliance Planning**:
   - Plan for 95%+ Islamic compliance validation
   - Include family-appropriate content checks
   - Integrate political neutrality validation
   - Plan Arabic dialect processing

4. **Technical Excellence with Culture**:
   - Combine technical requirements with cultural needs
   - Plan for culturally-aware error handling
   - Include cultural performance metrics
   - Design culturally-appropriate user experiences

5. **Professional Domain Integration**:
   - Include sector-specific requirements (legal/medical/educational)
   - Plan government service compliance
   - Integrate ministry workflow patterns
   - Include regulatory compliance steps
</iraqi_planning_guidelines>

<enhanced_planning_instructions>
1. **Cultural-Technical Integration**: Each technical step must include cultural validation
2. **Arabic Processing**: Include RTL handling, dialect processing, mixed content support
3. **Islamic Compliance**: Plan validation steps for Islamic principle adherence
4. **Professional Standards**: Include Iraqi sector-specific requirements
5. **Government Integration**: Plan for ministry and department workflows
6. **Payment Security**: Include comprehensive Iraqi payment gateway testing
7. **Family Appropriateness**: Ensure all content meets Iraqi family standards
</enhanced_planning_instructions>

<output_format>
When ready, call the 'session_plan' tool with your culturally-intelligent plan.
Each plan item should integrate technical excellence with cultural compliance.

Structure plan items with cultural awareness:
- "Implement X feature with Iraqi cultural validation using agent Y"
- "Create Arabic RTL interface Z with dialect support for Iraqi users"
- "Validate Islamic compliance of payment flow using Iraqi security patterns"
</output_format>

<cultural_requirements>
{CUSTOM_RULES}
</cultural_requirements>

<context_notes>
{SCRATCHPAD}
</context_notes>

Remember: Create a focused, culturally-intelligent plan that efficiently accomplishes
the user's request while maintaining Iraqi cultural authenticity and compliance.
"""

    CULTURAL_VALIDATION_PROMPT = """
أنت مختص في التحقق من الامتثال الثقافي العراقي
You are an Iraqi Cultural Compliance Validation Specialist.

<identity>
You validate all plans for Iraqi cultural compliance, Islamic principles,
and professional standards. You ensure technical excellence with cultural authenticity.
</identity>

<validation_framework>
1. **Islamic Compliance Validation** (Target: 95%+):
   - Check adherence to Islamic principles
   - Validate halal content and processes
   - Ensure prayer time considerations
   - Verify family-appropriate content

2. **Political Neutrality Assessment**:
   - Avoid sectarian references
   - Maintain tribal neutrality
   - Ensure political balance
   - Respect diverse Iraqi perspectives

3. **Professional Standards Validation**:
   - Verify sector-specific requirements
   - Check regulatory compliance
   - Validate Iraqi professional practices
   - Ensure ministry workflow compatibility

4. **Arabic/Language Processing**:
   - Validate RTL text handling
   - Check Iraqi dialect recognition
   - Ensure proper Arabic typography
   - Verify mixed Arabic-English processing

5. **Cultural Appropriateness**:
   - Assess family and community values
   - Check traditional respect
   - Validate social norm compliance
   - Ensure cultural sensitivity
</validation_framework>

<proposed_plan>
{PROPOSED_PLAN}
</proposed_plan>

<cultural_context>
{CULTURAL_CONTEXT}
</cultural_context>

Provide comprehensive validation results with scores and improvement recommendations.
"""

    NOTETAKING_PROMPT = """
أنت متخصص في استخلاص الملاحظات التقنية العراقية
You are an Iraqi Technical Notes Extraction Specialist.

<identity>
You extract and preserve the most valuable technical and cultural context
from planning conversations for efficient execution with Iraqi intelligence.
</identity>

<enhanced_note_criteria>
1. **Cultural Context Preservation**:
   - Cultural validation patterns and workflows
   - Islamic compliance implementation details
   - Arabic processing configurations
   - Professional domain requirements

2. **Iraqi-Specific Technical Details**:
   - Payment gateway integration patterns
   - Government service workflow details
   - Ministry compliance requirements
   - Cultural agent coordination patterns

3. **Implementation Efficiency**:
   - Reusable cultural validation patterns
   - Arabic NLP processing shortcuts
   - Islamic compliance automation
   - Professional standard templates

4. **Quality Assurance Notes**:
   - Cultural testing strategies
   - Islamic compliance validation methods
   - Arabic content verification approaches
   - Professional domain validation patterns
</enhanced_note_criteria>

<conversation_history>
{CONVERSATION_HISTORY}
</conversation_history>

<proposed_plan>
{PROPOSED_PLAN}
</proposed_plan>

<cultural_guidelines>
{CUSTOM_RULES}
</cultural_guidelines>

Extract notes that will accelerate culturally-compliant execution while preserving
Iraqi cultural authenticity and technical excellence.
"""


class IraqiContextGatherer:
    """Enhanced context gathering with Iraqi cultural intelligence."""

    def __init__(self):
        self.cultural_patterns = [
            "cultural-validator",
            "islamic-compliance",
            "arabic-processor",
            "rtl-layout",
            "iraqi-dialect",
            "family-appropriate",
            "political-neutral",
            "professional-standard",
        ]
        self.payment_patterns = [
            "zaincash",
            "fastpay",
            "nasswallet",
            "payment-security",
            "iraqi-gateway",
            "dinar-processing",
        ]
        self.government_patterns = [
            "ministry",
            "government-service",
            "iraqi-workflow",
            "department",
            "official-process",
            "compliance",
        ]
        self.arabic_patterns = [
            "arabic-nlp",
            "rtl-text",
            "arabic-font",
            "dialect-processing",
            "mixed-content",
            "arabic-typography",
        ]

    async def gather_cultural_context(self, state: PlanningState) -> Dict[str, Any]:
        """Gather context with cultural intelligence focus."""
        context = {
            "cultural_patterns_found": [],
            "payment_integrations": [],
            "government_services": [],
            "arabic_processing": [],
            "professional_domains": [],
            "cultural_validation_workflows": [],
        }

        # Simulate context gathering (in real implementation, would use actual tools)
        user_request = state.get_user_request().lower()

        # Check for cultural patterns
        for pattern in self.cultural_patterns:
            if (
                pattern.replace("-", " ") in user_request
                or pattern.replace("-", "_") in user_request
            ):
                context["cultural_patterns_found"].append(pattern)

        # Check for payment patterns
        for pattern in self.payment_patterns:
            if pattern in user_request:
                context["payment_integrations"].append(pattern)

        # Check for government patterns
        for pattern in self.government_patterns:
            if pattern.replace("-", " ") in user_request:
                context["government_services"].append(pattern)

        # Check for Arabic patterns
        for pattern in self.arabic_patterns:
            if (
                pattern.replace("-", " ") in user_request
                or "arabic" in user_request
                or "rtl" in user_request
            ):
                context["arabic_processing"].append(pattern)

        # Assess professional domain
        for domain in IraqiDomain:
            if domain.value in user_request:
                context["professional_domains"].append(domain.value)

        return context

    def analyze_cultural_requirements(
        self, context: Dict[str, Any], user_request: str
    ) -> CulturalContext:
        """Analyze cultural requirements from gathered context."""
        cultural_ctx = CulturalContext()

        # Assess Islamic compliance needs
        islamic_indicators = ["halal", "islamic", "prayer", "family", "community"]
        islamic_score = sum(
            1 for indicator in islamic_indicators if indicator in user_request.lower()
        ) / len(islamic_indicators)
        cultural_ctx.islamic_compliance_score = min(
            islamic_score + 0.7, 1.0
        )  # Base compliance + indicators

        # Assess Arabic content ratio
        arabic_indicators = len(context.get("arabic_processing", []))
        cultural_ctx.arabic_content_ratio = min(arabic_indicators * 0.2, 1.0)

        # Determine professional domain
        domains_found = context.get("professional_domains", [])
        if domains_found:
            cultural_ctx.professional_domain = IraqiDomain(domains_found[0])
        elif context.get("government_services"):
            cultural_ctx.professional_domain = IraqiDomain.GOVERNMENT
        elif context.get("payment_integrations"):
            cultural_ctx.professional_domain = IraqiDomain.FINANCIAL

        # Assess political sensitivity
        sensitive_terms = ["sectarian", "political", "tribal", "government"]
        if any(term in user_request.lower() for term in sensitive_terms):
            cultural_ctx.political_sensitivity = "high"
        else:
            cultural_ctx.political_sensitivity = "neutral"

        return cultural_ctx


class IraqiPlanGenerator:
    """Enhanced plan generator with Iraqi cultural intelligence."""

    def __init__(self):
        self.cultural_validation_templates = {
            "islamic_compliance": "Validate Islamic compliance using iraqi-cultural-validator (target: >95%)",
            "arabic_processing": "Process Arabic text with RTL support using arabic-rtl-processor",
            "payment_security": "Secure payment integration with payment-security-guardian",
            "professional_validation": "Validate professional standards using iraqi-professional-domain-expert",
            "government_workflow": "Implement government workflow using iraqi-workflow-orchestrator",
        }

    async def generate_plan(
        self, state: PlanningState, context: Dict[str, Any]
    ) -> List[str]:
        """Generate culturally-intelligent execution plan."""
        plan = []
        user_request = state.get_user_request()
        cultural_ctx = state.cultural_context

        # Phase 1: Cultural Analysis and Setup
        plan.append("**Phase 1: Cultural Analysis and Setup**")

        if cultural_ctx.requires_cultural_validation():
            plan.append(
                "Perform comprehensive cultural analysis using iraqi-cultural-validator "
                "to assess Islamic compliance, political neutrality, and family appropriateness"
            )

        if cultural_ctx.arabic_content_ratio > 0.1:
            plan.append(
                "Initialize Arabic processing pipeline with arabic-rtl-processor "
                "for RTL text handling and Iraqi dialect recognition"
            )

        if cultural_ctx.professional_domain != IraqiDomain.GENERAL:
            plan.append(
                f"Configure professional domain validation for {cultural_ctx.professional_domain.value} "
                "sector using iraqi-professional-domain-expert"
            )

        # Phase 2: Implementation with Cultural Integration
        plan.append("\n**Phase 2: Implementation with Cultural Integration**")

        # Add implementation steps based on request analysis
        if "payment" in user_request.lower() or context.get("payment_integrations"):
            plan.extend(
                [
                    "Implement payment gateway integration with comprehensive security validation "
                    "using payment-security-guardian for ZainCash, FastPay, and NassWallet",
                    "Test payment flows with iraqi-payment-tester ensuring 100% security compliance "
                    "and cultural appropriateness",
                ]
            )

        if "ui" in user_request.lower() or "interface" in user_request.lower():
            plan.extend(
                [
                    "Design culturally-appropriate user interface using iraqi-ui-designer "
                    "with RTL layout support and Iraqi design patterns",
                    "Implement accessibility features using iraqi-accessibility-specialist "
                    "ensuring WCAG 2.1 AA compliance with cultural considerations",
                ]
            )

        if "api" in user_request.lower() or "service" in user_request.lower():
            plan.extend(
                [
                    "Develop API endpoints with cultural validation middleware "
                    "ensuring Islamic compliance and professional standards",
                    "Implement comprehensive security measures using iraqi-security-specialist "
                    "with Iraqi regulatory compliance",
                ]
            )

        # Phase 3: Cultural Validation and Testing
        plan.append("\n**Phase 3: Cultural Validation and Testing**")

        plan.extend(
            [
                "Conduct comprehensive cultural validation testing using iraqi-cultural-tester "
                "to ensure 95%+ Islamic compliance and cultural appropriateness",
                "Perform Arabic language testing using iraqi-arabic-tester "
                "with 99%+ RTL accuracy and 85%+ Iraqi dialect recognition",
                "Validate professional domain requirements and regulatory compliance "
                "using domain-specific testing protocols",
            ]
        )

        # Phase 4: Deployment and Monitoring
        plan.append("\n**Phase 4: Deployment and Monitoring**")

        plan.extend(
            [
                "Deploy with cultural monitoring using iraqi-devops-engineer "
                "ensuring cultural compliance in production environment",
                "Set up performance monitoring with cultural metrics tracking "
                "using Iraqi-enhanced monitoring tools",
                "Implement ongoing cultural compliance validation "
                "with automated Islamic principle checking",
            ]
        )

        return plan

    def validate_plan_cultural_compliance(self, plan: List[str]) -> Dict[str, Any]:
        """Validate plan for cultural compliance."""
        validation = {
            "islamic_compliance_score": 0.0,
            "arabic_processing_included": False,
            "professional_validation_included": False,
            "cultural_testing_included": False,
            "recommendations": [],
        }

        plan_text = " ".join(plan).lower()

        # Check Islamic compliance integration
        islamic_keywords = [
            "islamic",
            "halal",
            "cultural-validator",
            "family-appropriate",
        ]
        islamic_score = sum(
            1 for keyword in islamic_keywords if keyword in plan_text
        ) / len(islamic_keywords)
        validation["islamic_compliance_score"] = islamic_score

        # Check Arabic processing
        arabic_keywords = ["arabic", "rtl", "dialect", "arabic-processor"]
        validation["arabic_processing_included"] = any(
            keyword in plan_text for keyword in arabic_keywords
        )

        # Check professional validation
        professional_keywords = [
            "professional",
            "domain-expert",
            "regulatory",
            "compliance",
        ]
        validation["professional_validation_included"] = any(
            keyword in plan_text for keyword in professional_keywords
        )

        # Check cultural testing
        testing_keywords = [
            "cultural-tester",
            "cultural validation",
            "islamic compliance",
        ]
        validation["cultural_testing_included"] = any(
            keyword in plan_text for keyword in testing_keywords
        )

        # Generate recommendations
        if validation["islamic_compliance_score"] < 0.8:
            validation["recommendations"].append(
                "Increase Islamic compliance integration throughout the plan"
            )

        if not validation["arabic_processing_included"]:
            validation["recommendations"].append(
                "Add Arabic processing and RTL text handling components"
            )

        if not validation["professional_validation_included"]:
            validation["recommendations"].append(
                "Include professional domain validation and regulatory compliance"
            )

        return validation


class IraqiPlanningAgent:
    """Main Iraqi Planning Agent with comprehensive cultural intelligence."""

    def __init__(self):
        self.prompts = IraqiPlanningPrompts()
        self.context_gatherer = IraqiContextGatherer()
        self.plan_generator = IraqiPlanGenerator()
        self.session_states: Dict[str, PlanningState] = {}

    def create_session(
        self, user_request: str, session_id: Optional[str] = None
    ) -> str:
        """Create a new planning session."""
        if session_id is None:
            session_id = str(uuid.uuid4())

        state = PlanningState(session_id=session_id)
        state.add_message("user", user_request)
        self.session_states[session_id] = state

        logger.info(f"Created Iraqi planning session {session_id}")
        return session_id

    async def process_planning_request(
        self, user_request: str, session_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Process a complete planning request with Iraqi cultural intelligence."""
        if session_id is None:
            session_id = self.create_session(user_request)
        elif session_id not in self.session_states:
            session_id = self.create_session(user_request, session_id)

        state = self.session_states[session_id]

        try:
            # Phase 1: Cultural Analysis
            logger.info(f"Starting cultural analysis for session {session_id}")
            state.phase = PlanningPhase.CULTURAL_ANALYSIS
            cultural_analysis = await self._analyze_cultural_context(state)

            # Phase 2: Context Gathering
            logger.info(f"Gathering context for session {session_id}")
            state.phase = PlanningPhase.CONTEXT_GATHERING
            context = await self._gather_context(state)

            # Phase 3: Plan Generation
            logger.info(f"Generating plan for session {session_id}")
            state.phase = PlanningPhase.PLAN_GENERATION
            plan = await self._generate_plan(state, context)

            # Phase 4: Cultural Validation
            logger.info(f"Validating cultural compliance for session {session_id}")
            state.phase = PlanningPhase.CULTURAL_VALIDATION
            validation = await self._validate_cultural_compliance(state)

            # Phase 5: Finalization
            state.phase = PlanningPhase.FINALIZATION
            final_plan = await self._finalize_plan(state, validation)

            # Calculate performance metrics
            performance_metrics = self._calculate_performance_metrics(state)

            result = {
                "session_id": session_id,
                "plan_title": state.plan_title,
                "plan": final_plan,
                "cultural_context": state.cultural_context.dict(),
                "validation_results": validation,
                "technical_notes": state.technical_notes,
                "performance_metrics": performance_metrics,
                "status": "completed",
            }

            logger.info(f"Completed Iraqi planning for session {session_id}")
            return result

        except Exception as e:
            logger.error(f"Error in planning session {session_id}: {str(e)}")
            return {"session_id": session_id, "error": str(e), "status": "failed"}

    async def _analyze_cultural_context(self, state: PlanningState) -> Dict[str, Any]:
        """Analyze cultural context and requirements."""
        user_request = state.get_user_request()

        # Simulate cultural analysis (in real implementation, would use AI model)
        analysis = {
            "islamic_compliance_required": True,
            "arabic_processing_needed": "arabic" in user_request.lower()
            or "rtl" in user_request.lower(),
            "professional_domain_detected": None,
            "political_sensitivity": "neutral",
            "cultural_validation_priority": "high",
        }

        # Determine professional domain
        for domain in IraqiDomain:
            if domain.value in user_request.lower():
                analysis["professional_domain_detected"] = domain.value
                break

        # Update cultural context
        cultural_ctx = CulturalContext()
        cultural_ctx.islamic_compliance_score = 0.9
        cultural_ctx.arabic_content_ratio = (
            0.3 if analysis["arabic_processing_needed"] else 0.0
        )
        cultural_ctx.professional_domain = (
            IraqiDomain(analysis["professional_domain_detected"])
            if analysis["professional_domain_detected"]
            else IraqiDomain.GENERAL
        )
        cultural_ctx.political_sensitivity = analysis["political_sensitivity"]

        state.cultural_context = cultural_ctx

        return analysis

    async def _gather_context(self, state: PlanningState) -> Dict[str, Any]:
        """Gather context with cultural intelligence."""
        context = await self.context_gatherer.gather_cultural_context(state)

        # Add context notes
        state.context_notes.extend(
            [
                f"Found {len(context['cultural_patterns_found'])} cultural patterns",
                f"Detected {len(context['payment_integrations'])} payment integrations",
                f"Identified {len(context['arabic_processing'])} Arabic processing needs",
                f"Professional domain: {state.cultural_context.professional_domain.value}",
            ]
        )

        return context

    async def _generate_plan(
        self, state: PlanningState, context: Dict[str, Any]
    ) -> List[str]:
        """Generate culturally-intelligent execution plan."""
        plan = await self.plan_generator.generate_plan(state, context)

        # Set plan title based on cultural context and request
        user_request = state.get_user_request()
        domain = state.cultural_context.professional_domain.value.title()
        state.plan_title = f"Iraqi {domain} Implementation Plan: {user_request[:50]}..."

        state.proposed_plan = plan
        return plan

    async def _validate_cultural_compliance(
        self, state: PlanningState
    ) -> Dict[str, Any]:
        """Validate plan for comprehensive cultural compliance."""
        validation = self.plan_generator.validate_plan_cultural_compliance(
            state.proposed_plan
        )

        # Enhanced validation with Iraqi-specific checks
        enhanced_validation = {
            **validation,
            "cultural_compliance_score": 0.0,
            "iraqi_agent_integration_score": 0.0,
            "professional_domain_coverage": 0.0,
            "overall_cultural_readiness": False,
        }

        plan_text = " ".join(state.proposed_plan).lower()

        # Calculate cultural compliance score
        cultural_indicators = [
            "iraqi-cultural-validator",
            "islamic compliance",
            "family-appropriate",
            "political-neutral",
            "cultural validation",
        ]
        cultural_score = sum(
            1 for indicator in cultural_indicators if indicator in plan_text
        ) / len(cultural_indicators)
        enhanced_validation["cultural_compliance_score"] = cultural_score

        # Calculate Iraqi agent integration score
        iraqi_agents = [
            "iraqi-cultural-validator",
            "arabic-rtl-processor",
            "iraqi-payment-tester",
            "iraqi-security-specialist",
            "iraqi-professional-domain-expert",
        ]
        agent_score = sum(1 for agent in iraqi_agents if agent in plan_text) / len(
            iraqi_agents
        )
        enhanced_validation["iraqi_agent_integration_score"] = agent_score

        # Professional domain coverage
        domain_keywords = {
            IraqiDomain.GOVERNMENT: ["ministry", "government", "official"],
            IraqiDomain.FINANCIAL: ["payment", "banking", "financial"],
            IraqiDomain.MEDICAL: ["medical", "healthcare", "clinical"],
            IraqiDomain.LEGAL: ["legal", "law", "court"],
            IraqiDomain.EDUCATIONAL: ["education", "academic", "university"],
        }

        domain = state.cultural_context.professional_domain
        if domain in domain_keywords:
            domain_coverage = sum(
                1 for keyword in domain_keywords[domain] if keyword in plan_text
            ) / len(domain_keywords[domain])
            enhanced_validation["professional_domain_coverage"] = domain_coverage

        # Overall readiness assessment
        overall_score = (
            enhanced_validation["cultural_compliance_score"] * 0.4
            + enhanced_validation["iraqi_agent_integration_score"] * 0.3
            + enhanced_validation["islamic_compliance_score"] * 0.3
        )
        enhanced_validation["overall_cultural_readiness"] = overall_score >= 0.8

        state.validation_results = enhanced_validation
        return enhanced_validation

    async def _finalize_plan(
        self, state: PlanningState, validation: Dict[str, Any]
    ) -> List[str]:
        """Finalize plan with cultural enhancements."""
        final_plan = state.proposed_plan.copy()

        # Add cultural enhancement recommendations if needed
        if not validation.get("overall_cultural_readiness", False):
            final_plan.insert(0, "\n**🔴 CULTURAL ENHANCEMENT REQUIRED**")
            final_plan.extend(
                ["\n**Cultural Enhancement Steps:**"]
                + validation.get("recommendations", [])
            )

        # Add technical notes extraction
        technical_notes = self._extract_technical_notes(state)
        state.technical_notes = technical_notes

        # Add performance optimization notes
        if state.cultural_context.arabic_content_ratio > 0.3:
            final_plan.append(
                "\n**Performance Note**: High Arabic content detected - "
                "ensure RTL processing optimization with caching"
            )

        return final_plan

    def _extract_technical_notes(self, state: PlanningState) -> List[str]:
        """Extract technical notes for execution phase."""
        notes = [
            f"Session ID: {state.session_id}",
            f"Cultural Domain: {state.cultural_context.professional_domain.value}",
            f"Islamic Compliance Required: {state.cultural_context.islamic_compliance_score:.2f}",
            f"Arabic Processing Ratio: {state.cultural_context.arabic_content_ratio:.2f}",
            f"Political Sensitivity: {state.cultural_context.political_sensitivity}",
        ]

        # Add context-specific notes
        if state.context_notes:
            notes.extend(["\nContext Notes:"] + state.context_notes)

        # Add validation insights
        if state.validation_results:
            validation = state.validation_results
            notes.extend(
                [
                    "\nValidation Results:",
                    f"- Cultural Compliance: {validation.get('cultural_compliance_score', 0):.2f}",
                    f"- Agent Integration: {validation.get('iraqi_agent_integration_score', 0):.2f}",
                    f"- Overall Readiness: {validation.get('overall_cultural_readiness', False)}",
                ]
            )

        return notes

    def _calculate_performance_metrics(self, state: PlanningState) -> Dict[str, float]:
        """Calculate performance metrics for the planning session."""
        end_time = datetime.now()
        duration = (end_time - state.created_at).total_seconds()

        metrics = {
            "planning_duration_seconds": duration,
            "cultural_compliance_score": state.validation_results.get(
                "cultural_compliance_score", 0.0
            ),
            "islamic_compliance_score": state.cultural_context.islamic_compliance_score,
            "arabic_processing_ratio": state.cultural_context.arabic_content_ratio,
            "plan_items_count": len(state.proposed_plan),
            "context_notes_count": len(state.context_notes),
            "technical_notes_count": len(state.technical_notes),
        }

        state.performance_metrics = metrics
        return metrics

    def get_session_status(self, session_id: str) -> Dict[str, Any]:
        """Get current status of a planning session."""
        if session_id not in self.session_states:
            return {"error": "Session not found", "status": "not_found"}

        state = self.session_states[session_id]
        return {
            "session_id": session_id,
            "phase": state.phase.value,
            "cultural_context": state.cultural_context.dict(),
            "plan_items_count": len(state.proposed_plan),
            "status": "in_progress"
            if state.phase != PlanningPhase.FINALIZATION
            else "completed",
        }

    def cleanup_session(self, session_id: str) -> bool:
        """Clean up a completed planning session."""
        if session_id in self.session_states:
            del self.session_states[session_id]
            logger.info(f"Cleaned up planning session {session_id}")
            return True
        return False


# Example usage and testing
async def main():
    """Example usage of the Iraqi Planning Agent."""
    agent = IraqiPlanningAgent()

    # Test cases with different Iraqi cultural contexts
    test_cases = [
        {
            "name": "Arabic Payment Gateway Integration",
            "request": "Create an Arabic RTL payment interface for ZainCash and FastPay with Islamic compliance validation",
        },
        {
            "name": "Government Service Portal",
            "request": "Build a government ministry service portal with Arabic support and cultural validation",
        },
        {
            "name": "Educational Platform",
            "request": "Develop an Islamic educational platform with Iraqi dialect support and family-appropriate content",
        },
        {
            "name": "Medical System Integration",
            "request": "Implement a medical records system with Arabic processing and Iraqi healthcare compliance",
        },
    ]

    for test_case in test_cases:
        print(f"\n{'=' * 60}")
        print(f"Testing: {test_case['name']}")
        print(f"Request: {test_case['request']}")
        print(f"{'=' * 60}")

        try:
            result = await agent.process_planning_request(test_case["request"])

            if result.get("status") == "completed":
                print(f"\n✅ Successfully generated plan: {result['plan_title']}")
                print(f"\n📋 Plan Items ({len(result['plan'])} items):")
                for i, item in enumerate(result["plan"][:5], 1):  # Show first 5 items
                    print(f"   {i}. {item}")
                if len(result["plan"]) > 5:
                    print(f"   ... and {len(result['plan']) - 5} more items")

                print(f"\n🎯 Cultural Context:")
                cultural = result["cultural_context"]
                print(
                    f"   - Islamic Compliance: {cultural['islamic_compliance_score']:.2f}"
                )
                print(f"   - Professional Domain: {cultural['professional_domain']}")
                print(
                    f"   - Arabic Content Ratio: {cultural['arabic_content_ratio']:.2f}"
                )

                print(f"\n📊 Validation Results:")
                validation = result["validation_results"]
                print(
                    f"   - Cultural Compliance: {validation.get('cultural_compliance_score', 0):.2f}"
                )
                print(
                    f"   - Agent Integration: {validation.get('iraqi_agent_integration_score', 0):.2f}"
                )
                print(
                    f"   - Overall Readiness: {validation.get('overall_cultural_readiness', False)}"
                )

                print(f"\n⚡ Performance Metrics:")
                metrics = result["performance_metrics"]
                print(
                    f"   - Planning Duration: {metrics['planning_duration_seconds']:.2f}s"
                )
                print(f"   - Plan Items: {metrics['plan_items_count']}")
                print(f"   - Context Notes: {metrics['context_notes_count']}")

            else:
                print(f"\n❌ Planning failed: {result.get('error', 'Unknown error')}")

        except Exception as e:
            print(f"\n💥 Test failed: {str(e)}")

    print(f"\n{'=' * 60}")
    print("Iraqi Planning Agent testing completed.")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    print("""
    🇮🇶 Iraqi AI Planning Agent System
    ================================
    
    Section 3E: Planning Agent System with Iraqi Cultural Intelligence
    
    Features:
    ✅ Islamic principles integration
    ✅ Arabic RTL processing support
    ✅ Iraqi professional domain validation
    ✅ Cultural appropriateness checking
    ✅ Government service workflow planning
    ✅ Payment gateway security integration
    ✅ Enhanced prompt system with cultural context
    
    Starting demonstration...
    """)

    asyncio.run(main())
