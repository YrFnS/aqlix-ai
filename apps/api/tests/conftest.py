"""
Pytest Configuration and Fixtures for Iraqi AI Chat System API Tests

This module provides shared fixtures for all test types:
- Database fixtures with test isolation
- HTTP client fixtures for API testing
- Authentication and authorization fixtures
- Mock services for external dependencies
- Cultural validation fixtures
- Arabic text processing fixtures

All fixtures use appropriate scoping to balance performance and isolation.
"""

import asyncio
import pytest
import pytest_asyncio
import warnings
from typing import AsyncGenerator, Generator
from httpx import AsyncClient, ASGITransport
from fastapi import FastAPI
from sqlalchemy import create_engine, event
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
import os
from pathlib import Path
from dotenv import load_dotenv

# Load test environment variables BEFORE importing app components
env_file = Path(__file__).parent.parent / ".env.test"
load_dotenv(dotenv_path=env_file, override=True)

# Import application components AFTER loading test env
from main import app as fastapi_app
from config import settings


# ============================================================================
# Pytest Configuration
# ============================================================================


def pytest_configure(config):
    """Configure pytest with custom markers and settings."""
    config.addinivalue_line(
        "markers", "unit: Unit tests that don't require external dependencies"
    )
    config.addinivalue_line(
        "markers",
        "integration: Integration tests that require database/external services",
    )
    config.addinivalue_line(
        "markers", "cultural: Cultural validation and compliance tests"
    )
    config.addinivalue_line("markers", "arabic: Arabic language processing tests")
    config.addinivalue_line("markers", "slow: Tests that take more than 1 second")
    config.addinivalue_line("markers", "api: API endpoint integration tests")
    config.addinivalue_line("markers", "database: Tests requiring database access")


# ============================================================================
# Event Loop Configuration for Async Tests
# ============================================================================


@pytest.fixture(scope="session")
def event_loop_policy():
    """Configure event loop policy for async tests."""
    return asyncio.DefaultEventLoopPolicy()


@pytest.fixture(scope="session")
def event_loop(event_loop_policy) -> Generator:
    """Create event loop for async tests."""
    loop = event_loop_policy.new_event_loop()
    yield loop
    loop.close()


# ============================================================================
# Environment Configuration Fixtures
# ============================================================================


@pytest.fixture(scope="session")
def test_settings():
    """
    Test environment settings.

    Override production settings with test-safe values.
    """
    # Force test environment
    os.environ["NODE_ENV"] = "test"
    os.environ["DEBUG"] = "true"
    os.environ["LOG_LEVEL"] = "DEBUG"

    # Use in-memory test database
    os.environ["DATABASE_URL"] = "sqlite+aiosqlite:///:memory:"

    # Disable external services in tests
    os.environ["REDIS_URL"] = ""
    os.environ["SENTRY_DSN"] = ""

    # Test API key
    os.environ["API_SECRET_KEY"] = (
        "test-secret-key-minimum-32-characters-long-for-security"
    )

    # JWT secret key for SessionManager (required for real JWT token generation in tests)
    os.environ["JWT_SECRET_KEY"] = (
        "test-jwt-secret-key-minimum-32-characters-long-for-security"
    )

    # Cultural settings for testing
    os.environ["CULTURAL_VALIDATION_ENABLED"] = "true"
    os.environ["ARABIC_DIALECT_PROCESSING"] = "true"
    os.environ["ENABLE_MULTIMODAL"] = "false"  # Disable for faster tests

    return settings


# ============================================================================
# Database Fixtures
# ============================================================================


@pytest.fixture(scope="session")
def db_engine(test_settings):
    """
    Create SQLAlchemy engine for testing.

    Uses in-memory SQLite for fast, isolated tests.
    """
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

    # Create all tables
    # TODO: Import and use actual models
    # from models import Base
    # Base.metadata.create_all(bind=engine)

    yield engine

    engine.dispose()


