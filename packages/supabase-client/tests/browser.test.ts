import { describe, test, expect, beforeEach } from 'bun:test';
import { createClient } from '../src/browser';

describe('Browser Client', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
  });

  test('should create client instance', () => {
    const client = createClient();
    expect(client).toBeDefined();
    expect(typeof client.from).toBe('function');
    expect(typeof client.auth.signInWithPassword).toBe('function');
  });

  test('should create different instances on each call', () => {
    const client1 = createClient();
    const client2 = createClient();
    // Instances should be different (no singleton)
    expect(client1).not.toBe(client2);
  });
});
