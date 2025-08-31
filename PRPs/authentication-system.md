# Iraqi AI Chat System - Authentication System Implementation

**PRP ID**: authentication-system  
**Created**: 2025-01-31  
**Complexity**: Intermediate  
**Dependencies**: bun-workspace-setup, typescript-foundation, environment-variables-setup  
**Estimated Implementation**: 4-6 hours  
**One-Pass Confidence Score**: 9/10

## CONTEXT & PURPOSE

Implement secure authentication system for the Iraqi AI Chat System using Supabase Auth with Iraqi cultural compliance, professional domain support, and enterprise-grade security patterns.

**Foundation Requirements**: Supabase authentication with JWT tokens, session management, and Iraqi-specific cultural validation layer ensuring 95%+ cultural appropriateness and 90%+ Islamic compliance.

## RESEARCH FINDINGS & CRITICAL CONTEXT

### Supabase Authentication Foundation
- **Core Technology**: JWT-based authentication with row-level security (RLS)
- **Authentication Methods**: Email/password, magic links, social providers
- **Security Features**: Automatic token handling, database-level access control
- **Session Management**: JWT tokens with configurable expiration
- **Documentation**: https://supabase.com/docs/guides/auth

### JWT Security Best Practices
- **Token Lifecycle**: Short-lived access tokens (15 minutes), longer refresh tokens
- **Storage**: Secure HTTP-only cookies for web, secure storage for mobile
- **Validation**: Always verify token signature and claims
- **Security**: Never store sensitive data in JWT payload
- **Documentation**: https://jwt.io/introduction/

### Iraqi Cultural Requirements (FROM CLAUDE.md)
- **Cultural Validation**: 95%+ appropriateness via `iraqi-cultural-validator` agent
- **Islamic Compliance**: 90%+ alignment with Islamic professional values
- **Arabic RTL**: 99%+ accuracy via `arabic-rtl-processor` agent  
- **Professional Domains**: Support Iraqi legal/medical/educational contexts
- **Language Support**: Iraqi dialect + Standard Arabic + English

### Professional Terminology (FROM NAMING_CONVENTIONS.md)
- **CRITICAL**: Generate clean professional names WITHOUT "iraqi-" prefixes
- **Transformation**: `government` → `professional`, `ministry` → `organization`
- **Examples**: `AuthService` NOT `IraqiAuthService`, `UserManager` NOT `IraqiUserManager`
- **Cultural Intelligence**: Embedded as capabilities, not visible branding

### Existing Pattern Reference (FROM examples/iraqi-enterprise-auth/)
- **Multi-layered Security**: Device validation, cultural assessment, biometric support
- **Cultural Integration**: Prayer time awareness, Islamic calendar integration
- **Professional Support**: Ministry-level RBAC, security clearance validation
- **Session Management**: Comprehensive audit logging, threat detection

## ARCHITECTURE BLUEPRINT

### Layer Architecture (Bottom-Up)
```
┌─────────────────────────────────────────┐
│ 4. Professional Domain Layer            │
│   - Legal/Medical/Educational Support    │
│   - Organizational RBAC                  │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ 3. Cultural Validation Layer            │
│   - Islamic Compliance (90%+)           │
│   - Arabic RTL Processing (99%+)        │
│   - Cultural Appropriateness (95%+)     │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ 2. Security Enhancement Layer           │
│   - Enhanced JWT handling               │
│   - Session monitoring                  │
│   - Threat detection                    │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ 1. Supabase Auth Foundation             │
│   - User registration/login             │
│   - JWT token management                │
│   - Database integration                │
└─────────────────────────────────────────┘
```

