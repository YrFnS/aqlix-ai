# Agent Platform for Iraqi AI Chat System

**Extracted from**: Block/Goose `crates/goose/src/agents/`  
**Value**: 7-10 weeks development time saved  
**Iraqi Integration Focus**: Cultural context management, professional domain specialization, subagent orchestration

## 🎯 OVERVIEW

Advanced agent platform providing runtime management, context preservation, memory systems, and subagent orchestration specifically adapted for Iraqi professional services with Islamic compliance and Arabic language support.

## 📁 CORE AGENT ARCHITECTURE

### Agent Runtime and Context Management

#### Core Agent Context (`context.py`)

```python
from typing import Dict, List, Optional, Any, Union
from dataclasses import dataclass, field
from datetime import datetime, timedelta
import json
import asyncio
from enum import Enum

class IraqiDomain(Enum):
    """Iraqi professional domains"""
    LEGAL = "legal"
    MEDICAL = "medical"
    EDUCATIONAL = "educational"
    GOVERNMENT = "government"
    BUSINESS = "business"
    PERSONAL = "personal"

class CulturalSensitivity(Enum):
    """Cultural sensitivity levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    RELIGIOUS = "religious"

@dataclass
class IraqiCulturalContext:
    """Iraqi-specific cultural context for agents"""
    domain: IraqiDomain = IraqiDomain.PERSONAL
    language: str = "arabic"
    dialect: str = "iraqi"
    formality_level: str = "professional"
    islamic_compliance_required: bool = True
    gender_context: Optional[str] = None
    age_appropriateness: str = "adult"
    sensitivity_level: CulturalSensitivity = CulturalSensitivity.HIGH
    regional_context: Optional[str] = None  # baghdad, basra, erbil, etc.
    
    def to_prompt_context(self) -> str:
        """Convert to prompt context for LLM"""
        return f"""
Cultural Context:
- Domain: {self.domain.value} ({self._get_domain_description()})
- Language: {self.language} ({self.dialect} dialect)
- Formality: {self.formality_level}
- Islamic compliance: {'Required' if self.islamic_compliance_required else 'Optional'}
- Sensitivity level: {self.sensitivity_level.value}
- Regional context: {self.regional_context or 'General Iraqi'}

Guidelines:
{self._get_cultural_guidelines()}
"""
    
    def _get_domain_description(self) -> str:
        descriptions = {
            IraqiDomain.LEGAL: "Iraqi legal system, Islamic jurisprudence, civil law",
            IraqiDomain.MEDICAL: "Iraqi healthcare system, Islamic medical ethics",
            IraqiDomain.EDUCATIONAL: "Iraqi education system, Islamic educational values",
            IraqiDomain.GOVERNMENT: "Iraqi government services, administrative procedures",
            IraqiDomain.BUSINESS: "Iraqi business practices, commercial law",
            IraqiDomain.PERSONAL: "General Iraqi social interaction"
        }
        return descriptions.get(self.domain, "General context")
    
    def _get_cultural_guidelines(self) -> str:
        """Get cultural guidelines based on domain and sensitivity"""
        base_guidelines = [
            "- Maintain respect for Islamic values and Iraqi cultural norms",
            "- Use appropriate Arabic formality and honorifics",
            "- Avoid politically sensitive or sectarian topics",
            "- Consider Iraqi social customs and professional etiquette"
        ]
        
        domain_guidelines = {
            IraqiDomain.LEGAL: [
                "- Reference Iraqi legal framework and Islamic jurisprudence",
                "- Use proper legal Arabic terminology",
                "- Maintain professional legal standards"
            ],
            IraqiDomain.MEDICAL: [
                "- Follow Iraqi medical ethics and Islamic bioethics",
                "- Use appropriate medical Arabic terminology",
                "- Respect patient privacy and religious considerations"
            ],
            IraqiDomain.EDUCATIONAL: [
                "- Align with Iraqi educational standards",
                "- Incorporate Islamic educational values",
                "- Use age-appropriate language and concepts"
            ]
        }
        
        guidelines = base_guidelines + domain_guidelines.get(self.domain, [])
        return "\n".join(guidelines)

@dataclass
class AgentMemory:
    """Agent memory system with Iraqi cultural awareness"""
    short_term: Dict[str, Any] = field(default_factory=dict)
    long_term: Dict[str, Any] = field(default_factory=dict)
    cultural_preferences: Dict[str, Any] = field(default_factory=dict)
    professional_knowledge: Dict[str, Any] = field(default_factory=dict)
    conversation_history: List[Dict] = field(default_factory=list)
    cultural_violations: List[Dict] = field(default_factory=list)
    user_context: Optional[Dict] = None
    
    def add_cultural_preference(self, key: str, value: Any, domain: IraqiDomain):
        """Add user cultural preference"""
        if domain.value not in self.cultural_preferences:
            self.cultural_preferences[domain.value] = {}
        self.cultural_preferences[domain.value][key] = value
    
    def get_cultural_preference(self, key: str, domain: IraqiDomain) -> Any:
        """Get user cultural preference for domain"""
        return self.cultural_preferences.get(domain.value, {}).get(key)
    
    def add_professional_knowledge(self, domain: IraqiDomain, knowledge: Dict):
        """Add domain-specific professional knowledge"""
        if domain.value not in self.professional_knowledge:
            self.professional_knowledge[domain.value] = []
        self.professional_knowledge[domain.value].append({
            'knowledge': knowledge,
            'timestamp': datetime.now().isoformat(),
            'validated': False
        })
    
    def record_cultural_violation(self, violation: Dict):
        """Record cultural appropriateness violation for learning"""
        self.cultural_violations.append({
            **violation,
            'timestamp': datetime.now().isoformat()
        })

class IraqiAgentContext:
    """
    Advanced agent context management for Iraqi AI Chat System
    Handles cultural context, memory, tool access, and professional domain knowledge
    """
    
    def __init__(
        self,
        agent_id: str,
        cultural_context: IraqiCulturalContext,
        user_id: Optional[str] = None
    ):
        self.agent_id = agent_id
        self.user_id = user_id
        self.cultural_context = cultural_context
        self.memory = AgentMemory()
        self.session_id = self._generate_session_id()
        self.created_at = datetime.now()
        self.last_activity = datetime.now()
        self.tools_registry: Dict[str, Any] = {}
        self.active_subagents: Dict[str, Any] = {}
        self.conversation_state = "active"
        self.cultural_compliance_score = 1.0
        
    def update_cultural_context(self, updates: Dict[str, Any]):
        """Update cultural context with new information"""
        for key, value in updates.items():
            if hasattr(self.cultural_context, key):
                setattr(self.cultural_context, key, value)
        
        # Re-evaluate compliance score
        self._update_compliance_score()
    
    def add_message(self, role: str, content: str, metadata: Optional[Dict] = None):
        """Add message to conversation history with cultural validation"""
        
        # Validate cultural appropriateness
        cultural_validation = self._validate_message_cultural_appropriateness(content)
        
        message = {
            'role': role,
            'content': content,
            'timestamp': datetime.now().isoformat(),
            'cultural_validation': cultural_validation,
            'metadata': metadata or {}
        }
        
        self.memory.conversation_history.append(message)
        self.last_activity = datetime.now()
        
        # Record violation if found
        if not cultural_validation['appropriate']:
            self.memory.record_cultural_violation({
                'message': content,
                'issues': cultural_validation['issues'],
                'domain': self.cultural_context.domain.value
            })
    
    def get_context_for_llm(self) -> Dict[str, Any]:
        """Get formatted context for LLM with Iraqi cultural awareness"""
        
        # Recent conversation history (last 10 messages)
        recent_history = self.memory.conversation_history[-10:]
        
        # Relevant professional knowledge
        professional_context = self._get_relevant_professional_knowledge()
        
        # Cultural preferences
        cultural_prefs = self.memory.cultural_preferences.get(
            self.cultural_context.domain.value, {}
        )
        
        return {
            'agent_id': self.agent_id,
            'session_id': self.session_id,
            'cultural_context': self.cultural_context.to_prompt_context(),
            'conversation_history': recent_history,
            'professional_knowledge': professional_context,
            'cultural_preferences': cultural_prefs,
            'compliance_score': self.cultural_compliance_score,
            'active_domain': self.cultural_context.domain.value,
            'memory_summary': self._generate_memory_summary()
        }
    
    def _validate_message_cultural_appropriateness(self, content: str) -> Dict[str, Any]:
        """Validate message for Iraqi cultural appropriateness"""
        
        issues = []
        
        # Check for religious sensitivity
        if self.cultural_context.islamic_compliance_required:
            religious_issues = self._check_religious_appropriateness(content)
            issues.extend(religious_issues)
        
        # Check for cultural sensitivity based on domain
        cultural_issues = self._check_domain_appropriateness(content)
        issues.extend(cultural_issues)
        
        # Check language appropriateness
        language_issues = self._check_language_appropriateness(content)
        issues.extend(language_issues)
        
        return {
            'appropriate': len(issues) == 0,
            'issues': issues,
            'score': max(0.0, 1.0 - (len(issues) * 0.2))
        }
    
    def _check_religious_appropriateness(self, content: str) -> List[str]:
        """Check content for Islamic appropriateness"""
        issues = []
        content_lower = content.lower()
        
        # Check for inappropriate religious content
        inappropriate_terms = [
            'blasphemy', 'mockery', 'inappropriate_religious_reference'
        ]
        
        for term in inappropriate_terms:
            if term in content_lower:
                issues.append(f"Contains inappropriate religious content: {term}")
        
        return issues
    
    def _check_domain_appropriateness(self, content: str) -> List[str]:
        """Check content appropriateness for specific domain"""
        issues = []
        
        if self.cultural_context.domain == IraqiDomain.LEGAL:
            # Check for legal accuracy and appropriateness
            if 'legal advice' in content.lower() and 'not licensed' not in content.lower():
                issues.append("May contain unauthorized legal advice")
        
        elif self.cultural_context.domain == IraqiDomain.MEDICAL:
            # Check for medical advice appropriateness
            if 'medical diagnosis' in content.lower() and 'consult doctor' not in content.lower():
                issues.append("May contain unauthorized medical diagnosis")
        
        return issues
    
    def _get_relevant_professional_knowledge(self) -> List[Dict]:
        """Get relevant professional knowledge for current domain"""
        domain_knowledge = self.memory.professional_knowledge.get(
            self.cultural_context.domain.value, []
        )
        
        # Return most recent and validated knowledge
        relevant_knowledge = [
            k for k in domain_knowledge 
            if k.get('validated', False)
        ][-5:]  # Last 5 validated items
        
        return relevant_knowledge
```

