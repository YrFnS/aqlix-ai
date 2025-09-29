/**
 * Logger - Advanced logging system for Component Inspector
 *
 * Provides structured logging with:
 * - Contextual information for Iraqi cultural analysis
 * - Performance metrics tracking
 * - Cultural compliance audit trails
 * - Security event logging
 * - Accessibility analysis logging
 */
export class Logger {
  private context: string;
  private config: any;
  private logLevel: "debug" | "info" | "warn" | "error";

  constructor(context: string, config?: any) {
    this.context = context;
    this.config = config || {};
    this.logLevel = this.config.logLevel || "info";
  }

  /**
   * Debug level logging
   */
  debug(message: string, metadata?: any): void {
    if (this.shouldLog("debug")) {
      this.log("debug", message, metadata);
    }
  }

  /**
   * Info level logging
   */
  info(message: string, metadata?: any): void {
    if (this.shouldLog("info")) {
      this.log("info", message, metadata);
    }
  }

  /**
   * Warning level logging
   */
  warn(message: string, metadata?: any): void {
    if (this.shouldLog("warn")) {
      this.log("warn", message, metadata);
    }
  }

  /**
   * Error level logging
   */
  error(message: string, metadata?: any): void {
    if (this.shouldLog("error")) {
      this.log("error", message, metadata);
    }
  }

  /**
   * Log cultural compliance events
   */
  cultural(
    level: "info" | "warn" | "error",
    message: string,
    metadata?: {
      component?: string;
      ministry?: string;
      culturalScore?: number;
      islamicCompliance?: number;
      violations?: any[];
    },
  ): void {
    const culturalMetadata = {
      ...metadata,
      category: "cultural-compliance",
      timestamp: new Date().toISOString(),
      context: this.context,
    };

    this.log(level, `[CULTURAL] ${message}`, culturalMetadata);
  }

  /**
   * Log performance events
   */
  performance(
    level: "info" | "warn",
    message: string,
    metadata?: {
      component?: string;
      renderTime?: number;
      bundleSize?: number;
      memoryUsage?: number;
      rtlImpact?: number;
    },
  ): void {
    const performanceMetadata = {
      ...metadata,
      category: "performance",
      timestamp: new Date().toISOString(),
      context: this.context,
    };

    this.log(level, `[PERFORMANCE] ${message}`, performanceMetadata);
  }

  /**
   * Log accessibility events
   */
  accessibility(
    level: "info" | "warn" | "error",
    message: string,
    metadata?: {
      component?: string;
      wcagScore?: number;
      rtlAccessibility?: number;
      violations?: any[];
    },
  ): void {
    const accessibilityMetadata = {
      ...metadata,
      category: "accessibility",
      timestamp: new Date().toISOString(),
      context: this.context,
    };

    this.log(level, `[A11Y] ${message}`, accessibilityMetadata);
  }

  /**
   * Log security events
   */
  security(
    level: "warn" | "error",
    message: string,
    metadata?: {
      component?: string;
      vulnerabilities?: any[];
      securityScore?: number;
      riskLevel?: string;
    },
  ): void {
    const securityMetadata = {
      ...metadata,
      category: "security",
      timestamp: new Date().toISOString(),
      context: this.context,
      urgent: level === "error",
    };

    this.log(level, `[SECURITY] ${message}`, securityMetadata);
  }

  /**
   * Create child logger with additional context
   */
  child(childContext: string, additionalConfig?: any): Logger {
    const fullContext = `${this.context}:${childContext}`;
    const mergedConfig = { ...this.config, ...additionalConfig };
    return new Logger(fullContext, mergedConfig);
  }

  /**
   * Log analysis timing
   */
  time(label: string): { end: () => void } {
    const startTime = performance.now();

    return {
      end: () => {
        const duration = performance.now() - startTime;
        this.performance("info", `${label} completed`, {
          duration: Math.round(duration * 100) / 100, // Round to 2 decimal places
          label,
        });
      },
    };
  }

  /**
   * Set log level
   */
  setLevel(level: "debug" | "info" | "warn" | "error"): void {
    this.logLevel = level;
  }

  private shouldLog(level: "debug" | "info" | "warn" | "error"): boolean {
    const levels = ["debug", "info", "warn", "error"];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);

    return messageLevelIndex >= currentLevelIndex;
  }

  private log(level: string, message: string, metadata?: any): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      context: this.context,
      message,
      ...metadata,
    };

    // In a real implementation, this would send to a logging service
    // For now, we'll use console with appropriate formatting
    switch (level) {
      case "debug":
        console.debug(this.formatLogEntry(logEntry));
        break;
      case "info":
        console.info(this.formatLogEntry(logEntry));
        break;
      case "warn":
        console.warn(this.formatLogEntry(logEntry));
        break;
      case "error":
        console.error(this.formatLogEntry(logEntry));
        break;
    }
  }

  private formatLogEntry(entry: any): string {
    const { timestamp, level, context, message, ...metadata } = entry;

    let formatted = `[${timestamp}] ${level} [${context}] ${message}`;

    if (Object.keys(metadata).length > 0) {
      formatted += ` ${JSON.stringify(metadata, null, 2)}`;
    }

    return formatted;
  }
}
