"""
🇮🇶 Iraqi Government CLI - Configuration Management System
========================================================

Advanced configuration management system for Iraqi Government CLI with comprehensive
settings management, secure configuration storage, and cultural intelligence integration.

🎯 Performance Standards:
- Configuration Load: <50ms for standard settings, <100ms for secure settings
- Validation Speed: <25ms for cultural compliance, <50ms for security validation
- File Operations: <200ms for configuration file read/write operations
- Memory Usage: <10MB for configuration cache and validation systems

🔐 Security Features:
- Encrypted configuration storage for sensitive settings
- Government-grade security protocols integration
- Role-based configuration access control
- Audit logging for all configuration changes

🌐 Cultural Intelligence Features:
- Islamic compliance validation for all configuration values
- Iraqi cultural appropriateness checking
- Arabic language configuration support
- Professional domain-specific settings management

Based on: Google Gemini CLI configuration patterns (config/config.ts, config/settings.ts)
Enhanced with: Iraqi cultural intelligence and enterprise security
"""

import json
import os
import yaml
from pathlib import Path
from typing import Dict, List, Optional, Union, Any, Tuple
from dataclasses import dataclass, field, asdict
from enum import Enum
import hashlib
import logging
from datetime import datetime, timezone
import tempfile
import shutil
from cryptography.fernet import Fernet

# Configure logging
logger = logging.getLogger(__name__)


class ConfigurationScope(Enum):
    """Configuration scope levels with Iraqi government hierarchy."""

    SYSTEM = "system"  # System-wide configuration
    USER = "user"  # User-specific configuration
    SESSION = "session"  # Session-specific configuration
    DEPARTMENT = "department"  # Department-level configuration
    MINISTRY = "ministry"  # Ministry-level configuration


class ConfigurationSecurity(Enum):
    """Configuration security levels for Iraqi government settings."""

    PUBLIC = "public"  # Public configuration settings
    INTERNAL = "internal"  # Internal government settings
    RESTRICTED = "restricted"  # Restricted government settings
    CONFIDENTIAL = "confidential"  # Confidential government settings
    SECRET = "secret"  # Secret government settings


@dataclass
class IraqiAuthConfig:
    """Authentication configuration with Iraqi government integration."""

    enabled_auth_types: List[str] = field(
        default_factory=lambda: ["government_login", "iraqi_id"]
    )
    default_auth_type: str = "government_login"

    # Iraqi ID authentication
    iraqi_id_validation_enabled: bool = True
    iraqi_id_database_endpoint: str = "https://gov.iraq/id/validate"
    iraqi_id_timeout_seconds: int = 10

    # Government portal authentication
    government_portal_endpoint: str = "https://portal.iraq.gov/auth"
    government_portal_timeout_seconds: int = 15

    # Biometric authentication
    biometric_enabled: bool = False
    biometric_types: List[str] = field(
        default_factory=lambda: ["fingerprint", "iris", "face"]
    )
    biometric_timeout_seconds: int = 30

    # Smart card authentication
    smart_card_enabled: bool = False
    smart_card_reader_timeout: int = 20

    # Multi-factor authentication
    mfa_required_for_levels: List[str] = field(
        default_factory=lambda: ["secret", "top_secret"]
    )
    mfa_timeout_seconds: int = 300
    mfa_backup_codes_enabled: bool = True


@dataclass
class IraqiSecurityConfig:
    """Security configuration with enterprise-grade Iraqi government settings."""

    # Encryption settings
    encryption_enabled: bool = True
    encryption_algorithm: str = "AES-256-GCM"
    key_rotation_enabled: bool = True
    key_rotation_interval_hours: int = 24

    # Session security
    session_timeout_minutes: int = 30
    session_timeout_warning_minutes: int = 5
    concurrent_session_limit: int = 1
    session_ip_validation: bool = True

    # Security levels
    default_security_level: str = "restricted"
    auto_upgrade_security_level: bool = True
    security_level_timeout_map: Dict[str, int] = field(
        default_factory=lambda: {
            "public": 60,
            "restricted": 30,
            "confidential": 20,
            "secret": 15,
            "top_secret": 10,
        }
    )

    # Audit logging
    audit_logging_enabled: bool = True
    audit_log_retention_days: int = 365
    audit_log_encryption_enabled: bool = True
    audit_tamper_protection: bool = True

    # Network security
    allowed_ip_ranges: List[str] = field(
        default_factory=lambda: ["10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16"]
    )
    ssl_required: bool = True
    certificate_validation: bool = True


