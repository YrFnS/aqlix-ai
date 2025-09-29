# Recipe System for Iraqi AI Chat System

**Extracted from**: Block/Goose `crates/goose/src/recipe/`  
**Value**: 2-3 weeks development time saved  
**Iraqi Integration Focus**: Professional domain automation, Islamic compliance workflows, government procedure templates

## 🎯 OVERVIEW

Production automation templates and workflow orchestration system adapted for Iraqi professional services, featuring Islamic compliance validation, Arabic document generation, and Iraqi government procedure automation.

## 📁 RECIPE SYSTEM ARCHITECTURE

### Core Recipe Framework (`template_recipe.py`)

```python
from typing import Dict, List, Optional, Any, Union, Callable
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
import yaml
import json
import asyncio

class IraqiDomain(Enum):
    LEGAL = "legal"
    MEDICAL = "medical"
    EDUCATIONAL = "educational"
    GOVERNMENT = "government"
    BUSINESS = "business"

class RecipeComplexity(Enum):
    SIMPLE = "simple"
    INTERMEDIATE = "intermediate"
    COMPLEX = "complex"
    ENTERPRISE = "enterprise"

@dataclass
class IraqiRecipeContext:
    """Iraqi-specific context for recipe execution"""
    domain: IraqiDomain
    language: str = "arabic"
    islamic_compliance_required: bool = True
    formal_language_required: bool = True
    government_security_level: Optional[str] = None
    regional_context: Optional[str] = None
    user_professional_level: str = "general"  # general, professional, expert

    def to_dict(self) -> Dict[str, Any]:
        return {
            'domain': self.domain.value,
            'language': self.language,
            'islamic_compliance_required': self.islamic_compliance_required,
            'formal_language_required': self.formal_language_required,
            'government_security_level': self.government_security_level,
            'regional_context': self.regional_context,
            'user_professional_level': self.user_professional_level
        }

@dataclass
class RecipeStep:
    """Individual step in an Iraqi recipe"""
    id: str
    name: str
    description: str
    action_type: str  # mcp_tool, llm_call, validation, user_input
    parameters: Dict[str, Any] = field(default_factory=dict)
    cultural_validation_required: bool = True
    depends_on: List[str] = field(default_factory=list)
    timeout_seconds: int = 30
    retry_count: int = 3
    success_condition: Optional[str] = None
    error_handling: Optional[Dict] = None

@dataclass
class IraqiRecipe:
    """Complete Iraqi workflow automation recipe"""
    id: str
    name: str
    description: str
    domain: IraqiDomain
    complexity: RecipeComplexity
    version: str
    author: str

    # Recipe metadata
    tags: List[str] = field(default_factory=list)
    estimated_duration_minutes: int = 5
    required_tools: List[str] = field(default_factory=list)
    required_permissions: List[str] = field(default_factory=list)
    cultural_compliance_level: str = "high"

    # Recipe structure
    parameters: Dict[str, Any] = field(default_factory=dict)
    steps: List[RecipeStep] = field(default_factory=list)
    validation_rules: Dict[str, Any] = field(default_factory=dict)

    # Iraqi-specific features
    islamic_compliance_rules: Dict[str, Any] = field(default_factory=dict)
    arabic_language_requirements: Dict[str, Any] = field(default_factory=dict)
    professional_standards: Dict[str, Any] = field(default_factory=dict)

    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)

    def to_yaml(self) -> str:
        """Export recipe to YAML format"""
        recipe_dict = {
            'recipe': {
                'id': self.id,
                'name': self.name,
                'description': self.description,
                'domain': self.domain.value,
                'complexity': self.complexity.value,
                'version': self.version,
                'author': self.author,
                'metadata': {
                    'tags': self.tags,
                    'estimated_duration_minutes': self.estimated_duration_minutes,
                    'required_tools': self.required_tools,
                    'required_permissions': self.required_permissions,
                    'cultural_compliance_level': self.cultural_compliance_level
                },
                'iraqi_context': {
                    'islamic_compliance_rules': self.islamic_compliance_rules,
                    'arabic_language_requirements': self.arabic_language_requirements,
                    'professional_standards': self.professional_standards
                },
                'parameters': self.parameters,
                'steps': [
                    {
                        'id': step.id,
                        'name': step.name,
                        'description': step.description,
                        'action_type': step.action_type,
                        'parameters': step.parameters,
                        'cultural_validation_required': step.cultural_validation_required,
                        'depends_on': step.depends_on,
                        'timeout_seconds': step.timeout_seconds,
                        'retry_count': step.retry_count,
                        'success_condition': step.success_condition,
                        'error_handling': step.error_handling
                    } for step in self.steps
                ],
                'validation_rules': self.validation_rules
            }
        }

        return yaml.dump(recipe_dict, allow_unicode=True, default_flow_style=False)

    @classmethod
    def from_yaml(cls, yaml_content: str) -> 'IraqiRecipe':
        """Load recipe from YAML format"""
        data = yaml.safe_load(yaml_content)['recipe']

        steps = [
            RecipeStep(
                id=step_data['id'],
                name=step_data['name'],
                description=step_data['description'],
                action_type=step_data['action_type'],
                parameters=step_data.get('parameters', {}),
                cultural_validation_required=step_data.get('cultural_validation_required', True),
                depends_on=step_data.get('depends_on', []),
                timeout_seconds=step_data.get('timeout_seconds', 30),
                retry_count=step_data.get('retry_count', 3),
                success_condition=step_data.get('success_condition'),
                error_handling=step_data.get('error_handling')
            ) for step_data in data.get('steps', [])
        ]

        return cls(
            id=data['id'],
            name=data['name'],
            description=data['description'],
            domain=IraqiDomain(data['domain']),
            complexity=RecipeComplexity(data['complexity']),
            version=data['version'],
            author=data['author'],
            tags=data.get('metadata', {}).get('tags', []),
            estimated_duration_minutes=data.get('metadata', {}).get('estimated_duration_minutes', 5),
            required_tools=data.get('metadata', {}).get('required_tools', []),
            required_permissions=data.get('metadata', {}).get('required_permissions', []),
            cultural_compliance_level=data.get('metadata', {}).get('cultural_compliance_level', 'high'),
            parameters=data.get('parameters', {}),
            steps=steps,
            validation_rules=data.get('validation_rules', {}),
            islamic_compliance_rules=data.get('iraqi_context', {}).get('islamic_compliance_rules', {}),
            arabic_language_requirements=data.get('iraqi_context', {}).get('arabic_language_requirements', {}),
            professional_standards=data.get('iraqi_context', {}).get('professional_standards', {})
        )

class IraqiRecipeExecutor:
    """
    Execute Iraqi workflow automation recipes with cultural compliance
    """

    def __init__(self, mcp_clients: Dict[str, Any], llm_providers: Dict[str, Any]):
        self.mcp_clients = mcp_clients
        self.llm_providers = llm_providers
        self.execution_history: List[Dict] = []
        self.cultural_validators: List[Callable] = []

    async def execute_recipe(
        self,
        recipe: IraqiRecipe,
        context: IraqiRecipeContext,
        user_inputs: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Execute Iraqi recipe with cultural compliance validation"""

        execution_id = f"exec_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        execution_log = {
            'execution_id': execution_id,
            'recipe_id': recipe.id,
            'context': context.to_dict(),
            'started_at': datetime.now().isoformat(),
            'steps_completed': [],
            'steps_failed': [],
            'cultural_violations': [],
            'status': 'running'
        }

        try:
            # Pre-execution validation
            validation_result = await self._validate_recipe_execution(recipe, context)
            if not validation_result['valid']:
                return {
                    'success': False,
                    'error': 'Recipe validation failed',
                    'validation_issues': validation_result['issues'],
                    'execution_id': execution_id
                }

            # Execute steps in dependency order
            step_results = {}
            for step in self._get_execution_order(recipe.steps):

                # Check dependencies
                if not self._check_step_dependencies(step, step_results):
                    execution_log['steps_failed'].append({
                        'step_id': step.id,
                        'reason': 'Dependencies not satisfied'
                    })
                    continue

                # Execute step with cultural validation
                step_result = await self._execute_step(step, context, step_results, user_inputs)
                step_results[step.id] = step_result

                if step_result['success']:
                    execution_log['steps_completed'].append(step.id)
                else:
                    execution_log['steps_failed'].append({
                        'step_id': step.id,
                        'error': step_result.get('error'),
                        'cultural_issues': step_result.get('cultural_issues', [])
                    })

                    # Record cultural violations
                    if step_result.get('cultural_issues'):
                        execution_log['cultural_violations'].extend(step_result['cultural_issues'])

                    # Handle step failure based on recipe settings
                    if not step_result.get('continue_on_failure', False):
                        break

            # Post-execution validation
            final_validation = await self._validate_recipe_completion(
                recipe, context, step_results
            )

            execution_log.update({
                'completed_at': datetime.now().isoformat(),
                'status': 'completed' if not execution_log['steps_failed'] else 'failed',
                'final_validation': final_validation,
                'results': step_results
            })

            self.execution_history.append(execution_log)

            return {
                'success': len(execution_log['steps_failed']) == 0,
                'execution_id': execution_id,
                'results': step_results,
                'cultural_compliance_score': final_validation.get('cultural_compliance_score', 0.0),
                'execution_log': execution_log
            }

        except Exception as e:
            execution_log.update({
                'completed_at': datetime.now().isoformat(),
                'status': 'error',
                'error': str(e)
            })

            self.execution_history.append(execution_log)

            return {
                'success': False,
                'error': str(e),
                'execution_id': execution_id,
                'execution_log': execution_log
            }

    async def _execute_step(
        self,
        step: RecipeStep,
        context: IraqiRecipeContext,
        previous_results: Dict[str, Any],
        user_inputs: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Execute individual recipe step with cultural validation"""

        try:
            # Cultural pre-validation
            if step.cultural_validation_required:
                cultural_check = await self._validate_step_cultural_compliance(
                    step, context, previous_results
                )
                if not cultural_check['compliant']:
                    return {
                        'success': False,
                        'error': 'Cultural compliance violation',
                        'cultural_issues': cultural_check['issues']
                    }

            # Execute based on action type
            if step.action_type == 'mcp_tool':
                result = await self._execute_mcp_tool_step(step, context, previous_results)
            elif step.action_type == 'llm_call':
                result = await self._execute_llm_step(step, context, previous_results)
            elif step.action_type == 'validation':
                result = await self._execute_validation_step(step, context, previous_results)
            elif step.action_type == 'user_input':
                result = await self._execute_user_input_step(step, context, user_inputs)
            else:
                return {
                    'success': False,
                    'error': f'Unknown action type: {step.action_type}'
                }

            # Cultural post-validation
            if step.cultural_validation_required and result['success']:
                post_validation = await self._validate_step_output_cultural_compliance(
                    step, result, context
                )
                if not post_validation['compliant']:
                    result.update({
                        'cultural_issues': post_validation['issues'],
                        'cultural_compliance_score': post_validation['score']
                    })

            return result

        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'step_id': step.id
            }

    async def _execute_mcp_tool_step(
        self,
        step: RecipeStep,
        context: IraqiRecipeContext,
        previous_results: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Execute MCP tool step with Iraqi context"""

        tool_name = step.parameters.get('tool_name')
        server_name = step.parameters.get('server_name', 'default')
        tool_parameters = step.parameters.get('tool_parameters', {})

        # Substitute parameters from previous results
        resolved_parameters = self._resolve_parameter_substitutions(
            tool_parameters, previous_results, context
        )

        # Get appropriate MCP client
        if server_name not in self.mcp_clients:
            return {
                'success': False,
                'error': f'MCP server {server_name} not available'
            }

        mcp_client = self.mcp_clients[server_name]

        try:
            # Execute MCP tool with Iraqi cultural context
            result = await mcp_client.call_tool(tool_name, resolved_parameters)

            return {
                'success': True,
                'result': result,
                'tool_name': tool_name,
                'server_name': server_name,
                'cultural_context_applied': True
            }

        except Exception as e:
            return {
                'success': False,
                'error': f'MCP tool execution failed: {str(e)}',
                'tool_name': tool_name,
                'server_name': server_name
            }

    def _resolve_parameter_substitutions(
        self,
        parameters: Dict[str, Any],
        previous_results: Dict[str, Any],
        context: IraqiRecipeContext
    ) -> Dict[str, Any]:
        """Resolve parameter substitutions from previous steps and context"""

        resolved = {}

        for key, value in parameters.items():
            if isinstance(value, str):
                # Handle substitutions like ${step_id.result.field}
                if value.startswith('${') and value.endswith('}'):
                    substitution_path = value[2:-1]  # Remove ${ and }
                    resolved_value = self._resolve_substitution_path(
                        substitution_path, previous_results, context
                    )
                    resolved[key] = resolved_value
                else:
                    resolved[key] = value
            else:
                resolved[key] = value

        return resolved

    def _resolve_substitution_path(
        self,
        path: str,
        previous_results: Dict[str, Any],
        context: IraqiRecipeContext
    ) -> Any:
        """Resolve substitution path like 'step_id.result.field' or 'context.language'"""

        parts = path.split('.')

        if parts[0] == 'context':
            # Context substitution
            context_dict = context.to_dict()
            current = context_dict
            for part in parts[1:]:
                if isinstance(current, dict) and part in current:
                    current = current[part]
                else:
                    return None
            return current

        elif parts[0] in previous_results:
            # Previous step result substitution
            current = previous_results[parts[0]]
            for part in parts[1:]:
                if isinstance(current, dict) and part in current:
                    current = current[part]
                else:
                    return None
            return current

        return None
```

