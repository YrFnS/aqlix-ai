#!/usr/bin/env python3
"""
Iraqi AI Chat System - Basic Agent Example
Demonstrates how to create and use an Iraqi AI agent with cultural intelligence
"""

import asyncio
import json
from typing import Dict, Any
from datetime import datetime

# Import our core Iraqi agent system
from apps.agents.core import (
    create_iraqi_agent,
    IraqiAgentInput,
    IraqiCulturalContext,
    ProfessionalDomain,
    IraqiCulturalMode,
    IslamicComplianceLevel,
    settings,
)


async def basic_iraqi_agent_example():
    """
    Basic example of creating and using an Iraqi AI agent
    """
    print("🇮🇶 Iraqi AI Chat System - Basic Agent Example")
    print("=" * 60)

    try:
        # Create an Iraqi AI agent
        print("Creating Iraqi AI agent...")
        agent = await create_iraqi_agent(
            name="iraqi-cultural-assistant",
            system_prompt="""
            أنت مساعد ذكي عراقي متخصص في الثقافة والتقاليد العراقية.
            You are an Iraqi AI assistant specializing in Iraqi culture and traditions.
            
            CULTURAL REQUIREMENTS:
            - Maintain 95%+ cultural appropriateness
            - Ensure 100% Islamic compliance  
            - Support both Iraqi Arabic dialect and Modern Standard Arabic
            - Respect family values and community traditions
            - Provide culturally-sensitive guidance
            
            Always greet with appropriate Islamic greetings and maintain respectful tone.
            """,
        )

        print(f"✅ Agent created successfully: {agent.name} (ID: {agent.agent_id})")

        # Test 1: Basic Arabic greeting
        print("\n📝 Test 1: Basic Arabic Greeting")
        print("-" * 40)

        cultural_context = IraqiCulturalContext(
            user_cultural_background="iraqi",
            primary_language="arabic",
            dialect="iraqi_arabic",
            islamic_compliance_required=True,
            regional_context="baghdad",
            prayer_time_awareness=True,
        )

        input_msg = IraqiAgentInput(
            message="السلام عليكم، شلونك؟ أريد معلومات عن التقاليد العراقية",
            cultural_context=cultural_context,
            require_validation=True,
        )

        result = await agent.process_message(input_msg)

        print(f"Input: {input_msg.message}")
        print(f"Response: {result.response}")
        print(f"Status: {result.cultural_validation.validation_passed}")
        print(
            f"Cultural Score: {result.cultural_validation.cultural_appropriateness:.3f}"
        )
        print(
            f"Islamic Compliance: {result.cultural_validation.islamic_compliance:.3f}"
        )
        print(f"Processing Time: {result.processing_time:.3f}s")
        print(f"Model Used: {result.model_used}")

        # Test 2: Professional domain query
        print("\n📝 Test 2: Professional Domain Query (Legal)")
        print("-" * 40)

        legal_context = IraqiCulturalContext(
            user_cultural_background="iraqi",
            primary_language="mixed",
            professional_domain=ProfessionalDomain.LEGAL,
            islamic_compliance_required=True,
            cultural_sensitivity_level="high",
        )

        legal_input = IraqiAgentInput(
            message="What are the key principles of Iraqi civil law regarding family disputes? Please provide guidance in both Arabic and English.",
            cultural_context=legal_context,
            require_validation=True,
        )

        legal_result = await agent.process_message(legal_input)

        print(f"Input: {legal_input.message}")
        print(f"Response: {legal_result.response}")
        print(
            f"Professional Relevance: {legal_result.cultural_validation.professional_relevance:.3f}"
        )
        print(
            f"Text Direction: {legal_result.metadata.get('text_direction', 'unknown')}"
        )

        # Test 3: Mixed language with cultural validation
        print("\n📝 Test 3: Mixed Language Cultural Validation")
        print("-" * 40)

        mixed_input = IraqiAgentInput(
            message="I want to organize an Iraqi wedding celebration. ما هي التقاليد المهمة؟ What Islamic guidelines should I follow?",
            cultural_context=cultural_context,
            require_validation=True,
        )

        mixed_result = await agent.process_message(mixed_input)

        print(f"Input: {mixed_input.message}")
        print(f"Response: {mixed_result.response}")
        print(f"Contains Arabic: {getattr(mixed_result, 'contains_arabic', 'unknown')}")
        print(f"Validation Issues: {len(mixed_result.cultural_validation.issues)}")
        if mixed_result.cultural_validation.issues:
            for issue in mixed_result.cultural_validation.issues:
                print(f"  - {issue}")

        # Display agent performance stats
        print("\n📊 Agent Performance Statistics")
        print("-" * 40)

        stats = agent.get_stats()
        print(f"Request Count: {stats['request_count']}")
        print(f"Average Processing Time: {stats['avg_processing_time']}s")
        print(f"Validation Failures: {stats['validation_failures']}")
        print(f"Failure Rate: {stats['failure_rate']:.2%}")

        # Display model performance
        if stats.get("model_stats"):
            print("\n🤖 Model Performance")
            print("-" * 40)
            for model_name, model_stats in stats["model_stats"].items():
                print(f"{model_name}:")
                print(f"  Cultural Accuracy: {model_stats['cultural_accuracy']}")
                print(f"  Islamic Compliance: {model_stats['islamic_compliance']}")
                print(f"  Success Rate: {model_stats['success_rate']}")
                print(f"  Overall Score: {model_stats['overall_score']}")

        print("\n✅ Basic Iraqi Agent Example completed successfully!")

    except Exception as e:
        print(f"\n❌ Error in basic agent example: {e}")
        import traceback

        traceback.print_exc()


