# Iraqi AI Chat System - Browser-use Integration Guide

Complete integration guide for Browser-use system with Iraqi government portal automation and cultural context awareness.

## 🎯 Overview

This guide covers the integration of the Browser-use system into the Iraqi AI Chat System, providing comprehensive web automation capabilities specifically designed for Iraqi government portals, educational institutions, and business services.

## 📋 Prerequisites

### System Requirements
- Python 3.9+
- Node.js 18+ (for browser automation)
- Chrome/Chromium browser
- 4GB+ RAM (8GB recommended)
- Stable internet connection

### Iraqi-Specific Requirements
- Understanding of Iraqi government portal structures
- Arabic language support in operating system
- Iraqi timezone configuration (Asia/Baghdad)
- Knowledge of Iraqi data formats and validation rules

## 🚀 Installation

### 1. Install Browser Dependencies
```bash
# Install Playwright browsers
pip install playwright
playwright install chromium firefox webkit

# Install Selenium (fallback)
pip install selenium webdriver-manager

# Install Arabic text processing
pip install arabic-reshaper python-bidi
```

### 2. Install LLM Provider Dependencies
```bash
# OpenAI integration
pip install openai

# Anthropic integration
pip install anthropic

# Google integration
pip install google-generativeai

# Local model support
pip install ollama
```

### 3. Configure Environment Variables
```bash
# Create .env file
cat > .env << EOF
# LLM Provider API Keys
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
GOOGLE_API_KEY=your_google_key_here

# Iraqi Portal Configuration
IRAQI_PORTAL_TIMEOUT=60000
GOVERNMENT_HOURS_CHECK=true
CULTURAL_VALIDATION=true
ARABIC_SUPPORT=true

# Browser Configuration
DEFAULT_BROWSER=chrome
HEADLESS_MODE=true
DOWNLOAD_PATH=./downloads
SCREENSHOT_PATH=./screenshots
EOF
```

## 🏗️ Architecture Integration

### 1. Core Components Integration

```python
# apps/api/src/browser_automation/browser_service.py
from browser_use.browser import Browser, BrowserConfig
from browser_use.agent import IraqiPortalAgent
from browser_use.llm import LLMRouter

class BrowserAutomationService:
    def __init__(self):
        self.browser = None
        self.agent = None
        self.llm_router = LLMRouter()
    
    async def initialize_for_iraqi_portals(self):
        """Initialize browser for Iraqi government portals"""
        config = BrowserConfig(
            arabic_support=True,
            rtl_layout=True,
            iraqi_portals=True,
            cultural_validation=True
        )
        
        self.browser = Browser(config)
        await self.browser.start()
        
        self.agent = IraqiPortalAgent(
            browser=self.browser,
            llm_provider=self.llm_router.get_best_provider()
        )
```

### 2. FastAPI Integration

```python
# apps/api/src/routes/browser_automation.py
from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Dict, Any

from ..browser_automation.browser_service import BrowserAutomationService
from ..browser_automation.iraqi_portal_service import IraqiPortalService

router = APIRouter(prefix="/api/v1/browser", tags=["browser-automation"])

class PassportRenewalRequest(BaseModel):
    full_name_arabic: str
    national_id: str
    passport_number: str
    # ... other fields

@router.post("/passport/renew")
async def renew_passport(request: PassportRenewalRequest):
    """Automate passport renewal process"""
    try:
        service = IraqiPortalService()
        result = await service.renew_passport(request.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/university/apply")
async def submit_university_application(request: UniversityApplicationRequest):
    """Automate university application submission"""
    # Implementation here
    pass
```

### 3. Next.js Frontend Integration

```typescript
// apps/web/src/services/browserAutomationService.ts
export class BrowserAutomationService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
  }

  async renewPassport(data: PassportRenewalData): Promise<RenewalResult> {
    try {
      const response = await this.apiClient.post('/browser/passport/renew', data);
      return response.data;
    } catch (error) {
      throw new BrowserAutomationError(error.message);
    }
  }

  async checkApplicationStatus(applicationNumber: string): Promise<StatusInfo> {
    const response = await this.apiClient.get(`/browser/status/${applicationNumber}`);
    return response.data;
  }
}
```

### 4. React Component Integration