## 🏛️ IRAQI PROFESSIONAL DOMAIN RECIPES

### Legal Domain Recipes

#### Iraqi Legal Contract Generator Recipe

```yaml
recipe:
  id: "iraqi_legal_contract_generator"
  name: "Iraqi Legal Contract Generator"
  description: "Generate legally compliant contracts under Iraqi law with Islamic jurisprudence compatibility"
  domain: "legal"
  complexity: "intermediate"
  version: "1.0.0"
  author: "Iraqi AI Legal Team"

  metadata:
    tags: ["legal", "contracts", "iraqi_law", "islamic_compliance"]
    estimated_duration_minutes: 15
    required_tools:
      ["legal_document_generator", "cultural_validation", "iraqi_law_search"]
    required_permissions: ["legal_document_access"]
    cultural_compliance_level: "high"

  iraqi_context:
    islamic_compliance_rules:
      interest_prohibition: true
      gambling_prohibition: true
      alcohol_prohibition: true
      islamic_contract_principles: true
    arabic_language_requirements:
      formal_arabic: true
      legal_terminology: true
      bilingual_support: true
    professional_standards:
      iraqi_bar_association: true
      notarization_requirements: true
      government_registration: true

  parameters:
    contract_type:
      type: "string"
      required: true
      enum: ["sale", "lease", "service", "employment", "partnership"]
      description: "Type of contract to generate"

    parties:
      type: "array"
      required: true
      description: "Contract parties information"
      items:
        type: "object"
        properties:
          name: { type: "string", required: true }
          type: { type: "string", enum: ["individual", "company"] }
          id_number: { type: "string" }
          address: { type: "string" }

    contract_terms:
      type: "object"
      required: true
      description: "Contract-specific terms and conditions"

    language:
      type: "string"
      default: "arabic"
      enum: ["arabic", "bilingual"]
      description: "Contract language"

    islamic_compliance:
      type: "boolean"
      default: true
      description: "Ensure Islamic compliance"

  steps:
    - id: "validate_parties"
      name: "Validate Contract Parties"
      description: "Validate party information against Iraqi legal requirements"
      action_type: "mcp_tool"
      parameters:
        server_name: "legal_services"
        tool_name: "validate_legal_parties"
        tool_parameters:
          parties: "${parties}"
          contract_type: "${contract_type}"
      cultural_validation_required: true
      timeout_seconds: 30

    - id: "check_islamic_compliance"
      name: "Islamic Compliance Check"
      description: "Validate contract terms for Islamic compliance"
      action_type: "mcp_tool"
      parameters:
        server_name: "cultural_validation"
        tool_name: "validate_islamic_compliance"
        tool_parameters:
          content: "${contract_terms}"
          content_type: "contract"
          validation_level: "strict"
      depends_on: ["validate_parties"]
      cultural_validation_required: true

    - id: "search_relevant_law"
      name: "Search Relevant Iraqi Law"
      description: "Find applicable Iraqi legal provisions"
      action_type: "mcp_tool"
      parameters:
        server_name: "legal_services"
        tool_name: "search_iraqi_law"
        tool_parameters:
          query: "عقد ${contract_type} القانون العراقي"
          law_type: "civil"
          language: "arabic"
      depends_on: ["check_islamic_compliance"]

    - id: "generate_contract"
      name: "Generate Legal Contract"
      description: "Generate the final contract document"
      action_type: "mcp_tool"
      parameters:
        server_name: "legal_services"
        tool_name: "generate_legal_document"
        tool_parameters:
          document_type: "contract"
          contract_type: "${contract_type}"
          parties: "${validate_parties.result}"
          terms: "${contract_terms}"
          applicable_law: "${search_relevant_law.result}"
          language: "${language}"
          islamic_compliant: "${islamic_compliance}"
      depends_on: ["search_relevant_law"]
      cultural_validation_required: true
      timeout_seconds: 60

    - id: "final_validation"
      name: "Final Contract Validation"
      description: "Final validation of generated contract"
      action_type: "validation"
      parameters:
        validation_type: "comprehensive"
        check_arabic_grammar: true
        check_legal_accuracy: true
        check_islamic_compliance: true
      depends_on: ["generate_contract"]

  validation_rules:
    required_sections: ["parties", "terms", "obligations", "signatures"]
    arabic_text_quality: 0.95
    legal_accuracy_score: 0.90
    islamic_compliance_score: 0.98
```