@pytest_asyncio.fixture(scope="session")
async def async_db_engine(test_settings):
    """
    Create async SQLAlchemy engine for testing.

    Uses aiosqlite for async database operations.
    """
    engine = create_async_engine(
        "sqlite+aiosqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
        echo=False,  # Set to True for SQL debugging
    )

    # Create all tables
    # TODO: Import and use actual models
    # async with engine.begin() as conn:
    #     await conn.run_sync(Base.metadata.create_all)

    yield engine

    await engine.dispose()


@pytest.fixture(scope="function")
def db_session(db_engine) -> Generator[Session, None, None]:
    """
    Create a database session for sync tests.

    Each test gets a fresh session with automatic rollback.
    """
    connection = db_engine.connect()
    transaction = connection.begin()

    SessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=connection,
    )
    session = SessionLocal()

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest_asyncio.fixture(scope="function")
async def async_db_session(async_db_engine) -> AsyncGenerator[AsyncSession, None]:
    """
    Create an async database session for async tests.

    Each test gets a fresh session with automatic rollback.
    """
    async with async_db_engine.connect() as connection:
        async with connection.begin() as transaction:
            AsyncSessionLocal = async_sessionmaker(
                connection,
                class_=AsyncSession,
                expire_on_commit=False,
            )
            session = AsyncSessionLocal()

            yield session

            await session.close()
            await transaction.rollback()


# ============================================================================
# FastAPI Application Fixtures
# ============================================================================


@pytest.fixture(scope="session")
def app() -> FastAPI:
    """
    FastAPI application instance for testing.

    Returns the main application with all middleware and routes.
    """
    return fastapi_app


@pytest_asyncio.fixture(scope="function")
async def client(app: FastAPI) -> AsyncGenerator[AsyncClient, None]:
    """
    Async HTTP client for API testing.

    Example:
        async def test_health_endpoint(client):
            response = await client.get("/health")
            assert response.status_code == 200
    """
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as ac:
        yield ac


# ============================================================================
# Authentication Fixtures
# ============================================================================


@pytest.fixture
def mock_user_data():
    """Mock user data for authentication tests."""
    return {
        "id": "test-user-id-123",
        "email": "test@example.com",
        "username": "testuser",
        "is_active": True,
        "is_verified": True,
        "roles": ["user"],
    }


@pytest.fixture
def mock_admin_data():
    """Mock admin user data for authorization tests."""
    return {
        "id": "admin-user-id-456",
        "email": "admin@example.com",
        "username": "adminuser",
        "is_active": True,
        "is_verified": True,
        "roles": ["admin", "user"],
    }


@pytest.fixture
def auth_headers(mock_user_data):
    """
    Generate authentication headers for testing.

    Returns headers with valid JWT token for test user.
    """
    from services.session_manager import SessionManager

    # Generate real JWT token for testing
    token = SessionManager.create_access_token(
        user_id=mock_user_data["id"],
        session_id="test-session-id-123",
        cultural_context={
            "language": "en",
            "region": "baghdad",
            "dialect": "iraqi",
        },
    )

    return {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }


@pytest.fixture
def admin_auth_headers(mock_admin_data):
    """
    Generate admin authentication headers for testing.

    Returns headers with valid JWT token for admin user.
    """
    from services.session_manager import SessionManager

    # Generate real JWT token for admin user
    token = SessionManager.create_access_token(
        user_id=mock_admin_data["id"],
        session_id="test-admin-session-id-456",
        cultural_context={
            "language": "en",
            "region": "baghdad",
            "dialect": "iraqi",
        },
        professional_context={
            "role": "admin",
            "permissions": ["read", "write", "delete"],
        },
    )

    return {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }


# ============================================================================
# Mock Service Fixtures
# ============================================================================