### File Structure
```
apps/web/
├── src/
│   ├── lib/
│   │   ├── auth/
│   │   │   ├── supabase-client.ts      # Supabase client setup
│   │   │   ├── auth-service.ts         # Core auth service
│   │   │   ├── session-manager.ts      # Session handling
│   │   │   ├── cultural-validator.ts   # Cultural compliance
│   │   │   └── professional-rbac.ts    # Professional domain access
│   │   └── types/
│   │       ├── auth.ts                 # Authentication types
│   │       ├── cultural.ts             # Cultural validation types
│   │       └── professional.ts         # Professional domain types
│   ├── components/
│   │   ├── auth/
│   │   │   ├── login-form.tsx          # Login component
│   │   │   ├── register-form.tsx       # Registration component
│   │   │   ├── auth-provider.tsx       # Auth context provider
│   │   │   └── protected-route.tsx     # Route protection
│   │   └── ui/                         # Reusable UI components
│   ├── hooks/
│   │   ├── use-auth.ts                 # Authentication hook
│   │   ├── use-session.ts              # Session management hook
│   │   └── use-cultural-validation.ts  # Cultural validation hook
│   ├── middleware.ts                   # Route protection middleware
│   └── app/
│       ├── auth/
│       │   ├── login/page.tsx          # Login page
│       │   ├── register/page.tsx       # Registration page
│       │   └── callback/page.tsx       # Auth callback
│       └── dashboard/
│           └── page.tsx                # Protected dashboard
├── supabase/
│   ├── migrations/
│   │   ├── 001_auth_setup.sql          # Basic auth setup
│   │   ├── 002_cultural_profiles.sql   # Cultural user profiles
│   │   └── 003_professional_rbac.sql   # Professional access control
│   └── seed.sql                        # Development data
└── tests/
    ├── auth/
    │   ├── auth-service.test.ts        # Auth service tests
    │   ├── cultural-validation.test.ts # Cultural tests
    │   └── professional-access.test.ts # RBAC tests
    └── components/
        └── auth/                       # Component tests
```

## IMPLEMENTATION TASKS (ORDERED FOR EXECUTION)

### Phase 1: Foundation Setup (1-1.5 hours)

**1.1 Setup Supabase Client Configuration**
```bash
# Install dependencies
cd apps/web
bun add @supabase/supabase-js @supabase/auth-helpers-nextjs
```

**1.2 Create Environment Configuration**
- Add to `apps/web/.env.local`:
  ```
  NEXT_PUBLIC_SUPABASE_URL=your_project_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
  ```

**1.3 Implement Supabase Client Setup**
- File: `apps/web/src/lib/auth/supabase-client.ts`
- Pattern: Follow Supabase Next.js documentation
- Features: Client-side and server-side clients

**1.4 Create Core Authentication Types**
- File: `apps/web/src/lib/types/auth.ts`
- Reference: `examples/iraqi-enterprise-auth/interfaces/authentication.ts`
- Features: User types, auth states, session types

### Phase 2: Core Authentication Service (1.5-2 hours)

**2.1 Implement Core Auth Service**
- File: `apps/web/src/lib/auth/auth-service.ts`
- Features: Register, login, logout, password reset
- Pattern: Service layer with error handling
- Reference: Supabase auth patterns + `examples/iraqi-enterprise-auth/core/IraqiEnterpriseAuth.ts`

**2.2 Create Session Management**
- File: `apps/web/src/lib/auth/session-manager.ts`
- Features: JWT handling, token refresh, session persistence
- Security: HTTP-only cookies, CSRF protection
- Reference: JWT best practices from research

**2.3 Implement Authentication Context**
- File: `apps/web/src/components/auth/auth-provider.tsx`
- Features: React context for auth state
- Pattern: Provider pattern with TypeScript

### Phase 3: Cultural Validation Integration (1-1.5 hours)

**3.1 Cultural Validation Service** 
- File: `apps/web/src/lib/auth/cultural-validator.ts`
- **MANDATORY**: Use `Task` tool with `iraqi-cultural-validator` agent
- Features: Cultural appropriateness validation (95%+ requirement)
- Pattern: Agent-based validation with fallback

**3.2 Arabic RTL Processing Integration**
- File: `apps/web/src/hooks/use-cultural-validation.ts`
- **MANDATORY**: Use `Task` tool with `arabic-rtl-processor` agent  
- Features: RTL text processing (99%+ accuracy requirement)
- Pattern: Hook-based cultural processing

**3.3 Islamic Compliance Validation**
- Features: Islamic professional values validation (90%+ requirement)
- Integration: Cultural validator with Islamic compliance rules
- Pattern: Embedded compliance checking

### Phase 4: Professional Domain Support (1-1.5 hours)

**4.1 Professional RBAC System**
- File: `apps/web/src/lib/auth/professional-rbac.ts`
- Features: Organization-based access control
- Reference: `examples/iraqi-enterprise-auth/ministry/MinistryRBAC.ts`
- **CRITICAL**: Use professional terminology (organization NOT ministry)

**4.2 Professional Domain Types**
- File: `apps/web/src/lib/types/professional.ts`
- Features: Legal, medical, educational domain types
- Pattern: TypeScript interfaces for professional contexts

### Phase 5: UI Components (1 hour)

**5.1 Authentication Forms**
- Files: `apps/web/src/components/auth/login-form.tsx`, `register-form.tsx`
- **MANDATORY**: Arabic RTL support via `arabic-rtl-processor` agent
- Features: Responsive, accessible, culturally appropriate
- Pattern: Form validation with cultural compliance

