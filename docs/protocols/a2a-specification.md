# Iraqi AI Chat System - A2A Protocol Specification

**Adapted for Iraqi AI Chat System Integration**  
**Original**: Agent2Agent (A2A) Protocol Specification v0.2.9  
**Enhancement Status**: Iraqi Cultural Sovereignty Integration

> **Important**: This specification has been adapted for the Iraqi AI Chat System, incorporating Islamic compliance, Arabic language support, and professional domain expertise while maintaining full A2A protocol compatibility.

## 1. Introduction

The Agent2Agent (A2A) Protocol is an open standard designed to facilitate communication and interoperability between independent, potentially opaque AI agent systems. In the Iraqi AI Chat System context, A2A enables collaboration between our 22+ specialized Iraqi agents while maintaining **cultural sovereignty** and **Islamic compliance**.

This document provides the enhanced A2A specification for the Iraqi AI Chat System. Our implementation enables agents to:

- **Discover each other's capabilities** with cultural and professional context
- **Negotiate interaction modalities** (Arabic text, mixed Arabic-English, structured data)
- **Manage collaborative tasks** with Islamic compliance validation
- **Securely exchange information** respecting Iraqi privacy and cultural norms

### 1.1. Iraqi AI Enhancement Goals

- **Cultural Sovereignty**: Maintain Iraqi cultural values while enabling global interoperability
- **Islamic Compliance**: Ensure all agent interactions respect Islamic principles (90%+ accuracy)
- **Arabic Language Excellence**: Full RTL support with Iraqi dialect recognition (99%+ RTL accuracy, 85%+ dialect accuracy)
- **Professional Domain Integration**: Support for Iraqi legal, medical, educational, business, and government workflows
- **Payment Gateway Integration**: Native support for ZainCash, FastPay, and NassWallet with Islamic finance compliance

### 1.2. Guiding Principles (Enhanced for Iraq)

- **Simple**: Reuse existing standards (HTTP, JSON-RPC 2.0, Server-Sent Events) with cultural extensions
- **Enterprise Ready**: Iraqi government-grade security, privacy, and regulatory compliance
- **Async First**: Support for long-running tasks with cultural validation steps
- **Modality Agnostic**: Arabic text, mixed content, structured data, and UI components
- **Cultural Intelligence**: Agents collaborate with cultural context awareness and Islamic compliance

## 2. Iraqi Enhanced Core Concepts

Building upon standard A2A concepts with Iraqi cultural intelligence:

### 2.1. Standard A2A Concepts

- **A2A Client**: Agent initiating requests (enhanced with cultural context)
- **A2A Server (Remote Agent)**: Agent processing requests (with Iraqi specialization)
- **Agent Card**: Metadata document (extended with cultural capabilities)
- **Message**: Communication turn (with Arabic language support)
- **Task**: Unit of work (with cultural validation lifecycle)
- **Part**: Content unit (supporting Arabic RTL and mixed content)
- **Artifact**: Agent output (culturally validated)

### 2.2. Iraqi Cultural Extensions

- **Cultural Context**: Islamic compliance score, Arabic language preference, professional domain
- **Iraqi Agent Capabilities**: Cultural validation, Arabic processing, payment integration
- **Professional Domain Routing**: Legal, medical, educational, business specialization
- **Islamic Compliance Validation**: Automated religious compliance checking
- **Arabic Language Processing**: RTL layout, dialect recognition, mixed Arabic-English handling

## 3. Transport and Format (Iraqi Enhanced)

### 3.1. Transport Layer Requirements

All Iraqi AI agent communication **MUST** occur over **HTTPS** with additional security layers:

- **Cultural Encryption**: AES-256 encryption for culturally sensitive data
- **Islamic Privacy**: Enhanced data protection following Islamic privacy principles
- **Iraqi Regulatory Compliance**: Adherence to Iraqi data protection standards

### 3.2. Supported Transport Protocols

Iraqi AI agents **MUST** implement standard A2A transports with cultural enhancements:

#### 3.2.1. JSON-RPC 2.0 Transport (Iraqi Enhanced)

- **Cultural Headers**: `X-Iraqi-Cultural-Context`, `X-Islamic-Compliance-Level`
- **Arabic Content-Type**: `application/json; charset=utf-8` with RTL direction metadata
- **Method Naming**: Standard A2A with Iraqi extensions (e.g., `message/sendWithCulturalValidation`)

#### 3.2.2. gRPC Transport (Arabic Language Support)

- **Arabic Field Support**: Protocol Buffers with Arabic string validation
- **Cultural Metadata**: gRPC metadata for cultural context transmission
- **Islamic Compliance Streaming**: Real-time religious compliance validation

#### 3.2.3. HTTP+JSON/REST Transport (RTL Support)

- **Arabic URL Encoding**: Proper encoding for Arabic parameters
- **Cultural Headers**: Iraqi-specific HTTP headers for cultural context
- **RTL Response Format**: JSON responses with RTL layout hints

## 4. Iraqi Enhanced Authentication and Authorization

### 4.1. Iraqi Government Authentication

