/**
 * Mock utilities for PydanticAI Iraqi agents
 * Provides test mocks for agent responses with cultural compliance simulation
 */

import { mock } from "bun:test";

/**
 * Configuration for mocking an Iraqi AI agent
 */
export interface MockAgentConfig {
  /** Predefined responses for specific prompts */
  responses?: Record<string, any>;
  /** List of available tools */
  tools?: string[];
  /** Cultural compliance score (0.0 - 1.0) */
  culturalCompliance?: number;
  /** Simulated latency in ms */
  latency?: number;
}

/**
 * Mock result from an Iraqi AI agent
 */
export interface MockAgentResult {
  /** Response data */
  data: string | any;
  /** Cultural appropriateness score */
  culturalScore: number;
  /** Islamic compliance status */
  islamicCompliance: boolean;
  /** Iraqi dialect detected */
  dialect?: string;
}

/**
 * Creates a mock PydanticAI Iraqi agent for testing
 *
 * @example
 * ```typescript
 * const mockAgent = createMockIraqiAgent({
 *   responses: {
 *     "مرحباً": "السلام عليكم ورحمة الله وبركاته"
 *   },
 *   culturalCompliance: 0.95
 * });
 *
 * const result = await mockAgent.run("مرحباً");
 * expect(result.culturalScore).toBe(0.95);
 * ```
 */
export function createMockIraqiAgent(config: MockAgentConfig = {}) {
  const {
    responses = {},
    tools = [],
    culturalCompliance = 0.95,
    latency = 0,
  } = config;

  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const generateMockResult = (prompt: string): MockAgentResult => ({
    data: responses[prompt] || "مرحباً، كيف يمكنني مساعدتك؟",
    culturalScore: culturalCompliance,
    islamicCompliance: culturalCompliance >= 0.9,
    dialect: detectDialect(prompt),
  });

  return {
    run: mock(async (prompt: string): Promise<MockAgentResult> => {
      if (latency > 0) await wait(latency);
      return generateMockResult(prompt);
    }),

    run_sync: mock((prompt: string): MockAgentResult => {
      return generateMockResult(prompt);
    }),

    tools: tools,

    culturalCompliance: culturalCompliance,
  };
}

/**
 * Simple dialect detection for mock purposes
 */
function detectDialect(text: string): string {
  if (text.includes("شلونك") || text.includes("شكو ماكو")) return "baghdad";
  if (text.includes("شخبارك")) return "basra";
  if (text.includes("كيفك")) return "mosul";
  return "standard";
}

/**
 * Creates a mock agent that simulates cultural validation failures
 */
export function createMockCulturallyNonCompliantAgent() {
  return createMockIraqiAgent({
    responses: {
      test: "Culturally inappropriate content",
    },
    culturalCompliance: 0.5,
  });
}

/**
 * Creates a mock agent that simulates slow responses
 */
export function createMockSlowAgent(latencyMs: number = 1000) {
  return createMockIraqiAgent({
    latency: latencyMs,
    culturalCompliance: 0.95,
  });
}
