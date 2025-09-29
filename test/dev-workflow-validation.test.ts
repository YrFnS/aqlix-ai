import { describe, it, expect } from "bun:test";

describe("Development Workflow Validation", () => {
  it("should have properly configured development ports", () => {
    const fs = require("fs");
    const path = require("path");

    // Check web app dev script uses port 3000
    const webPkgPath = path.join(process.cwd(), "apps", "web", "package.json");
    const webPkg = JSON.parse(fs.readFileSync(webPkgPath, "utf8"));

    expect(webPkg.scripts.dev).toContain("--port 3000");
    console.log("✅ Web app configured for port 3000");

    // Check API dev script uses port 8000
    const apiPkgPath = path.join(process.cwd(), "apps", "api", "package.json");
    const apiPkg = JSON.parse(fs.readFileSync(apiPkgPath, "utf8"));

    expect(apiPkg.scripts["dev:python"]).toContain("--port 8000");
    console.log("✅ API configured for port 8000");
  });

  it("should have concurrent development scripts configured", () => {
    const fs = require("fs");
    const path = require("path");

    const rootPkgPath = path.join(process.cwd(), "package.json");
    const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, "utf8"));

    // Check dev:all script exists and uses concurrently
    expect(rootPkg.scripts["dev:all"]).toBeDefined();
    expect(rootPkg.scripts["dev:all"]).toContain("concurrently");
    expect(rootPkg.scripts["dev:all"]).toContain("dev:web");
    expect(rootPkg.scripts["dev:all"]).toContain("dev:api");

    // Check dev:full script includes types watching
    expect(rootPkg.scripts["dev:full"]).toBeDefined();
    expect(rootPkg.scripts["dev:full"]).toContain("@iraqi-ai/types");
    expect(rootPkg.scripts["dev:full"]).toContain("dev:watch");

    console.log("✅ Concurrent development scripts properly configured");
  });

  it("should have workspace filter commands working", () => {
    const fs = require("fs");
    const path = require("path");

    const rootPkgPath = path.join(process.cwd(), "package.json");
    const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, "utf8"));

    // Check workspace filter syntax in scripts
    expect(rootPkg.scripts.dev).toContain("--filter ./apps/web");
    expect(rootPkg.scripts["dev:web"]).toContain("--filter ./apps/web");
    expect(rootPkg.scripts["dev:api"]).toContain("--filter ./apps/api");

    console.log("✅ Workspace filter commands properly configured");
  });

  it("should have build pipeline properly sequenced", () => {
    const fs = require("fs");
    const path = require("path");

    const rootPkgPath = path.join(process.cwd(), "package.json");
    const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, "utf8"));

    // Check build sequence: clean -> packages -> apps -> analyze
    const buildScript = rootPkg.scripts.build;
    const steps = buildScript.split(" && ");

    expect(steps[0]).toContain("build:clean");
    expect(steps[1]).toContain("build:packages");
    expect(steps[2]).toContain("build:apps");
    expect(steps[3]).toContain("build:analyze");

    console.log("✅ Build pipeline properly sequenced");
  });

  it("should have testing scripts for all levels", () => {
    const fs = require("fs");
    const path = require("path");

    const rootPkgPath = path.join(process.cwd(), "package.json");
    const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, "utf8"));

    // Check testing scripts exist
    expect(rootPkg.scripts.test).toBeDefined();
    expect(rootPkg.scripts["test:cultural"]).toBeDefined();
    expect(rootPkg.scripts["test:arabic"]).toBeDefined();
    expect(rootPkg.scripts["test:e2e"]).toBeDefined();
    expect(rootPkg.scripts["test:all"]).toBeDefined();

    console.log("✅ All testing scripts configured");
  });

  it("should have proper dependency management", () => {
    // Check that concurrently is installed for concurrent dev
    const fs = require("fs");
    const path = require("path");

    const rootPkgPath = path.join(process.cwd(), "package.json");
    const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, "utf8"));

    expect(rootPkg.devDependencies.concurrently).toBeDefined();
    console.log("✅ Concurrently dependency available for concurrent development");
  });

  it("should validate workspace protocol usage", () => {
    const fs = require("fs");
    const path = require("path");

    // Check web app uses workspace:* for internal deps
    const webPkgPath = path.join(process.cwd(), "apps", "web", "package.json");
    const webPkg = JSON.parse(fs.readFileSync(webPkgPath, "utf8"));

    const workspaceDeps = Object.entries(webPkg.dependencies)
      .filter(([name, version]) => typeof version === 'string' && version.startsWith('workspace:'));

    expect(workspaceDeps.length).toBeGreaterThan(0);
    console.log(`✅ Found ${workspaceDeps.length} workspace dependencies in web app`);

    // Check API app uses workspace:* for internal deps
    const apiPkgPath = path.join(process.cwd(), "apps", "api", "package.json");
    const apiPkg = JSON.parse(fs.readFileSync(apiPkgPath, "utf8"));

    const apiWorkspaceDeps = Object.entries(apiPkg.dependencies)
      .filter(([name, version]) => typeof version === 'string' && version.startsWith('workspace:'));

    expect(apiWorkspaceDeps.length).toBeGreaterThan(0);
    console.log(`✅ Found ${apiWorkspaceDeps.length} workspace dependencies in API`);
  });
});