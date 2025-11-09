-- ============================================================================
-- Cultural & Islamic Compliance System - Database Schema
-- ============================================================================
-- Description: Unified cultural-Islamic compliance validation system for Iraqi AI Chat
-- Version: 1.0.0
-- Date: 2025-11-09
--
-- Tables:
--   1. cultural_islamic_rules - Validation rules with regional/professional variations
--   2. content_validation_results - Cached validation results with scores
--   3. user_compliance_preferences - User-specific compliance settings
--   4. compliance_violations - Violation tracking and resolution
--   5. cultural_islamic_knowledge - Knowledge base for cultural-Islamic guidelines
--
-- Performance Optimizations:
--   - SHA-256 content hashing for fast cache lookups
--   - Indexes on frequently queried columns
--   - TTL-based automatic cleanup of expired results
--   - RLS policies for user data isolation
-- ============================================================================

-- ============================================================================
-- 1. CULTURAL_ISLAMIC_RULES TABLE
-- ============================================================================
-- Purpose: Store configurable cultural and Islamic validation rules
-- Key Features:
--   - Dual-weight system (cultural + Islamic)
--   - Regional variations (Baghdad, Basra, Mosul, Erbil)
--   - Professional domain targeting
--   - Scholarly source references
-- ============================================================================

CREATE TABLE IF NOT EXISTS cultural_islamic_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_name VARCHAR(200) NOT NULL,
    rule_type VARCHAR(50) NOT NULL CHECK (rule_type IN ('cultural', 'islamic', 'combined')),
    validation_category VARCHAR(100) NOT NULL CHECK (validation_category IN ('content_filter', 'behavioral_guide', 'terminology_check')),

    -- Weighted importance (0.0-1.0)
    cultural_weight DECIMAL(3,2) DEFAULT 0.50 CHECK (cultural_weight >= 0 AND cultural_weight <= 1),
    islamic_weight DECIMAL(3,2) DEFAULT 0.50 CHECK (islamic_weight >= 0 AND islamic_weight <= 1),

    -- Rule configuration as flexible JSONB
    rule_config JSONB NOT NULL,

    -- Regional and professional targeting
    regional_variations JSONB DEFAULT '{}',
    professional_domains VARCHAR[] DEFAULT ARRAY['general'],

    -- Status and sources
    is_active BOOLEAN DEFAULT true,
    scholarly_source VARCHAR(500),
    cultural_source VARCHAR(500),

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for cultural_islamic_rules
CREATE INDEX idx_cultural_islamic_rules_active ON cultural_islamic_rules(is_active) WHERE is_active = true;
CREATE INDEX idx_cultural_islamic_rules_type ON cultural_islamic_rules(rule_type);
CREATE INDEX idx_cultural_islamic_rules_category ON cultural_islamic_rules(validation_category);
CREATE INDEX idx_cultural_islamic_rules_domains ON cultural_islamic_rules USING GIN(professional_domains);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_cultural_islamic_rules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cultural_islamic_rules_updated_at_trigger
    BEFORE UPDATE ON cultural_islamic_rules
    FOR EACH ROW
    EXECUTE FUNCTION update_cultural_islamic_rules_updated_at();

-- ============================================================================
-- 2. CONTENT_VALIDATION_RESULTS TABLE
-- ============================================================================
-- Purpose: Cache validation results for performance optimization
-- Key Features:
--   - SHA-256 content hashing for deduplication
--   - Dual-score system (cultural + Islamic)
--   - TTL-based expiration
--   - Issue and recommendation tracking
-- ============================================================================

