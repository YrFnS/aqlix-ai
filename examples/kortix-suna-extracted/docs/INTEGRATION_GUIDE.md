# Iraqi AI Chat System - Kortix-Suna Integration Guide

Comprehensive guide for integrating the extracted Kortix-Suna enterprise system into the Iraqi AI Chat System.

## 🎯 Integration Overview

This guide covers the complete integration of enterprise-grade agent management, team collaboration, billing systems, and workflow automation capabilities from the Kortix-Suna platform into the Iraqi AI Chat System.

### Integration Timeline: 22-32 weeks

- **Phase 1**: Core Integration (6-8 weeks)
- **Phase 2**: Advanced Features (8-12 weeks)
- **Phase 3**: Enterprise Deployment (8-12 weeks)

## 📋 Prerequisites

### Backend Requirements

- Python 3.11+
- FastAPI framework
- Supabase or PostgreSQL database
- Redis for caching and session management
- Docker for containerization

### Frontend Requirements

- Next.js 15+
- TypeScript
- React 18+
- Tailwind CSS
- Arabic RTL support

### Iraqi-Specific Requirements

- ZainCash/FastPay/NassWallet payment gateway accounts
- Arabic language localization
- Islamic business compliance validation
- Professional licensing verification systems

## 🏗️ Phase 1: Core Integration (6-8 weeks)

### Week 1-2: Backend Foundation

#### 1. Agent Management System Integration

```python
# apps/api/src/agents/suna_integration.py
from backend.agent.api import router as agent_router
from backend.agent.versioning import get_version_service
from backend.services.billing import check_billing_status

class SunaAgentManager:
    def __init__(self):
        self.version_service = get_version_service()
        self.billing_service = IraqiBillingService()

    async def create_iraqi_agent(self, agent_config: IraqiAgentConfig):
        # Validate Iraqi professional domain requirements
        if not self.validate_iraqi_compliance(agent_config):
            raise ComplianceError("Agent configuration not compliant with Iraqi standards")

        # Create agent with cultural validation
        agent = await self.create_agent_with_validation(agent_config)
        return agent

    def validate_iraqi_compliance(self, config: IraqiAgentConfig) -> bool:
        # Implement Iraqi-specific validation
        # - Islamic content compliance
        # - Professional domain requirements
        # - Language support (Arabic/English)
        return True
```

#### 2. Database Schema Migration

```sql
-- Add Iraqi-specific extensions to existing schema
-- File: apps/api/supabase/migrations/20250801000000_iraqi_extensions.sql

-- Iraqi organizations table
CREATE TABLE iraqi_organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    organization_type TEXT NOT NULL CHECK (organization_type IN ('law_firm', 'medical_practice', 'educational_institution', 'government_entity')),
    region TEXT NOT NULL CHECK (region IN ('baghdad', 'basra', 'erbil', 'najaf', 'mosul')),
    license_number TEXT,
    compliance_level TEXT NOT NULL DEFAULT 'basic',
    specializations TEXT[] DEFAULT '{}',
    contact_info JSONB NOT NULL DEFAULT '{}',
    billing_config JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Iraqi payment transactions table
CREATE TABLE iraqi_payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    payment_id TEXT NOT NULL,
    gateway TEXT NOT NULL CHECK (gateway IN ('zaincash', 'fastpay', 'nasswallet')),
    amount DECIMAL(12,2) NOT NULL,
    currency TEXT DEFAULT 'IQD',
    status TEXT NOT NULL DEFAULT 'pending',
    gateway_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE iraqi_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE iraqi_payment_transactions ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own organizations" ON iraqi_organizations
    FOR SELECT USING (account_id IN (SELECT account_id FROM account_user WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own payment transactions" ON iraqi_payment_transactions
    FOR ALL USING (account_id IN (SELECT account_id FROM account_user WHERE user_id = auth.uid()));
```

### Week 3-4: Frontend Integration

#### 1. Team Management UI Integration

