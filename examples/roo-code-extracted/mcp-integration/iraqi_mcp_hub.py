"""
Iraqi MCP Hub - Enhanced MCP server management with cultural integration
Part of Roo-Code extraction with comprehensive Iraqi cultural compliance

Extends Roo-Code's McpHub patterns with Iraqi cultural validation,
Islamic compliance checking, Arabic language processing, and professional
domain expertise for comprehensive Model Context Protocol management.
- Cultural context-aware server selection and routing
- Islamic compliance validation for all MCP operations
- Arabic-first interface design with RTL support
- Professional domain integration for Iraqi sectors

Based on: RooCodeInc/Roo-Code MCP integration patterns
Enhanced for: Iraqi AI Chat System with cultural and professional compliance
"""

from typing import Dict, List, Optional, Any, Tuple, Union, Set
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
import asyncio
import json
import logging
from pathlib import Path
import weakref
from abc import ABC, abstractmethod

# Cultural and Islamic compliance imports
from ..tool-orchestration.cultural_tool_validator import CulturalToolValidator, IslamicToolValidationPatterns
from ..sequential-thinking.cultural_context_analyzer import CulturalContextAnalyzer, IraqiRegionalContext


class McpServerType(Enum):
    """MCP server connection types for Iraqi context"""
    STDIO = "stdio"                    # Standard input/output based servers
    HTTP = "http"                     # HTTP-based servers  
    WEBSOCKET = "websocket"           # WebSocket connections
    GRPC = "grpc"                     # gRPC connections
    SECURE_HTTP = "secure_http"       # HTTPS with Iraqi compliance
    GOVERNMENT_SECURE = "government_secure"  # Iraqi government secure channels


class McpServerStatus(Enum):
    """MCP server connection status"""
    DISCONNECTED = "disconnected"
    CONNECTING = "connecting"
    CONNECTED = "connected"
    ERROR = "error"
    DISABLED = "disabled"
    CULTURAL_BLOCKED = "cultural_blocked"  # Blocked due to cultural concerns
    ISLAMIC_BLOCKED = "islamic_blocked"    # Blocked due to Islamic compliance


class CulturalValidationLevel(Enum):
    """Cultural validation levels for Iraqi MCP operations"""
    BASIC = "basic"                    # Basic cultural checks
    STANDARD = "standard"              # Standard Iraqi cultural validation
    PROFESSIONAL = "professional"     # Professional domain validation
    GOVERNMENT = "government"          # Government service validation
    FAMILY = "family"                  # Family context validation
    RELIGIOUS = "religious"            # Religious context validation


@dataclass
class IraqiMcpServerConfig:
    """Enhanced MCP server configuration with Iraqi cultural context"""
    name: str
    server_type: McpServerType
    connection_params: Dict[str, Any]
    timeout: float = 60.0
    disabled: bool = False
    
    # Iraqi-specific configuration
    cultural_context: Optional[Dict[str, Any]] = None
    professional_domain: Optional[str] = None
    islamic_compliance_required: bool = True
    arabic_language_support: bool = False
    government_service_context: bool = False
    family_context_sensitive: bool = False
    
    # Validation settings
    cultural_validation_level: CulturalValidationLevel = CulturalValidationLevel.STANDARD
    allowed_cultural_domains: Set[str] = field(default_factory=set)
    blocked_cultural_patterns: Set[str] = field(default_factory=set)
    
    # Performance and monitoring
    max_concurrent_requests: int = 10
    health_check_interval: int = 30
    error_history: List[Dict[str, Any]] = field(default_factory=list)


@dataclass
class McpToolCall:
    """Enhanced MCP tool call with Iraqi cultural context"""
    server_name: str
    tool_name: str
    arguments: Dict[str, Any]
    call_id: str
    timestamp: datetime
    
    # Cultural context
    cultural_context: Optional[Dict[str, Any]] = None
    professional_domain: Optional[str] = None
    islamic_compliance_status: Optional[bool] = None
    arabic_content: bool = False
    family_context: bool = False
    
    # Response data
    response: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    execution_duration: Optional[float] = None
    cultural_validation_score: Optional[float] = None


@dataclass
class McpResourceRequest:
    """Enhanced MCP resource request with Iraqi cultural validation"""
    server_name: str
    resource_uri: str
    request_id: str
    timestamp: datetime
    
    # Cultural validation
    cultural_context: Optional[Dict[str, Any]] = None
    requires_family_filtering: bool = False
    requires_islamic_compliance: bool = True
    professional_domain_context: Optional[str] = None
    
    # Request metadata
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    regional_context: Optional[IraqiRegionalContext] = None


