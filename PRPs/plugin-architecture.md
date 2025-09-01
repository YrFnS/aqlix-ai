name: "Plugin Architecture for Iraqi AI Chat System"
description: |
  Comprehensive PRP for implementing a culturally-compliant, extensible plugin architecture 
  that enables dynamic addition of Iraqi professional domain functionality while maintaining 
  Islamic principles and integrating seamlessly with existing 21 specialized agents.

---

## Goal
Implement a production-ready plugin architecture that enables extensible Iraqi professional domain functionality through dynamic plugin loading, cultural compliance validation, and seamless integration with existing specialized agents. The system must support legal, medical, educational, and business domain plugins while maintaining 95%+ cultural appropriateness and 90%+ Islamic compliance.

## Why
- **Professional Domain Extension**: Enable specialized functionality for Iraqi legal, medical, educational, and business professionals without modifying core system
- **Cultural Compliance**: Ensure all plugins respect Islamic values and Iraqi customs through integrated validation
- **Scalable Architecture**: Support future domain additions and third-party plugin development
- **Performance Optimization**: Maintain <2s plugin loading and <5s execution times with concurrent plugin support
- **Integration Harmony**: Work seamlessly with existing 21 Iraqi AI agents rather than replacing them

## What
A meta-layer plugin system that orchestrates existing agents with domain-specific knowledge and tools, following established patterns while providing extensibility for Iraqi professional domains.

### Success Criteria
- [ ] Plugin loading time <2 seconds with importlib dynamic loading
- [ ] Plugin execution time <5 seconds average with performance monitoring
- [ ] 95%+ cultural appropriateness through integrated iraqi-cultural-validator
- [ ] 90%+ Islamic compliance with expert validation framework
- [ ] Support for 5+ concurrent plugins with memory usage <50MB per plugin
- [ ] Seamless integration with existing 21 Iraqi AI agents
- [ ] Complete Iraqi Legal Plugin implementation as reference pattern
- [ ] Security sandboxing with 100% malicious plugin prevention
- [ ] Real-time performance metrics through Sentry integration

## All Needed Context

### Documentation & References (MUST READ)
```yaml
# EXISTING CODEBASE PATTERNS - Critical for integration
- file: .claude/agents/iraqi-ai-agent-architect.md
  why: Understand existing agent architecture with YAML frontmatter and cultural integration
  critical: All plugins MUST follow identical pattern to existing agents

- file: .claude/agents/iraqi-cultural-validator.md  
  why: Cultural validation framework that ALL plugins must integrate with
  critical: 95%+ cultural appropriateness requirement, truthfulness protocol

- file: .claude/agents/iraqi-workflow-orchestrator.md
  why: Multi-agent workflow coordination patterns for complex plugin orchestration
  critical: How to coordinate multiple agents while maintaining context

- file: examples/botpress-extracted/plugins/knowledge/plugin.definition.ts
  why: Proven plugin architecture pattern with TypeScript/Zod schemas and Iraqi enhancements
  critical: Configuration objects, actions/events/states pattern, cultural metadata integration

# PLUGIN ARCHITECTURE BEST PRACTICES
- url: https://ai.pydantic.dev/agents/
  why: PydanticAI agent extensibility patterns with dependency injection
  section: Tools system and multi-agent architecture
  critical: Type-safe design and tool decoration patterns

- url: https://github.com/pydantic/pydantic-ai
  why: Official PydanticAI documentation for agent development
  section: Function Tools and dependency injection
  critical: Model-agnostic design and structured responses

# PYTHON PLUGIN PATTERNS (2025 Best Practices)
- url: https://alysivji.github.io/simple-plugin-system.html
  why: Importlib-based plugin loading with namespace discovery
  section: Dynamic module loading patterns
  critical: Avoid exec() and __import__, use setuptools for distribution

- url: https://mathieularose.com/plugin-architecture-in-python
  why: Hook-based extension points and dependency injection integration
  section: Plugin independence and communication patterns
  critical: Plugins should not talk directly - core system facilitates

# ISLAMIC AI ARCHITECTURE PRINCIPLES  
- url: https://link.springer.com/article/10.1007/s13347-023-00668-x
  why: Islamic ethical AI framework with maṣlaḥa principles
  section: Pluralist ethical benchmarking for AI
  critical: Cultural and religious sensitivity requirements

- docfile: CLAUDE.md
  why: Project-specific rules for cultural compliance and naming conventions
  critical: Professional terminology (not government), Islamic values, Arabic support
```

