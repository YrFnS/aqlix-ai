# SQL Injection Prevention Guide

**Iraqi AI Chat System - Security Best Practices**

## Overview

SQL injection is a critical security vulnerability where malicious SQL code is injected into database queries. This document outlines our prevention strategies and best practices.

**OWASP Top 10 2021: A03:2021 – Injection**

## Prevention Strategy

### 1. Parameterized Queries (Primary Defense)

**Supabase automatically handles parameterized queries** when using the Python client library.

#### ✅ CORRECT: Using Supabase Client

```python
from supabase import create_client, Client

supabase: Client = create_client(supabase_url, supabase_key)

# Safe: Parameters are automatically escaped
user = supabase.table('users') \
    .select('*') \
    .eq('email', user_email) \
    .single() \
    .execute()

# Safe: Insert with parameters
new_user = supabase.table('users').insert({
    'email': email,
    'full_name': full_name,
    'iraqi_id': iraqi_id
}).execute()

# Safe: Update with parameters
supabase.table('users') \
    .update({'verified': True}) \
    .eq('id', user_id) \
    .execute()
```

#### ❌ WRONG: String Concatenation (NEVER DO THIS)

```python
# DANGEROUS: SQL injection vulnerability
query = f"SELECT * FROM users WHERE email = '{user_email}'"
# Attacker can inject: admin'--
# Resulting query: SELECT * FROM users WHERE email = 'admin'--'
# This bypasses authentication!

# DANGEROUS: String formatting
query = "SELECT * FROM users WHERE email = '%s'" % user_email

# DANGEROUS: String interpolation
query = "INSERT INTO users (email, name) VALUES ('{email}', '{name}')"
```

### 2. Input Validation (Defense in Depth)

Always validate inputs **before** database operations:

```python
from apps.api.services.input_validator import InputValidator

# Validate email format
email_result = InputValidator.validate_email(user_email)
if not email_result.is_valid:
    raise ValueError(email_result.error_message)

# Detect SQL injection patterns (basic detection)
has_sql, warnings = InputValidator.detect_sql_injection_patterns(user_input)
if has_sql:
    # Log security incident
    logger.warning(f"SQL injection attempt detected: {warnings}")
    raise ValueError("Invalid input detected")
```

### 3. Supabase Row Level Security (RLS)

Enable RLS policies to enforce access control at the database level:

```sql
-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own data
CREATE POLICY "Users can read own data"
ON users FOR SELECT
USING (auth.uid() = id);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own data"
ON users FOR UPDATE
USING (auth.uid() = id);

-- Policy: Admins can read all data
CREATE POLICY "Admins can read all data"
ON users FOR SELECT
USING (auth.jwt()->>'role' = 'admin');
```

### 4. Least Privilege Principle

Use database roles with minimal required permissions:

```sql
-- Create read-only role for reporting
CREATE ROLE reporting_user WITH LOGIN PASSWORD 'secure_password';
GRANT SELECT ON users TO reporting_user;

-- Create application role with specific permissions
CREATE ROLE app_user WITH LOGIN PASSWORD 'secure_password';
GRANT SELECT, INSERT, UPDATE ON users TO app_user;
-- NO DELETE permission
```

### 5. Stored Procedures (Advanced)

For complex operations, use stored procedures:

```sql
-- Safe stored procedure
CREATE OR REPLACE FUNCTION register_user(
    p_email TEXT,
    p_full_name TEXT,
    p_iraqi_id TEXT
) RETURNS users AS $$
DECLARE
    v_user users;
BEGIN
    -- Input validation at database level
    IF p_email !~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' THEN
        RAISE EXCEPTION 'Invalid email format';
    END IF;

    -- Insert with parameters (safe from SQL injection)
    INSERT INTO users (email, full_name, iraqi_id)
    VALUES (p_email, p_full_name, p_iraqi_id)
    RETURNING * INTO v_user;

    RETURN v_user;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Common Attack Vectors

### 1. Authentication Bypass

**Attack:**

```python
# User input: admin'--
email = "admin'--"
# Intended query: SELECT * FROM users WHERE email = 'admin'--'
# Result: Comments out password check, logs in as admin
```

**Prevention:**

```python
# Use parameterized queries (Supabase handles this)
user = supabase.table('users').select('*').eq('email', email).execute()
```

### 2. UNION-Based Injection

**Attack:**

```python
# User input: ' UNION SELECT password FROM users--
search = "' UNION SELECT password FROM users--"
```

**Prevention:**

```python
# Validate input before query
result = InputValidator.validate_text_length(search, max_length=100)
if not result.is_valid:
    raise ValueError("Invalid search query")

