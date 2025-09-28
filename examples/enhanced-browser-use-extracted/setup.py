#!/usr/bin/env python3
"""
Enhanced Browser-Use Extraction - Development Environment Setup
Hybrid extraction combining browser-use with Iraqi AI customizations
"""

import os
import sys
import subprocess
import platform
from pathlib import Path


def check_python_version():
    """Ensure Python >= 3.11 is being used"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 11):
        print("❌ Python 3.11+ required for enhanced browser-use extraction")
        print(f"   Current version: {version.major}.{version.minor}.{version.micro}")
        print("   Please upgrade Python and retry")
        sys.exit(1)
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} (compatible)")


def setup_virtual_environment():
    """Create and activate virtual environment"""
    venv_path = Path("venv")

    if not venv_path.exists():
        print("📦 Creating virtual environment...")
        subprocess.run([sys.executable, "-m", "venv", "venv"], check=True)
        print("✅ Virtual environment created")
    else:
        print("✅ Virtual environment exists")

    # Provide activation instructions
    if platform.system() == "Windows":
        activate_cmd = "venv\\Scripts\\activate"
    else:
        activate_cmd = "source venv/bin/activate"

    print(f"💡 Activate with: {activate_cmd}")
    return venv_path


def install_dependencies(venv_path: Path):
    """Install all required dependencies"""
    if platform.system() == "Windows":
        pip_path = venv_path / "Scripts" / "pip"
    else:
        pip_path = venv_path / "bin" / "pip"

    print("📦 Installing core dependencies...")
    subprocess.run([str(pip_path), "install", "-r", "requirements.txt"], check=True)
    print("✅ Dependencies installed")

    # Install playwright browsers
    print("🌐 Installing Playwright browsers...")
    if platform.system() == "Windows":
        playwright_path = venv_path / "Scripts" / "playwright"
    else:
        playwright_path = venv_path / "bin" / "playwright"

    subprocess.run([str(playwright_path), "install"], check=True)
    print("✅ Playwright browsers installed")


def setup_environment_file():
    """Create .env file template for development"""
    env_file = Path(".env")

    if not env_file.exists():
        print("⚙️ Creating environment configuration...")
        env_content = """# Enhanced Browser-Use Environment Configuration
# Copy this file and configure your settings

# ==================== LLM PROVIDERS ====================
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4-1106-preview

# Anthropic Configuration  
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ANTHROPIC_MODEL=claude-3-sonnet-20240229

# Google Gemini Configuration
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_MODEL=gemini-pro

# Groq Configuration
GROQ_API_KEY=your_groq_api_key_here

# Ollama Configuration (Local)
OLLAMA_BASE_URL=http://localhost:11434

# ==================== IRAQI AI SYSTEM ====================
# Cultural Validation Settings
IRAQI_CULTURAL_VALIDATION=true
ISLAMIC_COMPLIANCE_REQUIRED=true
ARABIC_DIALECT_PROCESSING=true

# Arabic Processing Configuration
ARABIC_RESHAPER_ENABLED=true
RTL_LAYOUT_SUPPORT=true
MIXED_CONTENT_HANDLING=true

# Iraqi Regional Settings
TIMEZONE=Asia/Baghdad
LOCALE=ar_IQ
CURRENCY=IQD

# ==================== IRAQI PAYMENT GATEWAYS ====================
# ZainCash Configuration
ZAINCASH_MERCHANT_ID=your_zaincash_merchant_id
ZAINCASH_SECRET_KEY=your_zaincash_secret_key
ZAINCASH_SANDBOX=true

# FastPay Configuration
FASTPAY_MERCHANT_ID=your_fastpay_merchant_id
FASTPAY_API_KEY=your_fastpay_api_key
FASTPAY_SANDBOX=true

# NassWallet Configuration  
NASSWALLET_MERCHANT_ID=your_nasswallet_merchant_id
NASSWALLET_API_KEY=your_nasswallet_api_key
NASSWALLET_SANDBOX=true

# ==================== BROWSER CONFIGURATION ====================
# Browser Settings
HEADLESS_BROWSER=false
BROWSER_TYPE=chromium
VIEWPORT_WIDTH=1920
VIEWPORT_HEIGHT=1080

# Iraqi Government Portal Settings
GOVERNMENT_PORTAL_TIMEOUT=30000
FORM_SUBMISSION_DELAY=2000
ARABIC_INPUT_DELAY=500

# ==================== SECURITY SETTINGS ====================
# Encryption Keys (generate secure keys)
ENCRYPTION_KEY=generate_32_byte_key_here
JWT_SECRET=generate_jwt_secret_here

# Session Configuration
SESSION_TIMEOUT=3600
CSRF_PROTECTION=true

