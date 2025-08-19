"""
Cultural Server Manager - Enhanced MCP server lifecycle management with Iraqi cultural compliance
Part of Roo-Code extraction with comprehensive Iraqi cultural integration

Extends Roo-Code's McpServerManager patterns with Iraqi cultural validation,
Islamic compliance checking, and professional domain expertise for managing
MCP server instances with cultural awareness and automated compliance monitoring.
- Cultural server registry and lifecycle management
- Islamic compliance monitoring and automated remediation
- Professional domain-specific server orchestration
- Government service integration and security compliance

Based on: RooCodeInc/Roo-Code MCP server lifecycle patterns
Enhanced for: Iraqi AI Chat System with cultural and professional compliance
"""

from typing import Dict, List, Optional, Any, Set, Callable, Awaitable
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
import asyncio
import json
import logging
import threading
import weakref
from pathlib import Path
from contextlib import asynccontextmanager

# Cultural integration imports
from .iraqi_mcp_hub import IraqiMcpHub, IraqiMcpServerConfig, McpServerStatus, CulturalValidationLevel
from ..tool-orchestration.cultural_tool_validator import CulturalToolValidator
from ..sequential-thinking.government_thinking_framework import GovernmentThinkingFramework, MinistryDomain


class ServerLifecycleEvent(Enum):
    """Server lifecycle events for cultural monitoring"""
    REGISTRATION = "registration"
    CONNECTION_ATTEMPT = "connection_attempt"
    CONNECTED = "connected"
    DISCONNECTED = "disconnected"
    CULTURAL_VALIDATION = "cultural_validation"
    ISLAMIC_COMPLIANCE_CHECK = "islamic_compliance_check"
    PROFESSIONAL_AUDIT = "professional_audit"
    ERROR_OCCURRED = "error_occurred"
    SHUTDOWN = "shutdown"


class CulturalServerCategory(Enum):
    """Categories for cultural server classification"""
    GENERAL_PURPOSE = "general_purpose"           # General purpose servers
    PROFESSIONAL_LEGAL = "professional_legal"    # Legal domain servers
    PROFESSIONAL_MEDICAL = "professional_medical" # Medical domain servers  
    EDUCATIONAL = "educational"                   # Educational servers
    GOVERNMENT_SERVICES = "government_services"   # Government service servers
    FAMILY_ORIENTED = "family_oriented"          # Family-safe servers
    RELIGIOUS_STUDIES = "religious_studies"      # Islamic studies servers
    ARABIC_LANGUAGE = "arabic_language"          # Arabic language processing
    CULTURAL_HERITAGE = "cultural_heritage"      # Iraqi cultural content


@dataclass
class ServerLifecycleRecord:
    """Record of server lifecycle events with cultural context"""
    server_name: str
    event: ServerLifecycleEvent
    timestamp: datetime
    details: Dict[str, Any]
    cultural_context: Optional[Dict[str, Any]] = None
    islamic_compliance_status: Optional[bool] = None
    professional_domain: Optional[str] = None
    error_message: Optional[str] = None


@dataclass
class CulturalServerPolicy:
    """Policy definition for cultural server management"""
    category: CulturalServerCategory
    required_validation_level: CulturalValidationLevel
    islamic_compliance_mandatory: bool
    family_filtering_required: bool
    professional_oversight_needed: bool
    government_approval_required: bool
    
    # Operational constraints
    max_concurrent_connections: int = 5
    health_check_interval: int = 30
    cultural_audit_interval: int = 3600  # 1 hour
    
    # Cultural requirements
    required_cultural_features: Set[str] = field(default_factory=set)
    blocked_cultural_patterns: Set[str] = field(default_factory=set)
    
    # Monitoring settings
    log_all_interactions: bool = False
    alert_on_cultural_violations: bool = True
    auto_disconnect_on_violations: bool = False


@dataclass
class ServerProvider:
    """Provider information for server registration"""
    provider_id: str
    provider_name: str
    cultural_context: Dict[str, Any]
    registration_timestamp: datetime
    active_servers: Set[str] = field(default_factory=set)