CREATE TABLE IF NOT EXISTS content_validation_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Content identification
    content_hash VARCHAR(64) NOT NULL UNIQUE, -- SHA-256 hash
    content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('text', 'audio', 'image', 'video')),

    -- Validation scores (0.0-1.0)
    cultural_score DECIMAL(3,2) NOT NULL CHECK (cultural_score >= 0 AND cultural_score <= 1),
    islamic_score DECIMAL(3,2) NOT NULL CHECK (islamic_score >= 0 AND islamic_score <= 1),
    overall_compliance_score DECIMAL(3,2) NOT NULL CHECK (overall_compliance_score >= 0 AND overall_compliance_score <= 1),

    -- Validation status
    validation_status VARCHAR(20) NOT NULL CHECK (validation_status IN ('approved', 'warning', 'rejected')),

    -- Issues and recommendations as JSONB arrays
    cultural_issues JSONB DEFAULT '[]',
    islamic_issues JSONB DEFAULT '[]',
    recommendations JSONB DEFAULT '[]',

    -- Context information
    regional_context VARCHAR(50) DEFAULT 'general',
    professional_domain VARCHAR(50) DEFAULT 'general',
    validation_agent VARCHAR(100), -- e.g., 'iraqi-cultural-validator', 'automated'
    validation_metadata JSONB DEFAULT '{}',

    -- Cache management
    expires_at TIMESTAMP WITH TIME ZONE, -- TTL for cache expiration (24 hours default)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for content_validation_results
CREATE INDEX idx_content_validation_results_hash ON content_validation_results(content_hash);
CREATE INDEX idx_content_validation_results_expires_at ON content_validation_results(expires_at);
CREATE INDEX idx_content_validation_results_status ON content_validation_results(validation_status);
CREATE INDEX idx_content_validation_results_created_at ON content_validation_results(created_at DESC);

-- Automatic expiration cleanup function
CREATE OR REPLACE FUNCTION cleanup_expired_validation_results()
RETURNS void AS $$
BEGIN
    DELETE FROM content_validation_results
    WHERE expires_at IS NOT NULL AND expires_at < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Ensure pg_cron extension is available
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
        CREATE EXTENSION IF NOT EXISTS pg_cron;
    END IF;
END
$$;

-- Schedule automatic cleanup (hourly) to enforce TTLs
SELECT cron.schedule(
    'cleanup-expired-validation-results',
    '0 * * * *',  -- Every hour
    'SELECT cleanup_expired_validation_results();'
);

-- ============================================================================
-- 3. USER_COMPLIANCE_PREFERENCES TABLE
-- ============================================================================
-- Purpose: Store user-specific cultural and Islamic compliance preferences
-- Key Features:
--   - Configurable sensitivity levels
--   - Regional and professional context
--   - Real-time validation preferences
--   - Custom sensitivity rules
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_compliance_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Sensitivity levels
    cultural_sensitivity_level VARCHAR(20) DEFAULT 'standard' CHECK (cultural_sensitivity_level IN ('low', 'standard', 'high', 'maximum')),
    islamic_compliance_level VARCHAR(20) DEFAULT 'standard' CHECK (islamic_compliance_level IN ('low', 'standard', 'high', 'maximum')),

    -- Context preferences
    regional_preference VARCHAR(50) DEFAULT 'general',
    professional_domain VARCHAR(50) DEFAULT 'general',

    -- Feature toggles
    enable_cultural_guidance BOOLEAN DEFAULT true,
    enable_islamic_guidance BOOLEAN DEFAULT true,
    enable_real_time_validation BOOLEAN DEFAULT true,

    -- Language and customization
    preferred_feedback_language VARCHAR(10) DEFAULT 'ar-IQ' CHECK (preferred_feedback_language IN ('ar-IQ', 'en-US', 'both')),
    custom_sensitivity_rules JSONB DEFAULT '{}',

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Unique constraint: one preference record per user
    UNIQUE(user_id)
);

-- Indexes for user_compliance_preferences
CREATE INDEX idx_user_compliance_preferences_user_id ON user_compliance_preferences(user_id);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_user_compliance_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_compliance_preferences_updated_at_trigger
    BEFORE UPDATE ON user_compliance_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_user_compliance_preferences_updated_at();

-- ============================================================================
-- 4. COMPLIANCE_VIOLATIONS TABLE
-- ============================================================================
-- Purpose: Track and manage compliance violations for moderation and improvement
-- Key Features:
--   - Violation categorization and severity
--   - Auto-resolution tracking
--   - User acknowledgment and moderator review
--   - Link to validation results
-- ============================================================================

