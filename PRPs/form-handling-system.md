name: "Form Handling System PRP - Iraqi AI Chat System"
description: |

## Purpose
Establish robust form handling foundation for the Iraqi AI Chat System with react-hook-form, Zod validation, and culturally-appropriate form patterns that support Arabic RTL, Islamic compliance, and Iraqi professional domains.

## Core Principles
1. **Context is King**: Migrate proven patterns from examples/dyad-extracted/components/ui/
2. **Cultural Compliance**: 95%+ cultural appropriateness with Islamic values integration
3. **Accessibility First**: WCAG 2.1 AA compliance with Arabic screen reader support
4. **Type Safety**: Complete TypeScript integration with Zod schema inference
5. **Iraqi Requirements**: RTL support, Arabic processing, professional terminology

---

## Goal
Create comprehensive form handling system that provides type-safe form validation, efficient state management, and culturally-appropriate form patterns for Iraqi AI Chat System. Enable developers to build validated forms with proper Arabic RTL support, Islamic compliance, and accessibility standards.

## Why
- **Business Value**: Foundation for all user interactions (chat forms, settings, authentication)
- **Cultural Integration**: Forms must respect Islamic values and Iraqi professional standards  
- **User Experience**: Proper RTL support and Arabic text handling for Iraqi users
- **Developer Productivity**: Reusable form components with built-in validation reduce development time
- **Compliance**: WCAG 2.1 AA accessibility and government form standards

## What
Comprehensive form infrastructure including:
- React Hook Form integration with TypeScript
- Zod schema validation with cultural compliance
- Reusable form components (Form, FormField, FormItem, FormLabel, FormControl, FormMessage)
- Arabic RTL support with bidirectional text processing
- Error handling with Arabic/English bilingual messages
- Accessibility features with proper ARIA attributes

### Success Criteria
- [ ] Form components render correctly with Arabic text and RTL layout
- [ ] Zod validation works with zodResolver and TypeScript inference
- [ ] Error messages display in both Arabic and English appropriately
- [ ] WCAG 2.1 AA accessibility compliance verified
- [ ] 95%+ cultural appropriateness achieved via Iraqi AI agents
- [ ] Islamic compliance validation passes for religious content
- [ ] All TypeScript compilation passes without errors
- [ ] Comprehensive test coverage for form functionality and cultural requirements

## All Needed Context

### Documentation & References (list all context needed to implement the feature)
```yaml
# MUST READ - Include these in your context window
- url: https://react-hook-form.com/
  why: Core form state management patterns, useForm hook, Controller usage
  
- url: https://zod.dev/
  why: Schema validation patterns, TypeScript integration, error handling
  
- url: https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html
  why: Form accessibility requirements and ARIA attribute standards
  
- file: examples/dyad-extracted/components/ui/form.tsx
  why: Complete form system pattern to migrate - FormProvider, Controller, useFormContext
  
- file: examples/dyad-extracted/components/ui/input.tsx
  why: Input component pattern with proper styling and accessibility
  
- file: examples/dyad-extracted/components/ui/label.tsx  
  why: Label component with Radix UI integration
  
- file: examples/onlook-extracted/collaboration-engine/tests/collaboration-engine.test.ts
  why: Comprehensive testing patterns for cultural compliance and Arabic text
  
- file: CLAUDE.md
  why: Iraqi cultural requirements, agent delegation rules, RTL patterns
  critical: 95% cultural appropriateness required, Islamic compliance mandatory
  
- doc: React Hook Form with Zod resolver integration examples
  section: zodResolver usage patterns, TypeScript integration, error handling
  critical: Proper integration prevents validation failures and type errors
```

