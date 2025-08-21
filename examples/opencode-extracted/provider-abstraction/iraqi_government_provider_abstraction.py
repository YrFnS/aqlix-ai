#!/usr/bin/env python3
"""
🇮🇶 Iraqi Government Provider Abstraction System
===============================================

Provider abstraction layer with Iraqi government service integration, secure authentication,
and comprehensive cultural validation for government service providers.

Features:
- Iraqi government service provider integration with secure authentication
- Ministry-specific provider configurations with cultural context awareness
- Professional domain service discovery (legal, medical, educational, administrative)
- Islamic compliance validation for all external service providers
- Government API abstraction with Iraqi digital infrastructure compatibility
- Cultural context preservation across provider communications

Author: Iraqi AI Development Team
Date: August 21, 2025
Version: 2.1.0
License: Government Use Only - Iraqi Ministry of Digital Transformation
"""

import asyncio
import json
import logging
import hashlib
import hmac
import base64
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple, Union, Callable, Type
from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path
import aiofiles
import aiohttp
import ssl
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from abc import ABC, abstractmethod
import asyncio
import weakref

# Cultural and security imports
from cultural_validation import IraqiCulturalValidator, IslamicComplianceChecker
from arabic_processor import ArabicDialectProcessor, RTLTextAnalyzer
from security_manager import IraqiGovernmentSecurityManager, EncryptionService


class ProviderType(Enum):
    """Types of Iraqi government service providers"""
    GOVERNMENT_API = "government_api"
    MINISTRY_SERVICE = "ministry_service"
    DIGITAL_IRAQ = "digital_iraq"
    BANKING_SERVICE = "banking_service"
    HEALTHCARE_SERVICE = "healthcare_service"
    EDUCATION_SERVICE = "education_service"
    LEGAL_SERVICE = "legal_service"
    INFRASTRUCTURE_SERVICE = "infrastructure_service"
    AUTHENTICATION_SERVICE = "authentication_service"
    CULTURAL_SERVICE = "cultural_service"


class SecurityLevel(Enum):
    """Security classification levels for providers"""
    PUBLIC = "public"
    INTERNAL = "internal"
    CONFIDENTIAL = "confidential"
    SECRET = "secret"
    TOP_SECRET = "top_secret"


class MinistryDomain(Enum):
    """Iraqi government ministry domains"""
    INTERIOR = "interior"
    DEFENSE = "defense"
    FOREIGN_AFFAIRS = "foreign_affairs"
    FINANCE = "finance"
    HEALTH = "health"
    EDUCATION = "education"
    JUSTICE = "justice"
    COMMUNICATIONS = "communications"
    DIGITAL_TRANSFORMATION = "digital_transformation"
    AGRICULTURE = "agriculture"
    TRANSPORT = "transport"
    LABOR = "labor"


class ProviderStatus(Enum):
    """Provider connection and health status"""
    AVAILABLE = "available"
    UNAVAILABLE = "unavailable"
    MAINTENANCE = "maintenance"
    ERROR = "error"
    DEGRADED = "degraded"
    UNAUTHORIZED = "unauthorized"


@dataclass
class ProviderCredentials:
    """Secure credentials for Iraqi government service providers"""
    provider_id: str
    api_key: str
    secret_key: str
    certificate_path: Optional[str] = None
    token: Optional[str] = None
    token_expires: Optional[datetime] = None
    ministry_code: Optional[str] = None
    department_code: Optional[str] = None
    security_clearance: str = "confidential"
    
    def is_token_valid(self) -> bool:
        """Check if authentication token is still valid"""
        if not self.token or not self.token_expires:
            return False
        return datetime.now() < self.token_expires
    
    def get_auth_header(self) -> Dict[str, str]:
        """Get authentication headers for API requests"""
        headers = {
            "X-Ministry-Code": self.ministry_code or "",
            "X-Department-Code": self.department_code or "",
            "X-Security-Level": self.security_clearance,
            "X-Iraqi-Gov-API": "v2.1"
        }
        
        if self.token and self.is_token_valid():
            headers["Authorization"] = f"Bearer {self.token}"
        else:
            # Use API key authentication
            headers["X-API-Key"] = self.api_key
            headers["X-API-Secret-Hash"] = self._generate_secret_hash()
        
        return headers
    
    def _generate_secret_hash(self) -> str:
        """Generate HMAC-SHA256 hash of secret key with timestamp"""
        timestamp = str(int(datetime.now().timestamp()))
        message = f"{self.provider_id}:{timestamp}"
        
        signature = hmac.new(
            self.secret_key.encode(),
            message.encode(),
            hashlib.sha256
        ).hexdigest()
        
        return f"{timestamp}.{signature}"


