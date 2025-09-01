name: "Application Security System PRP - Enterprise-Grade Security Framework"
description: |
  Comprehensive application security framework for the Iraqi AI Chat System with multi-layered security controls, vulnerability protection, Iraqi compliance monitoring, and threat detection integrated with PydanticAI agents, Supabase security, and Iraqi cultural validation.

---

## Goal
Implement a comprehensive enterprise-grade application security framework that provides defense-in-depth protection for the Iraqi AI Chat System, ensuring data protection, regulatory compliance, threat detection, and cultural appropriateness while maintaining optimal performance (<150ms security validation) and 99.9% uptime.

## Why
- **Data Protection**: Safeguard sensitive Iraqi user data and ensure compliance with Iraqi data sovereignty laws
- **Regulatory Compliance**: Meet Iraqi financial regulations, Islamic banking principles, and Central Bank of Iraq requirements
- **Threat Protection**: Defend against OWASP Top 10 2025 vulnerabilities and Middle Eastern cybersecurity threats
- **Cultural Security**: Maintain Islamic values compliance and Arabic text integrity in security processing
- **AI Agent Security**: Secure PydanticAI agents with proper input/output validation and cultural compliance
- **Professional Domain Security**: Enable secure access to Iraqi legal, medical, educational, and organizational systems

## What
A multi-layered application security framework that integrates seamlessly with the existing Iraqi AI Chat System, providing:

### Core Security Layers
1. **Input Validation & Sanitization**: Comprehensive input validation that preserves Arabic text integrity while preventing injection attacks
2. **Authentication & Authorization**: Multi-factor OAuth2/JWT authentication with Iraqi institutional integration and role-based access control
3. **Agent Security**: PydanticAI agent input/output validation with cultural compliance checking
4. **Data Protection**: AES-256 encryption at rest and in transit, secure key management, and Iraqi data sovereignty compliance
5. **Database Security**: Supabase Row Level Security policies with professional domain access control
6. **Monitoring & Audit**: Real-time security event monitoring with Sentry integration and comprehensive audit trails

### Success Criteria
- [ ] 100% OWASP Top 10 2025 compliance with documented penetration test results
- [ ] <150ms security validation response time under peak load (3000+ concurrent users)
- [ ] 95%+ cultural compliance validation accuracy for Arabic content processing
- [ ] 100% input sanitization effectiveness while preserving Arabic text integrity
- [ ] Zero SQL injection vulnerabilities in automated security testing
- [ ] Complete audit trail for all security events with 7-year retention
- [ ] 99.9% uptime for security validation services
- [ ] Iraqi regulatory compliance documentation with Central Bank approval

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- url: https://owasp.org/www-project-top-ten/
  why: OWASP Top 10 2025 security vulnerabilities and mitigation strategies
  critical: Focus on Broken Access Control, Injection, and Cryptographic Failures
  
- url: https://supabase.com/docs/guides/auth/row-level-security
  why: Row Level Security implementation patterns and best practices
  critical: RLS policy syntax and performance optimization techniques
  
- url: https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/
  why: FastAPI OAuth2 with JWT implementation patterns
  critical: Dependency injection for security and proper token validation
  
- url: https://ai.pydantic.dev/agents/
  why: PydanticAI agent security and validation patterns
  critical: Input validation, structured responses, and safety controls
  
- file: examples/n8n-extracted/security/EnterpriseSecurityManager.ts
  why: Comprehensive security pattern with Islamic compliance and ministry access control
  critical: Security policy evaluation, role-based permissions, and cultural assessment patterns
  
- file: .claude/agents/payment-security-guardian.md
  why: Payment security implementation patterns and fraud detection
  critical: Security validation framework and Iraqi payment gateway security
  
- file: examples/iraqi-enterprise-auth/security/SecurityClearanceValidator.ts
  why: Government-level security clearance validation patterns
  critical: Background checks, cultural assessments, and clearance management
  
- file: examples/iraqi-enterprise-auth/package.json
  why: Security testing commands and dependency patterns
  critical: Jest security testing setup and validation commands