```tsx
// apps/web/src/components/PassportRenewalForm.tsx
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { BrowserAutomationService } from '../services/browserAutomationService';

export const PassportRenewalForm: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState<PassportRenewalData>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RenewalResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const service = new BrowserAutomationService();
      const renewalResult = await service.renewPassport(formData);
      setResult(renewalResult);
    } catch (error) {
      console.error('Passport renewal failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`form-container ${i18n.language === 'ar' ? 'rtl' : 'ltr'}`}>
      <form onSubmit={handleSubmit}>
        <div className="field-group">
          <label htmlFor="fullNameArabic">{t('fullNameArabic')}</label>
          <input
            id="fullNameArabic"
            type="text"
            value={formData.fullNameArabic || ''}
            onChange={(e) => setFormData({...formData, fullNameArabic: e.target.value})}
            className="arabic-input"
            dir="rtl"
            required
          />
        </div>
        
        {/* More form fields... */}
        
        <button type="submit" disabled={loading}>
          {loading ? t('processing') : t('renewPassport')}
        </button>
      </form>

      {result && (
        <div className="result-display">
          {result.success ? (
            <div className="success-message">
              <h3>{t('renewalSuccessful')}</h3>
              <p>{t('applicationNumber')}: {result.applicationNumber}</p>
              <p>{t('appointmentDate')}: {result.appointmentDate}</p>
            </div>
          ) : (
            <div className="error-message">
              <h3>{t('renewalFailed')}</h3>
              {result.errors?.map((error, index) => (
                <p key={index} className="error">{error}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
```

## 🔧 Configuration

### 1. Browser Configuration for Iraqi Portals

```python
# browser_config.py
from browser_use.browser import BrowserConfig, BrowserType, BrowserMode

IRAQI_PORTAL_CONFIG = BrowserConfig(
    browser_type=BrowserType.CHROME,
    mode=BrowserMode.HEADLESS,
    viewport_width=1920,
    viewport_height=1080,
    timeout=60000,
    
    # Iraqi-specific settings
    arabic_support=True,
    rtl_layout=True,
    iraqi_portals=True,
    government_hours_check=True,
    cultural_validation=True,
    network_optimization=True,
    
    # User agent for Iraqi government portals
    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    
    # Downloads configuration
    downloads_path="./downloads/government_docs",
    
    # Extensions for Arabic support
    extensions=[
        "arabic-font-extension",
        "rtl-layout-helper"
    ]
)
```

### 2. LLM Provider Configuration

```python
# llm_config.py
from browser_use.llm import LLMConfig, LLMProviderType

# OpenAI Configuration for Iraqi Context
OPENAI_CONFIG = LLMConfig(
    provider_type=LLMProviderType.OPENAI,
    model_name="gpt-4-turbo",
    api_key=os.getenv("OPENAI_API_KEY"),
    max_tokens=4000,
    temperature=0.3,  # Lower temperature for government forms
    
    # Iraqi cultural settings
    arabic_support=True,
    cultural_context="iraqi",
    rtl_awareness=True,
    islamic_compliance=True,
    
    # Performance settings
    streaming=False,  # Disable for form filling accuracy
    cache_responses=True,
    retry_attempts=3,
    
    # Security settings
    content_filtering=True,
    privacy_mode=True
)

# Anthropic Configuration for Cultural Sensitivity
ANTHROPIC_CONFIG = LLMConfig(
    provider_type=LLMProviderType.ANTHROPIC,
    model_name="claude-3-haiku-20240307",
    api_key=os.getenv("ANTHROPIC_API_KEY"),
    cultural_context="iraqi",
    islamic_compliance=True
)
```

### 3. Iraqi Portal Mappings

```python
# iraqi_portals.py
IRAQI_GOVERNMENT_PORTALS = {
    'passport_office': {
        'base_url': 'https://passport.gov.iq',
        'services': {
            'renewal': '/renewal',
            'new_application': '/new',
            'status_check': '/status'
        },
        'working_hours': {'start': 8, 'end': 14},
        'working_days': [6, 0, 1, 2, 3],  # Sunday to Thursday
        'timeout': 60000
    },
    
    'ministry_of_education': {
        'base_url': 'https://mohe.gov.iq',
        'services': {
            'university_application': '/apply',
            'transcript_request': '/transcripts',
            'certificate_verification': '/verify'
        },
        'working_hours': {'start': 8, 'end': 14},
        'timeout': 90000  # Slower portal
    },
    
    'civil_status': {
        'base_url': 'https://civil.gov.iq',
        'services': {
            'birth_certificate': '/birth',
            'marriage_certificate': '/marriage',
            'death_certificate': '/death'
        }
    }
}

# University Portal Mappings
IRAQI_UNIVERSITIES = {
    'baghdad_university': {
        'name_arabic': 'جامعة بغداد',
        'name_english': 'University of Baghdad',
        'base_url': 'https://uobaghdad.edu.iq',
        'application_url': '/apply',
        'colleges': {
            'medicine': 'كلية الطب',
            'engineering': 'كلية الهندسة',
            'science': 'كلية العلوم',
            'arts': 'كلية الآداب'
        }
    },
    
    'mustansiriyah': {
        'name_arabic': 'الجامعة المستنصرية',
        'name_english': 'Al-Mustansiriyah University',
        'base_url': 'https://uomustansiriyah.edu.iq'
    }
}
```

