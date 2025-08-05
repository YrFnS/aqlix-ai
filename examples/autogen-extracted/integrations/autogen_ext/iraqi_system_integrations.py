"""
Iraqi System Integration Patterns for AutoGen Extensions

Integration patterns for connecting AutoGen multi-agent systems with Iraqi
government systems, payment gateways, and cultural services.
"""

import asyncio
import json
import aiohttp
from typing import Dict, List, Any, Optional, Union, Callable
from dataclasses import dataclass, field
from enum import Enum
from datetime import datetime, timedelta
import hashlib
import hmac
import base64

# Import AutoGen extension components
from autogen_ext import Tool
from autogen_core import AgentId, MessageContext

# Import Iraqi enhancements
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'core', 'iraqi_enhancements'))

from cultural_validator import IraqiCulturalValidator, ProfessionalDomain


class IraqiSystemType(Enum):
    """Types of Iraqi systems for integration"""
    GOVERNMENT_PORTAL = "government_portal"  # e-government services
    PAYMENT_GATEWAY = "payment_gateway"     # ZainCash, FastPay, NassWallet
    BANKING_SYSTEM = "banking_system"       # Iraqi banks
    TAX_AUTHORITY = "tax_authority"         # General Tax Authority
    CUSTOMS_SYSTEM = "customs_system"       # Customs and borders
    EDUCATION_SYSTEM = "education_system"   # Universities and schools
    HEALTH_SYSTEM = "health_system"         # Hospitals and clinics
    BUSINESS_REGISTRY = "business_registry" # Company registration
    LEGAL_SYSTEM = "legal_system"           # Courts and legal services
    CULTURAL_SERVICES = "cultural_services" # Heritage and cultural institutions


class AuthenticationMethod(Enum):
    """Authentication methods for Iraqi systems"""
    API_KEY = "api_key"
    OAUTH2 = "oauth2"
    JWT_TOKEN = "jwt_token"
    HMAC_SIGNATURE = "hmac_signature"
    DIGITAL_CERTIFICATE = "digital_certificate"
    UNIFIED_ID = "unified_id"  # Iraqi Unified ID system
    BIOMETRIC = "biometric"    # Fingerprint/facial recognition


class IntegrationStatus(Enum):
    """Status of system integration"""
    CONNECTED = "connected"
    DISCONNECTED = "disconnected"
    AUTHENTICATING = "authenticating"
    ERROR = "error"
    MAINTENANCE = "maintenance"
    RATE_LIMITED = "rate_limited"


@dataclass
class IraqiSystemConfig:
    """Configuration for Iraqi system integration"""
    system_type: IraqiSystemType
    system_name: str
    base_url: str
    auth_method: AuthenticationMethod
    credentials: Dict[str, Any]
    timeout_seconds: int = 30
    retry_attempts: int = 3
    rate_limit_per_minute: int = 60
    requires_cultural_validation: bool = True
    supported_languages: List[str] = field(default_factory=lambda: ["ar", "en"])
    business_hours: Dict[str, str] = field(default_factory=dict)
    maintenance_windows: List[Dict[str, str]] = field(default_factory=list)


@dataclass
class IntegrationRequest:
    """Request to Iraqi system"""
    system_config: IraqiSystemConfig
    endpoint: str
    method: str = "GET"
    data: Optional[Dict[str, Any]] = None
    headers: Optional[Dict[str, str]] = None
    cultural_context: Optional[Dict[str, Any]] = None
    require_islamic_compliance: bool = True


@dataclass
class IntegrationResponse:
    """Response from Iraqi system"""
    status_code: int
    data: Any
    headers: Dict[str, str]
    response_time_ms: int
    cultural_validation_passed: bool
    errors: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)