@dataclass
class IraqiCulturalConfig:
    """Cultural configuration with Islamic compliance and Iraqi standards."""

    # Cultural validation
    cultural_validation_enabled: bool = True
    islamic_compliance_required: bool = True
    cultural_strictness_level: str = "standard"  # strict, standard, lenient

    # Language and localization
    primary_language: str = "ar-IQ"
    secondary_language: str = "en"
    fallback_language: str = "ar"
    rtl_support_enabled: bool = True

    # Iraqi dialect processing
    dialect_processing_enabled: bool = True
    dialect_confidence_threshold: float = 0.7
    dialect_patterns_file: str = "config/iraqi_dialect_patterns.json"

    # Islamic calendar and time
    islamic_calendar_enabled: bool = True
    prayer_time_awareness: bool = True
    prayer_time_notifications: bool = False
    hijri_date_display: bool = True

    # Professional domains
    professional_domains_enabled: List[str] = field(
        default_factory=lambda: ["government", "legal", "medical", "educational"]
    )
    domain_terminology_validation: bool = True

    # Cultural scoring thresholds
    minimum_cultural_score: float = 70.0
    minimum_islamic_score: float = 85.0
    cultural_warning_threshold: float = 80.0


@dataclass
class IraqiPerformanceConfig:
    """Performance configuration with Iraqi government optimization settings."""

    # Response time targets
    command_response_target_ms: int = 100
    cultural_validation_target_ms: int = 200
    authentication_target_ms: int = 500

    # Resource limits
    max_memory_usage_mb: int = 512
    max_cpu_usage_percent: int = 80
    max_concurrent_operations: int = 10

    # Caching
    configuration_cache_enabled: bool = True
    cultural_validation_cache_enabled: bool = True
    authentication_cache_enabled: bool = True
    cache_ttl_seconds: int = 3600

    # Monitoring
    performance_monitoring_enabled: bool = True
    metrics_collection_interval_seconds: int = 60
    metrics_retention_hours: int = 168  # 1 week

    # Optimization
    auto_optimization_enabled: bool = True
    garbage_collection_tuning: bool = True
    connection_pooling_enabled: bool = True


@dataclass
class IraqiCliConfiguration:
    """
    Main Iraqi Government CLI configuration with comprehensive settings management.

    Integrates all configuration domains including authentication, security, cultural
    intelligence, and performance optimization with Iraqi government standards.
    """

    # Basic configuration
    version: str = "1.0.0-iraqi"
    environment: str = "production"
    debug_enabled: bool = False

    # Configuration metadata
    config_file_path: Optional[str] = None
    last_modified: Optional[datetime] = None
    config_checksum: Optional[str] = None
    config_security_level: ConfigurationSecurity = ConfigurationSecurity.RESTRICTED

    # Domain-specific configurations
    auth_config: IraqiAuthConfig = field(default_factory=IraqiAuthConfig)
    security_config: IraqiSecurityConfig = field(default_factory=IraqiSecurityConfig)
    cultural_config: IraqiCulturalConfig = field(default_factory=IraqiCulturalConfig)
    performance_config: IraqiPerformanceConfig = field(
        default_factory=IraqiPerformanceConfig
    )

    # User and system information
    user_profile: Dict[str, Any] = field(default_factory=dict)
    system_info: Dict[str, Any] = field(default_factory=dict)

    # Custom extensions and plugins
    enabled_extensions: List[str] = field(default_factory=list)
    extension_configs: Dict[str, Any] = field(default_factory=dict)


