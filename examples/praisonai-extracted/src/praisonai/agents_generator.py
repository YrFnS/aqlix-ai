"""
Iraqi AI Chat System - Multi-Agent Generator
============================================

Enhanced PraisonAI agents generator with Iraqi professional domain specialization.
Supports automatic generation of culturally-aware AI agents for Iraqi legal, medical,
educational, government, business, and engineering domains.

Features:
- Iraqi professional domain specialization
- Islamic compliance validation
- Arabic RTL support with Iraqi dialect
- Cultural context preservation
- Multi-agent coordination for complex Iraqi workflows
"""

import os
import sys
import importlib
import logging
from pathlib import Path
from typing import Dict, List, Any, Optional, Union
import yaml

# Import Iraqi AI Chat System enhancements
from .iraqi_context import IraqiCulturalContext, IslamicComplianceValidator
from .arabic_processor import ArabicRTLProcessor, IraqiDialectProcessor

logger = logging.getLogger(__name__)


class IraqiAgentGenerator:
    """
    Enhanced agent generator with Iraqi professional domain specialization.

    Supports:
    - Iraqi Legal System (Civil Code, Commercial Law, Islamic Jurisprudence)
    - Iraqi Healthcare (Medical Ethics, Patient Care, Healthcare Management)
    - Iraqi Education (Curriculum, Arabic Language, Islamic Studies)
    - Iraqi Government (Ministry Procedures, Citizen Services, Administrative Law)
    - Iraqi Business (Market Analysis, Finance, Islamic Banking)
    - Iraqi Engineering (Building Codes, Technical Standards, Project Management)
    """

    def __init__(self, config_path: Optional[str] = None, framework: str = "praisonai"):
        self.config_path = config_path or "agents.yaml"
        self.framework = framework.lower()
        self.cultural_context = IraqiCulturalContext()
        self.compliance_validator = IslamicComplianceValidator()
        self.arabic_processor = ArabicRTLProcessor()
        self.dialect_processor = IraqiDialectProcessor()

        # Load Iraqi professional domain templates
        self.iraqi_domains = {
            "legal": self._load_legal_templates(),
            "medical": self._load_medical_templates(),
            "educational": self._load_educational_templates(),
            "government": self._load_government_templates(),
            "business": self._load_business_templates(),
            "engineering": self._load_engineering_templates(),
        }

        # Initialize framework-specific generators
        self._init_framework_support()

    def _load_legal_templates(self) -> Dict[str, Any]:
        """Load Iraqi legal system agent templates."""
        return {
            "civil_law_specialist": {
                "role": "Iraqi Civil Law Specialist",
                "goal": "Provide expert guidance on Iraqi Civil Code and legal procedures",
                "backstory": "Expert in Iraqi Civil Code, Commercial Law, and Islamic Jurisprudence with deep understanding of Iraqi legal system",
                "tools": [
                    "iraqi_law_database",
                    "sharia_compliance_checker",
                    "legal_document_generator",
                ],
                "cultural_requirements": [
                    "islamic_compliance",
                    "iraqi_legal_tradition",
                ],
                "language_support": [
                    "iraqi_arabic",
                    "formal_arabic",
                    "legal_terminology",
                ],
            },
            "sharia_compliance_advisor": {
                "role": "Islamic Legal Compliance Advisor",
                "goal": "Ensure all legal advice complies with Islamic law principles",
                "backstory": "Scholar of Islamic jurisprudence specializing in Iraqi legal context and Sharia compliance",
                "tools": [
                    "sharia_law_database",
                    "islamic_ruling_search",
                    "compliance_validator",
                ],
                "cultural_requirements": [
                    "strict_islamic_adherence",
                    "scholarly_methodology",
                ],
                "language_support": [
                    "quranic_arabic",
                    "iraqi_arabic",
                    "islamic_legal_terms",
                ],
            },
            "contract_specialist": {
                "role": "Iraqi Contract Law Specialist",
                "goal": "Draft and review contracts compliant with Iraqi law and Islamic principles",
                "backstory": "Legal expert in Iraqi contract law with specialization in Islamic commercial principles",
                "tools": [
                    "contract_templates",
                    "islamic_finance_checker",
                    "iraqi_commercial_law",
                ],
                "cultural_requirements": [
                    "islamic_commercial_law",
                    "iraqi_business_customs",
                ],
                "language_support": [
                    "business_arabic",
                    "legal_arabic",
                    "contract_terminology",
                ],
            },
        }

    def _load_medical_templates(self) -> Dict[str, Any]:
        """Load Iraqi healthcare system agent templates."""
        return {
            "medical_consultation_advisor": {
                "role": "Iraqi Medical Consultation Advisor",
                "goal": "Provide medical guidance compliant with Islamic medical ethics",
                "backstory": "Medical professional with expertise in Iraqi healthcare system and Islamic medical ethics",
                "tools": [
                    "medical_database_iraq",
                    "islamic_medical_ethics",
                    "patient_privacy_protector",
                ],
                "cultural_requirements": [
                    "islamic_medical_ethics",
                    "patient_dignity",
                    "gender_appropriate_care",
                ],
                "language_support": [
                    "medical_arabic",
                    "iraqi_dialect_medical",
                    "formal_arabic",
                ],
            },
            "healthcare_navigator": {
                "role": "Iraqi Healthcare System Navigator",
                "goal": "Guide patients through Iraqi healthcare system processes",
                "backstory": "Healthcare administrator familiar with Iraqi medical institutions and procedures",
                "tools": [
                    "hospital_directory_iraq",
                    "insurance_checker",
                    "appointment_scheduler",
                ],
                "cultural_requirements": [
                    "respectful_communication",
                    "family_centered_care",
                ],
                "language_support": [
                    "iraqi_arabic",
                    "medical_terminology",
                    "patient_communication",
                ],
            },
        }

    def _load_educational_templates(self) -> Dict[str, Any]:
        """Load Iraqi education system agent templates."""
        return {
            "curriculum_advisor": {
                "role": "Iraqi Curriculum Education Advisor",
                "goal": "Provide guidance on Iraqi educational curriculum and Islamic studies",
                "backstory": "Education specialist with deep knowledge of Iraqi curriculum and Islamic educational principles",
                "tools": [
                    "iraqi_curriculum_database",
                    "islamic_studies_materials",
                    "arabic_language_resources",
                ],
                "cultural_requirements": [
                    "islamic_educational_values",
                    "arabic_language_priority",
                ],
                "language_support": [
                    "educational_arabic",
                    "iraqi_dialect",
                    "classical_arabic",
                ],
            },
            "arabic_language_tutor": {
                "role": "Iraqi Arabic Language Tutor",
                "goal": "Teach Arabic language with focus on Iraqi dialect and formal Arabic",
                "backstory": "Arabic language expert specializing in Iraqi dialect and formal Arabic instruction",
                "tools": [
                    "arabic_grammar_checker",
                    "iraqi_dialect_dictionary",
                    "pronunciation_guide",
                ],
                "cultural_requirements": ["arabic_language_pride", "cultural_context"],
                "language_support": ["iraqi_arabic", "formal_arabic", "quranic_arabic"],
            },
        }

    def _load_government_templates(self) -> Dict[str, Any]:
        """Load Iraqi government services agent templates."""
        return {
            "citizen_services_advisor": {
                "role": "Iraqi Citizen Services Advisor",
                "goal": "Guide citizens through Iraqi government procedures and services",
                "backstory": "Government services expert familiar with Iraqi ministerial procedures and citizen rights",
                "tools": [
                    "government_procedures_database",
                    "document_requirements_checker",
                    "service_locator",
                ],
                "cultural_requirements": [
                    "respectful_government_interaction",
                    "citizen_dignity",
                ],
                "language_support": [
                    "official_arabic",
                    "iraqi_arabic",
                    "government_terminology",
                ],
            },
            "document_processing_assistant": {
                "role": "Iraqi Document Processing Assistant",
                "goal": "Assist with Iraqi government document preparation and submission",
                "backstory": "Administrative expert in Iraqi government document requirements and processing",
                "tools": [
                    "document_templates",
                    "requirement_checker",
                    "submission_tracker",
                ],
                "cultural_requirements": ["accuracy_priority", "official_procedures"],
                "language_support": ["official_arabic", "administrative_terminology"],
            },
        }

    def _load_business_templates(self) -> Dict[str, Any]:
        """Load Iraqi business and finance agent templates."""
        return {
            "business_consultant": {
                "role": "Iraqi Business Consultant",
                "goal": "Provide business guidance for Iraqi market conditions and Islamic finance",
                "backstory": "Business expert with deep knowledge of Iraqi market and Islamic finance principles",
                "tools": [
                    "market_analysis_iraq",
                    "islamic_finance_calculator",
                    "business_registration_guide",
                ],
                "cultural_requirements": [
                    "islamic_business_ethics",
                    "local_market_knowledge",
                ],
                "language_support": [
                    "business_arabic",
                    "iraqi_dialect",
                    "financial_terminology",
                ],
            },
            "islamic_finance_advisor": {
                "role": "Islamic Finance Advisor for Iraq",
                "goal": "Provide Sharia-compliant financial advice for Iraqi context",
                "backstory": "Islamic finance expert specializing in Iraqi banking system and Sharia compliance",
                "tools": [
                    "sharia_compliance_checker",
                    "islamic_banking_products",
                    "halal_investment_analyzer",
                ],
                "cultural_requirements": ["strict_sharia_compliance", "riba_avoidance"],
                "language_support": [
                    "islamic_finance_arabic",
                    "iraqi_arabic",
                    "banking_terminology",
                ],
            },
        }

    def _load_engineering_templates(self) -> Dict[str, Any]:
        """Load Iraqi engineering and technical standards agent templates."""
        return {
            "engineering_standards_advisor": {
                "role": "Iraqi Engineering Standards Advisor",
                "goal": "Provide guidance on Iraqi building codes and technical standards",
                "backstory": "Engineering expert familiar with Iraqi building codes, technical standards, and project management",
                "tools": [
                    "iraqi_building_codes",
                    "technical_standards_database",
                    "project_planning_tools",
                ],
                "cultural_requirements": ["safety_priority", "quality_standards"],
                "language_support": [
                    "technical_arabic",
                    "engineering_terminology",
                    "iraqi_arabic",
                ],
            },
            "project_management_consultant": {
                "role": "Iraqi Project Management Consultant",
                "goal": "Assist with project planning and management in Iraqi context",
                "backstory": "Project management professional with experience in Iraqi construction and engineering projects",
                "tools": [
                    "project_templates",
                    "resource_calculator",
                    "timeline_planner",
                ],
                "cultural_requirements": [
                    "cultural_work_patterns",
                    "local_regulations",
                ],
                "language_support": [
                    "project_management_arabic",
                    "technical_terminology",
                ],
            },
        }

    def _init_framework_support(self):
        """Initialize support for different agent frameworks."""
        self.supported_frameworks = ["praisonai", "crewai", "autogen"]

        # Framework-specific imports and setup
        try:
            if self.framework == "crewai":
                from crewai import Agent, Task, Crew

                self.Agent = Agent
                self.Task = Task
                self.Crew = Crew
            elif self.framework == "autogen":
                # AutoGen support for Iraqi agents
                self._setup_autogen_support()
            else:
                # Default PraisonAI framework
                self._setup_praisonai_support()
        except ImportError as e:
            logger.warning(f"Framework {self.framework} not available: {e}")
            self._setup_praisonai_support()

    def _setup_autogen_support(self):
        """Setup AutoGen framework support with Iraqi enhancements."""
        try:
            import autogen

            self.autogen = autogen
            logger.info("AutoGen framework loaded for Iraqi AI agents")
        except ImportError:
            logger.warning("AutoGen not available, falling back to PraisonAI")
            self._setup_praisonai_support()

    def _setup_praisonai_support(self):
        """Setup PraisonAI framework support with Iraqi enhancements."""
        logger.info("Using PraisonAI framework for Iraqi AI agents")
        # Framework-specific setup will be implemented here
        pass

    def generate_iraqi_agent(
        self, domain: str, specialist: str, custom_config: Optional[Dict] = None
    ) -> Any:
        """
        Generate a specialized Iraqi AI agent for specific professional domain.

        Args:
            domain: Iraqi professional domain (legal, medical, educational, government, business, engineering)
            specialist: Specific specialist type within domain
            custom_config: Optional custom configuration overrides

        Returns:
            Configured agent instance for the Iraqi professional domain
        """
        if domain not in self.iraqi_domains:
            raise ValueError(
                f"Unsupported Iraqi domain: {domain}. Supported: {list(self.iraqi_domains.keys())}"
            )

        if specialist not in self.iraqi_domains[domain]:
            raise ValueError(
                f"Unsupported specialist: {specialist} in domain: {domain}"
            )

        # Get base template
        template = self.iraqi_domains[domain][specialist].copy()

        # Apply custom configuration if provided
        if custom_config:
            template.update(custom_config)

        # Validate cultural requirements
        self._validate_cultural_requirements(template)

        # Process Arabic language requirements
        self._setup_arabic_support(template)

        # Generate agent based on framework
        return self._create_agent_instance(template)

    def _validate_cultural_requirements(self, template: Dict[str, Any]):
        """Validate agent template meets Iraqi cultural requirements."""
        cultural_reqs = template.get("cultural_requirements", [])

        for requirement in cultural_reqs:
            if requirement == "islamic_compliance":
                # Validate Islamic compliance
                if not self.compliance_validator.validate_content(
                    template.get("backstory", "")
                ):
                    raise ValueError(
                        "Agent template fails Islamic compliance validation"
                    )

            elif requirement == "arabic_language_priority":
                # Ensure Arabic language support
                if "arabic" not in str(template.get("language_support", [])).lower():
                    raise ValueError(
                        "Agent template missing required Arabic language support"
                    )

    def _setup_arabic_support(self, template: Dict[str, Any]):
        """Setup Arabic language and RTL support for agent."""
        language_support = template.get("language_support", [])

        for lang in language_support:
            if "arabic" in lang.lower():
                # Configure Arabic RTL processor
                template["arabic_processor"] = self.arabic_processor
                template["dialect_processor"] = self.dialect_processor
                break

    def _create_agent_instance(self, template: Dict[str, Any]) -> Any:
        """Create agent instance based on configured framework."""
        if self.framework == "crewai":
            return self._create_crewai_agent(template)
        elif self.framework == "autogen":
            return self._create_autogen_agent(template)
        else:
            return self._create_praisonai_agent(template)

    def _create_crewai_agent(self, template: Dict[str, Any]) -> Any:
        """Create CrewAI agent with Iraqi specialization."""
        return self.Agent(
            role=template["role"],
            goal=template["goal"],
            backstory=template["backstory"],
            tools=self._load_iraqi_tools(template.get("tools", [])),
            verbose=True,
            allow_delegation=True,
        )

    def _create_autogen_agent(self, template: Dict[str, Any]) -> Any:
        """Create AutoGen agent with Iraqi specialization."""
        # AutoGen agent creation logic
        config = {
            "name": template["role"],
            "system_message": f"{template['backstory']} Goal: {template['goal']}",
            "tools": self._load_iraqi_tools(template.get("tools", [])),
        }
        return config

    def _create_praisonai_agent(self, template: Dict[str, Any]) -> Any:
        """Create PraisonAI agent with Iraqi specialization."""
        # PraisonAI agent creation logic
        return {
            "role": template["role"],
            "goal": template["goal"],
            "backstory": template["backstory"],
            "tools": self._load_iraqi_tools(template.get("tools", [])),
            "cultural_context": template.get("cultural_requirements", []),
            "language_support": template.get("language_support", []),
        }

    def _load_iraqi_tools(self, tool_names: List[str]) -> List[Any]:
        """Load Iraqi-specific tools for agents."""
        tools = []

        for tool_name in tool_names:
            try:
                # Load Iraqi-specific tools
                if tool_name == "iraqi_law_database":
                    tools.append(self._create_iraqi_law_tool())
                elif tool_name == "sharia_compliance_checker":
                    tools.append(self._create_sharia_compliance_tool())
                elif tool_name == "arabic_processor":
                    tools.append(self._create_arabic_processor_tool())
                # Add more Iraqi-specific tools as needed

            except Exception as e:
                logger.warning(f"Failed to load tool {tool_name}: {e}")

        return tools

    def _create_iraqi_law_tool(self):
        """Create Iraqi law database search tool."""

        def search_iraqi_law(query: str) -> str:
            """Search Iraqi legal database for relevant laws and regulations."""
            # Implementation would connect to Iraqi legal database
            return f"Iraqi law search results for: {query}"

        return search_iraqi_law

    def _create_sharia_compliance_tool(self):
        """Create Sharia compliance validation tool."""

        def check_sharia_compliance(content: str) -> Dict[str, Any]:
            """Check content for Sharia compliance."""
            return self.compliance_validator.validate_content(content)

        return check_sharia_compliance

    def _create_arabic_processor_tool(self):
        """Create Arabic text processing tool."""

        def process_arabic_text(text: str, process_type: str = "rtl") -> str:
            """Process Arabic text for RTL support and Iraqi dialect."""
            if process_type == "rtl":
                return self.arabic_processor.process_rtl(text)
            elif process_type == "dialect":
                return self.dialect_processor.process_iraqi_dialect(text)
            return text

        return process_arabic_text

    def create_iraqi_multi_agent_team(
        self, domains: List[str], task_description: str
    ) -> Dict[str, Any]:
        """
        Create a multi-agent team for complex Iraqi professional tasks.

        Args:
            domains: List of Iraqi professional domains needed
            task_description: Description of the complex task

        Returns:
            Multi-agent team configuration
        """
        team_agents = []

        for domain in domains:
            # Select appropriate specialist for each domain
            if domain == "legal":
                agent = self.generate_iraqi_agent("legal", "civil_law_specialist")
            elif domain == "medical":
                agent = self.generate_iraqi_agent(
                    "medical", "medical_consultation_advisor"
                )
            elif domain == "educational":
                agent = self.generate_iraqi_agent("educational", "curriculum_advisor")
            elif domain == "government":
                agent = self.generate_iraqi_agent(
                    "government", "citizen_services_advisor"
                )
            elif domain == "business":
                agent = self.generate_iraqi_agent("business", "business_consultant")
            elif domain == "engineering":
                agent = self.generate_iraqi_agent(
                    "engineering", "engineering_standards_advisor"
                )

            team_agents.append(agent)

        return {
            "agents": team_agents,
            "task": task_description,
            "coordination": "collaborative",
            "cultural_validation": True,
            "islamic_compliance": True,
        }


# Iraqi-specific context and validation classes (to be implemented)
class IraqiCulturalContext:
    """Manages Iraqi cultural context for AI agents."""

    pass


class IslamicComplianceValidator:
    """Validates content for Islamic compliance."""

    def validate_content(self, content: str) -> Dict[str, Any]:
        return {"compliant": True, "issues": []}


class ArabicRTLProcessor:
    """Processes Arabic text for RTL support."""

    def process_rtl(self, text: str) -> str:
        return text


class IraqiDialectProcessor:
    """Processes Iraqi Arabic dialect."""

    def process_iraqi_dialect(self, text: str) -> str:
        return text
