# Integration Patterns Knowledge Base

## MCP Server Usage Patterns

### Sequential MCP Integration
**Best Use Cases**:
- Complex cultural analysis requiring multi-step reasoning
- Iraqi business process modeling and validation
- Root cause analysis for technical issues
- Structured PRP execution planning

**Proven Patterns**:
```yaml
sequential_workflow:
  step_1: "Analyze Iraqi cultural context"
  step_2: "Validate against Islamic principles"
  step_3: "Check political neutrality"
  step_4: "Generate culturally-appropriate response"
```

### Context7 MCP Integration
**Best Use Cases**:
- Iraqi legal framework documentation lookup
- Islamic business practice validation
- Arabic language technical documentation
- Iraqi professional standards verification

**Integration Pattern**:
```python
# Context7 for Iraqi documentation
context7_query = {
    "domain": "iraqi_legal",
    "language": "arabic",
    "context": "commercial_law"
}
```

### Magic MCP for Iraqi UI
**Best Use Cases**:
- RTL-first component generation
- Arabic typography implementation
- Iraqi cultural design patterns
- Islamic-appropriate color schemes

### Playwright MCP for Iraqi Testing
**Best Use Cases**:
- Cross-browser Arabic text rendering validation
- Iraqi payment gateway E2E testing
- RTL layout responsiveness testing
- Iraqi user workflow simulation

## External Service Coordination

### Iraqi Payment Gateway Orchestration
```python
GATEWAY_PRIORITY = [
    {"name": "ZainCash", "priority": 1, "min_amount": 1000},
    {"name": "FastPay", "priority": 2, "min_amount": 500},
    {"name": "NassWallet", "priority": 3, "min_amount": 1000}
]

def select_optimal_gateway(amount, user_preference=None):
    # Intelligent routing based on amount, availability, and user preference
    pass
```

### API Rate Limiting Patterns
- **ZainCash**: 10 requests/minute per merchant
- **FastPay**: 15 requests/minute per account
- **Context7**: 100 requests/hour per API key
- **Sequential**: 50 complex queries/hour

### Fallback Mechanisms
1. **Primary Gateway Failure**: Auto-route to secondary gateway
2. **MCP Server Timeout**: Graceful degradation with cached responses
3. **Network Issues**: Retry with exponential backoff
4. **Cultural Validation Failure**: Default to conservative responses

## Error Handling Integration

### Cultural Error Response Pattern
```python
def handle_cultural_error(error_type, user_language="ar"):
    if error_type == "political_sensitivity":
        return get_neutral_response(user_language)
    elif error_type == "islamic_compliance":
        return get_islamic_appropriate_response(user_language)
    else:
        return get_fallback_response(user_language)
```

### Service Health Monitoring
```yaml
monitoring_thresholds:
  payment_gateways:
    success_rate: ">95%"
    response_time: "<2s"
    uptime: ">99.5%"
  
  mcp_servers:
    success_rate: ">98%"
    response_time: "<1s"
    availability: ">99%"
```

## Service Coordination Workflows

### Payment Processing Workflow
1. **Amount Validation**: Check against gateway minimums
2. **Gateway Selection**: Use intelligent routing algorithm
3. **Cultural Validation**: Ensure Islamic compliance
4. **Transaction Processing**: Execute with timeout handling
5. **Confirmation**: Send culturally-appropriate confirmation

### Content Generation Workflow
1. **Context Analysis**: Use Sequential MCP for requirement analysis
2. **Cultural Validation**: Use iraqi-cultural-validator agent
3. **Language Processing**: Use arabic-rtl-processor for text handling
4. **Quality Assurance**: Use testing agents for validation
5. **Delivery**: Ensure proper RTL formatting and cultural appropriateness

## Iraqi-Specific Adaptations

### Currency Conversion Handling
```python
IQD_EXCHANGE_RATES = {
    "USD": 1320,  # Approximate rate, update regularly
    "EUR": 1400,
    "GBP": 1600
}
```

### Timezone Coordination
- **Primary**: Asia/Baghdad (UTC+3)
- **Business Hours**: 8:00 AM - 6:00 PM Baghdad time
- **Prayer Times**: Integrate Islamic prayer schedule awareness

### Localization Patterns
- **Date Format**: DD/MM/YYYY (Iraqi standard)
- **Number Format**: Arabic-Indic numerals for Arabic content
- **Currency Display**: "1,000 د.ع" for Iraqi Dinar

## Recent Integration Decisions
- Date: 2025-08-01 - Established context management for integration pattern persistence
- Decision: Implement knowledge base sharing across all agents for consistent integration approaches