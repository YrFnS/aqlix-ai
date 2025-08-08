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

### Bun + Supabase + MCP Integration Stack
```bash
# Bun commands (30x faster than npm)
bun install --legacy-peer-deps  # Handle React 19 compatibility
bun run dev    # Start development with Bun runtime
bun test       # Built-in test runner
```

### Supabase Integration Pattern (Frontend & Backend)
```typescript
// Modern BaaS approach with real-time capabilities
import { createClient } from '@supabase/supabase-js'
import { Database } from './types/supabase'

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Iraqi-specific table operations
const { data: users } = await supabase
  .from('users')
  .select('profession, preferences, created_at')
  .eq('cultural_context', 'iraqi')
```

### Sentry Monitoring Integration
```python
# Production-ready monitoring patterns
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from supabase import create_client, Client

# Initialize Sentry monitoring
sentry_sdk.init(
    dsn=settings.sentry_dsn,
    integrations=[FastApiIntegration()],
    environment="production"
)

# Supabase client with monitoring
supabase: Client = create_client(settings.supabase_url, settings.supabase_key)
```

### Custom Iraqi Components with MCP Integration
```typescript
// Use 44 custom components from examples/dyad-extracted/ with @21st-dev/magic MCP
import { Button } from '@/components/ui/button';

<Button cultural="iraqi" dir="rtl" className="font-arabic">
  إرسال الرسالة
</Button>

// MCP-generated components using @21st-dev/magic
// Sequential MCP for complex component logic
// Context7 MCP for component documentation patterns
```

## MCP Server Integration Patterns

### Supabase MCP Integration
```python
# Use Supabase MCP for database operations
# Automatic schema generation and type safety
# Real-time subscriptions for Iraqi chat features
```

### Sentry MCP Monitoring
```python
# Automated error tracking with Sentry MCP
# Performance monitoring for Iraqi user patterns
# Arabic-specific error categorization
```

## Recent Technical Decisions
- Date: 2025-01-08 - Migrated from SQLAlchemy/Drizzle to Supabase BaaS integration
- Decision: Integrate MCP servers (Sentry, Supabase, @21st-dev/magic, Sequential, Context7, Playwright)
- Architecture: Replace ORM complexity with Supabase real-time database and authentication
- Monitoring: Added Sentry integration for production error tracking and performance monitoring
- Performance: 30x faster installs (Bun), simplified database operations (Supabase)
- Decision: Use project-context structure for agent knowledge sharing with MCP coordination