#### Iraqi Government Document Processing Recipe

```yaml
recipe:
  id: "iraqi_government_document_processing"
  name: "Iraqi Government Document Processing"
  description: "Process and validate Iraqi government documents with OCR and verification"
  domain: "government"
  complexity: "complex"
  version: "1.0.0"
  author: "Iraqi AI Government Services Team"

  metadata:
    tags: ["government", "documents", "ocr", "verification", "citizen_services"]
    estimated_duration_minutes: 10
    required_tools:
      ["arabic_ocr_extract", "document_verification", "government_portal"]
    required_permissions: ["government_document_access"]
    cultural_compliance_level: "high"

  iraqi_context:
    islamic_compliance_rules:
      privacy_respect: true
      family_information_sensitivity: true
    arabic_language_requirements:
      iraqi_arabic_dialect: true
      formal_document_language: true
      government_terminology: true
    professional_standards:
      government_security_clearance: true
      citizen_privacy_protection: true
      official_document_standards: true

  parameters:
    document_image:
      type: "string"
      required: true
      description: "Base64 encoded document image"

    document_type:
      type: "string"
      required: true
      enum:
        [
          "id_card",
          "passport",
          "birth_certificate",
          "marriage_certificate",
          "education_certificate",
        ]
      description: "Type of government document"

    verification_level:
      type: "string"
      default: "standard"
      enum: ["basic", "standard", "comprehensive"]
      description: "Level of document verification"

    citizen_consent:
      type: "boolean"
      required: true
      description: "Citizen consent for document processing"

  steps:
    - id: "consent_validation"
      name: "Validate Citizen Consent"
      description: "Ensure proper consent for document processing"
      action_type: "validation"
      parameters:
        consent_required: true
        privacy_notice_acknowledged: "${citizen_consent}"
      cultural_validation_required: true

    - id: "extract_document_text"
      name: "Extract Arabic Text from Document"
      description: "Use OCR to extract Arabic text from government document"
      action_type: "mcp_tool"
      parameters:
        server_name: "document_processing"
        tool_name: "arabic_ocr_extract"
        tool_parameters:
          image_data: "${document_image}"
          document_type: "${document_type}"
          enhancement: true
      depends_on: ["consent_validation"]
      timeout_seconds: 45

    - id: "validate_document_authenticity"
      name: "Validate Document Authenticity"
      description: "Verify document against government databases"
      action_type: "mcp_tool"
      parameters:
        server_name: "government_portal"
        tool_name: "verify_government_document"
        tool_parameters:
          document_data: "${extract_document_text.result}"
          document_type: "${document_type}"
          verification_level: "${verification_level}"
      depends_on: ["extract_document_text"]
      timeout_seconds: 60

    - id: "cultural_appropriateness_check"
      name: "Cultural Appropriateness Check"
      description: "Ensure extracted information respects cultural norms"
      action_type: "mcp_tool"
      parameters:
        server_name: "cultural_validation"
        tool_name: "check_iraqi_cultural_appropriateness"
        tool_parameters:
          content: "${extract_document_text.result.extracted_text}"
          context: "government"
          formality_level: "formal"
      depends_on: ["validate_document_authenticity"]
      cultural_validation_required: true

    - id: "generate_verification_report"
      name: "Generate Verification Report"
      description: "Create comprehensive verification report"
      action_type: "llm_call"
      parameters:
        provider: "openai"
        model: "gpt-4"
        system_prompt: |
          You are an Iraqi government document verification assistant.
          Generate a comprehensive verification report in Arabic with the following requirements:
          - Maintain strict confidentiality and privacy
          - Use formal Arabic appropriate for government communications
          - Include verification status and confidence levels
          - Respect Islamic values and Iraqi cultural norms
          - Follow Iraqi government document standards
        user_prompt: |
          Document Type: ${document_type}
          OCR Results: ${extract_document_text.result}
          Verification Status: ${validate_document_authenticity.result}
          Cultural Check: ${cultural_appropriateness_check.result}

          Please generate a verification report in Arabic.
      depends_on: ["cultural_appropriateness_check"]
      timeout_seconds: 30

  validation_rules:
    ocr_confidence_threshold: 0.85
    authenticity_verification_required: true
    cultural_compliance_score: 0.95
    privacy_protection_level: "maximum"
```

