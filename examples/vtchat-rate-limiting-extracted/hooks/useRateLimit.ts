/**
 * React Hook for Iraqi Rate Limiting Integration
 * Provides real-time rate limit monitoring and enforcement
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface RateLimitHookStatus {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetTime: Date;
  retryAfter?: number;
  warningLevel?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  usage: {
    requests: { used: number; limit: number; percentage: number };
    translation: { used: number; limit: number; percentage: number };
    professional?: {
      used: number;
      limit: number;
      percentage: number;
      domain?: string;
    };
  };
  subscriptionTier: "trial" | "basic" | "premium" | "organization";
  paymentGateway?: "zaincash" | "fastpay" | "nasswallet";
}

export interface RateLimitHookOptions {
  userId: string;
  requestType?:
    | "chat"
    | "translation"
    | "cultural_validation"
    | "api"
    | "professional_query";
  professionalDomain?:
    | "legal"
    | "medical"
    | "educational"
    | "business"
    | "engineering";
  autoRefresh?: boolean;
  refreshInterval?: number;
  onLimitExceeded?: (status: RateLimitHookStatus) => void;
  onWarningTriggered?: (level: string, status: RateLimitHookStatus) => void;
}

export interface RateLimitHookResult {
  status: RateLimitHookStatus | null;
  loading: boolean;
  error: string | null;
  checkLimit: (requestType?: string, additionalData?: any) => Promise<boolean>;
  refreshStatus: () => Promise<void>;
  timeUntilReset: string;
  canMakeRequest: boolean;
  warningMessage?: string;
}

export function useRateLimit({
  userId,
  requestType = "chat",
  professionalDomain,
  autoRefresh = true,
  refreshInterval = 30000,
  onLimitExceeded,
  onWarningTriggered,
}: RateLimitHookOptions): RateLimitHookResult {
  const [status, setStatus] = useState<RateLimitHookStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeUntilReset, setTimeUntilReset] = useState<string>("");

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastWarningLevel = useRef<string | null>(null);

  // Fetch current rate limit status
  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        userId,
        requestType,
        ...(professionalDomain && { professionalDomain }),
      });

      const response = await fetch(`/api/rate-limit/status?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: RateLimitHookStatus = await response.json();
      setStatus(data);

      // Trigger warning callback if warning level changed
      if (data.warningLevel && data.warningLevel !== lastWarningLevel.current) {
        lastWarningLevel.current = data.warningLevel;
        onWarningTriggered?.(data.warningLevel, data);
      }

      // Trigger limit exceeded callback if needed
      if (!data.allowed && onLimitExceeded) {
        onLimitExceeded(data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error fetching rate limit status:", err);
    } finally {
      setLoading(false);
    }
  }, [
    userId,
    requestType,
    professionalDomain,
    onLimitExceeded,
    onWarningTriggered,
  ]);

  // Check if a specific request is allowed and track it
  const checkLimit = useCallback(
    async (
      checkRequestType?: string,
      additionalData?: any,
    ): Promise<boolean> => {
      try {
        const response = await fetch("/api/rate-limit/check", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            requestType: checkRequestType || requestType,
            professionalDomain,
            ...additionalData,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        // Update status with new information
        if (result.status) {
          setStatus(result.status);
        }

        return result.allowed;
      } catch (err) {
        console.error("Error checking rate limit:", err);
        return false;
      }
    },
    [userId, requestType, professionalDomain],
  );

  // Refresh status manually
  const refreshStatus = useCallback(async () => {
    await fetchStatus();
  }, [fetchStatus]);

  // Calculate time until reset
  const updateTimeUntilReset = useCallback(() => {
    if (!status?.resetTime) {
      setTimeUntilReset("");
      return;
    }

    const now = new Date();
    const reset = new Date(status.resetTime);
    const diff = reset.getTime() - now.getTime();

    if (diff <= 0) {
      setTimeUntilReset("Resetting...");
      // Refresh status when reset time is reached
      fetchStatus();
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (hours > 0) {
      setTimeUntilReset(`${hours}h ${minutes}m`);
    } else if (minutes > 0) {
      setTimeUntilReset(`${minutes}m ${seconds}s`);
    } else {
      setTimeUntilReset(`${seconds}s`);
    }
  }, [status?.resetTime, fetchStatus]);

  // Initialize and set up intervals
  useEffect(() => {
    // Initial fetch
    fetchStatus();

    // Set up auto-refresh interval
    if (autoRefresh && refreshInterval > 0) {
      intervalRef.current = setInterval(fetchStatus, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchStatus, autoRefresh, refreshInterval]);

  // Set up reset timer
  useEffect(() => {
    if (resetTimerRef.current) {
      clearInterval(resetTimerRef.current);
    }

    if (status?.resetTime) {
      updateTimeUntilReset();
      resetTimerRef.current = setInterval(updateTimeUntilReset, 1000);
    }

    return () => {
      if (resetTimerRef.current) {
        clearInterval(resetTimerRef.current);
      }
    };
  }, [status?.resetTime, updateTimeUntilReset]);

  // Calculate derived values
  const canMakeRequest = status
    ? status.allowed && status.remaining > 0
    : false;

  const warningMessage = status?.warningLevel
    ? getWarningMessage(status.warningLevel, status)
    : undefined;

  return {
    status,
    loading,
    error,
    checkLimit,
    refreshStatus,
    timeUntilReset,
    canMakeRequest,
    warningMessage,
  };
}

// Helper function to generate warning messages
function getWarningMessage(level: string, status: RateLimitHookStatus): string {
  const remaining = status.remaining;
  const resetTime = new Date(status.resetTime).toLocaleTimeString();

  switch (level) {
    case "CRITICAL":
      return `Critical: Only ${remaining} requests remaining. Resets at ${resetTime}.`;
    case "HIGH":
      return `Warning: ${remaining} requests remaining. Consider upgrading your plan.`;
    case "MEDIUM":
      return `Notice: ${remaining} requests remaining. Monitor your usage.`;
    case "LOW":
      return `Info: ${remaining} requests remaining. You're on track.`;
    default:
      return "";
  }
}

// Hook for professional domain rate limiting
export function useProfessionalRateLimit(
  userId: string,
  domain: "legal" | "medical" | "educational" | "business" | "engineering",
  options?: Omit<
    RateLimitHookOptions,
    "userId" | "professionalDomain" | "requestType"
  >,
): RateLimitHookResult {
  return useRateLimit({
    ...options,
    userId,
    requestType: "professional_query",
    professionalDomain: domain,
  });
}

// Hook for Arabic translation rate limiting
export function useArabicTranslationRateLimit(
  userId: string,
  options?: Omit<RateLimitHookOptions, "userId" | "requestType">,
): RateLimitHookResult & {
  checkTranslation: (text: string, targetLanguage?: string) => Promise<boolean>;
} {
  const baseHook = useRateLimit({
    ...options,
    userId,
    requestType: "translation",
  });

  const checkTranslation = useCallback(
    async (text: string, targetLanguage: string = "ar"): Promise<boolean> => {
      return baseHook.checkLimit("translation", {
        textLength: text.length,
        targetLanguage,
        sourceLanguage: targetLanguage === "ar" ? "en" : "ar",
      });
    },
    [baseHook.checkLimit],
  );

  return {
    ...baseHook,
    checkTranslation,
  };
}

// Hook for cultural validation rate limiting
export function useCulturalValidationRateLimit(
  userId: string,
  options?: Omit<RateLimitHookOptions, "userId" | "requestType">,
): RateLimitHookResult & {
  checkValidation: (
    content: string,
    validationType?: string,
  ) => Promise<boolean>;
} {
  const baseHook = useRateLimit({
    ...options,
    userId,
    requestType: "cultural_validation",
  });

  const checkValidation = useCallback(
    async (
      content: string,
      validationType: string = "general",
    ): Promise<boolean> => {
      return baseHook.checkLimit("cultural_validation", {
        contentLength: content.length,
        validationType,
        requiresIslamicCompliance: true,
      });
    },
    [baseHook.checkLimit],
  );

  return {
    ...baseHook,
    checkValidation,
  };
}

// Hook for monitoring multiple request types
export function useMultiTypeRateLimit(
  userId: string,
  requestTypes: string[],
  options?: Omit<RateLimitHookOptions, "userId" | "requestType">,
): {
  statuses: Record<string, RateLimitHookStatus | null>;
  loading: boolean;
  error: string | null;
  checkLimit: (requestType: string, additionalData?: any) => Promise<boolean>;
  refreshAll: () => Promise<void>;
  canMakeRequest: (requestType: string) => boolean;
  getWarningMessage: (requestType: string) => string | undefined;
} {
  const [statuses, setStatuses] = useState<
    Record<string, RateLimitHookStatus | null>
  >({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllStatuses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const promises = requestTypes.map(async (type) => {
        const params = new URLSearchParams({ userId, requestType: type });
        const response = await fetch(`/api/rate-limit/status?${params}`);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return { type, data };
      });

      const results = await Promise.all(promises);
      const newStatuses: Record<string, RateLimitHookStatus | null> = {};

      results.forEach(({ type, data }) => {
        newStatuses[type] = data;
      });

      setStatuses(newStatuses);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId, requestTypes]);

  const checkLimit = useCallback(
    async (requestType: string, additionalData?: any): Promise<boolean> => {
      try {
        const response = await fetch("/api/rate-limit/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            requestType,
            ...additionalData,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        // Update specific status
        if (result.status) {
          setStatuses((prev) => ({
            ...prev,
            [requestType]: result.status,
          }));
        }

        return result.allowed;
      } catch (err) {
        console.error("Error checking rate limit:", err);
        return false;
      }
    },
    [userId],
  );

  const canMakeRequest = useCallback(
    (requestType: string): boolean => {
      const status = statuses[requestType];
      return status ? status.allowed && status.remaining > 0 : false;
    },
    [statuses],
  );

  const getWarningMessageForType = useCallback(
    (requestType: string): string | undefined => {
      const status = statuses[requestType];
      return status?.warningLevel
        ? getWarningMessage(status.warningLevel, status)
        : undefined;
    },
    [statuses],
  );

  // Initialize
  useEffect(() => {
    fetchAllStatuses();

    if (options?.autoRefresh !== false) {
      const interval = setInterval(
        fetchAllStatuses,
        options?.refreshInterval || 30000,
      );
      return () => clearInterval(interval);
    }
  }, [fetchAllStatuses, options?.autoRefresh, options?.refreshInterval]);

  return {
    statuses,
    loading,
    error,
    checkLimit,
    refreshAll: fetchAllStatuses,
    canMakeRequest,
    getWarningMessage: getWarningMessageForType,
  };
}
