"""
Iraqi Government Tool Discovery - Advanced tool discovery with security validation
Part of Gemini CLI extraction with enterprise tool discovery patterns

Implements sophisticated tool discovery mechanisms with Iraqi government service
integration, security clearance validation, and cultural compliance checking.
"""

from typing import Dict, List, Optional, Union, Any, Tuple, Callable, Set
from dataclasses import dataclass, field
from enum import Enum
from abc import ABC, abstractmethod
import asyncio
import json
import time
from datetime import datetime, timedelta
import os
import hashlib
import logging
import yaml
import aiohttp
from urllib.parse import urljoin, urlparse
import subprocess
import tempfile


class ToolCategory(Enum):
    """Categories for government tools"""

    CITIZEN_SERVICES = "citizen_services"
    ADMINISTRATIVE = "administrative"
    LEGAL_SERVICES = "legal_services"
    FINANCIAL = "financial"
    HEALTH_SERVICES = "health_services"
    EDUCATION = "education"
    INFRASTRUCTURE = "infrastructure"
    SECURITY = "security"
    CULTURAL = "cultural"
    INTER_MINISTRY = "inter_ministry"


class SecurityClassification(Enum):
    """Security classifications for tools"""

    PUBLIC = "public"
    INTERNAL_USE = "internal_use"
    RESTRICTED = "restricted"
    CONFIDENTIAL = "confidential"
    SECRET = "secret"
    TOP_SECRET = "top_secret"


class CulturalSensitivity(Enum):
    """Cultural sensitivity levels for tools"""

    NEUTRAL = "neutral"
    CULTURALLY_AWARE = "culturally_aware"
    CULTURALLY_SENSITIVE = "culturally_sensitive"
    RELIGIOUSLY_COMPLIANT = "religiously_compliant"
    CULTURALLY_CRITICAL = "culturally_critical"


@dataclass
class ToolMetadata:
    """Comprehensive metadata for government tools"""

    # Basic tool information
    name: str
    display_name: str
    description: str
    category: ToolCategory
    version: str = "1.0.0"

    # Security information
    security_classification: SecurityClassification = SecurityClassification.PUBLIC
    required_clearance: Optional[str] = None
    encryption_required: bool = False
    audit_required: bool = True

    # Cultural information
    cultural_sensitivity: CulturalSensitivity = CulturalSensitivity.NEUTRAL
    islamic_compliance_required: bool = False
    arabic_language_support: bool = False
    rtl_interface_support: bool = False

    # Government integration
    ministry_owner: Optional[str] = None
    inter_ministry_approval: bool = False
    citizen_facing: bool = False
    government_approved: bool = False

    # Technical information
    endpoint_url: Optional[str] = None
    api_version: str = "v1"
    timeout_seconds: int = 30
    max_concurrent_calls: int = 5

    # Usage information
    usage_statistics: Dict[str, Any] = field(default_factory=dict)
    last_validated: Optional[datetime] = None
    validation_status: str = "pending"

    # Cultural validation scores
    cultural_compliance_score: float = 0.0
    islamic_compliance_score: float = 0.0
    arabic_readiness_score: float = 0.0


@dataclass
class ToolDiscoveryConfig:
    """Configuration for tool discovery system"""

    # Discovery sources
    government_api_endpoints: List[str] = field(default_factory=list)
    ministry_registries: Dict[str, str] = field(default_factory=dict)
    local_tool_directories: List[str] = field(default_factory=list)

    # Security settings
    security_clearance_level: SecurityClassification = SecurityClassification.PUBLIC
    require_government_approval: bool = True
    validate_certificates: bool = True

    # Cultural settings
    require_cultural_validation: bool = True
    require_islamic_compliance: bool = True
    require_arabic_support: bool = False

    # Performance settings
    discovery_timeout: int = 300  # 5 minutes
    cache_duration: int = 3600  # 1 hour
    max_concurrent_discoveries: int = 10

    # Filtering
    excluded_categories: Set[ToolCategory] = field(default_factory=set)
    included_ministries: Set[str] = field(default_factory=set)
    minimum_compliance_score: float = 0.7


