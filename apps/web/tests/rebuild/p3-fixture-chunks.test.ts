import { describe, expect, test } from "bun:test";
import { chunkFixtureText } from "../../src/lib/ai/fixture-chunks";

describe("P3 deterministic fixture chunks", () => {
  test("reassembles long English words without dropping characters", () => {
    const value =
      "The saved workspace passage supports this deterministic answer [S1].";
    const chunks = chunkFixtureText(value, 12);

    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.join("")).toBe(value);
    expect(chunks.every((chunk) => Array.from(chunk).length <= 12)).toBe(true);
  });

  test("preserves Arabic, English, emoji, spaces, and punctuation", () => {
    const value = "العربية وEnglish 🚀 2026 — محفوظة بالكامل.";
    expect(chunkFixtureText(value, 5).join("")).toBe(value);
  });

  test("handles empty input and rejects invalid chunk sizes", () => {
    expect(chunkFixtureText("")).toEqual([]);
    expect(() => chunkFixtureText("value", 0)).toThrow(RangeError);
    expect(() => chunkFixtureText("value", 1.5)).toThrow(RangeError);
  });
});
