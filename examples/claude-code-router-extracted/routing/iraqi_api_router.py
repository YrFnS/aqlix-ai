"""
Iraqi API Router System
Enhanced API routing with Iraqi cultural validation, payment gateway routing, and professional domain awareness.

Based on claude-code-router patterns with comprehensive Iraqi enhancements:
- Intelligent model routing with token-based optimization
- Cultural validation middleware integration
- Payment gateway specific routing (ZainCash, FastPay, NassWallet)
- Professional domain routing for Iraqi legal/medical/educational contexts
- Arabic processing optimized routing decisions
"""

from typing import Dict, List, Optional, Any, Union, Callable
from enum import Enum
from dataclasses import dataclass, field
from datetime import datetime
import asyncio
import logging
import json
from abc import ABC, abstractmethod

# Enhanced imports for Iraqi context
from arabic_support import ArabicTokenCalculator, RTLContentProcessor
from cultural_validation import IslamicComplianceRouter, ProfessionalDomainRouter
from payment_integration import PaymentGatewayRouter, IraqiPaymentValidator

class IraqiRouterType(Enum):
    """Enhanced router types for Iraqi API routing"""
    DEFAULT = "default"
    CULTURAL_VALIDATION = "cultural_validation"
    ARABIC_PROCESSING = "arabic_processing" 
    PAYMENT_GATEWAY = "payment_gateway"
    PROFESSIONAL_DOMAIN = "professional_domain"
    GOVERNMENT_SERVICE = "government_service"
    FAMILY_CONTEXT = "family_context"
    ISLAMIC_COMPLIANCE = "islamic_compliance"
    LONG_CONTEXT = "long_context"
    BACKGROUND = "background"
    WEB_SEARCH = "web_search"

@dataclass
class IraqiRouterConfig:
    """Enhanced router configuration with Iraqi requirements"""
    # Base routing configuration
    default_model: str = "claude-3-5-sonnet-20241022"
    long_context_model: Optional[str] = "claude-3-opus-20240229"
    background_model: Optional[str] = "claude-3-5-haiku-20241022"
    think_model: Optional[str] = "claude-3-5-sonnet-20241022"
    web_search_model: Optional[str] = "claude-3-5-sonnet-20241022"
    
    # Token thresholds
    long_context_threshold: int = 60000
    cultural_validation_threshold: int = 5000
    arabic_processing_threshold: int = 10000
    
    # Iraqi-specific routing
    cultural_validation_required: bool = True
    islamic_compliance_required: bool = True
    arabic_processing_enabled: bool = True
    payment_gateway_routing: bool = True
    professional_domain_routing: bool = True
    
    # Performance settings
    enable_token_optimization: bool = True
    enable_caching: bool = True
    enable_load_balancing: bool = True
    
    # Cultural requirements
    cultural_compliance_threshold: float = 0.9
    islamic_compliance_threshold: float = 0.95
    professional_domain_threshold: float = 0.8

@dataclass
class IraqiRoutingRequest:
    """Enhanced routing request with comprehensive Iraqi context"""
    # Core request data
    messages: List[Dict[str, Any]]
    system: Union[str, List[Dict[str, Any]], None] = None
    tools: List[Dict[str, Any]] = field(default_factory=list)
    model: str = ""
    
    # Iraqi context
    cultural_context: Dict[str, Any] = field(default_factory=dict)
    arabic_content_detected: bool = False
    payment_context: Optional[str] = None  # zain_cash, fast_pay, nass_wallet
    professional_domain: Optional[str] = None  # legal, medical, education, government
    family_context: bool = False
    islamic_validation_required: bool = True
    
    # Processing context
    token_count: int = 0
    processing_priority: str = "normal"  # low, normal, high, urgent
    regional_context: Optional[str] = None  # baghdad, basra, mosul, etc.
    
    # Performance tracking
    request_id: str = ""
    timestamp: datetime = field(default_factory=datetime.now)

