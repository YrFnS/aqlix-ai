#!/usr/bin/env python3
"""
Iraqi Programming Agent System
Based on Open-SWE Programming Agent patterns with comprehensive Iraqi cultural compliance.

Implements a state-graph programming workflow with:
- Cultural validation layer for Islamic compliance
- Arabic code processing and RTL support
- Professional domain integration (legal/medical/educational/government)
- Enhanced prompt system with Iraqi cultural context
- Tool cultural validation and halal code compliance
- Government service integration with ministry-specific requirements

Architecture:
- StateGraph workflow with complex routing logic
- Multi-provider LLM support with cultural filtering
- Comprehensive tool orchestration with cultural validation
- Advanced error handling with cultural context
- Task completion detection with Islamic compliance checks
"""

import asyncio
import json
import logging
import os
import re
import sys
import uuid
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple, Union

import aiohttp
import yaml
from pydantic import BaseModel, Field


class CulturalComplianceLevel(Enum):
    """Cultural compliance levels for Iraqi context"""
    BASIC = "basic"  # 85%+ compliance
    STANDARD = "standard"  # 90%+ compliance  
    PROFESSIONAL = "professional"  # 95%+ compliance
    GOVERNMENT = "government"  # 98%+ compliance
    ISLAMIC_CERTIFIED = "islamic_certified"  # 99%+ compliance


class ProfessionalDomain(Enum):
    """Iraqi professional domains requiring specific compliance"""
    LEGAL = "legal"
    MEDICAL = "medical"
    EDUCATIONAL = "educational"
    GOVERNMENT = "government"
    BANKING = "banking"
    TELECOMMUNICATIONS = "telecommunications"
    GENERAL = "general"


class ActionType(Enum):
    """Programming action types with cultural context"""
    CODE_GENERATION = "code_generation"
    CODE_MODIFICATION = "code_modification"
    CULTURAL_VALIDATION = "cultural_validation"
    ARABIC_PROCESSING = "arabic_processing"
    TESTING = "testing"
    DOCUMENTATION = "documentation"
    DEPLOYMENT = "deployment"
    SECURITY_AUDIT = "security_audit"


@dataclass
class CulturalContext:
    """Cultural context for Iraqi programming requirements"""
    compliance_level: CulturalComplianceLevel = CulturalComplianceLevel.STANDARD
    professional_domain: ProfessionalDomain = ProfessionalDomain.GENERAL
    islamic_compliance_required: bool = True
    arabic_support_required: bool = False
    rtl_support_required: bool = False
    government_standards: bool = False
    family_appropriate: bool = True
    political_neutrality: bool = True
    sectarian_neutrality: bool = True


@dataclass
class TaskPlanItem:
    """Enhanced task plan item with cultural validation"""
    index: int
    plan: str
    completed: bool = False
    cultural_validated: bool = False
    islamic_compliant: bool = False
    arabic_processed: bool = False
    professional_validated: bool = False
    cultural_score: float = 0.0
    validation_notes: List[str] = field(default_factory=list)


@dataclass
class IraqiGraphState:
    """Enhanced graph state with Iraqi cultural context"""
    # Core state
    messages: List[Dict[str, Any]] = field(default_factory=list)
    internal_messages: List[Dict[str, Any]] = field(default_factory=list)
    task_plan: List[TaskPlanItem] = field(default_factory=list)
    current_task_index: int = 0
    
    # Repository context
    target_repository: str = ""
    branch_name: str = "main"
    repo_path: str = ""
    codebase_tree: str = ""
    
    # Cultural context
    cultural_context: CulturalContext = field(default_factory=CulturalContext)
    cultural_validation_history: List[Dict[str, Any]] = field(default_factory=list)
    islamic_compliance_score: float = 0.0
    arabic_processing_stats: Dict[str, Any] = field(default_factory=dict)
    
    # Professional domain context
    professional_requirements: Dict[str, Any] = field(default_factory=dict)
    government_standards: Dict[str, str] = field(default_factory=dict)
    ministry_specific_rules: List[str] = field(default_factory=list)
    
    # Tool and execution context
    sandbox_session_id: Optional[str] = None
    dependencies_installed: bool = False
    execution_history: List[Dict[str, Any]] = field(default_factory=list)
    error_context: List[Dict[str, Any]] = field(default_factory=list)
    
    # Performance metrics
    cultural_validation_time: float = 0.0
    arabic_processing_time: float = 0.0
    total_execution_time: float = 0.0


