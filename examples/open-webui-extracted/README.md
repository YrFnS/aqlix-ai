# Open WebUI Extracted Components

**Source**: [open-webui/open-webui](https://github.com/open-webui/open-webui)  
**Extraction Date**: 2024-08-02  
**Compatibility**: 90-95% direct reuse with Iraqi enhancements  
**Status**: 🔄 **TO BE REPLACED WITH LANGFLOW** - Keep Cultural Layer Only

## 📋 Extracted Components

### Database Models (`models/`)

- **`users.py`** - User management with Iraqi profession and cultural settings
- **`chats.py`** - Chat conversations with Arabic RTL and cultural context
- **`files.py`** - File management with Arabic document processing metadata
- **`db.py`** - Database infrastructure with Baghdad timezone and Arabic support

**Compatibility**: 95% direct reuse  
**Iraqi Enhancements**: Professional domains, dialect preferences, cultural validation metadata

### API Routers (`routers/`)

- **`users.py`** - User registration, authentication, and profile management with Iraqi phone validation

**Compatibility**: 90% direct reuse  
**Iraqi Enhancements**: Cultural validation middleware, Arabic error messages, professional domain access control

### Middleware (`middleware/`)

- **`auth.py`** - JWT authentication with Iraqi cultural context and professional permissions
- **`cultural_validation.py`** - Islamic compliance and Iraqi cultural appropriateness validation

**Compatibility**: 90% adaptable  
**Iraqi Enhancements**: Cultural context in JWT tokens, Iraqi phone validation, professional domain permissions

### Database Infrastructure (`internal/`)

- **`db.py`** - PostgreSQL setup with Arabic text support and cultural configurations

**Compatibility**: 95% direct reuse  
**Iraqi Enhancements**: Baghdad timezone, Arabic text indexing, cultural metadata fields

### Utilities (`utils/`)

- **`iraqi_helpers.py`** - Comprehensive Iraqi cultural functions

**Compatibility**: 100% new (Iraqi-specific)  
**Features**: Dialect detection, business hours, payment validation, regional data, professional terminology

### Main Application (`main.py`)

- **`main.py`** - FastAPI application with Iraqi middleware stack

**Compatibility**: 90% Open WebUI patterns  
**Iraqi Enhancements**: Cultural headers, Arabic error handling, business hours integration

## 🎯 Implementation Strategy

### Immediate Use (95% Compatible)

```python
# Database models can be used almost directly
from examples.open_webui_extracted.models.users import UserModel
# Add Iraqi-specific fields as needed
```

### Adaptation Required (90% Compatible)

```python
# Routers need cultural validation integration
from examples.open_webui_extracted.routers.users import router
# Add cultural middleware and Arabic error handling
```

### Heavy Customization (70% Patterns)

```python
# Authentication needs Iraqi phone validation
from examples.open_webui_extracted.middleware.auth import create_access_token
# Enhance with cultural context and Iraqi phone support
```

## 📊 Iraqi Cultural Enhancements Added

### Professional Domains

- Legal (قانوني) - Iraqi law and judicial procedures
- Medical (طبي) - Healthcare system and medical practices
- Educational (تعليمي) - Education system and curricula
- Engineering (هندسي) - Engineering and construction
- Business (تجاري) - Business and commerce
- Government (حكومي) - Government services and procedures

### Dialect Support

- Iraqi (عراقي) - General Iraqi dialect
- Baghdadi (بغدادي) - Baghdad-specific dialect
- Basrawi (بصراوي) - Basra-specific dialect
- Kurdish-Arabic (كردي-عربي) - Kurdish-influenced Arabic
- Formal Arabic (عربي فصيح) - Standard Arabic

### Cultural Validation

- Islamic compliance checking
- Sectarian neutrality enforcement
- Political sensitivity detection
- Professional appropriateness validation
- Regional cultural awareness

### Business Context

- Baghdad timezone (Asia/Baghdad)
- Iraqi business hours (Sunday-Thursday)
- Prayer time awareness
- Ramadan period adjustments
- Friday holy day recognition

### Payment Systems

- ZainCash (1000 IQD minimum)
- FastPay (500 IQD minimum)
- NassWallet (1000 IQD minimum)
- Credit card (USD support)

## 🔧 Usage Examples

### User Model with Iraqi Features

```python
# Reference: examples/open-webui-extracted/models/users.py
class IraqiUser(BaseModel):
    # Open WebUI base fields
    id: str
    email: str
    name: str

    # Iraqi enhancements
    profession: IraqiProfession = IraqiProfession.OTHER
    dialect_preference: IraqiDialect = IraqiDialect.IRAQI
    cultural_settings: IraqiCulturalSettings
    phone: str  # Iraqi phone validation
    region: IraqiRegion = IraqiRegion.BAGHDAD
```

### Authentication with Cultural Context

```python
# Reference: examples/open-webui-extracted/middleware/auth.py
def create_iraqi_access_token(user: UserModel) -> str:
    payload = {
        # Open WebUI standard fields
        "sub": user.id,
        "email": user.email,

        # Iraqi cultural context
        "profession": user.profession.value,
        "dialect": user.dialect_preference.value,
        "cultural_context": {
            "islamic_compliance": user.cultural_settings.islamic_compliance_level,
            "regional_context": user.region.value,
            "business_hours_aware": True
        }
    }
```

### Cultural Validation Middleware

```python
# Reference: examples/open-webui-extracted/middleware/cultural_validation.py
async def validate_content_cultural(content: str, context: CulturalContext):
    validation_result = {
        "islamic_compliance": check_islamic_compliance(content),
        "sectarian_neutrality": check_sectarian_neutrality(content),
        "political_sensitivity": check_political_sensitivity(content),
        "professional_appropriateness": check_professional_context(content, context),
        "overall_score": calculate_cultural_score(content, context)
    }
```

## 🚀 Replacement Strategy

### ⚠️ **IMPORTANT: Base Infrastructure to be Replaced with Langflow**

**Keep Only Cultural Components**:

- ✅ `middleware/cultural_validation.py` - Islamic compliance logic
- ✅ `utils/iraqi_helpers.py` - Iraqi-specific functions
- ✅ Cultural enhancements in models (profession, dialect, regional settings)

**Replace Infrastructure with Langflow**:

- 🔄 `models/` → Langflow enterprise models (8 models → 8 enterprise models)
- 🔄 `routers/users.py` → Langflow complete API system (1 router → 13 routers)
- 🔄 `main.py` → Langflow enterprise FastAPI architecture
- 🔄 `internal/db.py` → Langflow database infrastructure

**Langflow Advantages**:

- **13 complete routers** vs our 1 basic router
- **Enterprise-grade architecture** vs basic FastAPI patterns
- **Complete React frontend** vs no frontend
- **Flow management system** vs basic CRUD
- **27-38 weeks value** vs 15-20 weeks value

### Next Steps:

1. **Extract Langflow complete system** - Foundation replacement
2. **Migrate cultural enhancements** - Apply Iraqi features to Langflow base
3. **Test cultural compatibility** - Ensure Islamic compliance preserved

## ⚠️ Important Notes

- **These are reference implementations** - Do not import directly in production
- **Study patterns first** - Understand the architecture before implementing
- **Iraqi features are additions** - Base Open WebUI functionality is preserved
- **Test cultural features** - All Iraqi enhancements need comprehensive testing
- **Maintain compatibility** - Keep alignment with Open WebUI patterns for future updates
