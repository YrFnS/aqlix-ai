"""
Iraqi Tool Repetition Detector - Enhanced Tool Usage Pattern Analysis

Extracted from Roo-Code tool orchestration system and enhanced with Iraqi cultural intelligence,
Arabic language processing awareness, and professional domain context understanding.

Key features:
- Tool usage pattern detection with cultural context
- Arabic content processing optimization
- Professional domain-aware repetition analysis
- Cultural validation loop detection
- Intelligent tool suggestion with Iraqi context
- Performance optimization for Arabic text processing
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, List, Any, Optional, Set, Tuple, Callable
from datetime import datetime, timedelta
import asyncio
import json
import logging
import hashlib
from collections import defaultdict, deque


class ToolCategory(Enum):
    CULTURAL_VALIDATION = "cultural_validation"
    ARABIC_PROCESSING = "arabic_processing"
    TEXT_ANALYSIS = "text_analysis"
    DATA_RETRIEVAL = "data_retrieval"
    FILE_OPERATION = "file_operation"
    COMMUNICATION = "communication"
    PROFESSIONAL_DOMAIN = "professional_domain"
    GENERAL_UTILITY = "general_utility"


class RepetitionType(Enum):
    IDENTICAL = "identical"  # Exact same parameters
    SIMILAR = "similar"  # Similar parameters or intent
    ITERATIVE = "iterative"  # Progressive refinement
    CIRCULAR = "circular"  # Circular dependency pattern
    CULTURAL_LOOP = "cultural_loop"  # Cultural validation loops


@dataclass
class ToolUsageRecord:
    """Record of tool usage with cultural context"""

    tool_name: str
    parameters: Dict[str, Any]
    timestamp: datetime
    result_hash: Optional[str] = None
    success: bool = True
    arabic_content_detected: bool = False
    cultural_context: Optional[str] = None
    professional_domain: Optional[str] = None
    execution_time_ms: Optional[float] = None
    error_message: Optional[str] = None


@dataclass
class RepetitionPattern:
    """Detected repetition pattern with analysis"""

    pattern_type: RepetitionType
    tool_name: str
    occurrence_count: int
    first_occurrence: datetime
    last_occurrence: datetime
    parameters_similarity: float
    pattern_confidence: float
    optimization_suggestion: Optional[str] = None
    cultural_considerations: List[str] = field(default_factory=list)


class IraqiToolRepetitionDetector:
    """Enhanced tool repetition detector with Iraqi cultural intelligence"""

    def __init__(
        self,
        detection_window_minutes: int = 30,
        similarity_threshold: float = 0.8,
        max_history_size: int = 1000,
    ):
        self.detection_window = timedelta(minutes=detection_window_minutes)
        self.similarity_threshold = similarity_threshold
        self.max_history_size = max_history_size

        # Tool usage history
        self.tool_history: deque[ToolUsageRecord] = deque(maxlen=max_history_size)
        self.pattern_cache: Dict[str, RepetitionPattern] = {}

        # Analysis state
        self.tool_frequencies: defaultdict[str, int] = defaultdict(int)
        self.parameter_patterns: Dict[str, List[Dict[str, Any]]] = defaultdict(list)
        self.cultural_validation_chains: Dict[str, List[str]] = {}
        self.arabic_processing_optimizations: Dict[str, str] = {}

        # Cultural and domain processors
        self.cultural_analyzers: Dict[str, Callable] = {}
        self.domain_pattern_detectors: Dict[str, Callable] = {}
        self.arabic_text_processors: Dict[str, Callable] = {}

        self._setup_logging()
        self._initialize_cultural_systems()

    def _setup_logging(self):
        """Setup culturally appropriate logging with Arabic support"""
        self.logger = logging.getLogger("iraqi_tool_repetition_detector")
        self.logger.setLevel(logging.INFO)

    def _initialize_cultural_systems(self):
        """Initialize cultural analysis and optimization systems"""

        # Setup cultural analyzers
        self.cultural_analyzers = {
            "islamic_compliance": self._analyze_islamic_compliance_pattern,
            "political_neutrality": self._analyze_political_neutrality_pattern,
            "professional_etiquette": self._analyze_professional_etiquette_pattern,
            "gender_sensitivity": self._analyze_gender_sensitivity_pattern,
        }

        # Setup domain pattern detectors
        self.domain_pattern_detectors = {
            "legal": self._detect_legal_domain_patterns,
            "medical": self._detect_medical_domain_patterns,
            "educational": self._detect_educational_domain_patterns,
            "government": self._detect_government_domain_patterns,
        }

        # Setup Arabic text processors for optimization
        self.arabic_text_processors = {
            "rtl_formatting": self._optimize_rtl_formatting_calls,
            "dialect_detection": self._optimize_dialect_detection_calls,
            "mixed_content": self._optimize_mixed_content_processing,
        }

        # Initialize common optimization patterns
        self._initialize_optimization_patterns()

    def record_tool_usage(
        self,
        tool_name: str,
        parameters: Dict[str, Any],
        result: Any = None,
        execution_time_ms: Optional[float] = None,
        success: bool = True,
        error_message: Optional[str] = None,
    ) -> str:
        """Record a tool usage with cultural context analysis"""

        # Analyze cultural context
        cultural_context = self._analyze_cultural_context(tool_name, parameters)
        arabic_content = self._detect_arabic_content(parameters)
        domain = self._detect_professional_domain(tool_name, parameters)

        # Create usage record
        record = ToolUsageRecord(
            tool_name=tool_name,
            parameters=parameters.copy(),
            timestamp=datetime.now(),
            result_hash=self._calculate_result_hash(result)
            if result is not None
            else None,
            success=success,
            arabic_content_detected=arabic_content,
            cultural_context=cultural_context,
            professional_domain=domain,
            execution_time_ms=execution_time_ms,
            error_message=error_message,
        )

        # Add to history
        self.tool_history.append(record)
        self.tool_frequencies[tool_name] += 1
        self.parameter_patterns[tool_name].append(parameters)

        # Keep parameter patterns within reasonable size
        if len(self.parameter_patterns[tool_name]) > 100:
            self.parameter_patterns[tool_name] = self.parameter_patterns[tool_name][
                -50:
            ]

        # Generate unique record ID
        record_id = self._generate_record_id(record)

        # Trigger pattern analysis
        asyncio.create_task(self._analyze_patterns_async(tool_name))

        return record_id

    async def detect_repetition_patterns(
        self, tool_name: Optional[str] = None
    ) -> List[RepetitionPattern]:
        """Detect repetition patterns with cultural intelligence"""

        patterns = []

        if tool_name:
            # Analyze specific tool
            tool_patterns = await self._analyze_tool_patterns(tool_name)
            patterns.extend(tool_patterns)
        else:
            # Analyze all tools
            unique_tools = set(record.tool_name for record in self.tool_history)

            for tool in unique_tools:
                tool_patterns = await self._analyze_tool_patterns(tool)
                patterns.extend(tool_patterns)

        # Sort patterns by confidence and recency
        patterns.sort(
            key=lambda p: (p.pattern_confidence, p.last_occurrence), reverse=True
        )

        return patterns

    async def get_optimization_suggestions(
        self, tool_name: Optional[str] = None
    ) -> Dict[str, List[str]]:
        """Get optimization suggestions with cultural considerations"""

        suggestions = {}

        # Get detected patterns
        patterns = await self.detect_repetition_patterns(tool_name)

        for pattern in patterns:
            if pattern.tool_name not in suggestions:
                suggestions[pattern.tool_name] = []

            # Generate optimization suggestions based on pattern type
            tool_suggestions = await self._generate_optimization_suggestions(pattern)
            suggestions[pattern.tool_name].extend(tool_suggestions)

        # Add general cultural optimization suggestions
        for tool, tool_suggestions in suggestions.items():
            cultural_suggestions = (
                await self._generate_cultural_optimization_suggestions(tool)
            )
            tool_suggestions.extend(cultural_suggestions)

        return suggestions

    def get_usage_statistics(self) -> Dict[str, Any]:
        """Get comprehensive tool usage statistics with cultural insights"""

        total_calls = len(self.tool_history)
        unique_tools = len(set(record.tool_name for record in self.tool_history))

        # Calculate time-based statistics
        now = datetime.now()
        recent_calls = sum(
            1
            for record in self.tool_history
            if now - record.timestamp <= self.detection_window
        )

        # Cultural context analysis
        arabic_content_calls = sum(
            1 for record in self.tool_history if record.arabic_content_detected
        )

        cultural_context_distribution = defaultdict(int)
        domain_distribution = defaultdict(int)

        for record in self.tool_history:
            if record.cultural_context:
                cultural_context_distribution[record.cultural_context] += 1
            if record.professional_domain:
                domain_distribution[record.professional_domain] += 1

        # Most frequently used tools
        top_tools = sorted(
            self.tool_frequencies.items(), key=lambda x: x[1], reverse=True
        )[:10]

        # Error analysis
        error_count = sum(1 for record in self.tool_history if not record.success)
        error_rate = (error_count / total_calls * 100) if total_calls > 0 else 0

        # Performance analysis
        avg_execution_time = None
        if any(record.execution_time_ms for record in self.tool_history):
            execution_times = [
                record.execution_time_ms
                for record in self.tool_history
                if record.execution_time_ms is not None
            ]
            avg_execution_time = sum(execution_times) / len(execution_times)

        return {
            "total_tool_calls": total_calls,
            "unique_tools_used": unique_tools,
            "recent_calls_in_window": recent_calls,
            "arabic_content_calls": arabic_content_calls,
            "arabic_content_percentage": (arabic_content_calls / total_calls * 100)
            if total_calls > 0
            else 0,
            "cultural_context_distribution": dict(cultural_context_distribution),
            "professional_domain_distribution": dict(domain_distribution),
            "top_tools": top_tools,
            "error_rate_percentage": error_rate,
            "average_execution_time_ms": avg_execution_time,
            "pattern_cache_size": len(self.pattern_cache),
            "detection_window_minutes": self.detection_window.total_seconds() / 60,
            "similarity_threshold": self.similarity_threshold,
        }

    # Private analysis methods

    async def _analyze_patterns_async(self, tool_name: str):
        """Asynchronously analyze patterns for a specific tool"""
        try:
            patterns = await self._analyze_tool_patterns(tool_name)

            # Update pattern cache
            for pattern in patterns:
                cache_key = f"{pattern.tool_name}_{pattern.pattern_type.value}"
                self.pattern_cache[cache_key] = pattern

        except Exception as e:
            self.logger.error(f"Error in pattern analysis for {tool_name}: {str(e)}")

    async def _analyze_tool_patterns(self, tool_name: str) -> List[RepetitionPattern]:
        """Analyze repetition patterns for a specific tool"""

        patterns = []

        # Get recent records for this tool
        tool_records = [
            record for record in self.tool_history if record.tool_name == tool_name
        ]

        if len(tool_records) < 2:
            return patterns

        # Analyze different pattern types
        patterns.extend(await self._detect_identical_patterns(tool_records))
        patterns.extend(await self._detect_similar_patterns(tool_records))
        patterns.extend(await self._detect_iterative_patterns(tool_records))
        patterns.extend(await self._detect_circular_patterns(tool_records))
        patterns.extend(await self._detect_cultural_loop_patterns(tool_records))

        return patterns

    async def _detect_identical_patterns(
        self, records: List[ToolUsageRecord]
    ) -> List[RepetitionPattern]:
        """Detect identical tool calls"""

        patterns = []
        parameter_groups = defaultdict(list)

        # Group records by parameter hash
        for record in records:
            param_hash = self._calculate_parameter_hash(record.parameters)
            parameter_groups[param_hash].append(record)

        # Find groups with multiple occurrences
        for param_hash, group_records in parameter_groups.items():
            if len(group_records) >= 2:
                # Check if they're within detection window
                recent_records = [
                    r
                    for r in group_records
                    if datetime.now() - r.timestamp <= self.detection_window
                ]

                if len(recent_records) >= 2:
                    pattern = RepetitionPattern(
                        pattern_type=RepetitionType.IDENTICAL,
                        tool_name=records[0].tool_name,
                        occurrence_count=len(recent_records),
                        first_occurrence=min(r.timestamp for r in recent_records),
                        last_occurrence=max(r.timestamp for r in recent_records),
                        parameters_similarity=1.0,
                        pattern_confidence=0.9,
                        optimization_suggestion="Cache result or batch identical calls",
                    )

                    # Add cultural considerations
                    pattern.cultural_considerations = (
                        await self._analyze_cultural_implications(
                            records[0].tool_name, recent_records
                        )
                    )

                    patterns.append(pattern)

        return patterns

    async def _detect_similar_patterns(
        self, records: List[ToolUsageRecord]
    ) -> List[RepetitionPattern]:
        """Detect similar tool calls with slight parameter variations"""

        patterns = []

        # Compare all pairs of records
        for i in range(len(records)):
            similar_records = [records[i]]
            base_record = records[i]

            for j in range(i + 1, len(records)):
                similarity = self._calculate_parameter_similarity(
                    base_record.parameters, records[j].parameters
                )

                if similarity >= self.similarity_threshold:
                    similar_records.append(records[j])

            if len(similar_records) >= 2:
                # Check if pattern is within detection window
                recent_records = [
                    r
                    for r in similar_records
                    if datetime.now() - r.timestamp <= self.detection_window
                ]

                if len(recent_records) >= 2:
                    avg_similarity = sum(
                        self._calculate_parameter_similarity(
                            base_record.parameters, r.parameters
                        )
                        for r in recent_records
                    ) / len(recent_records)

                    pattern = RepetitionPattern(
                        pattern_type=RepetitionType.SIMILAR,
                        tool_name=base_record.tool_name,
                        occurrence_count=len(recent_records),
                        first_occurrence=min(r.timestamp for r in recent_records),
                        last_occurrence=max(r.timestamp for r in recent_records),
                        parameters_similarity=avg_similarity,
                        pattern_confidence=avg_similarity * 0.8,
                        optimization_suggestion="Consider parameterizing or using batch operations",
                    )

                    patterns.append(pattern)
                    break  # Avoid duplicate patterns

        return patterns

    async def _detect_iterative_patterns(
        self, records: List[ToolUsageRecord]
    ) -> List[RepetitionPattern]:
        """Detect iterative refinement patterns"""

        patterns = []

        # Look for sequences of calls with progressive parameter changes
        if len(records) >= 3:
            recent_records = [
                r
                for r in records
                if datetime.now() - r.timestamp <= self.detection_window
            ]

            if len(recent_records) >= 3:
                # Sort by timestamp
                recent_records.sort(key=lambda r: r.timestamp)

                # Check for iterative pattern
                is_iterative = await self._is_iterative_sequence(recent_records)

                if is_iterative:
                    pattern = RepetitionPattern(
                        pattern_type=RepetitionType.ITERATIVE,
                        tool_name=records[0].tool_name,
                        occurrence_count=len(recent_records),
                        first_occurrence=recent_records[0].timestamp,
                        last_occurrence=recent_records[-1].timestamp,
                        parameters_similarity=0.7,  # Moderate similarity expected
                        pattern_confidence=0.75,
                        optimization_suggestion="Consider progressive batch processing or smart parameter adjustment",
                    )

                    patterns.append(pattern)

        return patterns

    async def _detect_circular_patterns(
        self, records: List[ToolUsageRecord]
    ) -> List[RepetitionPattern]:
        """Detect circular dependency patterns"""

        patterns = []

        # This is a simplified implementation
        # In a real system, you'd analyze the sequence of tool calls for cycles
        if len(records) >= 4:
            recent_records = [
                r
                for r in records
                if datetime.now() - r.timestamp <= self.detection_window
            ]

            # Look for ABAB or ABCABC patterns in parameters
            if len(recent_records) >= 4:
                param_sequence = [
                    self._calculate_parameter_hash(r.parameters)
                    for r in recent_records[-6:]
                ]  # Last 6 calls

                # Check for repeating subsequences
                if len(param_sequence) >= 4:
                    mid = len(param_sequence) // 2
                    if param_sequence[:mid] == param_sequence[mid : mid * 2]:
                        pattern = RepetitionPattern(
                            pattern_type=RepetitionType.CIRCULAR,
                            tool_name=records[0].tool_name,
                            occurrence_count=len(recent_records),
                            first_occurrence=recent_records[0].timestamp,
                            last_occurrence=recent_records[-1].timestamp,
                            parameters_similarity=0.8,
                            pattern_confidence=0.85,
                            optimization_suggestion="Detected circular pattern - consider breaking the cycle",
                        )

                        patterns.append(pattern)

        return patterns

    async def _detect_cultural_loop_patterns(
        self, records: List[ToolUsageRecord]
    ) -> List[RepetitionPattern]:
        """Detect cultural validation loops"""

        patterns = []

        # Look for repeated cultural validation patterns
        cultural_records = [r for r in records if r.cultural_context]

        if len(cultural_records) >= 3:
            recent_cultural = [
                r
                for r in cultural_records
                if datetime.now() - r.timestamp <= self.detection_window
            ]

            if len(recent_cultural) >= 3:
                # Check if same cultural context is being validated repeatedly
                context_counts = defaultdict(int)
                for record in recent_cultural:
                    context_counts[record.cultural_context] += 1

                for context, count in context_counts.items():
                    if count >= 3:
                        matching_records = [
                            r for r in recent_cultural if r.cultural_context == context
                        ]

                        pattern = RepetitionPattern(
                            pattern_type=RepetitionType.CULTURAL_LOOP,
                            tool_name=records[0].tool_name,
                            occurrence_count=count,
                            first_occurrence=min(r.timestamp for r in matching_records),
                            last_occurrence=max(r.timestamp for r in matching_records),
                            parameters_similarity=0.9,
                            pattern_confidence=0.8,
                            optimization_suggestion=f"Cultural validation loop detected for {context} - consider caching validation results",
                        )

                        pattern.cultural_considerations = [
                            f"Repeated {context} validation",
                            "Consider implementing cultural validation caching",
                            "May indicate uncertain cultural validation logic",
                        ]

                        patterns.append(pattern)

        return patterns

    async def _generate_optimization_suggestions(
        self, pattern: RepetitionPattern
    ) -> List[str]:
        """Generate optimization suggestions based on pattern type"""

        suggestions = []

        if pattern.pattern_type == RepetitionType.IDENTICAL:
            suggestions.extend(
                [
                    "Implement result caching for identical parameters",
                    "Consider batching identical operations",
                    "Add memoization for expensive computations",
                ]
            )

        elif pattern.pattern_type == RepetitionType.SIMILAR:
            suggestions.extend(
                [
                    "Parameterize similar operations into single call",
                    "Use bulk operations where possible",
                    "Implement smart parameter grouping",
                ]
            )

        elif pattern.pattern_type == RepetitionType.ITERATIVE:
            suggestions.extend(
                [
                    "Implement progressive enhancement pattern",
                    "Use streaming or incremental processing",
                    "Consider async batch processing",
                ]
            )

        elif pattern.pattern_type == RepetitionType.CIRCULAR:
            suggestions.extend(
                [
                    "Break circular dependencies",
                    "Implement cycle detection and prevention",
                    "Consider alternative workflow design",
                ]
            )

        elif pattern.pattern_type == RepetitionType.CULTURAL_LOOP:
            suggestions.extend(
                [
                    "Implement cultural validation result caching",
                    "Create cultural context session state",
                    "Pre-validate cultural constraints at workflow start",
                ]
            )

        return suggestions

    async def _generate_cultural_optimization_suggestions(
        self, tool_name: str
    ) -> List[str]:
        """Generate cultural-specific optimization suggestions"""

        suggestions = []

        # Get tool records for cultural analysis
        tool_records = [r for r in self.tool_history if r.tool_name == tool_name]
        arabic_records = [r for r in tool_records if r.arabic_content_detected]

        if arabic_records:
            arabic_percentage = len(arabic_records) / len(tool_records) * 100

            if arabic_percentage > 50:
                suggestions.extend(
                    [
                        "Consider Arabic-optimized processing pipeline",
                        "Implement RTL-specific caching strategies",
                        "Pre-load Iraqi dialect patterns for better performance",
                    ]
                )

            # Check for mixed content patterns
            mixed_content_count = sum(
                1 for r in arabic_records if self._has_mixed_content(r.parameters)
            )

            if mixed_content_count > len(arabic_records) * 0.3:
                suggestions.append("Optimize mixed Arabic-English content processing")

        # Domain-specific suggestions
        domain_counts = defaultdict(int)
        for record in tool_records:
            if record.professional_domain:
                domain_counts[record.professional_domain] += 1

        if domain_counts:
            dominant_domain = max(domain_counts.items(), key=lambda x: x[1])
            if dominant_domain[1] > len(tool_records) * 0.6:
                suggestions.append(
                    f"Optimize for {dominant_domain[0]} domain-specific patterns"
                )

        return suggestions

    # Cultural analysis methods

    def _analyze_cultural_context(
        self, tool_name: str, parameters: Dict[str, Any]
    ) -> Optional[str]:
        """Analyze cultural context of tool usage"""

        # Check for cultural validation tools
        cultural_tools = {
            "cultural_validator",
            "islamic_compliance_checker",
            "political_neutrality_validator",
            "professional_etiquette_checker",
        }

        if any(cultural_tool in tool_name.lower() for cultural_tool in cultural_tools):
            return "cultural_validation"

        # Check parameters for cultural content
        param_text = json.dumps(parameters, default=str).lower()

        if any(
            term in param_text
            for term in ["islamic", "cultural", "appropriate", "compliance"]
        ):
            return "cultural_validation"
        elif any(term in param_text for term in ["professional", "formal", "business"]):
            return "professional_context"
        elif any(
            term in param_text for term in ["educational", "academic", "learning"]
        ):
            return "educational_context"

        return None

    def _detect_arabic_content(self, parameters: Dict[str, Any]) -> bool:
        """Detect if parameters contain Arabic content"""

        param_text = json.dumps(parameters, default=str)

        # Arabic Unicode range detection
        arabic_range = range(0x0600, 0x06FF + 1)

        return any(ord(char) in arabic_range for char in param_text)

    def _detect_professional_domain(
        self, tool_name: str, parameters: Dict[str, Any]
    ) -> Optional[str]:
        """Detect professional domain from tool usage"""

        param_text = json.dumps(parameters, default=str).lower()
        tool_text = tool_name.lower()

        domain_indicators = {
            "legal": ["law", "court", "legal", "lawyer", "case", "contract"],
            "medical": ["medical", "health", "doctor", "patient", "diagnosis"],
            "educational": ["education", "school", "student", "teacher", "academic"],
            "government": [
                "government",
                "ministry",
                "official",
                "public",
                "administrative",
            ],
        }

        for domain, indicators in domain_indicators.items():
            if any(
                indicator in param_text or indicator in tool_text
                for indicator in indicators
            ):
                return domain

        return None

    # Utility methods

    def _calculate_parameter_hash(self, parameters: Dict[str, Any]) -> str:
        """Calculate hash of parameters for comparison"""

        # Sort parameters for consistent hashing
        param_str = json.dumps(parameters, sort_keys=True, default=str)
        return hashlib.md5(param_str.encode()).hexdigest()

    def _calculate_result_hash(self, result: Any) -> str:
        """Calculate hash of result for comparison"""

        result_str = json.dumps(result, sort_keys=True, default=str)
        return hashlib.md5(result_str.encode()).hexdigest()

    def _calculate_parameter_similarity(
        self, params1: Dict[str, Any], params2: Dict[str, Any]
    ) -> float:
        """Calculate similarity between two parameter sets"""

        # Simple implementation - can be enhanced with semantic similarity
        keys1, keys2 = set(params1.keys()), set(params2.keys())
        common_keys = keys1.intersection(keys2)
        all_keys = keys1.union(keys2)

        if not all_keys:
            return 1.0

        key_similarity = len(common_keys) / len(all_keys)

        # Check value similarity for common keys
        value_matches = 0
        for key in common_keys:
            if params1[key] == params2[key]:
                value_matches += 1

        value_similarity = value_matches / len(common_keys) if common_keys else 0

        return (key_similarity + value_similarity) / 2

    def _generate_record_id(self, record: ToolUsageRecord) -> str:
        """Generate unique ID for a usage record"""

        id_data = f"{record.tool_name}_{record.timestamp.isoformat()}_{id(record)}"
        return hashlib.md5(id_data.encode()).hexdigest()[:8]

    async def _is_iterative_sequence(self, records: List[ToolUsageRecord]) -> bool:
        """Check if records represent an iterative refinement sequence"""

        if len(records) < 3:
            return False

        # Simple heuristic: check if parameters are progressively changing
        # In a real implementation, this would be more sophisticated

        similarities = []
        for i in range(len(records) - 1):
            similarity = self._calculate_parameter_similarity(
                records[i].parameters, records[i + 1].parameters
            )
            similarities.append(similarity)

        # If similarities are moderate (indicating changes but not complete differences)
        avg_similarity = sum(similarities) / len(similarities)
        return 0.5 <= avg_similarity <= 0.8

    def _has_mixed_content(self, parameters: Dict[str, Any]) -> bool:
        """Check if parameters contain mixed Arabic-English content"""

        param_text = json.dumps(parameters, default=str)

        # Check for both Arabic and Latin characters
        has_arabic = any(0x0600 <= ord(char) <= 0x06FF for char in param_text)
        has_latin = any(char.isascii() and char.isalpha() for char in param_text)

        return has_arabic and has_latin

    async def _analyze_cultural_implications(
        self, tool_name: str, records: List[ToolUsageRecord]
    ) -> List[str]:
        """Analyze cultural implications of repetition patterns"""

        implications = []

        # Check for cultural validation patterns
        if any(
            "cultural" in tool_name.lower() or "validation" in tool_name.lower()
            for record in records
        ):
            implications.append("Repeated cultural validation may indicate uncertainty")

        # Check for Arabic content processing
        arabic_records = [r for r in records if r.arabic_content_detected]
        if arabic_records:
            implications.append("Arabic content processing optimization opportunity")

        # Check for professional domain patterns
        domains = set(r.professional_domain for r in records if r.professional_domain)
        if len(domains) == 1:
            domain = domains.pop()
            implications.append(
                f"Domain-specific optimization opportunity for {domain}"
            )

        return implications

    def _initialize_optimization_patterns(self):
        """Initialize common optimization patterns"""

        self.arabic_processing_optimizations = {
            "rtl_formatting": "Cache RTL formatting results for identical text",
            "dialect_detection": "Batch dialect detection for multiple texts",
            "mixed_content": "Pre-process mixed content for better performance",
        }

        self.cultural_validation_chains = {
            "islamic_compliance": [
                "content_analysis",
                "cultural_check",
                "final_validation",
            ],
            "professional_etiquette": [
                "domain_check",
                "formality_analysis",
                "appropriateness_validation",
            ],
            "political_neutrality": [
                "content_scan",
                "bias_detection",
                "neutrality_confirmation",
            ],
        }

    # Cultural analyzer implementations (simplified)

    async def _analyze_islamic_compliance_pattern(
        self, records: List[ToolUsageRecord]
    ) -> Dict[str, Any]:
        """Analyze Islamic compliance validation patterns"""
        return {
            "pattern": "islamic_compliance",
            "optimization": "cache_validation_results",
        }

    async def _analyze_political_neutrality_pattern(
        self, records: List[ToolUsageRecord]
    ) -> Dict[str, Any]:
        """Analyze political neutrality validation patterns"""
        return {
            "pattern": "political_neutrality",
            "optimization": "batch_content_analysis",
        }

    async def _analyze_professional_etiquette_pattern(
        self, records: List[ToolUsageRecord]
    ) -> Dict[str, Any]:
        """Analyze professional etiquette validation patterns"""
        return {
            "pattern": "professional_etiquette",
            "optimization": "domain_specific_cache",
        }

    async def _analyze_gender_sensitivity_pattern(
        self, records: List[ToolUsageRecord]
    ) -> Dict[str, Any]:
        """Analyze gender sensitivity validation patterns"""
        return {
            "pattern": "gender_sensitivity",
            "optimization": "context_aware_validation",
        }

    # Domain pattern detectors (simplified implementations)

    async def _detect_legal_domain_patterns(
        self, records: List[ToolUsageRecord]
    ) -> Dict[str, Any]:
        """Detect legal domain-specific patterns"""
        return {"domain": "legal", "patterns": ["contract_analysis", "case_law_lookup"]}

    async def _detect_medical_domain_patterns(
        self, records: List[ToolUsageRecord]
    ) -> Dict[str, Any]:
        """Detect medical domain-specific patterns"""
        return {
            "domain": "medical",
            "patterns": ["diagnosis_support", "medical_terminology"],
        }

    async def _detect_educational_domain_patterns(
        self, records: List[ToolUsageRecord]
    ) -> Dict[str, Any]:
        """Detect educational domain-specific patterns"""
        return {
            "domain": "educational",
            "patterns": ["curriculum_analysis", "learning_assessment"],
        }

    async def _detect_government_domain_patterns(
        self, records: List[ToolUsageRecord]
    ) -> Dict[str, Any]:
        """Detect government domain-specific patterns"""
        return {
            "domain": "government",
            "patterns": ["policy_analysis", "regulatory_compliance"],
        }

    # Arabic processing optimizers (simplified implementations)

    async def _optimize_rtl_formatting_calls(
        self, records: List[ToolUsageRecord]
    ) -> Dict[str, Any]:
        """Optimize RTL formatting tool calls"""
        return {"optimization": "rtl_cache", "savings_potential": "40%"}

    async def _optimize_dialect_detection_calls(
        self, records: List[ToolUsageRecord]
    ) -> Dict[str, Any]:
        """Optimize dialect detection tool calls"""
        return {"optimization": "dialect_batch_processing", "savings_potential": "60%"}

    async def _optimize_mixed_content_processing(
        self, records: List[ToolUsageRecord]
    ) -> Dict[str, Any]:
        """Optimize mixed content processing calls"""
        return {"optimization": "mixed_content_pipeline", "savings_potential": "35%"}


# Example usage
async def main():
    """Example usage of Iraqi Tool Repetition Detector"""

    detector = IraqiToolRepetitionDetector(
        detection_window_minutes=15, similarity_threshold=0.8, max_history_size=500
    )

    # Simulate tool usage
    detector.record_tool_usage(
        "cultural_validator",
        {"content": "مرحبا بكم في النظام", "domain": "legal"},
        execution_time_ms=150.0,
        success=True,
    )

    detector.record_tool_usage(
        "cultural_validator",
        {"content": "أهلا وسهلا بكم", "domain": "legal"},
        execution_time_ms=145.0,
        success=True,
    )

    detector.record_tool_usage(
        "cultural_validator",
        {"content": "مرحبا بكم في النظام", "domain": "legal"},
        execution_time_ms=148.0,
        success=True,
    )

    # Detect patterns
    patterns = await detector.detect_repetition_patterns()
    print(f"Detected {len(patterns)} patterns")

    for pattern in patterns:
        print(f"Pattern: {pattern.pattern_type.value} for {pattern.tool_name}")
        print(f"Confidence: {pattern.pattern_confidence:.2f}")
        print(f"Suggestion: {pattern.optimization_suggestion}")

    # Get optimization suggestions
    suggestions = await detector.get_optimization_suggestions()
    print(f"\nOptimization suggestions: {suggestions}")

    # Get statistics
    stats = detector.get_usage_statistics()
    print(f"\nUsage statistics: {stats}")


if __name__ == "__main__":
    asyncio.run(main())