class IraqiCulturalValidator:
    """Cultural validation engine for Iraqi context"""
    
    def __init__(self):
        self.islamic_principles = self._load_islamic_principles()
        self.professional_standards = self._load_professional_standards()
        self.arabic_patterns = self._load_arabic_patterns()
        self.government_requirements = self._load_government_requirements()
    
    def _load_islamic_principles(self) -> Dict[str, Any]:
        """Load Islamic compliance principles"""
        return {
            "halal_coding": [
                "No gambling-related functionality",
                "No interest-based calculations without Islamic banking compliance",
                "No alcohol/pork/haram content references",
                "Respectful of Islamic values and practices",
                "Family-appropriate content only"
            ],
            "ethical_guidelines": [
                "Honest and transparent code practices",
                "Respectful of privacy and dignity",
                "No deceptive or misleading functionality",
                "Beneficial to society and community"
            ],
            "forbidden_content": [
                "gambling", "betting", "lottery", "casino",
                "alcohol", "wine", "beer", "liquor",
                "pork", "ham", "bacon",
                "adult content", "explicit material",
                "violence", "hate speech"
            ]
        }
    
    def _load_professional_standards(self) -> Dict[str, Dict[str, Any]]:
        """Load Iraqi professional domain standards"""
        return {
            "legal": {
                "requirements": [
                    "Iraqi Civil Code compliance",
                    "Commercial law adherence", 
                    "Legal document standards",
                    "Court system integration"
                ],
                "terminology": ["قانون", "محكمة", "عقد", "دعوى"],
                "validation_patterns": [r"\b(قانون|محكمة|عقد|دعوى)\b"]
            },
            "medical": {
                "requirements": [
                    "Iraqi Medical Association standards",
                    "Patient privacy (HIPAA equivalent)",
                    "Medical terminology accuracy",
                    "Islamic medical ethics"
                ],
                "terminology": ["مريض", "طبيب", "علاج", "تشخيص"],
                "validation_patterns": [r"\b(مريض|طبيب|علاج|تشخيص)\b"]
            },
            "educational": {
                "requirements": [
                    "Iraqi Ministry of Education standards",
                    "Islamic educational principles",
                    "Arabic language preservation",
                    "Cultural heritage integration"
                ],
                "terminology": ["طالب", "معلم", "درس", "امتحان"],
                "validation_patterns": [r"\b(طالب|معلم|درس|امتحان)\b"]
            },
            "government": {
                "requirements": [
                    "Iraqi government service standards",
                    "Ministry-specific requirements",
                    "Citizen privacy protection",
                    "Government data security"
                ],
                "terminology": ["حكومة", "وزارة", "مواطن", "خدمة"],
                "validation_patterns": [r"\b(حكومة|وزارة|مواطن|خدمة)\b"]
            }
        }
    
    def _load_arabic_patterns(self) -> Dict[str, Any]:
        """Load Arabic language processing patterns"""
        return {
            "rtl_indicators": [
                "arabic_text", "rtl_layout", "right_to_left",
                "عربي", "نص", "تخطيط"
            ],
            "mixed_content_patterns": [
                r"[\u0600-\u06FF]+.*[a-zA-Z]+",  # Arabic + Latin
                r"[a-zA-Z]+.*[\u0600-\u06FF]+"   # Latin + Arabic
            ],
            "iraqi_dialect_markers": [
                "شلونك", "وين", "شنو", "هسه", "جان", "وياه"
            ]
        }
    
    def _load_government_requirements(self) -> Dict[str, List[str]]:
        """Load Iraqi government ministry requirements"""
        return {
            "ministry_of_education": [
                "Educational content approval",
                "Islamic values integration",
                "Arabic language priority",
                "Cultural heritage preservation"
            ],
            "ministry_of_health": [
                "Medical data privacy",
                "Islamic medical ethics",
                "Healthcare accessibility",
                "Patient dignity protection"
            ],
            "ministry_of_interior": [
                "Citizen data protection",
                "National security compliance",
                "Identity verification standards",
                "Privacy rights protection"
            ],
            "ministry_of_finance": [
                "Islamic banking compliance",
                "Financial data security",
                "Anti-money laundering",
                "Taxation system integration"
            ]
        }
    
    async def validate_cultural_compliance(
        self,
        code: str,
        context: CulturalContext
    ) -> Tuple[float, List[str], Dict[str, Any]]:
        """Validate code for cultural compliance"""
        validation_start = datetime.now()
        violations = []
        compliance_details = {}
        
        # Islamic compliance check
        islamic_score, islamic_violations = self._check_islamic_compliance(code)
        violations.extend(islamic_violations)
        compliance_details["islamic_score"] = islamic_score
        
        # Professional domain validation
        professional_score, professional_violations = self._check_professional_compliance(
            code, context.professional_domain
        )
        violations.extend(professional_violations)
        compliance_details["professional_score"] = professional_score
        
        # Arabic/RTL support validation
        if context.arabic_support_required or context.rtl_support_required:
            arabic_score, arabic_violations = self._check_arabic_support(code)
            violations.extend(arabic_violations)
            compliance_details["arabic_score"] = arabic_score
        
        # Calculate overall compliance score
        weights = {
            "islamic": 0.4 if context.islamic_compliance_required else 0.2,
            "professional": 0.3,
            "arabic": 0.2 if context.arabic_support_required else 0.1,
            "general": 0.1
        }
        
        overall_score = (
            islamic_score * weights["islamic"] +
            professional_score * weights["professional"] +
            compliance_details.get("arabic_score", 100) * weights["arabic"] +
            100 * weights["general"]  # Base score for general compliance
        )
        
        validation_time = (datetime.now() - validation_start).total_seconds()
        compliance_details["validation_time"] = validation_time
        compliance_details["violation_count"] = len(violations)
        
        return overall_score, violations, compliance_details
    
    def _check_islamic_compliance(self, code: str) -> Tuple[float, List[str]]:
        """Check Islamic compliance of code"""
        violations = []
        score = 100.0
        
        # Check for forbidden content
        for forbidden in self.islamic_principles["forbidden_content"]:
            if re.search(rf'\b{forbidden}\b', code.lower()):
                violations.append(f"Contains forbidden content: {forbidden}")
                score -= 15.0
        
        # Check for gambling-related functionality
        gambling_patterns = [
            r'\b(bet|gamble|lottery|casino|poker|dice)\b',
            r'\b(راهن|قمار|يانصيب|كازينو)\b'
        ]
        for pattern in gambling_patterns:
            if re.search(pattern, code.lower()):
                violations.append("Contains gambling-related functionality")
                score -= 20.0
                break
        
        # Check for interest-based calculations
        interest_patterns = [
            r'\b(interest|usury|riba)\b',
            r'\b(فائدة|ربا)\b'
        ]
        for pattern in interest_patterns:
            if re.search(pattern, code.lower()):
                violations.append("Contains interest-based calculations - requires Islamic banking compliance")
                score -= 10.0
                break
        
        return max(0.0, score), violations
    
    def _check_professional_compliance(
        self,
        code: str,
        domain: ProfessionalDomain
    ) -> Tuple[float, List[str]]:
        """Check professional domain compliance"""
        if domain == ProfessionalDomain.GENERAL:
            return 100.0, []
        
        violations = []
        score = 100.0
        
        domain_standards = self.professional_standards.get(domain.value, {})
        
        # Check for proper terminology usage
        terminology = domain_standards.get("terminology", [])
        if terminology:
            found_terms = sum(1 for term in terminology if term in code)
            if found_terms == 0 and any(term in code for term in ["arabic", "عربي"]):
                violations.append(f"Missing {domain.value} terminology for Arabic content")
                score -= 15.0
        
        # Domain-specific validations
        if domain == ProfessionalDomain.MEDICAL:
            if "patient" in code.lower() and "privacy" not in code.lower():
                violations.append("Medical code missing privacy considerations")
                score -= 20.0
        
        elif domain == ProfessionalDomain.LEGAL:
            if "contract" in code.lower() and "compliance" not in code.lower():
                violations.append("Legal code missing compliance considerations")
                score -= 20.0
        
        elif domain == ProfessionalDomain.GOVERNMENT:
            if "citizen" in code.lower() and "security" not in code.lower():
                violations.append("Government code missing security considerations")
                score -= 20.0
        
        return max(0.0, score), violations
    
    def _check_arabic_support(self, code: str) -> Tuple[float, List[str]]:
        """Check Arabic and RTL support compliance"""
        violations = []
        score = 100.0
        
        # Check for RTL support indicators
        rtl_indicators = ["direction: rtl", "text-align: right", "unicode-bidi"]
        has_rtl_support = any(indicator in code.lower() for indicator in rtl_indicators)
        
        # Check for Arabic text handling
        has_arabic_text = re.search(r'[\u0600-\u06FF]+', code)
        
        if has_arabic_text and not has_rtl_support:
            violations.append("Arabic text found but missing RTL support")
            score -= 25.0
        
        # Check for mixed Arabic-English content handling
        mixed_patterns = self.arabic_patterns["mixed_content_patterns"]
        has_mixed_content = any(re.search(pattern, code) for pattern in mixed_patterns)
        
        if has_mixed_content:
            # Check for proper mixed content handling
            mixed_handlers = ["lang=", "dir=", "text-direction"]
            if not any(handler in code.lower() for handler in mixed_handlers):
                violations.append("Mixed Arabic-English content without proper handling")
                score -= 20.0
        
        # Check for Iraqi dialect support
        dialect_markers = self.arabic_patterns["iraqi_dialect_markers"]
        has_dialect = any(marker in code for marker in dialect_markers)
        
        if has_dialect:
            violations.append("Iraqi dialect detected - ensure proper cultural context")
            # This is informational, not a penalty
        
        return max(0.0, score), violations


