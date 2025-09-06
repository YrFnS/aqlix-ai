"""
Iraqi AI Chat System - Agent Dependencies
Comprehensive dependency injection system for Iraqi AI agents with cultural intelligence
"""
from typing import Optional, Dict, Any, List, Protocol, runtime_checkable
from dataclasses import dataclass, field
from datetime import datetime, timezone
from abc import ABC, abstractmethod
import asyncio
from contextlib import asynccontextmanager

from .settings import settings, IraqiCulturalMode, IslamicComplianceLevel


@runtime_checkable
class IraqiCulturalService(Protocol):
    """Protocol for Iraqi cultural validation services"""
    
    async def validate_cultural_appropriateness(self, content: str, context: Dict[str, Any]) -> float:
        """Validate content for Iraqi cultural appropriateness (0.0-1.0)"""
        ...
    
    async def validate_islamic_compliance(self, content: str) -> float:
        """Validate content for Islamic compliance (0.0-1.0)"""
        ...
    
    async def get_cultural_recommendations(self, content: str) -> List[str]:
        """Get cultural improvement recommendations"""
        ...


@runtime_checkable
class ArabicProcessingService(Protocol):
    """Protocol for Arabic text processing services"""
    
    async def detect_language(self, text: str) -> Dict[str, Any]:
        """Detect language and dialect information"""
        ...
    
    async def process_rtl_text(self, text: str) -> Dict[str, Any]:
        """Process RTL (Right-to-Left) text with Arabic support"""
        ...
    
    async def recognize_iraqi_dialect(self, text: str) -> Dict[str, Any]:
        """Recognize Iraqi Arabic dialect patterns"""
        ...


@runtime_checkable
class PaymentGatewayService(Protocol):
    """Protocol for Iraqi payment gateway services"""
    
    async def validate_payment(self, amount: float, currency: str, gateway: str) -> Dict[str, Any]:
        """Validate payment request for Iraqi gateways"""
        ...
    
    async def get_supported_gateways(self) -> List[str]:
        """Get list of supported Iraqi payment gateways"""
        ...
    
    async def check_islamic_compliance(self, transaction_data: Dict[str, Any]) -> bool:
        """Check if payment transaction is Islamic compliant"""
        ...


