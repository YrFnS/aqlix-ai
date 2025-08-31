name: "Arabic Input Handling System - Comprehensive IME and Keyboard Support"
description: |

## Purpose
Implement comprehensive Arabic input handling system with IME support, composition events, input validation, text normalization, and real-time cultural validation for the Iraqi AI Chat System.

## Core Principles
1. **Cultural Compliance First**: All input handling must respect Islamic values and Iraqi cultural norms
2. **Real-time Validation**: Immediate feedback for Arabic text input accuracy and appropriateness
3. **Performance Optimized**: <100ms input processing, <200ms cultural validation
4. **Browser Compatible**: Support across Chrome, Firefox, Safari, Edge with consistent behavior
5. **Accessibility First**: WCAG 2.1 AA compliance with Arabic screen reader support

---

## Goal
Build a production-ready Arabic input handling system that provides seamless Arabic text entry, real-time validation, cultural appropriateness checking, and intelligent input method editor (IME) support for Iraqi users across all major browsers and devices.

## Why
- **User Experience**: Enable natural Arabic text input without technical barriers or interruptions
- **Cultural Integrity**: Ensure all Arabic input meets Iraqi cultural standards and Islamic compliance
- **Professional Quality**: Support government and business use cases requiring formal Arabic input
- **Accessibility**: Provide inclusive Arabic input for users with disabilities
- **Technical Foundation**: Create reusable input handling infrastructure for the entire Iraqi AI ecosystem

## What
A comprehensive Arabic input handling system with the following user-visible behaviors:
- Seamless Arabic keyboard input with automatic language detection
- Real-time text direction (RTL) management during input
- Intelligent composition event handling for complex Arabic input methods
- Immediate cultural appropriateness feedback during typing
- Unicode normalization (NFC) for consistent Arabic text storage
- Mixed Arabic-English input support with proper bidirectional text handling
- Input validation with Iraqi dialect recognition and cultural compliance checking

### Success Criteria
- [ ] Arabic keyboard input works flawlessly across Chrome, Firefox, Safari, Edge
- [ ] Composition events properly handled for all major Arabic IME systems
- [ ] Real-time cultural validation with 95%+ accuracy for Iraqi context
- [ ] Input processing latency <100ms, cultural validation <200ms
- [ ] Mixed Arabic-English input with correct bidirectional text rendering
- [ ] 100% WCAG 2.1 AA compliance for Arabic screen readers
- [ ] Zero input data loss during composition or validation processes
- [ ] Comprehensive test coverage with 90%+ code coverage

## All Needed Context

### Documentation & References (list all context needed to implement the feature)
```yaml
# MUST READ - Include these in your context window
- url: https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent
  why: Core composition event handling for IME support
  critical: "data property retrieval and event timing considerations"

- url: https://developer.mozilla.org/en-US/docs/Web/API/InputEvent  
  why: Input event handling and IME detection
  critical: "isComposing property for race condition handling"

- url: https://unicode.org/reports/tr15/
  why: Unicode normalization forms (NFC) for Arabic text consistency
  critical: "NFC normalization for Arabic character sequences"

- url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
  why: JavaScript Unicode normalization implementation
  critical: "NFC normalization for text comparison and storage"

- file: examples/phase3-reference-implementations/iraqi-arabic-nlp/src/pipeline/iraqi-arabic-nlp-pipeline.ts
  why: Existing Arabic processing pipeline patterns and cultural validation
  critical: "IraqiArabicNLPPipeline for dialect recognition and cultural context"

- file: examples/phase3-reference-implementations/iraqi-arabic-nlp/src/types/arabic-nlp-types.ts  
  why: Type definitions for Arabic input validation and cultural assessment
  critical: "ArabicNLPRequest/Response interfaces and cultural validation types"

- file: examples/rtl-support/arabic-components.tsx
  why: Existing RTL input component patterns and Arabic font handling
  critical: "ArabicInput component for RTL input patterns and font-arabic class usage"

- file: examples/onlook-extracted/collaboration-engine/tests/collaboration-engine.test.ts
  why: Testing patterns for Arabic text validation and cultural compliance
  critical: "Arabic dialect detection tests and cultural validation test structure"

- docfile: CLAUDE.md
  why: Iraqi AI system rules including cultural compliance and agent delegation requirements
  critical: "Agent delegation rules and cultural validation standards (95%+ compliance required)"
```

