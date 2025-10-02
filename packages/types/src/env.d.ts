/**
 * Shared Environment Variable Types
 *
 * This module defines common TypeScript types and interfaces for environment
 * variables that are shared across the monorepo (web, mobile, api).
 *
 * Usage:
 *   import type { BaseEnv, EnvironmentType, LogLevel } from "@/types/env";
 *
 * Note:
 *   - These are shared TYPE definitions only
 *   - For validated environment access, use:
 *     - apps/web: import { env } from "@/config/env"
 *     - apps/api: from config import settings
 *
 * @module types/env
 */
/**
 * Application environment types
 * Determines runtime behavior and feature availability
 */
export type EnvironmentType = "development" | "production" | "test";
/**
 * Logging verbosity levels
 * Standard across all applications
 */
export type LogLevel = "debug" | "info" | "warn" | "error";
/**
 * Log levels for Python backend (uppercase)
 */
export type PythonLogLevel = "DEBUG" | "INFO" | "WARNING" | "ERROR" | "CRITICAL";
/**
 * LLM provider types
 * Currently supports OpenAI only
 */
export type LLMProvider = "openai";
/**
 * OpenAI model types
 * Available models for LLM operations
 */
export type OpenAIModel = "gpt-4o" | "gpt-4o-mini" | "gpt-4-turbo" | "gpt-3.5-turbo";
/**
 * Iraqi payment gateway providers
 */
export type PaymentGateway = "zaincash" | "fastpay" | "nasswallet";
/**
 * Cultural validation strictness levels
 */
export type CulturalValidationLevel = "low" | "medium" | "high";
/**
 * Arabic processing engine types
 */
export type ArabicProcessingEngine = "default" | "advanced";
/**
 * File storage backend types
 */
export type FileStorageType = "local" | "s3" | "supabase";
/**
 * Base environment interface
 * Common environment variables shared across all applications
 */
export interface BaseEnv {
    /**
     * Application environment
     * @default "development"
     */
    NODE_ENV: EnvironmentType;
    /**
     * Logging verbosity level
     * @default "info"
     */
    LOG_LEVEL: LogLevel;
}
/**
 * Database configuration interface
 * PostgreSQL and Redis connection settings
 */
export interface DatabaseConfig {
    /**
     * PostgreSQL connection string
     * Format: postgresql://username:password@host:port/database
     */
    DATABASE_URL: string;
    /**
     * Redis connection string (optional)
     * Format: redis://host:port/db
     */
    REDIS_URL?: string;
    /**
     * Database pool size
     * @default 5
     */
    DB_POOL_SIZE?: number;
    /**
     * Database max overflow connections
     * @default 10
     */
    DB_MAX_OVERFLOW?: number;
    /**
     * Database pool timeout in seconds
     * @default 30
     */
    DB_POOL_TIMEOUT?: number;
}
/**
 * Supabase configuration interface
 * Common across web and API
 */
export interface SupabaseConfig {
    /**
     * Supabase project URL
     */
    SUPABASE_URL: string;
    /**
     * Supabase anonymous key (safe for client-side)
     */
    SUPABASE_ANON_KEY: string;
    /**
     * Supabase service role key (server-side only)
     * SECURITY: Never expose to client
     */
    SUPABASE_SERVICE_ROLE_KEY?: string;
}
/**
 * LLM provider configuration interface
 * OpenAI API settings
 */
export interface LLMConfig {
    /**
     * LLM provider selection
     * @default "openai"
     */
    LLM_PROVIDER: LLMProvider;
    /**
     * OpenAI API key
     * SECURITY: Server-side only
     */
    LLM_API_KEY: string;
    /**
     * OpenAI model to use
     * @default "gpt-4o-mini"
     */
    LLM_MODEL: OpenAIModel | string;
    /**
     * OpenAI API base URL
     * @default "https://api.openai.com/v1"
     */
    LLM_BASE_URL?: string;
    /**
     * LLM request timeout in seconds
     * @default 60
     */
    LLM_TIMEOUT?: number;
    /**
     * Maximum retries on LLM request failure
     * @default 3
     */
    LLM_MAX_RETRIES?: number;
}
/**
 * Iraqi payment gateway configuration interface
 */