class IraqiToolDiscoverySource(ABC):
    """Abstract base class for tool discovery sources"""

    @abstractmethod
    async def discover_tools(self, config: ToolDiscoveryConfig) -> List[ToolMetadata]:
        """Discover tools from this source"""
        pass

    @abstractmethod
    def get_source_name(self) -> str:
        """Get human-readable source name"""
        pass

    @abstractmethod
    async def validate_source(self) -> Tuple[bool, str]:
        """Validate that source is accessible and authorized"""
        pass


class GovernmentAPISource(IraqiToolDiscoverySource):
    """Discover tools from government API endpoints"""

    def __init__(self, api_endpoint: str, api_key: Optional[str] = None):
        self.api_endpoint = api_endpoint
        self.api_key = api_key
        self.logger = logging.getLogger(__name__)

    async def discover_tools(self, config: ToolDiscoveryConfig) -> List[ToolMetadata]:
        """Discover tools from government API"""
        tools = []

        try:
            headers = {"Accept": "application/json"}
            if self.api_key:
                headers["Authorization"] = f"Bearer {self.api_key}"

            async with aiohttp.ClientSession(
                timeout=aiohttp.ClientTimeout(total=config.discovery_timeout)
            ) as session:
                # Discover tool registry endpoint
                registry_url = urljoin(self.api_endpoint, "/tools/registry")

                async with session.get(registry_url, headers=headers) as response:
                    if response.status == 200:
                        data = await response.json()
                        tools.extend(await self._parse_api_tools(data, config))
                    else:
                        self.logger.warning(f"API discovery failed: {response.status}")

        except Exception as e:
            self.logger.error(f"Government API discovery error: {str(e)}")

        return tools

    async def _parse_api_tools(
        self, data: Dict[str, Any], config: ToolDiscoveryConfig
    ) -> List[ToolMetadata]:
        """Parse tools from API response"""
        tools = []

        for tool_data in data.get("tools", []):
            try:
                tool = ToolMetadata(
                    name=tool_data["name"],
                    display_name=tool_data.get("display_name", tool_data["name"]),
                    description=tool_data.get("description", ""),
                    category=ToolCategory(
                        tool_data.get("category", "citizen_services")
                    ),
                    version=tool_data.get("version", "1.0.0"),
                    security_classification=SecurityClassification(
                        tool_data.get("security_classification", "public")
                    ),
                    required_clearance=tool_data.get("required_clearance"),
                    encryption_required=tool_data.get("encryption_required", False),
                    audit_required=tool_data.get("audit_required", True),
                    cultural_sensitivity=CulturalSensitivity(
                        tool_data.get("cultural_sensitivity", "neutral")
                    ),
                    islamic_compliance_required=tool_data.get(
                        "islamic_compliance_required", False
                    ),
                    arabic_language_support=tool_data.get(
                        "arabic_language_support", False
                    ),
                    rtl_interface_support=tool_data.get("rtl_interface_support", False),
                    ministry_owner=tool_data.get("ministry_owner"),
                    inter_ministry_approval=tool_data.get(
                        "inter_ministry_approval", False
                    ),
                    citizen_facing=tool_data.get("citizen_facing", False),
                    government_approved=tool_data.get("government_approved", False),
                    endpoint_url=tool_data.get("endpoint_url"),
                    api_version=tool_data.get("api_version", "v1"),
                    timeout_seconds=tool_data.get("timeout_seconds", 30),
                    last_validated=datetime.now(),
                    validation_status="discovered",
                )

                tools.append(tool)

            except Exception as e:
                self.logger.warning(f"Failed to parse tool: {str(e)}")
                continue

        return tools

    async def validate_source(self) -> Tuple[bool, str]:
        """Validate government API source"""
        try:
            headers = {"Accept": "application/json"}
            if self.api_key:
                headers["Authorization"] = f"Bearer {self.api_key}"

            async with aiohttp.ClientSession(
                timeout=aiohttp.ClientTimeout(total=30)
            ) as session:
                health_url = urljoin(self.api_endpoint, "/health")

                async with session.get(health_url, headers=headers) as response:
                    if response.status == 200:
                        return True, "Government API source validated"
                    else:
                        return False, f"API returned status {response.status}"

        except Exception as e:
            return False, f"API validation failed: {str(e)}"

    def get_source_name(self) -> str:
        return f"Government API: {self.api_endpoint}"