#### Extension Manager (`extension_manager.py`)

```python
class IraqiAgentExtensionManager:
    """
    Extension manager for Iraqi AI agents
    Handles tool registration, MCP server integration, and cultural compliance
    """
    
    def __init__(self, agent_context: IraqiAgentContext):
        self.agent_context = agent_context
        self.registered_extensions: Dict[str, Dict] = {}
        self.mcp_clients: Dict[str, Any] = {}
        self.cultural_validators: List[Callable] = []
        
    async def register_extension(
        self,
        name: str,
        extension_type: str,
        handler: Callable,
        cultural_compliance_required: bool = True,
        domain_restrictions: Optional[List[IraqiDomain]] = None
    ):
        """Register extension with Iraqi cultural compliance"""
        
        # Validate extension for cultural appropriateness
        if cultural_compliance_required:
            compliance_check = await self._validate_extension_compliance(handler)
            if not compliance_check['compliant']:
                raise ValueError(f"Extension {name} fails cultural compliance: {compliance_check['issues']}")
        
        self.registered_extensions[name] = {
            'type': extension_type,
            'handler': handler,
            'cultural_compliance_required': cultural_compliance_required,
            'domain_restrictions': domain_restrictions or [],
            'registered_at': datetime.now().isoformat(),
            'usage_count': 0,
            'cultural_violations': []
        }
    
    async def execute_extension(
        self,
        name: str,
        parameters: Dict[str, Any],
        bypass_cultural_check: bool = False
    ) -> Dict[str, Any]:
        """Execute extension with cultural validation"""
        
        if name not in self.registered_extensions:
            raise ValueError(f"Extension {name} not registered")
        
        extension = self.registered_extensions[name]
        
        # Check domain restrictions
        if extension['domain_restrictions']:
            if self.agent_context.cultural_context.domain not in extension['domain_restrictions']:
                return {
                    'success': False,
                    'error': f"Extension {name} not available for {self.agent_context.cultural_context.domain.value} domain"
                }
        
        # Cultural validation
        if extension['cultural_compliance_required'] and not bypass_cultural_check:
            cultural_validation = await self._validate_execution_parameters(parameters)
            if not cultural_validation['valid']:
                extension['cultural_violations'].append({
                    'timestamp': datetime.now().isoformat(),
                    'parameters': parameters,
                    'issues': cultural_validation['issues']
                })
                return {
                    'success': False,
                    'error': 'Cultural compliance violation',
                    'issues': cultural_validation['issues'],
                    'guidance': cultural_validation.get('guidance')
                }
        
        try:
            # Execute extension with Iraqi context
            result = await extension['handler'](
                parameters, 
                self.agent_context.cultural_context
            )
            
            # Post-execution cultural validation
            if extension['cultural_compliance_required']:
                result = await self._validate_execution_result(result)
            
            extension['usage_count'] += 1
            
            return {
                'success': True,
                'result': result,
                'cultural_compliance': True,
                'extension': name
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'extension': name
            }
    
    async def register_mcp_server(
        self,
        server_name: str,
        server_url: str,
        domain_specific: bool = False,
        security_level: str = 'standard'
    ):
        """Register MCP server for Iraqi tools"""
        
        from ..mcp_client import MCPClient
        
        try:
            # Create MCP client with Iraqi cultural context
            mcp_client = MCPClient(server_url, self.agent_context.cultural_context)
            await mcp_client.connect()
            
            # Get available tools
            available_tools = await mcp_client.list_iraqi_tools()
            
            self.mcp_clients[server_name] = {
                'client': mcp_client,
                'url': server_url,
                'tools': available_tools,
                'domain_specific': domain_specific,
                'security_level': security_level,
                'connected_at': datetime.now().isoformat()
            }
            
            # Register tools as extensions
            for tool in available_tools:
                await self._register_mcp_tool_as_extension(server_name, tool)
                
        except Exception as e:
            raise ConnectionError(f"Failed to register MCP server {server_name}: {e}")
    
    async def _register_mcp_tool_as_extension(self, server_name: str, tool: Dict):
        """Register MCP tool as agent extension"""
        
        tool_name = f"{server_name}_{tool['name']}"
        
        async def mcp_tool_handler(params: Dict, cultural_context: IraqiCulturalContext):
            """Handler for MCP tool execution"""
            mcp_client = self.mcp_clients[server_name]['client']
            return await mcp_client.call_tool(tool['name'], params)
        
        # Determine domain restrictions based on tool metadata
        domain_restrictions = []
        if tool.get('domain_specific'):
            domain_map = {
                'legal': [IraqiDomain.LEGAL],
                'medical': [IraqiDomain.MEDICAL],
                'educational': [IraqiDomain.EDUCATIONAL],
                'government': [IraqiDomain.GOVERNMENT]
            }
            domain_restrictions = domain_map.get(tool.get('domain', ''), [])
        
        await self.register_extension(
            name=tool_name,
            extension_type='mcp_tool',
            handler=mcp_tool_handler,
            cultural_compliance_required=tool.get('cultural_validation_required', True),
            domain_restrictions=domain_restrictions
        )
    
    def get_available_extensions_for_domain(self, domain: IraqiDomain) -> List[str]:
        """Get extensions available for specific domain"""
        available = []
        
        for name, extension in self.registered_extensions.items():
            # Check domain restrictions
            if extension['domain_restrictions']:
                if domain in extension['domain_restrictions']:
                    available.append(name)
            else:
                # Available for all domains
                available.append(name)
        
        return available
```

