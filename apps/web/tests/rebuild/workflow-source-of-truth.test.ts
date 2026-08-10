import { describe, expect, test } from "bun:test";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const repoRoot = resolve(webRoot, "../..");
const workflowRoot = resolve(repoRoot, ".github/workflows");

function workflowFiles(): Array<{ name: string; content: string }> {
  return readdirSync(workflowRoot, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        (entry.name.endsWith(".yml") || entry.name.endsWith(".yaml")),
    )
    .map((entry) => ({
      name: entry.name,
      content: readFileSync(resolve(workflowRoot, entry.name), "utf8").replaceAll(
        "\r\n",
        "\n",
      ),
    }));
}

const requiredPhaseWorkflows = [
  "p1-browser.yml",
  "p1-data-contract.yml",
  "p2-browser.yml",
  "p2-data-contract.yml",
  "p3-browser.yml",
  "p3-data-contract.yml",
  "p4-browser.yml",
  "p4-data-contract.yml",
  "p5-ai-controls.yml",
  "p5-openrouter-byok.yml",
  "p5-operational-baseline.yml",
] as const;

describe("GitHub workflow source of truth", () => {
  test("runs the complete active phase matrix against main", () => {
    const workflows = new Map(
      workflowFiles().map((workflow) => [workflow.name, workflow.content]),
    );

    for (const workflowName of requiredPhaseWorkflows) {
      const workflow = workflows.get(workflowName);
      expect(workflow, `${workflowName} is required`).toBeDefined();
      expect(workflow).toContain("branches: [main]");
      expect(workflow).not.toMatch(/branches:\s*\[[^\]]*\bdevelop\b/iu);
    }
  });

  test("does not retain stale develop targets or rejected product identifiers", () => {
    for (const workflow of workflowFiles()) {
      expect(workflow.content, workflow.name).not.toMatch(
        /branches:\s*\[[^\]]*\bdevelop\b/iu,
      );
      expect(workflow.content, workflow.name).not.toMatch(/kiteb[-_]/iu);
    }
  });
});