class MinistryRegistrySource(IraqiToolDiscoverySource):
    """Discover tools from ministry-specific registries"""

    def __init__(
        self,
        ministry_name: str,
        registry_url: str,
        credentials: Optional[Dict[str, str]] = None,
    ):
        self.ministry_name = ministry_name
        self.registry_url = registry_url
        self.credentials = credentials or {}
        self.logger = logging.getLogger(__name__)

    async def discover_tools(self, config: ToolDiscoveryConfig) -> List[ToolMetadata]:
        """Discover tools from ministry registry"""
        tools = []

        try:
            headers = {"Accept": "application/json"}
            if "api_key" in self.credentials:
                headers["X-Ministry-API-Key"] = self.credentials["api_key"]

            async with aiohttp.ClientSession(
                timeout=aiohttp.ClientTimeout(total=config.discovery_timeout)
            ) as session:
                async with session.get(self.registry_url, headers=headers) as response:
                    if response.status == 200:
                        data = await response.json()
                        tools.extend(await self._parse_ministry_tools(data, config))
                    else:
                        self.logger.warning(
                            f"Ministry registry discovery failed: {response.status}"
                        )

        except Exception as e:
            self.logger.error(f"Ministry registry discovery error: {str(e)}")

        return tools

    async def _parse_ministry_tools(
        self, data: Dict[str, Any], config: ToolDiscoveryConfig
    ) -> List[ToolMetadata]:
        """Parse tools from ministry registry"""
        tools = []

        for service_data in data.get("services", []):
            try:
                tool = ToolMetadata(
                    name=f"{self.ministry_name}_{service_data['name']}",
                    display_name=service_data.get("display_name", service_data["name"]),
                    description=service_data.get("description", ""),
                    category=ToolCategory(
                        service_data.get("category", "administrative")
                    ),
                    ministry_owner=self.ministry_name,
                    government_approved=True,
                    citizen_facing=service_data.get("public_access", False),
                    security_classification=SecurityClassification(
                        service_data.get("classification", "internal_use")
                    ),
                    endpoint_url=service_data.get("endpoint"),
                    last_validated=datetime.now(),
                    validation_status="ministry_verified",
                )

                tools.append(tool)

            except Exception as e:
                self.logger.warning(f"Failed to parse ministry tool: {str(e)}")
                continue

        return tools

    async def validate_source(self) -> Tuple[bool, str]:
        """Validate ministry registry source"""
        try:
            headers = {"Accept": "application/json"}
            if "api_key" in self.credentials:
                headers["X-Ministry-API-Key"] = self.credentials["api_key"]

            async with aiohttp.ClientSession(
                timeout=aiohttp.ClientTimeout(total=30)
            ) as session:
                async with session.head(self.registry_url, headers=headers) as response:
                    if response.status in [200, 204]:
                        return True, f"Ministry registry {self.ministry_name} validated"
                    else:
                        return False, f"Registry returned status {response.status}"

        except Exception as e:
            return False, f"Registry validation failed: {str(e)}"

    def get_source_name(self) -> str:
        return f"Ministry Registry: {self.ministry_name}"


class LocalToolSource(IraqiToolDiscoverySource):
    """Discover tools from local directories and scripts"""

    def __init__(self, tool_directory: str):
        self.tool_directory = tool_directory
        self.logger = logging.getLogger(__name__)

    async def discover_tools(self, config: ToolDiscoveryConfig) -> List[ToolMetadata]:
        """Discover tools from local directory"""
        tools = []

        try:
            if not os.path.exists(self.tool_directory):
                return tools

            # Look for tool definition files
            for root, dirs, files in os.walk(self.tool_directory):
                for file in files:
                    if file.endswith((".yaml", ".yml", ".json")):
                        file_path = os.path.join(root, file)
                        tool = await self._parse_tool_file(file_path)
                        if tool:
                            tools.append(tool)

        except Exception as e:
            self.logger.error(f"Local tool discovery error: {str(e)}")

        return tools

    async def _parse_tool_file(self, file_path: str) -> Optional[ToolMetadata]:
        """Parse tool definition file"""
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                if file_path.endswith(".json"):
                    data = json.load(f)
                else:
                    data = yaml.safe_load(f)

            # Validate required fields
            if not all(key in data for key in ["name", "description"]):
                return None

            tool = ToolMetadata(
                name=data["name"],
                display_name=data.get("display_name", data["name"]),
                description=data["description"],
                category=ToolCategory(data.get("category", "citizen_services")),
                security_classification=SecurityClassification(
                    data.get("security_classification", "public")
                ),
                cultural_sensitivity=CulturalSensitivity(
                    data.get("cultural_sensitivity", "neutral")
                ),
                endpoint_url=data.get("endpoint_url"),
                last_validated=datetime.now(),
                validation_status="local_file",
            )

            return tool

        except Exception as e:
            self.logger.warning(f"Failed to parse tool file {file_path}: {str(e)}")
            return None

    async def validate_source(self) -> Tuple[bool, str]:
        """Validate local tool source"""
        if os.path.exists(self.tool_directory) and os.path.isdir(self.tool_directory):
            return True, f"Local directory {self.tool_directory} accessible"
        else:
            return False, f"Directory {self.tool_directory} not accessible"

    def get_source_name(self) -> str:
        return f"Local Tools: {self.tool_directory}"