### Subagent Orchestration System

#### Subagent Manager (`subagent.py`)

```python
class IraqiSubagentManager:
    """
    Subagent orchestration system for Iraqi AI Chat System
    Manages specialized agents for different Iraqi professional domains
    """
    
    def __init__(self, main_agent_context: IraqiAgentContext):
        self.main_context = main_agent_context
        self.active_subagents: Dict[str, Dict] = {}
        self.subagent_templates: Dict[str, Dict] = {}
        self.coordination_queue: List[Dict] = []
        self._setup_iraqi_subagent_templates()
    
    def _setup_iraqi_subagent_templates(self):
        """Setup templates for Iraqi professional domain subagents"""
        
        # Legal domain subagent
        self.subagent_templates['iraqi_legal_assistant'] = {
            'name': 'Iraqi Legal Assistant',
            'description': 'Specialized in Iraqi legal system and Islamic jurisprudence',
            'domain': IraqiDomain.LEGAL,
            'cultural_context': IraqiCulturalContext(
                domain=IraqiDomain.LEGAL,
                formality_level='highly_formal',
                sensitivity_level=CulturalSensitivity.HIGH,
                islamic_compliance_required=True
            ),
            'required_tools': [
                'iraqi_law_search',
                'legal_document_generator',
                'islamic_jurisprudence_reference'
            ],
            'expertise_areas': [
                'iraqi_civil_law',
                'islamic_family_law',
                'commercial_law',
                'constitutional_law'
            ]
        }
        
        # Medical domain subagent
        self.subagent_templates['iraqi_medical_assistant'] = {
            'name': 'Iraqi Medical Assistant',
            'description': 'Specialized in Iraqi healthcare system and Islamic medical ethics',
            'domain': IraqiDomain.MEDICAL,
            'cultural_context': IraqiCulturalContext(
                domain=IraqiDomain.MEDICAL,
                formality_level='professional',
                sensitivity_level=CulturalSensitivity.HIGH,
                islamic_compliance_required=True
            ),
            'required_tools': [
                'iraqi_medical_reference',
                'symptom_checker_arabic',
                'medical_document_processor'
            ],
            'expertise_areas': [
                'iraqi_healthcare_system',
                'islamic_medical_ethics',
                'arabic_medical_terminology',
                'patient_privacy_iraqi_law'
            ]
        }
        
        # Educational domain subagent
        self.subagent_templates['iraqi_education_assistant'] = {
            'name': 'Iraqi Education Assistant',
            'description': 'Specialized in Iraqi education system and Islamic educational values',
            'domain': IraqiDomain.EDUCATIONAL,
            'cultural_context': IraqiCulturalContext(
                domain=IraqiDomain.EDUCATIONAL,
                formality_level='educational',
                sensitivity_level=CulturalSensitivity.MEDIUM,
                islamic_compliance_required=True
            ),
            'required_tools': [
                'iraqi_curriculum_reference',
                'educational_content_validator',
                'arabic_language_tools'
            ],
            'expertise_areas': [
                'iraqi_education_standards',
                'islamic_educational_values',
                'arabic_language_instruction',
                'iraqi_university_system'
            ]
        }
        
        # Government services subagent
        self.subagent_templates['iraqi_government_assistant'] = {
            'name': 'Iraqi Government Services Assistant',
            'description': 'Specialized in Iraqi government procedures and citizen services',
            'domain': IraqiDomain.GOVERNMENT,
            'cultural_context': IraqiCulturalContext(
                domain=IraqiDomain.GOVERNMENT,
                formality_level='official',
                sensitivity_level=CulturalSensitivity.HIGH,
                islamic_compliance_required=True
            ),
            'required_tools': [
                'government_portal_automation',
                'document_verification',
                'citizen_services_guide'
            ],
            'expertise_areas': [
                'iraqi_government_procedures',
                'citizen_rights_obligations',
                'administrative_law',
                'public_service_protocols'
            ]
        }
    
    async def spawn_subagent(
        self,
        template_name: str,
        task_description: str,
        specific_context: Optional[Dict] = None
    ) -> str:
        """Spawn specialized subagent for Iraqi domain"""
        
        if template_name not in self.subagent_templates:
            raise ValueError(f"Subagent template {template_name} not found")
        
        template = self.subagent_templates[template_name].copy()
        subagent_id = f"{template_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Create subagent context
        subagent_cultural_context = template['cultural_context']
        if specific_context:
            for key, value in specific_context.items():
                if hasattr(subagent_cultural_context, key):
                    setattr(subagent_cultural_context, key, value)
        
        subagent_context = IraqiAgentContext(
            agent_id=subagent_id,
            cultural_context=subagent_cultural_context,
            user_id=self.main_context.user_id
        )
        
        # Initialize subagent with required tools
        extension_manager = IraqiAgentExtensionManager(subagent_context)
        
        # Register required MCP servers based on domain
        await self._setup_subagent_tools(extension_manager, template['domain'])
        
        # Store subagent information
        self.active_subagents[subagent_id] = {
            'context': subagent_context,
            'extension_manager': extension_manager,
            'template': template,
            'task_description': task_description,
            'created_at': datetime.now().isoformat(),
            'status': 'active',
            'conversation_history': [],
            'parent_agent_id': self.main_context.agent_id
        }
        
        return subagent_id
    
    async def delegate_task_to_subagent(
        self,
        subagent_id: str,
        task: str,
        context: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """Delegate task to specific subagent"""
        
        if subagent_id not in self.active_subagents:
            raise ValueError(f"Subagent {subagent_id} not found")
        
        subagent = self.active_subagents[subagent_id]
        subagent_context = subagent['context']
        extension_manager = subagent['extension_manager']
        
        # Add task to subagent's conversation history
        subagent_context.add_message('user', task, {'delegated_from': self.main_context.agent_id})
        
        # Process task with subagent's specialized context
        try:
            # Get appropriate tools for the task
            available_extensions = extension_manager.get_available_extensions_for_domain(
                subagent_context.cultural_context.domain
            )
            
            # Determine best approach based on task and domain
            execution_plan = await self._create_subagent_execution_plan(
                task, subagent_context, available_extensions
            )
            
            # Execute the plan
            result = await self._execute_subagent_plan(
                subagent_id, execution_plan, extension_manager
            )
            
            # Add result to conversation history
            subagent_context.add_message('assistant', str(result), {'task_completed': True})
            
            return {
                'success': True,
                'result': result,
                'subagent_id': subagent_id,
                'domain': subagent_context.cultural_context.domain.value,
                'cultural_compliance': subagent_context.cultural_compliance_score
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'subagent_id': subagent_id,
                'task': task
            }
    
    async def coordinate_multi_subagent_task(
        self,
        task_description: str,
        required_domains: List[IraqiDomain],
        coordination_strategy: str = 'sequential'
    ) -> Dict[str, Any]:
        """Coordinate task requiring multiple Iraqi domain experts"""
        
        coordination_id = f"coord_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Spawn required subagents
        subagent_ids = []
        for domain in required_domains:
            template_name = self._get_template_for_domain(domain)
            if template_name:
                subagent_id = await self.spawn_subagent(
                    template_name, 
                    f"Part of multi-domain task: {task_description}"
                )
                subagent_ids.append(subagent_id)
        
        # Execute coordination strategy
        if coordination_strategy == 'sequential':
            return await self._execute_sequential_coordination(
                coordination_id, task_description, subagent_ids
            )
        elif coordination_strategy == 'parallel':
            return await self._execute_parallel_coordination(
                coordination_id, task_description, subagent_ids
            )
        else:
            return await self._execute_custom_coordination(
                coordination_id, task_description, subagent_ids, coordination_strategy
            )
    
    async def _setup_subagent_tools(self, extension_manager: IraqiAgentExtensionManager, domain: IraqiDomain):
        """Setup domain-specific tools for subagent"""
        
        # Map domains to MCP servers
        domain_servers = {
            IraqiDomain.LEGAL: ['legal_services', 'document_processing'],
            IraqiDomain.MEDICAL: ['medical_services', 'document_processing'],
            IraqiDomain.EDUCATIONAL: ['educational_services', 'document_processing'],
            IraqiDomain.GOVERNMENT: ['government_portal', 'document_processing']
        }
        
        servers_to_register = domain_servers.get(domain, ['document_processing'])
        servers_to_register.append('cultural_validation')  # Always include cultural validation
        
        # Register MCP servers
        server_configs = {
            'legal_services': 'ws://localhost:8004/mcp',
            'medical_services': 'ws://localhost:8005/mcp',
            'educational_services': 'ws://localhost:8006/mcp',
            'government_portal': 'ws://localhost:8001/mcp',
            'document_processing': 'ws://localhost:8002/mcp',
            'cultural_validation': 'ws://localhost:8003/mcp'
        }
        
        for server_name in servers_to_register:
            if server_name in server_configs:
                try:
                    await extension_manager.register_mcp_server(
                        server_name,
                        server_configs[server_name],
                        domain_specific=True,
                        security_level='professional'
                    )
                except Exception as e:
                    print(f"Warning: Failed to register {server_name}: {e}")
    
    def _get_template_for_domain(self, domain: IraqiDomain) -> Optional[str]:
        """Get subagent template name for domain"""
        domain_templates = {
            IraqiDomain.LEGAL: 'iraqi_legal_assistant',
            IraqiDomain.MEDICAL: 'iraqi_medical_assistant',
            IraqiDomain.EDUCATIONAL: 'iraqi_education_assistant',
            IraqiDomain.GOVERNMENT: 'iraqi_government_assistant'
        }
        return domain_templates.get(domain)
    
    async def _execute_sequential_coordination(
        self,
        coordination_id: str,
        task_description: str,
        subagent_ids: List[str]
    ) -> Dict[str, Any]:
        """Execute sequential coordination of subagents"""
        
        results = []
        accumulated_context = {}
        
        for i, subagent_id in enumerate(subagent_ids):
            # Prepare task with accumulated context from previous subagents
            contextual_task = f"{task_description}\n\nContext from previous steps: {json.dumps(accumulated_context, ensure_ascii=False)}"
            
            # Delegate to subagent
            result = await self.delegate_task_to_subagent(subagent_id, contextual_task)
            results.append(result)
            
            # Accumulate context for next subagent
            if result['success']:
                subagent = self.active_subagents[subagent_id]
                domain = subagent['context'].cultural_context.domain.value
                accumulated_context[f'step_{i+1}_{domain}'] = result['result']
        
        return {
            'coordination_id': coordination_id,
            'strategy': 'sequential',
            'results': results,
            'final_context': accumulated_context,
            'success': all(r['success'] for r in results)
        }
    
    def get_subagent_status(self, subagent_id: str) -> Dict[str, Any]:
        """Get status of specific subagent"""
        if subagent_id not in self.active_subagents:
            return {'exists': False}
        
        subagent = self.active_subagents[subagent_id]
        return {
            'exists': True,
            'status': subagent['status'],
            'domain': subagent['context'].cultural_context.domain.value,
            'created_at': subagent['created_at'],
            'task_description': subagent['task_description'],
            'conversation_count': len(subagent['conversation_history']),
            'cultural_compliance': subagent['context'].cultural_compliance_score,
            'parent_agent': subagent['parent_agent_id']
        }
    
    async def terminate_subagent(self, subagent_id: str) -> bool:
        """Terminate subagent and clean up resources"""
        if subagent_id not in self.active_subagents:
            return False
        
        subagent = self.active_subagents[subagent_id]
        
        # Close MCP connections
        extension_manager = subagent['extension_manager']
        for server_name, server_info in extension_manager.mcp_clients.items():
            try:
                await server_info['client'].disconnect()
            except Exception as e:
                print(f"Warning: Error disconnecting from {server_name}: {e}")
        
        # Archive conversation history to main agent memory
        self.main_context.memory.professional_knowledge.setdefault(
            subagent['context'].cultural_context.domain.value, []
        ).extend(subagent['conversation_history'])
        
        # Remove from active subagents
        del self.active_subagents[subagent_id]
        
        return True
```