class CulturalServerRegistry:
    """Registry for managing culturally-compliant MCP servers"""
    
    def __init__(self):
        self.registered_servers: Dict[str, IraqiMcpServerConfig] = {}
        self.server_categories: Dict[str, CulturalServerCategory] = {}
        self.cultural_policies: Dict[CulturalServerCategory, CulturalServerPolicy] = {}
        self.lifecycle_history: List[ServerLifecycleRecord] = []
        self.providers: Dict[str, ServerProvider] = {}
        
        # Initialize default cultural policies
        self._initialize_default_policies()
    
    def register_server(self, 
                       config: IraqiMcpServerConfig, 
                       category: CulturalServerCategory,
                       provider_id: str) -> bool:
        """Register server with cultural validation"""
        try:
            # Validate against cultural policy
            policy = self.cultural_policies.get(category)
            if not policy:
                logging.error(f"No policy defined for category {category}")
                return False
            
            if not self._validate_server_against_policy(config, policy):
                logging.error(f"Server {config.name} failed cultural policy validation")
                return False
            
            # Register server
            self.registered_servers[config.name] = config
            self.server_categories[config.name] = category
            
            # Update provider registry
            if provider_id in self.providers:
                self.providers[provider_id].active_servers.add(config.name)
            
            # Record lifecycle event
            self._record_lifecycle_event(
                config.name, 
                ServerLifecycleEvent.REGISTRATION,
                {"category": category.value, "provider_id": provider_id}
            )
            
            return True
            
        except Exception as e:
            logging.error(f"Server registration failed: {str(e)}")
            return False
    
    def unregister_server(self, server_name: str, provider_id: str) -> bool:
        """Unregister server from cultural registry"""
        try:
            if server_name not in self.registered_servers:
                return False
            
            # Remove from registries
            del self.registered_servers[server_name]
            category = self.server_categories.pop(server_name, None)
            
            # Update provider registry
            if provider_id in self.providers:
                self.providers[provider_id].active_servers.discard(server_name)
            
            # Record lifecycle event
            self._record_lifecycle_event(
                server_name,
                ServerLifecycleEvent.SHUTDOWN,
                {"category": category.value if category else None, "provider_id": provider_id}
            )
            
            return True
            
        except Exception as e:
            logging.error(f"Server unregistration failed: {str(e)}")
            return False
    
    def get_servers_by_category(self, category: CulturalServerCategory) -> List[IraqiMcpServerConfig]:
        """Get all servers in a cultural category"""
        return [
            config for name, config in self.registered_servers.items()
            if self.server_categories.get(name) == category
        ]
    
    def get_culturally_appropriate_servers(self, 
                                         cultural_context: Dict[str, Any]) -> List[IraqiMcpServerConfig]:
        """Get servers appropriate for cultural context"""
        appropriate_servers = []
        
        family_context = cultural_context.get("family_context", False)
        professional_domain = cultural_context.get("professional_domain")
        islamic_compliance = cultural_context.get("islamic_compliance", True)
        
        for name, config in self.registered_servers.items():
            # Check family context requirements
            if family_context and not config.family_context_sensitive:
                continue
            
            # Check professional domain compatibility
            if professional_domain and config.professional_domain != professional_domain:
                continue
            
            # Check Islamic compliance
            if islamic_compliance and not config.islamic_compliance_required:
                continue
            
            appropriate_servers.append(config)
        
        return appropriate_servers
    
    def _validate_server_against_policy(self, 
                                       config: IraqiMcpServerConfig, 
                                       policy: CulturalServerPolicy) -> bool:
        """Validate server configuration against cultural policy"""
        # Check validation level
        if config.cultural_validation_level.value < policy.required_validation_level.value:
            return False
        
        # Check Islamic compliance
        if policy.islamic_compliance_mandatory and not config.islamic_compliance_required:
            return False
        
        # Check family filtering
        if policy.family_filtering_required and not config.family_context_sensitive:
            return False
        
        # Check required cultural features
        server_features = set()
        if config.arabic_language_support:
            server_features.add("arabic_support")
        if config.islamic_compliance_required:
            server_features.add("islamic_compliance")
        if config.family_context_sensitive:
            server_features.add("family_filtering")
        
        if not policy.required_cultural_features.issubset(server_features):
            return False
        
        return True
    
    def _initialize_default_policies(self):
        """Initialize default cultural policies for server categories"""
        self.cultural_policies = {
            CulturalServerCategory.GENERAL_PURPOSE: CulturalServerPolicy(
                category=CulturalServerCategory.GENERAL_PURPOSE,
                required_validation_level=CulturalValidationLevel.BASIC,
                islamic_compliance_mandatory=True,
                family_filtering_required=False,
                professional_oversight_needed=False,
                government_approval_required=False,
                required_cultural_features={"islamic_compliance"}
            ),
            
            CulturalServerCategory.PROFESSIONAL_LEGAL: CulturalServerPolicy(
                category=CulturalServerCategory.PROFESSIONAL_LEGAL,
                required_validation_level=CulturalValidationLevel.PROFESSIONAL,
                islamic_compliance_mandatory=True,
                family_filtering_required=False,
                professional_oversight_needed=True,
                government_approval_required=True,
                max_concurrent_connections=3,
                health_check_interval=15,
                required_cultural_features={"islamic_compliance", "professional_validation"},
                log_all_interactions=True
            ),
            
            CulturalServerCategory.FAMILY_ORIENTED: CulturalServerPolicy(
                category=CulturalServerCategory.FAMILY_ORIENTED,
                required_validation_level=CulturalValidationLevel.FAMILY,
                islamic_compliance_mandatory=True,
                family_filtering_required=True,
                professional_oversight_needed=False,
                government_approval_required=False,
                required_cultural_features={"islamic_compliance", "family_filtering"},
                alert_on_cultural_violations=True,
                auto_disconnect_on_violations=True
            ),
            
            CulturalServerCategory.GOVERNMENT_SERVICES: CulturalServerPolicy(
                category=CulturalServerCategory.GOVERNMENT_SERVICES,
                required_validation_level=CulturalValidationLevel.GOVERNMENT,
                islamic_compliance_mandatory=True,
                family_filtering_required=False,
                professional_oversight_needed=True,
                government_approval_required=True,
                max_concurrent_connections=2,
                health_check_interval=10,
                cultural_audit_interval=1800,  # 30 minutes
                required_cultural_features={"islamic_compliance", "government_compliance"},
                log_all_interactions=True,
                alert_on_cultural_violations=True
            ),
            
            CulturalServerCategory.RELIGIOUS_STUDIES: CulturalServerPolicy(
                category=CulturalServerCategory.RELIGIOUS_STUDIES,
                required_validation_level=CulturalValidationLevel.RELIGIOUS,
                islamic_compliance_mandatory=True,
                family_filtering_required=True,
                professional_oversight_needed=True,
                government_approval_required=False,
                required_cultural_features={"islamic_compliance", "family_filtering", "religious_validation"},
                alert_on_cultural_violations=True,
                auto_disconnect_on_violations=True
            )
        }
    
    def _record_lifecycle_event(self, 
                               server_name: str, 
                               event: ServerLifecycleEvent,
                               details: Dict[str, Any]):
        """Record server lifecycle event"""
        record = ServerLifecycleRecord(
            server_name=server_name,
            event=event,
            timestamp=datetime.now(),
            details=details
        )
        
        self.lifecycle_history.append(record)
        
        # Keep only last 1000 events
        if len(self.lifecycle_history) > 1000:
            self.lifecycle_history = self.lifecycle_history[-1000:]