### Current Codebase Tree
```bash
aqlix-ai/
├── .claude/
│   └── agents/                    # 21 existing Iraqi AI agents
│       ├── iraqi-cultural-validator.md
│       ├── iraqi-ai-agent-architect.md  
│       ├── iraqi-workflow-orchestrator.md
│       └── ... (18 other specialized agents)
├── examples/
│   └── botpress-extracted/        # Plugin architecture patterns
│       └── plugins/knowledge/plugin.definition.ts
├── project-context/
│   └── agents/                    # Knowledge base for agents
│       ├── knowledge-base/
│       └── session-logs/
├── packages/                      # Shared utilities
│   ├── ui/
│   ├── types/
│   └── features/
├── PRPs/                         # Product Requirement Prompts
└── CLAUDE.md                     # Project rules and conventions
```

### Desired Codebase Tree with Plugin Architecture
```bash
aqlix-ai/
├── .claude/
│   └── agents/
│       ├── plugins/               # NEW: Plugin agent templates
│       │   ├── base-plugin.md    # Base plugin template
│       │   ├── iraqi-legal-plugin.md
│       │   ├── iraqi-medical-plugin.md
│       │   └── plugin-manager.md # Plugin orchestrator agent
│       └── ... (existing 21 agents)
├── packages/
│   ├── plugin-core/               # NEW: Plugin infrastructure
│   │   ├── __init__.py
│   │   ├── base_plugin.py        # Abstract base plugin class
│   │   ├── plugin_manager.py     # Dynamic loading system
│   │   ├── cultural_validator.py # Plugin cultural compliance
│   │   └── security_validator.py # Plugin security sandbox
│   └── ... (existing packages)
├── project-context/
│   └── plugins/                   # NEW: Plugin knowledge base
│       ├── knowledge-base/
│       │   ├── plugin-patterns.md
│       │   └── domain-expertise.md
│       └── session-logs/
└── ... (existing structure)
```

### Known Gotchas & Library Quirks
```python
# CRITICAL: Iraqi Agent Integration Requirements
# All plugins MUST follow existing agent pattern with YAML frontmatter
# NEVER bypass existing cultural validation - plugins orchestrate, don't replace

# CRITICAL: Cultural Compliance Integration  
# Every plugin operation must go through iraqi-cultural-validator
# 95%+ cultural appropriateness and 90%+ Islamic compliance required
# Use existing truthfulness protocol - NEVER simulate compliance percentages

# CRITICAL: Python Plugin Loading Best Practices
# Use importlib.import_module NOT exec() or __import__
# Implement proper security validation before loading any plugin code
# Follow namespace-based discovery pattern: plugins.iraqi_legal

# CRITICAL: PydanticAI Integration Patterns
# Use @agent.tool decorator for context-aware tools 
# Implement dependency injection with RunContext[IraqiDepsType]
# Maintain <500ms response times with async patterns

# CRITICAL: Naming Conventions (CLAUDE.md)
# Use "professional" terminology NOT "government" terminology
# Example: organization_service NOT government_service
# Arabic comments: "نظام مهني" NOT "نظام حكومي"

# CRITICAL: Performance Requirements
# Plugin loading: <2 seconds with importlib
# Plugin execution: <5 seconds average  
# Memory usage: <50MB per plugin
# Concurrent plugins: Support 10+ simultaneous plugins
```

## Implementation Blueprint