### Current Codebase tree (run `tree` in the root of the project) to get an overview of the codebase
```bash
├── examples/
│   ├── dyad-extracted/
│   │   └── components/
│   │       └── ui/
│   │           ├── form.tsx           # Complete form system - MIGRATE THIS
│   │           ├── input.tsx          # Input component pattern  
│   │           ├── label.tsx          # Label with accessibility
│   │           ├── button.tsx         # Button component
│   │           └── ...
│   └── onlook-extracted/
│       └── collaboration-engine/
│           └── tests/                 # Testing patterns for cultural compliance
├── PRPs/
│   ├── bun-workspace-setup.md        # Workspace structure required
│   ├── typescript-foundation.md      # TypeScript config patterns
│   └── ui-component-system.md        # UI package setup
├── CLAUDE.md                         # Cultural requirements and agent rules
└── (NO ROOT WORKSPACE YET)           # Must create packages/ structure
```

### Desired Codebase tree with files to be added and responsibility of file
```bash
├── packages/
│   └── ui/
│       ├── package.json              # Dependencies: react-hook-form, zod, @hookform/resolvers
│       ├── tsconfig.json             # Extends workspace TypeScript config
│       ├── src/
│       │   ├── form.tsx              # MIGRATE from examples/dyad-extracted + enhance with Iraqi features
│       │   ├── input.tsx             # Enhanced input with Arabic RTL support
│       │   ├── textarea.tsx          # Textarea component with RTL and Arabic support
│       │   ├── select.tsx            # Select component with Arabic options support
│       │   ├── checkbox.tsx          # Checkbox with Arabic labels
│       │   ├── radio-group.tsx       # Radio group with RTL layout
│       │   ├── form-field.tsx        # Enhanced FormField with cultural validation
│       │   ├── lib/
│       │   │   ├── validation/
│       │   │   │   ├── schemas.ts    # Common Zod schemas with Islamic compliance
│       │   │   │   ├── cultural-validation.ts # Cultural appropriateness validation
│       │   │   │   └── arabic-validation.ts   # Arabic text and RTL validation
│       │   │   └── utils.ts          # Form utilities with Arabic support
│       │   └── index.ts              # Export all form components
│       └── tests/
│           ├── form.test.tsx         # Comprehensive form functionality tests
│           ├── cultural-compliance.test.tsx # Cultural validation tests
│           ├── accessibility.test.tsx       # WCAG compliance tests
│           └── arabic-rtl.test.tsx          # RTL and Arabic text tests
├── apps/                             # (Future: will be created by other PRPs)
├── tsconfig.json                     # ROOT: Update with packages/ui path mapping
└── package.json                      # ROOT: Add workspace reference to packages/ui
```

### Known Gotchas of our codebase & Library Quirks
```typescript
// CRITICAL: Bun workspace requires proper package.json setup in each directory
// Each package needs workspace reference in root package.json and proper tsconfig extends

// CRITICAL: Cultural validation is NON-NEGOTIABLE per CLAUDE.md
// Must use Iraqi AI agents for cultural appropriateness validation
// 95%+ cultural appropriateness required for ALL content

// CRITICAL: RTL design requirements from CLAUDE.md  
// Use font-arabic class, right-align Arabic text, left-align English
// Mixed Arabic-English content requires proper bidirectional processing

// CRITICAL: React Hook Form + Zod integration requires @hookform/resolvers
// Must use zodResolver(schema) with useForm({ resolver: zodResolver(schema) })
// Error handling needs proper typing: FieldErrors<T> from react-hook-form

// GOTCHA: Radix UI components need proper forwardRef for form integration
// All form components must forward refs for proper focus management

// GOTCHA: TypeScript strict mode enabled in workspace
// All schemas must have proper type inference with z.infer<typeof schema>
// No 'any' types allowed - use proper generic constraints

// SECURITY: Never hardcode API keys - use .env with python-dotenv pattern
// Form validation must sanitize inputs for XSS prevention
```

## Implementation Blueprint

### Data models and structure

