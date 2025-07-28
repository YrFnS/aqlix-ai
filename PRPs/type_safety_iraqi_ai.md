---
name: "Iraqi AI Chat System - Comprehensive Type Safety PRP"
description: "Complete type safety implementation with TypeScript strict mode, Zod validation, Pydantic integration, Arabic RTL support, and Iraqi professional domain types"
confidence_score: 8.5
---

## Purpose

**Comprehensive Type Safety Architecture** for the Iraqi AI Chat System implementing TypeScript 5.6+ strict mode, Zod runtime validation, Pydantic backend integration, cross-platform compatibility, Arabic RTL text handling, and Iraqi professional domain types with cultural context validation.

## Core Principles

1. **Zero `any` Types**: Strict TypeScript configuration with complete type coverage
2. **Runtime Validation**: Zod schemas for all user inputs and API boundaries
3. **Cross-Platform Safety**: Shared types between Next.js web and React Native mobile
4. **Cultural Type Safety**: Iraqi-specific validation for professional domains and cultural appropriateness
5. **Performance-First**: Optimized type validation with minimal runtime overhead

## Goal

**Establish production-ready type safety** across the entire Iraqi AI Chat System with comprehensive TypeScript types, runtime validation, Arabic text handling, Iraqi professional domain support, and automated type generation between frontend and backend systems.

## Why

The Iraqi AI Chat System requires robust type safety to:
- Prevent runtime errors in Arabic text processing and RTL layouts
- Ensure cultural appropriateness through type-level validation
- Maintain consistency across web and mobile platforms
- Validate professional domain queries with Iraqi context
- Protect against injection attacks through strict input validation
- Enable confident refactoring and feature development

## Research Findings

### Existing Codebase Patterns Identified

**Arabic RTL Component Types** (`examples/rtl-support/arabic-components.tsx`):
```typescript
interface ArabicTextProps {
  children: string;
  className?: string;
  variant?: 'body' | 'heading' | 'caption';
}

interface MixedContentProps {
  children: React.ReactNode;
  primaryLanguage: 'arabic' | 'english';
  className?: string;
}
```

**Chat System Types** (`examples/chat/basic-chat-interface.tsx`):
```typescript
interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  language: 'arabic' | 'english' | 'mixed';
}
```

**Pydantic Model Patterns** (`examples/main_agent_reference/models.py`):
```python
class ResearchQuery(BaseModel):
    """Model for research query requests."""
    query: str = Field(..., description="Research topic to investigate")
    max_results: int = Field(10, ge=1, le=50, description="Maximum number of results")
    include_summary: bool = Field(True, description="Whether to include AI summary")
```

### 2025 External Best Practices

**TypeScript 5.6+ Strict Configuration**:
- **Strict Mode**: `"strict": true` enables comprehensive type checking
- **Project References**: Monorepo support with incremental builds
- **Module Resolution**: `"moduleResolution": "NodeNext"` for modern imports
- **Performance**: Up to 10x faster import times with optimized configs

**Zod 3.24+ Integration Patterns**:
- **Type Inference**: `z.infer<typeof Schema>` for automatic TypeScript types
- **Safe Parsing**: `.safeParse()` eliminates try/catch error handling
- **Custom Validation**: `.refine()` for complex business logic validation
- **Chaining**: Method chaining for readable validation rules

**Pydantic v2.9+ Features**:
- **Performance**: 10x improvement in import times and memory allocation
- **TypeScript Generation**: `pydantic-to-typescript` for automatic type generation
- **Field Validation**: `@field_validator` decorator for custom validation
- **FastAPI Integration**: Automatic API validation and documentation

**Cross-Platform Monorepo Patterns**:
- **Solito**: Navigation sharing between React Native and Next.js
- **Turborepo**: Optimized build system for monorepo development
- **Workspace Structure**: `apps/` and `packages/` separation for shared code

## Architecture Design

### Type System Hierarchy