export interface PaymentGatewayConfig {
    /**
     * ZainCash payment gateway API key
     * Minimum transaction: 1000 IQD
     */
    ZAINCASH_API_KEY?: string;
    /**
     * ZainCash API base URL
     */
    ZAINCASH_BASE_URL?: string;
    /**
     * ZainCash merchant ID
     */
    ZAINCASH_MERCHANT_ID?: string;
    /**
     * FastPay payment gateway API key
     * Minimum transaction: 500 IQD
     */
    FASTPAY_API_KEY?: string;
    /**
     * FastPay API base URL
     */
    FASTPAY_BASE_URL?: string;
    /**
     * FastPay merchant ID
     */
    FASTPAY_MERCHANT_ID?: string;
    /**
     * NassWallet payment gateway API key
     * Minimum transaction: 1000 IQD
     */
    NASSWALLET_API_KEY?: string;
    /**
     * NassWallet API base URL
     */
    NASSWALLET_BASE_URL?: string;
    /**
     * NassWallet merchant ID
     */
    NASSWALLET_MERCHANT_ID?: string;
}
/**
 * Iraqi AI specific configuration interface
 */
export interface IraqiAIConfig {
    /**
     * Enable cultural validation for Iraqi compliance
     * @default true
     */
    CULTURAL_VALIDATION_ENABLED: boolean;
    /**
     * Enable Arabic Iraqi dialect processing
     * @default true
     */
    ARABIC_DIALECT_PROCESSING: boolean;
    /**
     * Cultural validation strictness level
     * @default "high"
     */
    CULTURAL_VALIDATION_LEVEL?: CulturalValidationLevel;
    /**
     * Arabic text processing engine
     * @default "default"
     */
    ARABIC_PROCESSING_ENGINE?: ArabicProcessingEngine;
}
/**
 * Monitoring and error tracking configuration interface
 */
export interface MonitoringConfig {
    /**
     * Sentry DSN for error tracking
     */
    SENTRY_DSN?: string;
    /**
     * Sentry environment name
     */
    SENTRY_ENVIRONMENT?: EnvironmentType;
    /**
     * Sentry error sample rate (0.0 to 1.0)
     * @default 1.0
     */
    SENTRY_SAMPLE_RATE?: number;
    /**
     * Sentry traces sample rate (0.0 to 1.0)
     * @default 0.1
     */
    SENTRY_TRACES_SAMPLE_RATE?: number;
}
/**
 * Rate limiting configuration interface
 */
export interface RateLimitConfig {
    /**
     * Enable rate limiting
     * @default true
     */
    RATE_LIMIT_ENABLED: boolean;
    /**
     * Rate limit per minute per IP
     * @default 60
     */
    RATE_LIMIT_PER_MINUTE: number;
    /**
     * Rate limit per hour per user
     * @default 1000
     */
    RATE_LIMIT_PER_HOUR: number;
}
/**
 * File storage configuration interface
 */
export interface FileStorageConfig {
    /**
     * Maximum file upload size in MB
     * @default 10
     */
    MAX_UPLOAD_SIZE_MB: number;
    /**
     * Allowed file extensions
     */
    ALLOWED_FILE_EXTENSIONS: string[];
    /**
     * File storage backend type
     * @default "local"
     */
    FILE_STORAGE_TYPE: FileStorageType;
    /**
     * Local storage path
     * @default "./uploads"
     */
    LOCAL_STORAGE_PATH?: string;
}
/**
 * Feature flags configuration interface
 */
export interface FeatureFlagsConfig {
    /**
     * Enable experimental features
     * @default false
     */
    ENABLE_EXPERIMENTAL_FEATURES: boolean;
    /**
     * Enable multimodal capabilities (image, voice)
     * @default true
     */
    ENABLE_MULTIMODAL: boolean;
    /**
     * Enable offline mode support
     * @default false
     */
    ENABLE_OFFLINE_MODE?: boolean;
    /**
     * Enable background task processing
     * @default true
     */
    ENABLE_BACKGROUND_TASKS?: boolean;
}
/**
 * Complete server-side environment interface
 * Combines all configuration interfaces
 */
