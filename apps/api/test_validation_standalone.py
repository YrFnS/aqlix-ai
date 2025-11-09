#!/usr/bin/env python
"""
Standalone Test for Cultural & Islamic Compliance System
Direct import without services/__init__.py to avoid dependency issues

Usage: python apps/api/test_validation_standalone.py
"""

import sys
import os
import asyncio
import time
import traceback
import importlib.util

# Compute absolute services path
services_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "services"))

# Verify path exists
if not os.path.exists(services_path):
    print(f"ERROR: Services path not found: {services_path}")
    sys.exit(1)

# Add to path if not already present
if services_path not in sys.path:
    sys.path.insert(0, services_path)

# Direct import with error handling
try:
    import cultural_islamic_compliance as cic
except (ImportError, ModuleNotFoundError) as e:
    print(f"ERROR: Failed to import cultural_islamic_compliance module")
    print(f"Path attempted: {services_path}")
    print(f"Error details: {e}")
    traceback.print_exc()
    sys.exit(1)


async def main():
    """Main test function"""
    print("=" * 80)
    print("CULTURAL & ISLAMIC COMPLIANCE SYSTEM - VALIDATION TEST")
    print("=" * 80)

    # Test constants
    BLOCKED_THRESHOLD = 0.01  # For floating point comparisons

    # Initialize validator
    config = cic.CulturalValidationConfig(
        minimum_overall_score=0.70,
        minimum_islamic_score=0.80,
    )
    validator = cic.IraqiCulturalValidator(config)

    # Test 1: Compliant Content
    print("\n[TEST 1] Compliant Content")
    print("-" * 80)
    content1 = """
    السلام عليكم ورحمة الله وبركاته
    Welcome to our Iraqi professional services with family support, education,
    and community welfare programs respecting Islamic values.
    """

    start = time.time()
    result1 = await validator.validate_content(content1)
    time1 = (time.time() - start) * 1000

    print(f"  Overall Score: {result1.overall_score:.2%}")
    print(f"  Cultural Score: {result1.cultural_score:.2%}")
    print(f"  Islamic Score: {result1.islamic_compliance_score:.2%}")
    print(f"  Is Compliant: {result1.is_compliant}")
    print(f"  Response Time: {time1:.1f}ms")
    print(f"  ✅ PASS" if result1.is_compliant and time1 < 200 else "  ❌ FAIL")

    # Test 2: Haram Content Blocking
    print("\n[TEST 2] Haram Content Blocking")
    print("-" * 80)
    content2 = "Visit our casino for gambling, alcohol, and interest-based loans"

    result2 = await validator.validate_content(content2)

    print(f"  Islamic Score: {result2.islamic_compliance_score:.2%}")
    print(f"  Is Compliant: {result2.is_compliant}")
    blocked = result2.islamic_compliance_score <= BLOCKED_THRESHOLD
    print(f"  ✅ PASS (blocked)" if blocked else "  ❌ FAIL (not blocked)")

    # Test 3: Iraqi Dialect Detection
    print("\n[TEST 3] Iraqi Dialect Detection")
    print("-" * 80)

    dialects = [
        ("شلونك؟ شكو ماكو؟ اني بخير", "baghdad"),
        ("شلونكم؟ كيف الحال؟", "basra"),
        ("كيفك؟ شنو الأخبار؟", "mosul"),
    ]

    pass_count = 0
    for text, expected in dialects:
        analysis = await validator.arabic_processor.analyze_text(text)
        detected = analysis.dialect_detected
        markers = ", ".join(analysis.iraqi_markers_found[:3])
        match = detected in [expected, "iraqi"]
        status = "✅" if match else "❌"
        print(f"  {text[:20]}... -> {detected} ({markers}) {status}")
        if match:
            pass_count += 1

    print(f"  {pass_count}/{len(dialects)} passed")

    # Test 4: Performance Benchmark
    print("\n[TEST 4] Performance Benchmark")
    print("-" * 80)

    test_content = "السلام عليكم Professional Iraqi services"
    times = []

    for i in range(10):
        start = time.time()
        await validator.validate_content(test_content)
        times.append((time.time() - start) * 1000)

    avg = sum(times) / len(times)
    print(f"  Average: {avg:.1f}ms")
    print(f"  Min: {min(times):.1f}ms")
    print(f"  Max: {max(times):.1f}ms")
    print(f"  Target: <200ms")
    print(f"  ✅ PASS" if avg < 200 else f"  ❌ FAIL ({avg:.0f}ms > 200ms)")

    # Summary
    print("\n" + "=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)

    tests = [
        ("Compliant Content", result1.is_compliant and time1 < 200),
        ("Haram Blocking", blocked),
        ("Dialect Detection", pass_count == len(dialects)),
        ("Performance", avg < 200),
    ]

    passed = sum(1 for _, p in tests if p)
    for name, p in tests:
        print(f"  {name}: {'✅ PASS' if p else '❌ FAIL'}")

    print(f"\n  TOTAL: {passed}/{len(tests)} passed ({passed / len(tests) * 100:.0f}%)")

    if passed == len(tests):
        print("\n🎉 ALL TESTS PASSED! System ready for integration.")
    else:
        print(f"\n⚠️  {len(tests) - passed} test(s) failed.")

    return passed == len(tests)


if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)