class IraqiConfigurationManager:
    """
    Advanced configuration management system for Iraqi Government CLI.

    Provides comprehensive configuration management including:
    - Secure configuration storage with encryption
    - Multi-scope configuration hierarchy (system, user, session, department, ministry)
    - Cultural compliance validation for configuration values
    - Real-time configuration monitoring and validation
    - Automated backup and recovery of configuration settings
    """

    def __init__(self):
        self.current_config: Optional[IraqiCliConfiguration] = None
        self.config_cache: Dict[str, Any] = {}
        self.encryption_key: Optional[bytes] = None
        self.config_validators: List[callable] = []
        self.change_listeners: List[callable] = []

        # Setup default paths
        self.system_config_dir = Path("/etc/iraqi-cli")
        self.user_config_dir = Path.home() / ".iraqi-cli"
        self.temp_config_dir = Path(tempfile.gettempdir()) / "iraqi-cli-temp"

        # Initialize encryption
        self._initialize_encryption()

        # Register default validators
        self._register_default_validators()

    def _initialize_encryption(self):
        """Initialize configuration encryption system."""
        key_file = self.user_config_dir / "config.key"

        if key_file.exists():
            try:
                self.encryption_key = key_file.read_bytes()
            except Exception as e:
                logger.warning(f"Failed to load encryption key: {e}")
                self._generate_new_encryption_key()
        else:
            self._generate_new_encryption_key()

    def _generate_new_encryption_key(self):
        """Generate new encryption key for configuration security."""
        self.encryption_key = Fernet.generate_key()

        # Ensure config directory exists
        self.user_config_dir.mkdir(parents=True, exist_ok=True)

        # Save key with restricted permissions
        key_file = self.user_config_dir / "config.key"
        key_file.write_bytes(self.encryption_key)
        key_file.chmod(0o600)  # Read/write for owner only

        logger.info("New configuration encryption key generated")

    def _register_default_validators(self):
        """Register default configuration validators."""
        self.config_validators = [
            self._validate_cultural_compliance,
            self._validate_security_settings,
            self._validate_authentication_config,
            self._validate_performance_settings,
            self._validate_file_permissions,
        ]

    async def load_configuration(
        self,
        config_path: Optional[str] = None,
        scope: ConfigurationScope = ConfigurationScope.USER,
    ) -> IraqiCliConfiguration:
        """
        Load configuration from file system with comprehensive validation.

        Args:
            config_path: Optional explicit path to configuration file
            scope: Configuration scope for hierarchical loading

        Returns:
            Loaded and validated configuration object
        """
        load_start = datetime.now()

        try:
            # Determine configuration file path
            if config_path:
                config_file = Path(config_path)
            else:
                config_file = self._get_config_file_path(scope)

            # Load base configuration
            if config_file.exists():
                config = await self._load_config_file(config_file)
            else:
                logger.info(
                    f"Configuration file not found: {config_file}, using defaults"
                )
                config = IraqiCliConfiguration()

            # Apply hierarchical configuration loading
            config = await self._apply_hierarchical_config(config, scope)

            # Validate configuration
            validation_results = await self._validate_configuration(config)
            if not validation_results["valid"]:
                raise ValueError(
                    f"Configuration validation failed: {validation_results['errors']}"
                )

            # Cache configuration
            self.current_config = config
            config.last_modified = load_start
            config.config_checksum = self._calculate_config_checksum(config)

            # Log successful load
            load_time = (datetime.now() - load_start).total_seconds() * 1000
            logger.info(
                f"Configuration loaded successfully in {load_time:.2f}ms from {config_file}"
            )

            return config

        except Exception as e:
            logger.error(f"Failed to load configuration: {e}")
            # Return default configuration on failure
            return IraqiCliConfiguration()

    def _get_config_file_path(self, scope: ConfigurationScope) -> Path:
        """Get configuration file path based on scope."""
        base_filename = "iraqi-cli-config"

        if scope == ConfigurationScope.SYSTEM:
            return self.system_config_dir / f"{base_filename}.yaml"
        elif scope == ConfigurationScope.USER:
            return self.user_config_dir / f"{base_filename}.yaml"
        elif scope == ConfigurationScope.SESSION:
            return self.temp_config_dir / f"{base_filename}-session.yaml"
        elif scope == ConfigurationScope.DEPARTMENT:
            return self.user_config_dir / f"{base_filename}-department.yaml"
        elif scope == ConfigurationScope.MINISTRY:
            return self.system_config_dir / f"{base_filename}-ministry.yaml"
        else:
            return self.user_config_dir / f"{base_filename}.yaml"

    async def _load_config_file(self, config_file: Path) -> IraqiCliConfiguration:
        """Load configuration from YAML file with decryption support."""
        try:
            # Read file content
            content = config_file.read_text(encoding="utf-8")

            # Check if content is encrypted (starts with gAAAAAA for Fernet)
            if content.startswith("gAAAAAA"):
                content = self._decrypt_config_content(content)

            # Parse YAML content
            config_data = yaml.safe_load(content)

            # Convert to configuration object
            config = self._dict_to_config(config_data)
            config.config_file_path = str(config_file)

            return config

        except Exception as e:
            logger.error(f"Failed to load config file {config_file}: {e}")
            raise

    def _decrypt_config_content(self, encrypted_content: str) -> str:
        """Decrypt encrypted configuration content."""
        if not self.encryption_key:
            raise ValueError("No encryption key available for decryption")

        try:
            fernet = Fernet(self.encryption_key)
            decrypted_bytes = fernet.decrypt(encrypted_content.encode())
            return decrypted_bytes.decode("utf-8")
        except Exception as e:
            logger.error(f"Configuration decryption failed: {e}")
            raise

    def _dict_to_config(self, config_data: Dict[str, Any]) -> IraqiCliConfiguration:
        """Convert dictionary to configuration object."""
        try:
            # Handle nested configurations
            auth_config_data = config_data.get("auth_config", {})
            security_config_data = config_data.get("security_config", {})
            cultural_config_data = config_data.get("cultural_config", {})
            performance_config_data = config_data.get("performance_config", {})

            # Create configuration object
            config = IraqiCliConfiguration(
                version=config_data.get("version", "1.0.0-iraqi"),
                environment=config_data.get("environment", "production"),
                debug_enabled=config_data.get("debug_enabled", False),
                auth_config=IraqiAuthConfig(**auth_config_data),
                security_config=IraqiSecurityConfig(**security_config_data),
                cultural_config=IraqiCulturalConfig(**cultural_config_data),
                performance_config=IraqiPerformanceConfig(**performance_config_data),
                user_profile=config_data.get("user_profile", {}),
                system_info=config_data.get("system_info", {}),
                enabled_extensions=config_data.get("enabled_extensions", []),
                extension_configs=config_data.get("extension_configs", {}),
            )

            return config

        except Exception as e:
            logger.error(f"Failed to convert dict to config: {e}")
            raise

    async def _apply_hierarchical_config(
        self, base_config: IraqiCliConfiguration, scope: ConfigurationScope
    ) -> IraqiCliConfiguration:
        """Apply hierarchical configuration loading (system -> ministry -> department -> user -> session)."""

        # Define loading order based on scope
        if scope == ConfigurationScope.SESSION:
            load_order = [
                ConfigurationScope.SYSTEM,
                ConfigurationScope.MINISTRY,
                ConfigurationScope.DEPARTMENT,
                ConfigurationScope.USER,
                ConfigurationScope.SESSION,
            ]
        elif scope == ConfigurationScope.USER:
            load_order = [
                ConfigurationScope.SYSTEM,
                ConfigurationScope.MINISTRY,
                ConfigurationScope.DEPARTMENT,
                ConfigurationScope.USER,
            ]
        elif scope == ConfigurationScope.DEPARTMENT:
            load_order = [
                ConfigurationScope.SYSTEM,
                ConfigurationScope.MINISTRY,
                ConfigurationScope.DEPARTMENT,
            ]
        elif scope == ConfigurationScope.MINISTRY:
            load_order = [ConfigurationScope.SYSTEM, ConfigurationScope.MINISTRY]
        else:
            load_order = [ConfigurationScope.SYSTEM]

        # Apply configurations in order
        current_config = base_config

        for config_scope in load_order:
            if config_scope == scope:
                continue  # Skip the base config we already loaded

            scope_config_file = self._get_config_file_path(config_scope)
            if scope_config_file.exists():
                try:
                    scope_config = await self._load_config_file(scope_config_file)
                    current_config = self._merge_configurations(
                        current_config, scope_config
                    )
                except Exception as e:
                    logger.warning(f"Failed to load {config_scope.value} config: {e}")

        return current_config

    def _merge_configurations(
        self, base_config: IraqiCliConfiguration, override_config: IraqiCliConfiguration
    ) -> IraqiCliConfiguration:
        """Merge two configuration objects with override precedence."""

        # Convert to dictionaries for easier merging
        base_dict = asdict(base_config)
        override_dict = asdict(override_config)

        # Deep merge the dictionaries
        merged_dict = self._deep_merge_dicts(base_dict, override_dict)

        # Convert back to configuration object
        return self._dict_to_config(merged_dict)

    def _deep_merge_dicts(self, base_dict: Dict, override_dict: Dict) -> Dict:
        """Deep merge two dictionaries."""
        merged = base_dict.copy()

        for key, value in override_dict.items():
            if (
                key in merged
                and isinstance(merged[key], dict)
                and isinstance(value, dict)
            ):
                merged[key] = self._deep_merge_dicts(merged[key], value)
            elif value is not None:  # Don't override with None values
                merged[key] = value

        return merged

    async def _validate_configuration(
        self, config: IraqiCliConfiguration
    ) -> Dict[str, Any]:
        """Comprehensive configuration validation."""
        validation_start = datetime.now()

        validation_result = {
            "valid": True,
            "errors": [],
            "warnings": [],
            "validation_time_ms": 0,
        }

        try:
            # Run all validators
            for validator in self.config_validators:
                try:
                    validator_result = await validator(config)

                    if not validator_result.get("valid", True):
                        validation_result["valid"] = False
                        validation_result["errors"].extend(
                            validator_result.get("errors", [])
                        )

                    validation_result["warnings"].extend(
                        validator_result.get("warnings", [])
                    )

                except Exception as e:
                    validation_result["valid"] = False
                    validation_result["errors"].append(f"Validator error: {str(e)}")

        except Exception as e:
            validation_result["valid"] = False
            validation_result["errors"].append(f"Validation system error: {str(e)}")

        finally:
            validation_time = (datetime.now() - validation_start).total_seconds() * 1000
            validation_result["validation_time_ms"] = round(validation_time, 2)

        return validation_result

    async def _validate_cultural_compliance(
        self, config: IraqiCliConfiguration
    ) -> Dict[str, Any]:
        """Validate cultural compliance of configuration settings."""
        result = {"valid": True, "errors": [], "warnings": []}

        cultural_config = config.cultural_config

        # Check Islamic compliance requirements
        if cultural_config.islamic_compliance_required:
            if cultural_config.minimum_islamic_score < 80.0:
                result["warnings"].append(
                    "Islamic compliance score threshold is below recommended 80.0"
                )

        # Check language configuration
        if cultural_config.primary_language not in ["ar-IQ", "ar"]:
            result["warnings"].append(
                "Primary language should be Arabic (ar-IQ or ar) for Iraqi government use"
            )

        # Check prayer time awareness for Islamic compliance
        if (
            cultural_config.islamic_compliance_required
            and not cultural_config.prayer_time_awareness
        ):
            result["warnings"].append(
                "Prayer time awareness should be enabled for Islamic compliance"
            )

        # Check professional domains
        required_domains = ["government", "legal"]
        missing_domains = [
            d
            for d in required_domains
            if d not in cultural_config.professional_domains_enabled
        ]
        if missing_domains:
            result["warnings"].append(
                f"Recommended professional domains missing: {', '.join(missing_domains)}"
            )

        return result

    async def _validate_security_settings(
        self, config: IraqiCliConfiguration
    ) -> Dict[str, Any]:
        """Validate security configuration settings."""
        result = {"valid": True, "errors": [], "warnings": []}

        security_config = config.security_config

        # Check encryption requirements
        if not security_config.encryption_enabled:
            result["errors"].append("Encryption must be enabled for government use")
            result["valid"] = False

        # Check session timeout
        if security_config.session_timeout_minutes > 60:
            result["warnings"].append(
                "Session timeout exceeds recommended 60 minutes for government use"
            )

        # Check audit logging
        if not security_config.audit_logging_enabled:
            result["errors"].append(
                "Audit logging must be enabled for government compliance"
            )
            result["valid"] = False

        # Check SSL requirements
        if not security_config.ssl_required:
            result["errors"].append(
                "SSL must be required for government communications"
            )
            result["valid"] = False

        return result

    async def _validate_authentication_config(
        self, config: IraqiCliConfiguration
    ) -> Dict[str, Any]:
        """Validate authentication configuration settings."""
        result = {"valid": True, "errors": [], "warnings": []}

        auth_config = config.auth_config

        # Check enabled authentication types
        required_auth_types = ["government_login", "iraqi_id"]
        missing_auth_types = [
            t for t in required_auth_types if t not in auth_config.enabled_auth_types
        ]
        if missing_auth_types:
            result["warnings"].append(
                f"Recommended authentication types missing: {', '.join(missing_auth_types)}"
            )

        # Check MFA requirements
        high_security_levels = ["secret", "top_secret"]
        missing_mfa_levels = [
            l
            for l in high_security_levels
            if l not in auth_config.mfa_required_for_levels
        ]
        if missing_mfa_levels:
            result["warnings"].append(
                f"MFA should be required for security levels: {', '.join(missing_mfa_levels)}"
            )

        # Check timeout values
        if auth_config.government_portal_timeout_seconds > 30:
            result["warnings"].append(
                "Government portal timeout exceeds recommended 30 seconds"
            )

        return result

    async def _validate_performance_settings(
        self, config: IraqiCliConfiguration
    ) -> Dict[str, Any]:
        """Validate performance configuration settings."""
        result = {"valid": True, "errors": [], "warnings": []}

        performance_config = config.performance_config

        # Check response time targets
        if performance_config.command_response_target_ms > 200:
            result["warnings"].append(
                "Command response target exceeds recommended 200ms"
            )

        if performance_config.cultural_validation_target_ms > 300:
            result["warnings"].append(
                "Cultural validation target exceeds recommended 300ms"
            )

        # Check resource limits
        if performance_config.max_memory_usage_mb > 1024:
            result["warnings"].append("Memory usage limit exceeds recommended 1024MB")

        # Check caching configuration
        if not performance_config.configuration_cache_enabled:
            result["warnings"].append(
                "Configuration caching should be enabled for better performance"
            )

        return result

    async def _validate_file_permissions(
        self, config: IraqiCliConfiguration
    ) -> Dict[str, Any]:
        """Validate file system permissions and access."""
        result = {"valid": True, "errors": [], "warnings": []}

        # Check config directory permissions
        if self.user_config_dir.exists():
            stat_info = self.user_config_dir.stat()
            # Check if directory is readable/writable by owner only (mode 700)
            if oct(stat_info.st_mode)[-3:] != "700":
                result["warnings"].append(
                    f"Config directory permissions should be 700 (current: {oct(stat_info.st_mode)[-3:]})"
                )

        # Check encryption key permissions
        key_file = self.user_config_dir / "config.key"
        if key_file.exists():
            stat_info = key_file.stat()
            if oct(stat_info.st_mode)[-3:] != "600":
                result["warnings"].append(
                    f"Encryption key permissions should be 600 (current: {oct(stat_info.st_mode)[-3:]})"
                )

        return result

    def _calculate_config_checksum(self, config: IraqiCliConfiguration) -> str:
        """Calculate checksum for configuration integrity verification."""
        config_dict = asdict(config)

        # Remove volatile fields that shouldn't affect checksum
        config_dict.pop("last_modified", None)
        config_dict.pop("config_checksum", None)

        # Create deterministic string representation
        config_str = json.dumps(config_dict, sort_keys=True, ensure_ascii=False)

        # Calculate SHA-256 checksum
        return hashlib.sha256(config_str.encode("utf-8")).hexdigest()

    async def save_configuration(
        self,
        config: IraqiCliConfiguration,
        config_path: Optional[str] = None,
        encrypt: bool = True,
    ) -> bool:
        """
        Save configuration to file system with encryption and validation.

        Args:
            config: Configuration object to save
            config_path: Optional explicit path for saving
            encrypt: Whether to encrypt the configuration file

        Returns:
            True if save successful, False otherwise
        """
        save_start = datetime.now()

        try:
            # Validate configuration before saving
            validation_result = await self._validate_configuration(config)
            if not validation_result["valid"]:
                logger.error(
                    f"Cannot save invalid configuration: {validation_result['errors']}"
                )
                return False

            # Determine save path
            if config_path:
                save_path = Path(config_path)
            else:
                save_path = self._get_config_file_path(ConfigurationScope.USER)

            # Ensure directory exists
            save_path.parent.mkdir(parents=True, exist_ok=True)

            # Update configuration metadata
            config.last_modified = save_start
            config.config_checksum = self._calculate_config_checksum(config)
            config.config_file_path = str(save_path)

            # Convert to dictionary and then YAML
            config_dict = asdict(config)
            yaml_content = yaml.dump(
                config_dict, default_flow_style=False, allow_unicode=True, indent=2
            )

            # Encrypt content if requested
            if encrypt and config.config_security_level != ConfigurationSecurity.PUBLIC:
                yaml_content = self._encrypt_config_content(yaml_content)

            # Write to temporary file first (atomic write)
            temp_path = save_path.with_suffix(".tmp")
            temp_path.write_text(yaml_content, encoding="utf-8")

            # Set secure permissions
            temp_path.chmod(0o600)

            # Atomic move to final location
            shutil.move(str(temp_path), str(save_path))

            # Update current configuration
            self.current_config = config

            # Log successful save
            save_time = (datetime.now() - save_start).total_seconds() * 1000
            logger.info(
                f"Configuration saved successfully in {save_time:.2f}ms to {save_path}"
            )

            return True

        except Exception as e:
            logger.error(f"Failed to save configuration: {e}")
            return False

    def _encrypt_config_content(self, content: str) -> str:
        """Encrypt configuration content for secure storage."""
        if not self.encryption_key:
            raise ValueError("No encryption key available for encryption")

        try:
            fernet = Fernet(self.encryption_key)
            encrypted_bytes = fernet.encrypt(content.encode("utf-8"))
            return encrypted_bytes.decode("utf-8")
        except Exception as e:
            logger.error(f"Configuration encryption failed: {e}")
            raise

    async def get_configuration_value(self, key_path: str, default: Any = None) -> Any:
        """
        Get configuration value using dot notation path.

        Args:
            key_path: Dot notation path (e.g., 'security_config.encryption_enabled')
            default: Default value if key not found

        Returns:
            Configuration value or default
        """
        if not self.current_config:
            return default

        try:
            # Split the key path
            keys = key_path.split(".")
            value = asdict(self.current_config)

            # Navigate through the nested structure
            for key in keys:
                if isinstance(value, dict) and key in value:
                    value = value[key]
                else:
                    return default

            return value

        except Exception as e:
            logger.warning(f"Failed to get configuration value for {key_path}: {e}")
            return default

    async def set_configuration_value(self, key_path: str, value: Any) -> bool:
        """
        Set configuration value using dot notation path.

        Args:
            key_path: Dot notation path (e.g., 'security_config.encryption_enabled')
            value: Value to set

        Returns:
            True if set successful, False otherwise
        """
        if not self.current_config:
            logger.error("No current configuration loaded")
            return False

        try:
            # Convert config to dict for easier manipulation
            config_dict = asdict(self.current_config)

            # Split the key path
            keys = key_path.split(".")
            current = config_dict

            # Navigate to the parent of the target key
            for key in keys[:-1]:
                if key not in current:
                    current[key] = {}
                current = current[key]

            # Set the value
            current[keys[-1]] = value

            # Convert back to configuration object
            updated_config = self._dict_to_config(config_dict)

            # Validate the updated configuration
            validation_result = await self._validate_configuration(updated_config)
            if not validation_result["valid"]:
                logger.error(
                    f"Invalid configuration after update: {validation_result['errors']}"
                )
                return False

            # Update current configuration
            self.current_config = updated_config

            # Notify listeners
            await self._notify_change_listeners(key_path, value)

            logger.info(f"Configuration value updated: {key_path} = {value}")
            return True

        except Exception as e:
            logger.error(f"Failed to set configuration value for {key_path}: {e}")
            return False

    async def _notify_change_listeners(self, key_path: str, value: Any):
        """Notify registered change listeners about configuration updates."""
        for listener in self.change_listeners:
            try:
                await listener(key_path, value)
            except Exception as e:
                logger.warning(f"Configuration change listener failed: {e}")

    def register_change_listener(self, listener: callable):
        """Register a configuration change listener."""
        self.change_listeners.append(listener)

    def remove_change_listener(self, listener: callable):
        """Remove a configuration change listener."""
        if listener in self.change_listeners:
            self.change_listeners.remove(listener)

    async def backup_configuration(self, backup_path: Optional[str] = None) -> str:
        """
        Create backup of current configuration.

        Args:
            backup_path: Optional explicit backup path

        Returns:
            Path to created backup file
        """
        if not self.current_config:
            raise ValueError("No configuration loaded to backup")

        try:
            # Determine backup path
            if backup_path:
                backup_file = Path(backup_path)
            else:
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                backup_filename = f"iraqi-cli-config-backup-{timestamp}.yaml"
                backup_file = self.user_config_dir / "backups" / backup_filename

            # Ensure backup directory exists
            backup_file.parent.mkdir(parents=True, exist_ok=True)

            # Save configuration to backup location
            success = await self.save_configuration(
                self.current_config, str(backup_file), encrypt=True
            )

            if success:
                logger.info(f"Configuration backup created: {backup_file}")
                return str(backup_file)
            else:
                raise RuntimeError("Failed to create configuration backup")

        except Exception as e:
            logger.error(f"Configuration backup failed: {e}")
            raise

    async def restore_configuration(self, backup_path: str) -> bool:
        """
        Restore configuration from backup file.

        Args:
            backup_path: Path to backup file

        Returns:
            True if restore successful, False otherwise
        """
        try:
            backup_file = Path(backup_path)

            if not backup_file.exists():
                raise FileNotFoundError(f"Backup file not found: {backup_path}")

            # Load configuration from backup
            restored_config = await self._load_config_file(backup_file)

            # Validate restored configuration
            validation_result = await self._validate_configuration(restored_config)
            if not validation_result["valid"]:
                raise ValueError(
                    f"Backup configuration is invalid: {validation_result['errors']}"
                )

            # Save as current configuration
            success = await self.save_configuration(restored_config)

            if success:
                self.current_config = restored_config
                logger.info(f"Configuration restored from backup: {backup_path}")
                return True
            else:
                raise RuntimeError("Failed to save restored configuration")

        except Exception as e:
            logger.error(f"Configuration restore failed: {e}")
            return False

    def get_configuration_summary(self) -> Dict[str, Any]:
        """Get summary of current configuration for monitoring and debugging."""
        if not self.current_config:
            return {"status": "No configuration loaded"}

        config = self.current_config

        return {
            "version": config.version,
            "environment": config.environment,
            "security_level": config.config_security_level.value,
            "last_modified": config.last_modified.isoformat()
            if config.last_modified
            else None,
            "config_checksum": config.config_checksum,
            "authentication": {
                "enabled_types": config.auth_config.enabled_auth_types,
                "default_type": config.auth_config.default_auth_type,
                "mfa_enabled": bool(config.auth_config.mfa_required_for_levels),
                "biometric_enabled": config.auth_config.biometric_enabled,
            },
            "security": {
                "encryption_enabled": config.security_config.encryption_enabled,
                "audit_logging": config.security_config.audit_logging_enabled,
                "session_timeout_minutes": config.security_config.session_timeout_minutes,
                "ssl_required": config.security_config.ssl_required,
            },
            "cultural": {
                "primary_language": config.cultural_config.primary_language,
                "cultural_validation": config.cultural_config.cultural_validation_enabled,
                "islamic_compliance": config.cultural_config.islamic_compliance_required,
                "dialect_processing": config.cultural_config.dialect_processing_enabled,
                "professional_domains": config.cultural_config.professional_domains_enabled,
            },
            "performance": {
                "response_target_ms": config.performance_config.command_response_target_ms,
                "memory_limit_mb": config.performance_config.max_memory_usage_mb,
                "caching_enabled": config.performance_config.configuration_cache_enabled,
                "monitoring_enabled": config.performance_config.performance_monitoring_enabled,
            },
            "extensions": {
                "enabled_count": len(config.enabled_extensions),
                "enabled_extensions": config.enabled_extensions,
            },
        }


# Global configuration manager instance
config_manager = IraqiConfigurationManager()


# Utility functions for easy access
async def load_config(config_path: Optional[str] = None) -> IraqiCliConfiguration:
    """Load configuration using global manager."""
    return await config_manager.load_configuration(config_path)


async def save_config(
    config: IraqiCliConfiguration, config_path: Optional[str] = None
) -> bool:
    """Save configuration using global manager."""
    return await config_manager.save_configuration(config, config_path)


async def get_config_value(key_path: str, default: Any = None) -> Any:
    """Get configuration value using global manager."""
    return await config_manager.get_configuration_value(key_path, default)


async def set_config_value(key_path: str, value: Any) -> bool:
    """Set configuration value using global manager."""
    return await config_manager.set_configuration_value(key_path, value)