### Data Models and Structure
```python
# Core plugin infrastructure following PydanticAI and existing patterns
from typing import Dict, List, Any, Optional, Type, Protocol
from abc import ABC, abstractmethod
from enum import Enum
import asyncio
from dataclasses import dataclass
from pydantic import BaseModel, Field
import importlib
from pathlib import Path

class IraqiProfessionalDomain(Enum):
    """Iraqi professional domains following naming conventions"""
    LEGAL = "iraqi_legal"
    MEDICAL = "iraqi_medical"
    EDUCATIONAL = "iraqi_educational"
    BUSINESS = "iraqi_business"
    PROFESSIONAL = "iraqi_professional"
    ENGINEERING = "iraqi_engineering"
    RELIGIOUS = "iraqi_religious"

class PluginMetadata(BaseModel):
    """Plugin metadata following existing agent pattern"""
    name: str
    version: str
    professional_domain: IraqiProfessionalDomain
    description_ar: str = Field(..., description="Arabic description")
    description_en: str = Field(..., description="English description")
    cultural_compliance_level: str = Field(..., regex="^(basic|standard|strict)$")
    islamic_compliance_required: bool = True
    arabic_support_level: str = Field(..., regex="^(none|basic|full|native)$")
    proactive_triggers: List[str]
    required_agents: List[str] = Field(default_factory=list)
    mcp_servers: List[str] = Field(default_factory=list)
    
class CulturalValidationResult(BaseModel):
    """Cultural validation results with measurable criteria"""
    is_compliant: bool
    cultural_score: float = Field(..., ge=0, le=1)
    islamic_score: float = Field(..., ge=0, le=1)
    issues: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)
```

### List of Tasks to Complete the PRP Implementation

```yaml
Task 1:
CREATE packages/plugin-core/__init__.py:
  - BASIC: Empty init file to make it a Python package
  
CREATE packages/plugin-core/base_plugin.py:
  - PATTERN: Follow existing agent YAML frontmatter structure  
  - IMPLEMENT: Abstract base class with cultural integration hooks
  - INCLUDE: PydanticAI dependency injection patterns
  - INTEGRATE: Existing MCP server connections (Sequential, Context7, Supabase, Sentry)
  - ENSURE: Cultural validation integration with iraqi-cultural-validator

Task 2:  
CREATE packages/plugin-core/plugin_manager.py:
  - IMPLEMENT: Dynamic plugin loading with importlib.import_module
  - PATTERN: Namespace-based discovery (plugins.iraqi_legal)
  - INCLUDE: Security validation before loading
  - INTEGRATE: Performance monitoring with Sentry
  - ENSURE: <2 second loading time requirement

Task 3:
CREATE packages/plugin-core/cultural_validator.py:
  - EXTEND: Existing iraqi-cultural-validator for plugin compatibility
  - IMPLEMENT: Plugin-specific cultural validation rules  
  - ENSURE: 95%+ cultural appropriateness requirement
  - INTEGRATE: Islamic compliance checking with expert validation
  - PATTERN: Follow existing truthfulness protocol

Task 4:
CREATE packages/plugin-core/security_validator.py:
  - IMPLEMENT: Plugin security sandboxing and validation
  - INCLUDE: Malware scanning and permission validation
  - ENSURE: 100% malicious plugin prevention
  - PATTERN: Follow existing security patterns from iraqi-security-specialist

Task 5:
CREATE .claude/agents/plugins/base-plugin.md:
  - PATTERN: Exact same YAML frontmatter as existing agents
  - INCLUDE: Cultural integration requirements
  - TEMPLATE: For creating new professional domain plugins
  - INTEGRATE: Existing agent architecture patterns

Task 6:
CREATE .claude/agents/plugins/iraqi-legal-plugin.md:
  - IMPLEMENT: Complete Iraqi legal domain plugin as reference
  - PATTERN: Follow base-plugin.md template exactly
  - INTEGRATE: iraqi-professional-domain-expert, iraqi-cultural-validator
  - INCLUDE: Iraqi legal knowledge and case law integration
  - ENSURE: Cultural and Islamic compliance for legal domain

Task 7:
CREATE .claude/agents/plugins/plugin-manager.md:
  - IMPLEMENT: Plugin orchestrator agent following existing patterns
  - INTEGRATE: iraqi-workflow-orchestrator for complex workflows
  - COORDINATE: Multiple agent interactions for plugin operations  
  - MONITOR: Plugin performance and cultural compliance

Task 8:
CREATE project-context/plugins/knowledge-base/plugin-patterns.md:
  - DOCUMENT: Successful plugin implementation patterns
  - INCLUDE: Cultural validation workflows
  - PATTERN: Follow existing knowledge-base structure
  - MAINTAIN: Context for future plugin development

Task 9:
ENHANCE existing agents for plugin integration:
  - MODIFY: iraqi-cultural-validator.md to include plugin validation
  - MODIFY: iraqi-workflow-orchestrator.md to coordinate plugin workflows
  - ENSURE: Backward compatibility with existing functionality

Task 10:
CREATE comprehensive test suite:
  - IMPLEMENT: Cultural compliance testing for plugins
  - INCLUDE: Performance benchmarking (<2s loading, <5s execution)
  - TEST: Security validation and sandboxing
  - VALIDATE: Integration with existing 21 agents
```