## 🎯 IRAQI PROFESSIONAL DOMAIN SPECIALIZATION

### Domain-Specific Agent Configurations

#### Legal Domain Configuration

```python
IRAQI_LEGAL_AGENT_CONFIG = {
    'system_prompt': """
    You are an Iraqi Legal Assistant specialized in Iraqi law and Islamic jurisprudence.
    
    Expertise Areas:
    - Iraqi Civil Law and Commercial Code
    - Islamic Family Law (Personal Status Law)
    - Iraqi Constitutional Law
    - Administrative Law and Government Procedures
    - Contract Law with Islamic compliance
    
    Cultural Guidelines:
    - Always maintain Islamic legal principles compatibility
    - Reference both Iraqi secular law and Islamic jurisprudence when applicable
    - Use formal Arabic legal terminology
    - Respect Iraqi cultural values in legal interpretations
    - Emphasize consultation with qualified Iraqi legal professionals
    
    Limitations:
    - Cannot provide official legal advice
    - Cannot represent clients in legal matters
    - Must recommend consultation with licensed Iraqi lawyers
    - Cannot make legal decisions or interpretations with binding effect
    """,
    
    'knowledge_base': [
        'iraqi_civil_code',
        'iraqi_commercial_law',
        'iraqi_personal_status_law',
        'iraqi_constitutional_law',
        'islamic_jurisprudence_principles'
    ],
    
    'required_tools': [
        'iraqi_law_search',
        'legal_document_generator',
        'islamic_jurisprudence_reference',
        'cultural_validation'
    ],
    
    'validation_rules': {
        'islamic_compliance': True,
        'cultural_sensitivity': 'high',
        'professional_standards': 'legal',
        'language_formality': 'highly_formal'
    }
}
```

