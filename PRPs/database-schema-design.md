name: "Database Schema Design - Iraqi AI Chat System Foundation"
description: |
  Comprehensive database schema design for the Iraqi AI Chat System using PostgreSQL/Supabase
  with Iraqi-specific tables, cultural data structures, Arabic text support, professional domain
  integration, and production-ready performance optimization with proper relationships and constraints.

## Goal
Design and implement a comprehensive PostgreSQL database schema using Supabase that provides structured data storage for users, conversations, cultural context, and system data with proper relationships, constraints, indexes, and Row-Level Security (RLS) policies specifically tailored for the Iraqi AI Chat System's cultural, linguistic, and professional requirements.

## Why
- **Infrastructure Foundation**: Every feature needs structured data persistence - this is the bedrock for all functionality
- **Iraqi Cultural Integration**: Enable cultural validation data storage, Arabic content management, and Islamic compliance tracking
- **Professional Domain Support**: Store Iraqi legal, medical, educational, and organizational domain-specific data with proper validation
- **Scalability Foundation**: Proper schema design supports growing user base and feature complexity efficiently
- **Data Integrity**: Strong relationships and constraints prevent data corruption and ensure system reliability
- **Performance Optimization**: Strategic indexes and query patterns enable fast response times at scale

## What
A production-ready database schema with tables for users, conversations, messages, cultural data, system configuration, and Iraqi-specific features with proper PostgreSQL constraints, foreign key relationships, indexes, RLS policies, and migration scripts for version-controlled deployment.

### Success Criteria
- [ ] All tables created with proper column types, constraints, and relationships
- [ ] Database indexes implemented for optimal query performance (<100ms for common operations)
- [ ] Row-Level Security (RLS) policies secure all sensitive data access
- [ ] Migration scripts execute successfully without data loss
- [ ] Arabic text support with proper collation and RTL handling
- [ ] Cultural compliance validation constraints ensure Islamic principles
- [ ] Professional domain categorization supports Iraqi specializations
- [ ] Type-safe database client integration works with existing packages
- [ ] Performance tests validate query optimization for 10,000+ users

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- url: https://supabase.com/docs/guides/database/tables
  why: Official Supabase table creation, column types, relationships, and production best practices
  
- url: https://supabase.com/docs/guides/deployment/database-migrations  
  why: Migration management, version control, CI/CD integration for schema changes
  
- url: https://www.postgresql.org/docs/current/ddl-constraints.html
  why: PostgreSQL constraints, foreign keys, check constraints for data integrity
  
- url: https://supabase.com/docs/guides/auth/row-level-security
  why: RLS policies implementation, security patterns, access control for multi-tenant data

- file: examples/kortix-suna-extracted/backend/supabase/migrations/20250409212058_initial.sql
  why: Production-ready migration patterns, RLS policy implementation, index strategies
  
- file: examples/kortix-suna-extracted/backend/supabase/migrations/20250524062639_agents_table.sql
  why: Complex table relationships, JSON column usage, trigger implementation patterns
  
- file: examples/langflow-extracted/database/models/user.py
  why: SQLModel patterns, relationship definitions, validation constraints for user data
  
- file: examples/langflow-extracted/database/models/flow.py
  why: JSON column handling, field validation, complex relationship patterns
  
- file: PRPs/supabase-client-setup.md
  why: Type-safe client integration patterns, package structure for database connectivity

- docfile: CLAUDE.md
  why: Iraqi AI system rules, cultural compliance requirements, security standards
  
- doc: https://www.postgresql.org/docs/current/indexes-types.html
  section: B-tree, GiST, GIN indexes for different query patterns
  critical: Choose correct index type for Arabic text search, JSON queries, and relationship lookups
```

### Current Codebase Tree
```bash
aqlix-ai/
├── packages/
│   └── supabase-client/           # Existing Supabase client package
├── examples/
│   ├── kortix-suna-extracted/backend/supabase/migrations/  # 48+ migration examples
│   └── langflow-extracted/database/models/                # 9 SQLModel examples
├── .claude/agents/
│   ├── iraqi-cultural-validator.md     # Cultural compliance validation
│   ├── iraqi-security-specialist.md    # Security policy implementation
│   └── arabic-rtl-processor.md         # Arabic text processing requirements
└── PRPs/
    ├── supabase-client-setup.md        # Client integration patterns
    └── environment-variables-setup.md   # Configuration management
