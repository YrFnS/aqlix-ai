# Iraqi Integration Guide for Skyvern Enterprise

## Overview

This guide covers the Iraqi-specific enhancements and integrations for the Skyvern Enterprise Browser Automation System within the Iraqi AI Chat System.

## Key Iraqi Enhancements

### 1. Government Portal Integration

#### Supported Iraqi Government Portals

- **Ministry of Interior** (moi.gov.iq)
  - Citizen services
  - ID card renewals
  - Passport applications
  - Residence permits

- **Ministry of Trade** (mot.gov.iq)
  - Business registration
  - Import/export licenses
  - Commercial documentation

- **Ministry of Justice** (moj.gov.iq)
  - Legal document processing
  - Court case tracking
  - Legal certificates

- **Municipal Services**
  - Property registration
  - Construction permits
  - Utility services

#### Government Portal Workflow Example

```python
from skyvern.forge.workflow import IraqiGovWorkflow

# Create government portal workflow
workflow = IraqiGovWorkflow(
    portal="ministry_of_interior",
    operation="passport_renewal",
    language="arabic",
    validation="islamic_compliance"
)

# Configure Iraqi-specific settings
workflow.configure(
    business_hours_enabled=True,
    avoid_friday_prayer=True,
    cultural_validation=True,
    timeout=120  # 2 minutes for government portals
)

# Execute workflow
result = await workflow.execute({
    "national_id": "1234567890",
    "current_passport": "A1234567",
    "renewal_type": "standard"
})
```

### 2. Islamic Compliance System

#### Compliance Validation Features

- **Content Filtering**: Automatic detection and filtering of non-Islamic content
- **Halal Business Verification**: Validation of business practices against Islamic principles
- **Prayer Time Integration**: Automatic scheduling around Islamic prayer times
- **Islamic Calendar**: Integration with Hijri calendar for holidays and scheduling

#### Compliance Implementation

```python
from skyvern.forge.compliance import IslamicComplianceValidator

validator = IslamicComplianceValidator()

# Validate content
compliance_result = await validator.validate_content(
    content="Business loan application",
    check_riba=True,  # Check for interest-based transactions
    check_haram_activities=True,
    cultural_context="iraqi"
)

if not compliance_result.is_compliant:
    raise IraqiComplianceError(f"Content violation: {compliance_result.violations}")
```

### 3. Arabic RTL Support

#### Text Processing Features

- **RTL Layout Detection**: Automatic detection and handling of RTL text
- **Iraqi Dialect Recognition**: Support for Iraqi Arabic dialect
- **Form Field Processing**: Intelligent handling of Arabic form fields
- **Font Optimization**: Automatic loading of Arabic fonts

#### Arabic Processing Example

```python
from skyvern.webeye.arabic_processor import ArabicTextProcessor

processor = ArabicTextProcessor(dialect="iraqi")

# Process Arabic form data
processed_data = await processor.process_form_data({
    "name": "محمد أحمد الكاظمي",
    "address": "بغداد - الكرخ - العامرية",
    "occupation": "مهندس مدني"
})

# Enhanced with Iraqi-specific handling
result = await processor.enhance_for_iraqi_portals(processed_data)
```

### 4. Business Hours Integration

#### Iraqi Business Schedule

- **Work Days**: Sunday through Thursday
- **Business Hours**: 8:00 AM - 4:00 PM (Baghdad time)
- **Friday Prayer**: 12:00 PM - 2:00 PM (paused operations)
- **Ramadan Hours**: 9:00 AM - 3:00 PM during Ramadan
- **Islamic Holidays**: Automatic detection and scheduling suspension

#### Scheduling Implementation

```python
from skyvern.forge.scheduling import IraqiBusinessScheduler

scheduler = IraqiBusinessScheduler()

# Schedule task with Iraqi business hours
task_schedule = await scheduler.schedule_task(
    task_type="government_portal_access",
    priority="high",
    respect_business_hours=True,
    avoid_friday_prayer=True,
    ramadan_aware=True
)

print(f"Task scheduled for: {task_schedule.execution_time}")
```

### 5. Multi-Ministry Coordination

#### Coordination Features

