# Iraqi AI System Naming Conventions

**Version**: 1.0  
**Date**: 2025-01-26  
**Purpose**: Establish consistent professional terminology across the Iraqi AI Chat System

## Overview

The Iraqi AI System maintains a comprehensive examples library extracted from various open-source projects. These examples contain original naming patterns (government/ministry terminology) that serve as reference implementations. However, **all actual implementations must use professional terminology** to ensure inclusive, function-based naming conventions.

## Core Principles

### 1. **"Examples Reference, Implementations Transform"**
- Examples folder: Preserved original patterns for learning and reference
- Agent implementations: Automatically apply professional terminology
- Output code: Always uses professional/organization terminology

### 2. **"Agent Names vs Generated Code Names"**
- **Agent Names**: Keep "iraqi-" prefix for specialized cultural processing agents
- **Generated Code**: Use clean professional terminology WITHOUT "iraqi-" prefixes
- **Cultural Intelligence**: Embedded as invisible capabilities, not visible branding

**CRITICAL**: Agents must NEVER prefix generated code with "iraqi-" - this creates branding mistakes

## Mandatory Terminology Conversions

### 1. Primary Entity Names

| Original Pattern | Professional Implementation | Context |
|-----------------|---------------------------|---------|
| `government` | `professional` | Function names, variables, modules |
| `ministry` | `organization` | Class names, services, entities |
| `government_service` | `professional_service` | Service classes |
| `ministry_agent` | `organization_agent` | Agent classes |
| `government_team` | `professional_team` | Team coordination |
| `inter_ministry` | `inter_organization` | Cross-entity operations |

### 2. Class and Interface Names

```typescript
// Examples show (reference only):
interface IMinistryConfig { }
class GovernmentService { }
class MinistryAgent { }

// Implementations must generate (NO "iraqi-" prefixes):
interface IOrganizationConfig { }
class ProfessionalService { }
class OrganizationAgent { }

// ❌ WRONG - Never generate:
class IraqiProfessionalService { }
class IraqiOrganizationAgent { }

// ✅ CORRECT - Clean professional names with embedded cultural intelligence:
class PaymentService {
  async validateCulturalCompliance() { ... }  // Cultural capability embedded
  async processArabicText() { ... }           // Arabic capability embedded
}
```

### 3. Function and Method Names

```python
# Examples show (reference only):
def validate_government_compliance()
def process_ministry_request()
def coordinate_government_services()

# Implementations must generate:
def validate_professional_compliance()
def process_organization_request()  
def coordinate_professional_services()
```

## Arabic Terminology Standards

### 1. Core Professional Terms

| English | Arabic (Professional) | Arabic (Original Example) | Notes |
|---------|---------------------|--------------------------|-------|
| professional | مهني | حكومة | Function-based terminology |
| organization | منظمة | وزارة | Inclusive institutional reference |
| professional service | خدمة مهنية | خدمة حكومية | Service-focused naming |
| organizational | تنظيمي | وزاري | Structural reference |

### 2. Cultural Context Preservation

**Maintain Islamic and Iraqi Cultural Values**:
- Professional ethics aligned with Islamic principles
- Iraqi cultural norms in professional interactions
- Respectful hierarchy and communication patterns
- Arabic language processing with Iraqi dialect support

## Exceptions and Special Cases

### 1. Security Classifications (Preserve As-Is)
```python
# Keep unchanged - technical security fields:
government_classification: str  # "public", "restricted", "confidential"
gov_id: str                    # Government-issued ID numbers
security_clearance: str        # Official clearance levels
```

### 2. API Integration Fields
```python
# Keep unchanged - external system compatibility:
gov_api_endpoint: str          # Actual government API URLs
ministry_portal_url: str       # Real institutional portal addresses
```

### 3. Historical/Legal References
```python
# Keep unchanged - factual legal references:
iraqi_government_law_ref: str  # Legal statute references
ministry_regulation_2024: str # Actual regulation identifiers
```

## Agent-Specific Implementation Rules

### 1. Code Generation Agents  
- `iraqi-ai-agent-architect`: Apply naming rules to all PydanticAI agent architectures
- `iraqi-technical-debugger`: Maintain professional terminology during debugging  
- `iraqi-workflow-orchestrator`: Coordinate terminology across multi-agent workflows

**CRITICAL RULE**: These agents generate clean professional code WITHOUT "iraqi-" prefixes

### 2. Validation Agents
- `iraqi-cultural-validator`: Enforce professional terminology compliance (95%+ accuracy)
- `iraqi-cultural-tester`: Test implementations against professional naming standards
- `iraqi-accessibility-specialist`: Ensure inclusive terminology in UI components