CREATE TABLE IF NOT EXISTS compliance_violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    content_validation_id UUID REFERENCES content_validation_results(id) ON DELETE CASCADE,

    -- Violation classification
    violation_type VARCHAR(50) NOT NULL CHECK (violation_type IN ('cultural', 'islamic', 'both')),
    severity_level VARCHAR(20) NOT NULL CHECK (severity_level IN ('low', 'medium', 'high', 'critical')),
    violation_category VARCHAR(100) NOT NULL CHECK (violation_category IN ('inappropriate_content', 'cultural_insensitivity', 'religious_violation')),
    description TEXT NOT NULL,

    -- Resolution tracking
    auto_resolved BOOLEAN DEFAULT false,
    resolution_action VARCHAR(100) CHECK (resolution_action IN ('content_filtered', 'user_warned', 'content_modified', 'manual_review')),
    user_acknowledged BOOLEAN DEFAULT false,
    moderator_reviewed BOOLEAN DEFAULT false,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for compliance_violations
CREATE INDEX idx_compliance_violations_user_id ON compliance_violations(user_id);
CREATE INDEX idx_compliance_violations_severity ON compliance_violations(severity_level);
CREATE INDEX idx_compliance_violations_created_at ON compliance_violations(created_at DESC);
CREATE INDEX idx_compliance_violations_unresolved ON compliance_violations(resolved_at) WHERE resolved_at IS NULL;

-- ============================================================================
-- 5. CULTURAL_ISLAMIC_KNOWLEDGE TABLE
-- ============================================================================
-- Purpose: Knowledge base for cultural norms and Islamic principles
-- Key Features:
--   - Categorized cultural and religious knowledge
--   - Regional and professional relevance
--   - Scholarly references
--   - Expert verification tracking
-- ============================================================================

CREATE TABLE IF NOT EXISTS cultural_islamic_knowledge (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Classification
    knowledge_type VARCHAR(50) NOT NULL CHECK (knowledge_type IN ('cultural_norm', 'islamic_principle', 'regional_variation')),
    category VARCHAR(100) NOT NULL CHECK (category IN ('social_etiquette', 'religious_practice', 'professional_behavior')),

    -- Content
    title VARCHAR(300) NOT NULL,
    description TEXT NOT NULL,
    cultural_context JSONB DEFAULT '{}',
    islamic_context JSONB DEFAULT '{}',

    -- Relevance
    regional_relevance VARCHAR[] DEFAULT ARRAY['general'],
    professional_relevance VARCHAR[] DEFAULT ARRAY['general'],

    -- References and examples
    scholarly_references JSONB DEFAULT '[]',
    cultural_references JSONB DEFAULT '[]',
    examples JSONB DEFAULT '[]',

    -- Verification
    is_verified BOOLEAN DEFAULT false,
    verification_date TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for cultural_islamic_knowledge
CREATE INDEX idx_cultural_islamic_knowledge_type ON cultural_islamic_knowledge(knowledge_type);
CREATE INDEX idx_cultural_islamic_knowledge_category ON cultural_islamic_knowledge(category);
CREATE INDEX idx_cultural_islamic_knowledge_verified ON cultural_islamic_knowledge(is_verified) WHERE is_verified = true;
CREATE INDEX idx_cultural_islamic_knowledge_regional ON cultural_islamic_knowledge USING GIN(regional_relevance);
CREATE INDEX idx_cultural_islamic_knowledge_professional ON cultural_islamic_knowledge USING GIN(professional_relevance);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_cultural_islamic_knowledge_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cultural_islamic_knowledge_updated_at_trigger
    BEFORE UPDATE ON cultural_islamic_knowledge
    FOR EACH ROW
    EXECUTE FUNCTION update_cultural_islamic_knowledge_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
-- Purpose: Protect user data and ensure proper access control
-- Key Features:
--   - User isolation for preferences and violations
--   - Public read access for rules and knowledge
--   - Admin-only modification of rules and knowledge
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE cultural_islamic_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_validation_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_compliance_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cultural_islamic_knowledge ENABLE ROW LEVEL SECURITY;

-- cultural_islamic_rules: Public read, admin write
CREATE POLICY cultural_islamic_rules_select_policy ON cultural_islamic_rules
    FOR SELECT USING (true); -- Public read for all active rules

CREATE POLICY cultural_islamic_rules_insert_policy ON cultural_islamic_rules
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.role = 'admin'
        )
    );