# ==================== DATABASE CONFIGURATION ====================
# PostgreSQL (for Iraqi government integration)
DATABASE_URL=postgresql://user:pass@localhost:5432/iraqi_ai_chat

# Redis (for caching and sessions)
REDIS_URL=redis://localhost:6379/0

# ==================== MONITORING & LOGGING ====================
# PostHog Analytics
POSTHOG_API_KEY=your_posthog_key_here
POSTHOG_HOST=https://app.posthog.com

# Sentry Error Tracking
SENTRY_DSN=your_sentry_dsn_here

# Logging Configuration
LOG_LEVEL=INFO
STRUCTURED_LOGGING=true

# ==================== DEVELOPMENT SETTINGS ====================
# Development Mode
DEBUG=true
DEVELOPMENT_MODE=true

# Testing Configuration
TEST_TIMEOUT=300
ASYNC_TEST_MODE=auto

# Performance Settings
UVLOOP_ENABLED=true
ORJSON_ENABLED=true
"""
        env_file.write_text(env_content)
        print("✅ Environment file created (.env)")
        print("💡 Please configure your API keys and settings in .env")
    else:
        print("✅ Environment file exists")


def setup_project_structure():
    """Create the enhanced project directory structure"""
    directories = [
        "agent",
        "agent/iraqi_integration",
        "mcp",
        "llm",
        "llm/providers",
        "dom",
        "dom/arabic_integration",
        "browser",
        "browser/watchdogs",
        "cultural",
        "cultural/agents",
        "cultural/processing",
        "cultural/workflows",
        "tests",
        "tests/cultural",
        "tests/arabic",
        "tests/payment",
        "docs",
        "examples",
        "config",
    ]

    print("📁 Setting up project structure...")
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)

    # Create __init__.py files for Python packages
    init_files = [
        "agent/__init__.py",
        "agent/iraqi_integration/__init__.py",
        "mcp/__init__.py",
        "llm/__init__.py",
        "llm/providers/__init__.py",
        "dom/__init__.py",
        "dom/arabic_integration/__init__.py",
        "browser/__init__.py",
        "browser/watchdogs/__init__.py",
        "cultural/__init__.py",
        "cultural/agents/__init__.py",
        "cultural/processing/__init__.py",
        "cultural/workflows/__init__.py",
    ]

    for init_file in init_files:
        Path(init_file).touch()

    print("✅ Project structure created")


def create_development_scripts():
    """Create helpful development scripts"""
    # Create development runner script
    if platform.system() == "Windows":
        dev_script = """@echo off
echo Starting Enhanced Browser-Use Development Environment
call venv\\Scripts\\activate
echo Environment activated - Python version:
python --version
echo Available commands:
echo   python -m pytest tests/ - Run tests
echo   python -m ruff check . - Lint code
echo   python -m pyright . - Type check
echo   python examples/simple_automation.py - Test automation
"""
        Path("dev.bat").write_text(dev_script)
    else:
        dev_script = """#!/bin/bash
echo "Starting Enhanced Browser-Use Development Environment"
source venv/bin/activate
echo "Environment activated - Python version:"
python --version
echo "Available commands:"
echo "  python -m pytest tests/ - Run tests"  
echo "  python -m ruff check . - Lint code"
echo "  python -m pyright . - Type check"
echo "  python examples/simple_automation.py - Test automation"
"""
        dev_path = Path("dev.sh")
        dev_path.write_text(dev_script)
        dev_path.chmod(0o755)

    print("✅ Development scripts created")


def main():
    """Main setup process"""
    print("🚀 Enhanced Browser-Use Extraction - Development Setup")
    print("=" * 60)

    # Verify Python version
    check_python_version()

    # Setup virtual environment
    venv_path = setup_virtual_environment()

    # Install dependencies
    install_dependencies(venv_path)

    # Setup environment configuration
    setup_environment_file()

    # Create project structure
    setup_project_structure()

    # Create development scripts
    create_development_scripts()

    print("\n" + "=" * 60)
    print("✅ Setup Complete!")
    print("\n📋 Next Steps:")
    print("1. Activate virtual environment:")
    if platform.system() == "Windows":
        print("   venv\\Scripts\\activate")
    else:
        print("   source venv/bin/activate")

    print("2. Configure .env file with your API keys")
    print("3. Run development script:")
    if platform.system() == "Windows":
        print("   dev.bat")
    else:
        print("   ./dev.sh")

    print("4. Begin Phase 1 extraction implementation")
    print("\n🎯 Phase 1 Status: Week 1-2 - Repository Setup ✅ COMPLETE")


if __name__ == "__main__":
    main()