@dataclass
class ProviderConfiguration:
    """Configuration for Iraqi government service provider"""
    provider_id: str
    provider_name: str
    provider_type: ProviderType
    base_url: str
    security_level: SecurityLevel
    ministry_domain: MinistryDomain
    
    # Connection settings
    timeout: int = 30
    max_retries: int = 3
    retry_backoff: float = 1.0
    ssl_verify: bool = True
    
    # Cultural settings
    cultural_validation_enabled: bool = True
    islamic_compliance_required: bool = True
    arabic_language_support: bool = True
    rtl_response_handling: bool = True
    
    # Rate limiting
    rate_limit_requests: int = 1000
    rate_limit_window: int = 3600  # 1 hour
    
    # Health check settings
    health_check_endpoint: str = "/health"
    health_check_interval: int = 300  # 5 minutes
    
    # Metadata
    description: str = ""
    version: str = "1.0"
    supported_operations: List[str] = field(default_factory=list)
    cultural_context: Dict[str, Any] = field(default_factory=dict)


@dataclass
class ProviderRequest:
    """Request to Iraqi government service provider"""
    operation: str
    data: Dict[str, Any]
    headers: Dict[str, str] = field(default_factory=dict)
    params: Dict[str, str] = field(default_factory=dict)
    timeout: Optional[int] = None
    cultural_validation: bool = True
    security_level: SecurityLevel = SecurityLevel.CONFIDENTIAL
    
    # Request metadata
    request_id: str = field(default_factory=lambda: f"req_{datetime.now().strftime('%Y%m%d%H%M%S')}")
    timestamp: datetime = field(default_factory=datetime.now)
    user_id: Optional[str] = None
    ministry_context: Optional[MinistryDomain] = None


@dataclass
class ProviderResponse:
    """Response from Iraqi government service provider"""
    success: bool
    data: Optional[Dict[str, Any]]
    error: Optional[str]
    status_code: int
    response_time_ms: float
    
    # Cultural validation results
    cultural_validation_score: float = 1.0
    islamic_compliance_score: float = 1.0
    cultural_issues: List[str] = field(default_factory=list)
    
    # Response metadata
    response_id: str = field(default_factory=lambda: f"resp_{datetime.now().strftime('%Y%m%d%H%M%S')}")
    timestamp: datetime = field(default_factory=datetime.now)
    provider_id: str = ""
    cached: bool = False