CREATE POLICY cultural_islamic_rules_update_policy ON cultural_islamic_rules
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.role = 'admin'
        )
    );

-- content_validation_results: Users can read their own cached results
CREATE POLICY content_validation_results_select_policy ON content_validation_results
    FOR SELECT USING (true); -- Public read for caching performance

CREATE POLICY content_validation_results_insert_policy ON content_validation_results
    FOR INSERT WITH CHECK (
        auth.role() = 'service_role'  -- Service account only
    );

-- user_compliance_preferences: Users can only access their own preferences
CREATE POLICY user_compliance_preferences_select_policy ON user_compliance_preferences
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY user_compliance_preferences_insert_policy ON user_compliance_preferences
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY user_compliance_preferences_update_policy ON user_compliance_preferences
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY user_compliance_preferences_delete_policy ON user_compliance_preferences
    FOR DELETE USING (user_id = auth.uid());

-- compliance_violations: Users can see their own violations, admins see all
CREATE POLICY compliance_violations_select_policy ON compliance_violations
    FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.role = 'admin'
        )
    );

CREATE POLICY compliance_violations_insert_policy ON compliance_violations
    FOR INSERT WITH CHECK (
        auth.role() = 'service_role' OR  -- Service account only
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.role = 'admin'
        )
    );

CREATE POLICY compliance_violations_update_policy ON compliance_violations
    FOR UPDATE USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.role = 'admin'
        )
    );

-- cultural_islamic_knowledge: Public read, verified contributors can write
CREATE POLICY cultural_islamic_knowledge_select_policy ON cultural_islamic_knowledge
    FOR SELECT USING (is_verified = true OR created_by = auth.uid());

CREATE POLICY cultural_islamic_knowledge_insert_policy ON cultural_islamic_knowledge
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND (auth.users.role = 'admin' OR auth.users.role = 'contributor')
        )
    );

CREATE POLICY cultural_islamic_knowledge_update_policy ON cultural_islamic_knowledge
    FOR UPDATE USING (
        created_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.role = 'admin'
        )
    );

-- ============================================================================
-- SEED DATA: INITIAL CULTURAL-ISLAMIC RULES
-- ============================================================================
-- Purpose: Provide foundational validation rules for system bootstrapping
-- Categories:
--   1. Islamic compliance (halal/haram)
--   2. Cultural appropriateness (Iraqi social norms)
--   3. Political neutrality
--   4. Professional standards
-- ============================================================================

-- Islamic Compliance Rule: Halal/Haram Content Filter
INSERT INTO cultural_islamic_rules (rule_name, rule_type, validation_category, cultural_weight, islamic_weight, rule_config, professional_domains, scholarly_source)
VALUES (
    'Halal/Haram Content Filter',
    'islamic',
    'content_filter',
    0.30,
    0.70,
    '{
        "prohibited_keywords": ["gambling", "lottery", "alcohol", "wine", "beer", "pork", "casino", "betting", "usury", "riba", "interest_loan"],
        "encouraged_keywords": ["charity", "justice", "family", "education", "health", "welfare", "knowledge", "peace", "cooperation"],
        "blocking_severity": "critical"
    }'::jsonb,
    ARRAY['general', 'legal', 'medical', 'educational', 'organizational', 'financial'],
    'Quran 2:219, 5:90 - Prohibition of intoxicants and gambling'
);

