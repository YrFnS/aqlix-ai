/**
 * Mock utilities for Anthropic Claude API
 * Provides test mocks for Claude AI responses with Iraqi cultural context
 */

import { mock } from "bun:test";

/**
 * Claude model types
 */
export type ClaudeModel =
  | "claude-3-opus-20240229"
  | "claude-3-sonnet-20240229"
  | "claude-3-haiku-20240307"
  | "claude-2.1"
  | "claude-2.0";

/**
 * Message role
 */
export type MessageRole = "user" | "assistant" | "system";

/**
 * Claude message content
 */
export interface ClaudeMessage {
  role: MessageRole;
  content: string;
}

/**
 * Claude API response
 */
export interface ClaudeResponse {
  id: string;
  type: "message";
  role: "assistant";
  content: Array<{
    type: "text";
    text: string;
  }>;
  model: ClaudeModel;
  stop_reason: "end_turn" | "max_tokens" | "stop_sequence";
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

/**
 * Configuration for mocking Claude API
 */
export interface MockClaudeConfig {
  /** Predefined responses for specific prompts */
  responses?: Record<string, string>;
  /** Model to simulate */
  model?: ClaudeModel;
  /** Simulated latency in ms */
  latency?: number;
  /** Failure rate (0.0 - 1.0) */
  failureRate?: number;
  /** Cultural compliance score for Iraqi context */
  culturalCompliance?: number;
}

/**
 * Creates a mock Anthropic Claude API client for testing
 *
 * @example
 * ```typescript
 * const mockClaude = createMockAnthropicClient({
 *   responses: {
 *     "مرحباً": "السلام عليكم ورحمة الله وبركاته"
 *   },
 *   culturalCompliance: 0.95
 * });
 *
 * const response = await mockClaude.messages.create({
 *   model: "claude-3-sonnet-20240229",
 *   messages: [{ role: "user", content: "مرحباً" }]
 * });
 *
 * expect(response.content[0].text).toContain("السلام عليكم");
 * ```
 */
export function createMockAnthropicClient(config: MockClaudeConfig = {}) {
  const {
    responses = {},
    model = "claude-3-sonnet-20240229",
    latency = 500,
    failureRate = 0,
    culturalCompliance = 0.95,
  } = config;

  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const shouldFail = () => Math.random() < failureRate;

  const generateResponse = (prompt: string): string => {
    // Check for predefined responses
    if (responses[prompt]) {
      return responses[prompt];
    }

    // Generate culturally appropriate default responses
    if (prompt.includes("مرحباً") || prompt.includes("السلام عليكم")) {
      return "السلام عليكم ورحمة الله وبركاته، كيف يمكنني مساعدتك اليوم؟";
    }

    if (prompt.includes("شلونك") || prompt.includes("شكو ماكو")) {
      return "الحمد لله، شكراً على السؤال. كيف يمكنني خدمتك؟";
    }

    // Default culturally appropriate response
    return "شكراً لتواصلك معنا. نحن هنا لخدمتك بما يتوافق مع قيمنا الإسلامية والعراقية.";
  };

  return {
    messages: {
      create: mock(
        async (params: {
          model: ClaudeModel;
          messages: ClaudeMessage[];
          max_tokens?: number;
          temperature?: number;
        }): Promise<ClaudeResponse> => {
          await wait(latency);

          if (shouldFail()) {
            throw new Error("Claude API error: Rate limit exceeded");
          }

          const lastMessage = params.messages[params.messages.length - 1];
          if (!lastMessage) {
            throw new Error("No messages provided");
          }
          const responseText = generateResponse(lastMessage.content);

          return {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: "message",
            role: "assistant",
            content: [
              {
                type: "text",
                text: responseText,
              },
            ],
            model: params.model || model,
            stop_reason: "end_turn",
            usage: {
              input_tokens: lastMessage.content.length,
              output_tokens: responseText.length,
            },
          };
        },
      ),

      stream: mock(async function* (params: {
        model: ClaudeModel;
        messages: ClaudeMessage[];
      }) {
        await wait(latency);

        if (shouldFail()) {
          throw new Error("Claude API error: Stream failed");
        }

        const lastMessage = params.messages[params.messages.length - 1];
        if (!lastMessage) {
          throw new Error("No messages provided");
        }
        const responseText = generateResponse(lastMessage.content);

        // Simulate streaming by yielding chunks
        const chunks = responseText.split(" ");
        for (const chunk of chunks) {
          await wait(50); // Simulate streaming delay
          yield {
            type: "content_block_delta",
            delta: {
              type: "text_delta",
              text: chunk + " ",
            },
          };
        }
      }),
    },

    // Mock metadata for cultural compliance
    _mock: {
      culturalCompliance,
      model,
    },
  };
}

/**
 * Creates a mock Claude client that always fails
 */
export function createMockFailingAnthropicClient() {
  return createMockAnthropicClient({
    failureRate: 1.0,
  });
}

/**
 * Creates a mock Claude client with slow responses
 */
export function createMockSlowAnthropicClient(latencyMs: number = 3000) {
  return createMockAnthropicClient({
    latency: latencyMs,
  });
}

/**
 * Creates a mock Claude client with culturally non-compliant responses
 */
export function createMockNonCompliantAnthropicClient() {
  return createMockAnthropicClient({
    responses: {
      default: "Generic response without cultural context",
    },
    culturalCompliance: 0.3,
  });
}
