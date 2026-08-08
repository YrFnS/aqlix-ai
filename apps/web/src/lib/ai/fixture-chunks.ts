export function chunkFixtureText(
  value: string,
  maximumCodePoints = 12,
): string[] {
  if (!Number.isInteger(maximumCodePoints) || maximumCodePoints < 1) {
    throw new RangeError("Fixture chunk size must be a positive integer.");
  }

  if (value.length === 0) return [];

  const codePoints = Array.from(value);
  const chunks: string[] = [];

  for (let index = 0; index < codePoints.length; index += maximumCodePoints) {
    chunks.push(codePoints.slice(index, index + maximumCodePoints).join(""));
  }

  return chunks;
}
