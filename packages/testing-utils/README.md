# @iraqi-ai/testing-utils

Shared testing utilities with Iraqi cultural validation and Arabic RTL testing support for the Iraqi AI Chat System.

## Features

- **Mock Utilities**: Mock external services (Anthropic, Supabase, Iraqi payment gateways)
- **Test Fixtures**: Iraqi-specific test data (users, Arabic text, cultural scenarios)
- **Custom Matchers**: Cultural and Arabic validation matchers for Bun test
- **Helper Functions**: Database setup, auth token generation, cultural validation

## Installation

```bash
bun add -D @iraqi-ai/testing-utils
```

## Usage

### Import all utilities

```typescript
import {
  createMockIraqiAgent,
  iraqiUserFixtures,
  toBeArabicText,
  setupTestDatabase,
} from "@iraqi-ai/testing-utils";
```

### Import specific modules

```typescript
import { createMockIraqiAgent } from "@iraqi-ai/testing-utils/mocks";
import { iraqiUserFixtures } from "@iraqi-ai/testing-utils/fixtures";
import { toBeArabicText } from "@iraqi-ai/testing-utils/matchers";
import { setupTestDatabase } from "@iraqi-ai/testing-utils/helpers";
```

## Custom Matchers

Register custom matchers in your test setup:

```typescript
import { expect } from "bun:test";
import "@iraqi-ai/testing-utils/matchers";

// Use custom matchers
expect("مرحباً").toBeArabicText();
expect(element).toBeRTLAligned();
await expect(content).toBeCulturallyAppropriate(0.95);
```

## Development

```bash
# Run tests
bun test

# Run tests in watch mode
bun test:watch

# Generate coverage report
bun test:coverage

# Build package
bun run build

# Type check
bun run typecheck
```

## License

MIT
