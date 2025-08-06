# Iraqi Technical Solutions Knowledge Base

## Arabic RTL Processing Solutions

### Proven RTL Layout Patterns
```css
/* Iraqi-tested RTL container pattern */
.iraqi-rtl-container {
  direction: rtl;
  text-align: right;
  font-family: 'Arabic UI Display', 'SF Pro Display', system-ui;
}

/* Mixed content handling */
.mixed-content {
  unicode-bidi: plaintext;
  text-align: start;
}
```

### Iraqi Dialect Recognition Patterns
- **Common Iraqi Greetings**: شلونك، أهلين، مرحبا
- **Professional Contexts**: تسلم، ماشكور، بارك الله فيك
- **Informal Patterns**: شكو ماكو، وين رايح، شلون الحال

### Font Selection Hierarchy
1. **Primary**: Noto Sans Arabic (best RTL support)
2. **Secondary**: Cairo, Amiri (traditional Arabic)
3. **Fallback**: system-ui, sans-serif

## Payment Gateway Integration Solutions

### ZainCash Integration Best Practices
```python
# Proven ZainCash configuration
ZAINCASH_CONFIG = {
    "min_amount": 1000,  # IQD
    "currency": "IQD",
    "timeout": 30,  # seconds
    "retry_attempts": 3
}
```

### FastPay Integration Pattern
- Minimum: 500 IQD
- Optimal timeout: 25 seconds
- Error handling: Exponential backoff

### NassWallet Configuration
- Minimum: 1000 IQD
- Session timeout: 10 minutes
- Cultural note: Popular with younger users

## PydanticAI Iraqi Context Implementation

### Dependency Injection Pattern
```python
@dataclass
class IraqiAgentDependencies:
    api_key: str
    cultural_context: str = "iraqi"
    language: str = "arabic"
    professional_domain: str = "general"
    islamic_compliance: bool = True
```

### Cultural Prompt Patterns
```python
IRAQI_SYSTEM_PROMPT = """You are an AI assistant for Iraqi users.
- Respect Islamic values and Iraqi customs
- Use appropriate Iraqi dialect when speaking Arabic
- Apply professional Iraqi honorifics correctly
- Maintain political neutrality on sensitive topics
"""
```

## Performance Optimization Decisions

### Arabic Text Processing Optimization
- Use Unicode normalization (NFC) for Arabic text
- Implement caching for dialect recognition results
- Optimize RTL layout calculations for mobile devices

### Infrastructure Decisions
- **Timezone**: Asia/Baghdad (UTC+3)
- **Currency**: Iraqi Dinar (IQD) primary, USD secondary
- **Network Optimization**: Account for Iraqi internet infrastructure variations

## Error Handling Patterns

### Cultural Error Messages
```javascript
const IRAQI_ERROR_MESSAGES = {
  ar: {
    payment_failed: "عذراً، فشلت عملية الدفع. يرجى المحاولة مرة أخرى",
    network_error: "مشكلة في الاتصال. يرجى التحقق من الإنترنnet",
    validation_error: "يرجى التحقق من المعلومات المدخلة"
  },
  en: {
    payment_failed: "Payment failed. Please try again",
    network_error: "Connection issue. Please check your internet",
    validation_error: "Please verify the entered information"
  }
}
```

## 2025 Tech Stack Integration

### Bun + Drizzle + SQLAlchemy Stack
```bash
# Bun commands (30x faster than npm)
bun install --legacy-peer-deps  # Handle React 19 compatibility
bun run dev    # Start development with Bun runtime
bun test       # Built-in test runner
```

### Drizzle ORM Pattern (Frontend)
```typescript
// 100x faster than Prisma, SQL-first approach
import { pgTable, serial, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  profession: text('profession'), // Iraqi-specific
  preferences: jsonb('preferences'), // RTL, cultural settings
  createdAt: timestamp('created_at').defaultNow(),
});
```

### SQLAlchemy 2.0 Async Pattern (Backend)
```python
# Production-ready async patterns
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import declarative_base

class IraqiUserModel(Base):
    __tablename__ = "users"
    profession = Column(String)  # Iraqi professional domain
    preferences = Column(JSON)   # Cultural settings
```

### Custom Iraqi Components
```typescript
// Use 44 custom components from examples/dyad-extracted/
import { Button } from '@/components/ui/button';

<Button cultural="iraqi" dir="rtl" className="font-arabic">
  إرسال الرسالة
</Button>
```

## Recent Technical Decisions
- Date: 2025-08-05 - Updated entire tech stack to Bun + Drizzle + SQLAlchemy 2.0
- Decision: Replace shadcn/ui with 44 custom Iraqi-enhanced components
- Performance: 30x faster installs (Bun), 100x faster queries (Drizzle)
- Decision: Use project-context structure for agent knowledge sharing