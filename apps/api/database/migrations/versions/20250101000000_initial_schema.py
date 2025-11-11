"""Initial database schema

Revision ID: 20250101000000
Revises:
Create Date: 2025-01-01 00:00:00.000000

Creates all initial tables for:
- User management and authentication
- Chat sessions and messages
- Documents and file storage
- Payment transactions
- Session management
- Cultural compliance tracking
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic
revision = "20250101000000"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Create initial database schema"""

    # Create enum types
    op.execute("CREATE TYPE user_role AS ENUM ('user', 'admin', 'moderator')")
    op.execute(
        "CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')"
    )
    op.execute("CREATE TYPE chat_message_role AS ENUM ('user', 'assistant', 'system')")
    op.execute(
        "CREATE TYPE document_status AS ENUM ('pending', 'processing', 'completed', 'failed')"
    )

    # Users table
    op.create_table(
        "users",
        sa.Column("id", sa.String(36), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("phone", sa.String(20), nullable=True),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column(
            "role",
            postgresql.ENUM("user", "admin", "moderator", name="user_role"),
            nullable=False,
            server_default="user",
        ),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column(
            "email_verified", sa.Boolean(), nullable=False, server_default="false"
        ),
        sa.Column(
            "phone_verified", sa.Boolean(), nullable=False, server_default="false"
        ),
        sa.Column("mfa_enabled", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column(
            "created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()
        ),
        sa.Column(
            "updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email"),
        sa.Index("idx_users_email", "email"),
        sa.Index("idx_users_is_active", "is_active"),
    )

    # Sessions table
    op.create_table(
        "user_sessions",
        sa.Column("id", sa.String(36), nullable=False),
        sa.Column("user_id", sa.String(36), nullable=False),
        sa.Column("token", sa.String(500), nullable=False),
        sa.Column("refresh_token", sa.String(500), nullable=True),
        sa.Column("ip_address", sa.String(45), nullable=True),
        sa.Column("user_agent", sa.String(500), nullable=True),
        sa.Column("expires_at", sa.DateTime(), nullable=False),
        sa.Column("revoked_at", sa.DateTime(), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()
        ),
        sa.Column(
            "updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.Index("idx_sessions_user_id", "user_id"),
        sa.Index("idx_sessions_token", "token"),
    )

    # Chat sessions table
    op.create_table(
        "chat_sessions",
        sa.Column("id", sa.String(36), nullable=False),
        sa.Column("user_id", sa.String(36), nullable=False),
        sa.Column("title", sa.String(255), nullable=True),
        sa.Column("language", sa.String(10), nullable=False, server_default="ar"),
        sa.Column("dialect", sa.String(50), nullable=True),
        sa.Column("message_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column(
            "created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()
        ),
        sa.Column(
            "updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.Index("idx_chat_sessions_user_id", "user_id"),
        sa.Index("idx_chat_sessions_created_at", "created_at"),
    )

    # Chat messages table
    op.create_table(
        "chat_messages",
        sa.Column("id", sa.String(36), nullable=False),
        sa.Column("session_id", sa.String(36), nullable=False),
        sa.Column(
            "role",
            postgresql.ENUM("user", "assistant", "system", name="chat_message_role"),
            nullable=False,
        ),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("tokens_used", sa.Integer(), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()
        ),
        sa.Column(
            "updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(
            ["session_id"], ["chat_sessions.id"], ondelete="CASCADE"
        ),
        sa.Index("idx_chat_messages_session_id", "session_id"),
        sa.Index("idx_chat_messages_created_at", "created_at"),
    )

    # Documents table
    op.create_table(
        "documents",
        sa.Column("id", sa.String(36), nullable=False),
        sa.Column("user_id", sa.String(36), nullable=False),
        sa.Column("filename", sa.String(255), nullable=False),
        sa.Column("title", sa.String(255), nullable=True),
        sa.Column("content_type", sa.String(100), nullable=False),
        sa.Column("size_bytes", sa.Integer(), nullable=False),
        sa.Column(
            "status",
            postgresql.ENUM(
                "pending", "processing", "completed", "failed", name="document_status"
            ),
            nullable=False,
            server_default="pending",
        ),
        sa.Column("storage_url", sa.String(500), nullable=True),
        sa.Column(
            "tags", postgresql.ARRAY(sa.String()), nullable=False, server_default="{}"
        ),
        sa.Column("processed_at", sa.DateTime(), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()
        ),
        sa.Column(
            "updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.Index("idx_documents_user_id", "user_id"),
        sa.Index("idx_documents_status", "status"),
        sa.Index("idx_documents_created_at", "created_at"),
    )

    # Payments table
    op.create_table(
        "payments",
        sa.Column("id", sa.String(36), nullable=False),
        sa.Column("user_id", sa.String(36), nullable=False),
        sa.Column("amount", sa.Integer(), nullable=False),
        sa.Column("currency", sa.String(10), nullable=False, server_default="IQD"),
        sa.Column("gateway", sa.String(50), nullable=False),
        sa.Column("gateway_transaction_id", sa.String(255), nullable=True),
        sa.Column(
            "status",
            postgresql.ENUM(
                "pending",
                "processing",
                "completed",
                "failed",
                "cancelled",
                "refunded",
                name="payment_status",
            ),
            nullable=False,
            server_default="pending",
        ),
        sa.Column("payment_method", sa.String(50), nullable=False),
        sa.Column("description", sa.String(500), nullable=True),
        sa.Column("order_id", sa.String(255), nullable=True),
        sa.Column("completed_at", sa.DateTime(), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()
        ),
        sa.Column(
            "updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.Index("idx_payments_user_id", "user_id"),
        sa.Index("idx_payments_status", "status"),
        sa.Index("idx_payments_gateway_transaction_id", "gateway_transaction_id"),
        sa.Index("idx_payments_created_at", "created_at"),
    )

    # Cultural compliance tracking
    op.create_table(
        "cultural_compliance_logs",
        sa.Column("id", sa.String(36), nullable=False),
        sa.Column("user_id", sa.String(36), nullable=False),
        sa.Column("content_type", sa.String(50), nullable=False),
        sa.Column("content_id", sa.String(36), nullable=False),
        sa.Column("compliance_score", sa.Float(), nullable=True),
        sa.Column("islamic_compliance_score", sa.Float(), nullable=True),
        sa.Column("dialect_accuracy", sa.Float(), nullable=True),
        sa.Column(
            "flags", postgresql.ARRAY(sa.String()), nullable=False, server_default="{}"
        ),
        sa.Column(
            "created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.Index("idx_cultural_compliance_user_id", "user_id"),
        sa.Index("idx_cultural_compliance_created_at", "created_at"),
    )

    # Create indexes for common queries
    op.create_index("idx_users_created_at", "users", ["created_at"])
    op.create_index("idx_payments_gateway", "payments", ["gateway"])
    op.create_index("idx_chat_sessions_updated_at", "chat_sessions", ["updated_at"])


def downgrade() -> None:
    """Drop all tables and types"""

    # Drop tables in reverse order of dependencies
    op.drop_table("cultural_compliance_logs")
    op.drop_table("payments")
    op.drop_table("documents")
    op.drop_table("chat_messages")
    op.drop_table("chat_sessions")
    op.drop_table("user_sessions")
    op.drop_table("users")

    # Drop enum types
    op.execute("DROP TYPE IF EXISTS payment_status")
    op.execute("DROP TYPE IF EXISTS chat_message_role")
    op.execute("DROP TYPE IF EXISTS document_status")
    op.execute("DROP TYPE IF EXISTS user_role")