class BaseProvider(ABC):
    """Abstract base class for Iraqi government service providers"""
    
    def __init__(
        self,
        config: ProviderConfiguration,
        credentials: ProviderCredentials
    ):
        self.config = config
        self.credentials = credentials
        self.status = ProviderStatus.UNAVAILABLE
        self.last_health_check: Optional[datetime] = None
        self.request_count = 0
        self.error_count = 0
        
        # Cultural processors
        self.cultural_validator = IraqiCulturalValidator() if config.cultural_validation_enabled else None
        self.islamic_checker = IslamicComplianceChecker() if config.islamic_compliance_required else None
        self.arabic_processor = ArabicDialectProcessor() if config.arabic_language_support else None
        self.rtl_analyzer = RTLTextAnalyzer() if config.rtl_response_handling else None
        
        # Security manager
        self.security_manager = IraqiGovernmentSecurityManager()
        self.encryption_service = EncryptionService()
        
        # HTTP session
        self.session: Optional[aiohttp.ClientSession] = None
        
        # Setup logging
        self.logger = logging.getLogger(f'Provider-{config.provider_id}')
    
    @abstractmethod
    async def initialize(self) -> bool:
        """Initialize provider connection and authentication"""
        pass
    
    @abstractmethod
    async def execute_operation(self, request: ProviderRequest) -> ProviderResponse:
        """Execute provider operation"""
        pass
    
    @abstractmethod
    async def health_check(self) -> bool:
        """Check provider health status"""
        pass
    
    async def start(self):
        """Start provider service"""
        try:
            # Initialize HTTP session
            connector = aiohttp.TCPConnector(
                ssl=ssl.create_default_context() if self.config.ssl_verify else False,
                limit=100,
                limit_per_host=10
            )
            
            timeout = aiohttp.ClientTimeout(total=self.config.timeout)
            
            self.session = aiohttp.ClientSession(
                connector=connector,
                timeout=timeout,
                headers=self.credentials.get_auth_header()
            )
            
            # Initialize provider
            if await self.initialize():
                self.status = ProviderStatus.AVAILABLE
                self.logger.info(f"Provider {self.config.provider_id} started successfully")
                
                # Start health check monitoring
                asyncio.create_task(self._health_check_monitor())
                return True
            else:
                self.status = ProviderStatus.ERROR
                self.logger.error(f"Provider {self.config.provider_id} initialization failed")
                return False
        
        except Exception as e:
            self.status = ProviderStatus.ERROR
            self.logger.error(f"Provider startup error: {e}")
            return False
    
    async def stop(self):
        """Stop provider service"""
        if self.session:
            await self.session.close()
        
        self.status = ProviderStatus.UNAVAILABLE
        self.logger.info(f"Provider {self.config.provider_id} stopped")
    
    async def _health_check_monitor(self):
        """Monitor provider health status"""
        while self.status != ProviderStatus.UNAVAILABLE:
            try:
                if await self.health_check():
                    if self.status != ProviderStatus.AVAILABLE:
                        self.status = ProviderStatus.AVAILABLE
                        self.logger.info(f"Provider {self.config.provider_id} recovered")
                else:
                    if self.status == ProviderStatus.AVAILABLE:
                        self.status = ProviderStatus.DEGRADED
                        self.logger.warning(f"Provider {self.config.provider_id} degraded")
                
                self.last_health_check = datetime.now()
                await asyncio.sleep(self.config.health_check_interval)
                
            except Exception as e:
                self.logger.error(f"Health check error: {e}")
                self.status = ProviderStatus.ERROR
                await asyncio.sleep(self.config.health_check_interval)
    
    async def validate_request_culturally(self, request: ProviderRequest) -> Dict[str, Any]:
        """Validate request for cultural appropriateness"""
        if not request.cultural_validation or not self.cultural_validator:
            return {"valid": True, "score": 1.0}
        
        try:
            # Extract text content from request data
            text_content = self._extract_text_content(request.data)
            
            # Cultural validation
            cultural_result = await self.cultural_validator.validate_content(
                text_content,
                context_type="provider_request",
                ministry_domain=self.config.ministry_domain.value
            )
            
            # Islamic compliance check
            islamic_result = await self.islamic_checker.check_compliance(
                text_content,
                check_level='government'
            )
            
            return {
                "valid": cultural_result.get('compliant', True) and islamic_result.get('compliant', True),
                "cultural_score": cultural_result.get('compliance_score', 1.0),
                "islamic_score": islamic_result.get('compliance_score', 1.0),
                "issues": cultural_result.get('issues', []) + islamic_result.get('issues', [])
            }
        
        except Exception as e:
            self.logger.error(f"Cultural validation error: {e}")
            return {"valid": False, "error": str(e)}
    
    async def validate_response_culturally(self, response_data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate response for cultural appropriateness"""
        if not self.cultural_validator:
            return {"valid": True, "score": 1.0}
        
        try:
            # Extract text content from response
            text_content = self._extract_text_content(response_data)
            
            # Cultural validation
            cultural_result = await self.cultural_validator.validate_content(
                text_content,
                context_type="provider_response",
                ministry_domain=self.config.ministry_domain.value
            )
            
            # Islamic compliance check
            islamic_result = await self.islamic_checker.check_compliance(
                text_content,
                check_level='government'
            )
            
            return {
                "valid": cultural_result.get('compliant', True) and islamic_result.get('compliant', True),
                "cultural_score": cultural_result.get('compliance_score', 1.0),
                "islamic_score": islamic_result.get('compliance_score', 1.0),
                "issues": cultural_result.get('issues', []) + islamic_result.get('issues', [])
            }
        
        except Exception as e:
            self.logger.error(f"Response cultural validation error: {e}")
            return {"valid": False, "error": str(e)}
    
    def _extract_text_content(self, data: Dict[str, Any]) -> str:
        """Extract text content from data for cultural validation"""
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
    
    async def encrypt_sensitive_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Encrypt sensitive data in requests/responses"""
        try:
            encrypted_data = await self.encryption_service.encrypt_government_data(
                data,
                security_level=self.config.security_level.value,
                ministry_domain=self.config.ministry_domain.value
            )
            return encrypted_data
        
        except Exception as e:
            self.logger.error(f"Encryption error: {e}")
            return data
    
    async def decrypt_sensitive_data(self, encrypted_data: Dict[str, Any]) -> Dict[str, Any]:
        """Decrypt sensitive data from responses"""
        try:
            decrypted_data = await self.encryption_service.decrypt_government_data(
                encrypted_data,
                security_level=self.config.security_level.value,
                ministry_domain=self.config.ministry_domain.value
            )
            return decrypted_data
        
        except Exception as e:
            self.logger.error(f"Decryption error: {e}")
            return encrypted_data


class IraqiGovernmentAPIProvider(BaseProvider):
    """Iraqi government API service provider"""
    
    async def initialize(self) -> bool:
        """Initialize Iraqi government API connection"""
        try:
            # Test authentication
            auth_endpoint = f"{self.config.base_url}/auth/validate"
            
            async with self.session.get(auth_endpoint) as response:
                if response.status == 200:
                    auth_data = await response.json()
                    
                    # Store authentication token if provided
                    if 'access_token' in auth_data:
                        self.credentials.token = auth_data['access_token']
                        self.credentials.token_expires = datetime.now() + timedelta(
                            seconds=auth_data.get('expires_in', 3600)
                        )
                    
                    self.logger.info(f"Government API provider authenticated: {self.config.provider_id}")
                    return True
                else:
                    self.logger.error(f"Authentication failed: {response.status}")
                    return False
        
        except Exception as e:
            self.logger.error(f"Government API initialization error: {e}")
            return False
    
    async def execute_operation(self, request: ProviderRequest) -> ProviderResponse:
        """Execute Iraqi government API operation"""
        start_time = datetime.now()
        
        try:
            # Validate request culturally
            cultural_validation = await self.validate_request_culturally(request)
            if not cultural_validation.get('valid', True):
                return ProviderResponse(
                    success=False,
                    data=None,
                    error=f"Cultural validation failed: {cultural_validation.get('issues', [])}",
                    status_code=400,
                    response_time_ms=0.0,
                    cultural_validation_score=cultural_validation.get('cultural_score', 0.0),
                    islamic_compliance_score=cultural_validation.get('islamic_score', 0.0),
                    cultural_issues=cultural_validation.get('issues', []),
                    provider_id=self.config.provider_id
                )
            
            # Encrypt sensitive data
            encrypted_data = await self.encrypt_sensitive_data(request.data)
            
            # Prepare request
            endpoint = f"{self.config.base_url}/{request.operation}"
            headers = {**self.credentials.get_auth_header(), **request.headers}
            timeout = request.timeout or self.config.timeout
            
            # Execute request
            self.request_count += 1
            
            async with self.session.post(
                endpoint,
                json=encrypted_data,
                headers=headers,
                params=request.params,
                timeout=aiohttp.ClientTimeout(total=timeout)
            ) as response:
                response_time = (datetime.now() - start_time).total_seconds() * 1000
                
                if response.status == 200:
                    response_data = await response.json()
                    
                    # Decrypt response data
                    decrypted_data = await self.decrypt_sensitive_data(response_data)
                    
                    # Validate response culturally
                    response_validation = await self.validate_response_culturally(decrypted_data)
                    
                    return ProviderResponse(
                        success=True,
                        data=decrypted_data,
                        error=None,
                        status_code=response.status,
                        response_time_ms=response_time,
                        cultural_validation_score=response_validation.get('cultural_score', 1.0),
                        islamic_compliance_score=response_validation.get('islamic_score', 1.0),
                        cultural_issues=response_validation.get('issues', []),
                        provider_id=self.config.provider_id
                    )
                else:
                    error_text = await response.text()
                    self.error_count += 1
                    
                    return ProviderResponse(
                        success=False,
                        data=None,
                        error=f"API error: {response.status} - {error_text}",
                        status_code=response.status,
                        response_time_ms=response_time,
                        provider_id=self.config.provider_id
                    )
        
        except asyncio.TimeoutError:
            self.error_count += 1
            return ProviderResponse(
                success=False,
                data=None,
                error="Request timeout",
                status_code=408,
                response_time_ms=(datetime.now() - start_time).total_seconds() * 1000,
                provider_id=self.config.provider_id
            )
        
        except Exception as e:
            self.error_count += 1
            self.logger.error(f"Operation execution error: {e}")
            
            return ProviderResponse(
                success=False,
                data=None,
                error=str(e),
                status_code=500,
                response_time_ms=(datetime.now() - start_time).total_seconds() * 1000,
                provider_id=self.config.provider_id
            )
    
    async def health_check(self) -> bool:
        """Check Iraqi government API health"""
        try:
            health_endpoint = f"{self.config.base_url}{self.config.health_check_endpoint}"
            
            async with self.session.get(health_endpoint, timeout=aiohttp.ClientTimeout(total=5)) as response:
                return response.status == 200
        
        except Exception as e:
            self.logger.error(f"Health check error: {e}")
            return False


class ProviderRegistry:
    """Registry for Iraqi government service providers"""
    
    def __init__(self):
        self.providers: Dict[str, BaseProvider] = {}
        self.provider_configs: Dict[str, ProviderConfiguration] = {}
        self.provider_credentials: Dict[str, ProviderCredentials] = {}
        self.logger = logging.getLogger('ProviderRegistry')
    
    def register_provider(
        self,
        config: ProviderConfiguration,
        credentials: ProviderCredentials,
        provider_class: Type[BaseProvider] = IraqiGovernmentAPIProvider
    ):
        """Register a new provider"""
        try:
            provider = provider_class(config, credentials)
            
            self.providers[config.provider_id] = provider
            self.provider_configs[config.provider_id] = config
            self.provider_credentials[config.provider_id] = credentials
            
            self.logger.info(f"Provider registered: {config.provider_id}")
        
        except Exception as e:
            self.logger.error(f"Provider registration error: {e}")
    
    async def start_provider(self, provider_id: str) -> bool:
        """Start a specific provider"""
        if provider_id not in self.providers:
            self.logger.error(f"Provider not found: {provider_id}")
            return False
        
        provider = self.providers[provider_id]
        return await provider.start()
    
    async def stop_provider(self, provider_id: str):
        """Stop a specific provider"""
        if provider_id in self.providers:
            provider = self.providers[provider_id]
            await provider.stop()
    
    async def start_all_providers(self):
        """Start all registered providers"""
        results = []
        for provider_id in self.providers:
            result = await self.start_provider(provider_id)
            results.append((provider_id, result))
        return results
    
    async def stop_all_providers(self):
        """Stop all providers"""
        for provider_id in self.providers:
            await self.stop_provider(provider_id)
    
    def get_provider(self, provider_id: str) -> Optional[BaseProvider]:
        """Get provider by ID"""
        return self.providers.get(provider_id)
    
    def get_providers_by_type(self, provider_type: ProviderType) -> List[BaseProvider]:
        """Get providers by type"""
        matching_providers = []
        for provider_id, provider in self.providers.items():
            if provider.config.provider_type == provider_type:
                matching_providers.append(provider)
        return matching_providers
    
    def get_providers_by_ministry(self, ministry: MinistryDomain) -> List[BaseProvider]:
        """Get providers by ministry domain"""
        matching_providers = []
        for provider_id, provider in self.providers.items():
            if provider.config.ministry_domain == ministry:
                matching_providers.append(provider)
        return matching_providers
    
    def get_provider_status(self) -> Dict[str, Dict[str, Any]]:
        """Get status of all providers"""
        status_report = {}
        for provider_id, provider in self.providers.items():
            status_report[provider_id] = {
                "status": provider.status.value,
                "last_health_check": provider.last_health_check.isoformat() if provider.last_health_check else None,
                "request_count": provider.request_count,
                "error_count": provider.error_count,
                "error_rate": provider.error_count / max(provider.request_count, 1),
                "provider_type": provider.config.provider_type.value,
                "ministry_domain": provider.config.ministry_domain.value
            }
        return status_report


class IraqiProviderManager:
    """Manager for Iraqi government provider abstraction system"""
    
    def __init__(self):
        self.registry = ProviderRegistry()
        self.logger = logging.getLogger('IraqiProviderManager')
        self.default_providers_loaded = False
    
    async def load_default_providers(self):
        """Load default Iraqi government providers"""
        if self.default_providers_loaded:
            return
        
        # Digital Iraq Platform Provider
        digital_iraq_config = ProviderConfiguration(
            provider_id="digital_iraq_platform",
            provider_name="Digital Iraq Platform",
            provider_type=ProviderType.DIGITAL_IRAQ,
            base_url="https://api.digital.gov.iq",
            security_level=SecurityLevel.CONFIDENTIAL,
            ministry_domain=MinistryDomain.DIGITAL_TRANSFORMATION,
            supported_operations=["citizen_services", "document_validation", "e_signature"],
            cultural_context={"arabic_primary": True, "islamic_compliant": True}
        )
        
        digital_iraq_creds = ProviderCredentials(
            provider_id="digital_iraq_platform",
            api_key="DIGITAL_IRAQ_API_KEY",
            secret_key="DIGITAL_IRAQ_SECRET_KEY",
            ministry_code="DT",
            security_clearance="confidential"
        )
        
        # Ministry of Interior Provider
        interior_config = ProviderConfiguration(
            provider_id="interior_ministry_api",
            provider_name="Ministry of Interior API",
            provider_type=ProviderType.MINISTRY_SERVICE,
            base_url="https://api.interior.gov.iq",
            security_level=SecurityLevel.SECRET,
            ministry_domain=MinistryDomain.INTERIOR,
            supported_operations=["id_verification", "residence_permits", "civil_status"],
            cultural_context={"security_sensitive": True, "arabic_required": True}
        )
        
        interior_creds = ProviderCredentials(
            provider_id="interior_ministry_api",
            api_key="INTERIOR_API_KEY",
            secret_key="INTERIOR_SECRET_KEY",
            ministry_code="IN",
            security_clearance="secret"
        )
        
        # Register providers
        self.registry.register_provider(digital_iraq_config, digital_iraq_creds)
        self.registry.register_provider(interior_config, interior_creds)
        
        self.default_providers_loaded = True
        self.logger.info("Default Iraqi government providers loaded")
    
    async def execute_provider_operation(
        self,
        provider_id: str,
        operation: str,
        data: Dict[str, Any],
        **kwargs
    ) -> ProviderResponse:
        """Execute operation on specific provider"""
        provider = self.registry.get_provider(provider_id)
        if not provider:
            return ProviderResponse(
                success=False,
                data=None,
                error=f"Provider not found: {provider_id}",
                status_code=404,
                response_time_ms=0.0
            )
        
        if provider.status != ProviderStatus.AVAILABLE:
            return ProviderResponse(
                success=False,
                data=None,
                error=f"Provider unavailable: {provider.status.value}",
                status_code=503,
                response_time_ms=0.0
            )
        
        request = ProviderRequest(
            operation=operation,
            data=data,
            **kwargs
        )
        
        return await provider.execute_operation(request)
    
    async def execute_ministry_operation(
        self,
        ministry: MinistryDomain,
        operation: str,
        data: Dict[str, Any],
        **kwargs
    ) -> List[ProviderResponse]:
        """Execute operation on all providers for a ministry"""
        providers = self.registry.get_providers_by_ministry(ministry)
        
        if not providers:
            return [ProviderResponse(
                success=False,
                data=None,
                error=f"No providers found for ministry: {ministry.value}",
                status_code=404,
                response_time_ms=0.0
            )]
        
        results = []
        for provider in providers:
            if provider.status == ProviderStatus.AVAILABLE:
                request = ProviderRequest(
                    operation=operation,
                    data=data,
                    ministry_context=ministry,
                    **kwargs
                )
                
                result = await provider.execute_operation(request)
                results.append(result)
        
        return results
    
    async def get_system_status(self) -> Dict[str, Any]:
        """Get comprehensive system status"""
        provider_status = self.registry.get_provider_status()
        
        # Calculate overall health
        total_providers = len(provider_status)
        available_providers = sum(1 for status in provider_status.values() if status['status'] == 'available')
        
        overall_health = (available_providers / total_providers) if total_providers > 0 else 0.0
        
        return {
            "overall_health": overall_health,
            "total_providers": total_providers,
            "available_providers": available_providers,
            "provider_details": provider_status,
            "timestamp": datetime.now().isoformat()
        }


# Example usage and testing
async def main():
    """Example usage of Iraqi Government Provider Abstraction"""
    
    # Initialize provider manager
    manager = IraqiProviderManager()
    
    print("🇮🇶 Iraqi Government Provider Abstraction System")
    print("===============================================")
    
    # Load default providers
    await manager.load_default_providers()
    print("✅ Default providers loaded")
    
    # Start all providers
    start_results = await manager.registry.start_all_providers()
    print(f"✅ Started providers: {start_results}")
    
    # Get system status
    status = await manager.get_system_status()
    print(f"📊 System Status:")
    print(f"   Overall Health: {status['overall_health']:.2%}")
    print(f"   Available Providers: {status['available_providers']}/{status['total_providers']}")
    
    # Test provider operation
    test_data = {
        "citizen_id": "123456789",
        "request_type": "document_validation",
        "document_type": "national_id"
    }
    
    print(f"\n🔄 Testing provider operation...")
    result = await manager.execute_provider_operation(
        provider_id="digital_iraq_platform",
        operation="citizen_services",
        data=test_data,
        cultural_validation=True
    )
    
    print(f"Operation Result:")
    print(f"   Success: {result.success}")
    print(f"   Status Code: {result.status_code}")
    print(f"   Response Time: {result.response_time_ms:.2f}ms")
    print(f"   Cultural Score: {result.cultural_validation_score:.2f}")
    print(f"   Islamic Compliance: {result.islamic_compliance_score:.2f}")
    
    if result.error:
        print(f"   Error: {result.error}")
    
    # Stop all providers
    await manager.registry.stop_all_providers()
    print("✅ All providers stopped")


if __name__ == "__main__":
    asyncio.run(main())