**5.2 Route Protection**
- File: `apps/web/src/components/auth/protected-route.tsx`
- Features: HOC for route protection
- Pattern: Component-based access control

**5.3 Next.js Middleware**
- File: `apps/web/src/middleware.ts`
- Features: Server-side route protection
- Pattern: Next.js middleware with Supabase

### Phase 6: Database Setup & Testing (30 minutes)

**6.1 Supabase Migrations**
- Files: `apps/web/supabase/migrations/`
- Features: User profiles, cultural preferences, professional domains
- Pattern: Progressive schema evolution

**6.2 Test Implementation**
- Files: `apps/web/tests/auth/`
- Features: Unit tests for all auth components
- Pattern: Jest with Supabase testing utilities

## CODE EXAMPLES & PATTERNS

### Core Auth Service Pattern (Professional Terminology)
```typescript
// apps/web/src/lib/auth/auth-service.ts
export class AuthService {
  private supabase: SupabaseClient;
  private culturalValidator: CulturalValidator;
  
  constructor() {
    this.supabase = createSupabaseClient();
    this.culturalValidator = new CulturalValidator();
  }

  async registerProfessional(
    credentials: ProfessionalCredentials
  ): Promise<AuthResult> {
    // 1. Cultural validation FIRST (95%+ requirement)
    const culturalValidation = await this.culturalValidator.validate(credentials);
    if (!culturalValidation.isCompliant) {
      throw new CulturalComplianceError(culturalValidation.violations);
    }

    // 2. Supabase registration
    const { data, error } = await this.supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          organizationType: credentials.organizationType, // NOT ministry
          culturalPreferences: culturalValidation.preferences,
          islamicCompliance: culturalValidation.islamicScore >= 90
        }
      }
    });

    if (error) throw new AuthenticationError(error.message);
    return { success: true, user: data.user };
  }
}
```

### Cultural Validation Pattern (Agent Integration)
```typescript
// apps/web/src/lib/auth/cultural-validator.ts
export class CulturalValidator {
  async validate(content: any): Promise<CulturalValidationResult> {
    // MANDATORY: Use Task tool with iraqi-cultural-validator agent
    // This ensures 95%+ cultural appropriateness requirement
    const agentValidation = await this.callCulturalAgent(content);
    
    return {
      isCompliant: agentValidation.score >= 95,
      culturalScore: agentValidation.culturalScore,
      islamicScore: agentValidation.islamicScore,
      violations: agentValidation.violations,
      recommendations: agentValidation.recommendations
    };
  }

  private async callCulturalAgent(content: any) {
    // Implementation will use Task tool to call iraqi-cultural-validator
    // This pattern ensures proper agent integration
  }
}
```

### Arabic RTL Form Pattern
```tsx
// apps/web/src/components/auth/login-form.tsx
export function LoginForm() {
  // MANDATORY: Use arabic-rtl-processor for 99%+ RTL accuracy
  const { processArabicText, isRTL } = useArabicProcessor();
  const { validateCulturally } = useCulturalValidation();

  return (
    <form className={`${isRTL ? 'text-right' : 'text-left'} space-y-4`}>
      <div>
        <label className="font-arabic">
          {processArabicText('البريد الإلكتروني')} / Email
        </label>
        <input
          type="email"
          className="w-full p-3 border rounded font-arabic"
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </div>
      {/* Additional form fields with RTL support */}
    </form>
  );
}
```

## CULTURAL COMPLIANCE REQUIREMENTS

### Mandatory Agent Integration
1. **Cultural Validation**: `iraqi-cultural-validator` - 95%+ appropriateness 
2. **Arabic Processing**: `arabic-rtl-processor` - 99%+ RTL accuracy
3. **Islamic Compliance**: Embedded in cultural validator - 90%+ alignment
4. **Professional Context**: Support Iraqi legal/medical/educational domains

### Usage Patterns
```typescript
// MANDATORY: Always validate cultural compliance
await Task({
  subagent_type: "iraqi-cultural-validator",
  description: "Validate authentication content",
  prompt: "Validate this authentication flow for Iraqi cultural appropriateness and Islamic compliance. Ensure 95%+ cultural score and 90%+ Islamic compliance score."
});

// MANDATORY: Process Arabic text properly  
await Task({
  subagent_type: "arabic-rtl-processor", 
  description: "Process Arabic authentication text",
  prompt: "Process authentication form text for proper RTL display and Iraqi dialect recognition with 99%+ accuracy."
});
```