async def tool_integration_example():
    """
    Example of using Iraqi AI tools with cultural intelligence
    """
    print("\n🛠️ Iraqi AI Tools Integration Example")
    print("=" * 60)

    try:
        from apps.agents.core.tools import (
            validate_cultural_content,
            process_arabic_text,
            check_prayer_times,
            validate_payment_request,
            IraqiToolContext,
        )

        # Create tool context
        context = IraqiToolContext(
            user_id="user123",
            cultural_background="iraqi",
            primary_language="arabic",
            professional_domain="business",
            islamic_compliance_required=True,
        )

        # Test 1: Cultural content validation
        print("\n🔍 Test 1: Cultural Content Validation")
        print("-" * 40)

        test_content = "السلام عليكم، أهلاً وسهلاً بكم في شركتنا. نحن نقدر التقاليد العراقية والقيم الإسلامية في عملنا."
        validation_result = await validate_cultural_content(test_content, context)

        print(f"Content: {test_content}")
        print(f"Validation Passed: {validation_result.success}")
        print(f"Cultural Score: {validation_result.cultural_validation_score:.3f}")
        print(f"Islamic Score: {validation_result.islamic_compliance_score:.3f}")
        print(f"Processing Time: {validation_result.processing_time:.3f}s")

        if validation_result.data and "recommendations" in validation_result.data:
            print("Recommendations:")
            for rec in validation_result.data["recommendations"]:
                print(f"  - {rec}")

        # Test 2: Arabic text processing
        print("\n📝 Test 2: Arabic Text Processing")
        print("-" * 40)

        arabic_text = "شلونكم؟ شكو ماكو اليوم؟ وين رايحين؟"
        arabic_result = await process_arabic_text(arabic_text, "analyze", context)

        print(f"Arabic Text: {arabic_text}")
        print(f"Processing Success: {arabic_result.success}")
        print(f"Text Direction: {arabic_result.data.get('text_direction')}")
        print(f"Language Detected: {arabic_result.data.get('language_detected')}")
        print(
            f"Dialect Confidence: {arabic_result.data.get('dialect_confidence', 0):.3f}"
        )

        if arabic_result.data.get("dialect_indicators"):
            print("Iraqi Dialect Indicators Found:")
            for indicator in arabic_result.data["dialect_indicators"]:
                print(f"  - {indicator['phrase']}: {indicator['meaning']}")

        # Test 3: Prayer times check
        print("\n🕌 Test 3: Prayer Times Check")
        print("-" * 40)

        prayer_result = await check_prayer_times("Baghdad", context=context)

        print(f"Location: {prayer_result.data.get('location')}")
        print(f"Date: {prayer_result.data.get('date')}")

        if prayer_result.data.get("prayers"):
            print("Prayer Times:")
            prayers = prayer_result.data["prayers"]
            for prayer_name, time in prayers.items():
                print(f"  {prayer_name.capitalize()}: {time}")

        print(f"Next Prayer: {prayer_result.data.get('next_prayer')}")
        print(f"Is Prayer Time: {prayer_result.data.get('is_prayer_time')}")

        # Test 4: Payment validation
        print("\n💳 Test 4: Payment Gateway Validation")
        print("-" * 40)

        payment_result = await validate_payment_request(
            amount=5000.0, currency="IQD", gateway="zaincash", context=context
        )

        print(f"Payment Valid: {payment_result.success}")
        print(
            f"Amount: {payment_result.data.get('amount')} {payment_result.data.get('currency')}"
        )
        print(f"Gateway: {payment_result.data.get('gateway')}")
        print(f"Islamic Compliant: {payment_result.data.get('islamic_compliant')}")
        print(f"Estimated Fee: {payment_result.data.get('estimated_fee')}")
        print(f"Processing Time: {payment_result.data.get('processing_time_estimate')}")

        if payment_result.warnings:
            print("Warnings:")
            for warning in payment_result.warnings:
                print(f"  - {warning}")

        print("\n✅ Tool Integration Example completed successfully!")

    except Exception as e:
        print(f"\n❌ Error in tool integration example: {e}")
        import traceback

        traceback.print_exc()