# Use parameterized query
results = supabase.table('items').select('*').ilike('name', f'%{search}%').execute()
```

### 3. Boolean-Based Blind Injection

**Attack:**

```python
# User input: 1' OR '1'='1
user_id = "1' OR '1'='1"
```

**Prevention:**

```python
# Type validation
if not isinstance(user_id, (int, str)) or not str(user_id).isdigit():
    raise ValueError("Invalid user ID")

# Use parameterized query
user = supabase.table('users').select('*').eq('id', int(user_id)).execute()
```

### 4. Time-Based Blind Injection

**Attack:**

```python
# User input: 1'; WAITFOR DELAY '00:00:05'--
user_id = "1'; WAITFOR DELAY '00:00:05'--"
```

**Prevention:**

```python
# Input validation
result = InputValidator.detect_sql_injection_patterns(user_id)
if result[0]:
    raise ValueError("Invalid input detected")

# Use parameterized query
user = supabase.table('users').select('*').eq('id', user_id).execute()
```

## Iraqi-Specific Considerations

### Arabic Text Handling

Arabic text can contain special characters that might be misinterpreted:

```python
from apps.api.services.input_validator import InputValidator

# Validate Arabic names
name = "محمد علي"
result = InputValidator.validate_name(name)
if not result.is_valid:
    raise ValueError(result.error_message)

# Safe to use in database
user = supabase.table('users').insert({
    'full_name': result.sanitized_value
}).execute()
```

### Iraqi ID Validation

```python
# Validate Iraqi ID before database insertion
iraqi_id = "101-1985-0000123-4"
result = InputValidator.validate_iraqi_id(iraqi_id)
if not result.is_valid:
    raise ValueError(result.error_message)

# Safe to insert
user = supabase.table('users').update({
    'iraqi_id': result.sanitized_value
}).execute()
```

## Testing for SQL Injection

### Unit Tests

```python
def test_sql_injection_prevention():
    """Test SQL injection attempts are blocked"""
    malicious_inputs = [
        "admin'--",
        "' OR '1'='1",
        "1'; DROP TABLE users--",
        "' UNION SELECT * FROM users--",
    ]

    for malicious_input in malicious_inputs:
        # Validate input
        has_sql, warnings = InputValidator.detect_sql_injection_patterns(malicious_input)
        assert has_sql, f"Failed to detect SQL injection: {malicious_input}"

        # Attempt query (should fail validation)
        with pytest.raises(ValueError):
            validate_and_query(malicious_input)
```

### Integration Tests

```python
@pytest.mark.asyncio
async def test_parameterized_queries():
    """Test parameterized queries prevent injection"""
    # Attempt SQL injection
    malicious_email = "admin'--"

    # Query with Supabase (parameterized)
    result = supabase.table('users').select('*').eq('email', malicious_email).execute()

    # Should return empty (no user with this exact email)
    assert len(result.data) == 0
```

## Security Monitoring

### Log SQL Injection Attempts

```python
from apps.api.services.security_logger import SecurityLogger

# Log injection attempt
has_sql, warnings = InputValidator.detect_sql_injection_patterns(user_input)
if has_sql:
    SecurityLogger.log_security_event(
        event_type="sql_injection_attempt",
        severity="high",
        details={
            "input": user_input[:100],  # Truncate for logging
            "warnings": warnings,
            "user_id": current_user.id,
            "ip_address": request.client.host
        }
    )
```

### Sentry Integration

```python
import sentry_sdk

# Report to Sentry
if has_sql:
    sentry_sdk.capture_message(
        "SQL injection attempt detected",
        level="warning",
        extras={
            "input_sample": user_input[:100],
            "warnings": warnings
        }
    )
```

## Best Practices Summary

1. ✅ **Always use Supabase parameterized queries** - Never string concatenation
2. ✅ **Validate all inputs** - Use InputValidator before database operations
3. ✅ **Enable Supabase RLS policies** - Database-level access control
4. ✅ **Use least privilege** - Minimal database permissions
5. ✅ **Log injection attempts** - Monitor and alert on suspicious activity
6. ✅ **Test regularly** - Include SQL injection tests in test suite
7. ✅ **Educate team** - Ensure all developers understand SQL injection risks
8. ✅ **Code review** - Check for string concatenation in database queries
9. ✅ **Use type hints** - Enforce correct data types at Python level
10. ✅ **Monitor production** - Alert on SQL injection patterns in logs

## Iraqi Regulatory Compliance

**Iraqi Cybersecurity Regulations:**

- Input validation required for all user data
- Audit logging of security incidents
- Protection of sensitive Iraqi data (IDs, professional licenses)
- Compliance with data sovereignty requirements

## Resources

- [OWASP SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Security Documentation](https://www.postgresql.org/docs/current/security.html)

## Version History

- **v1.0** (2025-10-25): Initial SQL injection prevention guide
- **Evidence**: Task 115 implementation with comprehensive validation