**CRITICAL RULE**: These agents validate that generated code uses clean professional names

### 3. UI/UX Agents
- `iraqi-ui-designer`: Generate UI components with professional terminology  
- `iraqi-ux-researcher`: Validate user experience with professional language
- `iraqi-interaction-designer`: Design interactions using inclusive professional terms

**CRITICAL RULE**: These agents create `Button`, `PaymentForm`, `ChatInterface` - NOT `IraqiButton`, etc.

## Implementation Workflow

### 1. Pattern Recognition Phase
```
Agent reads: /examples/government_coordination.py
Agent identifies: GovernmentTeam, MinistryAgent patterns
Agent learns: Multi-entity coordination architecture
```

### 2. Terminology Transformation Phase
```
Agent transforms:
- GovernmentTeam → ProfessionalTeam (NOT IraqiProfessionalTeam)
- MinistryAgent → OrganizationAgent (NOT IraqiOrganizationAgent)
- government_service → professional_service (NOT iraqi_professional_service)

CRITICAL: Cultural intelligence embedded as capabilities, NOT naming prefixes
```

### 3. Cultural Integration Phase
```
Agent ensures:
- Arabic terminology culturally appropriate
- Islamic compliance maintained
- Iraqi professional etiquette preserved
```

### 4. Output Generation Phase
```
Agent generates: Professional terminology implementation
Agent validates: Cultural appropriateness (95%+ threshold)
Agent documents: Any exceptions with clear reasoning
```

## Quality Assurance Standards

### 1. Validation Requirements
- **95%+ Professional Terminology Compliance**: All implementations checked by `iraqi-cultural-validator`
- **Islamic Compliance**: 90%+ alignment with Islamic professional values  
- **Arabic Accuracy**: 99%+ RTL processing accuracy with professional Arabic terms
- **Cultural Sensitivity**: 98%+ appropriateness for Iraqi professional contexts

### 2. Testing Standards
- Unit tests with professional terminology validation
- Integration tests across professional service boundaries
- Cultural appropriateness testing with Iraqi professional personas
- Arabic language testing with professional dialect patterns

### 3. Documentation Requirements
- All generated code documented with professional terminology
- API documentation uses organization/professional language
- User guides written with inclusive professional language
- Technical specifications maintain professional naming consistency

## Examples Library Structure

### Current State (Preserved for Reference)
```
/examples/
├── government_coordination/     # Reference patterns
├── ministry_integration/        # Architecture examples  
├── inter_ministry_workflows/    # Coordination patterns
└── government_services/         # Service implementations
```

### Generated Implementation Structure
```
/apps/api/professional/
├── professional_coordination/   # Generated from examples
├── organization_integration/    # Transformed architecture
├── inter_organization_workflows/ # Professional coordination
└── professional_services/       # Service implementations
```

## Maintenance and Updates

### 1. Adding New Examples
- New examples can retain original terminology
- Document source and extraction date
- Agents automatically apply transformation rules

### 2. Updating Naming Rules
- All changes documented in this file
- Agent configurations updated accordingly  
- Existing implementations validated against new rules

### 3. Cultural Evolution
- Arabic terminology reviewed quarterly
- Iraqi professional norms validation
- Islamic compliance standards updated as needed

## Compliance Verification

### 1. Automated Validation
```python
# Example validation check
def validate_professional_terminology(code: str) -> ValidationResult:
    """Ensure professional terminology compliance"""
    violations = []
    
    # Check for non-exception government/ministry usage
    if "government" in code and not in_exception_context(code):
        violations.append("Use 'professional' instead of 'government'")
    
    # CRITICAL: Check for "iraqi-" prefixes in generated code (NOT allowed)
    if re.search(r'(class|interface|function)\s+Iraqi[A-Z]', code):
        violations.append("CRITICAL: Never prefix generated code with 'Iraqi' - use clean professional names")
    
    # Validate Arabic terminology
    arabic_terms = extract_arabic_terms(code)
    for term in arabic_terms:
        if not is_professional_arabic_term(term):
            violations.append(f"Arabic term '{term}' should use professional terminology")
    
    return ValidationResult(
        compliant=len(violations) == 0,
        violations=violations,
        compliance_score=calculate_compliance_score(code)
    )
```

### 2. Manual Review Process
- Critical implementations reviewed by `iraqi-cultural-validator` agent
- Documentation reviewed for professional language consistency
- User-facing interfaces validated for inclusive terminology

## Contact and Support

For questions about naming conventions:
1. Consult `iraqi-cultural-validator` agent
2. Reference this document
3. Review examples for architectural patterns
4. Follow professional terminology transformation rules

---

**Remember**: Examples teach us patterns, implementations serve users professionally.