- **Iraqi ID Integration**: National ID card authentication support
- **Ministry Access Control**: Government-level role-based access
- **Islamic Identity Verification**: Religion-aware authentication flows

### 4.2. Cultural Authorization Patterns

- **Professional Domain Access**: Specialized authorization for Iraqi professional sectors
- **Islamic Compliance Gates**: Religious validation for sensitive operations
- **Arabic Content Permissions**: Language-specific access control

### 4.3. Payment Gateway Authentication

- **ZainCash Integration**: Mobile wallet authentication with Islamic compliance
- **FastPay Authorization**: Digital payment validation with Sharia compliance
- **NassWallet Support**: Electronic wallet authentication with religious validation

## 5. Iraqi Enhanced Agent Discovery

### 5.1. Cultural Agent Card Extensions

Iraqi agents **MUST** extend the standard Agent Card with cultural capabilities:

```typescript
interface IraqiAgentCard extends AgentCard {
  // Cultural enhancements
  culturalCapabilities: {
    islamicCompliance: boolean;
    arabicProcessing: boolean;
    rtlSupport: boolean;
    dialectRecognition: string[]; // ['iraqi', 'standard', 'gulf']
    culturalValidation: boolean;
    professionalDomainExpertise: string[]; // ['legal', 'medical', 'educational']
  };

  // Payment integration
  paymentSupport: {
    zainCash: boolean;
    fastPay: boolean;
    nassWallet: boolean;
    islamicFinanceCompliant: boolean;
  };

  // Arabic language support
  languageSupport: {
    arabic: boolean;
    english: boolean;
    kurdish: boolean;
    mixedContent: boolean;
    rtlAccuracy: number; // 0.99+ required
    dialectAccuracy: number; // 0.85+ for Iraqi dialect
  };
}
```

### 5.2. Iraqi Professional Skills

Enhanced skill definitions for Iraqi professional domains:

```typescript
interface IraqiProfessionalSkill extends AgentSkill {
  professionalDomain:
    | "legal"
    | "medical"
    | "educational"
    | "business"
    | "government"
    | "technology";
  islamicCompliance: boolean;
  arabicRequired: boolean;
  culturalSensitivity: "high" | "medium" | "low";
  iraqiRegulation: string[]; // Applicable Iraqi laws/regulations
}
```

## 6. Iraqi Enhanced Protocol Data Objects

### 6.1. Cultural Context Object

```typescript
interface IraqiCulturalContext {
  culturalValidation: boolean;
  islamicCompliance: boolean;
  arabicSupport: boolean;
  rtlLayout: boolean;
  dialectSupport: "iraqi" | "standard" | "mixed";
  professionalDomain?: string;
  culturalScore: number; // 0-100, 85+ required
  islamicScore: number; // 0-100, 90+ required
}
```

### 6.2. Enhanced Message Object

```typescript
interface IraqiMessage extends Message {
  culturalContext?: IraqiCulturalContext;
  arabicContent?: string; // Arabic translation
  rtlFormatted?: boolean;
  dialectDetected?: string;
  islamicCompliance?: {
    validated: boolean;
    score: number;
    notes?: string;
  };
}
```

### 6.3. Enhanced Task Object

```typescript
interface IraqiTask extends Task {
  culturalValidation?: {
    score: number;
    passed: boolean;
    issues?: string[];
  };
  islamicCompliance?: {
    score: number;
    validated: boolean;
    violations?: string[];
  };
  arabicProcessing?: {
    rtlAccuracy: number;
    dialectRecognition: number;
    mixedContentHandling: boolean;
  };
  professionalDomain?: string;
  paymentIntegration?: {
    gateway?: "ZainCash" | "FastPay" | "NassWallet";
    islamicCompliant: boolean;
    transactionId?: string;
  };
}
```

## 7. Iraqi Enhanced Protocol Methods

### 7.1. Cultural Message Methods

#### 7.1.1. `message/sendWithCulturalValidation`

Enhanced message sending with mandatory cultural validation:

```typescript
interface CulturalMessageSendParams extends MessageSendParams {
  culturalContext: IraqiCulturalContext;
  requireIslamicCompliance: boolean;
  professionalDomainValidation?: string;
  arabicProcessingRequired?: boolean;
}
```

#### 7.1.2. `message/translateToArabic`

Real-time Arabic translation with dialect support:

```typescript
interface ArabicTranslationParams {
  text: string;
  targetDialect: "iraqi" | "standard";
  professionalDomain?: string;
  islamicTerminology: boolean;
}
```

### 7.2. Professional Domain Methods

#### 7.2.1. `domain/legal/consultationRequest`

Iraqi legal consultation with Islamic jurisprudence:

```typescript
interface LegalConsultationParams {
  query: string;
  legalDomain: "civil" | "commercial" | "family" | "criminal";
  islamicLawRequired: boolean;
  arabicResponse: boolean;
  urgencyLevel: "high" | "medium" | "low";
}
```

#### 7.2.2. `domain/medical/consultationRequest`

Iraqi medical consultation with Islamic medical ethics:

```typescript
interface MedicalConsultationParams {
  symptoms: string;
  patientGender: "male" | "female";
  islamicMedicalEthics: boolean;
  arabicConsultation: boolean;
  emergencyLevel: number; // 1-10 scale
}
```