```typescript
// apps/web/src/components/iraqi/team-management.tsx
import { ManageTeams } from '../../../kortix-suna-extracted/frontend/basejump/manage-teams';
import { IraqiOrganizationTemplateSelector } from '../../../kortix-suna-extracted/templates/iraqi-organization-templates';

export const IraqiTeamManagement: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<IraqiOrganization | null>(null);

  const handleTemplateSelect = (template: IraqiOrganization) => {
    setSelectedTemplate(template);
    // Initialize organization with Iraqi-specific settings
    initializeIraqiOrganization(template);
  };

  return (
    <div className="space-y-6" dir={language === 'arabic' ? 'rtl' : 'ltr'}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          {language === 'arabic' ? 'إدارة الفريق' : 'Team Management'}
        </h2>

        {!selectedTemplate ? (
          <IraqiOrganizationTemplateSelector onSelect={handleTemplateSelect} />
        ) : (
          <ManageTeams />
        )}
      </div>
    </div>
  );
};
```

#### 2. Billing System UI Integration

```typescript
// apps/web/src/components/iraqi/billing-management.tsx
import { BillingModal } from '../../../kortix-suna-extracted/frontend/billing/billing-modal';
import { IraqiPaymentService } from '../../../kortix-suna-extracted/templates/iraqi-payment-integration';

export const IraqiBillingManagement: React.FC = () => {
  const [paymentService] = useState(() => new IraqiPaymentService({
    zaincash_config: {
      merchant_id: process.env.NEXT_PUBLIC_ZAINCASH_MERCHANT_ID,
      secret_key: process.env.ZAINCASH_SECRET_KEY
    },
    fastpay_config: {
      api_key: process.env.FASTPAY_API_KEY,
      merchant_code: process.env.FASTPAY_MERCHANT_CODE
    },
    nasswallet_config: {
      wallet_id: process.env.NASSWALLET_WALLET_ID,
      api_secret: process.env.NASSWALLET_API_SECRET
    }
  }));

  return (
    <div className="space-y-6" dir={language === 'arabic' ? 'rtl' : 'ltr'}>
      {/* Iraqi payment gateway selection */}
      <IraqiPaymentGatewaySelector paymentService={paymentService} />

      {/* Existing billing modal with Iraqi customizations */}
      <BillingModal
        open={billingModalOpen}
        onOpenChange={setBillingModalOpen}
        customPaymentHandlers={{
          zaincash: handleZainCashPayment,
          fastpay: handleFastPayPayment,
          nasswallet: handleNassWalletPayment
        }}
      />
    </div>
  );
};
```

### Week 5-6: Iraqi Payment Gateway Integration

#### 1. Backend Payment Service

```python
# apps/api/src/services/iraqi_payments.py
from kortix_suna_extracted.templates.iraqi_payment_integration import (
    IraqiPaymentService,
    IraqiPaymentRequest,
    ZainCashConfig,
    FastPayConfig,
    NassWalletConfig
)

class IraqiPaymentManager:
    def __init__(self):
        self.payment_service = IraqiPaymentService(
            zaincash_config=ZainCashConfig(
                merchant_id=os.getenv("ZAINCASH_MERCHANT_ID"),
                secret_key=os.getenv("ZAINCASH_SECRET_KEY")
            ),
            fastpay_config=FastPayConfig(
                api_key=os.getenv("FASTPAY_API_KEY"),
                merchant_code=os.getenv("FASTPAY_MERCHANT_CODE")
            ),
            nasswallet_config=NassWalletConfig(
                wallet_id=os.getenv("NASSWALLET_WALLET_ID"),
                api_secret=os.getenv("NASSWALLET_API_SECRET")
            )
        )

    async def process_subscription_payment(self, user_id: str, plan: str, gateway: str):
        # Calculate pricing based on Iraqi market
        amount = self.calculate_iraqi_pricing(plan)

        # Create payment request
        payment_request = IraqiPaymentRequest(
            amount=amount,
            gateway=gateway,
            customer_id=user_id,
            customer_name=await self.get_user_name(user_id),
            customer_phone=await self.get_user_phone(user_id),
            order_id=f"sub_{user_id}_{int(time.time())}",
            description=f"Iraqi AI Chat Subscription - {plan}",
            callback_url=f"{config.BASE_URL}/payment/callback"
        )

        return await self.payment_service.create_payment(payment_request)
```

#### 2. Payment Callback Handling