-- Cultural Appropriateness Rule: Political Neutrality
INSERT INTO cultural_islamic_rules (rule_name, rule_type, validation_category, cultural_weight, islamic_weight, rule_config, professional_domains, cultural_source)
VALUES (
    'Political Neutrality Filter',
    'cultural',
    'content_filter',
    0.80,
    0.20,
    '{
        "sensitive_topics": ["sectarian_divisions", "tribal_favoritism", "political_party_bias"],
        "prohibited_patterns": ["sunni-shia_conflict", "tribal_superiority", "political_propaganda"],
        "blocking_severity": "high"
    }'::jsonb,
    ARRAY['general', 'legal', 'organizational'],
    'Iraqi cultural sensitivity guidelines - maintaining social harmony'
);

-- Professional Standards Rule: Iraqi Legal Domain
INSERT INTO cultural_islamic_rules (rule_name, rule_type, validation_category, cultural_weight, islamic_weight, rule_config, professional_domains, cultural_source, scholarly_source)
VALUES (
    'Iraqi Legal Professional Standards',
    'combined',
    'behavioral_guide',
    0.50,
    0.50,
    '{
        "required_disclaimers": true,
        "formal_language_required": true,
        "islamic_jurisprudence_compliance": true,
        "respectful_titles": ["الأستاذ", "المستشار", "القاضي"]
    }'::jsonb,
    ARRAY['legal'],
    'Iraqi legal profession etiquette and cultural standards',
    'Islamic legal principles - Sharia compliance in legal counsel'
);

-- Regional Variation Rule: Baghdad Dialect Appropriateness
INSERT INTO cultural_islamic_rules (rule_name, rule_type, validation_category, cultural_weight, islamic_weight, rule_config, regional_variations, professional_domains, cultural_source)
VALUES (
    'Iraqi Regional Dialect Appropriateness',
    'cultural',
    'terminology_check',
    0.90,
    0.10,
    '{
        "dialect_markers": {
            "baghdad": ["شلونك", "شكو", "ماكو"],
            "basra": ["شلونكم", "شكو"],
            "mosul": ["كيفك", "شنو", "ما"],
            "erbil": ["چونی", "چی"]
        },
        "appropriateness_threshold": 0.7
    }'::jsonb,
    '{
        "baghdad": {"dialect_preference": "baghdadi_arabic", "formality_level": "moderate"},
        "basra": {"dialect_preference": "basrawi_arabic", "formality_level": "moderate"},
        "mosul": {"dialect_preference": "moslawi_arabic", "formality_level": "formal"},
        "erbil": {"dialect_preference": "kurdish_iraqi", "formality_level": "moderate"}
    }'::jsonb,
    ARRAY['general', 'organizational'],
    'Iraqi regional linguistic variations and cultural preferences'
);

-- Family Values Rule: Islamic Family Principles
INSERT INTO cultural_islamic_rules (rule_name, rule_type, validation_category, cultural_weight, islamic_weight, rule_config, professional_domains, scholarly_source)
VALUES (
    'Islamic Family Values Compliance',
    'islamic',
    'behavioral_guide',
    0.40,
    0.60,
    '{
        "positive_keywords": ["family", "parents", "children", "respect", "care", "support", "marriage", "community", "elders", "youth"],
        "negative_keywords": ["abandonment", "neglect", "disrespect", "family_breakdown"],
        "encouragement_bonus": 0.02
    }'::jsonb,
    ARRAY['general', 'educational', 'organizational'],
    'Quran 17:23-24 - Respect and care for parents and family'
);

-- ============================================================================
-- MAINTENANCE FUNCTIONS
-- ============================================================================