### Medical Domain Recipe

#### Iraqi Medical Consultation Assistant Recipe

```yaml
recipe:
  id: "iraqi_medical_consultation_assistant"
  name: "Iraqi Medical Consultation Assistant"
  description: "Assist with medical consultations following Iraqi healthcare standards and Islamic medical ethics"
  domain: "medical"
  complexity: "complex"
  version: "1.0.0"
  author: "Iraqi AI Medical Team"

  metadata:
    tags:
      [
        "medical",
        "consultation",
        "islamic_ethics",
        "healthcare",
        "patient_privacy",
      ]
    estimated_duration_minutes: 20
    required_tools:
      ["medical_reference", "symptom_checker", "cultural_validation"]
    required_permissions: ["medical_information_access"]
    cultural_compliance_level: "high"

  iraqi_context:
    islamic_compliance_rules:
      patient_privacy_islamic: true
      gender_appropriate_consultation: true
      medical_ethics_islamic: true
      end_of_life_considerations: true
    arabic_language_requirements:
      medical_arabic_terminology: true
      patient_communication_arabic: true
      formal_medical_language: true
    professional_standards:
      iraqi_medical_association: true
      hospital_protocols_iraq: true
      patient_rights_iraqi_law: true

  parameters:
    patient_age:
      type: "integer"
      required: true
      description: "Patient age"

    patient_gender:
      type: "string"
      required: true
      enum: ["male", "female"]
      description: "Patient gender for appropriate consultation"

    symptoms:
      type: "array"
      required: true
      description: "List of patient symptoms"
      items:
        type: "string"

    medical_history:
      type: "array"
      required: false
      description: "Relevant medical history"
      items:
        type: "string"

    consultation_language:
      type: "string"
      default: "arabic"
      enum: ["arabic", "english", "kurdish"]
      description: "Preferred consultation language"

    urgency_level:
      type: "string"
      default: "routine"
      enum: ["emergency", "urgent", "routine"]
      description: "Medical urgency level"

  steps:
    - id: "medical_ethics_validation"
      name: "Medical Ethics Validation"
      description: "Validate consultation against Islamic medical ethics"
      action_type: "mcp_tool"
      parameters:
        server_name: "cultural_validation"
        tool_name: "validate_islamic_compliance"
        tool_parameters:
          content: "Medical consultation for ${patient_gender} patient, age ${patient_age}"
          content_type: "medical_consultation"
          validation_level: "strict"
          target_audience: "medical"
      cultural_validation_required: true

    - id: "symptom_analysis"
      name: "Analyze Patient Symptoms"
      description: "Analyze symptoms using Iraqi medical knowledge base"
      action_type: "mcp_tool"
      parameters:
        server_name: "medical_services"
        tool_name: "analyze_symptoms_iraqi"
        tool_parameters:
          symptoms: "${symptoms}"
          patient_age: "${patient_age}"
          patient_gender: "${patient_gender}"
          medical_history: "${medical_history}"
          language: "${consultation_language}"
      depends_on: ["medical_ethics_validation"]
      timeout_seconds: 45

    - id: "generate_consultation_guidance"
      name: "Generate Consultation Guidance"
      description: "Create culturally appropriate medical guidance"
      action_type: "llm_call"
      parameters:
        provider: "anthropic"
        model: "claude-3-sonnet"
        system_prompt: |
          You are an Iraqi medical consultation assistant following Islamic medical ethics.

          Guidelines:
          - Maintain strict patient confidentiality
          - Follow Islamic bioethics principles
          - Use appropriate Arabic medical terminology
          - Respect cultural sensitivities around gender, family, and religious practices
          - Always recommend consulting qualified Iraqi medical professionals
          - Never provide definitive diagnoses or treatment prescriptions
          - Consider Iraqi healthcare system context

          Language: ${consultation_language}
          Patient Context: ${patient_gender}, age ${patient_age}
        user_prompt: |
          Patient Symptoms: ${symptoms}
          Medical History: ${medical_history}
          Symptom Analysis: ${symptom_analysis.result}
          Urgency Level: ${urgency_level}

          Please provide appropriate medical consultation guidance in ${consultation_language}.
      depends_on: ["symptom_analysis"]
      cultural_validation_required: true
      timeout_seconds: 40

    - id: "cultural_medical_validation"
      name: "Cultural Medical Validation"
      description: "Validate medical guidance for cultural appropriateness"
      action_type: "mcp_tool"
      parameters:
        server_name: "cultural_validation"
        tool_name: "check_iraqi_cultural_appropriateness"
        tool_parameters:
          content: "${generate_consultation_guidance.result}"
          context: "medical"
          formality_level: "professional"
      depends_on: ["generate_consultation_guidance"]
      cultural_validation_required: true

    - id: "generate_referral_recommendations"
      name: "Generate Referral Recommendations"
      description: "Recommend appropriate Iraqi healthcare providers"
      action_type: "mcp_tool"
      parameters:
        server_name: "medical_services"
        tool_name: "recommend_iraqi_healthcare_providers"
        tool_parameters:
          symptoms: "${symptoms}"
          urgency_level: "${urgency_level}"
          patient_location: "iraq"
          patient_gender: "${patient_gender}"
          specialization_needed: "${symptom_analysis.result.recommended_specialization}"
      depends_on: ["cultural_medical_validation"]
      timeout_seconds: 30

  validation_rules:
    medical_accuracy_threshold: 0.90
    cultural_appropriateness_score: 0.95
    islamic_compliance_score: 0.98
    patient_privacy_protection: true
    professional_disclaimer_required: true
```

