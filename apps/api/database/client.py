"""
Database Client for Supabase PostgreSQL
Provides async database connection and query utilities
"""

import os
import json
import asyncio
from typing import Optional, Dict, List, Any
from contextlib import asynccontextmanager
import asyncpg
from datetime import datetime, timezone


class DatabaseClient:
    """
    Database Client for Supabase PostgreSQL

    Handles connection pooling and async query execution
    """

    _pool: Optional[asyncpg.Pool] = None
    _pool_lock: asyncio.Lock = asyncio.Lock()

    @classmethod
    async def get_pool(cls) -> asyncpg.Pool:
        """
        Get or create database connection pool
        Thread-safe with double-checked locking pattern

        Returns:
            asyncpg.Pool connection pool
        """
        # First check without lock (fast path)
        if cls._pool is not None:
            return cls._pool

        # Acquire lock for pool creation
        async with cls._pool_lock:
            # Double-check after acquiring lock
            if cls._pool is not None:
                return cls._pool

            # Build connection string from environment
            database_url = os.getenv("DATABASE_URL")

            if not database_url:
                # Fallback to individual components
                host = os.getenv("DB_HOST", "localhost")
                port = int(os.getenv("DB_PORT", "5432"))
                database = os.getenv("DB_NAME", "postgres")
                user = os.getenv("DB_USER", "postgres")
                password = os.getenv("DB_PASSWORD", "")

                cls._pool = await asyncpg.create_pool(
                    host=host,
                    port=port,
                    database=database,
                    user=user,
                    password=password,
                    min_size=2,
                    max_size=10,
                    command_timeout=60,
                )
            else:
                cls._pool = await asyncpg.create_pool(
                    database_url, min_size=2, max_size=10, command_timeout=60
                )

            return cls._pool

    @classmethod
    async def close_pool(cls):
        """Close database connection pool"""
        if cls._pool:
            await cls._pool.close()
            cls._pool = None

    @classmethod
    async def execute(cls, query: str, *args, timeout: Optional[float] = None) -> str:
        """
        Execute a query without returning results (INSERT, UPDATE, DELETE)

        Args:
            query: SQL query with $1, $2 placeholders
            *args: Query parameters
            timeout: Query timeout in seconds

        Returns:
            Query execution status (e.g., 'INSERT 0 1')
        """
        pool = await cls.get_pool()
        async with pool.acquire() as conn:
            return await conn.execute(query, *args, timeout=timeout)

    @classmethod
    async def fetch(
        cls, query: str, *args, timeout: Optional[float] = None
    ) -> List[Dict[str, Any]]:
        """
        Execute a query and return all results as list of dicts

        Args:
            query: SQL query with $1, $2 placeholders
            *args: Query parameters
            timeout: Query timeout in seconds

        Returns:
            List of row dictionaries
        """
        pool = await cls.get_pool()
        async with pool.acquire() as conn:
            rows = await conn.fetch(query, *args, timeout=timeout)
            return [dict(row) for row in rows]

    @classmethod
    async def fetchrow(
        cls, query: str, *args, timeout: Optional[float] = None
    ) -> Optional[Dict[str, Any]]:
        """
        Execute a query and return single row as dict

        Args:
            query: SQL query with $1, $2 placeholders
            *args: Query parameters
            timeout: Query timeout in seconds

        Returns:
            Row dictionary or None
        """
        pool = await cls.get_pool()
        async with pool.acquire() as conn:
            row = await conn.fetchrow(query, *args, timeout=timeout)
            return dict(row) if row else None

    @classmethod
    async def fetchval(
        cls, query: str, *args, column: int = 0, timeout: Optional[float] = None
    ) -> Any:
        """
        Execute a query and return single value

        Args:
            query: SQL query with $1, $2 placeholders
            *args: Query parameters
            column: Column index to return (default: 0)
            timeout: Query timeout in seconds

        Returns:
            Single value
        """
        pool = await cls.get_pool()
        async with pool.acquire() as conn:
            return await conn.fetchval(query, *args, column=column, timeout=timeout)

    @classmethod
    @asynccontextmanager
    async def transaction(cls):
        """
        Transaction context manager

        Usage:
            async with DatabaseClient.transaction() as conn:
                await conn.execute(...)
                await conn.execute(...)
        """
        pool = await cls.get_pool()
        async with pool.acquire() as conn:
            async with conn.transaction():
                yield conn