```python
# apps/api/src/routes/payment_callbacks.py
from fastapi import APIRouter, Request, HTTPException
from services.iraqi_payments import IraqiPaymentManager

router = APIRouter()
payment_manager = IraqiPaymentManager()

@router.post("/payment/callback/zaincash")
async def zaincash_callback(request: Request):
    # Handle ZainCash payment callback
    payload = await request.json()

    # Verify payment with ZainCash
    payment_response = await payment_manager.verify_zaincash_payment(
        payload.get("transactionId")
    )

    if payment_response.status == PaymentStatus.COMPLETED:
        # Activate subscription
        await activate_user_subscription(payment_response.customer_id)
        return {"status": "success"}

    return {"status": "failed"}

@router.post("/payment/callback/fastpay")
async def fastpay_callback(request: Request):
    # Handle FastPay payment callback
    # Similar implementation for FastPay
    pass

@router.post("/payment/callback/nasswallet")
async def nasswallet_callback(request: Request):
    # Handle NassWallet payment callback
    # Similar implementation for NassWallet
    pass
```

### Week 7-8: Workflow Builder Integration

#### 1. Iraqi Workflow Templates

```python
# apps/api/src/workflows/iraqi_templates.py
from kortix_suna_extracted.backend.triggers import TriggerService
from kortix_suna_extracted.templates.iraqi_organization_templates import (
    IraqiLawFirmTemplate,
    IraqiMedicalPracticeTemplate
)

class IraqiWorkflowManager:
    def __init__(self):
        self.trigger_service = TriggerService()

    async def create_law_firm_workflows(self, organization_id: str):
        """Create law firm specific workflows"""
        law_firm_template = IraqiLawFirmTemplate

        for workflow in law_firm_template.workflows:
            # Create workflow in system
            workflow_id = await self.create_workflow(
                organization_id=organization_id,
                workflow_config=workflow
            )

            # Set up triggers for automation
            for step in workflow.steps:
                if step.aiAgent:
                    await self.setup_ai_agent_trigger(workflow_id, step)

        return f"Created {len(law_firm_template.workflows)} workflows for law firm"

    async def create_medical_practice_workflows(self, organization_id: str):
        """Create medical practice specific workflows"""
        medical_template = IraqiMedicalPracticeTemplate

        # Similar implementation for medical workflows
        pass
```

#### 2. Frontend Workflow Builder

```typescript
// apps/web/src/components/iraqi/workflow-builder.tsx
import { WorkflowBuilder } from '../../../kortix-suna-extracted/frontend/workflows/workflow-builder';
import { IraqiOrganization, WorkflowTemplate } from '../../../kortix-suna-extracted/templates/iraqi-organization-templates';

export const IraqiWorkflowBuilder: React.FC<{
  organization: IraqiOrganization;
}> = ({ organization }) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowTemplate | null>(null);

  const handleWorkflowCreate = async (workflowConfig: WorkflowTemplate) => {
    // Add Iraqi-specific validations
    const validatedConfig = await validateIraqiWorkflow(workflowConfig, organization);

    // Create workflow with cultural considerations
    const workflow = await createWorkflowWithCulturalValidation(validatedConfig);

    return workflow;
  };

  return (
    <div className="space-y-6" dir={language === 'arabic' ? 'rtl' : 'ltr'}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          {language === 'arabic' ? 'منشئ سير العمل' : 'Workflow Builder'}
        </h2>

        {/* Iraqi workflow templates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {organization.workflows.map((workflow) => (
            <div key={workflow.id} className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
              <h3 className="font-medium">{workflow.name}</h3>
              <p className="text-sm text-gray-600 text-right" dir="rtl">
                {workflow.nameArabic}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {workflow.estimatedDuration} • {workflow.steps.length} steps
              </p>
            </div>
          ))}
        </div>

        {/* Workflow builder component */}
        <WorkflowBuilder
          onWorkflowCreate={handleWorkflowCreate}
          organizationType={organization.type}
          culturalValidation={true}
        />
      </div>
    </div>
  );
};
```

## 🚀 Phase 2: Advanced Features (8-12 weeks)

### Week 9-12: Agent Marketplace & Templates

#### 1. Iraqi Professional Domain Agents