class IraqiSystemIntegrator:
    """
    Base integrator for Iraqi government and business systems
    """
    
    def __init__(self):
        self.cultural_validator = IraqiCulturalValidator()
        self.active_connections: Dict[str, IraqiSystemConfig] = {}
        self.connection_status: Dict[str, IntegrationStatus] = {}
        self.rate_limits: Dict[str, List[datetime]] = {}
        
        # Integration statistics
        self.stats = {
            'total_requests': 0,
            'successful_requests': 0,
            'failed_requests': 0,
            'average_response_time': 0.0,
            'requests_by_system': {},
            'cultural_validation_failures': 0
        }
    
    async def register_system(self, config: IraqiSystemConfig) -> bool:
        """Register an Iraqi system for integration"""
        
        try:
            # Validate configuration
            if not await self._validate_system_config(config):
                return False
            
            # Test connection
            connection_test = await self._test_system_connection(config)
            if not connection_test:
                return False
            
            # Store configuration
            system_key = f"{config.system_type.value}_{config.system_name}"
            self.active_connections[system_key] = config
            self.connection_status[system_key] = IntegrationStatus.CONNECTED
            self.rate_limits[system_key] = []
            
            # Initialize statistics
            self.stats['requests_by_system'][system_key] = {
                'total': 0,
                'successful': 0,
                'failed': 0,
                'average_time': 0.0
            }
            
            return True
            
        except Exception as e:
            print(f"Failed to register system {config.system_name}: {str(e)}")
            return False
    
    async def _validate_system_config(self, config: IraqiSystemConfig) -> bool:
        """Validate system configuration"""
        
        # Check required fields
        if not all([config.system_name, config.base_url, config.auth_method]):
            return False
        
        # Validate URL format
        if not config.base_url.startswith(('http://', 'https://')):
            return False
        
        # Validate credentials based on auth method
        if config.auth_method == AuthenticationMethod.API_KEY:
            if 'api_key' not in config.credentials:
                return False
        elif config.auth_method == AuthenticationMethod.OAUTH2:
            required_fields = ['client_id', 'client_secret']
            if not all(field in config.credentials for field in required_fields):
                return False
        elif config.auth_method == AuthenticationMethod.HMAC_SIGNATURE:
            required_fields = ['access_key', 'secret_key']
            if not all(field in config.credentials for field in required_fields):
                return False
        
        # Validate business hours format if provided
        if config.business_hours:
            required_keys = ['start_time', 'end_time', 'days']
            if not all(key in config.business_hours for key in required_keys):
                return False
        
        return True
    
    async def _test_system_connection(self, config: IraqiSystemConfig) -> bool:
        """Test connection to Iraqi system"""
        
        try:
            # Create test request
            test_request = IntegrationRequest(
                system_config=config,
                endpoint="/health" if config.system_type == IraqiSystemType.GOVERNMENT_PORTAL else "/status",
                method="GET"
            )
            
            # Attempt connection
            response = await self._make_system_request(test_request, test_mode=True)
            
            return response.status_code in [200, 201, 204]
            
        except Exception as e:
            print(f"Connection test failed for {config.system_name}: {str(e)}")
            return False
    
    async def make_request(self, request: IntegrationRequest) -> IntegrationResponse:
        """Make request to Iraqi system with cultural validation"""
        
        system_key = f"{request.system_config.system_type.value}_{request.system_config.system_name}"
        
        # Check if system is registered
        if system_key not in self.active_connections:
            raise ValueError(f"System {system_key} not registered")
        
        # Check connection status
        if self.connection_status[system_key] != IntegrationStatus.CONNECTED:
            raise ValueError(f"System {system_key} is not connected")
        
        # Check rate limits
        if not await self._check_rate_limit(system_key, request.system_config.rate_limit_per_minute):
            raise ValueError(f"Rate limit exceeded for {system_key}")
        
        # Check business hours
        if not await self._check_business_hours(request.system_config):
            raise ValueError(f"System {system_key} is outside business hours")
        
        # Validate cultural appropriateness if required
        if request.system_config.requires_cultural_validation and request.data:
            cultural_valid = await self._validate_request_culturally(request)
            if not cultural_valid:
                self.stats['cultural_validation_failures'] += 1
                raise ValueError("Request failed cultural validation")
        
        # Make the actual request
        response = await self._make_system_request(request)
        
        # Update statistics
        self._update_request_statistics(system_key, response)
        
        return response
    
    async def _check_rate_limit(self, system_key: str, limit_per_minute: int) -> bool:
        """Check if request is within rate limits"""
        
        now = datetime.now()
        minute_ago = now - timedelta(minutes=1)
        
        # Clean old requests
        self.rate_limits[system_key] = [
            req_time for req_time in self.rate_limits[system_key]
            if req_time > minute_ago
        ]
        
        # Check current rate
        if len(self.rate_limits[system_key]) >= limit_per_minute:
            return False
        
        # Add current request
        self.rate_limits[system_key].append(now)
        return True
    
    async def _check_business_hours(self, config: IraqiSystemConfig) -> bool:
        """Check if current time is within business hours"""
        
        if not config.business_hours:
            return True  # No business hours restriction
        
        now = datetime.now()
        current_day = now.strftime('%A').lower()
        current_time = now.time()
        
        # Check if current day is in business days
        business_days = [day.lower() for day in config.business_hours.get('days', [])]
        if business_days and current_day not in business_days:
            return False
        
        # Check time range
        start_time_str = config.business_hours.get('start_time', '00:00')
        end_time_str = config.business_hours.get('end_time', '23:59')
        
        try:
            start_time = datetime.strptime(start_time_str, '%H:%M').time()
            end_time = datetime.strptime(end_time_str, '%H:%M').time()
            
            return start_time <= current_time <= end_time
            
        except ValueError:
            return True  # If time parsing fails, allow request
    
    async def _validate_request_culturally(self, request: IntegrationRequest) -> bool:
        """Validate request for cultural appropriateness"""
        
        if not request.data:
            return True
        
        # Extract text content for validation
        text_content = self._extract_text_from_data(request.data)
        if not text_content:
            return True
        
        # Determine professional domain based on system type
        domain_mapping = {
            IraqiSystemType.GOVERNMENT_PORTAL: ProfessionalDomain.GOVERNMENT,
            IraqiSystemType.LEGAL_SYSTEM: ProfessionalDomain.LEGAL,
            IraqiSystemType.HEALTH_SYSTEM: ProfessionalDomain.MEDICAL,
            IraqiSystemType.EDUCATION_SYSTEM: ProfessionalDomain.EDUCATIONAL,
            IraqiSystemType.BUSINESS_REGISTRY: ProfessionalDomain.BUSINESS
        }
        
        domain = domain_mapping.get(
            request.system_config.system_type, 
            ProfessionalDomain.GENERAL
        )
        
        # Validate content
        validation_result = self.cultural_validator.validate_message_content(
            content=text_content,
            domain=domain,
            context=request.cultural_context or {}
        )
        
        return not validation_result.requires_human_review
    
    def _extract_text_from_data(self, data: Dict[str, Any]) -> str:
        """Extract text content from request data for validation"""
        
        text_parts = []
        
        def extract_recursive(obj):
            if isinstance(obj, str):
                text_parts.append(obj)
            elif isinstance(obj, dict):
                for value in obj.values():
                    extract_recursive(value)
            elif isinstance(obj, list):
                for item in obj:
                    extract_recursive(item)
        
        extract_recursive(data)
        return " ".join(text_parts)
    
    async def _make_system_request(
        self, 
        request: IntegrationRequest, 
        test_mode: bool = False
    ) -> IntegrationResponse:
        """Make actual HTTP request to Iraqi system"""
        
        start_time = datetime.now()
        
        try:
            # Prepare headers
            headers = request.headers or {}
            headers.update(await self._prepare_auth_headers(request.system_config))
            
            # Add cultural headers
            headers['Accept-Language'] = 'ar,en'
            headers['X-Cultural-Context'] = 'iraqi'
            
            if request.require_islamic_compliance:
                headers['X-Islamic-Compliance'] = 'required'
            
            # Prepare URL
            url = f"{request.system_config.base_url.rstrip('/')}/{request.endpoint.lstrip('/')}"
            
            # Make request
            async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(
                total=request.system_config.timeout_seconds
            )) as session:
                
                async with session.request(
                    method=request.method,
                    url=url,
                    json=request.data if request.method in ['POST', 'PUT', 'PATCH'] else None,
                    params=request.data if request.method == 'GET' else None,
                    headers=headers
                ) as response:
                    
                    response_data = await self._parse_response_data(response)
                    response_time = (datetime.now() - start_time).total_seconds() * 1000
                    
                    # Validate response culturally if not in test mode
                    cultural_validation_passed = True
                    if not test_mode and request.system_config.requires_cultural_validation:
                        cultural_validation_passed = await self._validate_response_culturally(
                            response_data, request.system_config.system_type
                        )
                    
                    return IntegrationResponse(
                        status_code=response.status,
                        data=response_data,
                        headers=dict(response.headers),
                        response_time_ms=int(response_time),
                        cultural_validation_passed=cultural_validation_passed
                    )
        
        except asyncio.TimeoutError:
            return IntegrationResponse(
                status_code=408,
                data={'error': 'Request timeout'},
                headers={},
                response_time_ms=(datetime.now() - start_time).total_seconds() * 1000,
                cultural_validation_passed=False,
                errors=['Request timeout']
            )
        
        except Exception as e:
            return IntegrationResponse(
                status_code=500,
                data={'error': str(e)},
                headers={},
                response_time_ms=(datetime.now() - start_time).total_seconds() * 1000,
                cultural_validation_passed=False,
                errors=[str(e)]
            )
    
    async def _prepare_auth_headers(self, config: IraqiSystemConfig) -> Dict[str, str]:
        """Prepare authentication headers based on auth method"""
        
        headers = {}
        
        if config.auth_method == AuthenticationMethod.API_KEY:
            headers['X-API-Key'] = config.credentials['api_key']
            
        elif config.auth_method == AuthenticationMethod.JWT_TOKEN:
            headers['Authorization'] = f"Bearer {config.credentials['jwt_token']}"
            
        elif config.auth_method == AuthenticationMethod.HMAC_SIGNATURE:
            # Generate HMAC signature
            timestamp = str(int(datetime.now().timestamp()))
            access_key = config.credentials['access_key']
            secret_key = config.credentials['secret_key']
            
            message = f"{access_key}{timestamp}"
            signature = hmac.new(
                secret_key.encode('utf-8'),
                message.encode('utf-8'),
                hashlib.sha256
            ).hexdigest()
            
            headers['X-Access-Key'] = access_key
            headers['X-Timestamp'] = timestamp
            headers['X-Signature'] = signature
            
        elif config.auth_method == AuthenticationMethod.OAUTH2:
            # Assume OAuth2 token is already obtained and stored
            if 'access_token' in config.credentials:
                headers['Authorization'] = f"Bearer {config.credentials['access_token']}"
        
        return headers
    
    async def _parse_response_data(self, response: aiohttp.ClientResponse) -> Any:
        """Parse response data based on content type"""
        
        content_type = response.headers.get('Content-Type', '').lower()
        
        if 'application/json' in content_type:
            return await response.json()
        elif 'text/' in content_type:
            return await response.text()
        else:
            return await response.read()
    
    async def _validate_response_culturally(
        self, 
        response_data: Any, 
        system_type: IraqiSystemType
    ) -> bool:
        """Validate response for cultural appropriateness"""
        
        # Extract text from response
        if isinstance(response_data, dict):
            text_content = self._extract_text_from_data(response_data)
        elif isinstance(response_data, str):
            text_content = response_data
        else:
            return True  # Can't validate non-text responses
        
        if not text_content:
            return True
        
        # Validate using cultural validator
        domain_mapping = {
            IraqiSystemType.GOVERNMENT_PORTAL: ProfessionalDomain.GOVERNMENT,
            IraqiSystemType.LEGAL_SYSTEM: ProfessionalDomain.LEGAL,
            IraqiSystemType.HEALTH_SYSTEM: ProfessionalDomain.MEDICAL,
            IraqiSystemType.EDUCATION_SYSTEM: ProfessionalDomain.EDUCATIONAL,
            IraqiSystemType.BUSINESS_REGISTRY: ProfessionalDomain.BUSINESS
        }
        
        domain = domain_mapping.get(system_type, ProfessionalDomain.GENERAL)
        
        validation_result = self.cultural_validator.validate_message_content(
            content=text_content,
            domain=domain,
            context={}
        )
        
        return not validation_result.requires_human_review
    
    def _update_request_statistics(self, system_key: str, response: IntegrationResponse) -> None:
        """Update request statistics"""
        
        self.stats['total_requests'] += 1
        
        if response.status_code < 400:
            self.stats['successful_requests'] += 1
            self.stats['requests_by_system'][system_key]['successful'] += 1
        else:
            self.stats['failed_requests'] += 1
            self.stats['requests_by_system'][system_key]['failed'] += 1
        
        self.stats['requests_by_system'][system_key]['total'] += 1
        
        # Update average response time
        total_requests = self.stats['total_requests']
        current_avg = self.stats['average_response_time']
        self.stats['average_response_time'] = (
            (current_avg * (total_requests - 1) + response.response_time_ms) / total_requests
        )
        
        # Update system-specific average
        system_stats = self.stats['requests_by_system'][system_key]
        system_total = system_stats['total']
        system_avg = system_stats['average_time']
        system_stats['average_time'] = (
            (system_avg * (system_total - 1) + response.response_time_ms) / system_total
        )
    
    def get_system_status(self, system_key: str) -> Dict[str, Any]:
        """Get status of specific system"""
        
        return {
            'system_key': system_key,
            'status': self.connection_status.get(system_key, IntegrationStatus.DISCONNECTED).value,
            'statistics': self.stats['requests_by_system'].get(system_key, {}),
            'last_request': self.rate_limits.get(system_key, [])[-1] if self.rate_limits.get(system_key) else None
        }
    
    def get_overall_statistics(self) -> Dict[str, Any]:
        """Get overall integration statistics"""
        return self.stats.copy()