## 🔍 Usage Examples

### 1. Basic Browser Automation

```python
import asyncio
from browser_use.browser import Browser, BrowserConfig
from browser_use.agent import IraqiPortalAgent

async def basic_automation_example():
    # Initialize browser with Iraqi portal support
    config = BrowserConfig(
        arabic_support=True,
        iraqi_portals=True,
        cultural_validation=True
    )
    
    browser = Browser(config)
    await browser.start()
    
    try:
        # Navigate to Iraqi government portal
        await browser.navigate('https://passport.gov.iq')
        
        # Fill form with Iraqi data validation
        form_data = {
            'national_id': '123456789012',
            'phone_number': '+964 770 123 4567',
            'email': 'user@example.com'
        }
        
        await browser.fill_form(form_data)
        
        # Take screenshot for verification
        screenshot = await browser.take_screenshot()
        
    finally:
        await browser.close()

# Run the example
asyncio.run(basic_automation_example())
```

### 2. LLM-Guided Navigation

```python
from browser_use.llm import OpenAIProvider, LLMConfig, LLMProviderType
from browser_use.agent import ContentAnalysisAgent

async def llm_guided_navigation():
    # Configure LLM for Iraqi context
    llm_config = LLMConfig(
        provider_type=LLMProviderType.OPENAI,
        model_name="gpt-4",
        arabic_support=True,
        cultural_context="iraqi_government"
    )
    
    llm_provider = OpenAIProvider(llm_config)
    
    # Initialize content analysis agent
    agent = ContentAnalysisAgent(llm_provider=llm_provider)
    
    # Analyze page content
    page_content = await browser.get_page_content()
    analysis = await agent.analyze_page_structure(page_content)
    
    # Get LLM guidance for next actions
    guidance = await llm_provider.chat(
        message="How should I navigate this Iraqi passport renewal page?",
        system_prompt="You are an expert in Iraqi government portals"
    )
    
    print(f"LLM Guidance: {guidance.content}")
```

### 3. Form Automation with Validation

```python
from browser_use.dom import FormHandler, IraqiFormValidator

async def form_automation_with_validation():
    browser = Browser(config)
    await browser.start()
    
    form_handler = FormHandler(browser.page)
    validator = IraqiFormValidator()
    
    # Analyze form structure
    form_analysis = await form_handler.analyze_form_fields()
    
    # Prepare and validate data
    form_data = {
        'national_id': '123456789012',
        'passport_number': 'A1234567',
        'phone_number': '07701234567'
    }
    
    # Validate each field before filling
    for field_name, value in form_data.items():
        if field_name == 'national_id':
            is_valid, error = validator.validate_national_id(value)
            if not is_valid:
                print(f"Invalid national ID: {error}")
                continue
        
        # Similar validation for other fields...
    
    # Fill form with validated data
    result = await form_handler.fill_form(form_data)
    
    if result.success:
        await form_handler.submit_form()
        print("Form submitted successfully")
    else:
        print(f"Form filling failed: {result.validation_errors}")
```

## 🌐 Integration with Iraqi AI Chat System

### 1. Chat Interface Integration

```typescript
// Chat component integration
export const ChatMessage: React.FC<{message: Message}> = ({message}) => {
  const handleBrowserAutomation = async (automationType: string, data: any) => {
    try {
      const service = new BrowserAutomationService();
      
      switch (automationType) {
        case 'passport_renewal':
          return await service.renewPassport(data);
        case 'university_application':
          return await service.submitUniversityApplication(data);
        case 'status_check':
          return await service.checkApplicationStatus(data.applicationNumber);
        default:
          throw new Error(`Unknown automation type: ${automationType}`);
      }
    } catch (error) {
      console.error('Browser automation failed:', error);
      throw error;
    }
  };

  // Render automation buttons in chat
  if (message.type === 'automation_offer') {
    return (
      <div className="automation-offer">
        <p>{message.content}</p>
        <div className="automation-buttons">
          <button onClick={() => handleBrowserAutomation('passport_renewal', message.data)}>
            تجديد الجواز
          </button>
          <button onClick={() => handleBrowserAutomation('university_application', message.data)}>
            التقديم للجامعة
          </button>
        </div>
      </div>
    );
  }

  return <div className="chat-message">{message.content}</div>;
};
```