class IraqiMcpConnection(ABC):
    """Abstract base class for Iraqi MCP connections"""
    
    def __init__(self, config: IraqiMcpServerConfig):
        self.config = config
        self.status = McpServerStatus.DISCONNECTED
        self.connection = None
        self.last_activity = datetime.now()
        self.error_history: List[Dict[str, Any]] = []
    
    @abstractmethod
    async def connect(self) -> bool:
        """Establish connection to MCP server"""
        pass
    
    @abstractmethod
    async def disconnect(self) -> None:
        """Close connection to MCP server"""
        pass
    
    @abstractmethod
    async def call_tool(self, tool_call: McpToolCall) -> Dict[str, Any]:
        """Execute tool call on MCP server"""
        pass
    
    @abstractmethod
    async def get_resource(self, resource_request: McpResourceRequest) -> Dict[str, Any]:
        """Retrieve resource from MCP server"""
        pass
    
    @abstractmethod
    async def health_check(self) -> bool:
        """Perform health check on connection"""
        pass


class StdioMcpConnection(IraqiMcpConnection):
    """Standard I/O based MCP connection with Iraqi cultural validation"""
    
    def __init__(self, config: IraqiMcpServerConfig):
        super().__init__(config)
        self.process = None
        self.stdin_writer = None
        self.stdout_reader = None
    
    async def connect(self) -> bool:
        """Establish stdio connection with cultural validation"""
        try:
            # Validate cultural appropriateness of connection
            if not await self._validate_cultural_connection():
                self.status = McpServerStatus.CULTURAL_BLOCKED
                return False
            
            self.status = McpServerStatus.CONNECTING
            
            # Extract connection parameters
            command = self.config.connection_params.get("command")
            args = self.config.connection_params.get("args", [])
            env = self.config.connection_params.get("env", {})
            
            if not command:
                raise ValueError("Command required for stdio connection")
            
            # Start process with cultural environment
            cultural_env = {**env, **self._get_cultural_environment()}
            
            self.process = await asyncio.create_subprocess_exec(
                command, *args,
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                env=cultural_env
            )
            
            self.stdin_writer = self.process.stdin
            self.stdout_reader = self.process.stdout
            
            # Perform initial handshake with cultural context
            await self._perform_cultural_handshake()
            
            self.status = McpServerStatus.CONNECTED
            self.last_activity = datetime.now()
            return True
            
        except Exception as e:
            self.status = McpServerStatus.ERROR
            self._record_error(f"Connection failed: {str(e)}")
            return False
    
    async def disconnect(self) -> None:
        """Close stdio connection gracefully"""
        try:
            if self.process and self.process.returncode is None:
                self.process.terminate()
                try:
                    await asyncio.wait_for(self.process.wait(), timeout=5.0)
                except asyncio.TimeoutError:
                    self.process.kill()
                    await self.process.wait()
            
            self.status = McpServerStatus.DISCONNECTED
            self.process = None
            self.stdin_writer = None
            self.stdout_reader = None
            
        except Exception as e:
            self._record_error(f"Disconnection error: {str(e)}")
    
    async def call_tool(self, tool_call: McpToolCall) -> Dict[str, Any]:
        """Execute tool call with cultural validation"""
        try:
            # Validate cultural appropriateness
            cultural_valid, cultural_concerns = await self._validate_tool_call(tool_call)
            if not cultural_valid:
                return {
                    "success": False,
                    "error": f"Cultural validation failed: {'; '.join(cultural_concerns)}",
                    "cultural_concerns": cultural_concerns
                }
            
            # Prepare culturally-aware request
            request = {
                "jsonrpc": "2.0",
                "id": tool_call.call_id,
                "method": "tools/call",
                "params": {
                    "name": tool_call.tool_name,
                    "arguments": tool_call.arguments,
                    "cultural_context": tool_call.cultural_context,
                    "professional_domain": tool_call.professional_domain
                }
            }
            
            # Send request with timeout
            start_time = datetime.now()
            response = await self._send_request_with_timeout(request, self.config.timeout)
            execution_duration = (datetime.now() - start_time).total_seconds()
            
            # Validate response culturally
            validated_response = await self._validate_tool_response(response, tool_call)
            
            # Update tool call with results
            tool_call.response = validated_response
            tool_call.execution_duration = execution_duration
            tool_call.cultural_validation_score = validated_response.get("cultural_score", 0.0)
            
            self.last_activity = datetime.now()
            return validated_response
            
        except Exception as e:
            error_msg = f"Tool call failed: {str(e)}"
            self._record_error(error_msg)
            return {"success": False, "error": error_msg}
    
    async def get_resource(self, resource_request: McpResourceRequest) -> Dict[str, Any]:
        """Retrieve resource with cultural filtering"""
        try:
            # Validate cultural appropriateness of resource
            if not await self._validate_resource_request(resource_request):
                return {
                    "success": False,
                    "error": "Resource blocked due to cultural concerns",
                    "cultural_validation": False
                }
            
            # Prepare culturally-aware resource request
            request = {
                "jsonrpc": "2.0",
                "id": resource_request.request_id,
                "method": "resources/read",
                "params": {
                    "uri": resource_request.resource_uri,
                    "cultural_context": resource_request.cultural_context,
                    "family_filtering": resource_request.requires_family_filtering,
                    "islamic_compliance": resource_request.requires_islamic_compliance
                }
            }
            
            # Send request with timeout
            response = await self._send_request_with_timeout(request, self.config.timeout)
            
            # Apply cultural filtering to response
            filtered_response = await self._apply_cultural_filtering(response, resource_request)
            
            self.last_activity = datetime.now()
            return filtered_response
            
        except Exception as e:
            error_msg = f"Resource retrieval failed: {str(e)}"
            self._record_error(error_msg)
            return {"success": False, "error": error_msg}
    
    async def health_check(self) -> bool:
        """Perform health check with cultural awareness"""
        try:
            if self.status != McpServerStatus.CONNECTED:
                return False
            
            if self.process and self.process.returncode is not None:
                self.status = McpServerStatus.DISCONNECTED
                return False
            
            # Perform cultural health check
            health_request = {
                "jsonrpc": "2.0",
                "id": f"health_check_{datetime.now().timestamp()}",
                "method": "ping",
                "params": {"cultural_context": True}
            }
            
            response = await self._send_request_with_timeout(health_request, 10.0)
            return response.get("result") == "pong"
            
        except Exception as e:
            self._record_error(f"Health check failed: {str(e)}")
            return False
    
    async def _validate_cultural_connection(self) -> bool:
        """Validate cultural appropriateness of server connection"""
        # Check if server supports required cultural features
        if self.config.arabic_language_support and not self._supports_arabic():
            return False
        
        # Validate professional domain compatibility
        if self.config.professional_domain:
            if not await self._validate_professional_domain():
                return False
        
        # Check Islamic compliance requirements
        if self.config.islamic_compliance_required:
            if not await self._validate_islamic_compliance():
                return False
        
        return True
    
    def _get_cultural_environment(self) -> Dict[str, str]:
        """Get cultural environment variables"""
        cultural_env = {
            "LANG": "ar_IQ.UTF-8",
            "LC_ALL": "ar_IQ.UTF-8",
            "IRAQI_CULTURAL_MODE": "enabled",
            "ISLAMIC_COMPLIANCE": "true" if self.config.islamic_compliance_required else "false"
        }
        
        if self.config.professional_domain:
            cultural_env["PROFESSIONAL_DOMAIN"] = self.config.professional_domain
        
        if self.config.arabic_language_support:
            cultural_env["ARABIC_SUPPORT"] = "true"
        
        return cultural_env
    
    async def _perform_cultural_handshake(self) -> None:
        """Perform initial cultural handshake with server"""
        handshake = {
            "jsonrpc": "2.0",
            "id": "cultural_handshake",
            "method": "initialize",
            "params": {
                "capabilities": {
                    "cultural_validation": True,
                    "arabic_language": self.config.arabic_language_support,
                    "islamic_compliance": self.config.islamic_compliance_required,
                    "professional_domain": self.config.professional_domain
                },
                "cultural_context": self.config.cultural_context
            }
        }
        
        await self._send_request_with_timeout(handshake, 30.0)
    
    async def _validate_tool_call(self, tool_call: McpToolCall) -> Tuple[bool, List[str]]:
        """Validate tool call against cultural standards"""
        concerns = []
        
        # Basic cultural validation
        if tool_call.family_context and not self.config.family_context_sensitive:
            concerns.append("Tool not appropriate for family context")
        
        # Professional domain validation
        if tool_call.professional_domain:
            if self.config.professional_domain != tool_call.professional_domain:
                concerns.append(f"Professional domain mismatch: expected {self.config.professional_domain}")
        
        # Islamic compliance validation
        if self.config.islamic_compliance_required and tool_call.islamic_compliance_status is False:
            concerns.append("Tool usage not compliant with Islamic principles")
        
        # Arabic content validation
        if tool_call.arabic_content and not self.config.arabic_language_support:
            concerns.append("Server does not support Arabic language content")
        
        return len(concerns) == 0, concerns
    
    async def _validate_tool_response(self, response: Dict[str, Any], tool_call: McpToolCall) -> Dict[str, Any]:
        """Validate and enhance tool response with cultural context"""
        # Apply Islamic compliance filtering
        if self.config.islamic_compliance_required:
            response = await self._apply_islamic_filtering(response)
        
        # Apply family content filtering
        if tool_call.family_context:
            response = await self._apply_family_filtering(response)
        
        # Add cultural validation score
        cultural_score = await self._calculate_cultural_score(response, tool_call)
        response["cultural_score"] = cultural_score
        
        return response
    
    async def _validate_resource_request(self, resource_request: McpResourceRequest) -> bool:
        """Validate resource request against cultural standards"""
        # Check family filtering requirements
        if resource_request.requires_family_filtering:
            if not self._supports_family_filtering():
                return False
        
        # Check Islamic compliance requirements
        if resource_request.requires_islamic_compliance:
            if not self.config.islamic_compliance_required:
                return False
        
        # Check professional domain context
        if resource_request.professional_domain_context:
            if self.config.professional_domain != resource_request.professional_domain_context:
                return False
        
        return True
    
    async def _apply_cultural_filtering(self, response: Dict[str, Any], resource_request: McpResourceRequest) -> Dict[str, Any]:
        """Apply cultural filtering to resource response"""
        # Apply family filtering if required
        if resource_request.requires_family_filtering:
            response = await self._apply_family_filtering(response)
        
        # Apply Islamic compliance filtering
        if resource_request.requires_islamic_compliance:
            response = await self._apply_islamic_filtering(response)
        
        # Apply professional domain filtering
        if resource_request.professional_domain_context:
            response = await self._apply_professional_filtering(response, resource_request.professional_domain_context)
        
        return response
    
    async def _send_request_with_timeout(self, request: Dict[str, Any], timeout: float) -> Dict[str, Any]:
        """Send JSON-RPC request with timeout"""
        if not self.stdin_writer or not self.stdout_reader:
            raise RuntimeError("Connection not established")
        
        # Serialize and send request
        request_data = json.dumps(request).encode() + b'\n'
        self.stdin_writer.write(request_data)
        await self.stdin_writer.drain()
        
        # Read response with timeout
        try:
            response_data = await asyncio.wait_for(
                self.stdout_reader.readline(),
                timeout=timeout
            )
            
            if not response_data:
                raise RuntimeError("Server closed connection")
            
            response = json.loads(response_data.decode())
            
            # Handle JSON-RPC errors
            if "error" in response:
                raise RuntimeError(f"Server error: {response['error']}")
            
            return response.get("result", response)
            
        except asyncio.TimeoutError:
            raise RuntimeError(f"Request timeout after {timeout} seconds")
    
    def _supports_arabic(self) -> bool:
        """Check if server supports Arabic language processing"""
        return self.config.arabic_language_support
    
    async def _validate_professional_domain(self) -> bool:
        """Validate professional domain compatibility"""
        valid_domains = {
            "legal", "medical", "education", "government", 
            "finance", "engineering", "agriculture"
        }
        return self.config.professional_domain in valid_domains
    
    async def _validate_islamic_compliance(self) -> bool:
        """Validate Islamic compliance requirements"""
        # Check if server has required Islamic compliance features
        return self.config.islamic_compliance_required
    
    def _supports_family_filtering(self) -> bool:
        """Check if server supports family content filtering"""
        return self.config.family_context_sensitive
    
    async def _apply_islamic_filtering(self, response: Dict[str, Any]) -> Dict[str, Any]:
        """Apply Islamic compliance filtering to response"""
        # Filter content based on Islamic principles
        if "content" in response and isinstance(response["content"], str):
            # Apply basic Islamic content filtering
            filtered_content = await self._filter_islamic_content(response["content"])
            response["content"] = filtered_content
            response["islamic_filtered"] = True
        
        return response
    
    async def _apply_family_filtering(self, response: Dict[str, Any]) -> Dict[str, Any]:
        """Apply family-appropriate content filtering"""
        if "content" in response and isinstance(response["content"], str):
            # Apply family-safe content filtering
            filtered_content = await self._filter_family_content(response["content"])
            response["content"] = filtered_content
            response["family_filtered"] = True
        
        return response
    
    async def _apply_professional_filtering(self, response: Dict[str, Any], domain: str) -> Dict[str, Any]:
        """Apply professional domain-specific filtering"""
        if "content" in response:
            # Apply domain-specific professional filtering
            filtered_content = await self._filter_professional_content(response["content"], domain)
            response["content"] = filtered_content
            response["professional_filtered"] = True
            response["professional_domain"] = domain
        
        return response
    
    async def _calculate_cultural_score(self, response: Dict[str, Any], tool_call: McpToolCall) -> float:
        """Calculate cultural appropriateness score for response"""
        score = 1.0  # Start with perfect score
        
        # Deduct for missing cultural features
        if tool_call.arabic_content and not response.get("arabic_support"):
            score -= 0.2
        
        if tool_call.family_context and not response.get("family_filtered"):
            score -= 0.3
        
        if self.config.islamic_compliance_required and not response.get("islamic_filtered"):
            score -= 0.4
        
        if tool_call.professional_domain and not response.get("professional_filtered"):
            score -= 0.1
        
        return max(0.0, score)
    
    async def _filter_islamic_content(self, content: str) -> str:
        """Filter content for Islamic compliance"""
        # Basic Islamic content filtering - replace with actual implementation
        return content  # Placeholder
    
    async def _filter_family_content(self, content: str) -> str:
        """Filter content for family appropriateness"""
        # Basic family content filtering - replace with actual implementation  
        return content  # Placeholder
    
    async def _filter_professional_content(self, content: str, domain: str) -> str:
        """Filter content for professional domain appropriateness"""
        # Basic professional content filtering - replace with actual implementation
        return content  # Placeholder
    
    def _record_error(self, error: str) -> None:
        """Record error in connection history"""
        error_entry = {
            "timestamp": datetime.now().isoformat(),
            "error": error,
            "status": self.status.value
        }
        
        self.error_history.append(error_entry)
        
        # Keep only last 100 errors
        if len(self.error_history) > 100:
            self.error_history = self.error_history[-100:]
        
        # Update config error history
        self.config.error_history = self.error_history.copy()