class IraqiPaymentGatewayIntegrator(IraqiSystemIntegrator):
    """
    Specialized integrator for Iraqi payment gateways
    """
    
    def __init__(self):
        super().__init__()
        self.supported_gateways = {
            'zaincash': {
                'name': 'ZainCash',
                'min_amount': 1000,  # IQD
                'max_amount': 5000000,  # IQD
                'currency': 'IQD',
                'auth_method': AuthenticationMethod.HMAC_SIGNATURE
            },
            'fastpay': {
                'name': 'FastPay',
                'min_amount': 500,  # IQD
                'max_amount': 10000000,  # IQD
                'currency': 'IQD',
                'auth_method': AuthenticationMethod.API_KEY
            },
            'nasswallet': {
                'name': 'NassWallet',
                'min_amount': 1000,  # IQD
                'max_amount': 5000000,  # IQD
                'currency': 'IQD',
                'auth_method': AuthenticationMethod.JWT_TOKEN
            }
        }
    
    async def process_payment(
        self,
        gateway_key: str,
        amount: int,
        currency: str,
        customer_info: Dict[str, Any],
        order_id: str,
        islamic_compliance_check: bool = True
    ) -> IntegrationResponse:
        """Process payment through Iraqi gateway"""
        
        # Validate gateway
        if gateway_key not in self.supported_gateways:
            raise ValueError(f"Unsupported gateway: {gateway_key}")
        
        gateway_info = self.supported_gateways[gateway_key]
        
        # Validate amount
        if amount < gateway_info['min_amount'] or amount > gateway_info['max_amount']:
            raise ValueError(
                f"Amount {amount} outside range {gateway_info['min_amount']}-{gateway_info['max_amount']}"
            )
        
        # Validate currency
        if currency != gateway_info['currency']:
            raise ValueError(f"Unsupported currency {currency}, expected {gateway_info['currency']}")
        
        # Islamic compliance check
        if islamic_compliance_check:
            compliance_valid = await self._validate_payment_islamic_compliance(
                amount, customer_info, order_id
            )
            if not compliance_valid:
                raise ValueError("Payment does not meet Islamic compliance requirements")
        
        # Create payment request
        system_key = f"payment_gateway_{gateway_key}"
        
        if system_key not in self.active_connections:
            raise ValueError(f"Payment gateway {gateway_key} not configured")
        
        payment_data = {
            'amount': amount,
            'currency': currency,
            'order_id': order_id,
            'customer': customer_info,
            'islamic_compliant': islamic_compliance_check,
            'timestamp': datetime.now().isoformat()
        }
        
        request = IntegrationRequest(
            system_config=self.active_connections[system_key],
            endpoint="/payment/process",
            method="POST",
            data=payment_data,
            require_islamic_compliance=islamic_compliance_check
        )
        
        return await self.make_request(request)
    
    async def _validate_payment_islamic_compliance(
        self,
        amount: int,
        customer_info: Dict[str, Any],
        order_id: str
    ) -> bool:
        """Validate payment for Islamic compliance"""
        
        # Check for prohibited business types
        prohibited_keywords = [
            'alcohol', 'كحول', 'خمر',
            'gambling', 'قمار', 'مراهنة',
            'interest', 'ربا', 'فوائد',
            'pork', 'خنزير'
        ]
        
        # Check customer info and order details
        order_description = customer_info.get('order_description', '').lower()
        
        for keyword in prohibited_keywords:
            if keyword in order_description:
                return False
        
        # Additional Islamic compliance checks can be added here
        return True
    
    async def refund_payment(
        self,
        gateway_key: str,
        transaction_id: str,
        amount: int,
        reason: str
    ) -> IntegrationResponse:
        """Process payment refund"""
        
        system_key = f"payment_gateway_{gateway_key}"
        
        if system_key not in self.active_connections:
            raise ValueError(f"Payment gateway {gateway_key} not configured")
        
        refund_data = {
            'transaction_id': transaction_id,
            'amount': amount,
            'reason': reason,
            'timestamp': datetime.now().isoformat()
        }
        
        request = IntegrationRequest(
            system_config=self.active_connections[system_key],
            endpoint="/payment/refund",
            method="POST",
            data=refund_data
        )
        
        return await self.make_request(request)


