# Iraqi National ID Validator - Usage Guide

## Overview

The Iraqi ID Validator provides flexible validation for 12-digit Iraqi national ID numbers. It's designed for **general-purpose applications** and offers multiple validation levels.

## ⚠️ IMPORTANT: About Regional Prefix Codes

**The regional prefix codes used in this validator are ESTIMATES and NOT officially verified.**

- These codes are based on publicly available information
- They should NOT be relied upon for official government verification
- The actual prefix codes are maintained by Iraqi Ministry of Interior
- For official use, you MUST obtain verified codes from Iraqi authorities

## 🎯 Recommended Usage

### For Most Applications (Recommended)

Use **BASIC** validation level (default):

```python
from apps.api.services.iraqi_id_validator import IraqiIDValidator, VerificationLevel

# Validates format and birth year only - NO prefix checking
result = IraqiIDValidator.validate(
    iraqi_id="101990123456",
    verification_level=VerificationLevel.BASIC  # This is the default
)

if result.is_valid:
    print(f"Valid ID, birth year: {result.extracted_birth_year}")
else:
    print(f"Invalid: {result.error_message}")
```

**What BASIC validation checks:**

- ✅ 12-digit format
- ✅ All numeric characters
- ✅ Valid birth year (1920 - current year)
- ❌ Does NOT check regional prefix codes

### For Applications Needing Governorate Validation (Use with Caution)

Use **STANDARD** validation level:

```python
from apps.api.models.iraqi_user import IraqiRegion

# WARNING: Uses estimated prefix codes - may be inaccurate
result = IraqiIDValidator.validate(
    iraqi_id="101990123456",
    expected_region=IraqiRegion.BAGHDAD,
    verification_level=VerificationLevel.STANDARD
)
```

**What STANDARD validation checks:**

- ✅ All BASIC checks
- ⚠️ Regional prefix codes (ESTIMATED - not official)

**Use STANDARD only if:**

- You explicitly need governorate validation
- You understand the prefix codes are estimates
- You've informed users about potential inaccuracies
- You have a fallback for unrecognized prefixes

### For Government Applications (Requires Official Codes)

Use **STRICT** validation level:

```python
# For high-security government applications only
result = IraqiIDValidator.validate(
    iraqi_id="101990123456",
    expected_region=IraqiRegion.BAGHDAD,
    verification_level=VerificationLevel.STRICT
)
```

**What STRICT validation checks:**

- ✅ All STANDARD checks
- ✅ ICAO 9303 checksum validation
- ⚠️ Requires verified prefix codes from authorities

## 🔧 Validation Levels Comparison

| Level        | Format | Birth Year | Regional Prefix | Checksum | Use Case                      |
| ------------ | ------ | ---------- | --------------- | -------- | ----------------------------- |
| **BASIC**    | ✅     | ✅         | ❌              | ❌       | **Most apps** (recommended)   |
| **STANDARD** | ✅     | ✅         | ⚠️ (estimated)  | ❌       | Governorate validation needed |
| **STRICT**   | ✅     | ✅         | ⚠️ (estimated)  | ✅       | Government apps only          |

## 📋 ID Format

Iraqi national ID numbers follow this structure:

```
XX YYYY NNNNN C
│  │    │     └─ Checksum digit
│  │    └─────── Sequential number (5 digits)
│  └──────────── Birth year (4 digits)
└─────────────── Regional prefix (2 digits)
```

**Example:** `101990123456`

- `10`: Baghdad prefix (estimated)
- `1990`: Birth year
- `12345`: Sequential number
- `6`: Checksum

## 🗺️ Estimated Regional Prefixes

**⚠️ WARNING:** These are ESTIMATES based on public information and are NOT officially verified.

| Governorate     | Prefix(es) | Arabic Name |
| --------------- | ---------- | ----------- |
| Baghdad         | 10, 11     | بغداد       |
| Nineveh (Mosul) | 02         | الموصل      |
| Sulaymaniyah    | 03         | السليمانية  |
| Erbil           | 04         | أربيل       |
| Dohuk           | 05         | دهوك        |
| Basra           | 06         | البصرة      |
| Diyala          | 07         | ديالى       |
| Anbar           | 08         | الأنبار     |
| Kirkuk          | 09         | كركوك       |
| Najaf           | 12         | النجف       |
| Karbala         | 13         | كربلاء      |
| Wasit           | 14         | واسط        |
| Saladin         | 15         | صلاح الدين  |
| Qadisiyyah      | 16         | القادسية    |
| Babil           | 17         | بابل        |
| Dhi Qar         | 18         | ذي قار      |
| Maysan          | 19         | ميسان       |
| Muthanna        | 20         | المثنى      |
| Halabja         | 21         | حلبجة       |

## 🏗️ Usage Examples

### Example 1: Basic Validation (Recommended)

```python
# Safe for all applications - no prefix checking
result = IraqiIDValidator.validate("101990123456")

if result.is_valid:
    print(f"Valid ID")
    print(f"Birth year: {result.extracted_birth_year}")
    print(f"Verification level: {result.verification_level}")
```

### Example 2: Extract Information Without Validation

```python
# Extract birth year
birth_year = IraqiIDValidator.extract_birth_year("101990123456")
print(f"Birth year: {birth_year}")  # 1990

# Extract estimated region (based on unverified prefix)
region = IraqiIDValidator.extract_region("101990123456")
print(f"Estimated region: {region}")  # IraqiRegion.BAGHDAD
```

### Example 3: Validation with Error Handling

```python
result = IraqiIDValidator.validate(
    iraqi_id=user_provided_id,
    verification_level=VerificationLevel.BASIC
)

if result.is_valid:
    # Valid ID - proceed
    user.birth_year = result.extracted_birth_year
    user.estimated_region = result.extracted_region  # May be None
else:
    # Invalid ID - show error
    return {"error": result.error_message}
```

## 🔒 Security Considerations

1. **Never trust client-provided IDs for authorization** - Always verify with your authentication system
2. **Use BASIC validation by default** - Don't rely on unverified prefix codes
3. **Inform users** - If using STANDARD/STRICT, inform users that prefix validation may be inaccurate
4. **Provide fallbacks** - Handle cases where prefix codes don't match expected values
5. **Regular updates** - If you obtain official prefix codes, update the mappings

## 🚀 Migration from Strict to Flexible Validation

If you were previously using STANDARD/STRICT validation by default:

**Before:**

```python
# Old code that relied on unverified prefixes
result = IraqiIDValidator.validate(
    iraqi_id=id,
    expected_region=region,
    verification_level=VerificationLevel.STANDARD
)
```

**After (Recommended):**

```python
# New code using safe BASIC validation
result = IraqiIDValidator.validate(
    iraqi_id=id,
    verification_level=VerificationLevel.BASIC  # Safer default
)

# Store the estimated region separately if needed
estimated_region = IraqiIDValidator.extract_region(id)
# Use estimated_region for display/analytics only, not authorization
```

## 📝 Getting Official Prefix Codes

If you need official verification for government applications:

1. Contact **Iraqi Ministry of Interior - Civil Affairs Department**
2. Request official national ID prefix documentation
3. Update `REGIONAL_PREFIXES` dict with verified codes
4. Update comments to indicate codes are officially verified
5. Change default verification level if appropriate

## 🤝 Contributing

If you have:

- Official prefix codes from Iraqi authorities
- Corrections to existing mappings
- Additional validation rules

Please contribute with proper documentation and source verification.

## 📄 License

This validator is part of the Aqlix AI Iraqi Chat System and follows the project's licensing terms.

---

**Last Updated:** 2025-11-07
**Maintainer:** Aqlix AI Development Team
