"""
Enhanced schema optimizer with Iraqi AI integration.
Extracted from browser-use with cultural validation and Arabic text support.
"""

import json
from typing import Any, Dict, Type, get_type_hints
from pydantic import BaseModel


class SchemaOptimizer:
    """
    Enhanced schema optimizer for Iraqi AI integration.

    Optimizes JSON schemas for LLM consumption while supporting
    Arabic text fields, cultural validation metadata, and Islamic compliance markers.
    """

    @staticmethod
    def create_optimized_json_schema(model_class: Type[BaseModel]) -> Dict[str, Any]:
        """
        Create optimized JSON schema for LLM consumption.

        Enhanced to handle Iraqi AI specific field types including:
        - Arabic text fields with RTL direction
        - Cultural validation scores
        - Islamic compliance markers
        - Professional domain metadata

        Args:
            model_class: Pydantic model class to create schema for

        Returns:
            Optimized JSON schema dictionary
        """
        # Get base schema from Pydantic
        base_schema = model_class.model_json_schema()

        # Apply Iraqi AI optimizations
        optimized_schema = SchemaOptimizer._optimize_schema_structure(base_schema)
        optimized_schema = SchemaOptimizer._add_iraqi_ai_enhancements(
            optimized_schema, model_class
        )
        optimized_schema = SchemaOptimizer._optimize_for_llm_consumption(
            optimized_schema
        )

        return optimized_schema

    @staticmethod
    def _optimize_schema_structure(schema: Dict[str, Any]) -> Dict[str, Any]:
        """
        Optimize basic schema structure for better LLM understanding.

        Args:
            schema: Base JSON schema

        Returns:
            Optimized schema structure
        """
        optimized = schema.copy()

        # Ensure required fields are clearly marked
        if "properties" in optimized:
            for prop_name, prop_schema in optimized["properties"].items():
                # Add helpful descriptions for better LLM understanding
                if "description" not in prop_schema:
                    prop_schema["description"] = (
                        SchemaOptimizer._generate_field_description(prop_name)
                    )

                # Optimize string fields for Arabic content
                if prop_schema.get("type") == "string":
                    prop_schema = SchemaOptimizer._optimize_string_field(
                        prop_name, prop_schema
                    )

                optimized["properties"][prop_name] = prop_schema

        return optimized

    @staticmethod
    def _add_iraqi_ai_enhancements(
        schema: Dict[str, Any], model_class: Type[BaseModel]
    ) -> Dict[str, Any]:
        """
        Add Iraqi AI specific schema enhancements.

        Args:
            schema: Base schema
            model_class: Model class for type inspection

        Returns:
            Enhanced schema with Iraqi AI metadata
        """
        enhanced = schema.copy()

        # Add Iraqi AI metadata to schema
        enhanced["$iraqi_ai"] = {
            "cultural_validation_enabled": True,
            "arabic_rtl_support": True,
            "islamic_compliance_required": True,
            "professional_domains": ["legal", "medical", "educational"],
            "supported_languages": ["ar", "ar-iq", "en"],
            "schema_version": "1.0",
        }

        # Analyze field types for Iraqi AI enhancements
        type_hints = get_type_hints(model_class)

        if "properties" in enhanced:
            for field_name, field_schema in enhanced["properties"].items():
                # Add Iraqi AI field enhancements
                field_schema = SchemaOptimizer._enhance_field_for_iraqi_ai(
                    field_name, field_schema, type_hints.get(field_name)
                )
                enhanced["properties"][field_name] = field_schema

        return enhanced

    @staticmethod
    def _optimize_for_llm_consumption(schema: Dict[str, Any]) -> Dict[str, Any]:
        """
        Final optimization for LLM consumption.

        Args:
            schema: Enhanced schema

        Returns:
            LLM-optimized schema
        """
        optimized = schema.copy()

        # Add LLM-friendly instructions
        optimized["$llm_instructions"] = {
            "arabic_text_handling": "When generating Arabic text, ensure proper RTL direction and Iraqi dialect consideration",
            "cultural_validation": "All generated content must be culturally appropriate for Iraqi context",
            "islamic_compliance": "Content must comply with Islamic principles and values",
            "professional_accuracy": "Professional domain content must be accurate and appropriate for Iraqi standards",
        }

        # Optimize field ordering for better LLM processing
        if "properties" in optimized:
            # Reorder properties to prioritize Iraqi AI fields
            reordered_props = {}
            iraqi_fields = []
            regular_fields = []

            for field_name, field_schema in optimized["properties"].items():
                if SchemaOptimizer._is_iraqi_ai_field(field_name, field_schema):
                    iraqi_fields.append((field_name, field_schema))
                else:
                    regular_fields.append((field_name, field_schema))

            # Iraqi AI fields first, then regular fields
            for field_name, field_schema in iraqi_fields + regular_fields:
                reordered_props[field_name] = field_schema

            optimized["properties"] = reordered_props

        return optimized

    @staticmethod
    def _generate_field_description(field_name: str) -> str:
        """
        Generate helpful field description based on field name.

        Args:
            field_name: Name of the field

        Returns:
            Generated description
        """
        # Iraqi AI specific field descriptions
        iraqi_descriptions = {
            "cultural_validation_score": "Cultural appropriateness score for Iraqi context (0.0-1.0)",
            "islamic_compliance": "Whether content complies with Islamic principles",
            "arabic_content_detected": "Whether Arabic text was detected in content",
            "iraqi_dialect_confidence": "Confidence level for Iraqi dialect detection (0.0-1.0)",
            "rtl_direction": "Whether text should be rendered right-to-left",
            "professional_domain": "Professional domain classification (legal, medical, educational)",
            "cultural_appropriateness": "Cultural appropriateness assessment for Iraqi context",
            "political_neutrality": "Political neutrality score to avoid sectarian content",
        }

        if field_name in iraqi_descriptions:
            return iraqi_descriptions[field_name]

        # Generate generic description
        formatted_name = field_name.replace("_", " ").title()
        return f"{formatted_name} field"

    @staticmethod
    def _optimize_string_field(
        field_name: str, field_schema: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Optimize string field for Arabic content and cultural validation.

        Args:
            field_name: Name of the string field
            field_schema: Current field schema

        Returns:
            Optimized string field schema
        """
        optimized = field_schema.copy()

        # Add Arabic text handling hints
        arabic_field_indicators = [
            "arabic",
            "text",
            "content",
            "message",
            "description",
            "title",
        ]
        if any(
            indicator in field_name.lower() for indicator in arabic_field_indicators
        ):
            optimized["$arabic_support"] = {
                "rtl_direction_support": True,
                "iraqi_dialect_recognition": True,
                "cultural_validation_required": True,
            }

        # Add format validation for Iraqi-specific fields
        if "phone" in field_name.lower():
            optimized["pattern"] = r"^\+964[0-9]{10}$"
            optimized["description"] += " (Iraqi phone number format: +964XXXXXXXXXX)"

        elif "email" in field_name.lower():
            optimized["format"] = "email"
            optimized["description"] += " (Standard email format)"

        elif "url" in field_name.lower():
            optimized["format"] = "uri"
            optimized["description"] += " (Valid URL format)"

        return optimized

    @staticmethod
    def _enhance_field_for_iraqi_ai(
        field_name: str, field_schema: Dict[str, Any], field_type: Any
    ) -> Dict[str, Any]:
        """
        Add Iraqi AI enhancements to individual field.

        Args:
            field_name: Field name
            field_schema: Current field schema
            field_type: Python type hint for the field

        Returns:
            Enhanced field schema
        """
        enhanced = field_schema.copy()

        # Add Iraqi AI validation metadata
        enhanced["$iraqi_validation"] = {
            "cultural_check_required": SchemaOptimizer._requires_cultural_validation(
                field_name
            ),
            "arabic_processing_needed": SchemaOptimizer._needs_arabic_processing(
                field_name
            ),
            "islamic_compliance_check": SchemaOptimizer._requires_islamic_compliance(
                field_name
            ),
        }

        # Add professional domain hints
        if SchemaOptimizer._is_professional_field(field_name):
            enhanced["$professional_domain"] = {
                "legal_relevance": "legal" in field_name.lower(),
                "medical_relevance": "medical" in field_name.lower()
                or "health" in field_name.lower(),
                "educational_relevance": "education" in field_name.lower()
                or "academic" in field_name.lower(),
            }

        return enhanced

    @staticmethod
    def _is_iraqi_ai_field(field_name: str, field_schema: Dict[str, Any]) -> bool:
        """Check if field is Iraqi AI specific."""
        iraqi_field_names = [
            "cultural_validation_score",
            "islamic_compliance",
            "arabic_content_detected",
            "iraqi_dialect_confidence",
            "political_neutrality_score",
            "professional_domain",
        ]

        return field_name in iraqi_field_names or "$iraqi_validation" in field_schema

    @staticmethod
    def _requires_cultural_validation(field_name: str) -> bool:
        """Check if field requires cultural validation."""
        validation_required_fields = [
            "content",
            "message",
            "text",
            "description",
            "comment",
            "title",
            "subject",
        ]
        return any(
            keyword in field_name.lower() for keyword in validation_required_fields
        )

    @staticmethod
    def _needs_arabic_processing(field_name: str) -> bool:
        """Check if field needs Arabic text processing."""
        arabic_processing_fields = [
            "text",
            "content",
            "message",
            "title",
            "description",
            "name",
            "subject",
        ]
        return any(
            keyword in field_name.lower() for keyword in arabic_processing_fields
        )

    @staticmethod
    def _requires_islamic_compliance(field_name: str) -> bool:
        """Check if field requires Islamic compliance checking."""
        compliance_required_fields = [
            "content",
            "message",
            "description",
            "instruction",
            "advice",
            "recommendation",
        ]
        return any(
            keyword in field_name.lower() for keyword in compliance_required_fields
        )

    @staticmethod
    def _is_professional_field(field_name: str) -> bool:
        """Check if field relates to professional domains."""
        professional_keywords = [
            "legal",
            "medical",
            "health",
            "education",
            "academic",
            "government",
            "ministry",
            "department",
            "official",
            "professional",
            "clinical",
        ]
        return any(keyword in field_name.lower() for keyword in professional_keywords)