### Per Task Pseudocode

```python
# Task 1: BasePlugin Infrastructure
class IraqiBasePlugin(ABC):
    """Abstract base plugin following existing agent patterns"""
    def __init__(self, cultural_validator, workflow_orchestrator):
        self.cultural_validator = cultural_validator
        self.workflow_orchestrator = workflow_orchestrator
        self.metadata = self.get_metadata()
        self.performance_metrics = {}
        
    @abstractmethod
    def get_metadata(self) -> PluginMetadata:
        """Return plugin metadata with cultural context"""
        pass
        
    @abstractmethod  
    async def execute_action(
        self,
        action: str,
        parameters: Dict[str, Any],
        user_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Execute plugin action with cultural validation"""
        # CRITICAL: Always validate culturally first
        cultural_result = await self.cultural_validator.validate_content(
            action, parameters, self.metadata.cultural_compliance_level
        )
        if not cultural_result.is_compliant:
            raise CulturalComplianceError(cultural_result.issues)
            
        # PATTERN: Use workflow orchestrator for multi-agent coordination
        if self.metadata.required_agents:
            return await self.workflow_orchestrator.coordinate_agents(
                self.metadata.required_agents, action, parameters, user_context
            )
        pass

# Task 2: Plugin Manager with Dynamic Loading  
class IraqiPluginManager:
    """Plugin manager with cultural validation and security"""
    def __init__(self):
        self.plugins: Dict[str, IraqiBasePlugin] = {}
        self.cultural_validator = CulturalValidator()
        self.security_validator = SecurityValidator()
        
    async def load_plugin(self, plugin_name: str) -> Dict[str, Any]:
        """Load plugin with security and cultural validation"""
        try:
            # CRITICAL: Security validation before loading
            security_result = await self.security_validator.validate_plugin(plugin_name)
            if not security_result.is_safe:
                raise SecurityError(security_result.threats)
                
            # PATTERN: Use importlib for dynamic loading (best practice)
            plugin_module = importlib.import_module(f"plugins.{plugin_name}")
            plugin_class = getattr(plugin_module, f"{plugin_name.title()}Plugin")
            plugin_instance = plugin_class(self.cultural_validator, self.workflow_orchestrator)
            
            # CRITICAL: Cultural compliance validation  
            cultural_result = await self._validate_plugin_compliance(plugin_instance)
            if not cultural_result.is_compliant:
                raise CulturalComplianceError(cultural_result.issues)
                
            self.plugins[plugin_name] = plugin_instance
            return {"success": True, "cultural_score": cultural_result.cultural_score}
            
        except Exception as e:
            # PATTERN: Follow existing error handling
            return {"success": False, "error": str(e)}

# Task 6: Iraqi Legal Plugin Implementation
class IraqiLegalPlugin(IraqiBasePlugin):
    """Complete legal domain plugin implementation"""
    def get_metadata(self) -> PluginMetadata:
        return PluginMetadata(
            name="iraqi_legal_assistant",
            version="1.0.0",
            professional_domain=IraqiProfessionalDomain.LEGAL,
            description_ar="مساعد قانوني للقوانين العراقية والشريعة الإسلامية",
            description_en="Iraqi legal assistant for Iraqi law and Islamic jurisprudence",
            cultural_compliance_level="strict",
            islamic_compliance_required=True,
            arabic_support_level="native",
            proactive_triggers=["Iraqi legal", "commercial law", "civil law", "Islamic law"],
            required_agents=["iraqi-cultural-validator", "iraqi-professional-domain-expert", "arabic-rtl-processor"],
            mcp_servers=["sequential", "context7", "supabase"]
        )
        
    async def execute_action(self, action: str, parameters: Dict[str, Any], user_context: Dict[str, Any]) -> Dict[str, Any]:
        """Execute legal action with cultural validation"""
        if action == "legal_research":
            return await self._perform_legal_research(parameters, user_context)
        elif action == "document_analysis":
            return await self._analyze_legal_document(parameters, user_context)
        else:
            raise UnsupportedActionError(f"Action '{action}' not supported")
            
    async def _perform_legal_research(self, parameters: Dict[str, Any], user_context: Dict[str, Any]) -> Dict[str, Any]:
        """Legal research with Iraqi context and Islamic compliance"""
        research_query = parameters.get("query")
        
        # CRITICAL: Cultural validation first
        cultural_validation = await self.cultural_validator.validate_cultural_compliance(
            research_query, domain="legal", compliance_level="strict"
        )
        if not cultural_validation["is_appropriate"]:
            return {"error": "Research query violates Islamic principles"}
            
        # PATTERN: Use workflow orchestrator to coordinate multiple agents
        workflow_result = await self.workflow_orchestrator.coordinate_agents([
            "iraqi-professional-domain-expert",  # Iraqi legal context
            "arabic-rtl-processor"               # Arabic content handling if needed
        ], action="legal_research", parameters=parameters, user_context=user_context)
        
        return {
            "legal_provisions": workflow_result["domain_expertise"],
            "cultural_compliance_score": cultural_validation["score"],
            "agents_coordinated": workflow_result["agents_used"]
        }
```