#### Medical Domain Configuration

```python
IRAQI_MEDICAL_AGENT_CONFIG = {
    'system_prompt': """
    You are an Iraqi Medical Assistant specialized in Iraqi healthcare system and Islamic medical ethics.
    
    Expertise Areas:
    - Iraqi Healthcare System and Procedures
    - Islamic Medical Ethics and Bioethics
    - Arabic Medical Terminology
    - Iraqi Medical Licensing and Standards
    - Patient Privacy under Iraqi Law
    
    Cultural Guidelines:
    - Follow Islamic bioethics principles
    - Respect Iraqi medical cultural practices
    - Consider gender-appropriate medical consultations
    - Maintain high sensitivity to religious considerations
    - Emphasize consultation with qualified Iraqi medical professionals
    
    Limitations:
    - Cannot provide medical diagnosis
    - Cannot prescribe medications
    - Cannot replace professional medical consultation
    - Must recommend seeking qualified Iraqi medical professionals
    """,
    
    'knowledge_base': [
        'iraqi_healthcare_system',
        'islamic_medical_ethics',
        'arabic_medical_terminology',
        'iraqi_medical_standards',
        'patient_privacy_laws'
    ],
    
    'required_tools': [
        'iraqi_medical_reference',
        'symptom_checker_arabic',
        'medical_document_processor',
        'cultural_validation'
    ],
    
    'validation_rules': {
        'islamic_compliance': True,
        'cultural_sensitivity': 'high',
        'professional_standards': 'medical',
        'language_formality': 'professional'
    }
}
```