```python
# apps/api/src/agents/iraqi_professional_agents.py
from backend.agent.tools.agent_builder_tools import AgentConfigTool
from kortix_suna_extracted.templates.iraqi_organization_templates import OrganizationType

class IraqiProfessionalAgentBuilder:
    def __init__(self):
        self.agent_config_tool = AgentConfigTool()

    async def create_legal_agent(self, specialization: str) -> str:
        """Create Iraqi legal domain agent"""
        legal_prompt = f"""
        You are an Iraqi legal assistant specializing in {specialization}.

        Key responsibilities:
        - Provide legal guidance based on Iraqi law
        - Draft legal documents in Arabic and English
        - Research Iraqi legal precedents
        - Ensure Islamic law compliance where applicable
        - Maintain client confidentiality

        Important: Always include Arabic translations for legal terms.
        Never provide advice that conflicts with Iraqi legal system.
        """

        agent_config = {
            "name": f"Iraqi Legal Assistant - {specialization}",
            "nameArabic": f"المساعد القانوني العراقي - {specialization}",
            "system_prompt": legal_prompt,
            "configured_mcps": [
                {"name": "legal_research", "config": {"region": "iraq"}},
                {"name": "document_generator", "config": {"language": "arabic"}}
            ],
            "agentpress_tools": {
                "legal_research": True,
                "document_drafting": True,
                "case_management": True
            }
        }

        return await self.agent_config_tool.create_agent(agent_config)

    async def create_medical_agent(self, specialization: str) -> str:
        """Create Iraqi medical domain agent"""
        medical_prompt = f"""
        You are an Iraqi medical assistant specializing in {specialization}.

        Key responsibilities:
        - Assist with patient coordination
        - Help with medical record management
        - Provide appointment scheduling support
        - Ensure HIPAA and Iraqi medical privacy compliance
        - Support both Arabic and English communication

        Important: Never provide direct medical diagnoses.
        Always encourage patients to consult with licensed physicians.
        """

        agent_config = {
            "name": f"Iraqi Medical Assistant - {specialization}",
            "nameArabic": f"المساعد الطبي العراقي - {specialization}",
            "system_prompt": medical_prompt,
            "configured_mcps": [
                {"name": "appointment_scheduler", "config": {"timezone": "Asia/Baghdad"}},
                {"name": "patient_coordinator", "config": {"language": "arabic"}}
            ],
            "agentpress_tools": {
                "appointment_management": True,
                "patient_coordination": True,
                "medical_records": True
            }
        }

        return await self.agent_config_tool.create_agent(agent_config)
```

### Week 13-16: Enterprise Security & Compliance

#### 1. Iraqi Compliance Framework

```python
# apps/api/src/compliance/iraqi_compliance.py
from enum import Enum
from typing import Dict, List, Any

class IraqiComplianceStandard(Enum):
    ISLAMIC_BUSINESS = "islamic_business"
    GOVERNMENT_REGULATION = "government_regulation"
    PROFESSIONAL_LICENSING = "professional_licensing"
    DATA_PROTECTION = "data_protection"

class IraqiComplianceValidator:
    def __init__(self):
        self.compliance_rules = self.load_compliance_rules()

    async def validate_content(self, content: str, standard: IraqiComplianceStandard) -> Dict[str, Any]:
        """Validate content against Iraqi compliance standards"""
        validation_result = {
            "compliant": True,
            "violations": [],
            "recommendations": []
        }

        if standard == IraqiComplianceStandard.ISLAMIC_BUSINESS:
            violations = await self.check_islamic_compliance(content)
            validation_result["violations"].extend(violations)

        if standard == IraqiComplianceStandard.GOVERNMENT_REGULATION:
            violations = await self.check_government_compliance(content)
            validation_result["violations"].extend(violations)

        validation_result["compliant"] = len(validation_result["violations"]) == 0
        return validation_result

    async def check_islamic_compliance(self, content: str) -> List[str]:
        """Check Islamic business practice compliance"""
        violations = []

        # Check for prohibited content
        prohibited_terms = [
            "interest", "riba", "gambling", "alcohol",
            "pork", "lottery", "casino"
        ]

        for term in prohibited_terms:
            if term.lower() in content.lower():
                violations.append(f"Contains prohibited term: {term}")

        return violations

    async def check_government_compliance(self, content: str) -> List[str]:
        """Check Iraqi government regulation compliance"""
        violations = []

        # Check for sensitive political content
        sensitive_terms = [
            "sectarian", "political party", "tribal conflict"
        ]

        for term in sensitive_terms:
            if term.lower() in content.lower():
                violations.append(f"Contains sensitive term: {term}")

        return violations
```

### Week 17-20: Performance Optimization & Scaling

#### 1. Multi-Tenant Architecture

