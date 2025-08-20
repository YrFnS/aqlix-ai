# Enhanced Iraqi Trajectory Intelligence System

**Advanced Debugging Integration for Iraqi AI Systems**

A comprehensive trajectory recording and debugging system specifically designed for Iraqi AI applications, featuring cultural intelligence, Arabic text processing, payment gateway debugging, and advanced error recovery capabilities.

## 🚀 Key Features

### Advanced Debugging Intelligence
- **Iraqi-Specific Error Pattern Recognition**: Comprehensive database of error patterns specific to Iraqi AI systems
- **Real-Time Performance Monitoring**: Baseline metrics for cultural validation, Arabic processing, payment gateways, and MCP coordination
- **Intelligent Error Recovery**: Automated recovery strategies with cultural context preservation
- **Emergency Debugging Protocols**: Critical system failure handling with immediate response actions

### Cultural Intelligence Debugging
- **Islamic Compliance Monitoring**: 90%+ compliance threshold with automatic violation detection
- **Arabic Text Processing Analysis**: UTF-8 encoding validation, RTL rendering diagnostics, Iraqi dialect recognition
- **Professional Domain Validation**: Legal, medical, educational, and government service compliance
- **Cultural Context Preservation**: Maintains Iraqi cultural context throughout debugging and recovery processes

### Iraqi Payment Gateway Debugging
- **Multi-Gateway Support**: ZainCash, FastPay, NassWallet integration debugging
- **Error Code Intelligence**: Comprehensive error code mapping and resolution strategies
- **Security Compliance Validation**: 100% security compliance monitoring
- **Transaction Recovery**: Automated fallback and retry mechanisms

### MCP Server Coordination Intelligence
- **Health Monitoring**: Real-time health checks for Sequential, Context7, Magic, Playwright, Supabase, Sentry
- **Coordination Analysis**: Performance analysis and optimization recommendations
- **Failover Management**: Automatic server failover with graceful degradation
- **Load Balancing**: Intelligent request distribution and resource optimization

## 📁 File Structure

```
examples/trae-agent-extracted/
├── iraqi_trajectory_intelligence.py        # Main trajectory recording system (enhanced)
├── iraqi_advanced_debugging.py             # Advanced debugging engine
├── iraqi_debugging_integration.py          # Integration manager
├── enhanced_trajectory_demo.py              # Comprehensive demonstration
└── README.md                               # This documentation
```

## 🛠 Installation and Setup

### Prerequisites
- Python 3.8+
- Required packages: `asyncio`, `psutil`, `python-dotenv`

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd examples/trae-agent-extracted/

# Install dependencies
pip install asyncio psutil python-dotenv

# Run the enhanced demonstration
python enhanced_trajectory_demo.py
```

## 📖 Usage Examples

### Basic Enhanced Recording

```python
from iraqi_trajectory_intelligence import IraqiTrajectoryRecorder, IraqiCulturalContext, LanguageMode
from iraqi_debugging_integration import IraqiDebuggingIntegrationManager

# Initialize enhanced trajectory recorder
recorder = IraqiTrajectoryRecorder(
    trajectory_path=\"trajectories/my_trajectory.json\",
    enable_cultural_validation=True,
    enable_advanced_debugging=True  # Enable advanced debugging
)

# Initialize debugging integration
integration_manager = IraqiDebuggingIntegrationManager(enable_advanced_debugging=True)

# Start recording with cultural context
await recorder.start_recording(
    task=\"Iraqi educational AI system with cultural intelligence\",
    provider=\"anthropic\",
    model=\"claude-sonnet-4\",
    max_steps=10,
    cultural_context=IraqiCulturalContext.PROFESSIONAL_EDUCATIONAL,
    primary_language=LanguageMode.MIXED_ARABIC_ENGLISH
)
```

### Arabic Text Debugging

```python
# Record Arabic text processing with debugging
await recorder.record_agent_step(
    step_number=1,
    state=TrajectoryStepState.PROCESSING_ARABIC,
    cultural_context=IraqiCulturalContext.CULTURAL_HERITAGE,
    language_mode=LanguageMode.ARABIC_IRAQI_DIALECT,
    reflection=\"Processing Iraqi dialect with RTL rendering\"
)