```

### Desired Codebase Tree with New Files
```bash
aqlix-ai/
├── packages/
│   └── supabase-client/
│       └── src/
│           └── types/
│               ├── database.ts          # Generated TypeScript database types
│               └── schema.ts            # Schema validation types
├── migrations/
│   ├── 20250831000001_initial_schema.sql           # Core tables and relationships
│   ├── 20250831000002_cultural_data.sql            # Iraqi cultural and Islamic data
│   ├── 20250831000003_professional_domains.sql     # Iraqi professional specializations
│   ├── 20250831000004_arabic_support.sql           # Arabic text and RTL support
│   ├── 20250831000005_performance_indexes.sql      # Query optimization indexes
│   ├── 20250831000006_security_policies.sql        # RLS policies and data protection
│   └── 20250831000007_seed_data.sql               # Initial reference data
├── database/
│   ├── schema.sql                    # Declarative schema definition
│   ├── seed.sql                      # Development seed data
│   └── functions/
│       ├── cultural_validation.sql   # Cultural compliance functions
│       ├── arabic_text_processing.sql # Arabic text handling functions
│       └── user_management.sql       # User-related database functions
└── tests/
    └── database/
        ├── schema_tests.sql          # pgTAP schema validation tests
        ├── performance_tests.sql     # Query performance validation
        └── security_tests.sql        # RLS policy validation tests
```

### Known Gotchas of our Codebase & Library Quirks
```sql
-- CRITICAL: Supabase requires uuid-ossp extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- GOTCHA: JSON columns need explicit default values in SQLModel
column_name: Dict[str, Any] = Field(sa_column=Column(JSON), default_factory=dict)

-- CRITICAL: RLS policies must be enabled BEFORE creating policies
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- GOTCHA: Arabic text requires proper collation for sorting and search
CREATE COLLATION IF NOT EXISTS arabic (provider = icu, locale = 'ar-IQ-u-co-trad');

-- CRITICAL: basejump.accounts integration required for multi-tenant RLS
-- Must reference basejump.accounts(id) for account-scoped data

-- GOTCHA: SQLModel relationships require proper back_populates configuration
user: "User" = Relationship(back_populates="conversations")

-- CRITICAL: Migration naming convention: YYYYMMDDHHMMSS_description.sql
-- Must use incremental timestamps to ensure proper ordering
```

## Implementation Blueprint

### Data Models and Structure

Core database schema supporting Iraqi AI Chat System requirements:

```sql
-- User management with Iraqi cultural preferences
users:
  - id (UUID, PK)
  - email (unique, indexed)
  - full_name (Arabic/English support)
  - preferred_language (arabic|english|both)
  - cultural_preferences (JSONB: Islamic settings, cultural context)
  - professional_domain (legal|medical|educational|general|organizational)
  - preferred_payment_method (zaincash|fastpay|nasswallet)
  - created_at, updated_at
  - RLS: User can only see/modify own data

-- Conversation management with thread support
conversations:
  - id (UUID, PK)
  - user_id (FK to users)
  - title (Arabic/English)
  - conversation_type (chat|document|voice|payment)
  - cultural_compliance_score (0-100)
  - language_mode (arabic|english|mixed)
  - professional_context (Iraqi domain specialization)
  - created_at, updated_at
  - RLS: User can only access own conversations

-- Message storage with Arabic support
messages:
  - id (UUID, PK) 
  - conversation_id (FK to conversations)
  - role (user|assistant|system)
  - content (text with Arabic collation)
  - content_type (text|arabic|mixed|rtl)
  - cultural_validation_status (compliant|pending|flagged)
  - islamic_compliance_check (boolean)
  - metadata (JSONB: processing details, cultural notes)
  - created_at
  - RLS: Access through conversation ownership
```

### List of Tasks to be Completed

```yaml
Task 1 - Environment Setup:
CREATE migrations/ directory structure:
  - ESTABLISH migration file naming convention
  - CONFIGURE Supabase CLI for local development
  - SETUP declarative schema management
  - VALIDATE migration environment works

Task 2 - Core Schema Migration:
CREATE migrations/20250831000001_initial_schema.sql:
  - ENABLE required PostgreSQL extensions (uuid-ossp, pg_trgm)
  - CREATE users table with Iraqi cultural fields
  - CREATE conversations table with thread support
  - CREATE messages table with Arabic text support
  - ESTABLISH foreign key relationships and constraints

Task 3 - Cultural Data Schema:
CREATE migrations/20250831000002_cultural_data.sql:
  - CREATE cultural_contexts table for Islamic validation
  - CREATE professional_domains table for Iraqi specializations
  - CREATE cultural_validation_rules table for compliance tracking
  - ADD cultural reference data and lookup tables