### 2. PydanticAI Agent Integration

```python
# apps/api/src/agents/browser_automation_agent.py
from pydantic_ai import Agent, RunContext
from browser_use.browser import Browser
from browser_use.agent import IraqiPortalAgent

browser_automation_agent = Agent(
    'openai:gpt-4',
    deps_type=BrowserAutomationDeps,
    system_prompt="""
    You are an expert Iraqi government portal automation assistant.
    You can help users with:
    1. Passport renewal applications
    2. University applications
    3. Document status checking
    4. Form filling assistance
    
    Always respect Iraqi cultural norms and Islamic values.
    Use Arabic when appropriate and ensure data privacy.
    """
)

@browser_automation_agent.tool
async def renew_passport(ctx: RunContext[BrowserAutomationDeps], 
                        renewal_data: PassportRenewalData) -> RenewalResult:
    """Automate passport renewal process"""
    automation = PassportRenewalAutomation(ctx.deps.llm_provider)
    return await automation.renew_passport(renewal_data)

@browser_automation_agent.tool
async def check_application_status(ctx: RunContext[BrowserAutomationDeps],
                                 application_number: str) -> StatusInfo:
    """Check status of government application"""
    automation = PassportRenewalAutomation(ctx.deps.llm_provider)
    return await automation.check_application_status(application_number)
```

## 🛡️ Security and Privacy

### 1. Data Protection

```python
# Security configuration
SECURITY_CONFIG = {
    # Credential management
    'secure_credential_storage': True,
    'encrypt_form_data': True,
    'auto_clear_sensitive_data': True,
    
    # Session isolation
    'isolated_browser_sessions': True,
    'clear_cookies_after_use': True,
    'disable_browser_cache': True,
    
    # Network security
    'use_secure_connections_only': True,
    'validate_ssl_certificates': True,
    'block_malicious_domains': True,
    
    # Iraqi compliance
    'respect_government_tos': True,
    'comply_with_iraqi_privacy_law': True,
    'audit_all_portal_interactions': True
}
```

### 2. Cultural and Religious Compliance

```python
# Cultural validation
CULTURAL_COMPLIANCE = {
    # Islamic principles
    'respect_islamic_values': True,
    'avoid_non_halal_content': True,
    'respect_prayer_times': True,
    
    # Iraqi cultural norms
    'use_appropriate_language': True,
    'respect_government_protocols': True,
    'honor_cultural_sensitivities': True,
    
    # Privacy protection
    'protect_family_information': True,
    'respect_gender_specific_requirements': True,
    'maintain_data_confidentiality': True
}
```

## 📊 Monitoring and Analytics

### 1. Performance Monitoring

```python
# Monitoring configuration
import logging
from browser_use.core import MetricsCollector

# Configure metrics collection
metrics = MetricsCollector()

async def monitor_automation_performance():
    """Monitor browser automation performance"""
    
    # Track success rates
    success_rate = metrics.calculate_success_rate('passport_renewal')
    
    # Monitor response times
    avg_response_time = metrics.get_average_response_time('government_portals')
    
    # Track error patterns
    common_errors = metrics.get_common_errors()
    
    # Log performance metrics
    logger.info(f"Success rate: {success_rate}%")
    logger.info(f"Average response time: {avg_response_time}ms")
    logger.info(f"Common errors: {common_errors}")
```

### 2. Error Handling and Recovery

```python
# Error handling strategy
class IraqiPortalErrorHandler:
    def __init__(self):
        self.retry_strategies = {
            'network_timeout': self.handle_network_timeout,
            'portal_maintenance': self.handle_portal_maintenance,
            'invalid_data': self.handle_invalid_data,
            'captcha_required': self.handle_captcha_required
        }
    
    async def handle_automation_error(self, error_type: str, context: dict):
        """Handle automation errors with Iraqi portal context"""
        
        if error_type in self.retry_strategies:
            return await self.retry_strategies[error_type](context)
        
        # Default error handling
        return await self.default_error_handling(error_type, context)
    
    async def handle_network_timeout(self, context: dict):
        """Handle network timeouts common in Iraq"""
        # Increase timeout for Iraqi network conditions
        # Retry with exponential backoff
        pass
    
    async def handle_portal_maintenance(self, context: dict):
        """Handle government portal maintenance"""
        # Check maintenance schedules
        # Suggest alternative times
        pass
```

## 🔄 Continuous Improvement

### 1. Learning from Interactions