```
packages/types/
├── core/
│   ├── language.ts          # Language and RTL direction types
│   ├── cultural.ts          # Iraqi cultural context types
│   └── professional.ts     # Iraqi professional domain types
├── ui/
│   ├── components.ts        # Cross-platform component prop types
│   ├── forms.ts            # Form validation types
│   └── layout.ts           # RTL layout and styling types
├── api/
│   ├── requests.ts         # API request types
│   ├── responses.ts        # API response types
│   └── errors.ts           # Error handling types
├── chat/
│   ├── messages.ts         # Chat system types
│   ├── agents.ts           # AI agent types
│   └── sessions.ts         # Session management types
└── generated/
    ├── pydantic.ts         # Auto-generated from Pydantic models
    └── schemas.ts          # Auto-generated Zod schemas
```

### Integration Architecture

```
Frontend (TypeScript) ←→ Zod Schemas ←→ API ←→ Pydantic Models ←→ Backend (Python)
        ↓                      ↓                    ↓
   React Components    Runtime Validation    Type Safety    Database Models
        ↓                      ↓                    ↓
   Arabic RTL UI      Cultural Validation    Iraqi Context    Professional Data
```

## Implementation Blueprint

### Phase 1: TypeScript Foundation Setup

#### Task 1.1: Configure Strict TypeScript
```typescript
// tsconfig.base.json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "baseUrl": ".",
    "paths": {
      "@iraqi-ai/types/*": ["packages/types/src/*"],
      "@iraqi-ai/ui/*": ["packages/ui/src/*"],
      "@iraqi-ai/validation/*": ["packages/validation/src/*"]
    },
    "composite": true,
    "incremental": true,
    "declaration": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

#### Task 1.2: Create Core Language Types
```typescript
// packages/types/src/core/language.ts
export type Language = 'arabic' | 'english';
export type Direction = 'rtl' | 'ltr';
export type TextAlignment = 'right' | 'left' | 'center';

export interface LanguageConfig {
  language: Language;
  direction: Direction;
  alignment: TextAlignment;
  fontFamily: string;
}

export interface MultilingualText {
  arabic?: string;
  english?: string;
  primary: Language;
}
```

#### Task 1.3: Define Iraqi Professional Domain Types
```typescript
// packages/types/src/core/professional.ts
export type ProfessionalDomain = 'legal' | 'medical' | 'educational' | 'engineering' | 'general';

export interface IraqiLegalContext {
  domain: 'legal';
  lawType: 'civil' | 'criminal' | 'commercial' | 'family';
  disclaimer: boolean;
  confidentialityLevel: 'public' | 'sensitive' | 'confidential';
}

export interface IraqiMedicalContext {
  domain: 'medical';
  specialty: 'general' | 'cardiology' | 'pediatrics' | 'surgery';
  disclaimer: boolean;
  emergencyContact: boolean;
}

export type IraqiProfessionalContext = IraqiLegalContext | IraqiMedicalContext;
```

### Phase 2: Cultural Context Validation Types

#### Task 2.1: Cultural Sensitivity Types
```typescript
// packages/types/src/core/cultural.ts
export interface CulturalSensitivity {
  politicalContent: 'safe' | 'warning' | 'blocked';
  religiousCompliance: 'compliant' | 'review' | 'non-compliant';
  sectarianContent: 'neutral' | 'sensitive' | 'inappropriate';
  culturalAppropriatenessScore: number; // 0-1
}

export interface RegionalContext {
  region: 'baghdad' | 'basra' | 'erbil' | 'najaf' | 'mosul' | 'other';
  dialect: 'iraqi-arabic' | 'kurdish' | 'standard-arabic';
  culturalNorms: string[];
}
```

#### Task 2.2: Form Validation Types
```typescript
// packages/types/src/ui/forms.ts
import { z } from 'zod';

export const ArabicTextSchema = z.string()
  .min(1, 'النص مطلوب')
  .max(1000, 'النص طويل جداً')
  .refine((text) => /[\u0600-\u06FF]/.test(text), {
    message: 'يجب أن يحتوي النص على أحرف عربية'
  });

export const ProfessionalQuerySchema = z.object({
  query: ArabicTextSchema,
  domain: z.enum(['legal', 'medical', 'educational', 'engineering', 'general']),
  language: z.enum(['arabic', 'english']),
  urgency: z.enum(['low', 'medium', 'high'])
});

