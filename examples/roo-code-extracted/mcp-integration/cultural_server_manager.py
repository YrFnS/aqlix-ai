"""
Cultural Server Manager - MCP Server Configuration and Management

Enhanced server management with Iraqi cultural intelligence and Arabic support.
Extracted from Roo-Code MCP server management patterns.

Key features:
- Cultural compliance validation for MCP servers
- Arabic language capability detection and configuration
- Professional domain-specific server routing
- Islamic compliance enforcement for server operations
"""

from typing import Dict, List, Any, Optional, Set
from enum import Enum
from dataclasses import dataclass
import asyncio
import json
import logging
from pathlib import Path

from iraqi_mcp_hub import IraqiProfessionalDomain, CulturalValidationLevel


class ServerType(Enum):
    CULTURAL_VALIDATOR = "cultural_validator"
    ARABIC_PROCESSOR = "arabic_processor"
    PROFESSIONAL_DOMAIN = "professional_domain"
    GENERAL_PURPOSE = "general_purpose"
    SECURITY_VALIDATOR = "security_validator"


class ServerStatus(Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    VALIDATING = "validating"
    ERROR = "error"
    CULTURALLY_NON_COMPLIANT = "culturally_non_compliant"


@dataclass
class ServerCapability:
    name: str
    description: str
    arabic_support: bool
    rtl_support: bool
    professional_domains: List[IraqiProfessionalDomain]
    cultural_validation_level: CulturalValidationLevel


@dataclass
class ServerConfiguration:
    name: str
    server_type: ServerType
    endpoint: str
    capabilities: List[ServerCapability]
    status: ServerStatus
    cultural_compliance_score: float
    arabic_language_support: bool
    supported_domains: List[IraqiProfessionalDomain]
    validation_errors: List[str]


class CulturalServerManager:
    """Manages MCP servers with Iraqi cultural intelligence and compliance"""

    def __init__(
        self,
        validation_level: CulturalValidationLevel = CulturalValidationLevel.PROFESSIONAL,
    ):
        self.validation_level = validation_level
        self.servers: Dict[str, ServerConfiguration] = {}
        self.cultural_validators: Set[str] = set()
        self.arabic_processors: Set[str] = set()
        self.domain_specialists: Dict[IraqiProfessionalDomain, Set[str]] = {}
        self.server_priority_matrix: Dict[str, int] = {}
        self._setup_logging()

    def _setup_logging(self):
        """Setup culturally appropriate logging system"""
        self.logger = logging.getLogger("cultural_server_manager")
        self.logger.setLevel(logging.INFO)

        # Add Arabic RTL formatting support for logs
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )

        handler = logging.StreamHandler()
        handler.setFormatter(formatter)
        self.logger.addHandler(handler)

    async def register_server(self, server_config: Dict[str, Any]) -> bool:
        """Register an MCP server with cultural validation"""
        try:
            server_name = server_config.get("name", "unknown_server")

            # Validate server configuration structure
            validation_result = await self._validate_server_structure(server_config)
            if not validation_result["is_valid"]:
                self.logger.error(
                    f"Server {server_name} failed structure validation: {validation_result['errors']}"
                )
                return False

            # Perform cultural compliance assessment
            compliance_result = await self._assess_cultural_compliance(server_config)

            # Create server capabilities
            capabilities = await self._extract_server_capabilities(server_config)

            # Determine server type based on capabilities
            server_type = self._determine_server_type(capabilities)

            # Create server configuration
            configuration = ServerConfiguration(
                name=server_name,
                server_type=server_type,
                endpoint=server_config.get("endpoint", ""),
                capabilities=capabilities,
                status=ServerStatus.VALIDATING,
                cultural_compliance_score=compliance_result["score"],
                arabic_language_support=compliance_result["arabic_support"],
                supported_domains=compliance_result["domains"],
                validation_errors=compliance_result.get("errors", []),
            )

            # Final validation check
            if (
                compliance_result["score"] < 0.7
                and self.validation_level == CulturalValidationLevel.STRICT
            ):
                configuration.status = ServerStatus.CULTURALLY_NON_COMPLIANT
                self.logger.warning(
                    f"Server {server_name} marked as culturally non-compliant"
                )
                return False

            # Register server
            self.servers[server_name] = configuration
            await self._update_server_classifications(server_name, configuration)

            # Set server status based on validation
            configuration.status = (
                ServerStatus.ACTIVE
                if compliance_result["score"] >= 0.6
                else ServerStatus.ERROR
            )

            self.logger.info(
                f"Successfully registered server {server_name} with compliance score: {compliance_result['score']:.2f}"
            )
            return True

        except Exception as e:
            self.logger.error(f"Failed to register server: {str(e)}")
            return False

    async def get_servers_by_domain(
        self, domain: IraqiProfessionalDomain
    ) -> List[ServerConfiguration]:
        """Get servers specialized for a specific professional domain"""
        domain_servers = []

        for server_name, config in self.servers.items():
            if (
                config.status == ServerStatus.ACTIVE
                and domain in config.supported_domains
            ):
                domain_servers.append(config)

        # Sort by cultural compliance score (highest first)
        domain_servers.sort(key=lambda x: x.cultural_compliance_score, reverse=True)

        return domain_servers

    async def get_arabic_capable_servers(self) -> List[ServerConfiguration]:
        """Get servers with Arabic language processing capabilities"""
        arabic_servers = []

        for server_name in self.arabic_processors:
            if (
                server_name in self.servers
                and self.servers[server_name].status == ServerStatus.ACTIVE
            ):
                arabic_servers.append(self.servers[server_name])

        # Sort by Arabic support quality
        arabic_servers.sort(
            key=lambda x: sum(
                1 for cap in x.capabilities if cap.arabic_support and cap.rtl_support
            ),
            reverse=True,
        )

        return arabic_servers

    async def get_cultural_validators(self) -> List[ServerConfiguration]:
        """Get servers specialized in cultural validation"""
        validator_servers = []

        for server_name in self.cultural_validators:
            if (
                server_name in self.servers
                and self.servers[server_name].status == ServerStatus.ACTIVE
            ):
                validator_servers.append(self.servers[server_name])

        return validator_servers

    async def select_optimal_server(
        self, requirements: Dict[str, Any]
    ) -> Optional[ServerConfiguration]:
        """Select optimal server based on requirements and cultural preferences"""

        required_domain = requirements.get("domain")
        needs_arabic = requirements.get("arabic_support", False)
        needs_cultural_validation = requirements.get("cultural_validation", False)
        content_sensitivity = requirements.get("sensitivity_level", "standard")

        candidates = []

        # Get servers that meet basic requirements
        for server_name, config in self.servers.items():
            if config.status != ServerStatus.ACTIVE:
                continue

            # Check domain compatibility
            if required_domain and required_domain not in config.supported_domains:
                continue

            # Check Arabic support if needed
            if needs_arabic and not config.arabic_language_support:
                continue

            # Check cultural validation capability if needed
            if (
                needs_cultural_validation
                and server_name not in self.cultural_validators
            ):
                continue

            candidates.append(config)

        if not candidates:
            self.logger.warning("No suitable servers found for requirements")
            return None

        # Score candidates based on cultural and functional criteria
        scored_candidates = []
        for candidate in candidates:
            score = await self._score_server_suitability(candidate, requirements)
            scored_candidates.append((candidate, score))

        # Sort by score (highest first)
        scored_candidates.sort(key=lambda x: x[1], reverse=True)

        selected_server = scored_candidates[0][0]
        self.logger.info(
            f"Selected server {selected_server.name} with score {scored_candidates[0][1]:.2f}"
        )

        return selected_server

    async def _validate_server_structure(
        self, server_config: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Validate server configuration structure"""
        errors = []
        required_fields = ["name", "capabilities"]

        for field in required_fields:
            if field not in server_config:
                errors.append(f"Missing required field: {field}")

        # Validate capabilities structure
        capabilities = server_config.get("capabilities", {})
        if not isinstance(capabilities, dict):
            errors.append("Capabilities must be a dictionary")

        return {"is_valid": len(errors) == 0, "errors": errors}

    async def _assess_cultural_compliance(
        self, server_config: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Assess server's cultural compliance and appropriateness"""
        score = 1.0
        errors = []
        capabilities = server_config.get("capabilities", {})

        # Check for inappropriate content indicators
        inappropriate_patterns = [
            "adult",
            "gambling",
            "alcohol",
            "dating",
            "inappropriate",
            "explicit",
            "mature",
            "nsfw",
        ]

        config_text = json.dumps(server_config, default=str).lower()

        for pattern in inappropriate_patterns:
            if pattern in config_text:
                score -= 0.2
                errors.append(f"Inappropriate content pattern detected: {pattern}")

        # Check for Arabic language support indicators
        arabic_indicators = [
            "arabic",
            "عربي",
            "rtl",
            "right-to-left",
            "بالعربية",
            "i18n",
            "internationalization",
            "multilingual",
        ]

        arabic_support = any(
            indicator in config_text for indicator in arabic_indicators
        )

        # Bonus for Arabic support
        if arabic_support:
            score += 0.1

        # Detect supported professional domains
        domains = []
        domain_indicators = {
            IraqiProfessionalDomain.LEGAL: ["legal", "law", "court", "قانون", "محكمة"],
            IraqiProfessionalDomain.MEDICAL: ["medical", "health", "طبي", "صحة"],
            IraqiProfessionalDomain.EDUCATIONAL: [
                "education",
                "school",
                "تعليم",
                "مدرسة",
            ],
            IraqiProfessionalDomain.GOVERNMENT: ["government", "حكومة", "وزارة"],
            IraqiProfessionalDomain.BUSINESS: ["business", "تجارة", "شركة"],
            IraqiProfessionalDomain.TECHNICAL: ["technical", "تقني", "برمجة"],
        }

        for domain, indicators in domain_indicators.items():
            if any(indicator in config_text for indicator in indicators):
                domains.append(domain)

        # Always include general domain
        if IraqiProfessionalDomain.GENERAL not in domains:
            domains.append(IraqiProfessionalDomain.GENERAL)

        return {
            "score": max(0.0, min(1.0, score)),
            "arabic_support": arabic_support,
            "domains": domains,
            "errors": errors,
            "assessment_details": {
                "inappropriate_content_detected": len(errors) > 0,
                "arabic_language_capabilities": arabic_support,
                "professional_domain_coverage": len(domains),
            },
        }

    async def _extract_server_capabilities(
        self, server_config: Dict[str, Any]
    ) -> List[ServerCapability]:
        """Extract and structure server capabilities"""
        capabilities = []
        raw_capabilities = server_config.get("capabilities", {})

        for cap_name, cap_details in raw_capabilities.items():
            if isinstance(cap_details, dict):
                # Extract capability information
                description = cap_details.get("description", "")

                # Detect Arabic and RTL support
                cap_text = json.dumps(cap_details, default=str).lower()
                arabic_support = any(
                    indicator in cap_text for indicator in ["arabic", "عربي", "rtl"]
                )
                rtl_support = any(
                    indicator in cap_text for indicator in ["rtl", "right-to-left"]
                )

                # Determine professional domains for this capability
                domains = self._detect_capability_domains(cap_text)

                # Determine validation level
                validation_level = CulturalValidationLevel.STANDARD
                if "strict" in cap_text or "professional" in cap_text:
                    validation_level = CulturalValidationLevel.STRICT
                elif "basic" in cap_text:
                    validation_level = CulturalValidationLevel.BASIC

                capability = ServerCapability(
                    name=cap_name,
                    description=description,
                    arabic_support=arabic_support,
                    rtl_support=rtl_support,
                    professional_domains=domains,
                    cultural_validation_level=validation_level,
                )

                capabilities.append(capability)

        return capabilities

    def _detect_capability_domains(
        self, capability_text: str
    ) -> List[IraqiProfessionalDomain]:
        """Detect professional domains supported by a capability"""
        domains = [IraqiProfessionalDomain.GENERAL]  # Always include general

        domain_keywords = {
            IraqiProfessionalDomain.LEGAL: ["legal", "law", "court", "lawyer", "قانون"],
            IraqiProfessionalDomain.MEDICAL: ["medical", "health", "doctor", "طبي"],
            IraqiProfessionalDomain.EDUCATIONAL: [
                "education",
                "school",
                "academic",
                "تعليم",
            ],
            IraqiProfessionalDomain.GOVERNMENT: ["government", "official", "حكومة"],
            IraqiProfessionalDomain.BUSINESS: ["business", "commerce", "تجارة"],
            IraqiProfessionalDomain.TECHNICAL: ["technical", "software", "تقني"],
        }

        for domain, keywords in domain_keywords.items():
            if any(keyword in capability_text for keyword in keywords):
                domains.append(domain)

        return domains

    def _determine_server_type(
        self, capabilities: List[ServerCapability]
    ) -> ServerType:
        """Determine server type based on capabilities"""

        # Check for cultural validation capabilities
        cultural_keywords = [
            "cultural",
            "compliance",
            "validation",
            "islamic",
            "appropriate",
        ]
        has_cultural_validation = any(
            any(keyword in cap.description.lower() for keyword in cultural_keywords)
            for cap in capabilities
        )

        if has_cultural_validation:
            return ServerType.CULTURAL_VALIDATOR

        # Check for Arabic processing capabilities
        has_arabic_processing = any(
            cap.arabic_support and cap.rtl_support for cap in capabilities
        )
        if has_arabic_processing:
            return ServerType.ARABIC_PROCESSOR

        # Check for professional domain specialization
        domain_counts = {}
        for cap in capabilities:
            for domain in cap.professional_domains:
                if domain != IraqiProfessionalDomain.GENERAL:
                    domain_counts[domain] = domain_counts.get(domain, 0) + 1

        if domain_counts:
            return ServerType.PROFESSIONAL_DOMAIN

        return ServerType.GENERAL_PURPOSE

    async def _update_server_classifications(
        self, server_name: str, config: ServerConfiguration
    ):
        """Update server classification indexes"""

        # Add to cultural validators if applicable
        if config.server_type == ServerType.CULTURAL_VALIDATOR:
            self.cultural_validators.add(server_name)

        # Add to Arabic processors if applicable
        if config.arabic_language_support:
            self.arabic_processors.add(server_name)

        # Add to domain specialists
        for domain in config.supported_domains:
            if domain not in self.domain_specialists:
                self.domain_specialists[domain] = set()
            self.domain_specialists[domain].add(server_name)

        # Set priority based on compliance score
        self.server_priority_matrix[server_name] = int(
            config.cultural_compliance_score * 100
        )

    async def _score_server_suitability(
        self, server: ServerConfiguration, requirements: Dict[str, Any]
    ) -> float:
        """Score server suitability for given requirements"""
        base_score = server.cultural_compliance_score

        # Bonus for Arabic support if needed
        if requirements.get("arabic_support") and server.arabic_language_support:
            base_score += 0.1

        # Bonus for domain specialization
        required_domain = requirements.get("domain")
        if required_domain in server.supported_domains:
            base_score += 0.05

        # Bonus for cultural validation capability
        if (
            requirements.get("cultural_validation")
            and server.name in self.cultural_validators
        ):
            base_score += 0.15

        # Penalty for validation errors
        base_score -= len(server.validation_errors) * 0.02

        return min(1.0, base_score)

    def get_server_statistics(self) -> Dict[str, Any]:
        """Get comprehensive server management statistics"""
        total_servers = len(self.servers)
        active_servers = sum(
            1 for s in self.servers.values() if s.status == ServerStatus.ACTIVE
        )

        return {
            "total_servers": total_servers,
            "active_servers": active_servers,
            "cultural_validators": len(self.cultural_validators),
            "arabic_processors": len(self.arabic_processors),
            "domain_coverage": {
                domain.value: len(servers)
                for domain, servers in self.domain_specialists.items()
            },
            "average_compliance_score": (
                sum(s.cultural_compliance_score for s in self.servers.values())
                / total_servers
                if total_servers > 0
                else 0.0
            ),
            "validation_level": self.validation_level.value,
        }


# Example usage
async def main():
    """Example usage of Cultural Server Manager"""
    manager = CulturalServerManager(
        validation_level=CulturalValidationLevel.PROFESSIONAL
    )

    # Register sample servers
    servers = [
        {
            "name": "iraqi_legal_analyzer",
            "endpoint": "ws://localhost:8001",
            "capabilities": {
                "document_analysis": {
                    "description": "Legal document analysis for Iraqi courts",
                    "domains": ["legal"],
                    "arabic_support": True,
                },
                "compliance_check": {
                    "description": "Islamic law compliance verification",
                    "validation_level": "strict",
                },
            },
        },
        {
            "name": "arabic_nlp_processor",
            "endpoint": "ws://localhost:8002",
            "capabilities": {
                "text_processing": {
                    "description": "Arabic text processing with RTL support",
                    "arabic_support": True,
                    "rtl_support": True,
                },
                "dialect_detection": {
                    "description": "Iraqi dialect recognition and processing"
                },
            },
        },
    ]

    for server_config in servers:
        success = await manager.register_server(server_config)
        print(
            f"Server {server_config['name']} registration: {'Success' if success else 'Failed'}"
        )

    # Get statistics
    stats = manager.get_server_statistics()
    print(f"Server management statistics: {stats}")

    # Find optimal server for legal document processing
    optimal_server = await manager.select_optimal_server(
        {
            "domain": IraqiProfessionalDomain.LEGAL,
            "arabic_support": True,
            "cultural_validation": True,
        }
    )

    if optimal_server:
        print(f"Optimal server for legal processing: {optimal_server.name}")


if __name__ == "__main__":
    asyncio.run(main())