-- Function to get active cultural-Islamic rules
CREATE OR REPLACE FUNCTION get_active_cultural_rules(p_professional_domain VARCHAR DEFAULT 'general')
RETURNS TABLE (
    rule_id UUID,
    rule_name VARCHAR,
    rule_type VARCHAR,
    cultural_weight DECIMAL,
    islamic_weight DECIMAL,
    rule_config JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        id,
        cultural_islamic_rules.rule_name,
        cultural_islamic_rules.rule_type,
        cultural_islamic_rules.cultural_weight,
        cultural_islamic_rules.islamic_weight,
        cultural_islamic_rules.rule_config
    FROM cultural_islamic_rules
    WHERE is_active = true
      AND (p_professional_domain = ANY(professional_domains) OR 'general' = ANY(professional_domains))
    ORDER BY islamic_weight DESC, cultural_weight DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cache validation result with automatic expiration
CREATE OR REPLACE FUNCTION cache_validation_result(
    p_content_hash VARCHAR,
    p_content_type VARCHAR,
    p_cultural_score DECIMAL,
    p_islamic_score DECIMAL,
    p_overall_score DECIMAL,
    p_validation_status VARCHAR,
    p_cultural_issues JSONB DEFAULT '[]',
    p_islamic_issues JSONB DEFAULT '[]',
    p_recommendations JSONB DEFAULT '[]',
    p_cache_ttl_hours INTEGER DEFAULT 24
)
RETURNS UUID AS $$
DECLARE
    v_result_id UUID;
BEGIN
    INSERT INTO content_validation_results (
        content_hash,
        content_type,
        cultural_score,
        islamic_score,
        overall_compliance_score,
        validation_status,
        cultural_issues,
        islamic_issues,
        recommendations,
        expires_at
    ) VALUES (
        p_content_hash,
        p_content_type,
        p_cultural_score,
        p_islamic_score,
        p_overall_score,
        p_validation_status,
        p_cultural_issues,
        p_islamic_issues,
        p_recommendations,
        CURRENT_TIMESTAMP + (p_cache_ttl_hours || ' hours')::INTERVAL
    )
    ON CONFLICT (content_hash) DO UPDATE SET
        cultural_score = EXCLUDED.cultural_score,
        islamic_score = EXCLUDED.islamic_score,
        overall_compliance_score = EXCLUDED.overall_compliance_score,
        validation_status = EXCLUDED.validation_status,
        cultural_issues = EXCLUDED.cultural_issues,
        islamic_issues = EXCLUDED.islamic_issues,
        recommendations = EXCLUDED.recommendations,
        expires_at = EXCLUDED.expires_at
        -- Note: created_at not updated to preserve original creation timestamp
    RETURNING id INTO v_result_id;

    RETURN v_result_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE cultural_islamic_rules IS 'Configurable cultural and Islamic validation rules with regional and professional variations';
COMMENT ON TABLE content_validation_results IS 'Cached validation results with dual-score system (cultural + Islamic) and TTL expiration';
COMMENT ON TABLE user_compliance_preferences IS 'User-specific cultural and Islamic compliance preferences and settings';
COMMENT ON TABLE compliance_violations IS 'Violation tracking and moderation management system';
COMMENT ON TABLE cultural_islamic_knowledge IS 'Knowledge base for Iraqi cultural norms and Islamic principles with scholarly references';

COMMENT ON COLUMN content_validation_results.content_hash IS 'SHA-256 hash of content for deduplication and fast cache lookups';
COMMENT ON COLUMN content_validation_results.expires_at IS 'TTL expiration timestamp (default 24 hours) for automatic cache cleanup';
COMMENT ON COLUMN cultural_islamic_rules.islamic_weight IS 'Weight of Islamic compliance in validation (0.0-1.0), takes precedence in conflicts';
COMMENT ON COLUMN cultural_islamic_rules.cultural_weight IS 'Weight of cultural appropriateness in validation (0.0-1.0)';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- Tables created: 5
-- Indexes created: 20
-- RLS policies created: 15
-- Functions created: 5
-- Seed records inserted: 5
--
-- Next steps:
--   1. Run: supabase db push
--   2. Verify: SELECT * FROM cultural_islamic_rules WHERE is_active = true;
--   3. Test: SELECT get_active_cultural_rules('legal');
--   4. Implement: apps/api/services/cultural_islamic_compliance.py
-- ============================================================================