- **Parallel Processing**: Execute tasks across multiple ministries simultaneously
- **Document Synchronization**: Coordinate document submission across ministries
- **Status Tracking**: Real-time tracking of multi-ministry operations
- **Error Handling**: Graceful handling of ministry-specific failures

#### Multi-Ministry Example

```python
from skyvern.forge.coordination import MultiMinistryCoordinator

coordinator = MultiMinistryCoordinator()

# Coordinate business registration across ministries
coordination = await coordinator.execute_multi_ministry_task(
    task_type="business_registration",
    ministries=[
        {
            "ministry": "trade",
            "operation": "register_business",
            "documents": ["business_plan", "founder_ids"]
        },
        {
            "ministry": "finance",
            "operation": "tax_registration",
            "documents": ["business_license", "tax_forms"]
        },
        {
            "ministry": "labor",
            "operation": "employee_registration",
            "documents": ["employment_contracts"]
        }
    ]
)
```

## Integration with Existing Components

### 1. Browser-use Enhancement

Skyvern enhances the existing Browser-use component with:

```python
# Enhanced browser-use with Skyvern enterprise workflows
from browser_use import Browser
from skyvern.webeye import IraqiPortalBrowser

# Create enhanced browser with Iraqi portal support
browser = IraqiPortalBrowser(
    base_browser=Browser(),
    arabic_support=True,
    government_portal_mode=True,
    cultural_validation=True
)

# Execute Iraqi government portal task
result = await browser.execute_government_task(
    portal_url="https://moi.gov.iq/services",
    task_type="document_request",
    credentials=iraqi_credentials
)
```

### 2. Suna Team Management Integration

```python
from suna import TeamManager
from skyvern.forge.task_manager import IraqiTaskManager

# Integrate Suna with Iraqi task management
suna_manager = TeamManager()
iraqi_task_manager = IraqiTaskManager()

# Create Iraqi government project in Suna
project = await suna_manager.create_project(
    name="Ministry Portal Integration",
    type="iraqi_government",
    task_manager=iraqi_task_manager
)
```

### 3. PraisonAI Agents Integration

```python
from praisonai import Agent
from skyvern.forge.workflow import IraqiWorkflowAgent

# Create Iraqi-specialized PraisonAI agent
iraqi_agent = IraqiWorkflowAgent(
    base_agent=Agent("government_specialist"),
    compliance_validator=IslamicComplianceValidator(),
    arabic_processor=ArabicTextProcessor(),
    business_scheduler=IraqiBusinessScheduler()
)

# Execute government workflow with AI agent
workflow_result = await iraqi_agent.execute_workflow(
    workflow_type="passport_renewal",
    citizen_data=citizen_information
)
```

### 4. Langflow Visual Integration

```python
# Langflow integration for visual workflow design
from langflow import Flow
from skyvern.forge.langflow_integration import IraqiFlowComponents

# Create Iraqi government workflow in Langflow
flow = Flow("Iraqi Government Services")

# Add Iraqi-specific components
flow.add_component(IraqiFlowComponents.GovernmentPortalLogin())
flow.add_component(IraqiFlowComponents.ArabicFormProcessor())
flow.add_component(IraqiFlowComponents.IslamicComplianceChecker())
flow.add_component(IraqiFlowComponents.MultiMinistryCoordinator())

# Execute visual workflow
result = await flow.execute()
```

## Security and Compliance

### Authentication Requirements

- **Iraqi National ID Verification**
- **Two-Factor Authentication (SMS/TOTP)**
- **Biometric Authentication (Optional)**
- **Institution-based Authorization**
- **Security Clearance Validation**

### Compliance Standards

- **Islamic Banking Compliance** (for financial institutions)
- **Government Security Standards**
- **Data Privacy (Iraqi DPA compliance)**
- **Cultural Appropriateness Validation**
- **Arabic Content Standards**

## API Integration Examples

### Authentication API

```python
import requests

# Authenticate with Iraqi institution
auth_response = requests.post("/api/v1/iraqi/auth/login", json={
    "username": "mohammed.ahmed",
    "password": "secure_password",
    "institution_id": "moi_001",
    "national_id": "1234567890",
    "totp_code": "123456",
    "client_ip": "192.168.1.1",
    "user_agent": "Iraqi-AI-Client/1.0"
})

token = auth_response.json()["session_token"]
```