# Integrate debugging analysis
debug_result = await integration_manager.integrate_with_trajectory_step(
    step_data={\"arabic_content\": \"شلونك، شكو ماكو؟\", \"dialect\": \"iraqi\"},
    cultural_context=\"cultural_heritage\",
    error_message=\"Arabic encoding issue detected\"
)
```

### Payment Gateway Debugging

```python
# Record payment processing step
await recorder.record_agent_step(
    step_number=2,
    state=TrajectoryStepState.CALLING_TOOL,
    cultural_context=IraqiCulturalContext.BUSINESS_COMMERCIAL,
    tool_calls=[{\"tool\": \"zaincash_payment\", \"amount\": 5000, \"currency\": \"IQD\"}],
    error=\"ZainCash authentication failed - error code 4001\"
)

# Debug payment gateway issues
payment_debug = await integration_manager.integrate_with_trajectory_step(
    step_data={\"payment_gateway\": \"zaincash\", \"error_code\": \"4001\"},
    cultural_context=\"business_commercial\",
    error_message=\"Payment authentication failure\"
)
```

### Cultural Compliance Debugging

```python
# Record sequential thought with cultural validation
thought = await recorder.record_sequential_thought(
    thought_content=\"Ensuring educational content respects Islamic values\",
    thought_number=1,
    total_thoughts=3,
    cultural_context=IraqiCulturalContext.PROFESSIONAL_EDUCATIONAL
)

# Integrate cultural debugging analysis
cultural_debug = await integration_manager.integrate_with_sequential_thinking(
    thought_data={\"thought\": thought.thought, \"cultural_validation\": True},
    cultural_context=\"professional_educational\",
    language_mode=\"english\"
)
```

## 🔧 Configuration Options

### Trajectory Recorder Configuration

```python
recorder = IraqiTrajectoryRecorder(
    trajectory_path=\"custom/path.json\",           # Custom trajectory file path
    enable_cultural_validation=True,                # Enable cultural validation (recommended)
    enable_advanced_debugging=True                  # Enable advanced debugging features
)
```

### Debugging Engine Configuration

```python
# Advanced debugging engine with custom settings
from iraqi_advanced_debugging import IraqiAdvancedDebuggingEngine

engine = IraqiAdvancedDebuggingEngine()

# Analyze errors with Iraqi context
debug_metadata = await engine.analyze_error_with_context(
    error_message=\"System error occurred\",
    context={\"operation\": \"arabic_processing\"},
    cultural_context=\"professional_medical\"
)
```

### Integration Manager Configuration

```python
integration_manager = IraqiDebuggingIntegrationManager(
    enable_advanced_debugging=True  # Set to False for basic mode
)

# Perform comprehensive system health check
health_status = await integration_manager.perform_system_health_check()
```

## 📊 Performance Baselines

### Cultural Validation
- **Response Time**: <500ms
- **Success Rate**: 95%+ 
- **Islamic Compliance**: 90%+
- **Accuracy Threshold**: 90%+

### Arabic Processing
- **Response Time**: <200ms
- **RTL Accuracy**: 99%+
- **Dialect Recognition**: 85%+
- **Encoding Success**: 99%+

### Payment Gateways
- **Response Time**: <3000ms
- **Success Rate**: 99%+
- **Security Compliance**: 100%
- **Transaction Timeout**: <30s

### MCP Coordination
- **Response Time**: <1000ms
- **Server Availability**: 98%+
- **Coordination Success**: 95%+
- **Failover Time**: <2s

## 🚨 Error Categories and Recovery

### Arabic Text Processing Errors
- **Encoding Issues**: UTF-8 validation and correction
- **RTL Rendering**: Bidirectional text support
- **Dialect Recognition**: Iraqi dialect processing
- **Mixed Content**: Arabic-English text handling

### Cultural Compliance Errors
- **Islamic Violations**: Content filtering and validation
- **Professional Standards**: Domain-specific compliance
- **Cultural Sensitivity**: Iraqi context awareness
- **Inappropriate Content**: Automatic blocking

### Payment Gateway Errors
- **Authentication Failures**: Credential validation
- **Network Issues**: Connectivity diagnostics
- **Transaction Errors**: Error code analysis
- **Security Violations**: Compliance monitoring

### System Integration Errors
- **MCP Server Failures**: Health monitoring and failover
- **Agent Coordination**: Communication debugging
- **Performance Issues**: Bottleneck identification
- **Emergency Protocols**: Critical failure handling

## 🔍 Debugging Intelligence Features

### Error Pattern Recognition
- Machine learning-based pattern detection
- Iraqi-specific error classification
- Confidence scoring and validation
- Historical pattern analysis

### Performance Monitoring
- Real-time metrics collection
- Baseline comparison and alerting
- Trend analysis and prediction
- Resource utilization tracking

### Recovery Intelligence
- Automated recovery strategy selection
- Cultural context preservation
- Agent delegation optimization
- Emergency protocol activation

### System Diagnostics
- Comprehensive health scoring
- Intelligent recommendations
- Predictive failure detection
- Maintenance planning

## 📈 Metrics and Reporting

### Trajectory Metrics
- Cultural appropriateness scores
- Islamic compliance ratings
- Processing time analysis
- Error rate tracking

### Debugging Metrics
- Error pattern frequency
- Recovery success rates
- System health scores
- Performance trends

### Integration Metrics
- Debugging integration success
- Emergency protocol usage
- Agent coordination efficiency
- MCP server reliability

## 🔒 Security and Compliance

### Data Protection
- Secure trajectory storage
- Encrypted error logging
- Privacy-compliant debugging
- Access control mechanisms

### Cultural Compliance
- Islamic principles adherence
- Professional domain standards
- Iraqi regulatory compliance
- Cultural context validation

### Payment Security
- PCI compliance monitoring
- Transaction security validation
- Fraud detection integration
- Audit trail maintenance

## 🤝 Integration with Iraqi AI Agents

The enhanced trajectory system integrates seamlessly with the comprehensive Iraqi AI agent ecosystem:

### Cultural Intelligence Agents
- `iraqi-cultural-validator`: Cultural compliance validation
- `iraqi-cultural-tester`: Cultural testing and verification
- `arabic-rtl-processor`: Arabic text processing and RTL rendering

### Payment System Agents
- `payment-security-guardian`: Payment security and compliance
- `iraqi-payment-tester`: Iraqi payment gateway testing
- `external-service-coordinator`: External service coordination

### Technical Support Agents
- `iraqi-technical-debugger`: Technical debugging and diagnostics
- `iraqi-devops-engineer`: Infrastructure and deployment
- `iraqi-ai-agent-architect`: System architecture and design

### Professional Domain Agents
- `iraqi-professional-domain-expert`: Professional standards compliance
- `iraqi-business-analyst`: Business process analysis
- `iraqi-accessibility-specialist`: Accessibility and usability

## 🎯 Performance Targets

### System-Wide Targets
- **Issue Resolution Rate**: 95%+
- **Analysis Response Time**: <300ms
- **Cultural Compliance**: 95%+
- **System Uptime**: 99.9%+

### Iraqi-Specific Targets
- **Arabic Processing Accuracy**: 99%+
- **Dialect Recognition**: 85%+
- **Islamic Compliance**: 90%+
- **Payment Gateway Reliability**: 99%+

## 🚀 Future Enhancements

### Planned Features
- Machine learning-based error prediction
- Advanced agent coordination optimization
- Real-time cultural context adaptation
- Enhanced payment gateway integration
- Predictive maintenance capabilities
- Advanced visualization and reporting

### Research Areas
- Neural network-based error classification
- Automated cultural context learning
- Dynamic performance optimization
- Advanced recovery strategy generation
- Cross-system intelligence sharing

## 📞 Support and Contribution

### Technical Support
For technical support and questions about the enhanced Iraqi trajectory intelligence system, please refer to the comprehensive documentation and example implementations provided.

### Contributing
Contributions to improve the system's debugging intelligence, cultural awareness, and Iraqi-specific capabilities are welcome. Please ensure all contributions maintain the high standards of cultural sensitivity and technical excellence.

## 📄 License

This enhanced Iraqi trajectory intelligence system is designed to support Iraqi AI development with cultural awareness and technical excellence. Please ensure compliance with Iraqi cultural norms and Islamic principles when using and extending the system.

---

**Enhanced Iraqi Trajectory Intelligence System v2.0**
*Advanced Debugging Integration for Iraqi AI Systems*

🇮🇶 Built with pride for the Iraqi AI community 🇮🇶