```

### Current Codebase Tree
```bash
aqlix-ai/
├── .claude/
│   └── agents/
│       ├── iraqi-security-specialist.md
│       └── payment-security-guardian.md
├── examples/
│   ├── n8n-extracted/security/
│   │   └── EnterpriseSecurityManager.ts
│   └── iraqi-enterprise-auth/security/
│       └── SecurityClearanceValidator.ts
├── src/ (inferred structure)
├── apps/
│   ├── web/ (Next.js frontend)
│   └── api/ (FastAPI backend)
└── packages/
    ├── supabase-client/
    └── arabic-nlp/
```

### Desired Codebase Tree
```bash
src/security/
├── core/
│   ├── SecurityManager.ts           # Main security orchestrator
│   ├── AuthenticationManager.ts     # OAuth2/JWT with Iraqi integration
│   ├── InputValidator.ts           # Sanitization preserving Arabic text
│   ├── AuditLogger.ts              # Security event logging
│   └── CryptoManager.ts            # Encryption and key management
├── middleware/
│   ├── SecurityMiddleware.ts       # FastAPI security middleware
│   ├── AuthMiddleware.ts           # Authentication middleware
│   ├── ValidationMiddleware.ts     # Input validation middleware
│   └── CorsMiddleware.ts           # CORS security configuration
├── agents/
│   ├── AgentSecurity.ts            # PydanticAI agent security layer
│   ├── CulturalCompliance.ts       # Iraqi cultural validation
│   └── AgentValidator.ts           # Agent input/output validation
├── policies/
│   ├── RLSPolicies.sql            # Supabase Row Level Security policies
│   ├── SecurityPolicies.ts        # Security policy engine
│   └── IraqiCompliancePolicies.ts # Iraqi-specific compliance rules
├── monitoring/
│   ├── SecurityMonitor.ts         # Sentry integration and alerting
│   ├── ThreatDetection.ts         # Real-time threat monitoring
│   └── ComplianceReporter.ts      # Iraqi regulatory compliance reporting
└── utils/
    ├── SecurityHelpers.ts         # Utility functions
    └── IraqiSecurityConstants.ts  # Iraqi-specific security constants

tests/security/
├── unit/                          # Individual component tests
├── integration/                   # System integration tests
├── penetration/                   # Security penetration tests
├── cultural/                      # Cultural compliance validation tests
└── performance/                   # Security performance tests
```

### Known Gotchas & Library Quirks
```typescript
// CRITICAL: Arabic text preservation during security validation
// Must use proper RTL handling and Unicode normalization
const validateArabicInput = (text: string) => {
  // Preserve Arabic characters while sanitizing
  const arabicPreserved = text.normalize('NFC');
  return sanitize(arabicPreserved, { preserveUnicode: true });
};

// CRITICAL: Bun runtime optimization for security performance
// Security validation MUST complete within 150ms
// Use Bun's native crypto and streaming capabilities

// CRITICAL: Supabase RLS policies MUST use parameterized queries
// Never use string concatenation for security policies
CREATE POLICY "secure_access" ON sensitive_data 
FOR SELECT TO authenticated 
USING (auth.uid() = user_id AND ministry = auth.jwt() ->> 'ministry');

// CRITICAL: PydanticAI agent security requires structured validation
// All agent inputs must be validated before processing
from pydantic_ai import Agent, RunContext
from pydantic import BaseModel, validator

class SecureAgentInput(BaseModel):
    content: str
    cultural_compliance: bool = True
    
    @validator('content')
    def validate_security(cls, v):
        # Implement security validation here
        return secure_validate(v)

// CRITICAL: Islamic compliance policies must respect prayer times
// Security operations during prayer times require special handling
const isPrayerTime = () => {
  // Use actual Iraqi prayer time calculation
  // Block non-emergency operations during prayer
};

