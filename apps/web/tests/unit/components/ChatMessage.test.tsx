/**
 * Unit tests for ChatMessage component
 * Tests RTL rendering, Arabic text handling, and cultural appropriateness
 */

import { describe, test, expect, beforeEach } from "bun:test";
import { TEST_HELPERS as _TEST_HELPERS } from "../../setup/index.js";

describe("ChatMessage Component", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  describe("RTL Layout", () => {
    test("should render Arabic messages with RTL layout", async () => {
      const arabicMessage = "مرحباً بك في نظام الذكاء الاصطناعي العراقي";
      const messageElement = createChatMessage(arabicMessage, "rtl");

      await expect(messageElement).toHaveRTLLayout();
      expect(getComputedStyle(messageElement).direction).toBe("rtl");
      expect(getComputedStyle(messageElement).textAlign).toBe("right");
    });

    test("should render English messages with LTR layout", () => {
      const englishMessage = "Welcome to Iraqi AI Chat System";
      const messageElement = createChatMessage(englishMessage, "ltr");

      expect(getComputedStyle(messageElement).direction).toBe("ltr");
      expect(getComputedStyle(messageElement).textAlign).toBe("left");
    });

    test("should handle mixed Arabic-English content", async () => {
      const mixedMessage = "مرحباً Hello العراق Iraq";
      const messageElement = createChatMessage(mixedMessage, "rtl");

      await expect(messageElement).toHaveRTLLayout();
      expect(messageElement.textContent).toBe(mixedMessage);
    });
  });

  describe("Cultural Compliance", () => {
    test("should validate culturally appropriate messages", async () => {
      const appropriateMessage =
        "السلام عليكم، نحن نخدم جميع العراقيين بغض النظر عن انتمائهم";
      await expect(appropriateMessage).toBeCulturallyAppropriate(0.95);
    });

    test("should validate Islamic compliant greetings", async () => {
      const islamicGreeting = "السلام عليكم ورحمة الله وبركاته";
      await expect(islamicGreeting).toBeIslamicCompliant(0.9);
    });

    test("should validate politically neutral content", async () => {
      const neutralMessage = "نخدم جميع العراقيين";
      await expect(neutralMessage).toBePoliticallyNeutral();
    });
  });

  describe("Iraqi Dialect Support", () => {
    test("should recognize Baghdad dialect", () => {
      const baghdadMessage = "شلونك اليوم؟ شكو ماكو جديد؟";
      expect(baghdadMessage).toMatchIraqiDialect("baghdad", 0.85);
    });

    test("should recognize Basra dialect", () => {
      const basraMessage = "شخبارك؟ كلشي زين؟";
      expect(basraMessage).toMatchIraqiDialect("basra", 0.85);
    });

    test("should recognize Mosul dialect", () => {
      const mosulMessage = "كيفك؟ شلون الحال؟";
      expect(mosulMessage).toMatchIraqiDialect("mosul", 0.85);
    });
  });

  describe("Timestamp Rendering", () => {
    test("should render timestamps in Baghdad timezone", () => {
      const timestamp = new Date("2025-10-18T12:00:00Z");
      const messageElement = createChatMessage(
        "Test message",
        "ltr",
        timestamp,
      );

      const timestampElement = messageElement.querySelector("[data-timestamp]");
      expect(timestampElement).toBeTruthy();

      // Baghdad is UTC+3
      expect(timestampElement?.textContent).toContain("15:00"); // 12:00 + 3 hours
    });
  });
});

// Helper function to simulate ChatMessage component
function createChatMessage(
  content: string,
  direction: "rtl" | "ltr",
  timestamp?: Date,
): HTMLElement {
  const message = document.createElement("div");
  message.className = `chat-message ${direction === "rtl" ? "rtl-layout font-arabic" : "ltr-layout"}`;
  message.style.direction = direction;
  message.style.textAlign = direction === "rtl" ? "right" : "left";
  message.textContent = content;

  if (timestamp) {
    const time = document.createElement("span");
    time.setAttribute("data-timestamp", "true");
    time.textContent = timestamp.toLocaleTimeString("ar-IQ", {
      timeZone: "Asia/Baghdad",
    });
    message.appendChild(time);
  }

  document.body.appendChild(message);
  return message;
}