### Current Codebase tree (run `tree` in the root of the project) to get an overview of the codebase
```bash
aqlix-ai/
├── .claude/
│   ├── agents/
│   │   ├── arabic-rtl-processor.md
│   │   ├── iraqi-cultural-validator.md
│   │   └── iraqi-arabic-tester.md
├── examples/
│   ├── rtl-support/
│   │   └── arabic-components.tsx
│   ├── phase3-reference-implementations/
│   │   └── iraqi-arabic-nlp/
│   │       ├── src/
│   │       │   ├── pipeline/iraqi-arabic-nlp-pipeline.ts
│   │       │   └── types/arabic-nlp-types.ts
│   └── onlook-extracted/collaboration-engine/tests/
├── packages/
│   ├── ui/
│   ├── types/
│   └── arabic-nlp/
└── PRPs/
    ├── arabic-font-system.md
    └── arabic-text-processing.md
```

### Desired Codebase tree with files to be added and responsibility of file
```bash
packages/
├── arabic-input-handling/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ArabicInputField.tsx          # Main Arabic input component with composition handling
│   │   │   ├── ArabicTextArea.tsx           # Multi-line Arabic input component
│   │   │   ├── MixedLanguageInput.tsx       # Bilingual Arabic-English input component
│   │   │   └── InputLanguageToggle.tsx      # Language switching component
│   │   ├── hooks/
│   │   │   ├── useArabicInput.ts           # Core Arabic input handling hook
│   │   │   ├── useCompositionEvents.ts     # Composition event management
│   │   │   ├── useInputValidation.ts       # Real-time input validation
│   │   │   └── useCulturalValidation.ts    # Cultural appropriateness validation
│   │   ├── services/
│   │   │   ├── inputProcessor.ts           # Input processing and normalization
│   │   │   ├── compositionHandler.ts       # IME composition event handling
│   │   │   ├── validationService.ts        # Input validation service
│   │   │   └── culturalValidator.ts        # Cultural compliance validation
│   │   ├── utils/
│   │   │   ├── unicodeNormalization.ts     # Unicode NFC normalization utilities
│   │   │   ├── textDirection.ts            # RTL/LTR text direction utilities
│   │   │   ├── keyboardDetection.ts        # Arabic keyboard layout detection
│   │   │   └── inputSanitization.ts        # Input sanitization and security
│   │   ├── types/
│   │   │   ├── index.ts                    # Main types export
│   │   │   ├── inputTypes.ts               # Input-related type definitions
│   │   │   ├── validationTypes.ts          # Validation result types
│   │   │   └── compositionTypes.ts         # Composition event types
│   │   └── __tests__/
│   │       ├── components/                 # Component tests
│   │       ├── hooks/                      # Hook tests  
│   │       ├── services/                   # Service tests
│   │       └── utils/                      # Utility tests
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
```

### Known Gotchas of our codebase & Library Quirks
```typescript
// CRITICAL: Composition event timing issues across browsers
// Problem: compositionstart may fire after keydown, compositionend before keydown
// Solution: Use isComposing flag and async delays in compositionEnd handler

// CRITICAL: Unicode normalization required for Arabic text comparison
// Problem: Arabic characters can have multiple Unicode representations
// Solution: Always normalize with NFC before storage or comparison

// CRITICAL: RTL text direction changes during mixed input
// Problem: Cursor position calculation breaks with mixed Arabic-English
// Solution: Use unicodeBidi: 'embed' and track text segments separately

// CRITICAL: Iraqi dialect detection requires cultural context
// Problem: Standard Arabic vs Iraqi dialect validation accuracy
// Solution: Use existing IraqiArabicNLPPipeline with 85%+ confidence threshold

// CRITICAL: Agent delegation required for cultural validation
// Problem: Direct cultural validation bypasses cultural compliance rules
// Solution: MUST use Task tool to delegate to iraqi-cultural-validator agent

// CRITICAL: Font rendering issues with mixed Arabic fonts
// Problem: Font fallbacks cause inconsistent Arabic rendering
// Solution: Use font-arabic class with specific font stack from existing patterns

// CRITICAL: Performance targets must be maintained
// Problem: Real-time validation can cause input lag
// Solution: Input processing <100ms, cultural validation <200ms, use debouncing
```

