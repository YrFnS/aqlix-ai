"use client";

/**
 * Authentication Context Provider
 * Manages auth state, user profile, cultural context, and session management
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  getCurrentUserAction,
  refreshTokenAction,
  signOutAction,
} from "@/lib/auth/actions";

// Types
export interface CulturalContext {
  region: "baghdad" | "basra" | "mosul" | "erbil" | "other";
  islamicComplianceLevel: "basic" | "standard" | "strict";
  languagePreference: "ar-IQ" | "en-US" | "both";
  professionalDomain?:
    | "legal"
    | "medical"
    | "educational"
    | "engineering"
    | "organizational";
  familyPrivacyLevel: "private" | "family" | "public";
  professionalEtiquetteLevel: "standard" | "formal" | "traditional";
}

export interface CulturalGreeting {
  primaryGreeting: string;
  regionalVariation?: string;
  professionalSuffix?: string;
  timeBasedAdjustment: string;
  culturalRespectLevel: string;
  language: string;
}

export interface ProfessionalContext {
  domain: string;
  licenseNumber?: string;
  licenseVerified: boolean;
  issuingAuthority?: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  region: string;
  iraqiId?: string;
  iraqiIdVerified: boolean;
  professionalDomain?: string;
  emailVerified: boolean;
  mfaEnabled: boolean;
}

export interface Session {
  sessionId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  createdAt: string;
  deviceId?: string;
}

export interface AuthContextType {
  // State
  user: User | null;
  session: Session | null;
  culturalContext: CulturalContext | null;
  culturalGreeting: CulturalGreeting | null;
  professionalContext: ProfessionalContext | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  refreshSession: () => Promise<void>;
  logout: (logoutAllDevices?: boolean) => Promise<void>;
  updateCulturalGreeting: (greeting: CulturalGreeting) => void;
}

// Create context with undefined default (will be provided by provider)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [culturalContext, setCulturalContext] =
    useState<CulturalContext | null>(null);
  const [culturalGreeting, setCulturalGreeting] =
    useState<CulturalGreeting | null>(null);
  const [professionalContext, setProfessionalContext] =
    useState<ProfessionalContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Derived state
  const isAuthenticated = user !== null && session !== null;

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);

        // Get current user from server
        const result = await getCurrentUserAction();

        if (result.success && result.data) {
          setUser({
            id: result.data.userId,
            email: result.data.email,
            fullName: result.data.fullName,
            region: result.data.culturalContext?.region || "baghdad",
            iraqiIdVerified: result.data.iraqiIdVerified || false,
            emailVerified: result.data.emailVerified || false,
            mfaEnabled: result.data.mfaEnabled || false,
          });

          setCulturalContext(result.data.culturalContext || null);
          setProfessionalContext(result.data.professionalContext || null);

          // Generate cultural greeting based on context
          if (result.data.culturalContext) {
            generateCulturalGreeting(result.data.culturalContext);
          }
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Generate cultural greeting based on time and context
  const generateCulturalGreeting = useCallback((context: CulturalContext) => {
    const hour = new Date().getHours();
    let timeOfDay = "morning";
    let primaryGreeting = "صباح الخير";

    if (hour >= 4 && hour < 6) {
      timeOfDay = "dawn";
      primaryGreeting = "صباح الخير";
    } else if (hour >= 6 && hour < 12) {
      timeOfDay = "morning";
      primaryGreeting = "صباح الخير";
    } else if (hour >= 12 && hour < 16) {
      timeOfDay = "afternoon";
      primaryGreeting = "مساء الخير";
    } else if (hour >= 16 && hour < 20) {
      timeOfDay = "evening";
      primaryGreeting = "مساء الخير";
    } else {
      timeOfDay = "night";
      primaryGreeting = "مساء الخير";
    }

    // Use Islamic greeting for standard/strict compliance
    if (
      context.islamicComplianceLevel === "standard" ||
      context.islamicComplianceLevel === "strict"
    ) {
      primaryGreeting = "السلام عليكم ورحمة الله وبركاته";
    }

    // Regional variations
    const regionalVariations: Record<string, string> = {
      baghdad: "شلونك",
      basra: "شلونكم",
      mosul: "كيفك",
      erbil: "چونی",
      other: "شلونك",
    };

    setCulturalGreeting({
      primaryGreeting,
      regionalVariation:
        regionalVariations[context.region] || regionalVariations.other,
      timeBasedAdjustment: timeOfDay,
      culturalRespectLevel:
        context.islamicComplianceLevel === "strict" ? "very_high" : "high",
      language: context.languagePreference,
    });
  }, []);

  // Refresh session
  const refreshSession = useCallback(async () => {
    if (!session?.refreshToken) {
      return;
    }

    try {
      const result = await refreshTokenAction(session.refreshToken);

      if (result.success && result.data) {
        setSession((prev) => ({
          ...prev!,
          accessToken: result.data.accessToken,
          expiresAt: result.data.expiresAt,
        }));
      }
    } catch (error) {
      console.error("Failed to refresh session:", error);
      // On refresh failure, logout user
      await logout();
    }
  }, [session?.refreshToken]);

  // Auto-refresh session before expiry
  useEffect(() => {
    if (!session?.expiresAt) {
      return;
    }

    const expiryTime = new Date(session.expiresAt).getTime();
    const now = Date.now();
    const timeUntilExpiry = expiryTime - now;

    // Refresh 5 minutes before expiry
    const refreshTime = timeUntilExpiry - 5 * 60 * 1000;

    if (refreshTime > 0) {
      const timer = setTimeout(() => {
        refreshSession();
      }, refreshTime);

      return () => clearTimeout(timer);
    }

    // If refreshTime <= 0, no cleanup needed
    return undefined;
  }, [session?.expiresAt, refreshSession]);

  // Logout
  const logout = useCallback(async (logoutAllDevices: boolean = false) => {
    try {
      await signOutAction(logoutAllDevices);

      // Clear state
      setUser(null);
      setSession(null);
      setCulturalContext(null);
      setCulturalGreeting(null);
      setProfessionalContext(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, []);

  // Update cultural greeting
  const updateCulturalGreeting = useCallback((greeting: CulturalGreeting) => {
    setCulturalGreeting(greeting);
  }, []);

  const value: AuthContextType = {
    user,
    session,
    culturalContext,
    culturalGreeting,
    professionalContext,
    isLoading,
    isAuthenticated,
    refreshSession,
    logout,
    updateCulturalGreeting,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

// Helper hook for protected routes
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = "/login";
    }
  }, [isAuthenticated, isLoading]);

  return { isAuthenticated, isLoading };
}
