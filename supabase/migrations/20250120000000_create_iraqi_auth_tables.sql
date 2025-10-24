-- Iraqi Authentication System - Complete Database Schema
-- Created: 2025-01-20
-- Purpose: Comprehensive authentication infrastructure with Iraqi cultural context

-- ============================================================================
-- TABLE 1: Iraqi User Authentication Profiles
-- Extends Supabase auth.users with Iraqi-specific data
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.iraqi_user_authentication (
    -- Primary key references Supabase auth.users
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Basic authentication info
    full_name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20),

    -- Iraqi context
    region VARCHAR(50) DEFAULT 'baghdad' CHECK (region IN ('baghdad', 'basra', 'mosul', 'erbil', 'other')),
    iraqi_id VARCHAR(50),
    iraqi_id_verified BOOLEAN DEFAULT false,
    iraqi_id_verification_date TIMESTAMP WITH TIME ZONE,

    -- Professional verification
    professional_domain VARCHAR(50) CHECK (professional_domain IN ('legal', 'medical', 'educational', 'engineering', 'organizational')),
    professional_license VARCHAR(100),
    professional_license_verified BOOLEAN DEFAULT false,
    professional_verification_date TIMESTAMP WITH TIME ZONE,
    institutional_affiliation VARCHAR(200),

    -- Cultural preferences
    cultural_context_id UUID,
    islamic_compliance_level VARCHAR(20) DEFAULT 'standard' CHECK (islamic_compliance_level IN ('basic', 'standard', 'strict')),
    language_preference VARCHAR(10) DEFAULT 'ar-IQ' CHECK (language_preference IN ('ar-IQ', 'en-US', 'both')),
    regional_cultural_variation VARCHAR(50),
    family_privacy_level VARCHAR(20) DEFAULT 'family' CHECK (family_privacy_level IN ('public', 'family', 'private')),

    -- Authentication settings
    mfa_enabled BOOLEAN DEFAULT false,
    mfa_methods VARCHAR[] DEFAULT ARRAY['email']::VARCHAR[],
    session_timeout_minutes INTEGER DEFAULT 480,  -- 8 hours
    require_reauth_for_sensitive BOOLEAN DEFAULT true,

    -- Cultural timing preferences
    respect_prayer_times BOOLEAN DEFAULT true,
    cultural_greeting_preferences JSONB DEFAULT '{}',
    professional_interface_preferences JSONB DEFAULT '{}',

    -- Account status
    account_status VARCHAR(20) DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'locked', 'deleted')),
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'email_verified', 'fully_verified')),
    last_login TIMESTAMP WITH TIME ZONE,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLE 2: Cultural Context for Authentication
-- Stores detailed cultural preferences and context
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.authentication_cultural_context (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Regional context
    region VARCHAR(50) NOT NULL,
    cultural_formality_level VARCHAR(20) DEFAULT 'standard' CHECK (cultural_formality_level IN ('casual', 'standard', 'formal')),
    professional_etiquette_level VARCHAR(20) DEFAULT 'standard' CHECK (professional_etiquette_level IN ('standard', 'formal', 'traditional')),

    -- Islamic preferences
    islamic_compliance_level VARCHAR(20) DEFAULT 'standard',
    prayer_time_consideration BOOLEAN DEFAULT true,
    islamic_greeting_preferences JSONB DEFAULT '{}',

    -- Language and communication
    primary_language VARCHAR(10) DEFAULT 'ar-IQ',
    secondary_language VARCHAR(10) DEFAULT 'en-US',
    dialect_preference VARCHAR(50),
    communication_style VARCHAR(20) DEFAULT 'respectful',

    -- Family and privacy
    family_privacy_level VARCHAR(20) DEFAULT 'family',
    professional_visibility BOOLEAN DEFAULT true,
    cultural_sensitivity_level VARCHAR(20) DEFAULT 'high',

    -- Authentication behavior
    greeting_customization JSONB DEFAULT '{}',
    cultural_mfa_preferences JSONB DEFAULT '{}',
    timing_preferences JSONB DEFAULT '{}',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLE 3: Authentication Sessions with Cultural Context
-- Manages user sessions with cultural and device context
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.iraqi_authentication_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Session management
    session_token VARCHAR(500) NOT NULL UNIQUE,
    refresh_token VARCHAR(500),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,

    -- Device and location context
    device_id VARCHAR(200),
    device_type VARCHAR(50),
    platform VARCHAR(50),
    ip_address INET,
    user_agent TEXT,

    -- Cultural session context
    cultural_context_snapshot JSONB NOT NULL,
    language_used VARCHAR(10),
    regional_context VARCHAR(50),
    professional_session_mode BOOLEAN DEFAULT false,

    -- Session behavior
    prayer_time_pauses INTEGER DEFAULT 0,
    cultural_adaptations_applied JSONB DEFAULT '[]',
    session_quality_score DECIMAL(3,2),

    -- Security tracking
    login_method VARCHAR(50),
    mfa_completed BOOLEAN DEFAULT false,
    suspicious_activity_score DECIMAL(3,2) DEFAULT 0,

    -- Session status
    session_status VARCHAR(20) DEFAULT 'active' CHECK (session_status IN ('active', 'expired', 'revoked')),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLE 4: Professional Domain Authentication
-- Manages professional credentials and verification
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.professional_domain_authentication (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Professional details
    professional_domain VARCHAR(50) NOT NULL CHECK (professional_domain IN ('legal', 'medical', 'educational', 'engineering', 'organizational')),
    license_number VARCHAR(100),
    license_type VARCHAR(100),
    issuing_authority VARCHAR(200),
    license_region VARCHAR(50),

    -- Verification details
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'expired')),
    verification_method VARCHAR(50),
    verification_date TIMESTAMP WITH TIME ZONE,
    verification_expiry TIMESTAMP WITH TIME ZONE,

    -- Institutional context
    institutional_affiliation VARCHAR(200),
    institutional_role VARCHAR(100),
    institutional_verification_status VARCHAR(20) DEFAULT 'pending',

    -- Professional authentication preferences
    professional_interface_mode VARCHAR(20) DEFAULT 'standard',
    professional_greeting_style VARCHAR(20) DEFAULT 'formal',
    confidentiality_level VARCHAR(20) DEFAULT 'high',

    -- Compliance and ethics
    ethics_compliance_verified BOOLEAN DEFAULT false,
    continuing_education_verified BOOLEAN DEFAULT false,
    professional_standards_acknowledged BOOLEAN DEFAULT false,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLE 5: MFA Configuration with Cultural Adaptation