class CulturalServerManager:
    """
    Enhanced MCP Server Manager with comprehensive Iraqi cultural integration
    
    Based on Roo-Code patterns with advanced cultural monitoring, Islamic 
    compliance enforcement, and professional domain management.
    """
    
    def __init__(self, 
                 cultural_validator: Optional[CulturalToolValidator] = None,
                 government_framework: Optional[GovernmentThinkingFramework] = None):
        
        self.hub_instances: Dict[str, IraqiMcpHub] = {}
        self.registry = CulturalServerRegistry()
        self.cultural_validator = cultural_validator or CulturalToolValidator()
        self.government_framework = government_framework or GovernmentThinkingFramework()
        
        # Provider management
        self.providers: weakref.WeakSet = weakref.WeakSet()
        self.initialization_lock = threading.Lock()
        self.shutdown_event = threading.Event()
        
        # Cultural monitoring
        self.cultural_monitors: Dict[str, asyncio.Task] = {}
        self.compliance_alerts: List[Dict[str, Any]] = []
        
        # Performance tracking
        self.performance_metrics = {
            "total_servers_managed": 0,
            "active_connections": 0,
            "cultural_violations_detected": 0,
            "islamic_compliance_failures": 0,
            "professional_audit_failures": 0,
            "government_approval_pending": 0
        }
        
        # Start background monitoring
        asyncio.create_task(self._cultural_monitoring_loop())
        asyncio.create_task(self._compliance_audit_loop())
    
    async def get_hub_instance(self, 
                             context_id: str, 
                             provider: Any,
                             cultural_context: Optional[Dict[str, Any]] = None) -> IraqiMcpHub:
        """Get singleton hub instance with cultural context"""
        with self.initialization_lock:
            if context_id not in self.hub_instances:
                # Create new hub instance
                hub = IraqiMcpHub(
                    cultural_validator=self.cultural_validator
                )
                
                self.hub_instances[context_id] = hub
                
                # Register provider
                provider_id = f"{context_id}_{id(provider)}"
                self.registry.providers[provider_id] = ServerProvider(
                    provider_id=provider_id,
                    provider_name=str(provider),
                    cultural_context=cultural_context or {},
                    registration_timestamp=datetime.now()
                )
                
                self.providers.add(provider)
            
            return self.hub_instances[context_id]
    
    async def register_culturally_compliant_server(self,
                                                 context_id: str,
                                                 config: IraqiMcpServerConfig,
                                                 category: CulturalServerCategory,
                                                 provider_id: str) -> Dict[str, Any]:
        """Register server with comprehensive cultural validation"""
        try:
            # Validate cultural compliance
            if not await self._perform_cultural_pre_registration_audit(config, category):
                return {
                    "success": False,
                    "error": "Failed cultural pre-registration audit",
                    "cultural_compliance": False
                }
            
            # Check government approval if required
            policy = self.registry.cultural_policies.get(category)
            if policy and policy.government_approval_required:
                approval_result = await self._request_government_approval(config, category)
                if not approval_result["approved"]:
                    return {
                        "success": False,
                        "error": f"Government approval denied: {approval_result['reason']}",
                        "government_approval": False
                    }
            
            # Register in cultural registry
            if not self.registry.register_server(config, category, provider_id):
                return {
                    "success": False,
                    "error": "Failed to register in cultural registry",
                    "registry_error": True
                }
            
            # Get hub instance and register server
            hub = await self.get_hub_instance(context_id, provider_id)
            
            if await hub.register_server(config):
                # Start cultural monitoring
                await self._start_cultural_monitoring(config.name, category)
                
                self.performance_metrics["total_servers_managed"] += 1
                
                return {
                    "success": True,
                    "server_name": config.name,
                    "category": category.value,
                    "cultural_compliance": True,
                    "monitoring_active": True
                }
            else:
                # Registration failed, remove from cultural registry
                self.registry.unregister_server(config.name, provider_id)
                return {
                    "success": False,
                    "error": "Hub registration failed",
                    "hub_error": True
                }
            
        except Exception as e:
            logging.error(f"Server registration failed: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "exception_occurred": True
            }
    
    async def unregister_server(self, 
                              context_id: str, 
                              server_name: str, 
                              provider_id: str) -> bool:
        """Unregister server with cultural cleanup"""
        try:
            # Stop cultural monitoring
            await self._stop_cultural_monitoring(server_name)
            
            # Remove from hub
            if context_id in self.hub_instances:
                hub = self.hub_instances[context_id]
                await hub.unregister_server(server_name)
            
            # Remove from cultural registry
            success = self.registry.unregister_server(server_name, provider_id)
            
            if success:
                self.performance_metrics["total_servers_managed"] -= 1
            
            return success
            
        except Exception as e:
            logging.error(f"Server unregistration failed: {str(e)}")
            return False
    
    async def get_culturally_appropriate_servers(self,
                                               context_id: str,
                                               cultural_context: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Get servers appropriate for cultural context"""
        try:
            # Get hub instance
            if context_id not in self.hub_instances:
                return []
            
            hub = self.hub_instances[context_id]
            
            # Get culturally appropriate servers from registry
            appropriate_configs = self.registry.get_culturally_appropriate_servers(cultural_context)
            
            # Get server status from hub
            server_list = await hub.list_available_servers(include_disabled=False)
            server_status_map = {s["name"]: s for s in server_list}
            
            # Combine registry and hub information
            result = []
            for config in appropriate_configs:
                server_info = server_status_map.get(config.name, {})
                category = self.registry.server_categories.get(config.name)
                
                result.append({
                    "name": config.name,
                    "category": category.value if category else "unknown",
                    "status": server_info.get("status", "unknown"),
                    "cultural_features": server_info.get("cultural_features", {}),
                    "validation_level": config.cultural_validation_level.value,
                    "professional_domain": config.professional_domain,
                    "cultural_score": await self._calculate_cultural_match_score(config, cultural_context)
                })
            
            # Sort by cultural score (highest first)
            result.sort(key=lambda x: x["cultural_score"], reverse=True)
            
            return result
            
        except Exception as e:
            logging.error(f"Failed to get culturally appropriate servers: {str(e)}")
            return []
    
    async def perform_cultural_audit(self, server_name: str) -> Dict[str, Any]:
        """Perform comprehensive cultural audit of server"""
        try:
            if server_name not in self.registry.registered_servers:
                return {"error": f"Server {server_name} not found in registry"}
            
            config = self.registry.registered_servers[server_name]
            category = self.registry.server_categories[server_name]
            policy = self.registry.cultural_policies[category]
            
            audit_result = {
                "server_name": server_name,
                "audit_timestamp": datetime.now().isoformat(),
                "category": category.value,
                "compliance_status": "unknown",
                "findings": [],
                "recommendations": [],
                "cultural_score": 0.0,
                "islamic_compliance": False,
                "family_appropriate": False,
                "professional_standards": False
            }
            
            # Validate against cultural policy
            policy_compliance = self.registry._validate_server_against_policy(config, policy)
            if not policy_compliance:
                audit_result["findings"].append("Server configuration does not meet cultural policy requirements")
            
            # Check Islamic compliance
            islamic_compliance = config.islamic_compliance_required
            audit_result["islamic_compliance"] = islamic_compliance
            if not islamic_compliance and policy.islamic_compliance_mandatory:
                audit_result["findings"].append("Islamic compliance required but not enabled")
            
            # Check family appropriateness
            family_appropriate = config.family_context_sensitive or not policy.family_filtering_required
            audit_result["family_appropriate"] = family_appropriate
            if not family_appropriate:
                audit_result["findings"].append("Family filtering required but not enabled")
            
            # Check professional standards
            professional_standards = bool(config.professional_domain) if policy.professional_oversight_needed else True
            audit_result["professional_standards"] = professional_standards
            if not professional_standards:
                audit_result["findings"].append("Professional domain oversight required")
            
            # Calculate overall cultural score
            score_components = []
            if policy_compliance:
                score_components.append(0.3)
            if islamic_compliance:
                score_components.append(0.3)
            if family_appropriate:
                score_components.append(0.2)
            if professional_standards:
                score_components.append(0.2)
            
            audit_result["cultural_score"] = sum(score_components)
            
            # Determine compliance status
            if audit_result["cultural_score"] >= 0.8:
                audit_result["compliance_status"] = "compliant"
            elif audit_result["cultural_score"] >= 0.6:
                audit_result["compliance_status"] = "partially_compliant"
            else:
                audit_result["compliance_status"] = "non_compliant"
            
            # Generate recommendations
            if not policy_compliance:
                audit_result["recommendations"].append("Update server configuration to meet cultural policy")
            if not islamic_compliance and policy.islamic_compliance_mandatory:
                audit_result["recommendations"].append("Enable Islamic compliance features")
            if not family_appropriate:
                audit_result["recommendations"].append("Implement family content filtering")
            if not professional_standards:
                audit_result["recommendations"].append("Assign professional domain oversight")
            
            # Record audit in performance metrics
            if audit_result["compliance_status"] == "non_compliant":
                self.performance_metrics["cultural_violations_detected"] += 1
            
            return audit_result
            
        except Exception as e:
            logging.error(f"Cultural audit failed for {server_name}: {str(e)}")
            return {
                "error": str(e),
                "server_name": server_name,
                "audit_timestamp": datetime.now().isoformat()
            }
    
    async def get_cultural_compliance_report(self) -> Dict[str, Any]:
        """Generate comprehensive cultural compliance report"""
        try:
            report = {
                "generated_at": datetime.now().isoformat(),
                "total_servers": len(self.registry.registered_servers),
                "performance_metrics": self.performance_metrics.copy(),
                "servers_by_category": {},
                "compliance_summary": {},
                "recent_violations": self.compliance_alerts[-10:],  # Last 10 alerts
                "recommendations": []
            }
            
            # Analyze servers by category
            for category in CulturalServerCategory:
                servers = self.registry.get_servers_by_category(category)
                report["servers_by_category"][category.value] = {
                    "count": len(servers),
                    "servers": [s.name for s in servers]
                }
            
            # Perform compliance analysis
            compliance_scores = []
            islamic_compliance_count = 0
            family_filtering_count = 0
            professional_oversight_count = 0
            
            for config in self.registry.registered_servers.values():
                # Calculate compliance score for each server
                score = 0.0
                if config.islamic_compliance_required:
                    score += 0.4
                    islamic_compliance_count += 1
                if config.family_context_sensitive:
                    score += 0.3
                    family_filtering_count += 1
                if config.professional_domain:
                    score += 0.3
                    professional_oversight_count += 1
                
                compliance_scores.append(score)
            
            # Calculate compliance summary
            if compliance_scores:
                report["compliance_summary"] = {
                    "average_compliance_score": sum(compliance_scores) / len(compliance_scores),
                    "islamic_compliance_rate": islamic_compliance_count / len(compliance_scores),
                    "family_filtering_rate": family_filtering_count / len(compliance_scores),
                    "professional_oversight_rate": professional_oversight_count / len(compliance_scores),
                    "fully_compliant_servers": sum(1 for score in compliance_scores if score >= 0.8),
                    "partially_compliant_servers": sum(1 for score in compliance_scores if 0.6 <= score < 0.8),
                    "non_compliant_servers": sum(1 for score in compliance_scores if score < 0.6)
                }
            
            # Generate recommendations
            if report["compliance_summary"].get("islamic_compliance_rate", 0) < 0.9:
                report["recommendations"].append("Improve Islamic compliance across servers")
            
            if report["compliance_summary"].get("family_filtering_rate", 0) < 0.7:
                report["recommendations"].append("Implement family filtering for family-oriented servers")
            
            if self.performance_metrics["cultural_violations_detected"] > 10:
                report["recommendations"].append("Review cultural violation patterns and implement preventive measures")
            
            return report
            
        except Exception as e:
            logging.error(f"Failed to generate compliance report: {str(e)}")
            return {"error": str(e), "generated_at": datetime.now().isoformat()}
    
    async def cleanup(self, context_id: str) -> None:
        """Clean up hub instance and all resources"""
        try:
            if context_id in self.hub_instances:
                hub = self.hub_instances[context_id]
                await hub.shutdown()
                del self.hub_instances[context_id]
            
            # Stop all cultural monitoring for this context
            tasks_to_stop = [
                task for name, task in self.cultural_monitors.items()
                if name.startswith(context_id)
            ]
            
            for task in tasks_to_stop:
                task.cancel()
                try:
                    await task
                except asyncio.CancelledError:
                    pass
            
            # Remove monitoring tasks
            self.cultural_monitors = {
                name: task for name, task in self.cultural_monitors.items()
                if not name.startswith(context_id)
            }
            
        except Exception as e:
            logging.error(f"Cleanup failed for context {context_id}: {str(e)}")
    
    async def _perform_cultural_pre_registration_audit(self, 
                                                     config: IraqiMcpServerConfig,
                                                     category: CulturalServerCategory) -> bool:
        """Perform cultural audit before server registration"""
        try:
            policy = self.registry.cultural_policies.get(category)
            if not policy:
                return False
            
            # Validate configuration against policy
            return self.registry._validate_server_against_policy(config, policy)
            
        except Exception as e:
            logging.error(f"Cultural pre-registration audit failed: {str(e)}")
            return False
    
    async def _request_government_approval(self, 
                                         config: IraqiMcpServerConfig,
                                         category: CulturalServerCategory) -> Dict[str, Any]:
        """Request government approval for sensitive server categories"""
        try:
            # Determine relevant ministries based on server category and domain
            relevant_ministries = self._determine_relevant_ministries(category, config.professional_domain)
            
            if not relevant_ministries:
                return {"approved": True, "reason": "No government oversight required"}
            
            # Use government thinking framework for approval process
            approval_request = {
                "server_name": config.name,
                "category": category.value,
                "professional_domain": config.professional_domain,
                "islamic_compliance": config.islamic_compliance_required,
                "family_context": config.family_context_sensitive,
                "cultural_validation_level": config.cultural_validation_level.value
            }
            
            # Simulate government approval process
            # In real implementation, this would integrate with government systems
            approval_result = await self.government_framework.analyze_government_thinking(
                json.dumps(approval_request),
                "technology_approval",
                relevant_ministries
            )
            
            # Process approval result
            if approval_result.get("approval_recommendation", "denied") == "approved":
                return {
                    "approved": True,
                    "ministries": [m.value for m in relevant_ministries],
                    "approval_id": f"GOV_{datetime.now().timestamp()}",
                    "conditions": approval_result.get("conditions", [])
                }
            else:
                return {
                    "approved": False,
                    "reason": approval_result.get("denial_reason", "Government approval denied"),
                    "ministries": [m.value for m in relevant_ministries]
                }
            
        except Exception as e:
            logging.error(f"Government approval request failed: {str(e)}")
            return {"approved": False, "reason": f"Approval process error: {str(e)}"}
    
    def _determine_relevant_ministries(self, 
                                     category: CulturalServerCategory,
                                     professional_domain: Optional[str]) -> List[MinistryDomain]:
        """Determine relevant government ministries for approval"""
        ministries = []
        
        if category == CulturalServerCategory.GOVERNMENT_SERVICES:
            ministries.extend([MinistryDomain.DIGITAL_TRANSFORMATION, MinistryDomain.INTERIOR])
        
        if category == CulturalServerCategory.PROFESSIONAL_LEGAL:
            ministries.append(MinistryDomain.JUSTICE)
        
        if category == CulturalServerCategory.PROFESSIONAL_MEDICAL:
            ministries.append(MinistryDomain.HEALTH)
        
        if category == CulturalServerCategory.EDUCATIONAL:
            ministries.extend([MinistryDomain.EDUCATION, MinistryDomain.HIGHER_EDUCATION])
        
        if professional_domain:
            domain_ministry_map = {
                "agriculture": MinistryDomain.AGRICULTURE,
                "finance": MinistryDomain.FINANCE,
                "oil": MinistryDomain.OIL,
                "transportation": MinistryDomain.TRANSPORTATION,
                "telecommunications": MinistryDomain.COMMUNICATIONS
            }
            
            if professional_domain in domain_ministry_map:
                ministries.append(domain_ministry_map[professional_domain])
        
        return list(set(ministries))  # Remove duplicates
    
    async def _start_cultural_monitoring(self, 
                                       server_name: str, 
                                       category: CulturalServerCategory) -> None:
        """Start cultural monitoring for server"""
        try:
            monitor_task = asyncio.create_task(
                self._cultural_monitor_loop(server_name, category)
            )
            self.cultural_monitors[server_name] = monitor_task
            
        except Exception as e:
            logging.error(f"Failed to start cultural monitoring for {server_name}: {str(e)}")
    
    async def _stop_cultural_monitoring(self, server_name: str) -> None:
        """Stop cultural monitoring for server"""
        try:
            if server_name in self.cultural_monitors:
                task = self.cultural_monitors[server_name]
                task.cancel()
                try:
                    await task
                except asyncio.CancelledError:
                    pass
                del self.cultural_monitors[server_name]
                
        except Exception as e:
            logging.error(f"Failed to stop cultural monitoring for {server_name}: {str(e)}")
    
    async def _cultural_monitor_loop(self, 
                                   server_name: str, 
                                   category: CulturalServerCategory) -> None:
        """Background cultural monitoring loop for server"""
        try:
            policy = self.registry.cultural_policies.get(category)
            if not policy:
                return
            
            audit_interval = policy.cultural_audit_interval
            
            while not self.shutdown_event.is_set():
                try:
                    # Perform cultural audit
                    audit_result = await self.perform_cultural_audit(server_name)
                    
                    # Check for violations
                    if audit_result.get("compliance_status") == "non_compliant":
                        await self._handle_cultural_violation(server_name, audit_result, policy)
                    
                    # Wait for next audit interval
                    await asyncio.sleep(audit_interval)
                    
                except asyncio.CancelledError:
                    break
                except Exception as e:
                    logging.error(f"Cultural monitoring error for {server_name}: {str(e)}")
                    await asyncio.sleep(30)  # Brief pause on error
                    
        except Exception as e:
            logging.error(f"Cultural monitoring loop failed for {server_name}: {str(e)}")
    
    async def _handle_cultural_violation(self, 
                                       server_name: str, 
                                       audit_result: Dict[str, Any],
                                       policy: CulturalServerPolicy) -> None:
        """Handle detected cultural violations"""
        try:
            violation_alert = {
                "timestamp": datetime.now().isoformat(),
                "server_name": server_name,
                "violation_type": "cultural_compliance",
                "severity": "high" if audit_result["cultural_score"] < 0.4 else "medium",
                "findings": audit_result.get("findings", []),
                "cultural_score": audit_result["cultural_score"],
                "auto_action_taken": False
            }
            
            # Add to compliance alerts
            self.compliance_alerts.append(violation_alert)
            
            # Take automatic action if configured
            if policy.auto_disconnect_on_violations:
                # Find hub instance and disconnect server
                for hub in self.hub_instances.values():
                    try:
                        await hub.unregister_server(server_name)
                        violation_alert["auto_action_taken"] = True
                        violation_alert["action"] = "server_disconnected"
                        break
                    except:
                        continue
            
            # Update performance metrics
            self.performance_metrics["cultural_violations_detected"] += 1
            
            # Log violation
            logging.warning(f"Cultural violation detected for {server_name}: {audit_result}")
            
        except Exception as e:
            logging.error(f"Failed to handle cultural violation for {server_name}: {str(e)}")
    
    async def _calculate_cultural_match_score(self, 
                                            config: IraqiMcpServerConfig,
                                            cultural_context: Dict[str, Any]) -> float:
        """Calculate cultural match score between server and context"""
        try:
            score = 0.0
            max_score = 1.0
            
            # Islamic compliance match
            if cultural_context.get("islamic_compliance", True):
                if config.islamic_compliance_required:
                    score += 0.3
            else:
                score += 0.3  # No penalty for not requiring when not needed
            
            # Family context match
            if cultural_context.get("family_context", False):
                if config.family_context_sensitive:
                    score += 0.25
                else:
                    score -= 0.1  # Penalty for family context without filtering
            else:
                score += 0.25  # No family requirements
            
            # Professional domain match
            required_domain = cultural_context.get("professional_domain")
            if required_domain:
                if config.professional_domain == required_domain:
                    score += 0.25
                else:
                    score -= 0.2  # Penalty for domain mismatch
            else:
                score += 0.25  # No domain requirements
            
            # Arabic language support
            if cultural_context.get("arabic_content", False):
                if config.arabic_language_support:
                    score += 0.2
                else:
                    score -= 0.15  # Penalty for Arabic content without support
            else:
                score += 0.2  # No Arabic requirements
            
            return max(0.0, min(1.0, score))  # Clamp to [0, 1]
            
        except Exception as e:
            logging.error(f"Failed to calculate cultural match score: {str(e)}")
            return 0.0
    
    async def _cultural_monitoring_loop(self) -> None:
        """Main cultural monitoring loop for all servers"""
        while not self.shutdown_event.is_set():
            try:
                # Update active connections count
                total_active = 0
                for hub in self.hub_instances.values():
                    metrics = await hub.get_cultural_metrics()
                    total_active += metrics.get("active_connections", 0)
                
                self.performance_metrics["active_connections"] = total_active
                
                # Clean up old compliance alerts (keep last 100)
                if len(self.compliance_alerts) > 100:
                    self.compliance_alerts = self.compliance_alerts[-100:]
                
                await asyncio.sleep(60)  # Update every minute
                
            except Exception as e:
                logging.error(f"Cultural monitoring loop error: {str(e)}")
                await asyncio.sleep(10)
    
    async def _compliance_audit_loop(self) -> None:
        """Background compliance audit loop"""
        while not self.shutdown_event.is_set():
            try:
                # Perform periodic compliance audits
                for server_name in self.registry.registered_servers.keys():
                    audit_result = await self.perform_cultural_audit(server_name)
                    
                    # Update performance metrics based on audit results
                    if not audit_result.get("islamic_compliance", True):
                        self.performance_metrics["islamic_compliance_failures"] += 1
                    
                    if not audit_result.get("professional_standards", True):
                        self.performance_metrics["professional_audit_failures"] += 1
                
                await asyncio.sleep(3600)  # Audit every hour
                
            except Exception as e:
                logging.error(f"Compliance audit loop error: {str(e)}")
                await asyncio.sleep(300)  # Brief pause on error


# Example usage and testing
if __name__ == "__main__":
    async def test_cultural_server_manager():
        """Test the Cultural Server Manager with various scenarios"""
        
        # Create manager
        manager = CulturalServerManager()
        
        # Test server configurations for different categories
        test_configs = [
            {
                "config": IraqiMcpServerConfig(
                    name="legal_compliance_server",
                    server_type=McpServerType.STDIO,
                    connection_params={"command": "python", "args": ["-m", "legal_server"]},
                    professional_domain="legal",
                    islamic_compliance_required=True,
                    cultural_validation_level=CulturalValidationLevel.PROFESSIONAL
                ),
                "category": CulturalServerCategory.PROFESSIONAL_LEGAL,
                "provider": "legal_services_provider"
            },
            {
                "config": IraqiMcpServerConfig(
                    name="family_content_server", 
                    server_type=McpServerType.STDIO,
                    connection_params={"command": "python", "args": ["-m", "family_server"]},
                    family_context_sensitive=True,
                    islamic_compliance_required=True,
                    cultural_validation_level=CulturalValidationLevel.FAMILY
                ),
                "category": CulturalServerCategory.FAMILY_ORIENTED,
                "provider": "family_services_provider"
            },
            {
                "config": IraqiMcpServerConfig(
                    name="government_portal_server",
                    server_type=McpServerType.STDIO, 
                    connection_params={"command": "python", "args": ["-m", "gov_server"]},
                    government_service_context=True,
                    islamic_compliance_required=True,
                    cultural_validation_level=CulturalValidationLevel.GOVERNMENT
                ),
                "category": CulturalServerCategory.GOVERNMENT_SERVICES,
                "provider": "government_services_provider"
            }
        ]
        
        context_id = "test_context_001"
        
        # Register test servers
        for server_config in test_configs:
            print(f"\n🔧 Registering {server_config['config'].name}:")
            
            result = await manager.register_culturally_compliant_server(
                context_id,
                server_config["config"],
                server_config["category"],
                server_config["provider"]
            )
            
            if result["success"]:
                print(f"  ✅ Success - Category: {result['category']}, Monitoring: {result['monitoring_active']}")
            else:
                print(f"  ❌ Failed: {result['error']}")
        
        # Test cultural context matching
        cultural_contexts = [
            {
                "name": "Family Context",
                "context": {"family_context": True, "islamic_compliance": True}
            },
            {
                "name": "Legal Professional Context",
                "context": {"professional_domain": "legal", "islamic_compliance": True}
            },
            {
                "name": "Government Services Context", 
                "context": {"government_service": True, "islamic_compliance": True}
            }
        ]
        
        for context_test in cultural_contexts:
            print(f"\n🎯 Testing {context_test['name']}:")
            
            appropriate_servers = await manager.get_culturally_appropriate_servers(
                context_id, context_test["context"]
            )
            
            for server in appropriate_servers:
                print(f"  📋 {server['name']}: Score {server['cultural_score']:.2f}, Status: {server['status']}")
        
        # Perform cultural audits
        print(f"\n🔍 Cultural Compliance Audits:")
        for server_config in test_configs:
            server_name = server_config["config"].name
            audit_result = await manager.perform_cultural_audit(server_name)
            
            status_icon = "✅" if audit_result["compliance_status"] == "compliant" else "⚠️"
            print(f"  {status_icon} {server_name}: {audit_result['compliance_status']} (Score: {audit_result['cultural_score']:.2f})")
            
            if audit_result.get("findings"):
                for finding in audit_result["findings"]:
                    print(f"    🔍 Finding: {finding}")
        
        # Generate compliance report
        print(f"\n📊 Cultural Compliance Report:")
        report = await manager.get_cultural_compliance_report()
        
        print(f"  📈 Total Servers: {report['total_servers']}")
        print(f"  📊 Performance Metrics:")
        for metric, value in report["performance_metrics"].items():
            if isinstance(value, (int, float)):
                print(f"    {metric}: {value}")
        
        if report.get("compliance_summary"):
            summary = report["compliance_summary"]
            print(f"  🎯 Compliance Summary:")
            print(f"    Average Score: {summary['average_compliance_score']:.2%}")
            print(f"    Islamic Compliance Rate: {summary['islamic_compliance_rate']:.2%}")
            print(f"    Family Filtering Rate: {summary['family_filtering_rate']:.2%}")
        
        if report.get("recommendations"):
            print(f"  💡 Recommendations:")
            for rec in report["recommendations"]:
                print(f"    • {rec}")
        
        # Cleanup
        await manager.cleanup(context_id)
        print("\n🔚 Cultural Server Manager test complete")
    
    # Run the test
    asyncio.run(test_cultural_server_manager())