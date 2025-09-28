"""
Iraqi Localization Loader - Dynamic Localization Resource Management

Enhanced localization resource loading with Iraqi cultural intelligence.
Supports dynamic loading of translations, cultural patterns, and professional terminologies.

Key features:
- Hierarchical localization resource loading (dialect > domain > general)
- Cultural pattern caching and validation
- Professional terminology hot-loading
- RTL resource optimization
- Fallback chain management with cultural preferences
"""

from typing import Dict, List, Any, Optional, Union, Callable, Set
from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path
import json
import yaml
import asyncio
import logging
import aiofiles
import hashlib
from datetime import datetime, timedelta

from iraqi_i18n_manager import (
    IraqiDialect,
    ProfessionalDomain,
    LocalizationContext,
    TranslationEntry,
)


class ResourceType(Enum):
    TRANSLATIONS = "translations"
    CULTURAL_PATTERNS = "cultural_patterns"
    TERMINOLOGY = "terminology"
    RTL_RULES = "rtl_rules"
    VALIDATION_RULES = "validation_rules"
    FORMATTING_RULES = "formatting_rules"


class LoadingStrategy(Enum):
    EAGER = "eager"  # Load all resources at startup
    LAZY = "lazy"  # Load resources on demand
    HYBRID = "hybrid"  # Load critical resources eagerly, others lazily


@dataclass
class ResourceMetadata:
    """Metadata for localization resources"""

    resource_id: str
    resource_type: ResourceType
    dialect: IraqiDialect
    domain: ProfessionalDomain
    version: str
    last_modified: datetime
    file_hash: str
    dependencies: List[str] = field(default_factory=list)
    cultural_validation_level: str = "standard"
    is_critical: bool = False


@dataclass
class ResourceCache:
    """Cache entry for loaded resources"""

    metadata: ResourceMetadata
    content: Any
    loaded_at: datetime
    access_count: int = 0
    last_accessed: Optional[datetime] = None