class IraqiGovernmentPortalIntegrator(IraqiSystemIntegrator):
    """
    Specialized integrator for Iraqi government e-services
    """
    
    def __init__(self):
        super().__init__()
        self.available_services = {
            'business_registration': {
                'name': 'Business Registration',
                'endpoint': '/services/business/register',
                'required_docs': ['national_id', 'business_plan', 'location_permit']
            },
            'tax_filing': {
                'name': 'Tax Filing',
                'endpoint': '/services/tax/file',
                'required_docs': ['financial_statements', 'receipts', 'previous_returns']
            },
            'passport_renewal': {
                'name': 'Passport Renewal',
                'endpoint': '/services/passport/renew',
                'required_docs': ['current_passport', 'photos', 'residency_proof']
            },
            'university_enrollment': {
                'name': 'University Enrollment',
                'endpoint': '/services/education/enroll',
                'required_docs': ['high_school_certificate', 'national_id', 'medical_report']
            }
        }
    
    async def submit_service_request(
        self,
        service_key: str,
        applicant_info: Dict[str, Any],
        documents: List[Dict[str, Any]],
        cultural_context: Optional[Dict[str, Any]] = None
    ) -> IntegrationResponse:
        """Submit government service request"""
        
        if service_key not in self.available_services:
            raise ValueError(f"Unknown service: {service_key}")
        
        service_info = self.available_services[service_key]
        
        # Validate required documents
        provided_docs = [doc['type'] for doc in documents]
        missing_docs = set(service_info['required_docs']) - set(provided_docs)
        
        if missing_docs:
            raise ValueError(f"Missing required documents: {list(missing_docs)}")
        
        # Prepare request data with cultural context
        request_data = {
            'service': service_key,
            'applicant': applicant_info,
            'documents': documents,
            'submission_date': datetime.now().isoformat(),
            'cultural_context': cultural_context or {},
            'language_preference': 'ar'  # Default to Arabic
        }
        
        system_key = "government_portal_main"
        
        if system_key not in self.active_connections:
            raise ValueError("Government portal not configured")
        
        request = IntegrationRequest(
            system_config=self.active_connections[system_key],
            endpoint=service_info['endpoint'],
            method="POST",
            data=request_data,
            cultural_context=cultural_context,
            require_islamic_compliance=True
        )
        
        return await self.make_request(request)
    
    async def check_service_status(
        self,
        application_id: str,
        service_key: str
    ) -> IntegrationResponse:
        """Check status of government service application"""
        
        system_key = "government_portal_main"
        
        if system_key not in self.active_connections:
            raise ValueError("Government portal not configured")
        
        request = IntegrationRequest(
            system_config=self.active_connections[system_key],
            endpoint=f"/services/status/{application_id}",
            method="GET",
            data={'service_type': service_key}
        )
        
        return await self.make_request(request)