@runtime_checkable
class ProfessionalDomainService(Protocol):
    """Protocol for Iraqi professional domain services"""
    
    async def get_domain_guidance(self, domain: str, question: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Get professional domain guidance with Iraqi context"""
        ...
    
    async def validate_domain_compliance(self, content: str, domain: str) -> float:
        """Validate content for professional domain appropriateness"""
        ...
    
    async def get_domain_resources(self, domain: str) -> List[Dict[str, Any]]:
        """Get Iraqi professional domain resources"""
        ...


@runtime_checkable
class SecurityService(Protocol):
    """Protocol for Iraqi security services"""
    
    async def scan_content_security(self, content: str) -> Dict[str, Any]:
        """Scan content for security issues"""
        ...
    
    async def validate_user_permissions(self, user_id: str, action: str) -> bool:
        """Validate user permissions with Iraqi context"""
        ...
    
    async def audit_interaction(self, interaction_data: Dict[str, Any]) -> None:
        """Audit interaction for security compliance"""
        ...


@runtime_checkable
class CacheService(Protocol):
    """Protocol for caching services"""
    
    async def get(self, key: str) -> Optional[Any]:
        """Get cached value"""
        ...
    
    async def set(self, key: str, value: Any, ttl: int = 3600) -> None:
        """Set cached value with TTL"""
        ...
    
    async def delete(self, key: str) -> None:
        """Delete cached value"""
        ...
    
    async def clear_cultural_cache(self) -> None:
        """Clear cultural validation cache"""
        ...


@runtime_checkable
class DatabaseService(Protocol):
    """Protocol for database services"""
    
    async def save_interaction(self, interaction_data: Dict[str, Any]) -> str:
        """Save agent interaction to database"""
        ...
    
    async def get_user_preferences(self, user_id: str) -> Dict[str, Any]:
        """Get user cultural and linguistic preferences"""
        ...
    
    async def update_cultural_metrics(self, metrics: Dict[str, Any]) -> None:
        """Update cultural validation metrics"""
        ...


@runtime_checkable
class MonitoringService(Protocol):
    """Protocol for monitoring services"""
    
    async def track_performance(self, metric_name: str, value: float, tags: Dict[str, str] = None) -> None:
        """Track performance metric"""
        ...
    
    async def log_cultural_validation(self, validation_result: Dict[str, Any]) -> None:
        """Log cultural validation results"""
        ...
    
    async def alert_compliance_issue(self, issue_data: Dict[str, Any]) -> None:
        """Alert on cultural/Islamic compliance issues"""
        ...


# Default Service Implementations

class DefaultCulturalService:
    """Default implementation of Iraqi cultural validation service"""
    
    def __init__(self):
        self.cultural_patterns = {
            "respectful_terms": ["أستاذ", "دكتور", "حضرة", "respect", "honor", "family"],
            "islamic_values": ["peace", "charity", "knowledge", "justice", "community", "سلام", "خير", "علم"],
            "inappropriate_content": ["offensive", "disrespectful", "inappropriate", "harmful"]
        }
    
    async def validate_cultural_appropriateness(self, content: str, context: Dict[str, Any]) -> float:
        """Simple cultural appropriateness validation"""
        content_lower = content.lower()
        
        # Count positive cultural indicators
        positive_score = sum(1 for term in self.cultural_patterns["respectful_terms"] 
                           if term in content_lower)
        positive_score += sum(1 for term in self.cultural_patterns["islamic_values"] 
                            if term in content_lower)
        
        # Count negative indicators  
        negative_score = sum(1 for term in self.cultural_patterns["inappropriate_content"] 
                           if term in content_lower)
        
        # Calculate score (0.0-1.0)
        base_score = 0.8  # Default good cultural appropriateness
        score = min(1.0, max(0.0, base_score + (positive_score * 0.05) - (negative_score * 0.2)))
        
        return score
    
    async def validate_islamic_compliance(self, content: str) -> float:
        """Simple Islamic compliance validation"""
        content_lower = content.lower()
        
        # Islamic principle indicators
        islamic_positive = sum(1 for term in self.cultural_patterns["islamic_values"] 
                             if term in content_lower)
        
        # Prohibited content indicators (simplified)
        prohibited_terms = ["alcohol", "gambling", "riba", "interest", "inappropriate"]
        prohibited_score = sum(1 for term in prohibited_terms if term in content_lower)
        
        # Calculate compliance score
        base_compliance = 0.9
        compliance = min(1.0, max(0.0, base_compliance + (islamic_positive * 0.02) - (prohibited_score * 0.3)))
        
        return compliance
    
    async def get_cultural_recommendations(self, content: str) -> List[str]:
        """Get cultural improvement recommendations"""
        recommendations = []
        
        if not any(term in content.lower() for term in self.cultural_patterns["respectful_terms"]):
            recommendations.append("Consider using respectful Arabic terms like 'أستاذ' or 'حضرة'")
        
        if not any(term in content.lower() for term in self.cultural_patterns["islamic_values"]):
            recommendations.append("Include Islamic values like peace, knowledge, or community")
        
        if not recommendations:
            recommendations.append("Content appears culturally appropriate")
        
        return recommendations


class DefaultArabicProcessingService:
    """Default implementation of Arabic processing service"""
    
    async def detect_language(self, text: str) -> Dict[str, Any]:
        """Simple language detection"""
        arabic_chars = sum(1 for char in text if '\u0600' <= char <= '\u06FF')
        total_chars = len([c for c in text if c.isalpha()])
        
        arabic_ratio = arabic_chars / max(1, total_chars)
        
        if arabic_ratio > 0.7:
            primary_language = "arabic"
        elif arabic_ratio > 0.3:
            primary_language = "mixed"
        else:
            primary_language = "english"
        
        return {
            "primary_language": primary_language,
            "arabic_ratio": arabic_ratio,
            "has_arabic": arabic_ratio > 0,
            "character_count": len(text),
            "word_count": len(text.split())
        }
    
    async def process_rtl_text(self, text: str) -> Dict[str, Any]:
        """Process RTL text"""
        language_info = await self.detect_language(text)
        
        return {
            "original_text": text,
            "text_direction": "rtl" if language_info["arabic_ratio"] > 0.5 else "ltr", 
            "rtl_compliant": language_info["arabic_ratio"] > 0.5,
            "processing_suggestions": [
                "Use CSS direction: rtl for proper display",
                "Ensure Arabic fonts are available",
                "Handle mixed-direction text carefully"
            ] if language_info["has_arabic"] else []
        }
    
    async def recognize_iraqi_dialect(self, text: str) -> Dict[str, Any]:
        """Recognize Iraqi dialect patterns"""
        iraqi_indicators = [
            'شلونك', 'شكو ماكو', 'وين', 'شنو', 'هسة', 'يالله', 'ماشي الحال'
        ]
        
        found_indicators = [indicator for indicator in iraqi_indicators if indicator in text]
        dialect_confidence = len(found_indicators) / len(iraqi_indicators)
        
        return {
            "is_iraqi_dialect": len(found_indicators) > 0,
            "dialect_confidence": dialect_confidence,
            "found_indicators": found_indicators,
            "dialect_region": "baghdad" if dialect_confidence > 0.5 else "general_iraqi"
        }


class DefaultPaymentGatewayService:
    """Default implementation of payment gateway service"""
    
    async def validate_payment(self, amount: float, currency: str, gateway: str) -> Dict[str, Any]:
        """Validate payment for Iraqi gateways"""
        gateway_config = settings.payment_gateways.get(gateway, {})
        
        if not gateway_config:
            return {
                "valid": False,
                "error": f"Unsupported gateway: {gateway}",
                "supported_gateways": list(settings.payment_gateways.keys())
            }
        
        min_amount = gateway_config.get("min_amount", 0)
        if amount < min_amount:
            return {
                "valid": False,
                "error": f"Amount below minimum: {min_amount} {currency}",
                "min_amount": min_amount
            }
        
        return {
            "valid": True,
            "gateway": gateway,
            "amount": amount,
            "currency": currency,
            "estimated_fee": amount * 0.025,
            "processing_time": "1-3 minutes"
        }
    
    async def get_supported_gateways(self) -> List[str]:
        """Get supported gateways"""
        return [gateway for gateway, config in settings.payment_gateways.items() 
                if config.get("enabled", False)]
    
    async def check_islamic_compliance(self, transaction_data: Dict[str, Any]) -> bool:
        """Check Islamic compliance of transaction"""
        # Simple check - no interest or gambling
        transaction_type = transaction_data.get("type", "").lower()
        prohibited_types = ["interest", "gambling", "riba", "loan_with_interest"]
        
        return transaction_type not in prohibited_types


@dataclass
class IraqiAgentDependencies:
    """
    Dependency injection container for Iraqi AI agents
    """
    
    # Core Services
    cultural_service: IraqiCulturalService = field(default_factory=DefaultCulturalService)
    arabic_service: ArabicProcessingService = field(default_factory=DefaultArabicProcessingService) 
    payment_service: PaymentGatewayService = field(default_factory=DefaultPaymentGatewayService)
    
    # Optional Services (will be None if not configured)
    professional_service: Optional[ProfessionalDomainService] = None
    security_service: Optional[SecurityService] = None
    cache_service: Optional[CacheService] = None
    database_service: Optional[DatabaseService] = None
    monitoring_service: Optional[MonitoringService] = None
    
    # Configuration
    cultural_mode: IraqiCulturalMode = field(default_factory=lambda: settings.cultural_mode)
    islamic_compliance_level: IslamicComplianceLevel = field(default_factory=lambda: settings.islamic_compliance_level)
    enabled_domains: List[str] = field(default_factory=lambda: settings.enabled_domains.copy())
    
    # Runtime State
    agent_id: Optional[str] = None
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    
    # Performance Tracking
    request_count: int = 0
    total_processing_time: float = 0.0
    cultural_validation_count: int = 0
    islamic_compliance_failures: int = 0
    
    def increment_request(self, processing_time: float) -> None:
        """Increment request counters"""
        self.request_count += 1
        self.total_processing_time += processing_time
    
    def increment_cultural_validation(self, passed: bool) -> None:
        """Track cultural validation"""
        self.cultural_validation_count += 1
        if not passed:
            self.islamic_compliance_failures += 1
    
    def get_performance_stats(self) -> Dict[str, Any]:
        """Get performance statistics"""
        avg_processing_time = (self.total_processing_time / self.request_count 
                              if self.request_count > 0 else 0.0)
        
        failure_rate = (self.islamic_compliance_failures / self.cultural_validation_count
                       if self.cultural_validation_count > 0 else 0.0)
        
        return {
            "request_count": self.request_count,
            "avg_processing_time": round(avg_processing_time, 3),
            "cultural_validation_count": self.cultural_validation_count,
            "islamic_compliance_failure_rate": round(failure_rate, 3),
            "uptime": (datetime.now(timezone.utc) - self.created_at).total_seconds()
        }
    
    async def validate_dependencies(self) -> List[str]:
        """Validate all required dependencies are available"""
        issues = []
        
        # Check required services
        if not isinstance(self.cultural_service, IraqiCulturalService):
            issues.append("Cultural service not properly configured")
        
        if not isinstance(self.arabic_service, ArabicProcessingService):
            issues.append("Arabic processing service not properly configured")
        
        if not isinstance(self.payment_service, PaymentGatewayService):
            issues.append("Payment gateway service not properly configured")
        
        # Test service connectivity
        try:
            await self.cultural_service.validate_cultural_appropriateness("test", {})
        except Exception as e:
            issues.append(f"Cultural service not responding: {e}")
        
        try:
            await self.arabic_service.detect_language("test")
        except Exception as e:
            issues.append(f"Arabic service not responding: {e}")
        
        return issues
    
    @asynccontextmanager
    async def get_request_context(self, user_id: str = None, session_id: str = None):
        """Get request context manager"""
        import time
        start_time = time.time()
        
        # Set context
        old_user_id = self.user_id
        old_session_id = self.session_id
        
        self.user_id = user_id
        self.session_id = session_id
        
        try:
            yield self
        finally:
            # Clean up context
            processing_time = time.time() - start_time
            self.increment_request(processing_time)
            
            self.user_id = old_user_id
            self.session_id = old_session_id


# Factory function for creating dependencies
async def create_iraqi_dependencies(
    cultural_service: Optional[IraqiCulturalService] = None,
    arabic_service: Optional[ArabicProcessingService] = None,
    payment_service: Optional[PaymentGatewayService] = None,
    **optional_services
) -> IraqiAgentDependencies:
    """
    Create and validate Iraqi agent dependencies
    """
    deps = IraqiAgentDependencies(
        cultural_service=cultural_service or DefaultCulturalService(),
        arabic_service=arabic_service or DefaultArabicProcessingService(),
        payment_service=payment_service or DefaultPaymentGatewayService(),
        **optional_services
    )
    
    # Validate dependencies
    issues = await deps.validate_dependencies()
    if issues:
        raise RuntimeError(f"Dependency validation failed: {', '.join(issues)}")
    
    return deps