export type ProfessionalQuery = z.infer<typeof ProfessionalQuerySchema>;
```

### Phase 3: Chat System Type Implementation

#### Task 3.1: Enhanced Chat Message Types
```typescript
// packages/types/src/chat/messages.ts
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  language: Language;
  culturalContext?: CulturalSensitivity;
  professionalContext?: IraqiProfessionalContext;
  metadata: {
    tokenCount: number;
    processingTime: number;
    confidence: number;
  };
}

export interface AgentResponse {
  messageId: string;
  content: MultilingualText;
  culturalValidation: CulturalSensitivity;
  professionalAdvice?: {
    domain: ProfessionalDomain;
    disclaimer: string;
    confidence: number;
  };
  followUpSuggestions: string[];
}
```

#### Task 3.2: Session Management Types
```typescript
// packages/types/src/chat/sessions.ts
export interface SessionState {
  id: string;
  userId?: string; // Optional for privacy
  createdAt: Date;
  expiresAt: Date; // 1 hour auto-expire
  language: Language;
  professionalContext?: IraqiProfessionalContext;
  culturalPreferences: RegionalContext;
  messageCount: number;
  tokenUsage: number;
}
```

### Phase 4: API Integration Types

#### Task 4.1: Request/Response Types
```typescript
// packages/types/src/api/requests.ts
export interface ChatRequest {
  message: string;
  sessionId: string;
  language: Language;
  professionalDomain?: ProfessionalDomain;
}

export interface ValidationError {
  field: string;
  message: string;
  code: 'INVALID_ARABIC' | 'CULTURAL_VIOLATION' | 'PROFESSIONAL_BOUNDARY';
  suggestion?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
  culturalWarnings?: string[];
}
```

### Phase 5: Pydantic Backend Integration

#### Task 5.1: Pydantic Models with TypeScript Generation
```python
# apps/api/src/models/chat.py
from pydantic import BaseModel, Field, field_validator
from typing import Literal, Optional
from datetime import datetime

class ChatMessageModel(BaseModel):
    """Chat message with Iraqi cultural context."""
    
    id: str = Field(..., description="Unique message identifier")
    content: str = Field(..., min_length=1, max_length=1000)
    sender: Literal['user', 'assistant']
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    language: Literal['arabic', 'english']
    
    @field_validator('content')
    @classmethod
    def validate_content(cls, v: str) -> str:
        """Validate content for Arabic text and cultural appropriateness."""
        if not v.strip():
            raise ValueError('Content cannot be empty')
        # Add Iraqi cultural validation logic here
        return v

class ProfessionalQueryModel(BaseModel):
    """Professional query with Iraqi domain context."""
    
    query: str = Field(..., min_length=1, max_length=500)
    domain: Literal['legal', 'medical', 'educational', 'engineering', 'general']
    language: Literal['arabic', 'english']
    urgency: Literal['low', 'medium', 'high'] = 'medium'
    
    @field_validator('query')
    @classmethod
    def validate_iraqi_context(cls, v: str) -> str:
        """Validate query for Iraqi professional appropriateness."""
        # Implement Iraqi professional validation
        return v
```

#### Task 5.2: Automatic TypeScript Generation Setup
```bash
# scripts/generate-types.sh
#!/bin/bash

# Generate TypeScript types from Pydantic models
cd apps/api
python -m pydantic_to_typescript --module src.models.chat --output ../../packages/types/src/generated/pydantic.ts

# Generate Zod schemas from TypeScript types
cd ../../packages/validation
npm run generate:schemas
```

### Phase 6: Cross-Platform Component Types

#### Task 6.1: Arabic Component Props
```typescript
// packages/types/src/ui/components.ts
export interface ArabicTextProps {
  children: string;
  language: Language;
  variant?: 'body' | 'heading' | 'caption';
  culturalSensitive?: boolean;
  className?: string;
}

export interface ArabicInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: MultilingualText;
  validation?: z.ZodSchema;
  culturalFilter?: boolean;
  professionalDomain?: ProfessionalDomain;
}

export interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
  language: Language;
  culturalContext: RegionalContext;
  professionalMode?: ProfessionalDomain;
}
```

### Phase 7: Error Handling & Validation

#### Task 7.1: Comprehensive Error Types
```typescript
// packages/types/src/api/errors.ts
export type ErrorCode = 
  | 'INVALID_ARABIC_TEXT'
  | 'CULTURAL_VIOLATION'
  | 'PROFESSIONAL_BOUNDARY'
  | 'RATE_LIMIT_EXCEEDED'
  | 'SESSION_EXPIRED'
  | 'CONTENT_TOO_LONG';

export interface TypedError {
  code: ErrorCode;
  message: MultilingualText;
  field?: string;
  suggestion?: MultilingualText;
  culturalGuidance?: string;
}

export class IraqiValidationError extends Error {
  constructor(
    public code: ErrorCode,
    public arabicMessage: string,
    public englishMessage: string,
    public field?: string
  ) {
    super(englishMessage);
    this.name = 'IraqiValidationError';
  }
}
```

## Validation Gates

### Phase 1 Validation: TypeScript Configuration
```bash
# TypeScript strict mode compilation
npx tsc --noEmit --project tsconfig.base.json
npx tsc --noEmit --project packages/types/tsconfig.json
npx tsc --noEmit --project apps/web/tsconfig.json

# Zero TypeScript errors required
echo "TypeScript compilation must pass with zero errors"
```

### Phase 2 Validation: Type Safety Testing
```bash
# Type-level tests
npm run test:types
npx jest packages/types/**/*.test.ts --passWithNoTests

# Ensure no 'any' types in codebase
npx tsc --noEmit --strict --noImplicitAny packages/types/src/**/*.ts
```

### Phase 3 Validation: Zod Schema Testing
```bash
# Runtime validation tests
npm run test:validation
npx jest packages/validation/**/*.test.ts

# Arabic text validation tests
npm run test:arabic-validation
npx jest --testPathPattern="arabic.*test"
```

### Phase 4 Validation: Cultural Appropriateness Testing
```bash
# Cultural validation tests
npm run test:cultural
npx jest packages/cultural-validation/**/*.test.ts

# Iraqi professional domain tests
npm run test:professional-domains
npx jest --testPathPattern="professional.*test"
```

### Phase 5 Validation: Pydantic Integration
```bash
# Backend model validation
cd apps/api && python -m pytest tests/test_models.py -v

# TypeScript generation validation
npm run generate:types
git diff --exit-code packages/types/src/generated/

# FastAPI schema validation
cd apps/api && python -c "from src.main import app; print('FastAPI schema validation passed')"
```

### Phase 6 Validation: Cross-Platform Compatibility
```bash
# React Native compatibility test
cd apps/mobile && npx tsc --noEmit

# Next.js build test
cd apps/web && npm run build

# Shared package imports test
npm run test:cross-platform
```

### Final Validation: End-to-End Type Safety
```bash
# Full monorepo type checking
npm run typecheck:all

# Build all applications
npm run build:all

# Run comprehensive test suite
npm run test:all

# Validate Arabic RTL rendering
npm run test:rtl

# Performance impact assessment
npm run test:performance-types