```python
# Machine learning integration
class AutomationLearningSystem:
    def __init__(self):
        self.interaction_logger = InteractionLogger()
        self.pattern_analyzer = PatternAnalyzer()
    
    async def learn_from_successful_automation(self, automation_type: str, 
                                             interaction_data: dict):
        """Learn from successful automations to improve future performance"""
        
        # Log successful patterns
        await self.interaction_logger.log_success(automation_type, interaction_data)
        
        # Analyze patterns for optimization
        patterns = await self.pattern_analyzer.identify_success_patterns(automation_type)
        
        # Update automation strategies
        await self.update_automation_strategies(automation_type, patterns)
    
    async def adapt_to_portal_changes(self, portal_name: str):
        """Adapt to changes in government portals"""
        
        # Detect UI changes
        changes = await self.detect_portal_changes(portal_name)
        
        # Update selectors and strategies
        if changes:
            await self.update_portal_mappings(portal_name, changes)
```

### 2. Community Feedback Integration

```python
# Feedback system
class CommunityFeedbackSystem:
    async def collect_user_feedback(self, automation_result: dict, 
                                  user_rating: int, comments: str):
        """Collect feedback from Iraqi users"""
        
        feedback = {
            'automation_type': automation_result['type'],
            'success': automation_result['success'],
            'user_rating': user_rating,
            'comments': comments,
            'cultural_appropriateness': user_rating >= 4,
            'timestamp': datetime.now(),
            'region': 'iraq'
        }
        
        await self.store_feedback(feedback)
        await self.analyze_feedback_trends()
    
    async def improve_based_on_feedback(self):
        """Improve automation based on community feedback"""
        
        # Analyze feedback patterns
        feedback_analysis = await self.analyze_feedback_patterns()
        
        # Identify improvement areas
        improvement_areas = await self.identify_improvement_areas(feedback_analysis)
        
        # Implement improvements
        for area in improvement_areas:
            await self.implement_improvement(area)
```

## 📞 Support and Troubleshooting

### Common Issues and Solutions

1. **Arabic Text Not Displaying Correctly**
   ```python
   # Ensure Arabic font support is enabled
   config.arabic_support = True
   config.rtl_layout = True
   
   # Add Arabic fonts to browser
   await browser.context.add_init_script("""
       document.fonts.add(new FontFace('NotoSansArabic', 'url(fonts/NotoSansArabic.woff2)'));
   """)
   ```

2. **Government Portal Timeouts**
   ```python
   # Increase timeout for Iraqi network conditions
   config.timeout = 90000  # 90 seconds
   config.network_optimization = True
   
   # Implement retry logic
   for attempt in range(3):
       try:
           await browser.navigate(url)
           break
       except TimeoutError:
           if attempt == 2:
               raise
           await asyncio.sleep(5)
   ```

3. **Form Validation Failures**
   ```python
   # Use Iraqi data validators
   validator = IraqiFormValidator()
   
   # Validate before filling
   is_valid, error = validator.validate_national_id(national_id)
   if not is_valid:
       raise ValidationError(f"Invalid national ID: {error}")
   ```

### Getting Help

- **Documentation**: `/docs/` directory contains detailed API documentation
- **Examples**: `/examples/` directory contains working examples
- **Community**: Iraqi AI Chat System community forums
- **Support**: GitHub issues for bug reports and feature requests

## 📈 Performance Optimization

### 1. Browser Performance

```python
# Performance optimization configuration
PERFORMANCE_CONFIG = {
    # Browser optimization
    'enable_browser_caching': False,  # Disable for government portals
    'optimize_for_iraqi_networks': True,
    'preload_arabic_fonts': True,
    'use_compression': True,
    
    # Memory management
    'clear_memory_after_automation': True,
    'limit_concurrent_browsers': 2,
    'cleanup_temporary_files': True,
    
    # Network optimization
    'use_iraqi_proxy_servers': False,  # Only if needed
    'optimize_image_loading': True,
    'disable_unnecessary_resources': True
}
```

### 2. LLM Performance

```python
# LLM optimization for Iraqi context
LLM_OPTIMIZATION = {
    # Context optimization
    'cache_cultural_context': True,
    'preload_iraqi_terminology': True,
    'optimize_arabic_processing': True,
    
    # Response optimization
    'reduce_token_usage': True,
    'cache_common_responses': True,
    'batch_similar_requests': True,
    
    # Accuracy optimization
    'use_cultural_validation': True,
    'implement_feedback_loop': True,
    'continuous_learning': True
}
```

This integration guide provides a comprehensive foundation for implementing Browser-use system within the Iraqi AI Chat System, ensuring cultural appropriateness, technical excellence, and user satisfaction for Iraqi citizens accessing government services.