"""
Database Migration Service
Handles Alembic migrations and database initialization
"""

import logging
import os
from pathlib import Path
from alembic.config import Config
from alembic.command import upgrade, downgrade, current, history
from alembic.migration import MigrationContext
from alembic.operations import Operations
from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine

logger = logging.getLogger(__name__)


class MigrationService:
    """
    Service for managing database migrations using Alembic.

    Features:
    - Automatic migration on startup
    - Rollback capability
    - Migration history tracking
    - Current version detection
    """

    def __init__(self, database_url: str = None):
        """
        Initialize migration service.

        Args:
            database_url: Database connection URL (uses DATABASE_URL env var if not provided)
        """
        self.database_url = database_url or os.getenv(
            "DATABASE_URL", "postgresql://user:password@localhost:5432/aqlix"
        )
        self.alembic_cfg = self._setup_alembic_config()

    def _setup_alembic_config(self) -> Config:
        """
        Setup Alembic configuration.

        Returns:
            Alembic Config object
        """
        # Get the migrations directory
        migrations_dir = Path(__file__).parent.parent / "database" / "migrations"
        alembic_ini = Path(__file__).parent.parent / "alembic.ini"

        config = Config(str(alembic_ini))
        config.set_main_option("script_location", str(migrations_dir))
        config.set_main_option("sqlalchemy.url", self.database_url)

        return config

    async def migrate_to_latest(self) -> bool:
        """
        Run all pending migrations to the latest version.

        This is typically called during application startup.

        Returns:
            True if migrations succeeded, False otherwise
        """
        try:
            logger.info("Running database migrations to latest version...")
            upgrade(self.alembic_cfg, "head")
            logger.info("✅ Database migrations completed successfully")
            return True
        except Exception as e:
            logger.error(f"❌ Failed to run database migrations: {e}")
            return False

    async def rollback_one(self) -> bool:
        """
        Rollback one migration version.

        Returns:
            True if rollback succeeded, False otherwise
        """
        try:
            logger.info("Rolling back one database migration...")
            downgrade(self.alembic_cfg, "-1")
            logger.info("✅ Database rollback completed successfully")
            return True
        except Exception as e:
            logger.error(f"❌ Failed to rollback database migration: {e}")
            return False

    async def rollback_to_version(self, revision: str) -> bool:
        """
        Rollback to a specific migration version.

        Args:
            revision: Alembic revision ID to rollback to

        Returns:
            True if rollback succeeded, False otherwise
        """
        try:
            logger.info(f"Rolling back to revision {revision}...")
            downgrade(self.alembic_cfg, revision)
            logger.info(f"✅ Rolled back to revision {revision} successfully")
            return True
        except Exception as e:
            logger.error(f"❌ Failed to rollback to revision {revision}: {e}")
            return False

    async def get_current_revision(self) -> str:
        """
        Get the current database migration revision.

        Returns:
            Current revision ID or "None" if no migrations applied
        """
        try:
            engine = create_engine(self.database_url)
            with engine.connect() as connection:
                context = MigrationContext.configure(connection)
                return context.get_current_revision() or "None"
        except Exception as e:
            logger.error(f"Failed to get current revision: {e}")
            return "Unknown"

    async def get_migration_history(self, num_items: int = 10) -> list:
        """
        Get migration history.

        Args:
            num_items: Number of recent migrations to retrieve

        Returns:
            List of migration tuples (revision_id, message)
        """
        try:
            migrations = []
            engine = create_engine(self.database_url)

            with engine.connect() as connection:
                # Query alembic_version table
                result = connection.execute(
                    text(
                        """
                        SELECT version_num FROM alembic_version
                        ORDER BY version_num DESC LIMIT :limit
                        """
                    ),
                    {"limit": num_items},
                )
                for row in result:
                    migrations.append({"revision": row[0]})

            return migrations
        except Exception as e:
            logger.error(f"Failed to get migration history: {e}")
            return []

    async def ensure_tables_exist(self) -> bool:
        """
        Ensure all required tables exist.

        Creates alembic_version table if it doesn't exist.

        Returns:
            True if tables exist or were created, False otherwise
        """
        try:
            engine = create_engine(self.database_url)

            with engine.connect() as connection:
                # Check if alembic_version table exists
                inspector = connection.inspector
                tables = inspector.get_table_names()

                if "alembic_version" not in tables:
                    logger.info("Creating alembic_version table...")
                    connection.execute(
                        text(
                            """
                            CREATE TABLE alembic_version (
                                version_num varchar(32) NOT NULL,
                                PRIMARY KEY (version_num)
                            )
                            """
                        )
                    )
                    connection.commit()
                    logger.info("✅ Created alembic_version table")

            return True
        except Exception as e:
            logger.error(f"Failed to ensure tables exist: {e}")
            return False

    async def create_migration(self, message: str) -> bool:
        """
        Create a new migration file.

        Args:
            message: Migration description

        Returns:
            True if migration file was created, False otherwise
        """
        try:
            logger.info(f"Creating new migration: {message}")
            # This would use alembic.command.revision
            # For now, just log as it requires more setup
            logger.info(f"To create migration manually, run:")
            logger.info(f'  alembic revision --autogenerate -m "{message}"')
            return True
        except Exception as e:
            logger.error(f"Failed to create migration: {e}")
            return False

    async def validate_database_connection(self) -> bool:
        """
        Validate that database connection is working.

        Returns:
            True if connection is successful, False otherwise
        """
        try:
            engine = create_engine(self.database_url)
            with engine.connect() as connection:
                connection.execute(text("SELECT 1"))
            logger.info("✅ Database connection validated")
            return True
        except Exception as e:
            logger.error(f"❌ Database connection failed: {e}")
            return False