class IraqiTokenCalculator:
    """Enhanced token calculator with Arabic text support"""
    
    def __init__(self):
        self.arabic_calculator = ArabicTokenCalculator()
        self.base_encoding = None
        try:
            from tiktoken import get_encoding
            self.base_encoding = get_encoding("cl100k_base")
        except ImportError:
            self.base_encoding = None
    
    def calculate_total_tokens(self, request: IraqiRoutingRequest) -> int:
        """Calculate total tokens with Arabic text awareness"""
        
        total_tokens = 0
        
        # Calculate message tokens
        if request.messages:
            for message in request.messages:
                total_tokens += self._calculate_message_tokens(message, request.arabic_content_detected)
        
        # Calculate system tokens
        if request.system:
            total_tokens += self._calculate_system_tokens(request.system, request.arabic_content_detected)
        
        # Calculate tools tokens
        if request.tools:
            total_tokens += self._calculate_tools_tokens(request.tools)
        
        # Add cultural context tokens
        if request.cultural_context:
            total_tokens += self._calculate_cultural_tokens(request.cultural_context)
        
        return total_tokens
    
    def _calculate_message_tokens(self, message: Dict[str, Any], arabic_aware: bool = False) -> int:
        """Calculate tokens for a single message with Arabic support"""
        
        tokens = 0
        content = message.get("content", "")
        
        if isinstance(content, str):
            if arabic_aware and self._contains_arabic(content):
                tokens += self.arabic_calculator.calculate_arabic_tokens(content)
            elif self.base_encoding:
                tokens += len(self.base_encoding.encode(content))
            else:
                tokens += len(content.split()) * 1.3  # Rough estimate
                
        elif isinstance(content, list):
            for content_part in content:
                if content_part.get("type") == "text":
                    text = content_part.get("text", "")
                    if arabic_aware and self._contains_arabic(text):
                        tokens += self.arabic_calculator.calculate_arabic_tokens(text)
                    elif self.base_encoding:
                        tokens += len(self.base_encoding.encode(text))
                    else:
                        tokens += len(text.split()) * 1.3
                        
                elif content_part.get("type") == "tool_use":
                    tool_input = content_part.get("input", {})
                    if self.base_encoding:
                        tokens += len(self.base_encoding.encode(json.dumps(tool_input)))
                    else:
                        tokens += len(str(tool_input)) // 4
                        
                elif content_part.get("type") == "tool_result":
                    result_content = content_part.get("content", "")
                    if isinstance(result_content, str):
                        if self.base_encoding:
                            tokens += len(self.base_encoding.encode(result_content))
                        else:
                            tokens += len(result_content) // 4
                    else:
                        if self.base_encoding:
                            tokens += len(self.base_encoding.encode(json.dumps(result_content)))
                        else:
                            tokens += len(str(result_content)) // 4
        
        return tokens
    
    def _calculate_system_tokens(self, system: Union[str, List[Dict[str, Any]]], arabic_aware: bool = False) -> int:
        """Calculate system prompt tokens with Arabic support"""
        
        if isinstance(system, str):
            if arabic_aware and self._contains_arabic(system):
                return self.arabic_calculator.calculate_arabic_tokens(system)
            elif self.base_encoding:
                return len(self.base_encoding.encode(system))
            else:
                return len(system.split()) * 1.3
                
        elif isinstance(system, list):
            total_tokens = 0
            for item in system:
                if item.get("type") == "text":
                    text = item.get("text", "")
                    if isinstance(text, str):
                        if arabic_aware and self._contains_arabic(text):
                            total_tokens += self.arabic_calculator.calculate_arabic_tokens(text)
                        elif self.base_encoding:
                            total_tokens += len(self.base_encoding.encode(text))
                        else:
                            total_tokens += len(text.split()) * 1.3
                    elif isinstance(text, list):
                        for text_part in text:
                            if text_part:
                                if arabic_aware and self._contains_arabic(str(text_part)):
                                    total_tokens += self.arabic_calculator.calculate_arabic_tokens(str(text_part))
                                elif self.base_encoding:
                                    total_tokens += len(self.base_encoding.encode(str(text_part)))
                                else:
                                    total_tokens += len(str(text_part).split()) * 1.3
            return total_tokens
        
        return 0
    
    def _calculate_tools_tokens(self, tools: List[Dict[str, Any]]) -> int:
        """Calculate tools tokens"""
        
        total_tokens = 0
        for tool in tools:
            tool_name = tool.get("name", "")
            tool_description = tool.get("description", "")
            tool_schema = tool.get("input_schema", {})
            
            if self.base_encoding:
                total_tokens += len(self.base_encoding.encode(tool_name + tool_description))
                total_tokens += len(self.base_encoding.encode(json.dumps(tool_schema)))
            else:
                total_tokens += len((tool_name + tool_description).split()) * 1.3
                total_tokens += len(str(tool_schema)) // 4
        
        return total_tokens
    
    def _calculate_cultural_tokens(self, cultural_context: Dict[str, Any]) -> int:
        """Calculate cultural context tokens"""
        
        context_str = json.dumps(cultural_context)
        if self.base_encoding:
            return len(self.base_encoding.encode(context_str))
        else:
            return len(context_str) // 4
    
    def _contains_arabic(self, text: str) -> bool:
        """Check if text contains Arabic characters"""
        return any('\u0600' <= char <= '\u06FF' for char in text)