Create comprehensive form infrastructure with cultural intelligence and type safety.
```typescript
// Core form schema patterns with Islamic compliance
export const BaseFormSchema = z.object({
  // Standard fields with cultural validation
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters" })
    .refine(culturallyAppropriate, { message: "Name contains culturally inappropriate content" }),
  
  nameArabic: z.string().optional()
    .refine(arabicTextValid, { message: "Arabic name contains invalid characters" }),
    
  email: z.string().email({ message: "Invalid email format" })
    .refine(professionalEmailCheck, { message: "Please use professional email format" }),
});

// Form component types with accessibility
interface FormFieldProps {
  name: string;
  label: string;
  labelArabic?: string;
  description?: string;
  descriptionArabic?: string;
  required?: boolean;
  culturalValidation?: boolean;
  islamicCompliance?: boolean;
  rtlSupported?: boolean;
}

// Cultural validation hooks
interface CulturalValidationResult {
  isValid: boolean;
  culturalScore: number;
  islamicCompliant: boolean;
  flaggedTerms: string[];
  recommendations: string[];
}
```

### list of tasks to be completed to fullfill the PRP in the order they should be completed

```yaml
Task 1: Create packages/ui workspace foundation
MODIFY root package.json:
  - ADD "packages/*" to workspaces array
  - PRESERVE existing structure

CREATE packages/ui/package.json:
  - MIRROR pattern from: examples/dyad-extracted/ dependencies
  - ADD react-hook-form@^7.48.2, zod@^3.22.4, @hookform/resolvers@^3.3.2
  - INCLUDE @radix-ui/react-label, @radix-ui/react-slot (existing pattern)

CREATE packages/ui/tsconfig.json:
  - EXTEND ../../tsconfig.json pattern
  - ADD proper path mapping for @/lib/utils import

Task 2: Migrate and enhance form components
MIGRATE examples/dyad-extracted/components/ui/form.tsx → packages/ui/src/form.tsx:
  - PRESERVE all existing FormProvider, Controller, useFormContext patterns
  - ENHANCE FormField with cultural validation props
  - ADD Arabic label support with rtlSupported prop
  - INTEGRATE font-arabic class for Arabic text
  - ADD proper ARIA attributes for Arabic screen readers

CREATE packages/ui/src/input.tsx:
  - MIGRATE examples/dyad-extracted/components/ui/input.tsx pattern
  - ADD RTL text direction support
  - ENHANCE with Arabic placeholder support
  - ADD validation error styling for both English/Arabic

CREATE packages/ui/src/lib/validation/schemas.ts:
  - DEFINE common Zod schemas with cultural validation
  - IMPLEMENT Islamic compliance refinements
  - ADD Arabic text validation patterns
  - INCLUDE professional terminology validation

Task 3: Cultural validation integration  
CREATE packages/ui/src/lib/validation/cultural-validation.ts:
  - IMPLEMENT cultural appropriateness validation hooks
  - INTEGRATE with iraqi-cultural-validator agent patterns
  - ADD Islamic compliance checking functions
  - INCLUDE professional domain terminology validation

CREATE packages/ui/src/lib/validation/arabic-validation.ts:
  - IMPLEMENT Arabic text processing with arabic-rtl-processor integration
  - ADD bidirectional text validation
  - INCLUDE Iraqi dialect recognition patterns
  - ADD mixed Arabic-English content validation

Task 4: Testing infrastructure
CREATE packages/ui/tests/form.test.tsx:
  - MIRROR testing patterns from examples/onlook-extracted/
  - TEST all form components render correctly
  - VALIDATE Zod schema integration works
  - TEST error handling displays properly
  - INCLUDE TypeScript type inference tests

CREATE packages/ui/tests/cultural-compliance.test.tsx:
  - TEST 95%+ cultural appropriateness requirement
  - VALIDATE Islamic compliance for religious content
  - TEST cultural validation hooks work correctly
  - INCLUDE professional domain terminology tests

CREATE packages/ui/tests/accessibility.test.tsx:
  - TEST WCAG 2.1 AA compliance
  - VALIDATE Arabic screen reader compatibility
  - TEST keyboard navigation works with RTL
  - INCLUDE focus management and ARIA attribute tests

CREATE packages/ui/tests/arabic-rtl.test.tsx:
  - TEST RTL layout rendering correctly  
  - VALIDATE Arabic text processing
  - TEST mixed Arabic-English content
  - INCLUDE bidirectional text display tests

Task 5: Integration and documentation
UPDATE root tsconfig.json:
  - ADD path mapping: "@aqlix-ai/ui": ["packages/ui/src"]
  - PRESERVE existing workspace configuration

CREATE packages/ui/src/index.ts:
  - EXPORT all form components
  - EXPORT validation schemas and utilities
  - EXPORT cultural validation hooks
  - INCLUDE TypeScript type exports

CREATE packages/ui/README.md:
  - DOCUMENT form component usage with examples
  - INCLUDE cultural validation requirements
  - ADD Arabic RTL support documentation
  - PROVIDE accessibility compliance guide
```

