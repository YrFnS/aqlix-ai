-- Add revoked_at timestamp field to iraqi_authentication_sessions
-- Created: 2025-01-20
-- Purpose: Enable proper session revocation tracking and cleanup

-- Add revoked_at column for tracking when sessions were revoked
ALTER TABLE public.iraqi_authentication_sessions
ADD COLUMN IF NOT EXISTS revoked_at TIMESTAMP WITH TIME ZONE;

-- Add index on revoked_at for efficient cleanup queries
CREATE INDEX IF NOT EXISTS idx_auth_sessions_revoked_at
ON public.iraqi_authentication_sessions(revoked_at)
WHERE revoked_at IS NOT NULL;

-- Add index on session_status and revoked_at for efficient revoked session queries
CREATE INDEX IF NOT EXISTS idx_auth_sessions_status_revoked
ON public.iraqi_authentication_sessions(session_status, revoked_at)
WHERE session_status = 'revoked';

-- Add comment for documentation
COMMENT ON COLUMN public.iraqi_authentication_sessions.revoked_at IS
'Timestamp when session was revoked (NULL for non-revoked sessions). Used for audit trail and cleanup of old revoked sessions.';