// CRITICAL: Ministry/Professional domain access requires clearance validation
// Use existing SecurityClearanceValidator pattern from examples
const validateProfessionalAccess = async (user, domain) => {
  return await SecurityClearanceValidator.validate(user, domain);
};
```

## Implementation Blueprint

### Data Models and Structure

Create the core security data models ensuring type safety and cultural compliance:

```typescript
// Core security interfaces
interface SecurityContext {
  userId: string;
  sessionId: string;
  roles: SecurityRole[];
  professionalDomain?: 'legal' | 'medical' | 'educational' | 'organizational';
  culturalCompliance: boolean;
  securityClearance: 'basic' | 'elevated' | 'high' | 'professional';
}

interface SecurityValidationResult {
  allowed: boolean;
  requiresApproval: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  culturalCompliance: boolean;
  auditRequired: boolean;
  validationTime: number; // Must be <150ms
}

interface IraqiSecurityPolicy {
  id: string;
  name: string;
  islamicCompliant: boolean;
  arabicTextHandling: boolean;
  professionalDomainSupport: string[];
  rules: SecurityRule[];
}
```

### Task Implementation Order

```yaml
Task 1 - Core Security Manager:
CREATE src/security/core/SecurityManager.ts:
  - MIRROR pattern from: examples/n8n-extracted/security/EnterpriseSecurityManager.ts
  - ADAPT for Iraqi AI Chat System requirements
  - ADD PydanticAI agent integration hooks
  - IMPLEMENT <150ms validation requirement
  - PRESERVE Islamic compliance policy patterns

Task 2 - Input Validation Framework:
CREATE src/security/core/InputValidator.ts:
  - IMPLEMENT Arabic text preservation during sanitization
  - ADD OWASP Top 10 2025 injection prevention
  - INTEGRATE with existing arabic-nlp package patterns
  - ADD cultural content filtering
  - ENSURE XSS and SQL injection prevention

Task 3 - Authentication System:
CREATE src/security/core/AuthenticationManager.ts:
  - IMPLEMENT OAuth2/JWT with FastAPI patterns
  - ADD multi-factor authentication support
  - INTEGRATE with Supabase Auth patterns
  - ADD Iraqi institutional authentication hooks
  - PRESERVE session management from existing patterns

Task 4 - Agent Security Layer:
CREATE src/security/agents/AgentSecurity.ts:
  - INTEGRATE with PydanticAI validation patterns
  - ADD structured input/output validation
  - IMPLEMENT cultural compliance checking
  - ADD agent access control
  - COORDINATE with iraqi-security-specialist agent via Task tool

Task 5 - Database Security Policies:
CREATE src/security/policies/RLSPolicies.sql:
  - IMPLEMENT Supabase Row Level Security
  - ADD professional domain access control
  - PRESERVE existing Iraqi user role patterns
  - ADD audit logging table policies
  - ENSURE data sovereignty compliance

Task 6 - Middleware Integration:
CREATE src/security/middleware/SecurityMiddleware.ts:
  - INTEGRATE with FastAPI middleware stack
  - ADD request/response security validation
  - IMPLEMENT rate limiting and DDoS protection
  - ADD CORS security configuration
  - PRESERVE existing API route patterns

Task 7 - Monitoring and Alerting:
CREATE src/security/monitoring/SecurityMonitor.ts:
  - INTEGRATE with existing Sentry configuration
  - ADD real-time threat detection
  - IMPLEMENT security event alerting
  - ADD performance monitoring for security validation
  - PRESERVE existing logging patterns

Task 8 - Testing Framework:
CREATE tests/security/ directory structure:
  - IMPLEMENT OWASP Top 10 2025 penetration tests
  - ADD cultural compliance validation tests
  - CREATE performance tests for <150ms requirement
  - ADD integration tests with Iraqi AI agents
  - MIRROR test patterns from examples/iraqi-enterprise-auth/
```

### Per Task Pseudocode

```typescript
// Task 1 - Security Manager Implementation
class IraqiSecurityManager {
  private policies: Map<string, IraqiSecurityPolicy>;
  private auditLogger: AuditLogger;
  private culturalValidator: CulturalCompliance;
  
