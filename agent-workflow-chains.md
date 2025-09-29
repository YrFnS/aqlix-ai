# Iraqi AI Agent Workflow Chains

**Updated**: December 2025 - Based on current 22 active Iraqi AI agents

---

## 🎯 Chain 1: Iraqi Feature Development (Comprehensive)

```yaml
workflow: iraqi-feature-development
trigger: "implement [feature] with Iraqi context"
agents:
  1. iraqi-product-manager
     input: user_requirements
     output: iraqi-requirements.md
     next_context: "Feature requirements with Iraqi market analysis and cultural constraints"

  2. iraqi-business-analyst
     input: iraqi-requirements.md
     output: business-analysis.md
     next_context: "Business process analysis and stakeholder coordination"

  3. iraqi-cultural-validator
     input: [iraqi-requirements.md, business-analysis.md]
     output: cultural-validation.md
     next_context: "Cultural compliance assessment with Islamic principles"

  4. iraqi-ux-researcher
     input: [all previous contexts]
     output: user-research.md
     next_context: "Iraqi user behavior patterns and preferences"

  5. iraqi-ui-designer
     input: [all previous contexts]
     output: design-spec.md
     next_context: "RTL-first design specifications with cultural authenticity"

  6. iraqi-ai-agent-architect
     input: [all previous contexts]
     output: implementation-plan.md
     next_context: "Technical implementation with PydanticAI and cultural context"

  7. iraqi-cultural-tester
     input: [all previous contexts]
     output: test-strategy.md
     validation: comprehensive_cultural_testing
```

## 🛡️ Chain 2: Security & Compliance Audit (Enhanced)

```yaml
workflow: iraqi-security-comprehensive-audit
trigger: "security audit" OR "vulnerability assessment" OR "compliance check"
agents:
  1. iraqi-security-specialist
     input: current_system_state
     output: security-assessment.md
     focus: "Application security with Iraqi regulatory compliance"

  2. payment-security-guardian
     input: security-assessment.md
     output: payment-security-audit.md
     focus: "Iraqi payment gateway security (ZainCash, FastPay, NassWallet)"

  3. iraqi-cultural-validator
     input: [security-assessment.md, payment-security-audit.md]
     output: cultural-security-validation.md
     focus: "Islamic compliance in security policies"

  4. iraqi-devops-engineer
     input: [all previous contexts]
     output: infrastructure-hardening.md
     focus: "Infrastructure security with Iraqi ISP optimization"

  5. iraqi-payment-tester
     input: [all previous contexts]
     output: security-test-results.md
     validation: payment_gateway_security_compliance
```

## 🎨 Chain 3: UI/UX Enhancement Pipeline (Comprehensive)

```yaml
workflow: iraqi-ui-ux-enhancement
trigger: "improve UI" OR "enhance UX" OR "RTL design" OR "Arabic interface"
agents:
  1. iraqi-ux-researcher
     input: current_ui_state
     output: user-research.md
     focus: "Iraqi user behavior analysis and cultural preferences"

  2. iraqi-ui-designer
     input: user-research.md
     output: design-improvements.md
     focus: "Cultural design patterns with Islamic aesthetic principles"

  3. iraqi-interaction-designer
     input: [user-research.md, design-improvements.md]
     output: interaction-spec.md
     focus: "Iraqi cultural interaction patterns and micro-animations"

  4. arabic-rtl-processor
     input: [all previous contexts]
     output: rtl-processing-spec.md
     focus: "Arabic text processing and Iraqi dialect handling"

  5. iraqi-accessibility-specialist
     input: [all previous contexts]
     output: accessibility-audit.md
     focus: "WCAG compliance with Arabic screen reader support"

  6. iraqi-arabic-tester
     input: [all previous contexts]
     output: rtl-test-results.md
     validation: arabic_rtl_comprehensive_testing
```

## 🏛️ Chain 4: Cultural Validation & Professional Compliance

```yaml
workflow: iraqi-cultural-professional-validation
trigger: "cultural validation" OR "Islamic compliance" OR "professional domain"
agents:
  1. iraqi-cultural-validator
     input: content_to_validate
     output: cultural-assessment.md
     focus: "Islamic compliance and Iraqi cultural appropriateness"

  2. iraqi-professional-domain-expert
     input: [content_to_validate, cultural-assessment.md]
     output: professional-validation.md
     focus: "Iraqi legal/medical/educational domain compliance"

  3. arabic-rtl-processor
     input: [cultural-assessment.md, professional-validation.md]
     output: language-validation.md
     focus: "Iraqi dialect accuracy and professional terminology"

  4. iraqi-cultural-tester
     input: [all previous contexts]
     output: cultural-test-results.md
     validation: cultural_professional_compliance
```

## 💳 Chain 5: Payment Integration & Testing (New)