### Per task pseudocode as needed added to each task

```typescript
// Task 2: Form Component Enhancement Pseudocode
const FormField = <T extends FieldValues>({
  name,
  label,
  labelArabic,
  culturalValidation = true,
  islamicCompliance = false,
  rtlSupported = true,
  ...props
}: FormFieldProps<T>) => {
  // PATTERN: Use existing useFormField hook from examples/dyad-extracted
  const { error, formItemId } = useFormField();
  
  // ENHANCE: Add cultural validation
  const { validateCulturally } = useCulturalValidation();
  
  // CRITICAL: Use font-arabic class for Arabic text (CLAUDE.md requirement)  
  const labelClasses = cn(
    "text-sm font-medium",
    rtlSupported && labelArabic && "font-arabic text-right",
    error && "text-destructive"
  );
  
  return (
    <FormItemContext.Provider value={{ id: formItemId }}>
      {/* PATTERN: Follow existing FormLabel pattern exactly */}
      <FormLabel className={labelClasses}>
        {labelArabic && rtlSupported ? labelArabic : label}
      </FormLabel>
      
      {/* ENHANCE: Add cultural validation feedback */}
      {culturalValidation && (
        <CulturalValidationIndicator 
          value={props.value} 
          islamicCompliance={islamicCompliance}
        />
      )}
      
      <FormControl {...props} />
      <FormMessage />
    </FormItemContext.Provider>
  );
};

// Task 3: Cultural Validation Integration Pseudocode
const useCulturalValidation = () => {
  // CRITICAL: Use iraqi-cultural-validator agent (CLAUDE.md requirement)
  const validateCulturally = async (content: string): Promise<CulturalValidationResult> => {
    // PATTERN: Must achieve 95%+ cultural appropriateness
    const result = await culturalValidationAgent.validate(content);
    
    if (result.culturalScore < 0.95) {
      throw new Error("Content does not meet cultural appropriateness requirements");
    }
    
    return result;
  };
  
  // PATTERN: Islamic compliance validation for religious content
  const validateIslamicCompliance = async (content: string): Promise<boolean> => {
    const result = await islamicComplianceAgent.validate(content);
    return result.compliant;
  };
  
  return { validateCulturally, validateIslamicCompliance };
};
```

### Integration Points
```yaml
DEPENDENCIES:
  - install: "bun add react-hook-form@^7.48.2 zod@^3.22.4 @hookform/resolvers@^3.3.2"
  - location: packages/ui/package.json
  - pattern: Follow dyad-extracted dependency patterns
  
WORKSPACE:
  - add to: root package.json workspaces array
  - pattern: "packages/*" workspace configuration
  
TYPESCRIPT:
  - add to: root tsconfig.json paths
  - pattern: "@aqlix-ai/ui": ["packages/ui/src"]
  
CULTURAL AGENTS:
  - integrate: iraqi-cultural-validator for 95%+ appropriateness requirement
  - integrate: arabic-rtl-processor for Arabic text processing
  - pattern: Use Task tool to delegate cultural validation work
```

## Validation Loop

### Level 1: Syntax & Style
```bash
# Run these FIRST - fix any errors before proceeding
bun run typecheck                     # TypeScript compilation check
bun run --filter @aqlix-ai/ui build  # Build packages/ui successfully

# Expected: No TypeScript errors, successful compilation
# If errors: Read TypeScript errors carefully, fix import paths and type issues
```