## SECURITY IMPLEMENTATION

### JWT Security Patterns
```typescript
// Secure token handling
export class SecureTokenManager {
  private readonly TOKEN_EXPIRY = 15 * 60 * 1000; // 15 minutes
  private readonly REFRESH_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days
  
  validateToken(token: string): TokenValidation {
    // 1. Verify signature
    // 2. Check expiration
    // 3. Validate claims
    // 4. Cross-check with database
  }
}
```

### Security Headers (Next.js Middleware)
```typescript
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  return response;
}
```

## ERROR HANDLING STRATEGY

### Cultural Compliance Errors
```typescript
export class CulturalComplianceError extends Error {
  constructor(
    public violations: CulturalViolation[],
    public score: number
  ) {
    super(`Cultural compliance violation: ${score}% (required: 95%+)`);
  }
}

export class IslamicComplianceError extends Error {
  constructor(public score: number) {
    super(`Islamic compliance violation: ${score}% (required: 90%+)`);
  }
}
```

### Error Recovery Patterns
```typescript
// Graceful degradation with cultural awareness
export async function authenticateWithFallback(credentials: Credentials) {
  try {
    return await authenticateWithCulturalValidation(credentials);
  } catch (error) {
    if (error instanceof CulturalComplianceError) {
      // Allow with warnings if score > 80%
      if (error.score > 80) {
        return authenticateWithWarnings(credentials, error.violations);
      }
    }
    throw error;
  }
}
```

## VALIDATION GATES (EXECUTABLE)

### Phase 1: TypeScript & Build Validation
```bash
# From apps/web/ directory - MUST pass before proceeding
cd apps/web
bun run typecheck    # Zero TypeScript errors
bun run build        # Successful production build
bun run lint         # All linting rules pass
```

### Phase 2: Authentication Functionality
```bash
# Supabase connection test
bun test auth/supabase-client.test.ts

# Core auth service test  
bun test auth/auth-service.test.ts

# Session management test
bun test auth/session-manager.test.ts
```

### Phase 3: Cultural Compliance Validation
```bash
# MANDATORY: Cultural appropriateness validation
bun test auth/cultural-validation.test.ts
# Expected: 95%+ cultural appropriateness score

# MANDATORY: Arabic RTL processing
bun test auth/arabic-processing.test.ts  
# Expected: 99%+ RTL accuracy

# MANDATORY: Islamic compliance validation
bun test auth/islamic-compliance.test.ts
# Expected: 90%+ Islamic compliance score
```

### Phase 4: Security & Integration
```bash
# Security validation
bun test auth/security.test.ts

# End-to-end authentication flow
bun run test:e2e auth/authentication-flow.test.ts

# Performance validation
bun test auth/performance.test.ts
# Expected: <200ms cultural validation, <100ms Arabic processing
```

### Phase 5: Final Validation
```bash
# Complete test suite
bun test --coverage
# Expected: >90% code coverage

# Production build validation
bun run build && bun run start
# Expected: Successful production deployment
```

## TESTING STRATEGY

### Unit Tests (Required)
```typescript
// Cultural validation testing
describe('CulturalValidator', () => {
  it('should achieve 95%+ cultural appropriateness', async () => {
    const validator = new CulturalValidator();
    const result = await validator.validate(sampleContent);
    expect(result.culturalScore).toBeGreaterThanOrEqual(95);
  });

  it('should achieve 90%+ Islamic compliance', async () => {
    const validator = new CulturalValidator(); 
    const result = await validator.validate(sampleContent);
    expect(result.islamicScore).toBeGreaterThanOrEqual(90);
  });
});
```

### Integration Tests (Required)
```typescript
// Authentication flow testing
describe('Authentication Flow', () => {
  it('should complete full professional registration', async () => {
    const credentials = createProfessionalCredentials();
    const result = await authService.registerProfessional(credentials);
    
    expect(result.success).toBe(true);
    expect(result.user.organizationType).toBeDefined(); // NOT ministryType
    expect(result.culturalValidation.score).toBeGreaterThanOrEqual(95);
  });
});
```

## COMMON PITFALLS & SOLUTIONS

### 1. Cultural Validation Performance
**Problem**: Cultural validation taking >500ms
**Solution**: Implement caching layer for repeated validations
```typescript
private validationCache = new Map<string, CulturalValidationResult>();
```