### Task Creation API

```python
# Create government portal task
task_response = requests.post("/api/v1/iraqi/tasks",
    json={
        "task_type": "government_portal",
        "title": "Passport Renewal Application",
        "description": "Renew Iraqi passport through Ministry portal",
        "url": "https://moi.gov.iq/passport-services",
        "priority": "high",
        "respect_business_hours": True,
        "islamic_compliance_check": True,
        "government_portal_mode": True,
        "parameters": {
            "application_type": "renewal",
            "current_passport": "A1234567",
            "renewal_period": "10_years"
        }
    },
    headers={"Authorization": f"Bearer {token}"}
)

task_id = task_response.json()["task_id"]
```

### Government Portal Access API

```python
# Access government portal for automated operations
portal_response = requests.post("/api/v1/iraqi/government-portal",
    json={
        "portal_type": "ministry",
        "portal_url": "https://moi.gov.iq/services",
        "operation": "form_fill",
        "ministry_code": "MOI",
        "form_data": {
            "applicant_name": "محمد أحمد الكاظمي",
            "national_id": "1234567890",
            "service_type": "passport_renewal"
        },
        "arabic_form_processing": True,
        "islamic_compliance_check": True
    },
    headers={"Authorization": f"Bearer {token}"}
)
```

## Error Handling and Monitoring

### Iraqi-Specific Error Codes

- `BUSINESS_HOURS_VIOLATION`: Operation attempted outside business hours
- `FRIDAY_PRAYER_CONFLICT`: Operation conflicts with prayer time
- `ISLAMIC_COMPLIANCE_FAILURE`: Content failed Islamic compliance check
- `ARABIC_PROCESSING_ERROR`: Arabic text processing failed
- `GOVERNMENT_PORTAL_TIMEOUT`: Government portal operation timed out
- `MINISTRY_COORDINATION_FAILED`: Multi-ministry coordination failed

### Monitoring and Logging

```python
import logging

# Configure Iraqi-specific logging
iraqi_logger = logging.getLogger("iraqi_ai.skyvern")
iraqi_logger.setLevel(logging.INFO)

# Log government portal access
iraqi_logger.info({
    "event": "government_portal_access",
    "ministry": "interior",
    "user_id": "user_123",
    "operation": "passport_renewal",
    "compliance_status": "approved",
    "execution_time": "2024-01-15T10:30:00Z"
})
```

## Performance Optimization

### Caching Strategies

- **Authentication Token Caching**: 1-hour TTL for session tokens
- **Portal Layout Caching**: Cache portal DOM structures
- **Arabic Font Caching**: Preload Arabic fonts
- **Compliance Rule Caching**: Cache Islamic compliance rules

### Resource Management

- **Connection Pooling**: Maintain persistent connections to government portals
- **Request Throttling**: Respect government portal rate limits
- **Memory Optimization**: Efficient Arabic text processing
- **Concurrent Execution**: Parallel ministry coordination

## Troubleshooting Guide

### Common Issues

1. **Government Portal Timeout**
   - Increase timeout settings for slow government portals
   - Implement retry logic with exponential backoff
   - Check portal availability during business hours

2. **Arabic Text Display Issues**
   - Verify Arabic font loading
   - Check RTL text direction settings
   - Validate Unicode encoding

3. **Islamic Compliance Failures**
   - Review content for prohibited terms
   - Check business practice compliance
   - Validate against Islamic principles

4. **Business Hours Conflicts**
   - Verify Baghdad timezone configuration
   - Check Islamic calendar integration
   - Confirm Friday prayer time settings

### Support and Maintenance

- **Government Portal Updates**: Monitor for portal structure changes
- **Compliance Rule Updates**: Regular updates to Islamic compliance rules
- **Arabic Language Updates**: Support for new Iraqi Arabic terms
- **Security Updates**: Regular security patches and updates

## Conclusion

The Iraqi Skyvern integration provides comprehensive support for Iraqi government portal automation with full Islamic compliance, Arabic RTL support, and business hours integration. The system seamlessly integrates with existing Iraqi AI Chat System components while providing enterprise-grade security and reliability.

For additional support or custom implementations, refer to the specialized agents in the `.claude/agents/` directory for Iraqi-specific requirements.