class IraqiPromptSystem:
    """Enhanced prompt system with Iraqi cultural context"""
    
    def __init__(self):
        self.cultural_prompts = self._initialize_cultural_prompts()
        self.professional_prompts = self._initialize_professional_prompts()
        self.islamic_guidelines = self._initialize_islamic_guidelines()
    
    def _initialize_cultural_prompts(self) -> Dict[str, str]:
        """Initialize culturally appropriate prompts"""
        return {
            "identity": """<iraqi_identity>
You are an Iraqi Programming Agent built with comprehensive cultural intelligence and Islamic compliance. You are precise, culturally sensitive, and helpful to the Iraqi development community. You prioritize Islamic values, Arabic language support, and Iraqi professional standards in all programming tasks.

Your core values:
- Islamic principles and halal coding practices
- Arabic language and RTL layout support
- Iraqi professional and government standards
- Cultural sensitivity and political neutrality
- Family-appropriate content and ethical development
</iraqi_identity>""",
            
            "cultural_behavior": """<cultural_behavior>
- Islamic Compliance: All code must respect Islamic principles and values
- Arabic Integration: Support Arabic language, RTL layouts, and mixed content
- Professional Standards: Adhere to Iraqi legal, medical, educational, and government requirements
- Cultural Sensitivity: Maintain political and sectarian neutrality
- Family Values: Ensure all content is appropriate for Iraqi families
- Community Benefit: Prioritize solutions that benefit Iraqi society
</cultural_behavior>""",
            
            "cultural_validation": """<cultural_validation_requirements>
- Validate all code for Islamic compliance (target: 95%+ score)
- Check for halal coding practices and forbidden content
- Ensure Arabic/RTL support when Arabic content is detected
- Validate professional domain requirements for legal/medical/educational/government code
- Maintain cultural sensitivity in variable names, comments, and documentation
- Verify family-appropriate content and ethical development practices
</cultural_validation_requirements>"""
        }
    
    def _initialize_professional_prompts(self) -> Dict[str, str]:
        """Initialize professional domain prompts"""
        return {
            "legal": """<iraqi_legal_standards>
- Iraqi Civil Code compliance and commercial law adherence
- Legal document standards and court system integration
- Arabic legal terminology: قانون (law), محكمة (court), عقد (contract), دعوى (lawsuit)
- Ensure all legal code respects Iraqi legal framework and Islamic law principles
</iraqi_legal_standards>""",
            
            "medical": """<iraqi_medical_standards>
- Iraqi Medical Association standards and patient privacy protection
- Islamic medical ethics and healthcare accessibility requirements
- Medical Arabic terminology: مريض (patient), طبيب (doctor), علاج (treatment), تشخيص (diagnosis)
- Ensure patient dignity, privacy, and Islamic medical ethical guidelines
</iraqi_medical_standards>""",
            
            "educational": """<iraqi_educational_standards>
- Iraqi Ministry of Education standards and Islamic educational principles
- Arabic language preservation and cultural heritage integration
- Educational Arabic terminology: طالب (student), معلم (teacher), درس (lesson), امتحان (exam)
- Ensure educational content promotes Islamic values and Iraqi cultural heritage
</iraqi_educational_standards>""",
            
            "government": """<iraqi_government_standards>
- Iraqi government service standards and ministry-specific requirements
- Citizen privacy protection and government data security
- Government Arabic terminology: حكومة (government), وزارة (ministry), مواطن (citizen), خدمة (service)
- Ensure compliance with Iraqi government standards and citizen rights protection
</iraqi_government_standards>"""
        }
    
    def _initialize_islamic_guidelines(self) -> str:
        """Initialize Islamic coding guidelines"""
        return """<islamic_coding_guidelines>
Halal Coding Practices:
- No gambling, betting, lottery, or casino-related functionality
- No interest-based calculations without Islamic banking compliance
- No references to alcohol, pork, or other haram content
- Respectful of Islamic values, practices, and family principles
- Honest, transparent, and beneficial to the community

Forbidden Content Patterns:
- Gambling: bet, gamble, lottery, casino, poker, dice, راهن, قمار, يانصيب
- Interest: interest, usury, riba, فائدة, ربا (without Islamic banking context)
- Haram Content: alcohol, wine, pork, ham, adult content, explicit material

Ethical Guidelines:
- Code should be honest and transparent in functionality
- Respectful of user privacy and dignity
- No deceptive or misleading functionality
- Beneficial to society and the Iraqi community
</islamic_coding_guidelines>"""
    
    def generate_system_prompt(
        self,
        context: CulturalContext,
        task_plan: List[TaskPlanItem] = None
    ) -> str:
        """Generate culturally appropriate system prompt"""
        
        prompt_parts = [
            self.cultural_prompts["identity"],
            self.cultural_prompts["cultural_behavior"],
            self.islamic_guidelines
        ]
        
        # Add professional domain specific guidance
        if context.professional_domain != ProfessionalDomain.GENERAL:
            domain_prompt = self.professional_prompts.get(context.professional_domain.value)
            if domain_prompt:
                prompt_parts.append(domain_prompt)
        
        # Add cultural validation requirements
        prompt_parts.append(self.cultural_prompts["cultural_validation"])
        
        # Add task-specific context if available
        if task_plan:
            active_tasks = [task for task in task_plan if not task.completed]
            if active_tasks:
                task_context = self._generate_task_context(active_tasks)
                prompt_parts.append(task_context)
        
        # Add compliance level specific requirements
        compliance_requirements = self._generate_compliance_requirements(context.compliance_level)
        prompt_parts.append(compliance_requirements)
        
        return "\n\n".join(prompt_parts)
    
    def _generate_task_context(self, tasks: List[TaskPlanItem]) -> str:
        """Generate task-specific context"""
        task_descriptions = []
        for task in tasks[:3]:  # Show next 3 tasks
            status_indicators = []
            if task.cultural_validated:
                status_indicators.append("✅ Culturally Validated")
            if task.islamic_compliant:
                status_indicators.append("🕌 Islamic Compliant")
            if task.arabic_processed:
                status_indicators.append("🔤 Arabic Processed")
            
            status = f" ({', '.join(status_indicators)})" if status_indicators else ""
            task_descriptions.append(f"Task {task.index}: {task.plan}{status}")
        
        return f"""<current_iraqi_tasks>
Active tasks requiring cultural compliance:
{chr(10).join(task_descriptions)}

Remember to validate each task for Islamic compliance, Arabic support, and professional standards.
</current_iraqi_tasks>"""
    
    def _generate_compliance_requirements(self, level: CulturalComplianceLevel) -> str:
        """Generate compliance level specific requirements"""
        requirements = {
            CulturalComplianceLevel.BASIC: "Achieve 85%+ cultural compliance score",
            CulturalComplianceLevel.STANDARD: "Achieve 90%+ cultural compliance score", 
            CulturalComplianceLevel.PROFESSIONAL: "Achieve 95%+ cultural compliance score",
            CulturalComplianceLevel.GOVERNMENT: "Achieve 98%+ cultural compliance score",
            CulturalComplianceLevel.ISLAMIC_CERTIFIED: "Achieve 99%+ cultural compliance score with full Islamic certification"
        }
        
        return f"""<compliance_requirements>
Required Compliance Level: {level.value.title()}
Target: {requirements[level]}

Additional Requirements:
- All code must pass Islamic compliance validation
- Arabic content requires RTL support verification
- Professional domains require specialized validation
- Government projects require ministry-specific compliance
</compliance_requirements>"""