## Implementation Blueprint

### Data models and structure

Create the core data models for Arabic input handling, ensuring type safety and cultural compliance.
```typescript
// Core input handling types
interface ArabicInputState {
  value: string;
  normalizedValue: string;
  isComposing: boolean;
  compositionData: string;
  textDirection: 'rtl' | 'ltr' | 'mixed';
  detectedLanguage: 'ar' | 'ar-IQ' | 'en' | 'mixed';
  validationState: InputValidationState;
  culturalCompliance: CulturalComplianceState;
}

interface InputValidationState {
  isValid: boolean;
  errors: InputValidationError[];
  warnings: InputValidationWarning[];
  suggestions: string[];
  dialectConfidence: number;
  validatedAt: Date;
}

interface CulturalComplianceState {
  complianceScore: number; // 0-100, must be >95 for Iraqi context
  islamicCompliance: number; // 0-100, must be >90
  appropriatenessLevel: 'appropriate' | 'questionable' | 'inappropriate';
  flaggedTerms: string[];
  recommendations: string[];
  validatedAt: Date;
}
```

### List of tasks to be completed to fulfill the PRP in the order they should be completed

```yaml
Task 1 - Setup Package Structure:
CREATE packages/arabic-input-handling/:
  - Initialize package.json with dependencies
  - Setup TypeScript configuration
  - Create src/ directory structure
  - Setup test configuration with Jest

Task 2 - Core Input Processing Service:
CREATE packages/arabic-input-handling/src/services/inputProcessor.ts:
  - MIRROR pattern from: examples/phase3-reference-implementations/iraqi-arabic-nlp/
  - IMPLEMENT text normalization using NFC
  - HANDLE mixed Arabic-English input detection
  - INTEGRATE with existing IraqiArabicNLPPipeline

Task 3 - Composition Event Handler:
CREATE packages/arabic-input-handling/src/services/compositionHandler.ts:
  - IMPLEMENT CompositionEvent handling with timing fixes
  - HANDLE race conditions between keydown/compositionend
  - TRACK isComposing state accurately
  - PRESERVE input data during composition

Task 4 - Cultural Validation Service:
CREATE packages/arabic-input-handling/src/services/culturalValidator.ts:
  - DELEGATE to iraqi-cultural-validator agent via Task tool
  - IMPLEMENT real-time cultural compliance checking
  - MAINTAIN 95%+ cultural appropriateness requirement
  - CACHE validation results for performance

Task 5 - Arabic Input Hook:
CREATE packages/arabic-input-handling/src/hooks/useArabicInput.ts:
  - COMBINE all input services into cohesive hook
  - MANAGE input state and composition events
  - IMPLEMENT performance optimization with debouncing
  - PROVIDE validation feedback interface

Task 6 - Arabic Input Components:
CREATE packages/arabic-input-handling/src/components/ArabicInputField.tsx:
  - MIRROR pattern from: examples/rtl-support/arabic-components.tsx
  - ENHANCE with composition event handling
  - INTEGRATE real-time validation feedback
  - MAINTAIN font-arabic class and RTL styling

Task 7 - Mixed Language Input Component:
CREATE packages/arabic-input-handling/src/components/MixedLanguageInput.tsx:
  - HANDLE bidirectional text input seamlessly
  - IMPLEMENT dynamic text direction switching
  - TRACK language segments for proper rendering
  - SUPPORT unicodeBidi: 'embed' for complex text

Task 8 - Utility Functions:
CREATE packages/arabic-input-handling/src/utils/:
  - IMPLEMENT Unicode normalization utilities
  - CREATE text direction detection functions
  - BUILD keyboard layout detection
  - DEVELOP input sanitization functions

Task 9 - Comprehensive Test Suite:
CREATE packages/arabic-input-handling/src/__tests__/:
  - MIRROR test patterns from: examples/onlook-extracted/collaboration-engine/tests/
  - TEST composition event handling scenarios
  - VALIDATE cultural compliance checking
  - BENCHMARK performance requirements
  - TEST cross-browser compatibility

Task 10 - Integration and Documentation:
INTEGRATE with existing packages:
  - EXPORT components from packages/ui/
  - ADD types to packages/types/
  - UPDATE package.json dependencies
  - CREATE comprehensive README with examples
```