### Educational Domain Recipe

#### Iraqi Academic Content Generator Recipe

```yaml
recipe:
  id: "iraqi_academic_content_generator"
  name: "Iraqi Academic Content Generator"
  description: "Generate educational content aligned with Iraqi curriculum and Islamic educational values"
  domain: "educational"
  complexity: "intermediate"
  version: "1.0.0"
  author: "Iraqi AI Education Team"

  metadata:
    tags:
      [
        "education",
        "curriculum",
        "islamic_values",
        "arabic_content",
        "student_learning",
      ]
    estimated_duration_minutes: 12
    required_tools:
      ["curriculum_reference", "content_validator", "educational_tools"]
    required_permissions: ["educational_content_creation"]
    cultural_compliance_level: "high"

  iraqi_context:
    islamic_compliance_rules:
      educational_content_islamic: true
      age_appropriate_content: true
      moral_guidance_included: true
    arabic_language_requirements:
      educational_arabic: true
      age_appropriate_language: true
      curriculum_terminology: true
    professional_standards:
      iraqi_ministry_of_education: true
      curriculum_alignment: true
      teacher_standards: true

  parameters:
    subject:
      type: "string"
      required: true
      enum:
        [
          "arabic",
          "islamic_studies",
          "mathematics",
          "science",
          "history",
          "geography",
          "english",
        ]
      description: "Academic subject"

    grade_level:
      type: "integer"
      required: true
      minimum: 1
      maximum: 12
      description: "Student grade level (1-12)"

    topic:
      type: "string"
      required: true
      description: "Specific topic within the subject"

    content_type:
      type: "string"
      required: true
      enum: ["lesson_plan", "worksheet", "quiz", "project", "explanation"]
      description: "Type of educational content"

    student_level:
      type: "string"
      default: "average"
      enum: ["beginner", "average", "advanced", "gifted"]
      description: "Student academic level"

    islamic_integration:
      type: "boolean"
      default: true
      description: "Include Islamic values and perspectives"

  steps:
    - id: "curriculum_alignment_check"
      name: "Check Curriculum Alignment"
      description: "Verify alignment with Iraqi Ministry of Education curriculum"
      action_type: "mcp_tool"
      parameters:
        server_name: "educational_services"
        tool_name: "check_curriculum_alignment"
        tool_parameters:
          subject: "${subject}"
          grade_level: "${grade_level}"
          topic: "${topic}"
          content_type: "${content_type}"
      cultural_validation_required: true

    - id: "islamic_values_integration"
      name: "Islamic Values Integration Planning"
      description: "Plan appropriate Islamic values integration"
      action_type: "mcp_tool"
      parameters:
        server_name: "cultural_validation"
        tool_name: "plan_islamic_education_integration"
        tool_parameters:
          subject: "${subject}"
          topic: "${topic}"
          grade_level: "${grade_level}"
          integration_required: "${islamic_integration}"
      depends_on: ["curriculum_alignment_check"]
      cultural_validation_required: true

    - id: "generate_educational_content"
      name: "Generate Educational Content"
      description: "Create age-appropriate educational content"
      action_type: "llm_call"
      parameters:
        provider: "openai"
        model: "gpt-4"
        system_prompt: |
          You are an Iraqi educational content creator specializing in curriculum-aligned materials.

          Guidelines:
          - Follow Iraqi Ministry of Education curriculum standards
          - Integrate Islamic values and perspectives appropriately
          - Use age-appropriate Arabic language for grade ${grade_level}
          - Include Iraqi cultural context and examples
          - Ensure content is engaging and educationally sound
          - Follow Islamic educational principles
          - Use proper Arabic educational terminology

          Subject: ${subject}
          Grade Level: ${grade_level}
          Student Level: ${student_level}
        user_prompt: |
          Topic: ${topic}
          Content Type: ${content_type}
          Curriculum Requirements: ${curriculum_alignment_check.result}
          Islamic Integration Plan: ${islamic_values_integration.result}

          Please create educational content in Arabic that meets these requirements.
      depends_on: ["islamic_values_integration"]
      timeout_seconds: 60

    - id: "age_appropriateness_validation"
      name: "Age Appropriateness Validation"
      description: "Validate content for age appropriateness"
      action_type: "mcp_tool"
      parameters:
        server_name: "educational_services"
        tool_name: "validate_age_appropriateness"
        tool_parameters:
          content: "${generate_educational_content.result}"
          grade_level: "${grade_level}"
          student_level: "${student_level}"
          subject: "${subject}"
      depends_on: ["generate_educational_content"]
      cultural_validation_required: true

    - id: "educational_quality_assessment"
      name: "Educational Quality Assessment"
      description: "Assess educational quality and effectiveness"
      action_type: "mcp_tool"
      parameters:
        server_name: "educational_services"
        tool_name: "assess_educational_quality"
        tool_parameters:
          content: "${generate_educational_content.result}"
          content_type: "${content_type}"
          learning_objectives: "${curriculum_alignment_check.result.learning_objectives}"
          grade_level: "${grade_level}"
      depends_on: ["age_appropriateness_validation"]
      timeout_seconds: 30

  validation_rules:
    curriculum_alignment_score: 0.90
    age_appropriateness_score: 0.95
    islamic_values_integration_score: 0.90
    arabic_language_quality: 0.93
    educational_effectiveness_score: 0.88
```