export interface ServerEnv extends BaseEnv, DatabaseConfig, SupabaseConfig, LLMConfig, PaymentGatewayConfig, IraqiAIConfig, MonitoringConfig, RateLimitConfig, FileStorageConfig, FeatureFlagsConfig {
    /**
     * API secret key for JWT signing and encryption
     * SECURITY: Must be at least 32 characters
     */
    API_SECRET_KEY: string;
    /**
     * Server port
     * @default 3000 (Next.js) or 8000 (FastAPI)
     */
    PORT?: number;
    /**
     * Host binding address
     * @default "0.0.0.0"
     */
    HOST?: string;
    /**
     * JWT token expiration in minutes
     * @default 60
     */
    JWT_EXPIRATION_MINUTES?: number;
    /**
     * CORS allowed origins
     */
    CORS_ORIGINS?: string;
    /**
     * CORS allow credentials
     * @default true
     */
    CORS_ALLOW_CREDENTIALS?: boolean;
}
/**
 * Client-side environment interface (browser-accessible)
 * Only includes NEXT_PUBLIC_* variables safe for client exposure
 */
export interface ClientEnv {
    /**
     * Backend API URL for client-side requests
     */
    NEXT_PUBLIC_API_URL: string;
    /**
     * Supabase project URL
     */
    NEXT_PUBLIC_SUPABASE_URL: string;
    /**
     * Supabase anonymous key (safe for client-side)
     */
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    /**
     * Enable cultural validation in client
     * @default true
     */
    NEXT_PUBLIC_CULTURAL_VALIDATION_ENABLED: boolean;
    /**
     * Enable Arabic dialect processing in UI
     * @default true
     */
    NEXT_PUBLIC_ARABIC_DIALECT_PROCESSING: boolean;
    /**
     * Application environment for client-side feature flags
     * @default "development"
     */
    NEXT_PUBLIC_APP_ENV: EnvironmentType;
    /**
     * Sentry DSN for client-side error tracking (optional)
     */
    NEXT_PUBLIC_SENTRY_DSN?: string;
    /**
     * Google Analytics measurement ID (optional)
     */
    NEXT_PUBLIC_GA_MEASUREMENT_ID?: string;
    /**
     * Enable experimental features flag
     * @default false
     */
    NEXT_PUBLIC_ENABLE_EXPERIMENTAL_FEATURES: boolean;
    /**
     * Enable multimodal capabilities
     * @default true
     */
    NEXT_PUBLIC_ENABLE_MULTIMODAL: boolean;
    /**
     * Enable offline mode support
     * @default false
     */
    NEXT_PUBLIC_ENABLE_OFFLINE_MODE: boolean;
}
/**
 * Environment helper utilities
 */
export declare const EnvironmentUtils: {
    /**
     * Check if environment is production
     */
    readonly isProduction: (env: EnvironmentType) => boolean;
    /**
     * Check if environment is development
     */
    readonly isDevelopment: (env: EnvironmentType) => boolean;
    /**
     * Check if environment is test
     */
    readonly isTest: (env: EnvironmentType) => boolean;
    /**
     * Parse comma-separated string to array
     */
    readonly parseCommaSeparated: (value: string) => string[];
    /**
     * Parse boolean string
     */
    readonly parseBoolean: (value: string) => boolean;
};
/**
 * Environment validation utilities
 */
export declare const EnvironmentValidation: {
    /**
     * Validate URL format
     */
    readonly isValidUrl: (url: string) => boolean;
    /**
     * Validate email format
     */
    readonly isValidEmail: (email: string) => boolean;
    /**
     * Validate port number
     */
    readonly isValidPort: (port: number) => boolean;
    /**
     * Validate API key length
     */
    readonly isValidApiKey: (key: string, minLength?: number) => boolean;
};
/**
 * Type guard to check if running on server
 */
export declare function isServerSide(): boolean;
/**
 * Type guard to check if running on client
 */
export declare function isClientSide(): boolean;
//# sourceMappingURL=env.d.ts.map