### Per task pseudocode as needed added to each task

```typescript
// Task 2 - Input Processing Service
class InputProcessorService {
  async processInput(input: string, context: ArabicInputContext): Promise<ProcessedInput> {
    // PATTERN: Always normalize Arabic text first
    const normalized = input.normalize('NFC');
    
    // CRITICAL: Use existing NLP pipeline for dialect detection
    const nlpRequest: ArabicNLPRequest = {
      text: normalized,
      language: 'auto-detect',
      processingMode: 'dialect-only',
      culturalContext: context.culturalContext
    };
    
    // GOTCHA: Must maintain performance <100ms
    const startTime = Date.now();
    const nlpResult = await this.nlpPipeline.process(nlpRequest);
    const processingTime = Date.now() - startTime;
    
    if (processingTime > 100) {
      console.warn('Input processing exceeded 100ms target');
    }
    
    return {
      originalInput: input,
      normalizedInput: normalized,
      detectedLanguage: nlpResult.languageDetection.primaryLanguage,
      dialectAnalysis: nlpResult.dialectAnalysis,
      processingTime
    };
  }
}

// Task 3 - Composition Event Handler
class CompositionEventHandler {
  private compositionTimeout: number | null = null;
  
  handleCompositionStart(event: CompositionEvent): void {
    // PATTERN: Clear any pending timeouts
    if (this.compositionTimeout) {
      clearTimeout(this.compositionTimeout);
    }
    
    this.isComposing = true;
    this.compositionData = event.data || '';
    
    // CRITICAL: Notify input component of composition state
    this.notifyCompositionStateChange(true);
  }
  
  handleCompositionEnd(event: CompositionEvent): void {
    // GOTCHA: Race condition fix - use async delay
    this.compositionTimeout = window.setTimeout(() => {
      this.isComposing = false;
      this.finalizeComposition(event.data);
      this.notifyCompositionStateChange(false);
    }, 10); // Small delay to handle race conditions
  }
}

// Task 4 - Cultural Validation Service  
class CulturalValidationService {
  async validateCulturalCompliance(text: string): Promise<CulturalComplianceResult> {
    // CRITICAL: Must use Task tool to delegate to agent
    const agentRequest = {
      subagent_type: 'iraqi-cultural-validator',
      prompt: `Validate cultural appropriateness of this Arabic text: "${text}". 
               Return compliance score (0-100), islamic compliance score (0-100), 
               and any flagged terms or recommendations.`,
      description: 'Cultural validation for Arabic input'
    };
    
    // PATTERN: Cache validation results for performance
    const cacheKey = this.generateCacheKey(text);
    if (this.validationCache.has(cacheKey)) {
      return this.validationCache.get(cacheKey);
    }
    
    const startTime = Date.now();
    const result = await this.taskAgent.execute(agentRequest);
    const validationTime = Date.now() - startTime;
    
    // GOTCHA: Must maintain <200ms cultural validation target
    if (validationTime > 200) {
      console.warn('Cultural validation exceeded 200ms target');
    }
    
    const complianceResult = this.parseAgentResponse(result);
    this.validationCache.set(cacheKey, complianceResult);
    
    return complianceResult;
  }
}
```