echo "✅ All type safety validation gates passed"
```

## Iraqi-Specific Requirements

### Cultural Context Implementation
- **Political Neutrality**: Types must enforce content filtering for political topics
- **Religious Compliance**: Islamic values validation through type constraints
- **Regional Sensitivity**: Support for Iraqi regional dialects and customs
- **Professional Ethics**: Type-level enforcement of professional advice boundaries

### Arabic Text Handling
- **RTL Direction**: All text components must support right-to-left layouts
- **Font Families**: Type-safe font family selection for Arabic text
- **Input Validation**: Zod schemas for Arabic text pattern validation
- **Mixed Content**: Support for Arabic-English mixed text with proper alignment

### Professional Domain Types
- **Legal Domain**: Iraqi civil law, commercial law, family law context types
- **Medical Domain**: Iraqi healthcare system and terminology types
- **Educational Domain**: Iraqi curriculum and teaching method types
- **Engineering Domain**: Iraqi building codes and safety regulation types

## Performance & Security Considerations

### Type Validation Performance
- **Lazy Loading**: Type definitions loaded on-demand for better performance
- **Caching**: Validation results cached for repeated operations
- **Bundle Optimization**: Tree-shaking for unused type definitions
- **Runtime Impact**: Zod validation optimized for minimal overhead

### Security Through Types
- **Input Sanitization**: Type-level validation prevents injection attacks
- **Cultural Filtering**: Automatic filtering of sensitive content through types
- **Professional Boundaries**: Type enforcement of advice limitations
- **Session Security**: Type-safe session management with auto-expiry

## Documentation References

### Official Documentation
- **TypeScript Strict Mode**: https://www.typescriptlang.org/tsconfig/strict.html
- **Zod Schema Validation**: https://zod.dev/
- **Pydantic v2 Documentation**: https://docs.pydantic.dev/latest/
- **TypeScript Monorepo Management**: https://nx.dev/blog/managing-ts-packages-in-monorepos

### Integration Guides
- **React Native + Next.js Types**: Cross-platform development patterns
- **FastAPI + Pydantic Integration**: Backend type safety implementation
- **Pydantic to TypeScript**: https://pypi.org/project/pydantic-to-typescript/
- **Arabic RTL Development**: Unicode and RTL text handling patterns

### Codebase References
- `examples/rtl-support/arabic-components.tsx` - Arabic component type patterns
- `examples/chat/basic-chat-interface.tsx` - Chat system type implementations
- `examples/main_agent_reference/models.py` - Pydantic model best practices
- `examples/main_agent_reference/settings.py` - Configuration type patterns
- `PRPs/monorepo_setup.md` - Monorepo structure and setup patterns

## Critical Gotchas & Solutions

### 1. Arabic Text Validation Complexity
**Problem**: Different input methods create inconsistent Arabic text encoding
**Solution**: Normalize Arabic text through Zod preprocessing and validate Unicode ranges

### 2. Cross-Platform Type Compatibility
**Problem**: React Native and Next.js have different type requirements
**Solution**: Use conditional types and platform-specific type exports

### 3. Pydantic-TypeScript Sync Issues
**Problem**: Manual synchronization between Python models and TypeScript types
**Solution**: Automated generation pipeline with CI/CD integration

### 4. Cultural Validation Performance
**Problem**: Complex cultural validation rules impact performance
**Solution**: Tiered validation with caching and lazy evaluation

### 5. Professional Domain Type Accuracy
**Problem**: Iraqi professional domains have specific terminology and requirements
**Solution**: Expert consultation and comprehensive test coverage for domain types

## Success Criteria

1. **Zero TypeScript Errors**: All code compiles with strict mode enabled
2. **Runtime Validation**: All user inputs validated through Zod schemas
3. **Cultural Compliance**: 100% cultural appropriateness test coverage
4. **Cross-Platform Compatibility**: Types work identically on web and mobile
5. **Performance Impact**: <5% performance overhead from type validation
6. **Professional Accuracy**: All Iraqi professional domain types validated by experts
7. **Security**: Zero injection vulnerabilities through type safety
8. **Maintainability**: Type system supports confident refactoring and feature development

## Completion Checklist

- [ ] TypeScript strict mode configured across monorepo
- [ ] Core language and RTL types implemented
- [ ] Iraqi professional domain types created
- [ ] Cultural context validation types added
- [ ] Chat system types with Iraqi context
- [ ] Zod schemas for all user inputs
- [ ] Pydantic models with TypeScript generation
- [ ] Cross-platform component prop types
- [ ] API request/response types
- [ ] Comprehensive error handling types
- [ ] All validation gates passing
- [ ] Performance benchmarks met
- [ ] Cultural appropriateness validated
- [ ] Cross-platform compatibility confirmed
- [ ] Documentation updated

**Estimated Implementation Time**: 5-7 days for comprehensive type safety system
**Confidence Score**: 8.5/10 for one-pass implementation success