```python
# apps/api/src/infrastructure/multi_tenant.py
from typing import Optional
from fastapi import Request, HTTPException
from backend.services.supabase import DBConnection

class MultiTenantManager:
    def __init__(self):
        self.db = DBConnection()

    async def get_tenant_context(self, request: Request) -> Optional[Dict[str, Any]]:
        """Extract tenant context from request"""
        # Get account_id from JWT token
        account_id = await self.extract_account_id(request)

        if not account_id:
            return None

        # Get organization details
        org_query = """
        SELECT io.*, a.name as account_name
        FROM iraqi_organizations io
        JOIN accounts a ON io.account_id = a.id
        WHERE io.account_id = %s
        """

        result = await self.db.fetch_one(org_query, account_id)

        if result:
            return {
                "account_id": account_id,
                "organization_type": result["organization_type"],
                "region": result["region"],
                "compliance_level": result["compliance_level"],
                "billing_config": result["billing_config"]
            }

        return {"account_id": account_id}

    async def enforce_tenant_isolation(self, tenant_context: Dict[str, Any], resource_query: str) -> str:
        """Enforce tenant isolation in database queries"""
        account_id = tenant_context["account_id"]

        # Add RLS filter to query
        if "WHERE" in resource_query.upper():
            resource_query += f" AND account_id = '{account_id}'"
        else:
            resource_query += f" WHERE account_id = '{account_id}'"

        return resource_query
```

## 🔧 Phase 3: Enterprise Deployment (8-12 weeks)

### Week 21-24: Production Deployment

#### 1. Docker Configuration

```dockerfile
# Dockerfile.iraqi-enterprise
FROM node:18-alpine AS frontend-builder

WORKDIR /app
COPY apps/web/package*.json ./
RUN npm ci --only=production

COPY apps/web/ ./
COPY examples/kortix-suna-extracted/ ./kortix-suna-extracted/

# Build with Iraqi configuration
ENV NEXT_PUBLIC_IRAQI_MODE=true
ENV NEXT_PUBLIC_DEFAULT_LANGUAGE=arabic
ENV NEXT_PUBLIC_RTL_SUPPORT=true

RUN npm run build

FROM python:3.11-slim AS backend-builder

WORKDIR /app
COPY apps/api/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY apps/api/ ./
COPY examples/kortix-suna-extracted/backend/ ./kortix-suna-backend/

# Production configuration
ENV PYTHONPATH="${PYTHONPATH}:/app/kortix-suna-backend"
ENV IRAQI_ENTERPRISE_MODE=true

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### 2. Kubernetes Deployment

```yaml
# k8s/iraqi-enterprise-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: iraqi-ai-chat-enterprise
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: iraqi-ai-chat-enterprise
  template:
    metadata:
      labels:
        app: iraqi-ai-chat-enterprise
    spec:
      containers:
        - name: backend
          image: iraqi-ai-chat:enterprise-latest
          ports:
            - containerPort: 8000
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: iraqi-enterprise-secrets
                  key: database-url
            - name: ZAINCASH_MERCHANT_ID
              valueFrom:
                secretKeyRef:
                  name: iraqi-payment-secrets
                  key: zaincash-merchant-id
            - name: FASTPAY_API_KEY
              valueFrom:
                secretKeyRef:
                  name: iraqi-payment-secrets
                  key: fastpay-api-key
          resources:
            requests:
              memory: "512Mi"
              cpu: "250m"
            limits:
              memory: "1Gi"
              cpu: "500m"
        - name: frontend
          image: iraqi-ai-chat-frontend:enterprise-latest
          ports:
            - containerPort: 3000
          resources:
            requests:
              memory: "256Mi"
              cpu: "125m"
            limits:
              memory: "512Mi"
              cpu: "250m"
```

### Week 25-28: Monitoring & Analytics

#### 1. Enterprise Monitoring Dashboard

```typescript
// apps/web/src/components/enterprise/monitoring-dashboard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart, LineChart, PieChart } from 'recharts';

export const IraqiEnterpriseMonitoringDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState({
    totalOrganizations: 0,
    activeAgents: 0,
    monthlyRevenue: 0,
    paymentGatewayStats: [],
    organizationTypes: [],
    regionalDistribution: []
  });

  useEffect(() => {
    fetchEnterpriseMetrics();
  }, []);

  const fetchEnterpriseMetrics = async () => {
    // Fetch metrics from backend
    const response = await fetch('/api/enterprise/metrics');
    const data = await response.json();
    setMetrics(data);
  };

  return (
    <div className="space-y-6" dir={language === 'arabic' ? 'rtl' : 'ltr'}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              {language === 'arabic' ? 'إجمالي المنظمات' : 'Total Organizations'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalOrganizations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              {language === 'arabic' ? 'الوكلاء النشطون' : 'Active Agents'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeAgents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              {language === 'arabic' ? 'الإيرادات الشهرية' : 'Monthly Revenue'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.monthlyRevenue.toLocaleString()} IQD
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              {language === 'arabic' ? 'معدل النجاح' : 'Success Rate'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'arabic' ? 'التوزيع حسب نوع المنظمة' : 'Distribution by Organization Type'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart width={400} height={300} data={metrics.organizationTypes}>
              {/* Chart configuration */}
            </PieChart>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'arabic' ? 'التوزيع الجغرافي' : 'Regional Distribution'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart width={400} height={300} data={metrics.regionalDistribution}>
              {/* Chart configuration */}
            </BarChart>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
```

### Week 29-32: Final Integration & Testing

#### 1. End-to-End Integration Tests

```typescript
// tests/e2e/iraqi-enterprise.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Iraqi Enterprise Integration", () => {
  test("Complete law firm workflow", async ({ page }) => {
    // Login as law firm user
    await page.goto("/auth");
    await page.fill('input[type="email"]', "admin@adalawfirm.iq");
    await page.fill('input[type="password"]', "secure_password");
    await page.click('button[type="submit"]');

    // Navigate to team management
    await page.click("text=Team Management");
    expect(await page.textContent("h1")).toContain("إدارة الفريق");

    // Create new case workflow
    await page.click("text=New Case");
    await page.fill('input[name="client_name"]', "أحمد محمد علي");
    await page.fill('input[name="case_type"]', "Civil Law");
    await page.click('button:has-text("Create Case")');

    // Verify workflow creation
    expect(await page.textContent(".success-message")).toContain(
      "Case created successfully",
    );

    // Test billing integration
    await page.click("text=Billing");
    await page.click("text=ZainCash");
    await page.fill('input[name="amount"]', "5000");
    await page.click('button:has-text("Process Payment")');

    // Verify payment processing
    expect(await page.textContent(".payment-status")).toContain(
      "Payment initiated",
    );
  });

  test("Medical practice patient workflow", async ({ page }) => {
    // Similar test for medical practice workflow
    await page.goto("/auth");
    await page.fill('input[type="email"]', "admin@shifamedical.iq");
    // ... complete medical workflow test
  });

  test("Arabic RTL support", async ({ page }) => {
    await page.goto("/");

    // Switch to Arabic
    await page.click('[data-testid="language-selector"]');
    await page.click("text=العربية");

    // Verify RTL layout
    const body = await page.$("body");
    const direction = await body?.getAttribute("dir");
    expect(direction).toBe("rtl");

    // Verify Arabic translations
    expect(await page.textContent("h1")).toMatch(/[\u0600-\u06FF]/); // Arabic Unicode range
  });
});
```

## 🔐 Security & Compliance Checklist

### Iraqi Business Compliance

- [ ] Islamic business practices validation
- [ ] Government regulation adherence
- [ ] Professional licensing verification
- [ ] Data protection compliance (Iraqi standards)

### Technical Security

- [ ] Multi-tenant data isolation
- [ ] Role-based access controls
- [ ] API security (rate limiting, authentication)
- [ ] Payment gateway security (PCI compliance)
- [ ] Audit logging and monitoring

### Cultural & Language Support

- [ ] Arabic RTL layout support
- [ ] Iraqi dialect recognition
- [ ] Professional Arabic terminology
- [ ] Cultural sensitivity validation

## 📊 Success Metrics

### Technical Metrics

- System uptime: >99.5%
- API response time: <200ms
- Payment success rate: >98%
- Database query performance: <100ms

### Business Metrics

- Organization onboarding time: <2 hours
- User satisfaction score: >4.5/5
- Monthly recurring revenue growth: >15%
- Agent deployment success rate: >95%

## 🚀 Deployment Checklist

### Pre-Deployment

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Payment gateway credentials validated
- [ ] SSL certificates installed
- [ ] Monitoring dashboards configured

### Post-Deployment

- [ ] Health checks passing
- [ ] Payment integration testing
- [ ] User acceptance testing
- [ ] Performance monitoring active
- [ ] Backup systems verified

---

**Integration Complete: Iraqi AI Chat System with Enterprise Kortix-Suna Capabilities**

_22-32 weeks of enterprise-grade development delivering comprehensive team management, billing integration, workflow automation, and agent lifecycle management for Iraqi professional organizations._