### Level 2: Unit Tests each new feature/file/function use existing test patterns
```typescript
// CREATE comprehensive test coverage for all form components
describe('Form System', () => {
  test('should render form with Arabic RTL support', () => {
    const TestSchema = z.object({
      name: z.string().min(1, 'Name is required'),
      nameArabic: z.string().optional()
    });
    
    const { register, handleSubmit, formState: { errors } } = useForm({
      resolver: zodResolver(TestSchema)
    });
    
    render(
      <Form>
        <FormField
          name="name"
          label="Name"
          labelArabic="الاسم"
          culturalValidation={true}
          {...register('name')}
        />
      </Form>
    );
    
    // Validate RTL layout and Arabic text
    expect(screen.getByLabelText('الاسم')).toBeInTheDocument();
    expect(screen.getByLabelText('الاسم')).toHaveClass('font-arabic');
  });
  
  test('should validate cultural appropriateness', async () => {
    const TestSchema = z.object({
      content: z.string().refine(culturallyAppropriate, {
        message: 'Content not culturally appropriate'
      })
    });
    
    const result = TestSchema.safeParse({ content: 'inappropriate content' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('culturally appropriate');
    }
  });
  
  test('should handle Islamic compliance validation', async () => {
    const islamicContent = 'بسم الله الرحمن الرحيم';
    const validation = await validateIslamicCompliance(islamicContent);
    expect(validation.compliant).toBe(true);
  });
});
```

```bash
# Run and iterate until passing:
bun test packages/ui/tests/form.test.tsx -v
bun test packages/ui/tests/cultural-compliance.test.tsx -v
bun test packages/ui/tests/accessibility.test.tsx -v
bun test packages/ui/tests/arabic-rtl.test.tsx -v

# Expected: All tests pass, 95%+ cultural compliance, WCAG 2.1 AA compliance
# If failing: Fix form logic, cultural validation, or accessibility issues
```

### Level 3: Integration Test
```bash
# Test the complete form system in development environment
bun run dev

# Test form components manually:
# 1. Create test form with Arabic labels and RTL layout
# 2. Validate Zod schema integration works correctly  
# 3. Test error messages display in appropriate language
# 4. Verify cultural validation prevents inappropriate content
# 5. Test accessibility with screen reader simulation

# Expected: Form renders correctly, validation works, cultural compliance maintained
# If error: Check browser console for TypeScript errors or cultural validation failures
```

## Final validation Checklist
- [ ] All tests pass: `bun test packages/ui/` with 100% success rate
- [ ] No TypeScript errors: `bun run typecheck` with zero issues
- [ ] Build succeeds: `bun run --filter @aqlix-ai/ui build` without warnings
- [ ] Cultural compliance: 95%+ appropriateness via iraqi-cultural-validator agent
- [ ] Islamic compliance: Religious content validates correctly
- [ ] Accessibility: WCAG 2.1 AA compliance verified with screen reader testing
- [ ] RTL support: Arabic text displays correctly with font-arabic class
- [ ] Form functionality: react-hook-form + Zod integration works seamlessly
- [ ] Error handling: Bilingual error messages display appropriately
- [ ] Type safety: Complete TypeScript coverage with proper schema inference

---

## Anti-Patterns to Avoid
- ❌ Don't create form patterns when dyad-extracted examples exist - migrate them
- ❌ Don't skip cultural validation - 95%+ appropriateness is mandatory  
- ❌ Don't ignore RTL requirements - Arabic text must use font-arabic class
- ❌ Don't bypass Islamic compliance for religious content
- ❌ Don't use 'any' types - maintain strict TypeScript compliance
- ❌ Don't hardcode form values - use proper Zod schema validation
- ❌ Don't skip accessibility testing - WCAG 2.1 AA is required
- ❌ Don't create forms without proper error handling for both languages

---

**PRP Quality Score: 9/10** - Comprehensive context provided with exact migration paths, cultural requirements clearly specified, executable validation gates, and proven patterns from existing codebase. AI agent has all necessary information for successful one-pass implementation of Iraqi-compliant form handling system.