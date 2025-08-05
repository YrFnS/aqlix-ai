# Examples Folder - Cleaned and Organized

**Last Updated**: August 2, 2025  
**Status**: ✅ **CLEANED** - Ready for superior repository extractions

This directory contains essential Iraqi cultural code and reference implementations, cleaned from duplicates and prepared for superior repository extractions.

## 📁 **CURRENT CLEAN STRUCTURE**

```
examples/
├── ✅ agent-zero-extracted/          # Document processing (KEEP + ENHANCE)
│   └── services/
│       └── iraqi_document_processor.py   # Arabic OCR + cultural validation
├── ✅ open-webui-extracted/          # Cultural layer only (BASE → LANGFLOW)
│   ├── middleware/
│   │   ├── cultural_validation.py       # Enhanced with content moderation
│   │   └── auth.py                      # Iraqi JWT context
│   └── utils/
│       └── iraqi_helpers.py             # Essential Iraqi utilities
├── ✅ professional-etiquette/        # Iraqi business context (KEEP)
│   └── iraqi-business-protocols.py
├── ✅ rtl-support/                   # Arabic language support (KEEP + ENHANCE)
│   ├── arabic-components.tsx
│   └── tts-optimization.py             # Merged from arabic-tts/
├── ✅ voice/                         # Voice processing (CONSOLIDATED)
│   ├── real-time-recorder.tsx          # Merged from voice-recording/
│   └── websocket-voice-handler.py      # Merged from voice-streaming/
├── ✅ main_agent_reference/          # PydanticAI patterns (KEEP)
│   ├── cli.py, models.py, providers.py...
└── ✅ testing_examples/              # Test patterns (KEEP + ENHANCE)
    ├── pytest.ini
    └── test_agent_patterns.py
```

## 🎯 Usage Strategy

### 1. Reference First
- Study extracted components to understand patterns and architecture
- Identify which components are needed for current features
- Understand compatibility levels and adaptation requirements

### 2. Selective Implementation
- Copy and adapt only what's needed for current sprint/feature
- Start with minimal implementations, then enhance
- Maintain clear separation between extracted reference and active code

### 3. Incremental Enhancement
- Begin with base functionality from extracted components
- Add Iraqi cultural features incrementally
- Test each enhancement before moving to next component

## 📊 Extraction Compatibility Matrix

| Component Category | Source | Compatibility | Iraqi Enhancement Level |
|-------------------|--------|---------------|----------------------|
| Database Models | Open WebUI | 95% direct reuse | High - Cultural fields added |
| FastAPI Routers | Open WebUI | 90% compatibility | Medium - Validation added |
| Document Processing | Agent Zero | 85% direct use | High - Arabic OCR added |
| Authentication | Open WebUI | 90% compatibility | High - Iraqi phone validation |
| UI Components | Open WebUI | 70% adaptable | High - RTL + cultural design |

## 🔧 Implementation Guidelines

### For Database Models (`open-webui-extracted/models/`)
```python
# ✅ Good: Selective import and enhancement
from examples.open_webui_extracted.models.users import UserModel as BaseUserModel

class IraqiUserModel(BaseUserModel):
    # Add Iraqi-specific fields
    profession: IraqiProfession
    dialect_preference: IraqiDialect
    cultural_settings: IraqiCulturalSettings
```

### For Services (`agent-zero-extracted/services/`)
```python
# ✅ Good: Inherit and enhance
from examples.agent_zero_extracted.services.document_processor import DocumentProcessor

class IraqiDocumentProcessor(DocumentProcessor):
    # Add Arabic OCR and cultural validation
    async def process_arabic_document(self, file_path: str):
        # Enhanced implementation
        pass
```

### For UI Components (Future)
```tsx
// ✅ Good: Extract patterns, rebuild with Iraqi design
// Study: examples/open-webui-extracted/components/Chat.svelte
// Implement: apps/web/src/components/chat/IraqiChatInterface.tsx
```

## 🚫 Anti-Patterns to Avoid

### ❌ Don't: Direct copy-paste into main app
```python
# Bad: Directly copying without understanding
cp examples/open-webui-extracted/models/* apps/api/src/models/
```

### ❌ Don't: Import examples in production code
```python
# Bad: Production code depending on examples
from examples.open_webui_extracted.models import UserModel
```

### ❌ Don't: Modify extracted examples
```python
# Bad: Editing the reference files
# examples/open-webui-extracted/models/users.py (modified)
```

## ✅ Correct Implementation Process

### Phase 1: Study and Plan
1. Read extracted component documentation
2. Identify minimal requirements for current feature
3. Plan Iraqi cultural enhancements needed
4. Create implementation plan

### Phase 2: Minimal Implementation
1. Create new file in appropriate `apps/` directory
2. Implement minimal functionality based on extracted patterns
3. Add basic Iraqi cultural requirements
4. Test minimal implementation

### Phase 3: Enhancement
1. Add advanced Iraqi features incrementally
2. Enhance based on extracted component capabilities
3. Test each enhancement
4. Document cultural adaptations

### Phase 4: Production Ready
1. Add comprehensive error handling
2. Add logging and monitoring
3. Add comprehensive tests including cultural validation
4. Add documentation

## 📝 Implementation Tracking

### Current Status: ✅ Extraction Complete
- [x] Open WebUI database models extracted
- [x] Open WebUI routers and middleware extracted  
- [x] Agent Zero document processing extracted
- [x] Iraqi cultural enhancements documented
- [x] Tailwind CSS patterns documented

### Next Steps: Implementation
- [ ] Create minimal user model implementation
- [ ] Create minimal authentication implementation
- [ ] Create minimal chat API implementation
- [ ] Create minimal document processing implementation
- [ ] Create minimal UI components

## 🔗 Related Documentation

- [`/references/`](../references/) - Original source repositories
- [`/PRPs/`](../PRPs/) - Product Requirement Prompts
- [`/project-context/`](../project-context/) - Project context and decisions
- [`/apps/`](../apps/) - Actual application implementations

## 💡 Key Principles

1. **Examples are Read-Only References** - Never modify extracted examples
2. **Selective Implementation** - Only implement what's needed now
3. **Iraqi Cultural First** - Every implementation includes cultural requirements
4. **Incremental Enhancement** - Start minimal, enhance iteratively
5. **Clear Separation** - Examples vs. implementations are separate
6. **Documentation Driven** - Document every adaptation and cultural enhancement