class IraqiModelRouter:
    """Enhanced model router with Iraqi cultural and professional awareness"""
    
    def __init__(self, config: IraqiRouterConfig):
        self.config = config
        self.token_calculator = IraqiTokenCalculator()
        self.cultural_router = IslamicComplianceRouter()
        self.professional_router = ProfessionalDomainRouter()
        self.payment_router = PaymentGatewayRouter()
        self.rtl_processor = RTLContentProcessor()
        self.logger = logging.getLogger("IraqiModelRouter")
        
        # Performance tracking
        self.routing_history: List[Dict[str, Any]] = []
        self.performance_metrics: Dict[str, Any] = {}
        self._initialize_metrics()
    
    def _initialize_metrics(self):
        """Initialize performance tracking"""
        self.performance_metrics = {
            "total_routes": 0,
            "cultural_routes": 0,
            "arabic_routes": 0,
            "payment_routes": 0,
            "professional_routes": 0,
            "long_context_routes": 0,
            "average_tokens": 0.0,
            "routing_errors": 0,
            "start_time": datetime.now()
        }
    
    async def route_request(self, request: IraqiRoutingRequest) -> str:
        """Route request to optimal model with Iraqi enhancements"""
        
        routing_start = datetime.now()
        
        try:
            # Pre-process request for Iraqi context
            await self._preprocess_iraqi_request(request)
            
            # Calculate tokens with Arabic awareness
            request.token_count = self.token_calculator.calculate_total_tokens(request)
            
            # Determine routing strategy
            routing_strategy = await self._determine_routing_strategy(request)
            
            # Apply Iraqi-specific routing logic
            model = await self._apply_iraqi_routing(request, routing_strategy)
            
            # Post-process and validate
            validated_model = await self._validate_model_selection(model, request)
            
            # Record routing decision
            await self._record_routing_decision(request, validated_model, routing_start)
            
            return validated_model
            
        except Exception as e:
            self.logger.error(f"Routing failed for request {request.request_id}: {str(e)}")
            self.performance_metrics["routing_errors"] += 1
            return self.config.default_model
    
    async def _preprocess_iraqi_request(self, request: IraqiRoutingRequest):
        """Preprocess request for Iraqi context detection"""
        
        # Detect Arabic content
        request.arabic_content_detected = await self._detect_arabic_content(request)
        
        # Extract cultural context
        cultural_context = await self._extract_cultural_context(request)
        request.cultural_context.update(cultural_context)
        
        # Detect professional domain
        professional_domain = await self._detect_professional_domain(request)
        if professional_domain:
            request.professional_domain = professional_domain
        
        # Detect payment context
        payment_context = await self._detect_payment_context(request)
        if payment_context:
            request.payment_context = payment_context
        
        # Check family context
        request.family_context = await self._detect_family_context(request)
        
        # Extract regional context
        regional_context = await self._detect_regional_context(request)
        if regional_context:
            request.regional_context = regional_context
    
    async def _determine_routing_strategy(self, request: IraqiRoutingRequest) -> IraqiRouterType:
        """Determine optimal routing strategy based on request analysis"""
        
        # High priority: Cultural validation required
        if (request.cultural_context.get("sensitive_content") or 
            request.family_context and self.config.cultural_validation_required):
            return IraqiRouterType.CULTURAL_VALIDATION
        
        # High priority: Payment gateway context
        if request.payment_context and self.config.payment_gateway_routing:
            return IraqiRouterType.PAYMENT_GATEWAY
        
        # High priority: Professional domain
        if request.professional_domain and self.config.professional_domain_routing:
            return IraqiRouterType.PROFESSIONAL_DOMAIN
        
        # Medium priority: Arabic processing
        if (request.arabic_content_detected and 
            request.token_count > self.config.arabic_processing_threshold):
            return IraqiRouterType.ARABIC_PROCESSING
        
        # Medium priority: Long context
        if request.token_count > self.config.long_context_threshold:
            return IraqiRouterType.LONG_CONTEXT
        
        # Low priority: Web search
        if self._has_web_search_tools(request):
            return IraqiRouterType.WEB_SEARCH
        
        # Default routing
        return IraqiRouterType.DEFAULT
    
    async def _apply_iraqi_routing(self, request: IraqiRoutingRequest, 
                                  strategy: IraqiRouterType) -> str:
        """Apply Iraqi-specific routing logic"""
        
        if strategy == IraqiRouterType.CULTURAL_VALIDATION:
            return await self._route_cultural_validation(request)
        elif strategy == IraqiRouterType.PAYMENT_GATEWAY:
            return await self._route_payment_gateway(request)
        elif strategy == IraqiRouterType.PROFESSIONAL_DOMAIN:
            return await self._route_professional_domain(request)
        elif strategy == IraqiRouterType.ARABIC_PROCESSING:
            return await self._route_arabic_processing(request)
        elif strategy == IraqiRouterType.LONG_CONTEXT:
            return self.config.long_context_model or self.config.default_model
        elif strategy == IraqiRouterType.WEB_SEARCH:
            return self.config.web_search_model or self.config.default_model
        else:
            return self.config.default_model
    
    async def _route_cultural_validation(self, request: IraqiRoutingRequest) -> str:
        """Route requests requiring cultural validation"""
        
        # Check Islamic compliance requirements
        compliance_result = await self.cultural_router.validate_islamic_compliance(
            request.messages, request.cultural_context
        )
        
        if compliance_result["requires_specialized_model"]:
            # Use specialized model for Islamic compliance
            return compliance_result["recommended_model"]
        
        # Use default with enhanced cultural validation
        return self.config.default_model
    
    async def _route_payment_gateway(self, request: IraqiRoutingRequest) -> str:
        """Route payment gateway requests"""
        
        gateway_config = await self.payment_router.get_gateway_routing_config(
            request.payment_context
        )
        
        return gateway_config.get("preferred_model", self.config.default_model)
    
    async def _route_professional_domain(self, request: IraqiRoutingRequest) -> str:
        """Route professional domain requests"""
        
        domain_config = await self.professional_router.get_domain_routing_config(
            request.professional_domain,
            request.regional_context
        )
        
        return domain_config.get("preferred_model", self.config.default_model)
    
    async def _route_arabic_processing(self, request: IraqiRoutingRequest) -> str:
        """Route Arabic processing requests"""
        
        # Check if specialized Arabic model is available
        arabic_config = await self.rtl_processor.get_arabic_routing_config(
            request.messages,
            request.cultural_context.get("dialect", "iraqi")
        )
        
        return arabic_config.get("preferred_model", self.config.default_model)
    
    async def _validate_model_selection(self, model: str, request: IraqiRoutingRequest) -> str:
        """Validate final model selection"""
        
        # Ensure model supports required features
        if request.arabic_content_detected:
            if not await self._model_supports_arabic(model):
                self.logger.warning(f"Model {model} may not support Arabic, using default")
                return self.config.default_model
        
        # Validate cultural compliance capability
        if request.islamic_validation_required:
            if not await self._model_supports_cultural_validation(model):
                self.logger.warning(f"Model {model} may not support cultural validation")
        
        return model
    
    async def _detect_arabic_content(self, request: IraqiRoutingRequest) -> bool:
        """Detect if request contains Arabic content"""
        
        # Check messages for Arabic content
        for message in request.messages:
            content = message.get("content", "")
            if isinstance(content, str) and self._contains_arabic_text(content):
                return True
            elif isinstance(content, list):
                for part in content:
                    if part.get("type") == "text" and self._contains_arabic_text(part.get("text", "")):
                        return True
        
        # Check system prompt
        if isinstance(request.system, str) and self._contains_arabic_text(request.system):
            return True
        
        return False
    
    def _contains_arabic_text(self, text: str) -> bool:
        """Check if text contains Arabic characters"""
        if not text:
            return False
        
        arabic_chars = 0
        total_chars = len([c for c in text if c.isalpha()])
        
        for char in text:
            if '\u0600' <= char <= '\u06FF':  # Arabic Unicode range
                arabic_chars += 1
        
        # Consider Arabic if more than 10% of alphabetic characters are Arabic
        return total_chars > 0 and (arabic_chars / total_chars) > 0.1
    
    async def _extract_cultural_context(self, request: IraqiRoutingRequest) -> Dict[str, Any]:
        """Extract cultural context from request"""
        
        context = {
            "family_references": False,
            "religious_references": False,
            "government_references": False,
            "professional_references": False,
            "sensitive_content": False
        }
        
        # Analyze message content for cultural indicators
        for message in request.messages:
            content_str = str(message.get("content", ""))
            
            # Check for family context
            family_keywords = ["عائلة", "أسرة", "أهل", "والدين", "أطفال", "family", "parents", "children"]
            if any(keyword in content_str.lower() for keyword in family_keywords):
                context["family_references"] = True
            
            # Check for religious context
            religious_keywords = ["إسلام", "قرآن", "صلاة", "مسجد", "إمام", "islam", "prayer", "mosque"]
            if any(keyword in content_str.lower() for keyword in religious_keywords):
                context["religious_references"] = True
            
            # Check for government context
            gov_keywords = ["حكومة", "وزارة", "مؤسسة", "government", "ministry", "department"]
            if any(keyword in content_str.lower() for keyword in gov_keywords):
                context["government_references"] = True
        
        # Mark as sensitive if multiple cultural contexts detected
        if sum([context["family_references"], context["religious_references"], 
               context["government_references"]]) >= 2:
            context["sensitive_content"] = True
        
        return context
    
    async def _detect_professional_domain(self, request: IraqiRoutingRequest) -> Optional[str]:
        """Detect professional domain from request content"""
        
        domain_keywords = {
            "legal": ["قانون", "محكمة", "قاضي", "law", "court", "legal", "attorney"],
            "medical": ["طبيب", "مستشفى", "دواء", "doctor", "hospital", "medical", "patient"],
            "education": ["مدرسة", "جامعة", "طالب", "school", "university", "student", "teacher"],
            "government": ["حكومة", "وزارة", "مؤسسة", "government", "ministry", "public"]
        }
        
        content_str = ""
        for message in request.messages:
            content_str += str(message.get("content", "")).lower() + " "
        
        for domain, keywords in domain_keywords.items():
            if any(keyword in content_str for keyword in keywords):
                return domain
        
        return None
    
    async def _detect_payment_context(self, request: IraqiRoutingRequest) -> Optional[str]:
        """Detect payment gateway context"""
        
        payment_keywords = {
            "zain_cash": ["زين كاش", "zain cash", "zaincash"],
            "fast_pay": ["فاست باي", "fast pay", "fastpay"],
            "nass_wallet": ["ناس والت", "nass wallet", "nasswallet"]
        }
        
        content_str = ""
        for message in request.messages:
            content_str += str(message.get("content", "")).lower() + " "
        
        for gateway, keywords in payment_keywords.items():
            if any(keyword in content_str for keyword in keywords):
                return gateway
        
        return None
    
    async def _detect_family_context(self, request: IraqiRoutingRequest) -> bool:
        """Detect if request involves family context"""
        return self._extract_cultural_context(request).get("family_references", False)
    
    async def _detect_regional_context(self, request: IraqiRoutingRequest) -> Optional[str]:
        """Detect regional context (Baghdad, Basra, Mosul, etc.)"""
        
        regional_keywords = {
            "baghdad": ["بغداد", "baghdad"],
            "basra": ["البصرة", "basra"],
            "mosul": ["الموصل", "mosul"],
            "erbil": ["أربيل", "erbil"],
            "najaf": ["النجف", "najaf"],
            "karbala": ["كربلاء", "karbala"]
        }
        
        content_str = ""
        for message in request.messages:
            content_str += str(message.get("content", "")).lower() + " "
        
        for region, keywords in regional_keywords.items():
            if any(keyword in content_str for keyword in keywords):
                return region
        
        return None
    
    def _has_web_search_tools(self, request: IraqiRoutingRequest) -> bool:
        """Check if request has web search tools"""
        
        for tool in request.tools:
            tool_type = tool.get("type", "")
            if tool_type.startswith("web_search"):
                return True
        
        return False
    
    async def _model_supports_arabic(self, model: str) -> bool:
        """Check if model supports Arabic processing"""
        # Implementation would check model capabilities
        return True  # Assume all models support Arabic for now
    
    async def _model_supports_cultural_validation(self, model: str) -> bool:
        """Check if model supports cultural validation"""
        # Implementation would check model capabilities
        return True  # Assume all models support cultural validation for now
    
    async def _record_routing_decision(self, request: IraqiRoutingRequest, 
                                      model: str, routing_start: datetime):
        """Record routing decision for analytics"""
        
        routing_time = (datetime.now() - routing_start).total_seconds()
        
        decision = {
            "request_id": request.request_id,
            "model_selected": model,
            "token_count": request.token_count,
            "routing_time": routing_time,
            "arabic_content": request.arabic_content_detected,
            "cultural_context": request.cultural_context,
            "professional_domain": request.professional_domain,
            "payment_context": request.payment_context,
            "family_context": request.family_context,
            "timestamp": datetime.now()
        }
        
        self.routing_history.append(decision)
        
        # Update metrics
        self.performance_metrics["total_routes"] += 1
        
        if request.arabic_content_detected:
            self.performance_metrics["arabic_routes"] += 1
        
        if request.cultural_context:
            self.performance_metrics["cultural_routes"] += 1
        
        if request.payment_context:
            self.performance_metrics["payment_routes"] += 1
        
        if request.professional_domain:
            self.performance_metrics["professional_routes"] += 1
        
        if request.token_count > self.config.long_context_threshold:
            self.performance_metrics["long_context_routes"] += 1
        
        # Update average tokens
        total_routes = self.performance_metrics["total_routes"]
        current_avg = self.performance_metrics["average_tokens"]
        self.performance_metrics["average_tokens"] = (
            (current_avg * (total_routes - 1) + request.token_count) / total_routes
        )
    
    async def get_routing_analytics(self) -> Dict[str, Any]:
        """Get comprehensive routing analytics"""
        
        total_time = (datetime.now() - self.performance_metrics["start_time"]).total_seconds()
        total_routes = self.performance_metrics["total_routes"]
        
        return {
            "total_routes": total_routes,
            "arabic_route_percentage": (
                self.performance_metrics["arabic_routes"] / total_routes * 100
                if total_routes > 0 else 0
            ),
            "cultural_route_percentage": (
                self.performance_metrics["cultural_routes"] / total_routes * 100
                if total_routes > 0 else 0
            ),
            "payment_route_percentage": (
                self.performance_metrics["payment_routes"] / total_routes * 100
                if total_routes > 0 else 0
            ),
            "professional_route_percentage": (
                self.performance_metrics["professional_routes"] / total_routes * 100
                if total_routes > 0 else 0
            ),
            "long_context_percentage": (
                self.performance_metrics["long_context_routes"] / total_routes * 100
                if total_routes > 0 else 0
            ),
            "average_tokens": self.performance_metrics["average_tokens"],
            "routing_errors": self.performance_metrics["routing_errors"],
            "total_session_time": total_time,
            "routes_per_minute": total_routes / (total_time / 60) if total_time > 0 else 0,
            "recent_decisions": self.routing_history[-10:]  # Last 10 decisions
        }