class IraqiLocalizationLoader:
    """Enhanced localization resource loader with cultural intelligence"""

    def __init__(
        self,
        resource_directories: List[Path],
        loading_strategy: LoadingStrategy = LoadingStrategy.HYBRID,
        cache_ttl_minutes: int = 60,
        max_cache_size: int = 1000,
    ):
        self.resource_directories = [Path(d) for d in resource_directories]
        self.loading_strategy = loading_strategy
        self.cache_ttl = timedelta(minutes=cache_ttl_minutes)
        self.max_cache_size = max_cache_size

        # Resource cache and metadata
        self.resource_cache: Dict[str, ResourceCache] = {}
        self.resource_metadata: Dict[str, ResourceMetadata] = {}
        self.resource_index: Dict[ResourceType, Dict[str, Set[str]]] = {}

        # Loading state
        self.loading_tasks: Dict[str, asyncio.Task] = {}
        self.fallback_chains: Dict[str, List[str]] = {}

        # Cultural processors
        self.cultural_validators: Dict[str, Callable] = {}
        self.terminology_processors: Dict[ProfessionalDomain, Callable] = {}

        self._setup_logging()

    def _setup_logging(self):
        """Setup culturally appropriate logging"""
        self.logger = logging.getLogger("iraqi_localization_loader")
        self.logger.setLevel(logging.INFO)

    async def initialize(self) -> bool:
        """Initialize the localization loader"""
        try:
            # Discover and index all resources
            await self._discover_resources()

            # Build fallback chains
            await self._build_fallback_chains()

            # Load critical resources if using eager or hybrid strategy
            if self.loading_strategy in [LoadingStrategy.EAGER, LoadingStrategy.HYBRID]:
                await self._load_critical_resources()

            self.logger.info(
                f"Localization loader initialized with {len(self.resource_metadata)} resources"
            )
            return True

        except Exception as e:
            self.logger.error(f"Failed to initialize localization loader: {str(e)}")
            return False

    async def load_translations(
        self,
        dialect: IraqiDialect,
        domain: ProfessionalDomain,
        namespace: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Load translations for specific dialect and domain"""

        resource_key = self._build_resource_key(
            ResourceType.TRANSLATIONS, dialect, domain, namespace
        )

        # Try to get from cache first
        cached_resource = await self._get_from_cache(resource_key)
        if cached_resource is not None:
            return cached_resource

        # Load with fallback chain
        translations = await self._load_with_fallback_chain(
            ResourceType.TRANSLATIONS, dialect, domain, namespace
        )

        if translations:
            # Cache the loaded translations
            await self._cache_resource(
                resource_key, translations, ResourceType.TRANSLATIONS, dialect, domain
            )

        return translations or {}

    async def load_cultural_patterns(
        self, dialect: IraqiDialect, domain: ProfessionalDomain
    ) -> Dict[str, Any]:
        """Load cultural patterns for specific context"""

        resource_key = self._build_resource_key(
            ResourceType.CULTURAL_PATTERNS, dialect, domain
        )

        cached_resource = await self._get_from_cache(resource_key)
        if cached_resource is not None:
            return cached_resource

        patterns = await self._load_with_fallback_chain(
            ResourceType.CULTURAL_PATTERNS, dialect, domain
        )

        if patterns:
            # Validate cultural patterns
            validated_patterns = await self._validate_cultural_patterns(
                patterns, dialect, domain
            )
            await self._cache_resource(
                resource_key,
                validated_patterns,
                ResourceType.CULTURAL_PATTERNS,
                dialect,
                domain,
            )
            return validated_patterns

        return {}

    async def load_terminology(
        self, domain: ProfessionalDomain, language_pair: str = "ar-en"
    ) -> Dict[str, Any]:
        """Load professional domain terminology"""

        resource_key = f"terminology_{domain.value}_{language_pair}"

        cached_resource = await self._get_from_cache(resource_key)
        if cached_resource is not None:
            return cached_resource

        # Load terminology from multiple sources
        terminology = {}

        # Try domain-specific terminology first
        domain_terminology = await self._load_domain_terminology(domain, language_pair)
        if domain_terminology:
            terminology.update(domain_terminology)

        # Add general terminology as fallback
        general_terminology = await self._load_domain_terminology(
            ProfessionalDomain.GENERAL, language_pair
        )
        if general_terminology:
            # General terminology has lower priority
            for key, value in general_terminology.items():
                if key not in terminology:
                    terminology[key] = value

        if terminology:
            await self._cache_resource(
                resource_key,
                terminology,
                ResourceType.TERMINOLOGY,
                IraqiDialect.STANDARD_ARABIC,
                domain,
            )

        return terminology

    async def load_rtl_rules(self, content_type: str = "text") -> Dict[str, Any]:
        """Load RTL formatting rules"""

        resource_key = f"rtl_rules_{content_type}"

        cached_resource = await self._get_from_cache(resource_key)
        if cached_resource is not None:
            return cached_resource

        rtl_rules = await self._load_rtl_rules_from_files(content_type)

        if rtl_rules:
            await self._cache_resource(
                resource_key,
                rtl_rules,
                ResourceType.RTL_RULES,
                IraqiDialect.STANDARD_ARABIC,
                ProfessionalDomain.GENERAL,
            )

        return rtl_rules or {}

    async def reload_resource(self, resource_id: str) -> bool:
        """Reload a specific resource (hot reload)"""
        try:
            # Remove from cache
            if resource_id in self.resource_cache:
                del self.resource_cache[resource_id]

            # Get metadata for reloading
            if resource_id not in self.resource_metadata:
                self.logger.error(f"Resource metadata not found: {resource_id}")
                return False

            metadata = self.resource_metadata[resource_id]

            # Reload the resource
            reloaded_content = await self._load_resource_by_metadata(metadata)

            if reloaded_content is not None:
                await self._cache_resource(
                    resource_id,
                    reloaded_content,
                    metadata.resource_type,
                    metadata.dialect,
                    metadata.domain,
                )

                self.logger.info(f"Successfully reloaded resource: {resource_id}")
                return True
            else:
                self.logger.error(f"Failed to reload resource content: {resource_id}")
                return False

        except Exception as e:
            self.logger.error(f"Error reloading resource {resource_id}: {str(e)}")
            return False

    async def get_resource_statistics(self) -> Dict[str, Any]:
        """Get comprehensive resource loading statistics"""

        cache_stats = {
            "total_cached_resources": len(self.resource_cache),
            "cache_hit_rate": self._calculate_cache_hit_rate(),
            "memory_usage_estimate": self._estimate_memory_usage(),
            "most_accessed_resources": self._get_most_accessed_resources(5),
        }

        resource_stats = {
            "total_discovered_resources": len(self.resource_metadata),
            "resources_by_type": self._count_resources_by_type(),
            "resources_by_dialect": self._count_resources_by_dialect(),
            "resources_by_domain": self._count_resources_by_domain(),
        }

        return {
            "cache_statistics": cache_stats,
            "resource_statistics": resource_stats,
            "loading_strategy": self.loading_strategy.value,
            "cache_ttl_minutes": self.cache_ttl.total_seconds() / 60,
        }

    # Private methods

    async def _discover_resources(self):
        """Discover all available localization resources"""

        for resource_dir in self.resource_directories:
            if not resource_dir.exists():
                self.logger.warning(f"Resource directory not found: {resource_dir}")
                continue

            # Discover resources recursively
            await self._discover_resources_in_directory(resource_dir)

        # Build resource index for fast lookups
        await self._build_resource_index()

    async def _discover_resources_in_directory(self, directory: Path):
        """Discover resources in a specific directory"""

        try:
            # Look for resource files (.json, .yaml, .yml)
            resource_patterns = ["*.json", "*.yaml", "*.yml"]

            for pattern in resource_patterns:
                async for file_path in self._async_glob(directory, pattern):
                    metadata = await self._extract_resource_metadata(file_path)
                    if metadata:
                        self.resource_metadata[metadata.resource_id] = metadata

        except Exception as e:
            self.logger.error(f"Error discovering resources in {directory}: {str(e)}")

    async def _async_glob(self, directory: Path, pattern: str):
        """Async generator for file globbing"""
        for file_path in directory.rglob(pattern):
            yield file_path

    async def _extract_resource_metadata(
        self, file_path: Path
    ) -> Optional[ResourceMetadata]:
        """Extract metadata from a resource file"""
        try:
            # Calculate file hash for change detection
            file_hash = await self._calculate_file_hash(file_path)

            # Get file stats
            stat = file_path.stat()
            last_modified = datetime.fromtimestamp(stat.st_mtime)

            # Parse file name to extract dialect, domain, and type information
            # Expected format: {type}_{dialect}_{domain}_{namespace}.{ext}
            name_parts = file_path.stem.split("_")

            if len(name_parts) < 3:
                self.logger.warning(f"Invalid resource file name format: {file_path}")
                return None

            resource_type = ResourceType(name_parts[0])
            dialect = IraqiDialect(name_parts[1])
            domain = ProfessionalDomain(name_parts[2])

            namespace = "_".join(name_parts[3:]) if len(name_parts) > 3 else None

            # Create resource ID
            resource_id = self._build_resource_key(
                resource_type, dialect, domain, namespace
            )

            # Load metadata from file header (if available)
            file_metadata = await self._load_file_metadata(file_path)

            metadata = ResourceMetadata(
                resource_id=resource_id,
                resource_type=resource_type,
                dialect=dialect,
                domain=domain,
                version=file_metadata.get("version", "1.0.0"),
                last_modified=last_modified,
                file_hash=file_hash,
                dependencies=file_metadata.get("dependencies", []),
                cultural_validation_level=file_metadata.get(
                    "cultural_validation_level", "standard"
                ),
                is_critical=file_metadata.get("is_critical", False),
            )

            return metadata

        except (ValueError, KeyError) as e:
            self.logger.warning(
                f"Could not parse resource metadata from {file_path}: {str(e)}"
            )
            return None
        except Exception as e:
            self.logger.error(f"Error extracting metadata from {file_path}: {str(e)}")
            return None

    async def _calculate_file_hash(self, file_path: Path) -> str:
        """Calculate SHA-256 hash of file content"""
        hash_sha256 = hashlib.sha256()

        async with aiofiles.open(file_path, "rb") as f:
            chunk = await f.read(8192)
            while chunk:
                hash_sha256.update(chunk)
                chunk = await f.read(8192)

        return hash_sha256.hexdigest()

    async def _load_file_metadata(self, file_path: Path) -> Dict[str, Any]:
        """Load metadata from file header or companion metadata file"""

        # Check for companion .meta file
        meta_file = file_path.with_suffix(file_path.suffix + ".meta")

        if meta_file.exists():
            try:
                async with aiofiles.open(meta_file, "r", encoding="utf-8") as f:
                    content = await f.read()
                    return yaml.safe_load(content) or {}
            except Exception as e:
                self.logger.warning(
                    f"Error loading metadata from {meta_file}: {str(e)}"
                )

        # Try to extract metadata from file header
        try:
            async with aiofiles.open(file_path, "r", encoding="utf-8") as f:
                content = await f.read(1024)  # Read first 1KB for header

                if file_path.suffix.lower() in [".yaml", ".yml"]:
                    # YAML files might have metadata in header
                    if content.startswith("# META:"):
                        meta_lines = []
                        for line in content.split("\n"):
                            if line.startswith("# META:"):
                                meta_lines.append(line[7:].strip())
                            elif line.startswith("#"):
                                continue
                            else:
                                break

                        if meta_lines:
                            return yaml.safe_load("\n".join(meta_lines)) or {}

                elif file_path.suffix.lower() == ".json":
                    # JSON files might have __meta__ key
                    try:
                        data = json.loads(content)
                        return data.get("__meta__", {})
                    except json.JSONDecodeError:
                        pass

        except Exception as e:
            self.logger.warning(
                f"Error extracting header metadata from {file_path}: {str(e)}"
            )

        return {}

    def _build_resource_key(
        self,
        resource_type: ResourceType,
        dialect: IraqiDialect,
        domain: ProfessionalDomain,
        namespace: Optional[str] = None,
    ) -> str:
        """Build a unique resource key"""
        key_parts = [resource_type.value, dialect.value, domain.value]
        if namespace:
            key_parts.append(namespace)

        return "_".join(key_parts)

    async def _build_resource_index(self):
        """Build resource index for fast lookups"""

        for resource_type in ResourceType:
            self.resource_index[resource_type] = {}

        for resource_id, metadata in self.resource_metadata.items():
            resource_type = metadata.resource_type
            dialect_domain_key = f"{metadata.dialect.value}_{metadata.domain.value}"

            if dialect_domain_key not in self.resource_index[resource_type]:
                self.resource_index[resource_type][dialect_domain_key] = set()

            self.resource_index[resource_type][dialect_domain_key].add(resource_id)

    async def _build_fallback_chains(self):
        """Build fallback chains for resource loading"""

        # For each dialect-domain combination, build fallback chain
        for resource_type in ResourceType:
            for dialect in IraqiDialect:
                for domain in ProfessionalDomain:
                    chain = self._build_fallback_chain_for_context(
                        resource_type, dialect, domain
                    )

                    chain_key = f"{resource_type.value}_{dialect.value}_{domain.value}"
                    self.fallback_chains[chain_key] = chain

    def _build_fallback_chain_for_context(
        self,
        resource_type: ResourceType,
        dialect: IraqiDialect,
        domain: ProfessionalDomain,
    ) -> List[str]:
        """Build fallback chain for specific context"""

        fallback_chain = []

        # Primary: exact match
        primary_key = self._build_resource_key(resource_type, dialect, domain)
        fallback_chain.append(primary_key)

        # Secondary: same domain, standard Arabic
        if dialect != IraqiDialect.STANDARD_ARABIC:
            secondary_key = self._build_resource_key(
                resource_type, IraqiDialect.STANDARD_ARABIC, domain
            )
            fallback_chain.append(secondary_key)

        # Tertiary: same dialect, general domain
        if domain != ProfessionalDomain.GENERAL:
            tertiary_key = self._build_resource_key(
                resource_type, dialect, ProfessionalDomain.GENERAL
            )
            fallback_chain.append(tertiary_key)

        # Quaternary: standard Arabic, general domain
        if (
            dialect != IraqiDialect.STANDARD_ARABIC
            or domain != ProfessionalDomain.GENERAL
        ):
            quaternary_key = self._build_resource_key(
                resource_type, IraqiDialect.STANDARD_ARABIC, ProfessionalDomain.GENERAL
            )
            fallback_chain.append(quaternary_key)

        return fallback_chain

    async def _load_critical_resources(self):
        """Load critical resources for eager/hybrid strategies"""

        critical_resources = [
            metadata
            for metadata in self.resource_metadata.values()
            if metadata.is_critical
        ]

        self.logger.info(f"Loading {len(critical_resources)} critical resources")

        # Load critical resources in parallel
        load_tasks = []
        for metadata in critical_resources:
            task = asyncio.create_task(self._load_resource_by_metadata(metadata))
            load_tasks.append((metadata.resource_id, task))

        # Wait for all critical resources to load
        for resource_id, task in load_tasks:
            try:
                content = await task
                if content is not None:
                    metadata = self.resource_metadata[resource_id]
                    await self._cache_resource(
                        resource_id,
                        content,
                        metadata.resource_type,
                        metadata.dialect,
                        metadata.domain,
                    )
            except Exception as e:
                self.logger.error(
                    f"Failed to load critical resource {resource_id}: {str(e)}"
                )

    async def _load_with_fallback_chain(
        self,
        resource_type: ResourceType,
        dialect: IraqiDialect,
        domain: ProfessionalDomain,
        namespace: Optional[str] = None,
    ) -> Optional[Any]:
        """Load resource using fallback chain"""

        # Get fallback chain
        chain_key = f"{resource_type.value}_{dialect.value}_{domain.value}"
        fallback_chain = self.fallback_chains.get(chain_key, [])

        # Try each resource in fallback chain
        for resource_key in fallback_chain:
            # Modify key for namespace if provided
            if namespace:
                resource_key = f"{resource_key}_{namespace}"

            if resource_key in self.resource_metadata:
                metadata = self.resource_metadata[resource_key]
                content = await self._load_resource_by_metadata(metadata)

                if content is not None:
                    self.logger.debug(f"Loaded resource from fallback: {resource_key}")
                    return content

        self.logger.warning(f"No resource found in fallback chain for {chain_key}")
        return None

    async def _load_resource_by_metadata(
        self, metadata: ResourceMetadata
    ) -> Optional[Any]:
        """Load resource content using metadata"""

        # Find the file for this resource
        resource_file = await self._find_resource_file(metadata)

        if not resource_file or not resource_file.exists():
            self.logger.error(f"Resource file not found for: {metadata.resource_id}")
            return None

        try:
            # Load content based on file type
            async with aiofiles.open(resource_file, "r", encoding="utf-8") as f:
                content = await f.read()

            if resource_file.suffix.lower() == ".json":
                data = json.loads(content)
            elif resource_file.suffix.lower() in [".yaml", ".yml"]:
                data = yaml.safe_load(content)
            else:
                self.logger.error(f"Unsupported resource file format: {resource_file}")
                return None

            # Remove metadata if present
            if isinstance(data, dict) and "__meta__" in data:
                del data["__meta__"]

            return data

        except Exception as e:
            self.logger.error(
                f"Error loading resource {metadata.resource_id}: {str(e)}"
            )
            return None

    async def _find_resource_file(self, metadata: ResourceMetadata) -> Optional[Path]:
        """Find the file for a resource based on metadata"""

        # Reconstruct expected file name
        name_parts = [
            metadata.resource_type.value,
            metadata.dialect.value,
            metadata.domain.value,
        ]

        # Add namespace if it exists (extract from resource_id)
        resource_parts = metadata.resource_id.split("_")
        if len(resource_parts) > 3:
            name_parts.extend(resource_parts[3:])

        base_name = "_".join(name_parts)

        # Try different extensions
        extensions = [".json", ".yaml", ".yml"]

        for resource_dir in self.resource_directories:
            for ext in extensions:
                candidate_file = resource_dir / f"{base_name}{ext}"
                if candidate_file.exists():
                    return candidate_file

        return None

    async def _get_from_cache(self, resource_key: str) -> Optional[Any]:
        """Get resource from cache if available and valid"""

        if resource_key not in self.resource_cache:
            return None

        cache_entry = self.resource_cache[resource_key]

        # Check if cache entry is still valid
        if datetime.now() - cache_entry.loaded_at > self.cache_ttl:
            # Cache entry expired
            del self.resource_cache[resource_key]
            return None

        # Update access statistics
        cache_entry.access_count += 1
        cache_entry.last_accessed = datetime.now()

        return cache_entry.content

    async def _cache_resource(
        self,
        resource_key: str,
        content: Any,
        resource_type: ResourceType,
        dialect: IraqiDialect,
        domain: ProfessionalDomain,
    ):
        """Cache loaded resource"""

        # Check cache size limit
        if len(self.resource_cache) >= self.max_cache_size:
            await self._evict_least_used_resources()

        # Create cache entry
        metadata = self.resource_metadata.get(resource_key)
        if not metadata:
            # Create minimal metadata for dynamic resources
            metadata = ResourceMetadata(
                resource_id=resource_key,
                resource_type=resource_type,
                dialect=dialect,
                domain=domain,
                version="1.0.0",
                last_modified=datetime.now(),
                file_hash="",
            )

        cache_entry = ResourceCache(
            metadata=metadata, content=content, loaded_at=datetime.now()
        )

        self.resource_cache[resource_key] = cache_entry

    async def _evict_least_used_resources(self):
        """Evict least recently used resources to free cache space"""

        # Sort cache entries by last access time (oldest first)
        sorted_entries = sorted(
            self.resource_cache.items(),
            key=lambda x: x[1].last_accessed or x[1].loaded_at,
        )

        # Remove oldest 25% of cache entries
        entries_to_remove = len(sorted_entries) // 4

        for i in range(entries_to_remove):
            resource_key = sorted_entries[i][0]
            del self.resource_cache[resource_key]

        self.logger.info(f"Evicted {entries_to_remove} cache entries")

    async def _validate_cultural_patterns(
        self,
        patterns: Dict[str, Any],
        dialect: IraqiDialect,
        domain: ProfessionalDomain,
    ) -> Dict[str, Any]:
        """Validate cultural patterns for appropriateness"""

        validated_patterns = {}

        for pattern_name, pattern_data in patterns.items():
            try:
                # Basic validation
                if not isinstance(pattern_data, dict):
                    self.logger.warning(f"Invalid pattern format: {pattern_name}")
                    continue

                # Cultural appropriateness validation
                if await self._validate_pattern_cultural_appropriateness(
                    pattern_data, dialect, domain
                ):
                    validated_patterns[pattern_name] = pattern_data
                else:
                    self.logger.warning(
                        f"Pattern failed cultural validation: {pattern_name}"
                    )

            except Exception as e:
                self.logger.error(f"Error validating pattern {pattern_name}: {str(e)}")

        return validated_patterns

    async def _validate_pattern_cultural_appropriateness(
        self,
        pattern_data: Dict[str, Any],
        dialect: IraqiDialect,
        domain: ProfessionalDomain,
    ) -> bool:
        """Validate if a pattern is culturally appropriate"""

        # Check for inappropriate content
        inappropriate_terms = [
            "inappropriate",
            "offensive",
            "gambling",
            "alcohol",
            "dating",
        ]

        pattern_text = json.dumps(pattern_data, default=str).lower()

        for term in inappropriate_terms:
            if term in pattern_text:
                return False

        # Domain-specific validation
        if domain == ProfessionalDomain.RELIGIOUS:
            # Extra strict validation for religious domain
            sensitive_terms = ["secular", "non-religious"]
            for term in sensitive_terms:
                if term in pattern_text:
                    return False

        return True

    async def _load_domain_terminology(
        self, domain: ProfessionalDomain, language_pair: str
    ) -> Dict[str, Any]:
        """Load terminology for specific domain"""

        terminology = {}

        # Look for terminology files
        for resource_dir in self.resource_directories:
            terminology_file = (
                resource_dir / f"terminology_{domain.value}_{language_pair}.json"
            )

            if terminology_file.exists():
                try:
                    async with aiofiles.open(
                        terminology_file, "r", encoding="utf-8"
                    ) as f:
                        content = await f.read()
                        data = json.loads(content)
                        terminology.update(data)

                except Exception as e:
                    self.logger.error(
                        f"Error loading terminology from {terminology_file}: {str(e)}"
                    )

        return terminology

    async def _load_rtl_rules_from_files(self, content_type: str) -> Dict[str, Any]:
        """Load RTL formatting rules from files"""

        rtl_rules = {}

        for resource_dir in self.resource_directories:
            rtl_file = resource_dir / f"rtl_rules_{content_type}.yaml"

            if rtl_file.exists():
                try:
                    async with aiofiles.open(rtl_file, "r", encoding="utf-8") as f:
                        content = await f.read()
                        data = yaml.safe_load(content)
                        rtl_rules.update(data)

                except Exception as e:
                    self.logger.error(
                        f"Error loading RTL rules from {rtl_file}: {str(e)}"
                    )

        return rtl_rules

    # Statistics and monitoring methods

    def _calculate_cache_hit_rate(self) -> float:
        """Calculate cache hit rate"""
        if not self.resource_cache:
            return 0.0

        total_accesses = sum(
            entry.access_count for entry in self.resource_cache.values()
        )
        cache_entries = len(self.resource_cache)

        if total_accesses == 0:
            return 0.0

        return (cache_entries / total_accesses) * 100

    def _estimate_memory_usage(self) -> int:
        """Estimate memory usage of cached resources (in bytes)"""
        total_size = 0

        for cache_entry in self.resource_cache.values():
            # Rough estimation of object size
            content_str = json.dumps(cache_entry.content, default=str)
            total_size += len(content_str.encode("utf-8"))

        return total_size

    def _get_most_accessed_resources(self, limit: int) -> List[Dict[str, Any]]:
        """Get most frequently accessed resources"""
        sorted_entries = sorted(
            self.resource_cache.items(), key=lambda x: x[1].access_count, reverse=True
        )

        return [
            {
                "resource_id": resource_id,
                "access_count": cache_entry.access_count,
                "resource_type": cache_entry.metadata.resource_type.value,
                "dialect": cache_entry.metadata.dialect.value,
                "domain": cache_entry.metadata.domain.value,
            }
            for resource_id, cache_entry in sorted_entries[:limit]
        ]

    def _count_resources_by_type(self) -> Dict[str, int]:
        """Count resources by type"""
        counts = {}
        for metadata in self.resource_metadata.values():
            resource_type = metadata.resource_type.value
            counts[resource_type] = counts.get(resource_type, 0) + 1
        return counts

    def _count_resources_by_dialect(self) -> Dict[str, int]:
        """Count resources by dialect"""
        counts = {}
        for metadata in self.resource_metadata.values():
            dialect = metadata.dialect.value
            counts[dialect] = counts.get(dialect, 0) + 1
        return counts

    def _count_resources_by_domain(self) -> Dict[str, int]:
        """Count resources by domain"""
        counts = {}
        for metadata in self.resource_metadata.values():
            domain = metadata.domain.value
            counts[domain] = counts.get(domain, 0) + 1
        return counts


# Example usage
async def main():
    """Example usage of Iraqi Localization Loader"""

    # Setup resource directories
    resource_dirs = [
        Path("./locales"),
        Path("./cultural_resources"),
        Path("./professional_terminologies"),
    ]

    # Create loader with hybrid loading strategy
    loader = IraqiLocalizationLoader(
        resource_directories=resource_dirs,
        loading_strategy=LoadingStrategy.HYBRID,
        cache_ttl_minutes=30,
        max_cache_size=500,
    )

    # Initialize loader
    if await loader.initialize():
        print("Localization loader initialized successfully")

        # Load translations
        translations = await loader.load_translations(
            IraqiDialect.BAGHDADI, ProfessionalDomain.LEGAL, "court_system"
        )
        print(f"Loaded {len(translations)} translations")

        # Load cultural patterns
        patterns = await loader.load_cultural_patterns(
            IraqiDialect.STANDARD_ARABIC, ProfessionalDomain.MEDICAL
        )
        print(f"Loaded {len(patterns)} cultural patterns")

        # Get statistics
        stats = await loader.get_resource_statistics()
        print(f"Resource statistics: {stats}")

    else:
        print("Failed to initialize localization loader")


if __name__ == "__main__":
    asyncio.run(main())