```yaml
workflow: iraqi-payment-integration
trigger: "payment integration" OR "Iraqi gateways" OR "financial testing"
agents:
  1. external-service-coordinator
     input: payment_requirements
     output: service-integration-plan.md
     focus: "Multi-gateway coordination with fallback strategies"

  2. payment-security-guardian
     input: service-integration-plan.md
     output: payment-security-framework.md
     focus: "Financial security compliance and fraud detection"

  3. iraqi-payment-tester
     input: [service-integration-plan.md, payment-security-framework.md]
     output: payment-test-strategy.md
     focus: "Comprehensive payment gateway testing"

  4. iraqi-devops-engineer
     input: [all previous contexts]
     output: payment-deployment-plan.md
     validation: payment_infrastructure_ready
```

## 🤖 Chain 6: AI Architecture & Technical Implementation (New)

```yaml
workflow: iraqi-ai-technical-implementation
trigger: "AI implementation" OR "PydanticAI" OR "technical architecture"
agents:
  1. iraqi-ai-agent-architect
     input: technical_requirements
     output: ai-architecture-plan.md
     focus: "PydanticAI with cultural context integration"

  2. iraqi-technical-debugger
     input: ai-architecture-plan.md
     output: technical-implementation.md
     focus: "Iraqi-specific technical solutions and debugging"

  3. iraqi-devops-engineer
     input: [ai-architecture-plan.md, technical-implementation.md]
     output: deployment-strategy.md
     focus: "AI system deployment with Iraqi infrastructure"

  4. app-documentation-tracker
     input: [all previous contexts]
     output: technical-documentation.md
     validation: technical_implementation_complete
```

## 🔄 Chain 7: Workflow Orchestration & Context Management (Advanced)

```yaml
workflow: iraqi-workflow-orchestration
trigger: "orchestrate workflow" OR "manage context" OR "coordinate agents"
agents:
  1. iraqi-workflow-orchestrator
     input: workflow_requirements
     output: orchestration-plan.md
     focus: "Multi-agent coordination and workflow optimization"

  2. iraqi-context-manager
     input: orchestration-plan.md
     output: context-optimization.md
     focus: "Context preservation and performance optimization"

  3. iraqi-prp-execution-orchestrator
     input: [orchestration-plan.md, context-optimization.md]
     output: prp-execution-strategy.md
     focus: "PRP workflow management with Iraqi context"

  4. iraqi-business-analyst
     input: [all previous contexts]
     output: workflow-business-impact.md
     validation: workflow_efficiency_optimized
```

---

## 🎛️ Chain Coordination Rules

### Auto-Trigger Patterns

- **Feature Development**: Keywords → "implement", "create", "build" + "Iraqi" OR "cultural"
- **Security Audit**: Keywords → "security", "vulnerability", "audit" + system context
- **UI Enhancement**: Keywords → "UI", "UX", "design", "RTL", "Arabic"
- **Cultural Validation**: Keywords → "cultural", "Islamic", "compliance", "appropriate"
- **Payment Integration**: Keywords → "payment", "gateway", "ZainCash", "FastPay", "NassWallet"
- **AI Implementation**: Keywords → "AI", "PydanticAI", "agent", "architecture"
- **Workflow Management**: Keywords → "orchestrate", "coordinate", "workflow", "context"

### Chain Coordination Intelligence

- **Parallel Chains**: UI Enhancement can run parallel with Cultural Validation
- **Sequential Dependencies**: Security Audit must complete before Payment Integration
- **Context Sharing**: All chains contribute to shared knowledge base
- **Escalation Patterns**: Complex issues trigger Workflow Orchestration chain
- **Performance Optimization**: Context Manager monitors and optimizes all chains

### Success Metrics

- **Cultural Compliance**: 95%+ Islamic and cultural appropriateness
- **Technical Quality**: 90%+ code coverage and performance benchmarks
- **User Experience**: WCAG 2.1 AA compliance with Arabic accessibility
- **Security Standards**: Iraqi regulatory compliance and payment security
- **Integration Success**: 95%+ success rate across all service integrations

---

## 📊 Agent Utilization Matrix

### Highly Active Agents (Used in 4+ chains)

- **iraqi-cultural-validator** (6 chains) - Cultural compliance across all workflows
- **iraqi-devops-engineer** (4 chains) - Infrastructure and deployment
- **iraqi-cultural-tester** (4 chains) - Validation and testing
- **iraqi-ai-agent-architect** (4 chains) - Technical architecture

### Specialized Agents (Chain-specific)

- **external-service-coordinator** (Payment chain) - Service integration
- **iraqi-context-manager** (Workflow chain) - Context optimization
- **iraqi-prp-execution-orchestrator** (Workflow chain) - PRP management
- **app-documentation-tracker** (AI Technical chain) - Documentation

### Cross-Chain Validators

- **iraqi-accessibility-specialist** - WCAG compliance
- **payment-security-guardian** - Financial security
- **arabic-rtl-processor** - Language processing
- **iraqi-payment-tester** - Payment validation

---

_Updated December 2025 - All 22 Iraqi AI agents integrated with comprehensive workflow chains_