-- Manages multi-factor authentication with cultural timing
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.cultural_mfa_configuration (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

    -- MFA methods
    enabled_methods VARCHAR[] DEFAULT ARRAY['email']::VARCHAR[],
    primary_method VARCHAR(20) DEFAULT 'email',
    backup_methods VARCHAR[] DEFAULT ARRAY[]::VARCHAR[],

    -- Cultural timing considerations
    respect_prayer_times BOOLEAN DEFAULT true,
    cultural_timing_flexibility INTEGER DEFAULT 15,  -- minutes
    preferred_communication_times JSONB DEFAULT '{}',

    -- SMS configuration
    sms_phone_number VARCHAR(20),
    sms_language_preference VARCHAR(10) DEFAULT 'ar-IQ',
    sms_cultural_style VARCHAR(20) DEFAULT 'respectful',

    -- Email configuration
    backup_email VARCHAR(255),
    email_language_preference VARCHAR(10) DEFAULT 'ar-IQ',
    email_cultural_formality VARCHAR(20) DEFAULT 'formal',

    -- Cultural question configuration
    cultural_questions_enabled BOOLEAN DEFAULT false,
    cultural_question_categories VARCHAR[] DEFAULT ARRAY[]::VARCHAR[],
    cultural_context_validation BOOLEAN DEFAULT true,

    -- Security preferences
    mfa_frequency VARCHAR(20) DEFAULT 'every_login' CHECK (mfa_frequency IN ('every_login', 'new_device', 'suspicious_activity', 'periodic')),
    remember_device_duration INTEGER DEFAULT 30,  -- days
    cultural_security_level VARCHAR(20) DEFAULT 'standard',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_iraqi_user_email ON public.iraqi_user_authentication(email);
CREATE INDEX IF NOT EXISTS idx_iraqi_user_region ON public.iraqi_user_authentication(region);
CREATE INDEX IF NOT EXISTS idx_iraqi_user_professional_domain ON public.iraqi_user_authentication(professional_domain);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id ON public.iraqi_authentication_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_token ON public.iraqi_authentication_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_status ON public.iraqi_authentication_sessions(session_status);
CREATE INDEX IF NOT EXISTS idx_professional_domain_user ON public.professional_domain_authentication(user_id);
CREATE INDEX IF NOT EXISTS idx_cultural_context_user ON public.authentication_cultural_context(user_id);
CREATE INDEX IF NOT EXISTS idx_mfa_config_user ON public.cultural_mfa_configuration(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.iraqi_user_authentication ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authentication_cultural_context ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iraqi_authentication_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_domain_authentication ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cultural_mfa_configuration ENABLE ROW LEVEL SECURITY;

-- Iraqi User Authentication Policies
CREATE POLICY "Users can view own authentication"
  ON public.iraqi_user_authentication
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own authentication"
  ON public.iraqi_user_authentication
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own authentication"
  ON public.iraqi_user_authentication
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Cultural Context Policies
CREATE POLICY "Users can view own cultural context"
  ON public.authentication_cultural_context
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cultural context"
  ON public.authentication_cultural_context
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cultural context"
  ON public.authentication_cultural_context
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Session Policies
CREATE POLICY "Users can view own sessions"
  ON public.iraqi_authentication_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON public.iraqi_authentication_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Professional Domain Policies
CREATE POLICY "Users can view own professional data"
  ON public.professional_domain_authentication
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own professional data"
  ON public.professional_domain_authentication
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own professional data"
  ON public.professional_domain_authentication
  FOR UPDATE
  USING (auth.uid() = user_id);

-- MFA Configuration Policies
CREATE POLICY "Users can view own MFA config"
  ON public.cultural_mfa_configuration
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own MFA config"
  ON public.cultural_mfa_configuration
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own MFA config"
  ON public.cultural_mfa_configuration
  FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_iraqi_user_auth_updated_at
    BEFORE UPDATE ON public.iraqi_user_authentication
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cultural_context_updated_at
    BEFORE UPDATE ON public.authentication_cultural_context
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_professional_domain_updated_at
    BEFORE UPDATE ON public.professional_domain_authentication
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mfa_config_updated_at
    BEFORE UPDATE ON public.cultural_mfa_configuration
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE public.iraqi_user_authentication IS 'Iraqi user authentication profiles extending Supabase auth.users with cultural context';
COMMENT ON TABLE public.authentication_cultural_context IS 'Cultural preferences and context for authentication';
COMMENT ON TABLE public.iraqi_authentication_sessions IS 'User sessions with cultural and device context';
COMMENT ON TABLE public.professional_domain_authentication IS 'Professional credentials and verification for Iraqi domains';
COMMENT ON TABLE public.cultural_mfa_configuration IS 'Multi-factor authentication configuration with cultural timing';