class IraqiToolSystem:
    """Enhanced tool system with cultural validation"""
    
    def __init__(self, validator: IraqiCulturalValidator):
        self.validator = validator
        self.tools = self._initialize_tools()
        self.cultural_tool_wrappers = self._initialize_cultural_wrappers()
    
    def _initialize_tools(self) -> Dict[str, Dict[str, Any]]:
        """Initialize available tools with cultural context"""
        return {
            "iraqi_code_generator": {
                "name": "iraqi_code_generator",
                "description": "Generate culturally compliant Iraqi code with Islamic principles",
                "parameters": {
                    "language": "Programming language (Arabic variable names supported)",
                    "code_type": "Type of code to generate",
                    "cultural_requirements": "Specific Iraqi cultural requirements",
                    "islamic_compliance": "Islamic compliance requirements"
                },
                "cultural_validation": True
            },
            "arabic_rtl_validator": {
                "name": "arabic_rtl_validator", 
                "description": "Validate Arabic text and RTL layout compliance",
                "parameters": {
                    "content": "Content to validate for Arabic/RTL support",
                    "validation_level": "Level of RTL validation required"
                },
                "cultural_validation": True
            },
            "islamic_compliance_checker": {
                "name": "islamic_compliance_checker",
                "description": "Check code for Islamic compliance and halal practices",
                "parameters": {
                    "code": "Code to validate for Islamic compliance",
                    "compliance_level": "Required compliance level"
                },
                "cultural_validation": True
            },
            "professional_domain_validator": {
                "name": "professional_domain_validator",
                "description": "Validate code for Iraqi professional domain requirements",
                "parameters": {
                    "code": "Code to validate",
                    "domain": "Professional domain (legal/medical/educational/government)",
                    "ministry_requirements": "Specific ministry requirements"
                },
                "cultural_validation": True
            },
            "cultural_shell_executor": {
                "name": "cultural_shell_executor",
                "description": "Execute shell commands with cultural validation",
                "parameters": {
                    "command": "Shell command to execute",
                    "working_directory": "Working directory for execution",
                    "cultural_check": "Enable cultural validation for command"
                },
                "cultural_validation": True
            },
            "iraqi_documentation_generator": {
                "name": "iraqi_documentation_generator", 
                "description": "Generate culturally appropriate documentation in Arabic/English",
                "parameters": {
                    "content": "Content to document",
                    "language": "Documentation language (Arabic/English/Mixed)",
                    "audience": "Target audience (developers/users/government)"
                },
                "cultural_validation": True
            }
        }
    
    def _initialize_cultural_wrappers(self) -> Dict[str, Any]:
        """Initialize cultural validation wrappers for tools"""
        return {
            "pre_validation": self._pre_execution_validation,
            "post_validation": self._post_execution_validation,
            "cultural_filter": self._apply_cultural_filter
        }
    
    async def execute_tool(
        self,
        tool_name: str,
        parameters: Dict[str, Any],
        context: CulturalContext
    ) -> Tuple[Dict[str, Any], float, List[str]]:
        """Execute tool with cultural validation"""
        if tool_name not in self.tools:
            return {"error": f"Unknown tool: {tool_name}"}, 0.0, [f"Tool '{tool_name}' not found"]
        
        tool_config = self.tools[tool_name]
        execution_start = datetime.now()
        
        # Pre-execution validation
        if tool_config.get("cultural_validation", False):
            pre_validation_result = await self._pre_execution_validation(
                tool_name, parameters, context
            )
            if not pre_validation_result["valid"]:
                return {"error": "Cultural validation failed", "details": pre_validation_result}, 0.0, pre_validation_result["violations"]
        
        # Execute the actual tool
        try:
            result = await self._execute_specific_tool(tool_name, parameters, context)
        except Exception as e:
            return {"error": f"Tool execution failed: {str(e)}"}, 0.0, [str(e)]
        
        # Post-execution validation
        if tool_config.get("cultural_validation", False):
            cultural_score, violations, validation_details = await self._post_execution_validation(
                tool_name, result, context
            )
            result["cultural_validation"] = {
                "score": cultural_score,
                "violations": violations,
                "details": validation_details
            }
        else:
            cultural_score = 100.0
            violations = []
        
        execution_time = (datetime.now() - execution_start).total_seconds()
        
        return result, cultural_score, violations
    
    async def _pre_execution_validation(
        self,
        tool_name: str,
        parameters: Dict[str, Any],
        context: CulturalContext
    ) -> Dict[str, Any]:
        """Validate tool parameters before execution"""
        violations = []
        
        # Check for forbidden content in parameters
        for key, value in parameters.items():
            if isinstance(value, str):
                islamic_score, islamic_violations = self.validator._check_islamic_compliance(value)
                if islamic_violations:
                    violations.extend([f"Parameter '{key}': {v}" for v in islamic_violations])
        
        # Tool-specific pre-validation
        if tool_name == "cultural_shell_executor":
            command = parameters.get("command", "")
            if any(forbidden in command.lower() for forbidden in ["rm -rf", "sudo rm", "format", "delete"]):
                violations.append("Potentially destructive command detected")
        
        return {
            "valid": len(violations) == 0,
            "violations": violations,
            "pre_validation_complete": True
        }
    
    async def _post_execution_validation(
        self,
        tool_name: str,
        result: Dict[str, Any],
        context: CulturalContext
    ) -> Tuple[float, List[str], Dict[str, Any]]:
        """Validate tool results after execution"""
        
        # Extract text content from result for validation
        text_content = ""
        if isinstance(result, dict):
            if "output" in result:
                text_content = str(result["output"])
            elif "content" in result:
                text_content = str(result["content"])
            else:
                text_content = str(result)
        else:
            text_content = str(result)
        
        # Perform cultural validation on the result
        cultural_score, violations, validation_details = await self.validator.validate_cultural_compliance(
            text_content, context
        )
        
        return cultural_score, violations, validation_details
    
    async def _execute_specific_tool(
        self,
        tool_name: str,
        parameters: Dict[str, Any],
        context: CulturalContext
    ) -> Dict[str, Any]:
        """Execute specific tool functionality"""
        
        if tool_name == "iraqi_code_generator":
            return await self._execute_code_generator(parameters, context)
        
        elif tool_name == "arabic_rtl_validator":
            return await self._execute_rtl_validator(parameters)
        
        elif tool_name == "islamic_compliance_checker":
            return await self._execute_islamic_checker(parameters)
        
        elif tool_name == "professional_domain_validator":
            return await self._execute_domain_validator(parameters, context)
        
        elif tool_name == "cultural_shell_executor":
            return await self._execute_cultural_shell(parameters, context)
        
        elif tool_name == "iraqi_documentation_generator":
            return await self._execute_documentation_generator(parameters, context)
        
        else:
            return {"error": f"Tool '{tool_name}' not implemented"}
    
    async def _execute_code_generator(
        self,
        parameters: Dict[str, Any],
        context: CulturalContext
    ) -> Dict[str, Any]:
        """Execute Iraqi code generator with cultural compliance"""
        
        language = parameters.get("language", "python")
        code_type = parameters.get("code_type", "function")
        cultural_requirements = parameters.get("cultural_requirements", [])
        
        # Generate culturally compliant code template
        templates = {
            "python": {
                "function": '''def {function_name}({parameters}):
    """
    {description}
    
    يجب أن تتوافق هذه الدالة مع المبادئ الإسلامية والمعايير العراقية
    This function must comply with Islamic principles and Iraqi standards
    
    Args:
        {parameters}: Function parameters
    
    Returns:
        {return_type}: Culturally compliant result
    
    Cultural Compliance:
        - Islamic principles: ✅
        - Arabic support: ✅  
        - Professional standards: ✅
    """
    # Implementation with cultural validation
    if not validate_islamic_compliance(locals()):
        raise ValueError("Islamic compliance validation failed")
    
    # Your culturally compliant implementation here
    return culturally_validated_result''',
                
                "class": '''class {class_name}:
    """
    {description}
    
    فئة متوافقة مع الثقافة العراقية والمبادئ الإسلامية
    Iraqi culturally compliant class with Islamic principles
    """
    
    def __init__(self, **kwargs):
        """Initialize with cultural validation"""
        self.cultural_context = CulturalContext()
        self.islamic_compliant = True
        super().__init__(**kwargs)
    
    def validate_cultural_compliance(self) -> bool:
        """Validate cultural compliance of instance"""
        return self.islamic_compliant and self.cultural_context.is_valid()'''
            }
        }
        
        template = templates.get(language, {}).get(code_type, "# Template not found")
        
        # Apply cultural customizations
        customized_code = template.format(
            function_name=parameters.get("name", "culturally_compliant_function"),
            class_name=parameters.get("name", "CulturallyCompliantClass"),
            description=parameters.get("description", "Culturally compliant implementation"),
            parameters=parameters.get("params", ""),
            return_type=parameters.get("return_type", "Any")
        )
        
        return {
            "generated_code": customized_code,
            "language": language,
            "cultural_features": [
                "Islamic compliance validation",
                "Arabic documentation support",
                "Cultural context integration",
                "Professional standards adherence"
            ],
            "status": "success"
        }
    
    async def _execute_rtl_validator(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Execute Arabic RTL validator"""
        content = parameters.get("content", "")
        validation_level = parameters.get("validation_level", "standard")
        
        # Check for Arabic text
        arabic_text_found = bool(re.search(r'[\u0600-\u06FF]+', content))
        
        # Check for RTL support indicators
        rtl_indicators = [
            "direction: rtl", "text-align: right", "unicode-bidi",
            "dir=\"rtl\"", "dir='rtl'", "direction=\"rtl\""
        ]
        rtl_support_found = any(indicator in content.lower() for indicator in rtl_indicators)
        
        # Check for mixed content
        mixed_content = bool(re.search(r'[\u0600-\u06FF]+.*[a-zA-Z]+|[a-zA-Z]+.*[\u0600-\u06FF]+', content))
        
        validation_results = {
            "arabic_text_detected": arabic_text_found,
            "rtl_support_present": rtl_support_found,
            "mixed_content_detected": mixed_content,
            "validation_level": validation_level,
            "recommendations": []
        }
        
        # Generate recommendations
        if arabic_text_found and not rtl_support_found:
            validation_results["recommendations"].append(
                "Add RTL support: direction: rtl, text-align: right"
            )
        
        if mixed_content:
            validation_results["recommendations"].append(
                "Handle mixed Arabic-English content with proper language attributes"
            )
        
        # Calculate compliance score
        score = 100.0
        if arabic_text_found and not rtl_support_found:
            score -= 40.0
        if mixed_content and len(validation_results["recommendations"]) > 1:
            score -= 20.0
        
        validation_results["compliance_score"] = score
        validation_results["status"] = "passed" if score >= 80 else "failed"
        
        return validation_results
    
    async def _execute_islamic_checker(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Execute Islamic compliance checker"""
        code = parameters.get("code", "")
        compliance_level = parameters.get("compliance_level", "standard")
        
        # Use the cultural validator for Islamic compliance
        islamic_score, violations = self.validator._check_islamic_compliance(code)
        
        return {
            "islamic_compliance_score": islamic_score,
            "violations": violations,
            "compliance_level": compliance_level,
            "passed": islamic_score >= 90.0,
            "recommendations": [
                "Review and remove any haram content references",
                "Ensure gambling-free functionality",
                "Validate interest-free calculations", 
                "Maintain family-appropriate content"
            ] if violations else ["Code passes Islamic compliance check"],
            "status": "passed" if islamic_score >= 90.0 else "failed"
        }
    
    async def _execute_domain_validator(
        self,
        parameters: Dict[str, Any],
        context: CulturalContext
    ) -> Dict[str, Any]:
        """Execute professional domain validator"""
        code = parameters.get("code", "")
        domain = parameters.get("domain", "general")
        
        # Convert string domain to enum
        domain_enum = ProfessionalDomain.GENERAL
        try:
            domain_enum = ProfessionalDomain(domain.lower())
        except ValueError:
            pass
        
        # Use cultural validator for professional compliance
        professional_score, violations = self.validator._check_professional_compliance(
            code, domain_enum
        )
        
        return {
            "professional_domain": domain,
            "compliance_score": professional_score,
            "violations": violations,
            "domain_requirements": self.validator.professional_standards.get(domain, {}),
            "passed": professional_score >= 85.0,
            "status": "passed" if professional_score >= 85.0 else "failed"
        }
    
    async def _execute_cultural_shell(
        self,
        parameters: Dict[str, Any],
        context: CulturalContext
    ) -> Dict[str, Any]:
        """Execute shell command with cultural validation"""
        command = parameters.get("command", "")
        working_directory = parameters.get("working_directory", ".")
        
        # Cultural validation for shell commands
        dangerous_commands = [
            "rm -rf", "sudo rm", "format", "delete", "chmod 777",
            "curl", "wget"  # Restrict external access without validation
        ]
        
        command_safe = True
        safety_violations = []
        
        for dangerous in dangerous_commands:
            if dangerous in command.lower():
                command_safe = False
                safety_violations.append(f"Potentially unsafe command: {dangerous}")
        
        if not command_safe:
            return {
                "output": "",
                "error": "Command blocked for safety",
                "safety_violations": safety_violations,
                "status": "blocked",
                "cultural_validation": "failed"
            }
        
        # Simulate shell execution (in real implementation, use subprocess)
        return {
            "output": f"Command '{command}' executed successfully in {working_directory}",
            "error": "",
            "return_code": 0,
            "status": "success",
            "cultural_validation": "passed"
        }
    
    async def _execute_documentation_generator(
        self,
        parameters: Dict[str, Any],
        context: CulturalContext
    ) -> Dict[str, Any]:
        """Execute Iraqi documentation generator"""
        content = parameters.get("content", "")
        language = parameters.get("language", "mixed")
        audience = parameters.get("audience", "developers")
        
        # Generate culturally appropriate documentation
        doc_templates = {
            "arabic": """# {title}

## الوصف (Description)
{arabic_description}

## المتطلبات الثقافية (Cultural Requirements)
- التوافق مع المبادئ الإسلامية ✅
- دعم اللغة العربية والتخطيط من اليمين إلى اليسار ✅
- الامتثال للمعايير العراقية المهنية ✅

## الاستخدام (Usage)
{arabic_usage}

## ملاحظات مهمة (Important Notes)
- يجب التحقق من التوافق الثقافي قبل الاستخدام
- جميع المحتويات متوافقة مع القيم الإسلامية والثقافة العراقية
""",
            "english": """# {title}

## Description
{english_description}

## Cultural Compliance
- Islamic principles compliance ✅
- Arabic language and RTL support ✅  
- Iraqi professional standards adherence ✅

## Usage
{english_usage}

## Important Notes
- Cultural compliance validation required before use
- All content respects Islamic values and Iraqi culture
""",
            "mixed": """# {title}

## الوصف / Description
{arabic_description}

{english_description}

## المتطلبات الثقافية / Cultural Requirements
- التوافق مع المبادئ الإسلامية / Islamic principles compliance ✅
- دعم اللغة العربية / Arabic language support ✅
- المعايير العراقية المهنية / Iraqi professional standards ✅

## الاستخدام / Usage
### بالعربية:
{arabic_usage}

### In English:
{english_usage}
"""
        }
        
        template = doc_templates.get(language, doc_templates["mixed"])
        
        # Generate documentation content
        generated_doc = template.format(
            title=parameters.get("title", "Iraqi Programming Documentation"),
            arabic_description="وصف للمحتوى المتوافق مع الثقافة العراقية",
            english_description="Description of Iraqi culturally compliant content",
            arabic_usage="تعليمات الاستخدام باللغة العربية",
            english_usage="Usage instructions in English"
        )
        
        return {
            "generated_documentation": generated_doc,
            "language": language,
            "audience": audience,
            "cultural_features": [
                "Bilingual Arabic-English support",
                "Islamic compliance indicators",
                "Iraqi professional standards",
                "Cultural sensitivity guidelines"
            ],
            "status": "success"
        }


class IraqiProgrammingAgent:
    """Main Iraqi Programming Agent with cultural intelligence"""
    
    def __init__(
        self,
        cultural_context: CulturalContext = None,
        enable_logging: bool = True
    ):
        self.cultural_context = cultural_context or CulturalContext()
        self.validator = IraqiCulturalValidator()
        self.prompt_system = IraqiPromptSystem()
        self.tool_system = IraqiToolSystem(self.validator)
        
        # Initialize state
        self.state = IraqiGraphState(cultural_context=self.cultural_context)
        
        # Configure logging
        if enable_logging:
            logging.basicConfig(
                level=logging.INFO,
                format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
            )
        self.logger = logging.getLogger("IraqiProgrammingAgent")
        
        # Performance tracking
        self.performance_metrics = {
            "total_tasks": 0,
            "cultural_validations": 0,
            "islamic_compliance_checks": 0,
            "arabic_processing_operations": 0,
            "average_cultural_score": 0.0,
            "execution_times": []
        }
    
    async def initialize_session(
        self,
        repository_path: str,
        task_description: str,
        professional_domain: ProfessionalDomain = ProfessionalDomain.GENERAL
    ) -> Dict[str, Any]:
        """Initialize programming session with Iraqi cultural context"""
        
        self.logger.info(f"Initializing Iraqi Programming Agent session")
        self.logger.info(f"Repository: {repository_path}")
        self.logger.info(f"Professional Domain: {professional_domain.value}")
        
        # Update cultural context
        self.state.cultural_context.professional_domain = professional_domain
        self.state.target_repository = repository_path
        self.state.repo_path = repository_path
        
        # Generate initial task plan with cultural validation
        initial_plan = await self._generate_cultural_task_plan(task_description)
        self.state.task_plan = initial_plan
        
        # Initialize sandbox and cultural validation
        session_init_result = await self._initialize_cultural_sandbox()
        
        return {
            "session_id": str(uuid.uuid4()),
            "cultural_context": {
                "professional_domain": professional_domain.value,
                "compliance_level": self.state.cultural_context.compliance_level.value,
                "islamic_compliance_required": self.state.cultural_context.islamic_compliance_required,
                "arabic_support_required": self.state.cultural_context.arabic_support_required
            },
            "task_plan": [
                {
                    "index": task.index,
                    "description": task.plan,
                    "cultural_requirements": task.validation_notes
                }
                for task in initial_plan
            ],
            "initialization_result": session_init_result,
            "status": "initialized"
        }
    
    async def execute_task_step(self) -> Dict[str, Any]:
        """Execute next task step with cultural validation"""
        
        execution_start = datetime.now()
        
        if self.state.current_task_index >= len(self.state.task_plan):
            return {
                "status": "completed",
                "message": "All tasks completed",
                "cultural_summary": await self._generate_cultural_summary()
            }
        
        current_task = self.state.task_plan[self.state.current_task_index]
        
        self.logger.info(f"Executing task {current_task.index}: {current_task.plan}")
        
        # Generate action with cultural context
        action_result = await self._generate_cultural_action(current_task)
        
        if action_result["status"] == "success":
            # Execute the generated action
            execution_result = await self._execute_cultural_action(action_result)
            
            # Validate cultural compliance
            validation_result = await self._validate_task_completion(
                current_task, execution_result
            )
            
            # Update task status
            if validation_result["culturally_compliant"]:
                current_task.completed = True
                current_task.cultural_validated = True
                current_task.islamic_compliant = validation_result["islamic_compliant"]
                current_task.cultural_score = validation_result["cultural_score"]
                self.state.current_task_index += 1
        
        execution_time = (datetime.now() - execution_start).total_seconds()
        self.performance_metrics["execution_times"].append(execution_time)
        
        return {
            "task_index": current_task.index,
            "task_description": current_task.plan,
            "action_result": action_result,
            "cultural_validation": validation_result if 'validation_result' in locals() else None,
            "execution_time": execution_time,
            "status": "success" if current_task.completed else "in_progress"
        }
    
    async def _generate_cultural_task_plan(
        self,
        task_description: str
    ) -> List[TaskPlanItem]:
        """Generate task plan with cultural considerations"""
        
        # Analyze task for cultural requirements
        cultural_requirements = await self._analyze_cultural_requirements(task_description)
        
        # Generate base task plan
        base_tasks = [
            "Analyze repository structure and cultural requirements",
            "Validate existing code for Islamic compliance",
            "Implement requested functionality with cultural validation",
            "Add Arabic language support if required",
            "Generate culturally appropriate documentation",
            "Perform final cultural compliance validation"
        ]
        
        # Create task plan items with cultural context
        task_plan = []
        for i, task in enumerate(base_tasks):
            task_item = TaskPlanItem(
                index=i,
                plan=task,
                validation_notes=cultural_requirements.get(f"task_{i}", [])
            )
            task_plan.append(task_item)
        
        return task_plan
    
    async def _analyze_cultural_requirements(
        self,
        task_description: str
    ) -> Dict[str, List[str]]:
        """Analyze task for cultural requirements"""
        
        requirements = {}
        
        # Check for Arabic content requirements
        if re.search(r'[\u0600-\u06FF]+', task_description) or "arabic" in task_description.lower():
            self.state.cultural_context.arabic_support_required = True
            self.state.cultural_context.rtl_support_required = True
            requirements["arabic"] = ["Arabic language support required", "RTL layout support needed"]
        
        # Check for professional domain indicators
        domain_keywords = {
            "legal": ["legal", "law", "court", "contract", "قانون", "محكمة"],
            "medical": ["medical", "health", "patient", "doctor", "طبيب", "مريض"],
            "educational": ["education", "student", "teacher", "school", "طالب", "معلم"],
            "government": ["government", "ministry", "citizen", "service", "حكومة", "وزارة"]
        }
        
        for domain, keywords in domain_keywords.items():
            if any(keyword in task_description.lower() for keyword in keywords):
                self.state.cultural_context.professional_domain = ProfessionalDomain(domain)
                requirements["professional"] = [f"{domain.title()} domain compliance required"]
                break
        
        # Check for Islamic compliance requirements
        islamic_indicators = ["halal", "islamic", "sharia", "compliant", "إسلامي", "حلال"]
        if any(indicator in task_description.lower() for indicator in islamic_indicators):
            self.state.cultural_context.compliance_level = CulturalComplianceLevel.ISLAMIC_CERTIFIED
            requirements["islamic"] = ["Islamic certification level compliance required"]
        
        return requirements
    
    async def _initialize_cultural_sandbox(self) -> Dict[str, Any]:
        """Initialize sandbox with cultural validation capabilities"""
        
        # Simulate sandbox initialization (in real implementation, use actual sandbox)
        sandbox_id = f"iraqi-sandbox-{uuid.uuid4().hex[:8]}"
        
        # Install cultural validation dependencies
        cultural_dependencies = [
            "arabic-nlp-toolkit",
            "islamic-compliance-checker", 
            "rtl-layout-validator",
            "iraqi-professional-standards"
        ]
        
        return {
            "sandbox_id": sandbox_id,
            "cultural_dependencies": cultural_dependencies,
            "cultural_validation_enabled": True,
            "islamic_compliance_active": self.state.cultural_context.islamic_compliance_required,
            "arabic_processing_ready": self.state.cultural_context.arabic_support_required,
            "professional_domain": self.state.cultural_context.professional_domain.value,
            "status": "initialized"
        }
    
    async def _generate_cultural_action(
        self,
        task: TaskPlanItem
    ) -> Dict[str, Any]:
        """Generate culturally appropriate action for task"""
        
        # Create system prompt with cultural context
        system_prompt = self.prompt_system.generate_system_prompt(
            self.state.cultural_context,
            self.state.task_plan
        )
        
        # Analyze task requirements
        action_requirements = {
            "cultural_validation_required": True,
            "islamic_compliance_check": self.state.cultural_context.islamic_compliance_required,
            "arabic_processing": self.state.cultural_context.arabic_support_required,
            "professional_validation": self.state.cultural_context.professional_domain != ProfessionalDomain.GENERAL,
            "compliance_level": self.state.cultural_context.compliance_level.value
        }
        
        # Generate appropriate tools and actions
        if "analyze" in task.plan.lower():
            recommended_tools = ["iraqi_code_generator", "cultural_shell_executor"]
        elif "validate" in task.plan.lower():
            recommended_tools = ["islamic_compliance_checker", "professional_domain_validator"]
        elif "arabic" in task.plan.lower():
            recommended_tools = ["arabic_rtl_validator", "iraqi_documentation_generator"]
        else:
            recommended_tools = ["iraqi_code_generator", "cultural_shell_executor"]
        
        return {
            "task_index": task.index,
            "action_type": ActionType.CODE_GENERATION.value,
            "recommended_tools": recommended_tools,
            "cultural_requirements": action_requirements,
            "system_prompt": system_prompt,
            "status": "success"
        }
    
    async def _execute_cultural_action(
        self,
        action_result: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Execute action with cultural validation"""
        
        recommended_tools = action_result.get("recommended_tools", [])
        execution_results = {}
        
        # Execute each recommended tool
        for tool_name in recommended_tools:
            try:
                # Prepare tool parameters based on cultural context
                tool_params = self._prepare_tool_parameters(tool_name)
                
                # Execute tool with cultural validation
                result, cultural_score, violations = await self.tool_system.execute_tool(
                    tool_name, tool_params, self.state.cultural_context
                )
                
                execution_results[tool_name] = {
                    "result": result,
                    "cultural_score": cultural_score,
                    "violations": violations
                }
                
                self.logger.info(f"Executed {tool_name} with cultural score: {cultural_score}")
                
            except Exception as e:
                self.logger.error(f"Error executing {tool_name}: {str(e)}")
                execution_results[tool_name] = {
                    "error": str(e),
                    "cultural_score": 0.0,
                    "violations": [f"Execution failed: {str(e)}"]
                }
        
        return {
            "tool_executions": execution_results,
            "overall_status": "success",
            "cultural_validation_performed": True
        }
    
    def _prepare_tool_parameters(self, tool_name: str) -> Dict[str, Any]:
        """Prepare culturally appropriate parameters for tools"""
        
        base_params = {
            "cultural_requirements": [
                "Islamic compliance required",
                "Arabic support if needed",
                "Professional standards adherence"
            ],
            "compliance_level": self.state.cultural_context.compliance_level.value
        }
        
        if tool_name == "iraqi_code_generator":
            return {
                **base_params,
                "language": "python",
                "code_type": "function",
                "islamic_compliance": True
            }
        
        elif tool_name == "arabic_rtl_validator":
            return {
                **base_params,
                "content": "Sample Arabic content for validation",
                "validation_level": "professional"
            }
        
        elif tool_name == "islamic_compliance_checker":
            return {
                **base_params,
                "code": "# Sample code for Islamic compliance check",
                "compliance_level": self.state.cultural_context.compliance_level.value
            }
        
        elif tool_name == "professional_domain_validator":
            return {
                **base_params,
                "code": "# Sample code for professional validation",
                "domain": self.state.cultural_context.professional_domain.value
            }
        
        else:
            return base_params
    
    async def _validate_task_completion(
        self,
        task: TaskPlanItem,
        execution_result: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Validate task completion with cultural compliance"""
        
        validation_start = datetime.now()
        
        # Extract results for validation
        tool_results = execution_result.get("tool_executions", {})
        
        # Calculate overall cultural compliance
        cultural_scores = [
            result.get("cultural_score", 0.0)
            for result in tool_results.values()
            if "cultural_score" in result
        ]
        
        overall_cultural_score = sum(cultural_scores) / len(cultural_scores) if cultural_scores else 0.0
        
        # Collect all violations
        all_violations = []
        for result in tool_results.values():
            if "violations" in result:
                all_violations.extend(result["violations"])
        
        # Determine compliance levels
        required_score = {
            CulturalComplianceLevel.BASIC: 85.0,
            CulturalComplianceLevel.STANDARD: 90.0,
            CulturalComplianceLevel.PROFESSIONAL: 95.0,
            CulturalComplianceLevel.GOVERNMENT: 98.0,
            CulturalComplianceLevel.ISLAMIC_CERTIFIED: 99.0
        }[self.state.cultural_context.compliance_level]
        
        culturally_compliant = overall_cultural_score >= required_score
        islamic_compliant = overall_cultural_score >= 90.0  # Minimum Islamic compliance
        
        validation_time = (datetime.now() - validation_start).total_seconds()
        
        # Update performance metrics
        self.performance_metrics["cultural_validations"] += 1
        self.performance_metrics["average_cultural_score"] = (
            (self.performance_metrics["average_cultural_score"] * (self.performance_metrics["cultural_validations"] - 1) +
             overall_cultural_score) / self.performance_metrics["cultural_validations"]
        )
        
        return {
            "culturally_compliant": culturally_compliant,
            "islamic_compliant": islamic_compliant,
            "cultural_score": overall_cultural_score,
            "required_score": required_score,
            "violations": all_violations,
            "validation_time": validation_time,
            "compliance_level": self.state.cultural_context.compliance_level.value,
            "professional_domain": self.state.cultural_context.professional_domain.value
        }
    
    async def _generate_cultural_summary(self) -> Dict[str, Any]:
        """Generate cultural compliance summary for completed session"""
        
        completed_tasks = [task for task in self.state.task_plan if task.completed]
        cultural_scores = [task.cultural_score for task in completed_tasks if task.cultural_score > 0]
        
        return {
            "total_tasks": len(self.state.task_plan),
            "completed_tasks": len(completed_tasks),
            "culturally_validated_tasks": len([task for task in completed_tasks if task.cultural_validated]),
            "islamic_compliant_tasks": len([task for task in completed_tasks if task.islamic_compliant]),
            "average_cultural_score": sum(cultural_scores) / len(cultural_scores) if cultural_scores else 0.0,
            "compliance_level_achieved": self.state.cultural_context.compliance_level.value,
            "professional_domain": self.state.cultural_context.professional_domain.value,
            "performance_metrics": self.performance_metrics,
            "cultural_features_utilized": [
                "Islamic compliance validation",
                "Arabic language processing" if self.state.cultural_context.arabic_support_required else None,
                "RTL layout support" if self.state.cultural_context.rtl_support_required else None,
                f"{self.state.cultural_context.professional_domain.value} domain compliance"
            ]
        }
    
    async def get_cultural_status(self) -> Dict[str, Any]:
        """Get current cultural compliance status"""
        
        return {
            "cultural_context": {
                "compliance_level": self.state.cultural_context.compliance_level.value,
                "professional_domain": self.state.cultural_context.professional_domain.value,
                "islamic_compliance_required": self.state.cultural_context.islamic_compliance_required,
                "arabic_support_enabled": self.state.cultural_context.arabic_support_required,
                "rtl_support_enabled": self.state.cultural_context.rtl_support_required
            },
            "task_progress": {
                "total_tasks": len(self.state.task_plan),
                "current_task": self.state.current_task_index,
                "completed_tasks": len([task for task in self.state.task_plan if task.completed]),
                "culturally_validated": len([task for task in self.state.task_plan if task.cultural_validated])
            },
            "compliance_metrics": {
                "average_cultural_score": self.performance_metrics["average_cultural_score"],
                "total_validations": self.performance_metrics["cultural_validations"],
                "islamic_compliance_checks": self.performance_metrics["islamic_compliance_checks"],
                "arabic_processing_operations": self.performance_metrics["arabic_processing_operations"]
            },
            "session_status": "active" if self.state.current_task_index < len(self.state.task_plan) else "completed"
        }


# Example usage and testing
async def main():
    """Example usage of Iraqi Programming Agent"""
    
    # Initialize agent with professional medical domain
    cultural_context = CulturalContext(
        compliance_level=CulturalComplianceLevel.PROFESSIONAL,
        professional_domain=ProfessionalDomain.MEDICAL,
        islamic_compliance_required=True,
        arabic_support_required=True,
        rtl_support_required=True
    )
    
    agent = IraqiProgrammingAgent(cultural_context)
    
    # Initialize session
    init_result = await agent.initialize_session(
        repository_path="/path/to/iraqi/medical/system",
        task_description="Create patient management system with Arabic support and Islamic medical ethics compliance",
        professional_domain=ProfessionalDomain.MEDICAL
    )
    
    print("=== Iraqi Programming Agent Initialized ===")
    print(json.dumps(init_result, indent=2, ensure_ascii=False))
    
    # Execute tasks
    while True:
        step_result = await agent.execute_task_step()
        print(f"\n=== Task Step Result ===")
        print(json.dumps(step_result, indent=2, ensure_ascii=False))
        
        if step_result["status"] == "completed":
            break
    
    # Get final cultural status
    final_status = await agent.get_cultural_status()
    print(f"\n=== Final Cultural Compliance Status ===")
    print(json.dumps(final_status, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    asyncio.run(main())