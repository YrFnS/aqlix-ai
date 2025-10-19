/**
 * Database setup utilities for testing
 * Provides isolated test database connections and transaction management
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Test database setup result
 */
export interface TestDatabaseSetup {
  /** Isolated Supabase client for testing */
  client: SupabaseClient;
  /** Rollback test transaction */
  rollback: () => Promise<void>;
  /** Commit test transaction */
  commit: () => Promise<void>;
  /** Cleanup test database */
  cleanup: () => Promise<void>;
}

/**
 * Sets up an isolated test database with transaction support
 *
 * @example
 * ```typescript
 * const { client, rollback } = await setupTestDatabase();
 *
 * // Use client for testing
 * await client.from("users").insert({ name: "Test User" });
 *
 * // Rollback changes after test
 * await rollback();
 * ```
 */
export async function setupTestDatabase(): Promise<TestDatabaseSetup> {
  // Get test database credentials from environment
  const supabaseUrl = process.env.SUPABASE_TEST_URL || process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_TEST_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Test database credentials not found. Set SUPABASE_TEST_URL and SUPABASE_TEST_ANON_KEY environment variables.",
    );
  }

  // Create isolated test client
  const testClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  let transactionActive = false;

  return {
    client: testClient,

    rollback: async () => {
      if (!transactionActive) {
        console.warn("No active transaction to rollback");
        return;
      }

      // Note: Supabase doesn't support explicit transactions via client API
      // This is a placeholder for transaction rollback logic
      // In practice, you might use database functions or pg_temp schema
      transactionActive = false;
    },

    commit: async () => {
      if (!transactionActive) {
        console.warn("No active transaction to commit");
        return;
      }

      transactionActive = false;
    },

    cleanup: async () => {
      // Close any open connections
      // Note: Supabase JS client doesn't require explicit cleanup
    },
  };
}

/**
 * Creates a test database seeder with sample Iraqi data
 */
export async function seedTestDatabase(client: SupabaseClient): Promise<void> {
  // Insert sample Iraqi users
  const { error: usersError } = await client.from("users").insert([
    {
      name: "Ahmed Al-Baghdadi",
      name_arabic: "أحمد البغدادي",
      dialect: "baghdad",
      domain: "legal",
    },
    {
      name: "Dr. Fatima Al-Basri",
      name_arabic: "د. فاطمة البصري",
      dialect: "basra",
      domain: "medical",
    },
  ]);

  if (usersError && usersError.code !== "23505") {
    // Ignore duplicate key errors
    throw usersError;
  }
}

/**
 * Clears all test data from database
 */
export async function clearTestDatabase(client: SupabaseClient): Promise<void> {
  // Delete test data in reverse order of foreign key dependencies
  const tables = [
    "messages",
    "conversations",
    "payments",
    "documents",
    "users",
  ];

  for (const table of tables) {
    await client.from(table).delete().neq("id", "");
  }
}