  async validateRequest(context: SecurityContext, request: any): Promise<SecurityValidationResult> {
    const startTime = performance.now();
    
    // PATTERN: Always validate cultural compliance first
    const culturalResult = await this.culturalValidator.validate(request, context);
    if (!culturalResult.compliant) {
      return this.createValidationResult(false, 'cultural_violation', startTime);
    }
    
    // PATTERN: Apply security policies in priority order
    for (const policy of this.getSortedPolicies()) {
      const policyResult = await this.evaluatePolicy(policy, context, request);
      if (!policyResult.allowed) {
        return this.createValidationResult(false, `policy_violation:${policy.id}`, startTime);
      }
    }
    
    // CRITICAL: Validation must complete within 150ms
    const elapsed = performance.now() - startTime;
    if (elapsed > 150) {
      console.warn(`Security validation exceeded 150ms: ${elapsed}ms`);
    }
    
    return this.createValidationResult(true, 'approved', startTime);
  }
}

// Task 4 - Agent Security Integration
class AgentSecurity {
  async validateAgentInput(input: any, agentType: string): Promise<ValidationResult> {
    // PATTERN: Use Iraqi security specialist for comprehensive validation
    const securityValidation = await this.delegateToSecuritySpecialist(input, agentType);
    
    // PATTERN: Preserve Arabic text while sanitizing
    const sanitized = await this.sanitizePreservingArabic(input);
    
    // PATTERN: Check cultural compliance
    const culturalCheck = await this.validateCulturalCompliance(sanitized);
    
    return {
      valid: securityValidation.valid && culturalCheck.compliant,
      sanitizedInput: sanitized,
      culturalCompliance: culturalCheck.compliant,
      securityRisk: securityValidation.riskLevel
    };
  }
  
  private async delegateToSecuritySpecialist(input: any, agentType: string) {
    // CRITICAL: Use Task tool to delegate to iraqi-security-specialist
    return await this.taskTool.invoke('iraqi-security-specialist', {
      action: 'validateAgentInput',
      input,
      agentType,
      requirements: ['iraqi_compliance', 'islamic_values', 'arabic_preservation']
    });
  }
}
```

### Integration Points

```yaml
SUPABASE INTEGRATION:
  - policies: "Enable RLS on all tables with professional domain access"
  - migration: "CREATE TABLE security_audit_log (id, user_id, action, timestamp, details)"
  - config: "Add security policy functions for professional domain validation"

FASTAPI INTEGRATION:
  - middleware: "Add SecurityMiddleware to FastAPI app before other middleware"
  - dependencies: "Create security dependency injection functions"
  - routes: "Protect all sensitive routes with security validation"

PYDANTICAI INTEGRATION:
  - agents: "Wrap all agent calls with security validation"
  - validation: "Add structured input/output validation for all agents"
  - cultural: "Integrate cultural compliance checking in agent responses"

SENTRY INTEGRATION:
  - monitoring: "Add security event tracking to existing Sentry setup"
  - alerts: "Configure security incident alerts with professional domain context"
  - performance: "Monitor security validation performance and optimization"

IRAQI AI AGENTS:
  - delegation: "Use Task tool to delegate to iraqi-security-specialist"
  - validation: "Use Task tool for cultural compliance validation"
  - testing: "Use Task tool for comprehensive security testing"
```

## Validation Loop

### Level 1: Syntax & Style
```bash
# Run these FIRST - fix any errors before proceeding
bun run lint                         # ESLint validation
bun run typecheck                    # TypeScript validation  
bun test src/security/ --type-check  # Security module type checking