## 📊 DEPLOYMENT AND MONITORING

### Agent Performance Metrics

```python
class IraqiAgentMetrics:
    """Performance metrics for Iraqi AI agents"""
    
    def __init__(self):
        self.metrics = {
            'cultural_compliance_rate': 0.0,
            'domain_accuracy_scores': {},
            'user_satisfaction_ratings': [],
            'task_completion_rates': {},
            'response_times': [],
            'tool_usage_statistics': {},
            'subagent_coordination_success': 0.0
        }
    
    def record_cultural_compliance(self, score: float, domain: str):
        """Record cultural compliance score"""
        if domain not in self.metrics['domain_accuracy_scores']:
            self.metrics['domain_accuracy_scores'][domain] = []
        self.metrics['domain_accuracy_scores'][domain].append(score)
        
        # Update overall compliance rate
        all_scores = []
        for domain_scores in self.metrics['domain_accuracy_scores'].values():
            all_scores.extend(domain_scores)
        self.metrics['cultural_compliance_rate'] = sum(all_scores) / len(all_scores)
    
    def get_performance_summary(self) -> Dict[str, Any]:
        """Get comprehensive performance summary"""
        return {
            'overall_cultural_compliance': self.metrics['cultural_compliance_rate'],
            'domain_performance': {
                domain: sum(scores) / len(scores) 
                for domain, scores in self.metrics['domain_accuracy_scores'].items()
            },
            'average_response_time': sum(self.metrics['response_times']) / len(self.metrics['response_times']) if self.metrics['response_times'] else 0,
            'subagent_coordination_success': self.metrics['subagent_coordination_success'],
            'most_used_tools': sorted(self.metrics['tool_usage_statistics'].items(), key=lambda x: x[1], reverse=True)[:10]
        }
```