### Integration Points
```yaml
EXISTING AGENT INTEGRATION:
  - modify: .claude/agents/iraqi-cultural-validator.md
    change: "Add plugin validation capabilities to existing cultural validator"
    pattern: "Extend existing functionality without breaking current usage"
    
  - modify: .claude/agents/iraqi-workflow-orchestrator.md  
    change: "Add plugin orchestration to existing workflow management"
    pattern: "Integrate plugin workflows with existing multi-agent coordination"

PACKAGE STRUCTURE:
  - create: packages/plugin-core/ 
    purpose: "Core plugin infrastructure following existing package patterns"
    pattern: "Same structure as packages/ui/, packages/types/"

MCP SERVER INTEGRATION:
  - integrate: Sequential MCP for complex plugin workflows
  - integrate: Context7 MCP for PydanticAI patterns and documentation
  - integrate: Supabase MCP for plugin state management and metrics
  - integrate: Sentry MCP for plugin performance monitoring

DATABASE SCHEMA:
  - add_table: "plugins" with metadata, security_validation, cultural_compliance_score
  - add_table: "user_plugin_installations" with user preferences and usage stats
  - add_table: "plugin_performance_metrics" for monitoring and optimization
```

## Validation Loop

### Level 1: Cultural Compliance & Security
```bash
# CRITICAL: All plugins must pass cultural validation
uv run python -m packages.plugin-core.cultural_validator \
  --plugin-path .claude/agents/plugins/iraqi-legal-plugin.md \
  --compliance-level strict
# Expected: 95%+ cultural appropriateness, 90%+ Islamic compliance

# CRITICAL: Security validation before loading  
uv run python -m packages.plugin-core.security_validator \
  --plugin-name iraqi_legal_plugin
# Expected: No security threats, clean malware scan
```

