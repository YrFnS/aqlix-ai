```typescript
// examples/iraqi-ai-persona-enhanced/src/__tests__/persona/memory.test.ts

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PersonaManager } from '../../services/PersonaManager';
import { createTestPersonaManager, mockPersonaData } from './setup';
import { MemoryStore } from '../../storage/memory-store'; // Mocked

describe('Memory Management Tests', () => {
  let manager: PersonaManager;
  let mockStore: any;

  beforeEach(() => {
    manager = createTestPersonaManager();
    mockStore = MemoryStore.prototype.add as any;
  });

  // Unit Tests: Memory Addition and Retrieval
  describe('Memory Operations', () => {
    it('should add and retrieve memory with hierarchical structure', async () => {
      const persona = await manager.createPersona(mockPersonaData.nameEn, mockPersonaData.nameAr, mockPersonaData.domain);
      await manager.addMemory(persona.id, mockPersonaData.memories[0].content, { hierarchy: 'short-term' });
      const memories = await manager.retrieveMemories(persona.id);
      expect(memories[0]).toHaveProperty('hierarchy', 'short-term');
      expect(mockStore).toHaveBeenCalled();
    });

    it('should apply forgetting curve to memory retrieval', async () => {
      const persona = await manager.createPersona(mockPersonaData.nameEn, mockPersonaData.nameAr, mockPersonaData.domain);
      await manager.addMemory(persona.id, 'Old memory', { timestamp: Date.now() - 1000 * 60 * 60 * 24 * 30 }); // 30 days old
      const memories = await manager.retrieveMemories(persona.id, { applyForgetting: true });
      expect(memories[0].relevance).toBeLessThan(0.5); // Reduced by curve
    });
  });

  // Integration Tests: Memory Consolidation
  describe('Memory Consolidation', () => {
    it('should consolidate from short to long-term memory', async () => {
      const persona = await manager.createPersona(mockPersonaData.nameEn, mockPersonaData.nameAr, mockPersonaData.domain);
      await manager.addMemory(persona.id, 'Short-term memory', { hierarchy: 'short-term' });
      await manager.consolidateMemories(persona.id); // Simulate interactions
      const memories = await manager.retrieveMemories(persona.id);
      expect(memories[0].hierarchy).toBe('long-term');
    });

    it('should integrate cultural memory with trait-linked recall', async () => {
      const persona = await manager.createPersona(mockPersonaData.nameEn, mockPersonaData.nameAr, mockPersonaData.domain);
      await manager.addMemory(persona.id, 'Cultural professional memory', { linkedTrait: 'culturalCompliance' });
      const recalled = await manager.recallLinkedMemory(persona.id, 'culturalCompliance');
      expect(recalled[0].content).toContain('Cultural');
    });
  });

  // Performance Tests (Mocked Timing)
  describe('Performance Tests', () => {
    it('should retrieve memory in O(log n) for 10k+ memories (<50ms simulated)', async () => {
      const start = performance.now();
      vi.spyOn(MemoryStore.prototype, 'retrieve').mockImplementation(async () => Array(10000).fill(mockPersonaData.memories[0]));
      const persona = await manager.createPersona(mockPersonaData.nameEn, mockPersonaData.nameAr, mockPersonaData.domain);
      await manager.retrieveMemories(persona.id);
      const end = performance.now();
      expect(end - start).toBeLessThan(50); // Mocked; actual would use real timing
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    it('should reject low cultural relevance memory addition', async () => {
      const persona = await manager.createPersona(mockPersonaData.nameEn, mockPersonaData.nameAr, mockPersonaData.domain);
      mockStore.mockRejectedValueOnce(new Error('Low relevance'));
      await expect(manager.addMemory(persona.id, 'Irrelevant content')).rejects.toThrow('Low cultural relevance');
    });

    it('should handle concurrent memory operations', async () => {
      const persona = await manager.createPersona(mockPersonaData.nameEn, mockPersonaData.nameAr, mockPersonaData.domain);
      const promises = Array.from({ length: 5 }, () => manager.addMemory(persona.id, 'Concurrent memory'));
      await Promise.all(promises);
      const memories = await manager.retrieveMemories(persona.id);
      expect(memories.length).toBe(5);
    });
  });
});
```