class IraqiAPIRouter:
    """Enhanced API router with Iraqi-specific routing logic and cultural validation"""
    
    def __init__(self, config: IraqiRouterConfig = None):
        self.config = config or IraqiRouterConfig()
        self.model_router = IraqiModelRouter(self.config)
        self.logger = logging.getLogger("IraqiAPIRouter")
        
        # Initialize request counter
        self.request_counter = 0
    
    async def route_api_request(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Main API routing entry point"""
        
        try:
            # Generate request ID
            self.request_counter += 1
            request_id = f"iraqi_req_{self.request_counter}_{int(datetime.now().timestamp())}"
            
            # Create Iraqi routing request
            routing_request = IraqiRoutingRequest(
                request_id=request_id,
                messages=request_data.get("messages", []),
                system=request_data.get("system"),
                tools=request_data.get("tools", []),
                model=request_data.get("model", ""),
                timestamp=datetime.now()
            )
            
            # Route to optimal model
            selected_model = await self.model_router.route_request(routing_request)
            
            # Update request data with selected model
            routed_request = request_data.copy()
            routed_request["model"] = selected_model
            
            # Add Iraqi routing metadata
            routed_request["_iraqi_routing"] = {
                "request_id": request_id,
                "selected_model": selected_model,
                "token_count": routing_request.token_count,
                "arabic_content": routing_request.arabic_content_detected,
                "cultural_context": routing_request.cultural_context,
                "professional_domain": routing_request.professional_domain,
                "routing_timestamp": datetime.now().isoformat()
            }
            
            return routed_request
            
        except Exception as e:
            self.logger.error(f"API routing failed: {str(e)}")
            
            # Fallback to default
            fallback_request = request_data.copy()
            fallback_request["model"] = self.config.default_model
            return fallback_request
    
    async def get_routing_status(self) -> Dict[str, Any]:
        """Get current routing status and analytics"""
        
        analytics = await self.model_router.get_routing_analytics()
        
        return {
            "status": "active",
            "config": {
                "default_model": self.config.default_model,
                "cultural_validation": self.config.cultural_validation_required,
                "arabic_processing": self.config.arabic_processing_enabled,
                "payment_routing": self.config.payment_gateway_routing
            },
            "analytics": analytics,
            "timestamp": datetime.now().isoformat()
        }

# Example usage and testing
async def example_iraqi_api_routing():
    """Example demonstrating Iraqi API routing"""
    
    # Initialize router
    config = IraqiRouterConfig(
        cultural_validation_required=True,
        arabic_processing_enabled=True,
        payment_gateway_routing=True,
        professional_domain_routing=True
    )
    
    router = IraqiAPIRouter(config)
    
    # Test request with Arabic content
    arabic_request = {
        "messages": [
            {
                "role": "user", 
                "content": "أريد مساعدة في إدارة حساب زين كاش للمستشفى"
            }
        ],
        "system": "أنت مساعد ذكي للخدمات المصرفية العراقية",
        "model": "claude-3-5-sonnet-20241022"
    }
    
    # Route the request
    routed_request = await router.route_api_request(arabic_request)
    
    print(f"Original model: {arabic_request['model']}")
    print(f"Routed model: {routed_request['model']}")
    print(f"Routing metadata: {routed_request.get('_iraqi_routing', {})}")
    
    # Get status
    status = await router.get_routing_status()
    print(f"Router status: {status}")
    
    return router

if __name__ == "__main__":
    # Run example
    asyncio.run(example_iraqi_api_routing())