### Level 2: Integration Testing with Existing Agents
```python
# Test plugin orchestration with existing agents
def test_legal_plugin_integration():
    """Test plugin works with existing Iraqi agents"""
    plugin_manager = IraqiPluginManager()
    plugin = plugin_manager.load_plugin("iraqi_legal_plugin")
    
    result = plugin.handle_request(
        "What are Iraqi commercial law requirements for business registration?",
        user_context={"cultural_preferences": "strict_islamic", "language": "arabic"}
    )
    
    # CRITICAL: Verify cultural compliance
    assert result.cultural_compliance_score >= 0.95
    assert result.islamic_compliance_score >= 0.90
    
    # CRITICAL: Verify existing agents were used (not bypassed)
    assert "iraqi-cultural-validator" in result.agents_used
    assert "iraqi-professional-domain-expert" in result.agents_used
    
    # CRITICAL: Verify performance requirements
    assert result.execution_time < 5.0  # seconds
    assert result.memory_usage < 50  # MB

def test_plugin_cultural_validation():
    """Test plugin cultural validation integration"""  
    plugin = IraqiLegalPlugin()
    
    # Test culturally inappropriate request
    result = plugin.execute_action(
        "legal_research",
        {"query": "alcohol licensing laws"},  # Potentially inappropriate
        {"cultural_preferences": "strict_islamic"}
    )
    
    # Should be filtered by cultural validator
    assert "cultural_violation" in result or result["cultural_compliance_score"] < 0.95
```

```bash
# Run integration tests
uv run pytest packages/plugin-core/tests/ -v --cov=packages.plugin-core
# Expected: 100% test pass rate, 95%+ code coverage
```

### Level 3: Performance Benchmarking  
```bash
# Plugin loading performance test
uv run python -m packages.plugin-core.performance_test \
  --test-type loading --plugin-name iraqi_legal_plugin
# Expected: <2 seconds loading time

# Plugin execution performance test
uv run python -m packages.plugin-core.performance_test \
  --test-type execution --plugin-name iraqi_legal_plugin \
  --concurrent-users 10
# Expected: <5 seconds average execution, support 10+ concurrent users

# Memory usage monitoring
uv run python -m packages.plugin-core.performance_test \
  --test-type memory --plugin-name iraqi_legal_plugin
# Expected: <50MB per plugin instance
```

### Level 4: End-to-End Plugin Workflow
```bash
# Test complete plugin workflow with existing system
uv run python -m test_plugin_integration \
  --plugin iraqi_legal_plugin \
  --request "I need help with Iraqi commercial law compliance for my business" \
  --user-cultural-level strict
  
# Expected output verification:
# - Cultural validation: 95%+ compliance
# - Islamic validation: 90%+ compliance  
# - Response time: <5 seconds
# - Agent coordination: iraqi-cultural-validator, iraqi-professional-domain-expert used
# - Memory usage: <50MB
# - Response quality: Professional legal guidance with cultural appropriateness
```

## Final Validation Checklist
- [ ] All cultural compliance tests pass: `uv run pytest packages/plugin-core/tests/test_cultural.py -v`
- [ ] No security vulnerabilities: `uv run python -m packages.plugin-core.security_validator --scan-all`
- [ ] Performance benchmarks met: Plugin loading <2s, execution <5s, memory <50MB
- [ ] Integration with existing 21 agents successful: No breaking changes to existing functionality
- [ ] Iraqi Legal Plugin fully functional: Complete legal domain functionality with cultural compliance
- [ ] Plugin orchestration working: Multi-agent workflows coordinated properly
- [ ] Sentry monitoring active: Performance metrics and error tracking operational
- [ ] Documentation complete: Plugin development guide and examples provided

---

## Anti-Patterns to Avoid
- ❌ Don't bypass existing cultural validation - always integrate with iraqi-cultural-validator
- ❌ Don't create plugins that talk directly to each other - use plugin manager for coordination  
- ❌ Don't use exec() or __import__ for plugin loading - use importlib.import_module
- ❌ Don't ignore Islamic compliance requirements - maintain 90%+ compliance minimum
- ❌ Don't break existing agent patterns - follow YAML frontmatter structure exactly
- ❌ Don't simulate compliance percentages - use measurable validation criteria
- ❌ Don't hardcode cultural assumptions - use expert validation and authentic sources
- ❌ Don't skip security validation - all plugins must pass security scanning

---

**PRP Confidence Score: 8.5/10**  
High confidence for one-pass implementation due to comprehensive research, proven patterns integration, cultural compliance framework, and detailed validation loops. The approach builds on existing infrastructure rather than replacing it, reducing implementation risk while providing clear extensibility path.