## 🚀 INTEGRATION STRATEGY

### Phase 1: Core Agent Infrastructure
1. **Agent Context System**: Deploy Iraqi cultural context management
2. **Extension Manager**: Implement MCP tool integration with cultural validation
3. **Memory System**: Deploy culturally-aware memory and knowledge management
4. **Basic Subagents**: Implement single-domain specialized agents

### Phase 2: Advanced Orchestration
1. **Multi-Subagent Coordination**: Deploy complex task coordination
2. **Professional Domain Specialization**: Full Iraqi legal, medical, educational agents
3. **Advanced Cultural Validation**: Comprehensive Islamic compliance system
4. **Performance Monitoring**: Deploy Iraqi-specific metrics and analytics

### Phase 3: Enterprise Integration
1. **Government Integration**: Deploy for Iraqi institutional use
2. **Security Hardening**: Government-grade security for sensitive domains
3. **Scalability Optimization**: Handle enterprise-level Iraqi organizations
4. **Training and Documentation**: Comprehensive Arabic documentation

## 📈 SUCCESS METRICS

- **Cultural Compliance**: >95% Islamic compliance and Iraqi appropriateness
- **Domain Expertise**: >90% accuracy in Iraqi professional contexts
- **Subagent Coordination**: >85% success rate for multi-domain tasks
- **Response Quality**: >90% user satisfaction for Iraqi professional use cases
- **Tool Integration**: >99% uptime for critical MCP server connections

---

**Next Steps**: Extract Desktop Application UI components with Arabic RTL support and Iraqi interface elements.