### Integration Points
```yaml
ARABIC NLP PIPELINE:
  - integration: "Use existing IraqiArabicNLPPipeline from examples/phase3-reference-implementations/"
  - pattern: "Import and instantiate pipeline for dialect detection and cultural analysis"
  
CULTURAL VALIDATION AGENTS:
  - integration: "MUST use Task tool to delegate to iraqi-cultural-validator agent"
  - pattern: "Never do direct cultural validation - always delegate per CLAUDE.md rules"
  
UI COMPONENTS:
  - integration: "Export from packages/ui/ for use across applications"
  - pattern: "Follow existing component patterns from examples/rtl-support/"
  
FONT SYSTEM:
  - integration: "Use font-arabic class from existing Arabic font system"
  - pattern: "font-family: 'Noto Sans Arabic', 'Amiri', 'Cairo', sans-serif"
  
TESTING FRAMEWORK:
  - integration: "Use Jest testing patterns from existing collaboration tests"
  - pattern: "Follow test structure from examples/onlook-extracted/collaboration-engine/tests/"
```

## Validation Loop

### Level 1: Syntax & Style
```bash
# Run these FIRST - fix any errors before proceeding
cd packages/arabic-input-handling
bun run lint    # ESLint with Arabic-specific rules
bun run typecheck    # TypeScript type checking

# Expected: No errors. If errors, READ the error and fix.
```

### Level 2: Unit Tests each new feature/file/function use existing test patterns
```typescript
// CREATE comprehensive test suite following existing patterns
describe('Arabic Input Handling System', () => {
  describe('Input Processing', () => {
    test('should normalize Arabic input text using NFC', async () => {
      const input = 'أهلاً وسهلاً'; // Arabic greeting
      const processor = new InputProcessorService();
      const result = await processor.processInput(input, mockContext);
      
      expect(result.normalizedInput).toBe(input.normalize('NFC'));
      expect(result.processingTime).toBeLessThan(100);
    });

    test('should detect Iraqi dialect correctly', async () => {
      const iraqiText = 'شلونك؟ شكو ماكو؟'; // Iraqi greeting
      const processor = new InputProcessorService();
      const result = await processor.processInput(iraqiText, mockContext);
      
      expect(result.dialectAnalysis.detectedDialect).toBe('baghdadi');
      expect(result.dialectAnalysis.dialectConfidence).toBeGreaterThan(85);
    });

    test('should handle mixed Arabic-English input', async () => {
      const mixedText = 'Hello مرحبا world عالم';
      const processor = new InputProcessorService();
      const result = await processor.processInput(mixedText, mockContext);
      
      expect(result.detectedLanguage).toBe('mixed');
      expect(result.languageSegments).toHaveLength(4);
    });
  });

  describe('Composition Events', () => {
    test('should handle composition start correctly', () => {
      const handler = new CompositionEventHandler();
      const mockEvent = new CompositionEvent('compositionstart', { data: 'ا' });
      
      handler.handleCompositionStart(mockEvent);
      
      expect(handler.isComposing).toBe(true);
      expect(handler.compositionData).toBe('ا');
    });

    test('should handle composition end with race condition protection', async () => {
      const handler = new CompositionEventHandler();
      const mockEvent = new CompositionEvent('compositionend', { data: 'أهلاً' });
      
      handler.handleCompositionEnd(mockEvent);
      
      // Wait for async timeout handling
      await new Promise(resolve => setTimeout(resolve, 15));
      
      expect(handler.isComposing).toBe(false);
      expect(handler.finalizedText).toBe('أهلاً');
    });
  });

  describe('Cultural Validation', () => {
    test('should validate Islamic expressions positively', async () => {
      const islamicText = 'بسم الله الرحمن الرحيم';
      const validator = new CulturalValidationService();
      const result = await validator.validateCulturalCompliance(islamicText);
      
      expect(result.complianceScore).toBeGreaterThan(95);
      expect(result.islamicCompliance).toBeGreaterThan(90);
      expect(result.appropriatenessLevel).toBe('appropriate');
    });

    test('should complete validation within performance target', async () => {
      const testText = 'نص تجريبي للأداء';
      const validator = new CulturalValidationService();
      
      const startTime = Date.now();
      await validator.validateCulturalCompliance(testText);
      const validationTime = Date.now() - startTime;
      
      expect(validationTime).toBeLessThan(200);
    });
  });

  describe('Performance Requirements', () => {
    test('should maintain input processing performance targets', async () => {
      const longText = 'نص طويل للاختبار '.repeat(50);
      const processor = new InputProcessorService();
      
      const startTime = Date.now();
      const result = await processor.processInput(longText, mockContext);
      const processingTime = Date.now() - startTime;
      
      expect(processingTime).toBeLessThan(100);
      expect(result.processingTime).toBeLessThan(100);
    });
  });
});
```

