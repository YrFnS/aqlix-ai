/**
 * Mock utilities for Supabase client
 * Provides test mocks for database operations, auth, and real-time subscriptions
 */

import { mock } from "bun:test";

/**
 * Mock Supabase query response
 */
export interface MockSupabaseResponse<T = any> {
  data: T | null;
  error: Error | null;
  status: number;
  statusText: string;
}

/**
 * Configuration for mocking Supabase client
 */
export interface MockSupabaseConfig {
  /** Predefined query responses */
  responses?: Record<string, any>;
  /** Simulated latency in ms */
  latency?: number;
  /** Failure rate (0.0 - 1.0) */
  failureRate?: number;
}

/**
 * Creates a mock Supabase client for testing
 *
 * @example
 * ```typescript
 * const mockSupabase = createMockSupabaseClient({
 *   responses: {
 *     "users": [{ id: 1, name: "Ahmed" }]
 *   }
 * });
 *
 * const { data } = await mockSupabase.from("users").select();
 * expect(data).toHaveLength(1);
 * ```
 */
export function createMockSupabaseClient(config: MockSupabaseConfig = {}) {
  const { responses = {}, latency = 0, failureRate = 0 } = config;

  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const shouldFail = () => Math.random() < failureRate;

  let currentTable: string | null = null;
  let currentQuery: any = {};

  const mockQuery = {
    select: mock(function (columns = "*") {
      if (latency > 0) wait(latency);

      if (shouldFail()) {
        return Promise.resolve({
          data: null,
          error: new Error("Database query failed"),
          status: 500,
          statusText: "Internal Server Error",
        });
      }

      const data = responses[currentTable!] || [];
      return Promise.resolve({
        data,
        error: null,
        status: 200,
        statusText: "OK",
      });
    }),

    insert: mock(function (data: any) {
      if (latency > 0) wait(latency);

      if (shouldFail()) {
        return Promise.resolve({
          data: null,
          error: new Error("Insert failed"),
          status: 500,
          statusText: "Internal Server Error",
        });
      }

      return Promise.resolve({
        data: Array.isArray(data) ? data : [data],
        error: null,
        status: 201,
        statusText: "Created",
      });
    }),

    update: mock(function (data: any) {
      if (latency > 0) wait(latency);

      if (shouldFail()) {
        return Promise.resolve({
          data: null,
          error: new Error("Update failed"),
          status: 500,
          statusText: "Internal Server Error",
        });
      }

      return Promise.resolve({
        data: [data],
        error: null,
        status: 200,
        statusText: "OK",
      });
    }),

    delete: mock(function () {
      if (latency > 0) wait(latency);

      if (shouldFail()) {
        return Promise.resolve({
          data: null,
          error: new Error("Delete failed"),
          status: 500,
          statusText: "Internal Server Error",
        });
      }

      return Promise.resolve({
        data: [],
        error: null,
        status: 204,
        statusText: "No Content",
      });
    }),

    eq: mock(function (column: string, value: any) {
      currentQuery.eq = { column, value };
      return this;
    }),

    neq: mock(function (column: string, value: any) {
      currentQuery.neq = { column, value };
      return this;
    }),

    gt: mock(function (column: string, value: any) {
      currentQuery.gt = { column, value };
      return this;
    }),

    lt: mock(function (column: string, value: any) {
      currentQuery.lt = { column, value };
      return this;
    }),

    order: mock(function (column: string, options: any = {}) {
      currentQuery.order = { column, ...options };
      return this;
    }),

    limit: mock(function (count: number) {
      currentQuery.limit = count;
      return this;
    }),

    single: mock(function () {
      return this.select().then((result: any) => ({
        ...result,
        data: result.data?.[0] || null,
      }));
    }),
  };

  return {
    from: mock((table: string) => {
      currentTable = table;
      currentQuery = {};
      return mockQuery;
    }),

    auth: {
      signIn: mock(async (credentials: any) => {
        await wait(latency);

        if (shouldFail()) {
          return {
            data: null,
            error: new Error("Authentication failed"),
          };
        }

        return {
          data: {
            user: {
              id: "mock-user-id",
              email: credentials.email,
              ...credentials,
            },
            session: {
              access_token: "mock-access-token",
              refresh_token: "mock-refresh-token",
            },
          },
          error: null,
        };
      }),

      signOut: mock(async () => {
        await wait(latency);
        return { error: null };
      }),

      getUser: mock(async () => {
        await wait(latency);
        return {
          data: {
            user: {
              id: "mock-user-id",
              email: "test@example.com",
            },
          },
          error: null,
        };
      }),
    },

    storage: {
      from: mock((bucket: string) => ({
        upload: mock(async (path: string, file: any) => {
          await wait(latency);
          return {
            data: { path },
            error: null,
          };
        }),
        download: mock(async (path: string) => {
          await wait(latency);
          return {
            data: new Blob(["mock file content"]),
            error: null,
          };
        }),
      })),
    },
  };
}

/**
 * Creates a mock Supabase client that always fails
 */
export function createMockFailingSupabaseClient() {
  return createMockSupabaseClient({
    failureRate: 1.0,
  });
}

/**
 * Creates a mock Supabase client with slow responses
 */
export function createMockSlowSupabaseClient(latencyMs: number = 2000) {
  return createMockSupabaseClient({
    latency: latencyMs,
  });
}
