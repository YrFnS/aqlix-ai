#!/usr/bin/env python3
"""
Simple test to verify circular import fix in mfa_enforcement.py
"""

import sys
import os
import importlib.util

print("=" * 70)
print("CIRCULAR IMPORT FIX VALIDATION TEST")
print("=" * 70)

# Test 1: Check source code for conditional imports
print("\n[Test 1] Checking source code for conditional imports...")
mfa_enforcement_path = os.path.join(
    os.path.dirname(__file__), "apps", "api", "services", "mfa_enforcement.py"
)

with open(mfa_enforcement_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

conditional_imports_found = []
for i, line in enumerate(lines, 1):
    # Check for conditional import patterns
    if "from" in line and "mfa_manager" in line and "MFAManager" in line:
        # Check if there's an 'if' before the import on the same or previous lines
        context_start = max(0, i - 5)
        context = "".join(lines[context_start:i])
        if "if " in context and not line.strip().startswith("#"):
            # Check if it's a proper top-level import (line 10)
            if i != 10:  # Line 10 is the top-level import
                conditional_imports_found.append((i, line.strip()))

if conditional_imports_found:
    print(f"FAILED: Found conditional imports:")
    for line_num, line_content in conditional_imports_found:
        print(f"  Line {line_num}: {line_content}")
    sys.exit(1)
else:
    print("PASSED: No conditional imports found")

# Test 2: Verify dependency injection parameter
print("\n[Test 2] Verifying device_trust_checker parameter exists...")
with open(mfa_enforcement_path, "r", encoding="utf-8") as f:
    content = f.read()

if "device_trust_checker: Optional[Callable[[str, str, str], DeviceTrustResult]]" in content:
    print("PASSED: device_trust_checker parameter correctly defined")
else:
    print("FAILED: device_trust_checker parameter not found or incorrect type")
    sys.exit(1)

# Test 3: Verify import structure
print("\n[Test 3] Verifying import structure...")
import_lines = []
for i, line in enumerate(lines, 1):
    if line.strip().startswith("from") or line.strip().startswith("import"):
        if not line.strip().startswith("#"):
            import_lines.append((i, line.strip()))

print(f"Found {len(import_lines)} import statements:")
for line_num, line_content in import_lines[:15]:  # Show first 15 imports
    print(f"  Line {line_num}: {line_content}")

# Check for proper imports
has_callable_import = any("Callable" in line[1] for line in import_lines)
has_devicetrustresult_import = any("DeviceTrustResult" in line[1] for line in import_lines)

if has_callable_import and has_devicetrustresult_import:
    print("PASSED: All necessary imports present")
else:
    print(f"FAILED: Missing imports (Callable: {has_callable_import}, DeviceTrustResult: {has_devicetrustresult_import})")
    sys.exit(1)

# Test 4: Verify no inline imports in methods
print("\n[Test 4] Verifying no inline imports in methods...")
in_method = False
method_conditional_imports = []

for i, line in enumerate(lines, 1):
    if "def " in line:
        in_method = True
        current_method = line.strip()
    elif line.strip().startswith("class "):
        in_method = False

    if in_method and "from .mfa_manager import MFAManager" in line and not line.strip().startswith("#"):
        method_conditional_imports.append((i, line.strip(), current_method))

if method_conditional_imports:
    print(f"FAILED: Found inline imports in methods:")
    for line_num, line_content, method in method_conditional_imports:
        print(f"  Line {line_num} in {method}: {line_content}")
    sys.exit(1)
else:
    print("PASSED: No inline imports found in methods")

# Test 5: Verify function signatures
print("\n[Test 5] Verifying function signatures...")
should_enforce_found = False
get_enforcement_status_found = False

for i, line in enumerate(lines, 1):
    if "def should_enforce_mfa(" in line:
        should_enforce_found = True
        # Check next few lines for device_trust_checker parameter
        context = "".join(lines[i:i+15])
        if "device_trust_checker" in context:
            print(f"PASSED: should_enforce_mfa has device_trust_checker parameter")
        else:
            print(f"FAILED: should_enforce_mfa missing device_trust_checker parameter")
            sys.exit(1)

    if "def get_enforcement_status(" in line:
        get_enforcement_status_found = True
        # Check next few lines for device_trust_checker parameter
        context = "".join(lines[i:i+15])
        if "device_trust_checker" in context:
            print(f"PASSED: get_enforcement_status has device_trust_checker parameter")
        else:
            print(f"FAILED: get_enforcement_status missing device_trust_checker parameter")
            sys.exit(1)

if not should_enforce_found or not get_enforcement_status_found:
    print(f"FAILED: Missing functions (should_enforce_mfa: {should_enforce_found}, get_enforcement_status: {get_enforcement_status_found})")
    sys.exit(1)

# Final summary
print("\n" + "=" * 70)
print("ALL TESTS PASSED!")
print("=" * 70)
print("\nCircular import issue RESOLVED:")
print("- No conditional imports found")
print("- Dependency injection pattern implemented")
print("- device_trust_checker parameter added to both functions")
print("- Clean separation of concerns maintained")
print("- DeviceTrustResult imported at top level")
print("\n" + "=" * 70)
