# @iraqi-ai/supabase-client

Type-safe Supabase client utilities for the Iraqi AI Chat System.

## Installation

This package is part of the Iraqi AI workspace and is automatically available to other workspace packages.

## Usage

### Client Components (Browser)

```typescript
'use client';

import { createClient } from '@iraqi-ai/supabase-client/browser';

export function MyComponent() {
  const supabase = createClient();

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('test_users')
      .select('*')
      .eq('name', 'John');

    if (error) console.error(error);
    return data;
  };

  return <button onClick={fetchData}>Fetch Users</button>;
}
```

### Server Components

```typescript
import { createClient } from '@iraqi-ai/supabase-client/server';

export default async function ServerPage() {
  const supabase = createClient();

  const { data: users } = await supabase
    .from('test_users')
    .select('*');

  return (
    <div>
      {users?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### Server Actions

```typescript
'use server';

import { createActionClient } from '@iraqi-ai/supabase-client/server';

export async function updateProfile(formData: FormData) {
  const supabase = createActionClient();

  const { error } = await supabase
    .from('test_users')
    .update({ name: formData.get('name') as string })
    .eq('id', formData.get('id') as string);

  if (error) throw error;
}
```

### Admin Operations (Server-Side Only)

```typescript
import { createAdminClient } from '@iraqi-ai/supabase-client/admin';

export async function deleteUser(userId: string) {
  const supabase = createAdminClient();

  // Bypasses RLS - use with caution!
  await supabase.auth.admin.deleteUser(userId);
}
```

## Type Safety

All clients are fully typed with your database schema:

```typescript
import type { Database } from '@iraqi-ai/types';

// TypeScript knows your table structure!
const { data } = await supabase
  .from('test_users') // ✅ Autocomplete available
  .select('id, name, email') // ✅ Column names validated
  .eq('name', 'John'); // ✅ Type-safe filters
```

## Security

- **Browser Client**: Uses anon key, safe for client-side when RLS is enabled
- **Server Client**: Uses anon key with cookies for user authentication
- **Admin Client**: Uses service role key, bypasses RLS - server-side only!

## Environment Variables

Required environment variables:

```bash
# Browser-safe (NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx

# Server-only (no prefix)
SUPABASE_SERVICE_ROLE_KEY=eyJxxx
```

## Best Practices

1. ✅ Create fresh client instances (no singletons)
2. ✅ Use browser client in Client Components
3. ✅ Use server client in Server Components
4. ✅ Use action client in Server Actions
5. ✅ Use admin client only when RLS bypass is required
6. ❌ Never expose service role key to browser
7. ❌ Never use singleton pattern with Next.js App Router

## Development

```bash
# Run tests
bun test

# Type check
bun run typecheck

# Build package
bun run build
```

## License

MIT
