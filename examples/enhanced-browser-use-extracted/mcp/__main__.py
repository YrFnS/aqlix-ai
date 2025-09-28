#!/usr/bin/env python3
"""
Enhanced Iraqi MCP Server Entry Point

Run the Iraqi-enhanced browser-use MCP server with cultural validation.

Usage:
    python -m enhanced_browser_use_extracted.mcp
    python -m enhanced_browser_use_extracted.mcp.server

Environment Variables:
    OPENAI_API_KEY: Required for LLM functionality
    IRAQI_CULTURAL_COMPLIANCE: Enable/disable cultural compliance (default: true)
    IRAQI_ISLAMIC_VALUES: Enable/disable Islamic values compliance (default: true)
    IRAQI_DEBUG: Enable debug logging (default: false)
"""

import asyncio
import logging
import os
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

# Configure logging based on environment
log_level = (
    logging.DEBUG
    if os.getenv("IRAQI_DEBUG", "false").lower() == "true"
    else logging.INFO
)
logging.basicConfig(
    level=log_level,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    stream=sys.stderr,
)

logger = logging.getLogger(__name__)


def check_environment():
    """Check required environment variables and configuration."""

    # Check OpenAI API key
    if not os.getenv("OPENAI_API_KEY"):
        logger.warning("OPENAI_API_KEY not set - agent functionality will be limited")

    # Check cultural compliance settings
    cultural_compliance = (
        os.getenv("IRAQI_CULTURAL_COMPLIANCE", "true").lower() == "true"
    )
    islamic_values = os.getenv("IRAQI_ISLAMIC_VALUES", "true").lower() == "true"

    logger.info(f"Cultural compliance: {cultural_compliance}")
    logger.info(f"Islamic values compliance: {islamic_values}")

    return {
        "cultural_compliance": cultural_compliance,
        "islamic_values": islamic_values,
        "has_openai_key": bool(os.getenv("OPENAI_API_KEY")),
    }


async def main():
    """Main entry point for the Iraqi Enhanced MCP Server."""

    logger.info("Starting Iraqi Enhanced MCP Server...")

    # Check environment configuration
    config = check_environment()

    try:
        # Import and start server
        from .server import main as server_main

        logger.info("MCP Server ready - listening for connections...")
        await server_main()

    except ImportError as e:
        logger.error(f"Failed to import server dependencies: {e}")
        logger.error("Please install required dependencies:")
        logger.error("  pip install mcp browser-use langchain-openai")
        sys.exit(1)
    except KeyboardInterrupt:
        logger.info("Server shutdown requested")
    except Exception as e:
        logger.error(f"Server error: {e}", exc_info=True)
        sys.exit(1)
    finally:
        logger.info("Iraqi Enhanced MCP Server stopped")


if __name__ == "__main__":
    # Ensure we're using the correct event loop policy
    if sys.platform.startswith("win"):
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

    asyncio.run(main())
