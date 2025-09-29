/**
 * Iraqi A2A Protocol Integration
 *
 * Complete multi-transport agent coordination system for Iraqi AI Chat System
 * Based on A2A protocol patterns with Iraqi cultural sovereignty enhancements
 *
 * Features:
 * - Multi-transport support: JSON-RPC, gRPC, HTTP+JSON
 * - Cultural sovereignty validation pipeline
 * - 22 specialized Iraqi agents coordination
 * - <5000ms coordination time targets with cultural validation
 * - Professional domain routing and intelligent agent selection
 * - Enhanced security levels including governmental-grade protocols
 */

// Core types and interfaces
export * from "./types/iraqi-a2a-types.js";

// Agent coordination system
export * from "./coordination/iraqi-agent-coordinator.js";

// Multi-transport communication layer
export * from "./transport/iraqi-transport-manager.js";

// Agent registry and discovery
export * from "./registry/iraqi-agent-registry.js";

// Re-export key classes for easy access
export { IraqiAgentCoordinator } from "./coordination/iraqi-agent-coordinator.js";
export { IraqiTransportManager } from "./transport/iraqi-transport-manager.js";
export { IraqiAgentRegistry } from "./registry/iraqi-agent-registry.js";

// Version information
export const IRAQI_A2A_VERSION = "1.0.0";
export const PROTOCOL_VERSION = "1.0";

/**
 * Quick setup helper for complete Iraqi A2A system
 */
export function createIraqiA2ASystem(config: {
  transportConfig: any; // IraqiTransportConfig
  culturalValidation?: boolean;
  performanceOptimization?: boolean;
}) {
  const registry = new IraqiAgentRegistry();
  const transportManager = new IraqiTransportManager(config.transportConfig);
  const coordinator = new IraqiAgentCoordinator(registry, transportManager);

  return {
    registry,
    transportManager,
    coordinator,

    // Initialize the system with all 22 Iraqi agents
    async initialize() {
      const result = await registry.registerIraqiAgentEcosystem();
      return result;
    },
  };
}