class IraqiGovernmentToolDiscovery:
    """
    Advanced Tool Discovery System for Iraqi Government Services

    Discovers, validates, and categorizes government tools with comprehensive
    security, cultural, and compliance checking.
    """

    def __init__(self, config: ToolDiscoveryConfig):
        self.config = config
        self.logger = logging.getLogger(__name__)
        self.sources: List[IraqiToolDiscoverySource] = []
        self.discovered_tools: Dict[str, ToolMetadata] = {}
        self.tool_cache: Dict[str, Tuple[List[ToolMetadata], datetime]] = {}

        # Cultural and security validators
        self.cultural_validator = IraqiCulturalValidator()
        self.security_validator = IraqiSecurityValidator()
        self.compliance_checker = IraqiComplianceChecker()

        # Initialize discovery sources
        self._initialize_sources()

    def _initialize_sources(self):
        """Initialize discovery sources from configuration"""
        # Government API sources
        for endpoint in self.config.government_api_endpoints:
            self.sources.append(GovernmentAPISource(endpoint))

        # Ministry registry sources
        for ministry, registry_url in self.config.ministry_registries.items():
            self.sources.append(MinistryRegistrySource(ministry, registry_url))

        # Local tool sources
        for directory in self.config.local_tool_directories:
            self.sources.append(LocalToolSource(directory))

    async def discover_all_tools(
        self, force_refresh: bool = False
    ) -> List[ToolMetadata]:
        """
        Discover tools from all configured sources

        Args:
            force_refresh: Skip cache and force fresh discovery

        Returns:
            List of discovered and validated tools
        """
        cache_key = "all_tools"

        # Check cache unless forced refresh
        if not force_refresh and cache_key in self.tool_cache:
            cached_tools, cached_time = self.tool_cache[cache_key]
            if datetime.now() - cached_time < timedelta(
                seconds=self.config.cache_duration
            ):
                self.logger.info(f"Returning {len(cached_tools)} cached tools")
                return cached_tools

        self.logger.info("Starting comprehensive tool discovery")
        start_time = time.time()

        # Validate all sources first
        valid_sources = await self._validate_sources()

        # Discover tools from all valid sources concurrently
        discovery_tasks = []
        for source in valid_sources:
            task = asyncio.create_task(
                self._discover_from_source(source),
                name=f"discover_{source.get_source_name()}",
            )
            discovery_tasks.append(task)

        # Limit concurrent discoveries
        semaphore = asyncio.Semaphore(self.config.max_concurrent_discoveries)

        async def limited_discovery(task):
            async with semaphore:
                return await task

        limited_tasks = [limited_discovery(task) for task in discovery_tasks]
        discovery_results = await asyncio.gather(*limited_tasks, return_exceptions=True)

        # Collect all discovered tools
        all_tools = []
        for i, result in enumerate(discovery_results):
            if isinstance(result, Exception):
                self.logger.error(
                    f"Discovery failed for source {valid_sources[i].get_source_name()}: {result}"
                )
                continue

            all_tools.extend(result)

        self.logger.info(
            f"Discovered {len(all_tools)} tools from {len(valid_sources)} sources"
        )

        # Remove duplicates and apply filters
        unique_tools = await self._deduplicate_tools(all_tools)
        filtered_tools = await self._apply_filters(unique_tools)

        # Validate discovered tools
        validated_tools = await self._validate_tools(filtered_tools)

        # Cache results
        self.tool_cache[cache_key] = (validated_tools, datetime.now())

        discovery_time = time.time() - start_time
        self.logger.info(
            f"Tool discovery completed in {discovery_time:.2f}s - {len(validated_tools)} validated tools"
        )

        return validated_tools

    async def discover_tools_by_category(
        self, category: ToolCategory
    ) -> List[ToolMetadata]:
        """Discover tools for specific category"""
        all_tools = await self.discover_all_tools()
        return [tool for tool in all_tools if tool.category == category]

    async def discover_tools_by_ministry(self, ministry: str) -> List[ToolMetadata]:
        """Discover tools for specific ministry"""
        all_tools = await self.discover_all_tools()
        return [tool for tool in all_tools if tool.ministry_owner == ministry]

    async def _validate_sources(self) -> List[IraqiToolDiscoverySource]:
        """Validate all discovery sources"""
        valid_sources = []

        validation_tasks = [source.validate_source() for source in self.sources]
        validation_results = await asyncio.gather(
            *validation_tasks, return_exceptions=True
        )

        for i, result in enumerate(validation_results):
            source = self.sources[i]

            if isinstance(result, Exception):
                self.logger.error(
                    f"Source validation failed for {source.get_source_name()}: {result}"
                )
                continue

            is_valid, message = result
            if is_valid:
                valid_sources.append(source)
                self.logger.debug(f"Source validated: {source.get_source_name()}")
            else:
                self.logger.warning(
                    f"Source invalid: {source.get_source_name()} - {message}"
                )

        return valid_sources

    async def _discover_from_source(
        self, source: IraqiToolDiscoverySource
    ) -> List[ToolMetadata]:
        """Discover tools from single source"""
        try:
            tools = await source.discover_tools(self.config)
            self.logger.info(
                f"Discovered {len(tools)} tools from {source.get_source_name()}"
            )
            return tools
        except Exception as e:
            self.logger.error(
                f"Discovery failed for {source.get_source_name()}: {str(e)}"
            )
            return []

    async def _deduplicate_tools(self, tools: List[ToolMetadata]) -> List[ToolMetadata]:
        """Remove duplicate tools based on name and endpoint"""
        seen = set()
        unique_tools = []

        for tool in tools:
            # Create unique identifier
            identifier = f"{tool.name}:{tool.endpoint_url or 'local'}"

            if identifier not in seen:
                seen.add(identifier)
                unique_tools.append(tool)
            else:
                self.logger.debug(f"Skipping duplicate tool: {tool.name}")

        return unique_tools

    async def _apply_filters(self, tools: List[ToolMetadata]) -> List[ToolMetadata]:
        """Apply configuration filters to tools"""
        filtered_tools = []

        for tool in tools:
            # Check category exclusions
            if tool.category in self.config.excluded_categories:
                continue

            # Check ministry inclusions
            if (
                self.config.included_ministries
                and tool.ministry_owner not in self.config.included_ministries
            ):
                continue

            # Check security clearance
            if not self._check_security_clearance(tool):
                continue

            # Check government approval requirement
            if self.config.require_government_approval and not tool.government_approved:
                continue

            filtered_tools.append(tool)

        self.logger.info(
            f"Filtered to {len(filtered_tools)} tools after applying filters"
        )
        return filtered_tools

    def _check_security_clearance(self, tool: ToolMetadata) -> bool:
        """Check if user has required security clearance for tool"""
        clearance_hierarchy = {
            SecurityClassification.PUBLIC: 0,
            SecurityClassification.INTERNAL_USE: 1,
            SecurityClassification.RESTRICTED: 2,
            SecurityClassification.CONFIDENTIAL: 3,
            SecurityClassification.SECRET: 4,
            SecurityClassification.TOP_SECRET: 5,
        }

        user_level = clearance_hierarchy.get(self.config.security_clearance_level, 0)
        tool_level = clearance_hierarchy.get(tool.security_classification, 0)

        return user_level >= tool_level

    async def _validate_tools(self, tools: List[ToolMetadata]) -> List[ToolMetadata]:
        """Validate tools for cultural, security, and compliance requirements"""
        validated_tools = []

        validation_tasks = []
        for tool in tools:
            task = asyncio.create_task(self._validate_single_tool(tool))
            validation_tasks.append(task)

        # Limit concurrent validations
        semaphore = asyncio.Semaphore(self.config.max_concurrent_discoveries)

        async def limited_validation(task):
            async with semaphore:
                return await task

        limited_tasks = [limited_validation(task) for task in validation_tasks]
        validation_results = await asyncio.gather(
            *limited_tasks, return_exceptions=True
        )

        for i, result in enumerate(validation_results):
            if isinstance(result, Exception):
                self.logger.error(f"Tool validation failed: {result}")
                continue

            if result:  # Tool passed validation
                validated_tools.append(tools[i])

        return validated_tools

    async def _validate_single_tool(self, tool: ToolMetadata) -> bool:
        """Validate single tool against all requirements"""
        try:
            # Cultural validation
            if self.config.require_cultural_validation:
                cultural_score = await self.cultural_validator.validate_tool(tool)
                tool.cultural_compliance_score = cultural_score

                if cultural_score < self.config.minimum_compliance_score:
                    self.logger.debug(
                        f"Tool {tool.name} failed cultural validation: {cultural_score}"
                    )
                    return False

            # Islamic compliance validation
            if self.config.require_islamic_compliance:
                islamic_score = await self.compliance_checker.check_islamic_compliance(
                    tool
                )
                tool.islamic_compliance_score = islamic_score

                if islamic_score < self.config.minimum_compliance_score:
                    self.logger.debug(
                        f"Tool {tool.name} failed Islamic compliance: {islamic_score}"
                    )
                    return False

            # Arabic support validation
            if self.config.require_arabic_support and not tool.arabic_language_support:
                self.logger.debug(f"Tool {tool.name} lacks required Arabic support")
                return False

            # Security validation
            security_valid = await self.security_validator.validate_tool_security(tool)
            if not security_valid:
                self.logger.debug(f"Tool {tool.name} failed security validation")
                return False

            # Update validation status
            tool.validation_status = "validated"
            tool.last_validated = datetime.now()

            return True

        except Exception as e:
            self.logger.error(f"Tool validation error for {tool.name}: {str(e)}")
            return False