async def cultural_compliance_example():
    """
    Example demonstrating cultural compliance validation in various scenarios
    """
    print("\n🎯 Cultural Compliance Validation Example")
    print("=" * 60)

    try:
        # Create agent with strict cultural mode
        agent = await create_iraqi_agent(
            name="strict-cultural-validator",
            system_prompt="You are an Iraqi cultural compliance validator with strict Islamic principles.",
        )

        # Test scenarios with different compliance levels
        test_scenarios = [
            {
                "name": "High Compliance Content",
                "message": "بسم الله الرحمن الرحيم، أسعد الله أوقاتكم. أريد معلومات عن التقاليد العراقية والقيم الإسلامية في المجتمع.",
                "expected_compliance": "high",
            },
            {
                "name": "Medium Compliance Content",
                "message": "Hello, I would like to learn about Iraqi business customs and professional etiquette.",
                "expected_compliance": "medium",
            },
            {
                "name": "Mixed Content",
                "message": "مرحبا، Can you help me understand both traditional and modern aspects of Iraqi culture?",
                "expected_compliance": "medium",
            },
        ]

        for i, scenario in enumerate(test_scenarios, 1):
            print(f"\n📋 Scenario {i}: {scenario['name']}")
            print("-" * 50)

            cultural_context = IraqiCulturalContext(
                user_cultural_background="iraqi",
                primary_language="mixed",
                islamic_compliance_required=True,
                cultural_sensitivity_level="high",
            )

            input_data = IraqiAgentInput(
                message=scenario["message"],
                cultural_context=cultural_context,
                require_validation=True,
            )

            result = await agent.process_message(input_data)

            print(f"Message: {scenario['message']}")
            print(f"Expected: {scenario['expected_compliance']} compliance")
            print(f"Actual Scores:")
            print(
                f"  Cultural Appropriateness: {result.cultural_validation.cultural_appropriateness:.3f}"
            )
            print(
                f"  Islamic Compliance: {result.cultural_validation.islamic_compliance:.3f}"
            )
            print(
                f"  Arabic Accuracy: {result.cultural_validation.arabic_accuracy:.3f}"
            )
            print(f"Validation Passed: {result.cultural_validation.validation_passed}")
            print(f"Confidence: {result.confidence:.3f}")

            if result.cultural_validation.issues:
                print("Issues Found:")
                for issue in result.cultural_validation.issues:
                    print(f"  ⚠️  {issue}")

            if result.cultural_validation.recommendations:
                print("Recommendations:")
                for rec in result.cultural_validation.recommendations:
                    print(f"  💡 {rec}")

        print("\n✅ Cultural Compliance Example completed successfully!")

    except Exception as e:
        print(f"\n❌ Error in cultural compliance example: {e}")
        import traceback

        traceback.print_exc()


async def main():
    """
    Main function to run all Iraqi AI agent examples
    """
    print("🇮🇶 Starting Iraqi AI Agent Examples")
    print("Current settings:")
    print(f"  Cultural Mode: {settings.cultural_mode}")
    print(f"  Islamic Compliance Level: {settings.islamic_compliance_level}")
    print(f"  Arabic Processing Mode: {settings.arabic_processing_mode}")
    print(f"  Min Cultural Appropriateness: {settings.min_cultural_appropriateness}")
    print(f"  Min Islamic Compliance: {settings.min_islamic_compliance}")
    print(f"  Enabled Domains: {', '.join(settings.enabled_domains)}")

    # Run all examples
    await basic_iraqi_agent_example()
    await tool_integration_example()
    await cultural_compliance_example()

    print("\n🎉 All Iraqi AI Agent Examples completed!")
    print("Thank you for testing the Iraqi AI Chat System! 🇮🇶")


if __name__ == "__main__":
    # Run the examples
    asyncio.run(main())