## 🔧 RECIPE MANAGEMENT SYSTEM

### Recipe Registry and Discovery

```python
class IraqiRecipeRegistry:
    """
    Central registry for Iraqi workflow automation recipes
    """

    def __init__(self):
        self.recipes: Dict[str, IraqiRecipe] = {}
        self.domain_index: Dict[IraqiDomain, List[str]] = {}
        self.tag_index: Dict[str, List[str]] = {}
        self.complexity_index: Dict[RecipeComplexity, List[str]] = {}

    def register_recipe(self, recipe: IraqiRecipe):
        """Register a new recipe in the registry"""
        self.recipes[recipe.id] = recipe

        # Update domain index
        if recipe.domain not in self.domain_index:
            self.domain_index[recipe.domain] = []
        self.domain_index[recipe.domain].append(recipe.id)

        # Update tag index
        for tag in recipe.tags:
            if tag not in self.tag_index:
                self.tag_index[tag] = []
            self.tag_index[tag].append(recipe.id)

        # Update complexity index
        if recipe.complexity not in self.complexity_index:
            self.complexity_index[recipe.complexity] = []
        self.complexity_index[recipe.complexity].append(recipe.id)

    def find_recipes_by_domain(self, domain: IraqiDomain) -> List[IraqiRecipe]:
        """Find recipes for specific Iraqi domain"""
        recipe_ids = self.domain_index.get(domain, [])
        return [self.recipes[recipe_id] for recipe_id in recipe_ids]

    def find_recipes_by_tags(self, tags: List[str]) -> List[IraqiRecipe]:
        """Find recipes matching any of the provided tags"""
        matching_ids = set()
        for tag in tags:
            if tag in self.tag_index:
                matching_ids.update(self.tag_index[tag])

        return [self.recipes[recipe_id] for recipe_id in matching_ids]

    def recommend_recipes_for_task(self, task_description: str, domain: IraqiDomain) -> List[IraqiRecipe]:
        """Recommend recipes based on task description and domain"""
        # Simple keyword matching - could be enhanced with ML
        keywords = task_description.lower().split()

        domain_recipes = self.find_recipes_by_domain(domain)
        scored_recipes = []

        for recipe in domain_recipes:
            score = 0
            recipe_text = (recipe.name + ' ' + recipe.description + ' ' + ' '.join(recipe.tags)).lower()

            for keyword in keywords:
                if keyword in recipe_text:
                    score += 1

            if score > 0:
                scored_recipes.append((recipe, score))

        # Sort by score and return top recipes
        scored_recipes.sort(key=lambda x: x[1], reverse=True)
        return [recipe for recipe, score in scored_recipes[:5]]

# Recipe collection initialization
def initialize_iraqi_recipe_collection() -> IraqiRecipeRegistry:
    """Initialize the Iraqi recipe collection with standard recipes"""

    registry = IraqiRecipeRegistry()

    # Load standard Iraqi recipes
    standard_recipes = [
        "iraqi_legal_contract_generator",
        "iraqi_government_document_processing",
        "iraqi_medical_consultation_assistant",
        "iraqi_academic_content_generator",
        "iraqi_business_registration_assistant",
        "iraqi_property_transaction_processor",
        "iraqi_educational_assessment_creator",
        "iraqi_medical_record_processor",
        "iraqi_government_service_navigator"
    ]

    # In a real implementation, these would be loaded from YAML files
    for recipe_id in standard_recipes:
        # Load recipe from file system or database
        recipe = load_recipe_from_yaml(f"recipes/{recipe_id}.yaml")
        registry.register_recipe(recipe)

    return registry
```