class IraqiMcpHub:
    """
    Enhanced MCP Hub with comprehensive Iraqi cultural integration
    
    Based on Roo-Code patterns with advanced Iraqi cultural validation,
    Islamic compliance checking, and professional domain expertise.
    """
    
    def __init__(self, 
                 cultural_validator: Optional[CulturalToolValidator] = None,
                 islamic_validator: Optional[IslamicToolValidationPatterns] = None,
                 context_analyzer: Optional[CulturalContextAnalyzer] = None):
        
        self.connections: Dict[str, IraqiMcpConnection] = {}
        self.server_configs: Dict[str, IraqiMcpServerConfig] = {}
        self.connection_providers: weakref.WeakSet = weakref.WeakSet()
        
        # Cultural and Islamic validation
        self.cultural_validator = cultural_validator or CulturalToolValidator()
        self.islamic_validator = islamic_validator or IslamicToolValidationPatterns()
        self.context_analyzer = context_analyzer or CulturalContextAnalyzer()
        
        # Connection management
        self.max_connections = 20
        self.health_check_interval = 30
        self.is_shutting_down = False
        
        # Performance metrics
        self.metrics = {
            "total_connections": 0,
            "active_connections": 0,
            "failed_connections": 0,
            "cultural_blocks": 0,
            "islamic_violations": 0,
            "tool_calls_processed": 0,
            "average_response_time": 0.0
        }
        
        # Start background tasks
        asyncio.create_task(self._health_check_loop())
        asyncio.create_task(self._metrics_collection_loop())
    
    async def register_server(self, config: IraqiMcpServerConfig) -> bool:
        """Register new MCP server with cultural validation"""
        try:
            # Validate cultural appropriateness of server
            if not await self._validate_server_cultural_compliance(config):
                self.metrics["cultural_blocks"] += 1
                return False
            
            # Check connection limits
            if len(self.connections) >= self.max_connections:
                raise RuntimeError(f"Maximum connection limit ({self.max_connections}) reached")
            
            # Create appropriate connection type
            connection = await self._create_connection(config)
            
            # Store configuration and connection
            self.server_configs[config.name] = config
            self.connections[config.name] = connection
            
            # Attempt initial connection
            if await connection.connect():
                self.metrics["total_connections"] += 1
                self.metrics["active_connections"] += 1
                return True
            else:
                # Remove failed connection
                del self.connections[config.name]
                del self.server_configs[config.name]
                self.metrics["failed_connections"] += 1
                return False
                
        except Exception as e:
            logging.error(f"Failed to register server {config.name}: {str(e)}")
            self.metrics["failed_connections"] += 1
            return False
    
    async def unregister_server(self, server_name: str) -> bool:
        """Unregister MCP server"""
        try:
            if server_name not in self.connections:
                return False
            
            connection = self.connections[server_name]
            await connection.disconnect()
            
            del self.connections[server_name]
            del self.server_configs[server_name]
            
            self.metrics["active_connections"] -= 1
            return True
            
        except Exception as e:
            logging.error(f"Failed to unregister server {server_name}: {str(e)}")
            return False
    
    async def call_tool_with_cultural_validation(self, 
                                               server_name: str, 
                                               tool_name: str, 
                                               arguments: Dict[str, Any],
                                               cultural_context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Execute tool call with comprehensive cultural validation"""
        try:
            # Check if server exists and is connected
            if server_name not in self.connections:
                return {"success": False, "error": f"Server {server_name} not found"}
            
            connection = self.connections[server_name]
            if connection.status != McpServerStatus.CONNECTED:
                return {"success": False, "error": f"Server {server_name} not connected"}
            
            # Create enhanced tool call
            tool_call = McpToolCall(
                server_name=server_name,
                tool_name=tool_name,
                arguments=arguments,
                call_id=f"{server_name}_{tool_name}_{datetime.now().timestamp()}",
                timestamp=datetime.now(),
                cultural_context=cultural_context
            )
            
            # Analyze cultural context
            if cultural_context:
                cultural_analysis = await self.context_analyzer.analyze_cultural_context(
                    json.dumps(arguments), 
                    cultural_context.get("regional_context")
                )
                tool_call.cultural_context = cultural_analysis
            
            # Perform pre-execution validation
            validation_result = await self._validate_tool_execution(tool_call)
            if not validation_result["valid"]:
                return {
                    "success": False,
                    "error": "Cultural validation failed",
                    "validation_details": validation_result
                }
            
            # Execute tool call
            start_time = datetime.now()
            result = await connection.call_tool(tool_call)
            execution_time = (datetime.now() - start_time).total_seconds()
            
            # Update metrics
            self.metrics["tool_calls_processed"] += 1
            self._update_average_response_time(execution_time)
            
            return result
            
        except Exception as e:
            logging.error(f"Tool call failed for {server_name}.{tool_name}: {str(e)}")
            return {"success": False, "error": str(e)}
    
    async def get_resource_with_cultural_filtering(self, 
                                                 server_name: str, 
                                                 resource_uri: str,
                                                 cultural_context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Retrieve resource with cultural filtering applied"""
        try:
            if server_name not in self.connections:
                return {"success": False, "error": f"Server {server_name} not found"}
            
            connection = self.connections[server_name]
            if connection.status != McpServerStatus.CONNECTED:
                return {"success": False, "error": f"Server {server_name} not connected"}
            
            # Create resource request
            resource_request = McpResourceRequest(
                server_name=server_name,
                resource_uri=resource_uri,
                request_id=f"{server_name}_resource_{datetime.now().timestamp()}",
                timestamp=datetime.now(),
                cultural_context=cultural_context
            )
            
            # Set cultural requirements based on context
            if cultural_context:
                resource_request.requires_family_filtering = cultural_context.get("family_context", False)
                resource_request.requires_islamic_compliance = cultural_context.get("islamic_compliance", True)
                resource_request.professional_domain_context = cultural_context.get("professional_domain")
            
            # Execute resource request
            result = await connection.get_resource(resource_request)
            
            return result
            
        except Exception as e:
            logging.error(f"Resource retrieval failed for {server_name}: {str(e)}")
            return {"success": False, "error": str(e)}
    
    async def list_available_servers(self, include_disabled: bool = False) -> List[Dict[str, Any]]:
        """List all available MCP servers with cultural metadata"""
        servers = []
        
        for name, connection in self.connections.items():
            if not include_disabled and connection.config.disabled:
                continue
            
            config = self.server_configs[name]
            server_info = {
                "name": name,
                "type": connection.config.server_type.value,
                "status": connection.status.value,
                "cultural_features": {
                    "arabic_support": config.arabic_language_support,
                    "islamic_compliance": config.islamic_compliance_required,
                    "family_context": config.family_context_sensitive,
                    "professional_domain": config.professional_domain
                },
                "validation_level": config.cultural_validation_level.value,
                "last_activity": connection.last_activity.isoformat(),
                "error_count": len(connection.error_history)
            }
            servers.append(server_info)
        
        return servers
    
    async def get_server_health_status(self, server_name: Optional[str] = None) -> Dict[str, Any]:
        """Get health status for specific server or all servers"""
        if server_name:
            if server_name not in self.connections:
                return {"error": f"Server {server_name} not found"}
            
            connection = self.connections[server_name]
            health_status = await connection.health_check()
            
            return {
                "server": server_name,
                "healthy": health_status,
                "status": connection.status.value,
                "last_activity": connection.last_activity.isoformat(),
                "errors": connection.error_history[-5:]  # Last 5 errors
            }
        else:
            # Return health status for all servers
            all_status = {}
            for name, connection in self.connections.items():
                health_status = await connection.health_check()
                all_status[name] = {
                    "healthy": health_status,
                    "status": connection.status.value,
                    "last_activity": connection.last_activity.isoformat()
                }
            
            return all_status
    
    async def get_cultural_metrics(self) -> Dict[str, Any]:
        """Get cultural compliance and performance metrics"""
        cultural_scores = []
        islamic_compliance_rate = 0
        family_filtering_rate = 0
        
        for connection in self.connections.values():
            config = connection.config
            
            # Calculate cultural compliance score
            score = 1.0
            if config.islamic_compliance_required:
                score += 0.3
            if config.arabic_language_support:
                score += 0.2
            if config.family_context_sensitive:
                score += 0.2
            if config.professional_domain:
                score += 0.3
                
            cultural_scores.append(score)
        
        avg_cultural_score = sum(cultural_scores) / len(cultural_scores) if cultural_scores else 0
        
        return {
            **self.metrics,
            "average_cultural_score": avg_cultural_score,
            "servers_with_islamic_compliance": sum(1 for c in self.connections.values() if c.config.islamic_compliance_required),
            "servers_with_arabic_support": sum(1 for c in self.connections.values() if c.config.arabic_language_support),
            "servers_with_family_filtering": sum(1 for c in self.connections.values() if c.config.family_context_sensitive),
            "professional_domains": list(set(c.config.professional_domain for c in self.connections.values() if c.config.professional_domain))
        }
    
    async def shutdown(self) -> None:
        """Gracefully shutdown all connections"""
        self.is_shutting_down = True
        
        # Disconnect all servers
        disconnect_tasks = []
        for connection in self.connections.values():
            disconnect_tasks.append(connection.disconnect())
        
        if disconnect_tasks:
            await asyncio.gather(*disconnect_tasks, return_exceptions=True)
        
        self.connections.clear()
        self.server_configs.clear()
    
    async def _validate_server_cultural_compliance(self, config: IraqiMcpServerConfig) -> bool:
        """Validate server configuration for cultural compliance"""
        # Check required cultural features
        if config.cultural_validation_level == CulturalValidationLevel.RELIGIOUS:
            if not config.islamic_compliance_required:
                return False
        
        if config.cultural_validation_level == CulturalValidationLevel.FAMILY:
            if not config.family_context_sensitive:
                return False
        
        # Validate professional domain
        if config.professional_domain:
            valid_domains = {
                "legal", "medical", "education", "government",
                "finance", "engineering", "agriculture", "islamic_studies"
            }
            if config.professional_domain not in valid_domains:
                return False
        
        return True
    
    async def _create_connection(self, config: IraqiMcpServerConfig) -> IraqiMcpConnection:
        """Create appropriate connection type based on configuration"""
        if config.server_type == McpServerType.STDIO:
            return StdioMcpConnection(config)
        elif config.server_type == McpServerType.HTTP:
            # Create HTTP connection (not implemented in this example)
            raise NotImplementedError("HTTP connections not yet implemented")
        elif config.server_type == McpServerType.WEBSOCKET:
            # Create WebSocket connection (not implemented in this example)
            raise NotImplementedError("WebSocket connections not yet implemented")
        else:
            raise ValueError(f"Unsupported server type: {config.server_type}")
    
    async def _validate_tool_execution(self, tool_call: McpToolCall) -> Dict[str, Any]:
        """Validate tool execution against cultural standards"""
        validation_result = {
            "valid": True,
            "cultural_score": 1.0,
            "concerns": [],
            "islamic_compliance": True,
            "family_appropriate": True
        }
        
        # Cultural validation
        if tool_call.cultural_context:
            try:
                cultural_valid, cultural_concerns, cultural_score = await self.cultural_validator.validate_tool_repetition(
                    tool_call, tool_call.cultural_context, 1
                )
                
                validation_result["valid"] &= cultural_valid
                validation_result["cultural_score"] = cultural_score
                validation_result["concerns"].extend(cultural_concerns)
                
            except Exception as e:
                logging.error(f"Cultural validation error: {str(e)}")
                validation_result["concerns"].append(f"Cultural validation error: {str(e)}")
        
        # Islamic compliance validation
        if tool_call.islamic_compliance_status is not None:
            validation_result["islamic_compliance"] = tool_call.islamic_compliance_status
            validation_result["valid"] &= tool_call.islamic_compliance_status
            
            if not tool_call.islamic_compliance_status:
                validation_result["concerns"].append("Tool usage not compliant with Islamic principles")
                self.metrics["islamic_violations"] += 1
        
        # Family context validation
        if tool_call.family_context:
            # Check if server supports family filtering
            connection = self.connections.get(tool_call.server_name)
            if connection and not connection.config.family_context_sensitive:
                validation_result["family_appropriate"] = False
                validation_result["valid"] = False
                validation_result["concerns"].append("Tool not appropriate for family context")
        
        return validation_result
    
    async def _health_check_loop(self) -> None:
        """Background task for periodic health checks"""
        while not self.is_shutting_down:
            try:
                for name, connection in list(self.connections.items()):
                    if not await connection.health_check():
                        logging.warning(f"Health check failed for server {name}")
                        
                        # Attempt reconnection
                        if await connection.connect():
                            logging.info(f"Successfully reconnected to server {name}")
                        else:
                            logging.error(f"Failed to reconnect to server {name}")
                            connection.status = McpServerStatus.ERROR
                
                await asyncio.sleep(self.health_check_interval)
                
            except Exception as e:
                logging.error(f"Health check loop error: {str(e)}")
                await asyncio.sleep(5)  # Brief pause on error
    
    async def _metrics_collection_loop(self) -> None:
        """Background task for metrics collection"""
        while not self.is_shutting_down:
            try:
                # Update active connections count
                self.metrics["active_connections"] = sum(
                    1 for conn in self.connections.values() 
                    if conn.status == McpServerStatus.CONNECTED
                )
                
                await asyncio.sleep(60)  # Update metrics every minute
                
            except Exception as e:
                logging.error(f"Metrics collection error: {str(e)}")
                await asyncio.sleep(10)
    
    def _update_average_response_time(self, new_time: float) -> None:
        """Update running average of response times"""
        # Simple exponential moving average
        alpha = 0.1
        self.metrics["average_response_time"] = (
            alpha * new_time + (1 - alpha) * self.metrics["average_response_time"]
        )


# Example usage and testing
if __name__ == "__main__":
    async def test_iraqi_mcp_hub():
        """Test the Iraqi MCP Hub with various scenarios"""
        
        # Create hub
        hub = IraqiMcpHub()
        
        # Test server configurations
        test_configs = [
            IraqiMcpServerConfig(
                name="legal_server",
                server_type=McpServerType.STDIO,
                connection_params={
                    "command": "python",
                    "args": ["-m", "legal_mcp_server"],
                    "env": {"LEGAL_MODE": "true"}
                },
                professional_domain="legal",
                islamic_compliance_required=True,
                cultural_validation_level=CulturalValidationLevel.PROFESSIONAL,
                cultural_context={"domain": "legal", "compliance_level": "strict"}
            ),
            IraqiMcpServerConfig(
                name="family_content_server",
                server_type=McpServerType.STDIO,
                connection_params={
                    "command": "python",
                    "args": ["-m", "family_content_server"]
                },
                family_context_sensitive=True,
                islamic_compliance_required=True,
                cultural_validation_level=CulturalValidationLevel.FAMILY,
                cultural_context={"family_safe": True, "child_appropriate": True}
            ),
            IraqiMcpServerConfig(
                name="arabic_language_server",
                server_type=McpServerType.STDIO,
                connection_params={
                    "command": "python",
                    "args": ["-m", "arabic_nlp_server"]
                },
                arabic_language_support=True,
                islamic_compliance_required=True,
                cultural_validation_level=CulturalValidationLevel.STANDARD,
                cultural_context={"language": "arabic", "dialect": "iraqi"}
            )
        ]
        
        # Register test servers
        for config in test_configs:
            success = await hub.register_server(config)
            print(f"Registered {config.name}: {'✅ Success' if success else '❌ Failed'}")
        
        # Test tool calls with cultural validation
        test_calls = [
            {
                "server": "legal_server",
                "tool": "analyze_contract",
                "args": {"contract_text": "Sample legal contract in Arabic"},
                "context": {"professional_domain": "legal", "islamic_compliance": True}
            },
            {
                "server": "family_content_server", 
                "tool": "filter_content",
                "args": {"content": "Family-friendly content for children"},
                "context": {"family_context": True, "child_appropriate": True}
            },
            {
                "server": "arabic_language_server",
                "tool": "translate_text",
                "args": {"text": "Hello, how are you?", "target_language": "arabic"},
                "context": {"language": "arabic", "cultural_context": "iraqi"}
            }
        ]
        
        # Execute test calls
        for call in test_calls:
            print(f"\n🧪 Testing {call['server']}.{call['tool']}:")
            
            result = await hub.call_tool_with_cultural_validation(
                call["server"], call["tool"], call["args"], call["context"]
            )
            
            if result.get("success"):
                print(f"  ✅ Success - Cultural Score: {result.get('cultural_score', 'N/A')}")
            else:
                print(f"  ❌ Failed: {result.get('error')}")
                if "validation_details" in result:
                    print(f"     Validation Issues: {result['validation_details'].get('concerns', [])}")
        
        # Display cultural metrics
        print(f"\n📊 Cultural Compliance Metrics:")
        metrics = await hub.get_cultural_metrics()
        for key, value in metrics.items():
            if isinstance(value, float):
                print(f"  {key}: {value:.2%}")
            else:
                print(f"  {key}: {value}")
        
        # Display server health status
        print(f"\n🏥 Server Health Status:")
        health_status = await hub.get_server_health_status()
        for server, status in health_status.items():
            health_indicator = "🟢" if status["healthy"] else "🔴"
            print(f"  {health_indicator} {server}: {status['status']}")
        
        # Cleanup
        await hub.shutdown()
        print("\n🔚 Hub shutdown complete")
    
    # Run the test
    asyncio.run(test_iraqi_mcp_hub())