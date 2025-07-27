# Monorepo Structure - Iraqi AI Chat System

This example demonstrates the monorepo setup pattern for the Iraqi AI Chat System with cross-platform support.

## Structure

```
/
├── apps/
│   ├── web/                    # Next.js 15+ web application
│   ├── mobile/                 # React Native app (future)
│   └── api/                    # Python FastAPI backend
│       ├── agents/             # PydanticAI agent modules
│       ├── routes/             # FastAPI route handlers
│       └── services/           # Business logic services
├── packages/                   # Shared between web & mobile
│   ├── ui/                     # Shared UI components
│   ├── types/                  # TypeScript types
│   ├── features/              # Shared business logic
│   ├── api-client/            # API client logic
│   └── arabic-nlp/            # Arabic processing logic
├── services/                   # Microservices
├── data/                      # Knowledge base
└── examples/                  # Reference implementations
```

## Key Features

- **Cross-platform**: Shared business logic between web and mobile
- **Arabic RTL Support**: Comprehensive Arabic text handling
- **PydanticAI Integration**: AI agents with Iraqi cultural context
- **Type Safety**: Strict TypeScript across all packages
- **Iraqi Context**: Cultural appropriateness and professional domains

## Development Commands

```bash
# Install dependencies
npm install

# Start development (web + api)
npm run dev

# Start specific apps
npm run dev:web
npm run dev:api

# Build all apps
npm run build

# Run tests
npm run test

# Type checking
npm run typecheck

# Lint all code
npm run lint
```

## Package Management

- **npm workspaces** for JavaScript/TypeScript packages
- **Python virtual environments** for backend development
- **Shared configurations** for ESLint, Prettier, TypeScript

## Cross-Platform Considerations

- Shared business logic in `packages/features/`
- Common UI components in `packages/ui/`
- Unified API client in `packages/api-client/`
- Arabic NLP utilities in `packages/arabic-nlp/`
- Cross-platform TypeScript types in `packages/types/`