### 7.3. Payment Integration Methods

#### 7.3.1. `payment/processIraqiPayment`

Islamic-compliant payment processing:

```typescript
interface IraqiPaymentParams {
  amount: number; // in IQD
  gateway: "ZainCash" | "FastPay" | "NassWallet";
  islamicCompliant: boolean;
  culturalContext: IraqiCulturalContext;
  description: string;
  descriptionArabic?: string;
}
```

## 8. Iraqi Enhanced Error Handling

### 8.1. Cultural Error Codes

Extended A2A error codes for Iraqi context:

| Code     | Error Name                        | Description                                         |
| -------- | --------------------------------- | --------------------------------------------------- |
| `-33001` | `CulturalValidationFailedError`   | Content failed Iraqi cultural appropriateness check |
| `-33002` | `IslamicComplianceViolationError` | Operation violates Islamic principles               |
| `-33003` | `ArabicProcessingError`           | RTL or dialect processing failure                   |
| `-33004` | `ProfessionalDomainError`         | Unauthorized professional domain access             |
| `-33005` | `PaymentGatewayError`             | Iraqi payment gateway integration failure           |
| `-33006` | `LanguageNotSupportedError`       | Requested Arabic dialect not supported              |

## 9. Iraqi Cultural Workflows & Examples

### 9.1. Islamic Legal Consultation Workflow

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "domain/legal/consultationRequest",
  "params": {
    "query": "ما هي شروط العقد في القانون العراقي؟",
    "legalDomain": "commercial",
    "islamicLawRequired": true,
    "arabicResponse": true,
    "culturalContext": {
      "culturalValidation": true,
      "islamicCompliance": true,
      "arabicSupport": true,
      "rtlLayout": true,
      "dialectSupport": "iraqi",
      "professionalDomain": "legal",
      "culturalScore": 95,
      "islamicScore": 98
    }
  }
}
```

### 9.2. Arabic Medical Consultation

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "domain/medical/consultationRequest",
  "params": {
    "symptoms": "صداع مستمر وحمى خفيفة",
    "patientGender": "female",
    "islamicMedicalEthics": true,
    "arabicConsultation": true,
    "emergencyLevel": 3,
    "culturalContext": {
      "culturalValidation": true,
      "islamicCompliance": true,
      "arabicSupport": true,
      "professionalDomain": "medical",
      "culturalScore": 90,
      "islamicScore": 95
    }
  }
}
```

### 9.3. Islamic-Compliant Payment Processing

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "payment/processIraqiPayment",
  "params": {
    "amount": 50000,
    "gateway": "ZainCash",
    "islamicCompliant": true,
    "description": "Legal consultation fee",
    "descriptionArabic": "رسوم الاستشارة القانونية",
    "culturalContext": {
      "culturalValidation": true,
      "islamicCompliance": true,
      "professionalDomain": "legal"
    }
  }
}
```

## 10. Integration with Iraqi AI Chat System

### 10.1. Agent Coordination

The A2A protocol integrates with our specialized Iraqi agents:

- **iraqi-cultural-validator**: Validates all communications for cultural appropriateness
- **arabic-rtl-processor**: Handles Arabic text processing and RTL layout
- **iraqi-professional-domain-expert**: Routes to appropriate professional domain agents
- **payment-security-guardian**: Manages Islamic-compliant payment processing
- **iraqi-security-specialist**: Ensures security compliance with Iraqi standards

### 10.2. Cultural Enhancement Layer Integration

A2A messages are processed through our unified cultural enhancement layer:

1. **Cultural Validation**: 95%+ appropriateness score required
2. **Islamic Compliance**: 90%+ compliance score required
3. **Arabic Processing**: RTL accuracy 99%+, dialect recognition 85%+
4. **Professional Domain Routing**: Automatic routing to domain specialists
5. **Quality Assurance**: 8-step validation cycle with cultural gates

## 11. Iraqi A2A Compliance Requirements

### 11.1. Cultural Compliance Requirements

For Iraqi A2A-compliant agents, implementations **MUST**:

- **Cultural Validation**: All outputs validated for Iraqi cultural appropriateness (95%+ score)
- **Islamic Compliance**: All operations validated for Islamic principles (90%+ score)
- **Arabic Language**: Full RTL support with 99%+ accuracy
- **Professional Domains**: Support for Iraqi legal, medical, educational workflows
- **Payment Integration**: Support for at least one Iraqi payment gateway
- **Security Standards**: Iraqi government-grade security compliance

### 11.2. Performance Requirements

- **Cultural Validation**: <200ms average response time
- **Arabic Processing**: <300ms for RTL text processing
- **Payment Processing**: <5s for Iraqi gateway transactions
- **Professional Queries**: <1s for domain-specific routing
- **Overall System**: <300ms enhancement overhead

---

**Built with Iraqi cultural sovereignty • Islamic compliance • Arabic excellence**

> This specification maintains full compatibility with the standard A2A protocol while adding comprehensive Iraqi cultural intelligence and professional domain expertise.
