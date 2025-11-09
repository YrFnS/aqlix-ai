"""
Test script for Cultural & Islamic Compliance System
Tests the complete validation pipeline with real content examples

This test validates:
1. Core validation service (IraqiCulturalValidator)
2. Arabic language processing (Iraqi dialect detection)
3. Domain validators (Islamic, Cultural, etc.)
4. Performance targets (<200ms response time)
5. Scoring thresholds (70% overall, 80% Islamic)

Usage:
    python apps/api/test_cultural_validation.py
"""

import asyncio
import time
from services.cultural_islamic_compliance import (
    IraqiCulturalValidator,
    CulturalValidationConfig,
    CulturalDomain,
    ValidationSeverity,
)

# Test thresholds and constants
MINIMUM_OVERALL_SCORE = 0.70
MINIMUM_ISLAMIC_SCORE = 0.80
MAX_RESPONSE_TIME_MS = 200
BLOCKED_THRESHOLD = 0.01  # For floating point comparisons


async def test_compliant_content():
    """Test 1: Validate culturally and Islamically compliant content"""
    try:
        print("\n" + "=" * 80)
        print("TEST 1: Compliant Content Validation")
        print("=" * 80)

        config = CulturalValidationConfig(
            minimum_overall_score=MINIMUM_OVERALL_SCORE,
            minimum_islamic_score=MINIMUM_ISLAMIC_SCORE,
        )
        validator = IraqiCulturalValidator(config)

        # Test content with Arabic, Islamic values, and positive keywords
        content = """
    السلام عليكم ورحمة الله وبركاته

    Welcome to our Iraqi professional services platform. We provide comprehensive
    support for families, education, and community welfare with full respect for
    Islamic values and Iraqi cultural traditions.

    Our services include:
    - Family support and care programs
    - Educational resources for knowledge seekers
    - Community welfare initiatives
    - Justice and fairness advocacy
    - Health and wellness guidance

    شكراً لاستخدامكم خدماتنا. نحن نقدر احترامكم وتقديركم.
    """

        start_time = time.time()
        result = await validator.validate_content(content)
        elapsed_ms = (time.time() - start_time) * 1000

        print(f"\n✅ VALIDATION RESULTS:")
        print(f"   Overall Score: {result.overall_score:.2%}")
        print(f"   Cultural Score: {result.cultural_score:.2%}")
        print(f"   Islamic Score: {result.islamic_compliance_score:.2%}")
        print(f"   Is Compliant: {result.is_compliant}")
        print(f"   Response Time: {elapsed_ms:.2f}ms")

        print(f"\n📊 DOMAIN SCORES:")
        for domain, score in result.domain_scores.items():
            print(f"   {domain.value}: {score:.2%}")

        if result.issues:
            print(f"\n⚠️  ISSUES ({len(result.issues)}):")
            for issue in result.issues:
                print(f"   [{issue.severity.value.upper()}] {issue.message}")

        if result.recommendations:
            print(f"\n💡 RECOMMENDATIONS:")
            for rec in result.recommendations:
                print(f"   • {rec}")

        # Performance check
        performance_ok = elapsed_ms < MAX_RESPONSE_TIME_MS
        compliance_ok = result.is_compliant and result.islamic_compliance_score >= MINIMUM_ISLAMIC_SCORE

        print(
            f"\n✅ TEST 1 RESULT: {'PASSED' if performance_ok and compliance_ok else 'FAILED'}"
        )
        if not performance_ok:
            print(f"   ⚠️  Performance issue: {elapsed_ms:.2f}ms > {MAX_RESPONSE_TIME_MS}ms target")
        if not compliance_ok:
            print(
                f"   ⚠️  Compliance issue: {result.islamic_compliance_score:.2%} < {MINIMUM_ISLAMIC_SCORE:.0%} target"
            )

        return performance_ok and compliance_ok

    except Exception as e:
        print(f"\n❌ TEST 1 FAILED with exception: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


async def test_haram_content_blocking():
    """Test 2: Validate that haram content is blocked"""
    try:
        print("\n" + "=" * 80)
        print("TEST 2: Haram Content Blocking (Islamic Compliance)")
        print("=" * 80)

        config = CulturalValidationConfig()
        validator = IraqiCulturalValidator(config)

        # Test content with haram keywords (should be blocked)
        haram_content = """
    Visit our new casino for exciting gambling opportunities!

    We offer:
    - Slot machines and lottery games
    - Alcohol bar with wine and beer
    - Interest-based loans with competitive rates

    Join now for special betting promotions!
    """

        start_time = time.time()
        result = await validator.validate_content(haram_content)
        elapsed_ms = (time.time() - start_time) * 1000

        print(f"\n🚫 VALIDATION RESULTS:")
        print(f"   Overall Score: {result.overall_score:.2%}")
        print(f"   Cultural Score: {result.cultural_score:.2%}")
        print(f"   Islamic Score: {result.islamic_compliance_score:.2%}")
        print(f"   Is Compliant: {result.is_compliant}")
        print(f"   Response Time: {elapsed_ms:.2f}ms")

        if result.issues:
            print(f"\n⚠️  ISSUES ({len(result.issues)}):")
            for issue in result.issues[:5]:  # Show first 5
                print(f"   [{issue.severity.value.upper()}] {issue.message}")

        # Validation checks (use threshold for floating point comparison)
        blocked_correctly = (
            result.islamic_compliance_score <= BLOCKED_THRESHOLD and not result.is_compliant
        )

        print(f"\n✅ TEST 2 RESULT: {'PASSED' if blocked_correctly else 'FAILED'}")
        if not blocked_correctly:
            print(f"   ⚠️  Haram content was NOT blocked properly!")
            print(f"   Expected: islamic_score=0.0, is_compliant=False")
            print(
                f"   Got: islamic_score={result.islamic_compliance_score:.2%}, is_compliant={result.is_compliant}"
            )

        return blocked_correctly

    except Exception as e:
        print(f"\n❌ TEST 2 FAILED with exception: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


async def test_arabic_dialect_detection():
    """Test 3: Test Iraqi dialect detection"""
    try:
        print("\n" + "=" * 80)
        print("TEST 3: Iraqi Dialect Detection")
        print("=" * 80)

        config = CulturalValidationConfig()
        validator = IraqiCulturalValidator(config)

        test_cases = [
            ("شلونك؟ شكو ماكو؟ اني بخير", "baghdad", "Baghdad dialect"),
            ("شلونكم؟ شكو الحال؟", "basra", "Basra dialect"),
            ("كيفك؟ شنو الأخبار؟", "mosul", "Mosul dialect"),
            ("چونی؟ چی هەیە؟", "erbil", "Erbil dialect (Kurdish-Iraqi)"),
        ]

        passed_tests = 0
        for content, expected_dialect, description in test_cases:
            arabic_analysis = await validator.arabic_processor.analyze_text(content)

            detected = arabic_analysis.dialect_detected
            markers = arabic_analysis.iraqi_markers_found

            print(f"\n   {description}:")
            print(f"   Content: {content}")
            print(f"   Detected: {detected}")
            print(f"   Markers: {markers}")
            print(f"   Arabic %: {arabic_analysis.arabic_percentage:.1%}")

            if detected == expected_dialect or detected == "iraqi":
                print(f"   ✅ PASSED")
                passed_tests += 1
            else:
                print(f"   ❌ FAILED (expected {expected_dialect}, got {detected})")

        all_passed = passed_tests == len(test_cases)
        print(
            f"\n✅ TEST 3 RESULT: {'PASSED' if all_passed else 'FAILED'} ({passed_tests}/{len(test_cases)})"
        )

        return all_passed

    except Exception as e:
        print(f"\n❌ TEST 3 FAILED with exception: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


async def test_performance_benchmark():
    """Test 4: Performance benchmark with 10 validations"""
    try:
        print("\n" + "=" * 80)
        print("TEST 4: Performance Benchmark (10 validations)")
        print("=" * 80)

        config = CulturalValidationConfig()
        validator = IraqiCulturalValidator(config)

    test_content = """
    السلام عليكم. We provide professional Iraqi services with cultural
    sensitivity and Islamic compliance. Our family-focused approach ensures
    respectful, ethical, and community-oriented solutions.
    """

    times = []
    for i in range(10):
        start = time.time()
        result = await validator.validate_content(test_content)
        elapsed = (time.time() - start) * 1000
        times.append(elapsed)
        print(
            f"   Validation {i + 1}: {elapsed:.2f}ms (score: {result.overall_score:.2%})"
        )

    avg_time = sum(times) / len(times)
    min_time = min(times)
    max_time = max(times)

    print(f"\n📊 PERFORMANCE STATS:")
    print(f"   Average: {avg_time:.2f}ms")
    print(f"   Min: {min_time:.2f}ms")
    print(f"   Max: {max_time:.2f}ms")
    print(f"   Target: <200ms")

    performance_ok = avg_time < 200

    print(f"\n✅ TEST 4 RESULT: {'PASSED' if performance_ok else 'FAILED'}")
    if not performance_ok:
        print(f"   ⚠️  Average time {avg_time:.2f}ms exceeds {MAX_RESPONSE_TIME_MS}ms target")

    return performance_ok

    except Exception as e:
        print(f"\n❌ TEST 4 FAILED with exception: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


async def test_mixed_arabic_english():
    """Test 5: Mixed Arabic-English content"""
    try:
        print("\n" + "=" * 80)
        print("TEST 5: Mixed Arabic-English Content")
        print("=" * 80)

    config = CulturalValidationConfig()
    validator = IraqiCulturalValidator(config)

    mixed_content = """
    مرحباً بكم في نظامنا المتقدم
    Welcome to our advanced Iraqi AI system

    نحن نقدم خدمات احترافية مع الالتزام الكامل بالقيم الإسلامية
    We provide professional services with full commitment to Islamic values

    Our features:
    - Arabic language support (دعم اللغة العربية)
    - Cultural sensitivity (الحساسية الثقافية)
    - Family values (القيم العائلية)
    """

    result = await validator.validate_content(mixed_content)

    # Get Arabic analysis
    arabic_analysis = await validator.arabic_processor.analyze_text(mixed_content)

    print(f"\n📊 ARABIC ANALYSIS:")
    print(f"   Arabic Percentage: {arabic_analysis.arabic_percentage:.1%}")
    print(f"   Has Arabic: {arabic_analysis.has_arabic_text}")
    print(f"   Mixed Language: {arabic_analysis.mixed_language}")
    print(f"   RTL Required: {arabic_analysis.rtl_required}")

    print(f"\n✅ VALIDATION SCORES:")
    print(f"   Overall: {result.overall_score:.2%}")
    print(f"   Cultural: {result.cultural_score:.2%}")
    print(f"   Islamic: {result.islamic_compliance_score:.2%}")

    # Validate mixed language handling
    mixed_ok = (
        arabic_analysis.mixed_language
        and result.is_compliant
        and result.overall_score >= MINIMUM_OVERALL_SCORE
    )

    print(f"\n✅ TEST 5 RESULT: {'PASSED' if mixed_ok else 'FAILED'}")

    return mixed_ok

    except Exception as e:
        print(f"\n❌ TEST 5 FAILED with exception: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


async def run_all_tests():
    """Run all validation tests"""
    print("\n" + "=" * 80)
    print("CULTURAL & ISLAMIC COMPLIANCE SYSTEM - COMPREHENSIVE TEST SUITE")
    print("=" * 80)
    print("\nTesting Core Validation Service Implementation")
    print("Target: <200ms response, 70% overall, 80% Islamic compliance")

    results = []

    # Run functional tests concurrently (faster execution)
    functional_results = await asyncio.gather(
        test_compliant_content(),
        test_haram_content_blocking(),
        test_arabic_dialect_detection(),
        test_mixed_arabic_english(),
    )

    # Run performance test separately to get accurate timing
    print("\n" + "=" * 80)
    print("RUNNING PERFORMANCE TEST (ISOLATED)")
    print("=" * 80)
    performance_result = await test_performance_benchmark()

    # Map results to test names
    results = [
        ("Compliant Content", functional_results[0]),
        ("Haram Blocking", functional_results[1]),
        ("Dialect Detection", functional_results[2]),
        ("Performance", performance_result),
        ("Mixed Language", functional_results[3]),
    ]

    # Summary
    print("\n" + "=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)

    passed = sum(1 for _, result in results if result)
    total = len(results)

    for test_name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"   {test_name}: {status}")

    print(f"\n{'=' * 80}")
    print(f"OVERALL: {passed}/{total} tests passed ({passed / total * 100:.1f}%)")
    print(f"{'=' * 80}")

    if passed == total:
        print("\n🎉 ALL TESTS PASSED! System is production-ready.")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Review failures above.")

    return passed == total


if __name__ == "__main__":
    # Run async tests
    success = asyncio.run(run_all_tests())
    exit(0 if success else 1)