### 2. Arabic RTL Display Issues  
**Problem**: Mixed Arabic-English text displaying incorrectly
**Solution**: Use `arabic-rtl-processor` agent with proper directionality
```tsx
<span dir={isArabic ? 'rtl' : 'ltr'}>{processedText}</span>
```

### 3. JWT Token Security
**Problem**: Tokens exposed in localStorage
**Solution**: Use HTTP-only cookies with secure settings
```typescript
const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict' as const
};
```

### 4. Professional Terminology Violations
**Problem**: Generated code using "iraqi-" prefixes
**Solution**: Follow NAMING_CONVENTIONS.md - use clean professional names
```typescript
// ❌ WRONG
class IraqiAuthService {}

// ✅ CORRECT  
class AuthService {
  async validateCulturalCompliance() { /* Iraqi intelligence embedded */ }
}
```

## EXTERNAL RESOURCES

### Documentation (Critical Reading)
- **Supabase Auth**: https://supabase.com/docs/guides/auth
- **JWT Introduction**: https://jwt.io/introduction/  
- **Next.js Middleware**: https://nextjs.org/docs/middleware
- **React Context Patterns**: https://react.dev/reference/react/createContext

### Code References (Study These Patterns)
- **Cultural Integration**: `examples/iraqi-enterprise-auth/core/IraqiEnterpriseAuth.ts`
- **Authentication Interfaces**: `examples/iraqi-enterprise-auth/interfaces/authentication.ts` 
- **Professional Terminology**: `NAMING_CONVENTIONS.md`
- **Agent Integration**: `CLAUDE.md` sections on agent usage

### Security Guidelines
- **OWASP Authentication**: https://owasp.org/www-project-authentication-cheat-sheet/
- **JWT Security**: https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/

## DELIVERABLES CHECKLIST

- [ ] ✅ Supabase client configured with environment variables
- [ ] ✅ Core AuthService with professional terminology (NO "iraqi-" prefixes)
- [ ] ✅ Cultural validation achieving 95%+ appropriateness via `iraqi-cultural-validator`
- [ ] ✅ Arabic RTL processing achieving 99%+ accuracy via `arabic-rtl-processor`
- [ ] ✅ Islamic compliance validation achieving 90%+ score
- [ ] ✅ Professional domain RBAC system (organization NOT ministry)
- [ ] ✅ Authentication UI components with RTL support
- [ ] ✅ Protected route implementation with Next.js middleware
- [ ] ✅ Comprehensive test suite with >90% coverage
- [ ] ✅ All validation gates passing (TypeScript, build, cultural, security)
- [ ] ✅ Production-ready deployment configuration

## ACCEPTANCE CRITERIA

### Functional Requirements
1. **User Registration**: Email/password registration with cultural validation
2. **User Login**: Secure login with session management  
3. **Session Management**: JWT tokens with secure storage and refresh
4. **Route Protection**: Middleware-based access control
5. **Cultural Compliance**: 95%+ appropriateness, 90%+ Islamic compliance
6. **Arabic Support**: 99%+ RTL accuracy for all text processing
7. **Professional Context**: Support for Iraqi organizational domains

### Quality Requirements  
1. **Performance**: <200ms cultural validation, <100ms Arabic processing
2. **Security**: JWT best practices, secure token storage, CSRF protection
3. **Reliability**: >99% uptime, graceful error handling
4. **Maintainability**: Clean architecture, comprehensive documentation
5. **Cultural Accuracy**: Validated by Iraqi cultural agents

### Integration Requirements
1. **Supabase Integration**: Full auth system integration
2. **Next.js Integration**: Server-side and client-side auth
3. **Cultural Agents**: Mandatory integration with `iraqi-cultural-validator` and `arabic-rtl-processor`
4. **Professional Domains**: Support legal/medical/educational contexts

---

**PRP Confidence Score: 9/10**

This PRP provides comprehensive context for one-pass implementation including:
- ✅ Complete architecture blueprint with layer separation
- ✅ Detailed file structure with exact paths  
- ✅ Step-by-step implementation tasks in execution order
- ✅ Working code examples from existing patterns
- ✅ Mandatory cultural compliance requirements (95%+ cultural, 90%+ Islamic, 99%+ RTL)
- ✅ Executable validation gates for each phase
- ✅ Professional terminology compliance (no "iraqi-" prefixes in generated code)
- ✅ Security best practices with JWT handling
- ✅ Error handling strategies and common pitfall solutions
- ✅ Complete external documentation references

**Confidence reduced by 1 point only due to**: Complex cultural agent integration requiring precise Task tool usage - but comprehensive examples and patterns provided for success.