## 🚀 INTEGRATION STRATEGY

### Phase 1: Core Recipe Framework

1. **Recipe Engine**: Deploy Iraqi recipe execution system with cultural validation
2. **Domain Templates**: Implement legal, medical, educational, government recipe templates
3. **MCP Integration**: Connect recipes with Iraqi-specific MCP servers
4. **Cultural Validation**: Integrate Islamic compliance and Iraqi appropriateness checking

### Phase 2: Professional Recipes

1. **Legal Automation**: Deploy Iraqi legal document generation and validation recipes
2. **Government Services**: Implement citizen services automation recipes
3. **Medical Workflows**: Deploy healthcare consultation and documentation recipes
4. **Educational Content**: Implement curriculum-aligned content generation recipes

### Phase 3: Advanced Orchestration

1. **Multi-Recipe Workflows**: Chain recipes for complex Iraqi professional processes
2. **Custom Recipe Builder**: Visual interface for creating Iraqi-specific recipes
3. **Recipe Analytics**: Performance monitoring and optimization for Iraqi contexts
4. **Enterprise Integration**: Deploy for Iraqi government and institutional use

## 📊 SUCCESS METRICS

- **Recipe Execution Success**: >90% successful completion rate for Iraqi professional recipes
- **Cultural Compliance**: >95% Islamic compliance and Iraqi appropriateness score
- **Processing Speed**: <5 minutes average execution time for complex recipes
- **User Adoption**: >80% user satisfaction for Iraqi professional workflow automation
- **Domain Coverage**: 20+ specialized recipes across Iraqi professional domains

---

**Final Step**: Create comprehensive integration documentation and Iraqi enhancement strategy.