@pytest.fixture
def mock_llm_client():
    """
    Mock LLM client for PydanticAI agent testing.

    Returns a mock client that simulates LLM responses without API calls.
    """

    class MockLLMClient:
        def __init__(self):
            self.call_count = 0

        async def generate(self, prompt: str, **kwargs):
            """Mock LLM generation."""
            self.call_count += 1
            return {
                "text": f"Mock response to: {prompt[:50]}...",
                "model": "test-model",
                "tokens": 100,
            }

        async def generate_with_tools(self, prompt: str, tools: list, **kwargs):
            """Mock LLM generation with tool calling."""
            self.call_count += 1
            return {
                "text": "Mock response with tool usage",
                "tool_calls": [],
                "model": "test-model",
            }

    return MockLLMClient()


@pytest.fixture
def mock_supabase_client():
    """
    Mock Supabase client for database operations.

    Returns a mock client that simulates Supabase without actual connections.
    """

    class MockSupabaseClient:
        def __init__(self):
            self.data = {}

        def table(self, table_name: str):
            """Mock table access."""
            return self

        async def select(self, *args):
            """Mock select query."""
            return self

        async def insert(self, data: dict):
            """Mock insert operation."""
            return {"data": data, "error": None}

        async def update(self, data: dict):
            """Mock update operation."""
            return {"data": data, "error": None}

        async def delete(self):
            """Mock delete operation."""
            return {"data": None, "error": None}

    return MockSupabaseClient()


@pytest.fixture
def mock_redis_client():
    """
    Mock Redis client for caching tests.

    Returns an in-memory mock that simulates Redis operations.
    """

    class MockRedisClient:
        def __init__(self):
            self.store = {}

        async def get(self, key: str):
            """Mock get operation."""
            return self.store.get(key)

        async def set(self, key: str, value: str, ex: int = None):
            """Mock set operation."""
            self.store[key] = value
            return True

        async def delete(self, key: str):
            """Mock delete operation."""
            return self.store.pop(key, None) is not None

        async def exists(self, key: str):
            """Mock exists check."""
            return key in self.store

    return MockRedisClient()


# ============================================================================
# Cultural Validation Fixtures
# ============================================================================


@pytest.fixture
def cultural_test_data():
    """
    Test data for cultural validation.

    Provides examples of culturally appropriate and inappropriate content.
    """
    return {
        "appropriate": {
            "arabic": "مرحبا، كيف يمكنني مساعدتك اليوم؟",
            "english": "Hello, how can I help you today?",
            "mixed": "Welcome مرحبا to our service",
            "professional": "نحن نقدم خدمات قانونية متخصصة",
        },
        "inappropriate": {
            "political": "محتوى سياسي حساس",  # Sensitive political content
            "sectarian": "محتوى طائفي",  # Sectarian content
            "offensive": "محتوى مسيء",  # Offensive content
        },
        "islamic_compliant": {
            "greeting": "السلام عليكم",
            "gratitude": "الحمد لله",
            "respect": "جزاك الله خيرا",
        },
    }


@pytest.fixture
def arabic_test_samples():
    """
    Arabic text samples for RTL and dialect testing.

    Includes Standard Arabic, Iraqi dialect, and mixed content.
    """
    return {
        "standard_arabic": "اللغة العربية الفصحى",
        "iraqi_dialect": "شلونك؟ شكو ماكو؟",  # How are you? What's up?
        "mixed_content": "Testing نص عربي mixed with English",
        "rtl_numbers": "العدد ١٢٣٤٥ والتاريخ ٢٠٢٥/١٠/١٩",
        "complex_text": "مرحبا! هذا اختبار للنص العربي مع علامات الترقيم، والأرقام ١٢٣.",
        "bidirectional": "Testing RTL مع نص عربي and English text",
    }


@pytest.fixture
def mock_cultural_validator():
    """
    Mock cultural validator for testing without external services.

    Returns a validator that performs basic cultural checks.
    """

    class MockCulturalValidator:
        def __init__(self):
            self.validation_count = 0

        async def validate(self, text: str, context: str = "general"):
            """Mock cultural validation."""
            self.validation_count += 1

            # Simple mock validation logic
            inappropriate_keywords = ["political", "sectarian", "offensive"]
            has_issues = any(
                keyword in text.lower() for keyword in inappropriate_keywords
            )

            return {
                "is_appropriate": not has_issues,
                "score": 0.95 if not has_issues else 0.3,
                "issues": ["inappropriate_content"] if has_issues else [],
                "context": context,
            }

        async def validate_islamic_compliance(self, text: str):
            """Mock Islamic compliance check."""
            return {
                "is_compliant": True,
                "score": 0.98,
                "violations": [],
            }

    return MockCulturalValidator()


