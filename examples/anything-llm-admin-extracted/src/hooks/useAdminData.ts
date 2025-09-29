/**
 * Iraqi AI Admin Data Hook
 * Custom hook for fetching and managing admin dashboard data
 *
 * Features:
 * - Real-time metrics fetching
 * - Automatic refresh intervals
 * - Error handling and retry logic
 * - Data caching and optimization
 * - Arabic/English data formatting
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  SystemMetrics,
  UserMetrics,
  OrganizationMetrics,
  ComplianceMetrics,
  PerformanceMetrics,
  CulturalMetrics,
  IraqiUser,
  IraqiOrganization,
  ApiResponse,
} from '../types/admin';
import IraqiAdminService from '../services/AdminService';

interface UseAdminDataOptions {
  refreshInterval?: number; // in milliseconds
  enableAutoRefresh?: boolean;
  cacheTimeout?: number; // in milliseconds
}

interface UseAdminDataReturn {
  // Metrics
  systemMetrics: SystemMetrics | null;
  userMetrics: UserMetrics | null;
  organizationMetrics: OrganizationMetrics | null;
  complianceMetrics: ComplianceMetrics | null;
  performanceMetrics: PerformanceMetrics | null;
  culturalMetrics: CulturalMetrics | null;

  // Recent data
  recentUsers: IraqiUser[] | null;
  recentOrganizations: IraqiOrganization[] | null;

  // State
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;

  // Actions
  refreshData: () => Promise<void>;
  refreshMetrics: () => Promise<void>;
  refreshUsers: () => Promise<void>;
  refreshOrganizations: () => Promise<void>;

  // Cache control
  clearCache: () => void;
  setCacheTimeout: (timeout: number) => void;
}

// Cache structure
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  timeRange: string;
}

class AdminDataCache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTimeout = 5 * 60 * 1000; // 5 minutes

  get<T>(key: string, timeRange: string, timeout?: number): T | null {
    const cacheKey = `${key}_${timeRange}`;
    const entry = this.cache.get(cacheKey);

    if (!entry) return null;

    const now = Date.now();
    const cacheTimeout = timeout || this.defaultTimeout;

    if (now - entry.timestamp > cacheTimeout) {
      this.cache.delete(cacheKey);
      return null;
    }

    return entry.data;
  }

  set<T>(key: string, timeRange: string, data: T): void {
    const cacheKey = `${key}_${timeRange}`;
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      timeRange,
    });
  }

  clear(): void {
    this.cache.clear();
  }

  clearByPattern(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  setDefaultTimeout(timeout: number): void {
    this.defaultTimeout = timeout;
  }
}

// Global cache instance
const adminDataCache = new AdminDataCache();

export const useAdminData = (
  timeRange: '24h' | '7d' | '30d' | '90d' = '24h',
  options: UseAdminDataOptions = {}
): UseAdminDataReturn => {
  const {
    refreshInterval = 30000, // 30 seconds
    enableAutoRefresh = true,
    cacheTimeout = 5 * 60 * 1000, // 5 minutes
  } = options;

  // State
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [userMetrics, setUserMetrics] = useState<UserMetrics | null>(null);
  const [organizationMetrics, setOrganizationMetrics] = useState<OrganizationMetrics | null>(null);
  const [complianceMetrics, setComplianceMetrics] = useState<ComplianceMetrics | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [culturalMetrics, setCulturalMetrics] = useState<CulturalMetrics | null>(null);
  const [recentUsers, setRecentUsers] = useState<IraqiUser[] | null>(null);
  const [recentOrganizations, setRecentOrganizations] = useState<IraqiOrganization[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Admin service instance (would be provided by context in real app)
  const adminService = useMemo(() => {
    // These would come from environment variables or context
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const apiKey = process.env.NEXT_PUBLIC_API_KEY || 'dev-key';
    return new IraqiAdminService(baseUrl, apiKey);
  }, []);

  // Fetch system metrics with caching
  const fetchSystemMetrics = useCallback(async () => {
    try {
      // Check cache first
      const cached = adminDataCache.get<SystemMetrics>('systemMetrics', timeRange, cacheTimeout);
      if (cached) {
        setSystemMetrics(cached);
        return;
      }

      const response = await adminService.getSystemMetrics(timeRange);
      if (response.success && response.data) {
        setSystemMetrics(response.data);
        adminDataCache.set('systemMetrics', timeRange, response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch system metrics');
      }
    } catch (err) {
      console.error('Error fetching system metrics:', err);
      throw err;
    }
  }, [adminService, timeRange, cacheTimeout]);

  // Fetch user metrics with caching
  const fetchUserMetrics = useCallback(async () => {
    try {
      const cached = adminDataCache.get<UserMetrics>('userMetrics', timeRange, cacheTimeout);
      if (cached) {
        setUserMetrics(cached);
        return;
      }

      const response = await adminService.getUserMetrics(timeRange);
      if (response.success && response.data) {
        setUserMetrics(response.data);
        adminDataCache.set('userMetrics', timeRange, response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch user metrics');
      }
    } catch (err) {
      console.error('Error fetching user metrics:', err);
      throw err;
    }
  }, [adminService, timeRange, cacheTimeout]);

  // Fetch organization metrics with caching
  const fetchOrganizationMetrics = useCallback(async () => {
    try {
      const cached = adminDataCache.get<OrganizationMetrics>(
        'organizationMetrics',
        timeRange,
        cacheTimeout
      );
      if (cached) {
        setOrganizationMetrics(cached);
        return;
      }

      const response = await adminService.getOrganizationMetrics(timeRange);
      if (response.success && response.data) {
        setOrganizationMetrics(response.data);
        adminDataCache.set('organizationMetrics', timeRange, response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch organization metrics');
      }
    } catch (err) {
      console.error('Error fetching organization metrics:', err);
      throw err;
    }
  }, [adminService, timeRange, cacheTimeout]);

  // Fetch compliance metrics with caching
  const fetchComplianceMetrics = useCallback(async () => {
    try {
      const cached = adminDataCache.get<ComplianceMetrics>(
        'complianceMetrics',
        timeRange,
        cacheTimeout
      );
      if (cached) {
        setComplianceMetrics(cached);
        return;
      }

      const response = await adminService.getComplianceMetrics(timeRange);
      if (response.success && response.data) {
        setComplianceMetrics(response.data);
        adminDataCache.set('complianceMetrics', timeRange, response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch compliance metrics');
      }
    } catch (err) {
      console.error('Error fetching compliance metrics:', err);
      throw err;
    }
  }, [adminService, timeRange, cacheTimeout]);

  // Fetch performance metrics with caching
  const fetchPerformanceMetrics = useCallback(async () => {
    try {
      const cached = adminDataCache.get<PerformanceMetrics>(
        'performanceMetrics',
        timeRange,
        cacheTimeout
      );
      if (cached) {
        setPerformanceMetrics(cached);
        return;
      }

      const response = await adminService.getPerformanceMetrics(timeRange);
      if (response.success && response.data) {
        setPerformanceMetrics(response.data);
        adminDataCache.set('performanceMetrics', timeRange, response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch performance metrics');
      }
    } catch (err) {
      console.error('Error fetching performance metrics:', err);
      throw err;
    }
  }, [adminService, timeRange, cacheTimeout]);

  // Fetch cultural metrics with caching
  const fetchCulturalMetrics = useCallback(async () => {
    try {
      const cached = adminDataCache.get<CulturalMetrics>(
        'culturalMetrics',
        timeRange,
        cacheTimeout
      );
      if (cached) {
        setCulturalMetrics(cached);
        return;
      }

      const response = await adminService.getCulturalMetrics(timeRange);
      if (response.success && response.data) {
        setCulturalMetrics(response.data);
        adminDataCache.set('culturalMetrics', timeRange, response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch cultural metrics');
      }
    } catch (err) {
      console.error('Error fetching cultural metrics:', err);
      throw err;
    }
  }, [adminService, timeRange, cacheTimeout]);

  // Fetch recent users
  const fetchRecentUsers = useCallback(async () => {
    try {
      const cached = adminDataCache.get<IraqiUser[]>('recentUsers', 'recent', cacheTimeout);
      if (cached) {
        setRecentUsers(cached);
        return;
      }

      const response = await adminService.getUsers(
        1,
        10,
        {
          dateRange: {
            start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Last 7 days
            end: new Date().toISOString(),
          },
        },
        {
          field: 'createdAt',
          direction: 'desc',
        }
      );

      if (response.success && response.data) {
        setRecentUsers(response.data.items);
        adminDataCache.set('recentUsers', 'recent', response.data.items);
      } else {
        throw new Error(response.error || 'Failed to fetch recent users');
      }
    } catch (err) {
      console.error('Error fetching recent users:', err);
      throw err;
    }
  }, [adminService, cacheTimeout]);

  // Fetch recent organizations
  const fetchRecentOrganizations = useCallback(async () => {
    try {
      const cached = adminDataCache.get<IraqiOrganization[]>(
        'recentOrganizations',
        'recent',
        cacheTimeout
      );
      if (cached) {
        setRecentOrganizations(cached);
        return;
      }

      const response = await adminService.getOrganizations(
        1,
        5,
        {
          dateRange: {
            start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date().toISOString(),
          },
        },
        {
          field: 'createdAt',
          direction: 'desc',
        }
      );

      if (response.success && response.data) {
        setRecentOrganizations(response.data.items);
        adminDataCache.set('recentOrganizations', 'recent', response.data.items);
      } else {
        throw new Error(response.error || 'Failed to fetch recent organizations');
      }
    } catch (err) {
      console.error('Error fetching recent organizations:', err);
      throw err;
    }
  }, [adminService, cacheTimeout]);

  // Refresh all metrics
  const refreshMetrics = useCallback(async () => {
    setError(null);
    try {
      await Promise.all([
        fetchSystemMetrics(),
        fetchUserMetrics(),
        fetchOrganizationMetrics(),
        fetchComplianceMetrics(),
        fetchPerformanceMetrics(),
        fetchCulturalMetrics(),
      ]);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching metrics');
    }
  }, [
    fetchSystemMetrics,
    fetchUserMetrics,
    fetchOrganizationMetrics,
    fetchComplianceMetrics,
    fetchPerformanceMetrics,
    fetchCulturalMetrics,
  ]);

  // Refresh recent data
  const refreshRecentData = useCallback(async () => {
    try {
      await Promise.all([fetchRecentUsers(), fetchRecentOrganizations()]);
    } catch (err) {
      console.error('Error refreshing recent data:', err);
    }
  }, [fetchRecentUsers, fetchRecentOrganizations]);

  // Refresh all data
  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([refreshMetrics(), refreshRecentData()]);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while refreshing data');
    } finally {
      setLoading(false);
    }
  }, [refreshMetrics, refreshRecentData]);

  // Individual refresh functions
  const refreshUsers = useCallback(async () => {
    try {
      await fetchRecentUsers();
    } catch (err) {
      console.error('Error refreshing users:', err);
    }
  }, [fetchRecentUsers]);

  const refreshOrganizations = useCallback(async () => {
    try {
      await fetchRecentOrganizations();
    } catch (err) {
      console.error('Error refreshing organizations:', err);
    }
  }, [fetchRecentOrganizations]);

  // Cache control functions
  const clearCache = useCallback(() => {
    adminDataCache.clear();
  }, []);

  const setCacheTimeout = useCallback((timeout: number) => {
    adminDataCache.setDefaultTimeout(timeout);
  }, []);

  // Initial data load
  useEffect(() => {
    refreshData();
  }, [timeRange]); // Refresh when time range changes

  // Auto-refresh setup
  useEffect(() => {
    if (!enableAutoRefresh) return;

    const interval = setInterval(() => {
      refreshMetrics(); // Only refresh metrics, not all data
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [enableAutoRefresh, refreshInterval, refreshMetrics]);

  // Clear cache when time range changes
  useEffect(() => {
    adminDataCache.clearByPattern('Metrics');
  }, [timeRange]);

  return {
    // Metrics
    systemMetrics,
    userMetrics,
    organizationMetrics,
    complianceMetrics,
    performanceMetrics,
    culturalMetrics,

    // Recent data
    recentUsers,
    recentOrganizations,

    // State
    loading,
    error,
    lastUpdated,

    // Actions
    refreshData,
    refreshMetrics,
    refreshUsers,
    refreshOrganizations,

    // Cache control
    clearCache,
    setCacheTimeout,
  };
};

// Additional hook for user management
export const useUserManagement = () => {
  const [users, setUsers] = useState<IraqiUser[] | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const adminService = useMemo(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const apiKey = process.env.NEXT_PUBLIC_API_KEY || 'dev-key';
    return new IraqiAdminService(baseUrl, apiKey);
  }, []);

  const refreshUsers = useCallback(
    async (page: number = 1, pageSize: number = 20, filters?: any, sort?: any) => {
      setLoading(true);
      setError(null);

      try {
        const response = await adminService.getUsers(page, pageSize, filters, sort);
        if (response.success && response.data) {
          setUsers(response.data.items);
          setTotalCount(response.data.totalCount);
        } else {
          throw new Error(response.error || 'Failed to fetch users');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    },
    [adminService]
  );

  const createUser = useCallback(
    async (userData: Partial<IraqiUser>) => {
      return await adminService.createUser(userData);
    },
    [adminService]
  );

  const updateUser = useCallback(
    async (userId: string, updates: Partial<IraqiUser>) => {
      return await adminService.updateUser(userId, updates);
    },
    [adminService]
  );

  const deleteUser = useCallback(
    async (userId: string) => {
      return await adminService.deleteUser(userId);
    },
    [adminService]
  );

  const activateUser = useCallback(
    async (userId: string) => {
      return await adminService.activateUser(userId);
    },
    [adminService]
  );

  const deactivateUser = useCallback(
    async (userId: string) => {
      return await adminService.deactivateUser(userId);
    },
    [adminService]
  );

  const assignRole = useCallback(
    async (userId: string, role: any, professionalRole?: any) => {
      return await adminService.assignRole(userId, role, professionalRole);
    },
    [adminService]
  );

  const bulkUpdateUsers = useCallback(
    async (userIds: string[], updates: Partial<IraqiUser>) => {
      const promises = userIds.map(id => adminService.updateUser(id, updates));
      return await Promise.all(promises);
    },
    [adminService]
  );

  const exportUsers = useCallback(
    async (format: 'csv' | 'excel' | 'pdf', filters?: any) => {
      return await adminService.exportUserReport(format, filters);
    },
    [adminService]
  );

  return {
    users,
    totalCount,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    activateUser,
    deactivateUser,
    assignRole,
    bulkUpdateUsers,
    exportUsers,
    refreshUsers,
  };
};

export default useAdminData;
