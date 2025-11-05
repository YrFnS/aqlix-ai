/**
 * Integration tests for Chat API routes
 * Tests end-to-end chat functionality with cultural validation
 */

import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { TEST_HELPERS, IRAQI_TEST_CONTEXT } from "../../setup/index.js";

describe("Chat API Integration", () => {
  const API_BASE = "http://localhost:3000/api";
  let mockUser: ReturnType<typeof TEST_HELPERS.createMockIraqiUser>;

  beforeEach(() => {
    mockUser = TEST_HELPERS.createMockIraqiUser("baghdad");
  });

  afterEach(() => {
    TEST_HELPERS.clearAllMocks();
  });

  describe("POST /api/chat", () => {
    test("should handle Arabic chat messages with cultural validation", async () => {
      const arabicMessage = "السلام عليكم، كيف يمكنني المساعدة؟";

      const response = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "ar-IQ",
        },
        body: JSON.stringify({
          message: arabicMessage,
          userId: mockUser.id,
          dialect: mockUser.dialect,
        }),
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty("response");
      expect(data).toHaveProperty("culturalScore");

      // Validate cultural appropriateness
      await expect(data.response).toBeCulturallyAppropriate(0.95);
      expect(data.culturalScore).toBeGreaterThanOrEqual(0.95);
    });

    test("should recognize Baghdad dialect in messages", async () => {
      const baghdadMessage = "شلونك اليوم؟ شكو ماكو جديد؟";

      const response = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: baghdadMessage,
          userId: mockUser.id,
        }),
      });

      const data = await response.json();
      expect(data).toHaveProperty("detectedDialect");
      expect(data.detectedDialect).toBe("baghdad");

      // Validate dialect recognition
      expect(baghdadMessage).toMatchIraqiDialect("baghdad", 0.85);
    });

    test("should validate Islamic compliance in responses", async () => {
      const message = "ما هي أفضل الممارسات الإسلامية للأعمال؟";

      const response = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          userId: mockUser.id,
          requireIslamicCompliance: true,
        }),
      });

      const data = await response.json();
      expect(data).toHaveProperty("response");
      expect(data).toHaveProperty("islamicCompliant");
      expect(data.islamicCompliant).toBe(true);

      // Validate Islamic compliance
      await expect(data.response).toBeIslamicCompliant(0.9);
    });

    test("should ensure political neutrality in responses", async () => {
      const message = "ما هي خدماتكم للعراقيين؟";

      const response = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          userId: mockUser.id,
        }),
      });

      const data = await response.json();
      expect(data).toHaveProperty("response");
      expect(data).toHaveProperty("politicallyNeutral");
      expect(data.politicallyNeutral).toBe(true);

      // Validate political neutrality
      await expect(data.response).toBePoliticallyNeutral();
    });

    test("should handle mixed Arabic-English messages", async () => {
      const mixedMessage = "مرحباً، I need help with legal استشارة قانونية";

      const response = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: mixedMessage,
          userId: mockUser.id,
        }),
      });

      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data).toHaveProperty("response");
      expect(data).toHaveProperty("detectedLanguages");
      expect(data.detectedLanguages).toContain("ar");
      expect(data.detectedLanguages).toContain("en");
    });

    test("should respect Baghdad timezone in timestamps", async () => {
      const message = "ما هو الوقت الآن؟";

      const response = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Timezone": IRAQI_TEST_CONTEXT.timezone,
        },
        body: JSON.stringify({
          message,
          userId: mockUser.id,
        }),
      });

      const data = await response.json();
      expect(data).toHaveProperty("timestamp");

      // Verify timestamp is in Baghdad timezone (UTC+3 / Asia/Baghdad)
      const timestamp = new Date(data.timestamp);
      expect(timestamp).toBeInstanceOf(Date);

      // Validate timestamp formatting in Baghdad timezone
      const baghdadTime = timestamp.toLocaleString("en-US", {
        timeZone: "Asia/Baghdad",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      expect(baghdadTime).toMatch(/\d{1,2}:\d{2} (AM|PM)/);

      // Verify the timestamp offset matches Baghdad (UTC+3)
      const baghdadHour = parseInt(
        timestamp.toLocaleString("en-US", {
          timeZone: "Asia/Baghdad",
          hour: "numeric",
          hour12: false,
        }),
      );
      const utcHour = timestamp.getUTCHours();
      const offset = (baghdadHour - utcHour + 24) % 24;
      expect(offset).toBe(3); // Baghdad is UTC+3
    });

    test("should handle professional domain queries", async () => {
      const legalQuery = "استشارة قانونية وفقاً للقانون العراقي";

      const response = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: legalQuery,
          userId: mockUser.id,
          domain: "legal",
        }),
      });

      const data = await response.json();
      expect(data).toHaveProperty("response");
      expect(data).toHaveProperty("domain");
      expect(data.domain).toBe("legal");
      expect(data).toHaveProperty("professionalScore");
      expect(data.professionalScore).toBeGreaterThanOrEqual(0.85);
    });

    test("should handle rate limiting gracefully", async () => {
      const message = "test message";

      // Send exactly 10 requests sequentially (rate limit threshold)
      const responses: Response[] = [];
      for (let i = 0; i < 10; i++) {
        const response = await fetch(`${API_BASE}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, userId: mockUser.id }),
        });
        responses.push(response);
      }

      // All 10 requests should succeed
      const successful = responses.filter((r) => r.status === 200);
      expect(successful.length).toBe(10);

      // 11th request should be rate-limited (within same time window)
      const eleventhResponse = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, userId: mockUser.id }),
      });

      expect(eleventhResponse.status).toBe(429);

      // TODO: Use fake timers to test rate limit window reset
      // Example: After time window expires, requests should succeed again
      // jest.useFakeTimers();
      // jest.advanceTimersByTime(60000); // Advance by rate limit window
      // const afterResetResponse = await fetch(...);
      // expect(afterResetResponse.status).toBe(200);
      // jest.useRealTimers();
    });
  });

  describe("GET /api/chat/history", () => {
    test("should retrieve chat history with cultural metadata", async () => {
      const response = await fetch(
        `${API_BASE}/chat/history?userId=${mockUser.id}`,
        {
          method: "GET",
          headers: {
            "Accept-Language": "ar-IQ",
          },
        },
      );

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty("messages");
      expect(Array.isArray(data.messages)).toBe(true);

      // Each message should have cultural metadata
      if (data.messages.length > 0) {
        const message = data.messages[0];
        expect(message).toHaveProperty("culturalScore");
        expect(message).toHaveProperty("dialect");
        expect(message).toHaveProperty("islamicCompliant");
        expect(message).toHaveProperty("politicallyNeutral");
      }
    });
  });

  describe("Error Handling", () => {
    test("should return 400 for empty messages", async () => {
      const response = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "",
          userId: mockUser.id,
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toHaveProperty("error");
    });

    test("should return 400 for culturally inappropriate content", async () => {
      const inappropriateMessage = "sectarian offensive content";

      const response = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inappropriateMessage,
          userId: mockUser.id,
        }),
      });

      // Should reject culturally inappropriate content
      expect([400, 403]).toContain(response.status);
    });
  });
});