```bash
# Run and iterate until passing:
cd packages/arabic-input-handling
bun test --coverage

# Coverage should be >90% for all files
# If failing: Read error, understand root cause, fix code, re-run
```

### Level 3: Integration Test
```bash
# Test with actual Arabic input components
cd packages/arabic-input-handling
bun run build

# Test component integration
bun run test:integration

# Manual browser testing checklist:
# 1. Open browser developer tools
# 2. Test Arabic keyboard input
# 3. Test composition events with Arabic IME
# 4. Verify real-time cultural validation
# 5. Test mixed Arabic-English input
# 6. Verify RTL text direction handling
# 7. Test across Chrome, Firefox, Safari, Edge

# Expected: All manual tests pass, no console errors
# If errors: Check browser console and network tab for details
```

## Final validation Checklist
- [ ] All unit tests pass: `bun test --coverage`
- [ ] No linting errors: `bun run lint`
- [ ] No type errors: `bun run typecheck`
- [ ] Cultural validation agent delegation works correctly
- [ ] Performance targets met: <100ms input, <200ms cultural validation
- [ ] Cross-browser compatibility verified (Chrome, Firefox, Safari, Edge)
- [ ] Arabic IME composition events handled correctly
- [ ] Real-time cultural compliance validation functional
- [ ] Mixed Arabic-English input works seamlessly
- [ ] WCAG 2.1 AA compliance verified with screen readers
- [ ] Font rendering consistent across browsers with font-arabic class
- [ ] Documentation complete with usage examples

---

## Anti-Patterns to Avoid
- ❌ Don't bypass cultural validation agent delegation (violates CLAUDE.md rules)
- ❌ Don't skip Unicode normalization for Arabic text (causes comparison failures)
- ❌ Don't ignore composition event timing issues (causes data loss)
- ❌ Don't hardcode Arabic text validation rules (use existing NLP pipeline)
- ❌ Don't exceed performance targets without optimization (affects user experience)
- ❌ Don't create new font handling when font-arabic class exists
- ❌ Don't implement direct cultural validation (must use agents)
- ❌ Don't ignore browser compatibility differences in composition events
- ❌ Don't skip accessibility testing for Arabic screen readers
- ❌ Don't cache cultural validation without expiration (context changes)

## Expected Implementation Confidence Score

**Confidence Level: 9/10**

**Reasoning:**
- ✅ Comprehensive research completed with existing codebase patterns identified
- ✅ Clear integration points with existing IraqiArabicNLPPipeline
- ✅ Detailed type definitions available from arabic-nlp-types.ts
- ✅ Testing patterns established from collaboration-engine tests
- ✅ Performance targets clearly defined and measurable
- ✅ Cultural validation delegation properly specified per CLAUDE.md
- ✅ Browser compatibility issues documented with solutions
- ✅ All critical gotchas identified and addressed
- ✅ Validation loop provides clear success criteria
- ⚠️ Minor risk: Composition event timing varies across browsers

**Success Factors:**
1. Existing Arabic processing infrastructure provides solid foundation
2. Clear performance targets with measurable validation
3. Comprehensive testing strategy with >90% coverage requirement
4. Cultural compliance properly delegated to specialized agents
5. Unicode normalization properly implemented with NFC
6. Integration points clearly defined with existing systems

This PRP provides sufficient context and validation loops for successful one-pass implementation.