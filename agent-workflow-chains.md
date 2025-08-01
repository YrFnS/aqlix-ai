# Iraqi AI Agent Workflow Chains

## Chain 1: Iraqi Feature Development
```yaml
workflow: iraqi-feature-development
trigger: "implement [feature] with Iraqi context"
agents:
  1. iraqi-product-manager
     input: user_requirements
     output: iraqi-requirements.md
     next_context: "Feature requirements with Iraqi market analysis"
     
  2. iraqi-cultural-validator  
     input: iraqi-requirements.md
     output: cultural-validation.md
     next_context: "Cultural compliance assessment"
     
  3. iraqi-ui-designer
     input: [iraqi-requirements.md, cultural-validation.md]
     output: design-spec.md
     next_context: "RTL-first design specifications"
     
  4. iraqi-ai-agent-architect
     input: [iraqi-requirements.md, cultural-validation.md, design-spec.md]
     output: implementation-plan.md
     next_context: "Technical implementation approach"
     
  5. iraqi-cultural-tester
     input: [all previous contexts]
     output: test-strategy.md
     validation: complete
```

## Chain 2: Security Audit Workflow
```yaml
workflow: iraqi-security-audit
trigger: "security audit" OR "vulnerability assessment"
agents:
  1. payment-security-guardian
     input: current_system_state
     output: security-assessment.md
     
  2. iraqi-cultural-validator
     input: security-assessment.md
     output: cultural-security-validation.md
     
  3. iraqi-devops-engineer
     input: [security-assessment.md, cultural-security-validation.md]
     output: infrastructure-hardening.md
     
  4. iraqi-payment-tester
     input: [all previous contexts]
     output: security-test-results.md
```

## Chain 3: UI/UX Enhancement Workflow
```yaml
workflow: iraqi-ui-enhancement
trigger: "improve UI" OR "enhance UX" OR "RTL design"
agents:
  1. iraqi-ux-researcher
     input: current_ui_state
     output: user-research.md
     
  2. iraqi-ui-designer
     input: user-research.md
     output: design-improvements.md
     
  3. iraqi-interaction-designer
     input: [user-research.md, design-improvements.md]
     output: interaction-spec.md
     
  4. iraqi-accessibility-specialist
     input: [all previous contexts]
     output: accessibility-audit.md
     
  5. iraqi-arabic-tester
     input: [all previous contexts]
     output: rtl-test-results.md
```

## Chain 4: Cultural Validation Pipeline
```yaml
workflow: iraqi-cultural-validation
trigger: "cultural validation" OR "Islamic compliance" OR "Iraqi appropriateness"
agents:
  1. iraqi-cultural-validator
     input: content_to_validate
     output: cultural-assessment.md
     
  2. iraqi-professional-domain-expert
     input: [content_to_validate, cultural-assessment.md]
     output: professional-validation.md
     
  3. arabic-rtl-processor
     input: [cultural-assessment.md, professional-validation.md]
     output: language-validation.md
     
  4. iraqi-cultural-tester
     input: [all previous contexts]
     output: cultural-test-results.md
```