class IraqiSystemIntegrationTool(Tool):
    """
    AutoGen Tool for Iraqi system integrations
    """
    
    def __init__(self):
        super().__init__(
            name="iraqi_system_integration",
            description="Integration tool for Iraqi government and business systems"
        )
        self.integrator = IraqiSystemIntegrator()
        self.payment_integrator = IraqiPaymentGatewayIntegrator()
        self.government_integrator = IraqiGovernmentPortalIntegrator()
    
    async def run(
        self,
        action: str,
        system_type: str,
        **kwargs
    ) -> Dict[str, Any]:
        """Execute Iraqi system integration action"""
        
        try:
            if action == "register_system":
                return await self._register_system(system_type, **kwargs)
            elif action == "make_request":
                return await self._make_request(system_type, **kwargs)
            elif action == "process_payment":
                return await self._process_payment(**kwargs)
            elif action == "submit_government_service":
                return await self._submit_government_service(**kwargs)
            elif action == "get_system_status":
                return await self._get_system_status(system_type, **kwargs)
            else:
                return {
                    'success': False,
                    'error': f"Unknown action: {action}"
                }
        
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    async def _register_system(self, system_type: str, **kwargs) -> Dict[str, Any]:
        """Register Iraqi system"""
        
        try:
            system_config = IraqiSystemConfig(
                system_type=IraqiSystemType(system_type),
                system_name=kwargs['system_name'],
                base_url=kwargs['base_url'],
                auth_method=AuthenticationMethod(kwargs['auth_method']),
                credentials=kwargs['credentials'],
                timeout_seconds=kwargs.get('timeout_seconds', 30),
                rate_limit_per_minute=kwargs.get('rate_limit_per_minute', 60)
            )
            
            success = await self.integrator.register_system(system_config)
            
            return {
                'success': success,
                'system_key': f"{system_type}_{kwargs['system_name']}"
            }
        
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    async def _make_request(self, system_type: str, **kwargs) -> Dict[str, Any]:
        """Make request to Iraqi system"""
        
        try:
            system_key = f"{system_type}_{kwargs['system_name']}"
            config = self.integrator.active_connections[system_key]
            
            request = IntegrationRequest(
                system_config=config,
                endpoint=kwargs['endpoint'],
                method=kwargs.get('method', 'GET'),
                data=kwargs.get('data'),
                cultural_context=kwargs.get('cultural_context')
            )
            
            response = await self.integrator.make_request(request)
            
            return {
                'success': response.status_code < 400,
                'status_code': response.status_code,
                'data': response.data,
                'response_time_ms': response.response_time_ms,
                'cultural_validation_passed': response.cultural_validation_passed
            }
        
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    async def _process_payment(self, **kwargs) -> Dict[str, Any]:
        """Process payment through Iraqi gateway"""
        
        try:
            response = await self.payment_integrator.process_payment(
                gateway_key=kwargs['gateway'],
                amount=kwargs['amount'],
                currency=kwargs['currency'],
                customer_info=kwargs['customer_info'],
                order_id=kwargs['order_id'],
                islamic_compliance_check=kwargs.get('islamic_compliance', True)
            )
            
            return {
                'success': response.status_code < 400,
                'status_code': response.status_code,
                'data': response.data,
                'cultural_validation_passed': response.cultural_validation_passed
            }
        
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    async def _submit_government_service(self, **kwargs) -> Dict[str, Any]:
        """Submit government service request"""
        
        try:
            response = await self.government_integrator.submit_service_request(
                service_key=kwargs['service'],
                applicant_info=kwargs['applicant_info'],
                documents=kwargs['documents'],
                cultural_context=kwargs.get('cultural_context')
            )
            
            return {
                'success': response.status_code < 400,
                'status_code': response.status_code,
                'data': response.data,
                'cultural_validation_passed': response.cultural_validation_passed
            }
        
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    async def _get_system_status(self, system_type: str, **kwargs) -> Dict[str, Any]:
        """Get system status"""
        
        try:
            system_key = f"{system_type}_{kwargs['system_name']}"
            status = self.integrator.get_system_status(system_key)
            
            return {
                'success': True,
                'status': status
            }
        
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }


# Example usage
async def main():
    """Example usage of Iraqi system integrations"""
    
    # Initialize integrators
    integrator = IraqiSystemIntegrator()
    payment_integrator = IraqiPaymentGatewayIntegrator()
    government_integrator = IraqiGovernmentPortalIntegrator()
    
    print("Iraqi System Integration Examples:")
    print("=" * 50)
    
    # Example 1: Register government portal
    gov_config = IraqiSystemConfig(
        system_type=IraqiSystemType.GOVERNMENT_PORTAL,
        system_name="main_portal",
        base_url="https://egov.gov.iq/api",
        auth_method=AuthenticationMethod.API_KEY,
        credentials={'api_key': 'demo_key'},
        business_hours={
            'start_time': '08:00',
            'end_time': '16:00',
            'days': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']
        }
    )
    
    print("\n1. Government Portal Registration:")
    gov_registered = await integrator.register_system(gov_config)
    print(f"   Registered: {gov_registered}")
    
    # Example 2: Register payment gateway
    zaincash_config = IraqiSystemConfig(
        system_type=IraqiSystemType.PAYMENT_GATEWAY,
        system_name="zaincash",
        base_url="https://api.zaincash.iq",
        auth_method=AuthenticationMethod.HMAC_SIGNATURE,
        credentials={
            'access_key': 'demo_access_key',
            'secret_key': 'demo_secret_key'
        },
        rate_limit_per_minute=30
    )
    
    print("\n2. ZainCash Payment Gateway Registration:")
    payment_registered = await payment_integrator.register_system(zaincash_config)
    print(f"   Registered: {payment_registered}")
    
    # Example 3: Process payment (simulation)
    if payment_registered:
        print("\n3. Process Payment (Simulation):")
        try:
            # This would fail in demo mode, but shows the structure
            payment_response = await payment_integrator.process_payment(
                gateway_key="zaincash",
                amount=50000,  # 50,000 IQD
                currency="IQD",
                customer_info={
                    'name': 'أحمد محمد',
                    'phone': '+964770123456',
                    'order_description': 'كتب تعليمية'
                },
                order_id="ORDER_2025_001",
                islamic_compliance_check=True
            )
            print(f"   Payment Status: {payment_response.status_code}")
        except Exception as e:
            print(f"   Payment Error (Expected in Demo): {str(e)}")
    
    # Example 4: Integration statistics
    print("\n4. Integration Statistics:")
    stats = integrator.get_overall_statistics()
    print(f"   Total Requests: {stats['total_requests']}")
    print(f"   Successful: {stats['successful_requests']}")
    print(f"   Failed: {stats['failed_requests']}")
    print(f"   Average Response Time: {stats['average_response_time']:.2f}ms")
    
    # Example 5: System status
    print("\n5. System Status:")
    for system_key in integrator.active_connections.keys():
        status = integrator.get_system_status(system_key)
        print(f"   {system_key}: {status['status']}")


if __name__ == "__main__":
    asyncio.run(main())