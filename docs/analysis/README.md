# Reference Repositories

This folder contains external repositories used as references for component extraction and architectural inspiration for the Iraqi AI Chat System.

## 📁 Repository Structure

```
references/
├── agent-zero/           # Agent orchestration framework
├── open-webui/          # Chat UI and user management system
├── extraction-plan.md   # Component extraction strategy
└── README.md           # This file
```

## 🎯 Purpose

These repositories serve as **templates and component libraries** for:

1. **UI Components**: Chat interfaces, user management, file upload
2. **Backend Patterns**: API design, database models, authentication
3. **Agent Systems**: Multi-agent orchestration, memory management
4. **Architecture Inspiration**: Real-time communication, deployment patterns

## 🔧 Usage Strategy

### Component Extraction Workflow
1. **Analyze** → Study relevant components and patterns
2. **Extract** → Copy useful code patterns and adapt to React/Next.js
3. **Adapt** → Modify for Iraqi-specific requirements
4. **Integrate** → Implement within our custom architecture

### Key Focus Areas

#### From Open WebUI:
- Chat UI components → Adapt from Svelte to React
- User management database models
- File upload and management systems
- Real-time messaging patterns
- Authentication and session handling

#### From Agent Zero:
- Agent orchestration patterns → Integrate with PydanticAI
- Memory management architecture
- Tool framework and extensions
- Dynamic prompt management
- Multi-agent coordination systems

## ⚠️ Important Notes

- **These are reference materials only** - not part of our main application
- **Adapt, don't copy directly** - customize for Iraqi requirements
- **Maintain our chosen tech stack** - Next.js 15+, PydanticAI, PostgreSQL
- **Follow our Context Engineering methodology** throughout extraction

## 🔗 Integration Points

Extracted components will integrate with:
- Our Iraqi-specific features (dialect, culture, professional domains)
- Custom authentication and payment systems (ZainCash, FastPay)
- Arabic RTL support and text processing
- Professional knowledge base and document generation

## 📋 Next Steps

1. Create detailed component extraction plan
2. Map Open WebUI components to React equivalents
3. Integrate Agent Zero patterns with PydanticAI
4. Document adaptation strategies for each component
5. Plan integration timeline with main development phases