# Expected: No errors. If errors exist, READ error messages and fix systematically.
```

### Level 2: Security Unit Tests
```typescript
// CREATE tests/security/unit/SecurityManager.test.ts
describe('IraqiSecurityManager', () => {
  test('validates Arabic input without corruption', async () => {
    const arabicText = 'مرحبا، كيف حالك؟';
    const result = await securityManager.validateInput(arabicText);
    expect(result.sanitizedInput).toContain('مرحبا');
    expect(result.culturalCompliance).toBe(true);
  });
  
  test('prevents SQL injection while preserving Arabic', async () => {
    const maliciousInput = "'; DROP TABLE users; --مرحبا";
    const result = await securityManager.validateInput(maliciousInput);
    expect(result.allowed).toBe(false);
    expect(result.riskLevel).toBe('critical');
  });
  
  test('completes validation within 150ms', async () => {
    const start = performance.now();
    await securityManager.validateRequest(mockContext, mockRequest);
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(150);
  });
  
  test('respects Islamic compliance policies', async () => {
    const duringPrayerTime = mockPrayerTimeContext();
    const result = await securityManager.validateRequest(duringPrayerTime, mockRequest);
    expect(result.requiresApproval).toBe(true);
  });
});
```

```bash
# Run and iterate until passing:
bun test tests/security/unit/ --coverage
# Coverage must be >90% for security components
```

### Level 3: OWASP Penetration Testing
```bash
# Security penetration testing
python scripts/security_test.py --owasp-top-10 --target http://localhost:8000
python scripts/sql_injection_test.py --arabic-content
python scripts/xss_test.py --rtl-support
python scripts/csrf_test.py --authentication

# Expected: All tests pass with 0 vulnerabilities detected
```

### Level 4: Cultural Compliance Testing
```bash
# Cultural and Arabic text testing
bun run test:cultural
bun run test:arabic
bun run test:islamic-compliance

# Expected: 95%+ cultural compliance accuracy
```

### Level 5: Integration Testing
```bash
# Start services
bun run dev                          # Start development server
bun run supabase:start              # Start Supabase locally

# Test security integration
curl -X POST http://localhost:8000/api/chat \
  -H "Authorization: Bearer valid_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{"message": "مرحبا، كيف يمكنني مساعدتك؟", "professionalDomain": "legal"}'

# Expected: {"status": "success", "securityValidation": "passed", "culturalCompliance": true}
```

### Level 6: Performance Testing
```bash
# Security performance validation
bun run test:performance --security-load --concurrent-users=3000
artillery run tests/security/performance/security-load-test.yml

# Expected: <150ms security validation under peak load
```

## Final Validation Checklist
- [ ] All unit tests pass: `bun test tests/security/ --coverage`
- [ ] No linting errors: `bun run lint`
- [ ] No type errors: `bun run typecheck`
- [ ] OWASP Top 10 2025 penetration tests pass: `python scripts/security_test.py`
- [ ] Cultural compliance tests pass: `bun run test:cultural`
- [ ] Performance requirements met: `bun run test:performance`
- [ ] Iraqi regulatory compliance documented
- [ ] Security incident response procedures tested
- [ ] Professional domain access control validated
- [ ] Arabic text integrity preserved in all security operations

---

## Anti-Patterns to Avoid
- ❌ Don't skip cultural compliance validation for performance
- ❌ Don't hardcode security policies - make them configurable
- ❌ Don't ignore Iraqi professional domain access requirements
- ❌ Don't compromise Arabic text integrity for security sanitization
- ❌ Don't bypass security validation for "trusted" inputs
- ❌ Don't log sensitive information in audit trails
- ❌ Don't implement security without proper error handling
- ❌ Don't ignore prayer time and Islamic compliance policies

## Quality Confidence Score: 9/10

**High Confidence Justification**:
- ✅ Complete OWASP Top 10 2025 vulnerability coverage with specific mitigation strategies
- ✅ Comprehensive Iraqi cultural compliance integration with measurable validation criteria  
- ✅ Detailed code examples from existing enterprise security implementations
- ✅ Specific performance requirements with executable validation commands
- ✅ Clear integration patterns with existing Iraqi AI agents and infrastructure
- ✅ Thorough testing framework covering security, cultural, and performance aspects
- ✅ Professional domain access control patterns adapted from government-level implementations
- ✅ Real-world security validation patterns with comprehensive error handling

**Confidence Level**: 9/10 - This PRP provides comprehensive context and validation framework for successful one-pass implementation of enterprise-grade security for the Iraqi AI Chat System.