Task 4 - Professional Domain Schema:
CREATE migrations/20250831000003_professional_domains.sql:
  - CREATE iraqi_legal_contexts table for legal AI features
  - CREATE iraqi_medical_contexts table for healthcare AI
  - CREATE iraqi_educational_contexts table for academic AI
  - CREATE organizational_hierarchies table for Iraqi institutions

Task 5 - Arabic Language Support:
CREATE migrations/20250831000004_arabic_support.sql:
  - CONFIGURE Arabic collation for proper text sorting
  - CREATE arabic_text_processing functions for RTL support
  - ADD language detection and processing triggers
  - IMPLEMENT mixed Arabic-English content handling

Task 6 - Performance Optimization:
CREATE migrations/20250831000005_performance_indexes.sql:
  - CREATE B-tree indexes on foreign keys and frequent queries
  - CREATE GIN indexes for JSONB columns and full-text search
  - CREATE composite indexes for common query patterns
  - ADD partial indexes for active/archived data

Task 7 - Security Implementation:
CREATE migrations/20250831000006_security_policies.sql:
  - ENABLE RLS on all user-facing tables
  - CREATE user-scoped RLS policies with basejump integration
  - IMPLEMENT cultural content access controls
  - ADD professional domain security constraints

Task 8 - Initial Data:
CREATE migrations/20250831000007_seed_data.sql:
  - INSERT Iraqi professional domain reference data
  - ADD cultural validation rules and Islamic principles
  - CREATE default system configuration values
  - POPULATE payment method options

Task 9 - Type Generation:
MODIFY packages/supabase-client/:
  - GENERATE TypeScript types from database schema
  - CREATE type-safe database client interface
  - UPDATE existing client with new schema integration
  - ADD validation schemas for cultural compliance

Task 10 - Testing Infrastructure:
CREATE tests/database/:
  - WRITE pgTAP tests for schema validation
  - CREATE performance tests for query optimization
  - IMPLEMENT security tests for RLS policies
  - ADD cultural compliance validation tests
```

### Per Task Pseudocode

```sql
-- Task 1: Environment Setup
-- Initialize migration structure with proper naming
supabase migration new initial_schema
supabase migration new cultural_data
-- Continue with incremental timestamps...

-- Task 2: Core Schema (Critical patterns)
-- migrations/20250831000001_initial_schema.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- for Arabic text search

CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    preferred_language TEXT DEFAULT 'arabic' CHECK (preferred_language IN ('arabic', 'english', 'both')),
    cultural_preferences JSONB DEFAULT '{}',
    professional_domain TEXT DEFAULT 'general' CHECK (professional_domain IN ('legal', 'medical', 'educational', 'general', 'organizational')),
    preferred_payment_method TEXT DEFAULT 'zaincash' CHECK (preferred_payment_method IN ('zaincash', 'fastpay', 'nasswallet')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Task 5: Arabic Language Support (Critical patterns)
CREATE COLLATION IF NOT EXISTS arabic (provider = icu, locale = 'ar-IQ-u-co-trad');

-- Function for Arabic text processing
CREATE OR REPLACE FUNCTION process_arabic_content(content TEXT)
RETURNS JSONB AS $$
BEGIN
    RETURN jsonb_build_object(
        'is_arabic', content ~ '[أ-ي]',
        'is_mixed', content ~ '[أ-ي]' AND content ~ '[a-zA-Z]',
        'requires_rtl', content ~ '^[أ-ي]',
        'word_count', array_length(string_to_array(content, ' '), 1)
    );
END;
$$ LANGUAGE plpgsql;

-- Task 6: Performance Optimization (Critical patterns)
-- Indexes for common query patterns
CREATE INDEX idx_users_professional_domain ON public.users(professional_domain);
CREATE INDEX idx_conversations_user_cultural ON public.conversations(user_id, cultural_compliance_score);
CREATE INDEX idx_messages_conversation_created ON public.messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_arabic_search ON public.messages USING gin(to_tsvector('arabic', content));

-- Task 7: Security Implementation (Critical patterns)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own data"
    ON public.users FOR ALL
    USING (auth.uid() = id);

-- CRITICAL: For multi-tenant setup with basejump integration
CREATE POLICY "Account members can access their conversations"
    ON public.conversations FOR ALL
    USING (basejump.has_role_on_account(account_id));
```

### Integration Points
```yaml
PACKAGES:
  - packages/supabase-client/src/types/: Generate database.ts from schema
  - packages/supabase-client/src/client.ts: Update with new table access
  
CONFIGURATION:
  - Add DATABASE_URL to environment variables
  - Configure Supabase migration environment
  - Setup pgTAP testing framework
  
CULTURAL_AGENTS:
  - iraqi-cultural-validator: Integrate with cultural_validation_rules table
  - arabic-rtl-processor: Connect to arabic text processing functions
  - iraqi-security-specialist: Validate RLS policy implementation
  
TESTING:
  - CI/CD pipeline integration for migration testing
  - Performance benchmarking for query optimization
  - Security validation for RLS policies
```

## Validation Loop

### Level 1: Schema Validation
```bash
# Validate migration syntax and dependencies
supabase db reset --debug
supabase migration up --debug

# Generate types and validate integration
supabase gen types typescript --local > packages/supabase-client/src/types/database.ts
bun run typecheck --project packages/supabase-client

# Expected: All migrations apply successfully, types generate without errors
```

### Level 2: Performance Testing
```sql
-- Test query performance with sample data
-- CREATE tests/database/performance_tests.sql
EXPLAIN ANALYZE SELECT u.*, COUNT(c.*) as conversation_count
FROM users u 
LEFT JOIN conversations c ON c.user_id = u.id 
WHERE u.professional_domain = 'legal' 
GROUP BY u.id;

-- Expected: Query execution < 100ms with proper index usage
-- If slow: Add indexes, optimize query structure, check statistics
```

```bash
# Run performance benchmarks
supabase test db --file tests/database/performance_tests.sql

# Expected: All performance tests pass with acceptable timing
```

### Level 3: Security Validation
```sql
-- Test RLS policies with different user contexts
-- CREATE tests/database/security_tests.sql  
SET ROLE authenticated;
SET request.jwt.claim.sub TO 'user-uuid-here';

-- Verify user can only see own data
SELECT * FROM users; -- Should return only current user
SELECT * FROM conversations; -- Should return only user's conversations

-- Verify cross-user access is blocked
SET request.jwt.claim.sub TO 'different-user-uuid';
SELECT * FROM users WHERE id = 'first-user-uuid'; -- Should return empty
```

```bash
# Run security test suite
supabase test db --file tests/database/security_tests.sql

# Expected: All RLS policies correctly restrict data access
```

### Level 4: Cultural Integration Testing
```bash
# Test Arabic text processing functions
echo "Testing Arabic content processing..."
supabase db psql -c "SELECT process_arabic_content('مرحبا Hello مختلط');"

# Test cultural compliance constraints
echo "Testing cultural validation..."
supabase db psql -c "INSERT INTO users (email, cultural_preferences) VALUES ('test@example.com', '{\"islamic_compliance\": true}');"

# Expected: Arabic functions work correctly, cultural constraints validate properly
```

## Final Validation Checklist
- [ ] All migrations execute successfully: `supabase db reset && supabase migration up`
- [ ] No SQL syntax errors: Migration files validate with PostgreSQL parser
- [ ] Performance benchmarks pass: Common queries execute < 100ms
- [ ] TypeScript types generate: `supabase gen types typescript --local`
- [ ] RLS policies secure data: Security test suite passes
- [ ] Arabic text processing works: RTL and cultural functions operational
- [ ] Cultural compliance validates: Islamic principles constraints function
- [ ] Professional domains categorize: Iraqi specialization data structures complete
- [ ] Indexes optimize queries: EXPLAIN ANALYZE shows efficient query plans
- [ ] Seed data loads correctly: Initial reference data populates successfully

---

## Anti-Patterns to Avoid
- ❌ Don't create tables without proper foreign key constraints
- ❌ Don't skip RLS policies - security is mandatory for user data  
- ❌ Don't ignore Arabic text collation - sorting/search will break
- ❌ Don't use generic field names - be specific about Iraqi context
- ❌ Don't create indexes before understanding query patterns
- ❌ Don't hardcode cultural rules - make them data-driven and configurable
- ❌ Don't forget professional domain validation - Iraqi specializations matter
- ❌ Don't skip migration testing - data loss in production is catastrophic

---

## PRP Confidence Score: 9/10

**Justification**: This PRP provides comprehensive context including:
- ✅ Real migration examples from existing codebase (Kortix-Suna 48+ migrations)
- ✅ Database model patterns from Langflow extraction (9 models)
- ✅ 2025 Supabase best practices from official documentation
- ✅ Iraqi-specific requirements with cultural and professional context
- ✅ Executable validation gates with specific commands
- ✅ Performance optimization with concrete benchmarks
- ✅ Security implementation with RLS policy examples
- ✅ Integration points with existing workspace packages

**Confidence reduction (-1)**: Complex cultural validation rules may require iteration for Islamic compliance nuances, but comprehensive context and validation loops enable successful refinement.