class IraqiCulturalValidator:
    """Cultural validation for government tools"""

    async def validate_tool(self, tool: ToolMetadata) -> float:
        """Validate tool for cultural appropriateness"""
        score = 0.5  # Base score

        # Check cultural sensitivity level
        sensitivity_scores = {
            CulturalSensitivity.NEUTRAL: 0.1,
            CulturalSensitivity.CULTURALLY_AWARE: 0.2,
            CulturalSensitivity.CULTURALLY_SENSITIVE: 0.3,
            CulturalSensitivity.RELIGIOUSLY_COMPLIANT: 0.4,
            CulturalSensitivity.CULTURALLY_CRITICAL: 0.5,
        }

        score += sensitivity_scores.get(tool.cultural_sensitivity, 0.0)

        # Boost for Arabic support
        if tool.arabic_language_support:
            score += 0.2

        # Boost for RTL support
        if tool.rtl_interface_support:
            score += 0.1

        # Boost for government approval
        if tool.government_approved:
            score += 0.2

        return min(1.0, score)


class IraqiSecurityValidator:
    """Security validation for government tools"""

    async def validate_tool_security(self, tool: ToolMetadata) -> bool:
        """Validate tool security requirements"""
        # Check if endpoint is secure
        if tool.endpoint_url:
            parsed_url = urlparse(tool.endpoint_url)
            if parsed_url.scheme != "https":
                return False

        # Check encryption requirements
        if (
            tool.security_classification != SecurityClassification.PUBLIC
            and not tool.encryption_required
        ):
            return False

        return True


class IraqiComplianceChecker:
    """Islamic and cultural compliance checker"""

    async def check_islamic_compliance(self, tool: ToolMetadata) -> float:
        """Check Islamic compliance for tool"""
        score = 0.7  # Base compliance score

        # Check for prohibited categories
        prohibited_keywords = [
            "gambling",
            "lottery",
            "alcohol",
            "interest",
            "usury",
            "riba",
        ]

        tool_text = f"{tool.name} {tool.description}".lower()
        for keyword in prohibited_keywords:
            if keyword in tool_text:
                return 0.0  # Complete non-compliance

        # Boost for Islamic compliance flag
        if tool.islamic_compliance_required:
            score += 0.2

        # Boost for cultural sensitivity
        if tool.cultural_sensitivity in [
            CulturalSensitivity.RELIGIOUSLY_COMPLIANT,
            CulturalSensitivity.CULTURALLY_CRITICAL,
        ]:
            score += 0.1

        return min(1.0, score)
