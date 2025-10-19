# Backend API Tests

Comprehensive test suite for the Iraqi AI Chat System FastAPI backend.

## Directory Structure

```
tests/
├── conftest.py           # Shared pytest fixtures and configuration
├── unit/                 # Unit tests
│   ├── test_agents/      # PydanticAI agent tests
│   ├── test_services/    # Business logic service tests
│   └── test_models/      # Data model tests
├── integration/          # Integration tests
│   ├── test_api_endpoints/    # API endpoint tests
│   ├── test_database/         # Database integration tests
│   └── test_agent_integration/# Agent integration tests
├── cultural/             # Cultural validation tests
│   └── test_cultural_validation.py
└── arabic/               # Arabic processing tests
    └── test_arabic_processing.py
```

## Running Tests

### Run All Tests

```bash
pytest
```

### Run with Coverage

```bash
pytest --cov=. --cov-report=html
```

### Run Specific Test Categories

```bash
# Unit tests only
pytest -m unit

# Integration tests only
pytest -m integration

# Cultural validation tests
pytest -m cultural

# Arabic processing tests
pytest -m arabic

# API endpoint tests
pytest -m api

# Database tests
pytest -m database
```

### Run Specific Test Files

```bash
# Test agents
pytest tests/unit/test_agents/

# Test services
pytest tests/unit/test_services/

# Test API endpoints
pytest tests/integration/test_api_endpoints/
```

### Run in Parallel

```bash
# Install pytest-xdist first
pip install pytest-xdist

# Run with 4 workers
pytest -n 4
```

## Test Fixtures

### Database Fixtures

- `db_engine`: Sync SQLAlchemy engine
- `async_db_engine`: Async SQLAlchemy engine
- `db_session`: Sync database session with automatic rollback
- `async_db_session`: Async database session with automatic rollback

### HTTP Client Fixtures

- `app`: FastAPI application instance
- `client`: Async HTTP client for API testing

### Authentication Fixtures

- `mock_user_data`: Test user data
- `mock_admin_data`: Test admin data
- `auth_headers`: Authentication headers with JWT token
- `admin_auth_headers`: Admin authentication headers

### Mock Service Fixtures

- `mock_llm_client`: Mock LLM client for PydanticAI tests
- `mock_supabase_client`: Mock Supabase database client
- `mock_redis_client`: Mock Redis caching client
- `mock_payment_gateway`: Mock payment gateway (ZainCash, FastPay, NassWallet)

### Cultural Testing Fixtures

- `cultural_test_data`: Test data for cultural validation
- `arabic_test_samples`: Arabic text samples (Standard, Iraqi dialect, mixed)
- `mock_cultural_validator`: Mock cultural validator

### File Upload Fixtures

- `mock_uploaded_file`: Mock text file upload
- `mock_image_file`: Mock image file upload

### Utility Fixtures

- `test_settings`: Test environment configuration
- `performance_monitor`: Monitor test execution time
- `assert_valid_response`: Helper for response validation

## Writing Tests

### Example Unit Test

```python
import pytest

@pytest.mark.unit
async def test_service_function():
    """Test a service function."""
    result = await some_service_function()
    assert result is not None
```

### Example Integration Test

```python
import pytest

@pytest.mark.integration
@pytest.mark.api
async def test_api_endpoint(client, auth_headers):
    """Test an API endpoint."""
    response = await client.get(
        "/api/v1/endpoint",
        headers=auth_headers
    )
    assert response.status_code == 200
    assert response.json()["status"] == "success"
```

### Example Database Test

```python
import pytest

@pytest.mark.database
async def test_database_operation(async_db_session):
    """Test database operation."""
    # Create test data
    obj = Model(name="test")
    async_db_session.add(obj)
    await async_db_session.commit()

    # Query and verify
    result = await async_db_session.execute(
        select(Model).where(Model.name == "test")
    )
    assert result.scalar_one() is not None
```

### Example Cultural Test

```python
import pytest

@pytest.mark.cultural
async def test_cultural_validation(
    mock_cultural_validator,
    cultural_test_data
):
    """Test cultural content validation."""
    result = await mock_cultural_validator.validate(
        cultural_test_data["appropriate"]["arabic"]
    )
    assert result["is_appropriate"] is True
    assert result["score"] > 0.95
```

### Example Arabic Test

```python
import pytest

@pytest.mark.arabic
def test_arabic_text_processing(arabic_test_samples):
    """Test Arabic text processing."""
    text = arabic_test_samples["iraqi_dialect"]
    assert is_arabic(text)
    assert detect_dialect(text) == "iraqi"
```

## Test Markers

Custom markers defined in pytest.ini:

- `@pytest.mark.unit` - Unit tests
- `@pytest.mark.integration` - Integration tests
- `@pytest.mark.cultural` - Cultural validation tests
- `@pytest.mark.arabic` - Arabic processing tests
- `@pytest.mark.slow` - Tests taking > 1 second
- `@pytest.mark.api` - API endpoint tests
- `@pytest.mark.database` - Database tests

## Coverage Requirements

- Minimum coverage: 80% (enforced by pytest.ini)
- Target coverage: 90%
- Critical paths: 100% (auth, payments, cultural validation)

## Best Practices

### Test Isolation

- Each test should be independent
- Use fixtures for setup/teardown
- Database tests use automatic rollback
- Mock external services

### Async Testing

- Use `async def` for async tests
- Use `await` for async operations
- Fixtures can be async: `@pytest.fixture` with `AsyncGenerator`

### Cultural Testing

- Always test with both Standard Arabic and Iraqi dialect
- Verify RTL rendering
- Check Islamic compliance
- Test political neutrality

### Performance Testing

- Mark slow tests with `@pytest.mark.slow`
- Use `performance_monitor` fixture to track execution time
- Optimize tests taking > 1 second

### Error Testing

- Test both success and failure cases
- Verify error messages
- Check HTTP status codes
- Validate error response structure

## Continuous Integration

Tests run automatically on:

- Push to `main` or `develop`
- Pull requests
- Manual workflow dispatch

CI configuration:

- Runs all test categories
- Generates coverage report
- Fails on coverage < 80%
- Uploads coverage to codecov (future)

## Debugging Tests

### Run with verbose output

```bash
pytest -v
```

### Run with print statements

```bash
pytest -s
```

### Run specific test

```bash
pytest tests/unit/test_agents/test_chat_agent.py::test_generate_response
```

### Debug with pdb

```bash
pytest --pdb
```

### Generate HTML coverage report

```bash
pytest --cov=. --cov-report=html
open htmlcov/index.html
```

## Common Issues

### Import Errors

- Ensure `PYTHONPATH` includes project root
- Check that `__init__.py` files exist
- Verify module names are correct

### Async Test Failures

- Install `pytest-asyncio`
- Mark async tests with `@pytest.mark.asyncio` (not needed with conftest event_loop)
- Use `await` for all async operations

### Database Test Failures

- Check database fixtures are properly scoped
- Verify transactions rollback correctly
- Ensure test isolation

### Cultural Test Failures

- Verify Arabic text encoding (UTF-8)
- Check RTL processing is enabled
- Validate test data culturally appropriate

## Resources

- [pytest Documentation](https://docs.pytest.org/)
- [FastAPI Testing](https://fastapi.tiangolo.com/tutorial/testing/)
- [pytest-asyncio](https://pytest-asyncio.readthedocs.io/)
- [httpx Testing](https://www.python-httpx.org/async/)