# ============================================================================
# Payment Gateway Fixtures
# ============================================================================


@pytest.fixture
def mock_payment_gateway():
    """
    Mock payment gateway for testing payment flows.

    Simulates ZainCash, FastPay, NassWallet responses.
    """

    class MockPaymentGateway:
        def __init__(self):
            self.transactions = {}

        async def create_transaction(
            self, gateway: str, amount: int, currency: str = "IQD"
        ):
            """Mock transaction creation."""
            transaction_id = f"test-txn-{len(self.transactions) + 1}"
            self.transactions[transaction_id] = {
                "id": transaction_id,
                "gateway": gateway,
                "amount": amount,
                "currency": currency,
                "status": "pending",
            }
            return self.transactions[transaction_id]

        async def verify_transaction(self, transaction_id: str):
            """Mock transaction verification."""
            if transaction_id in self.transactions:
                self.transactions[transaction_id]["status"] = "completed"
                return self.transactions[transaction_id]
            return None

    return MockPaymentGateway()


# ============================================================================
# File Upload Fixtures
# ============================================================================


@pytest.fixture
def mock_uploaded_file():
    """
    Mock uploaded file for file handling tests.

    Returns a file-like object for testing uploads.
    """
    from io import BytesIO

    content = b"Mock file content for testing"
    file = BytesIO(content)
    file.name = "test_file.txt"
    file.size = len(content)
    file.content_type = "text/plain"

    return file


@pytest.fixture
def mock_image_file():
    """Mock image file for image processing tests."""
    from io import BytesIO

    # Create a minimal valid PNG
    png_header = b"\x89PNG\r\n\x1a\n"
    png_data = png_header + b"Mock PNG image data"

    file = BytesIO(png_data)
    file.name = "test_image.png"
    file.size = len(png_data)
    file.content_type = "image/png"

    return file


# ============================================================================
# Test Data Cleanup
# ============================================================================


@pytest.fixture(autouse=True)
def cleanup_test_data():
    """
    Automatically cleanup test data after each test.

    Runs after every test function to ensure clean state.
    """
    yield

    # Cleanup logic here
    # - Clear temporary files
    # - Reset mock states
    # - Clear test caches
    pass


# ============================================================================
# Performance Monitoring Fixtures
# ============================================================================


@pytest.fixture
def performance_monitor():
    """
    Monitor test performance and execution time.

    Example:
        def test_something(performance_monitor):
            with performance_monitor("operation_name"):
                # test code here
                pass
    """
    import time
    from contextlib import contextmanager

    class PerformanceMonitor:
        def __init__(self):
            self.timings = {}

        @contextmanager
        def measure(self, operation: str):
            """Measure operation execution time."""
            start = time.time()
            yield
            duration = time.time() - start
            self.timings[operation] = duration

            if duration > 1.0:  # Warn on slow operations
                warnings.warn(
                    f"Slow operation: {operation} took {duration:.2f}s", UserWarning
                )

    return PerformanceMonitor()


# ============================================================================
# Assertion Helpers
# ============================================================================


@pytest.fixture
def assert_valid_response():
    """
    Helper for asserting valid API responses.

    Example:
        async def test_endpoint(client, assert_valid_response):
            response = await client.get("/api/endpoint")
            assert_valid_response(response, status=200)
    """

    def _assert(response, status: int = 200, has_data: bool = True):
        """Assert response validity."""
        assert response.status_code == status, (
            f"Expected {status}, got {response.status_code}"
        )

        if has_data:
            data = response.json()
            assert data is not None, "Response should contain data"

        return response.json() if has_data else None

    return _assert