class SessionRepository:
    """
    Repository for iraqi_authentication_sessions table operations
    """

    @staticmethod
    async def create_session(
        session_id: str,
        user_id: str,
        session_token: str,
        refresh_token: str,
        expires_at: datetime,
        cultural_context_snapshot: Dict,
        device_id: Optional[str] = None,
        device_type: Optional[str] = None,
        platform: Optional[str] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        language_used: Optional[str] = "ar-IQ",
        regional_context: Optional[str] = "baghdad",
        professional_session_mode: bool = False,
        login_method: str = "email_password",
        mfa_completed: bool = False,
    ) -> Dict[str, Any]:
        """
        Insert new session into database

        Args:
            session_id: UUID session identifier
            user_id: UUID user identifier
            session_token: JWT access token
            refresh_token: JWT refresh token
            expires_at: Session expiration timestamp
            cultural_context_snapshot: Cultural context JSON
            device_id: Device identifier
            device_type: Device type (mobile, desktop, tablet)
            platform: Platform (ios, android, web)
            ip_address: Client IP address
            user_agent: Client user agent string
            language_used: Language preference
            regional_context: Regional context
            professional_session_mode: Professional mode flag
            login_method: Login method used
            mfa_completed: MFA completion flag

        Returns:
            Created session row as dict
        """
        query = """
        INSERT INTO iraqi_authentication_sessions (
            id, user_id, session_token, refresh_token, expires_at,
            cultural_context_snapshot, device_id, device_type, platform,
            ip_address, user_agent, language_used, regional_context,
            professional_session_mode, login_method, mfa_completed,
            session_status, last_activity, created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        RETURNING *
        """

        now = datetime.now(timezone.utc)

        # Safely serialize cultural context
        try:
            cultural_json = json.dumps(cultural_context_snapshot)
        except (TypeError, ValueError) as e:
            # Fallback: try with default=str for non-serializable objects
            try:
                cultural_json = json.dumps(cultural_context_snapshot, default=str)
            except (TypeError, ValueError):
                # Ultimate fallback: empty object
                cultural_json = "{}"
                # Log the error with context
                import logging

                logger = logging.getLogger(__name__)
                logger.warning(
                    f"Failed to serialize cultural_context_snapshot for session {session_id}: {e}"
                )

        row = await DatabaseClient.fetchrow(
            query,
            session_id,
            user_id,
            session_token,
            refresh_token,
            expires_at,
            cultural_json,
            device_id,
            device_type,
            platform,
            ip_address,
            user_agent,
            language_used,
            regional_context,
            professional_session_mode,
            login_method,
            mfa_completed,
            "active",
            now,
            now,
        )

        return row

    @staticmethod
    async def get_session(session_id: str) -> Optional[Dict[str, Any]]:
        """
        Get session by ID

        Args:
            session_id: Session ID

        Returns:
            Session row or None
        """
        query = """
        SELECT * FROM iraqi_authentication_sessions
        WHERE id = $1
        """
        return await DatabaseClient.fetchrow(query, session_id)

    @staticmethod
    async def get_session_by_token(access_token: str) -> Optional[Dict[str, Any]]:
        """
        Get session by access token

        Args:
            access_token: JWT access token

        Returns:
            Session row or None
        """
        query = """
        SELECT * FROM iraqi_authentication_sessions
        WHERE session_token = $1
        """
        return await DatabaseClient.fetchrow(query, access_token)

    @staticmethod
    async def update_last_activity(session_id: str) -> bool:
        """
        Update session last_activity timestamp

        Args:
            session_id: Session ID

        Returns:
            True if updated
        """
        query = """
        UPDATE iraqi_authentication_sessions
        SET last_activity = $1
        WHERE id = $2 AND session_status = 'active'
        """
        result = await DatabaseClient.execute(
            query, datetime.now(timezone.utc), session_id
        )
        return "UPDATE 1" in result

    @staticmethod
    async def revoke_session(session_id: str) -> bool:
        """
        Revoke session by setting status to 'revoked'

        Args:
            session_id: Session ID

        Returns:
            True if revoked
        """
        query = """
        UPDATE iraqi_authentication_sessions
        SET session_status = 'revoked'
        WHERE id = $1
        """
        result = await DatabaseClient.execute(query, session_id)
        return "UPDATE 1" in result

    @staticmethod
    async def revoke_all_user_sessions(user_id: str) -> int:
        """
        Revoke all active sessions for a user

        Args:
            user_id: User ID

        Returns:
            Number of sessions revoked
        """
        query = """
        UPDATE iraqi_authentication_sessions
        SET session_status = 'revoked'
        WHERE user_id = $1 AND session_status = 'active'
        """
        result = await DatabaseClient.execute(query, user_id)
        # Extract count from "UPDATE N" string
        return int(result.split(" ")[1]) if " " in result else 0

    @staticmethod
    async def get_active_sessions(user_id: str) -> List[Dict[str, Any]]:
        """
        Get all active sessions for a user

        Args:
            user_id: User ID

        Returns:
            List of active session rows
        """
        query = """
        SELECT * FROM iraqi_authentication_sessions
        WHERE user_id = $1 AND session_status = 'active' AND expires_at > $2
        ORDER BY created_at DESC
        """
        return await DatabaseClient.fetch(query, user_id, datetime.now(timezone.utc))

    @staticmethod
    async def cleanup_expired_sessions() -> int:
        """
        Mark expired sessions as expired

        Returns:
            Number of sessions marked as expired
        """
        query = """
        UPDATE iraqi_authentication_sessions
        SET session_status = 'expired'
        WHERE session_status = 'active' AND expires_at < $1
        """
        result = await DatabaseClient.execute(query, datetime.now(timezone.utc))
        return int(result.split(" ")[1]) if " " in result else 0
