```typescript
// examples/iraqi-ai-persona-enhanced/src/__tests__/persona/persona.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { PersonaManager } from '../../services/PersonaManager'; // Adjust path
import { createTestPersonaManager, mockPersonaData, mockInvalidData, customReporter } from './setup';
import { CulturalValidatorAgent } from '../../agents/iraqi-cultural-validator'; // Mocked
import type { Persona } from '../../types/persona'; // Assume type exists

describe('Persona Management Service - Unit & Integration Tests', () => {
  let manager: PersonaManager;
  let mockCulturalValidator: any;

  beforeEach(() => {
    manager = createTestPersonaManager();
    mockCulturalValidator = CulturalValidatorAgent.validate as any;
  });

  // Unit Tests: Persona Creation Validation
  describe('Persona Creation Validation', () => {
    it('should create persona with valid English/Arabic names and domain', async () => {
      const persona = await manager.createPersona(mockPersonaData.nameEn, mockPersonaData.nameAr, mockPersonaData.domain);
      expect(persona).toHaveProperty('id');
      expect(persona.nameEn).toBe(mockPersonaData.nameEn);
      expect(persona.nameAr).toBe(mockPersonaData.nameAr);
      expect(persona.domain).toBe('legal');
      expect(mockCulturalValidator).toHaveBeenCalledWith(expect.objectContaining({ nameAr: mockPersonaData.nameAr }));
    });

    it('should reject invalid English name', async () => {
      await expect(manager.createPersona('Invalid@Name', mockPersonaData.nameAr, mockPersonaData.domain)).rejects.toThrow('Invalid English name');
    });

    it('should reject invalid Arabic name (non-RTL)', async () => {
      await expect(manager.createPersona(mockPersonaData.nameEn, 'Invalid English-like Arabic', mockPersonaData.domain)).rejects.toThrow('Invalid Arabic name');
    });

    it('should reject invalid domain', async () => {
      await expect(manager.createPersona(mockPersonaData.nameEn, mockPersonaData.nameAr, 'invalid')).rejects.toThrow('Invalid domain');
    });
  });

  // Integration Tests: End-to-End Persona Lifecycle
  describe('Persona Lifecycle Integration', () => {
    let personaId: string;

    it('should handle full lifecycle: create → use → update → delete', async () => {
      // Create
      const persona = await manager.createPersona(mockPersonaData.nameEn, mockPersonaData.nameAr, mockPersonaData.domain);
      personaId = persona.id;
      expect(persona).toBeDefined();

      // Use (add memory)
      await manager.addMemory(personaId, mockPersonaData.memories[0].content);
      const memories = await manager.retrieveMemories(personaId);
      expect(memories.length).toBe(1);

      // Update traits
      const updated = await manager.updatePersona(personaId, { traits: { ...mockPersonaData.traits, culturalCompliance: 98 } });
      expect(updated.traits.culturalCompliance).toBe(98);

      // Delete
      await manager.deletePersona(personaId);
      await expect(manager.retrievePersona(personaId)).rejects.toThrow('Persona not found');
    });

    it('should evolve traits over multiple interactions', async () => {
      const persona = await manager.createPersona(mockPersonaData.nameEn, mockPersonaData.nameAr, mockPersonaData.domain);
      // Simulate 3 interactions (reinforcement learning mock)
      for (let i = 0; i < 3; i++) {
        await manager.addInteraction(persona.id, { feedback: 'positive', culturalScore: 95 });
      }
      const evolved = await manager.getPersona(persona.id);
      expect(evolved.traits.culturalCompliance).toBeGreaterThan(95); // Evolves based on feedback
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    it('should handle invalid Arabic input gracefully', async () => {
      mockCulturalValidator.mockResolvedValueOnce({ score: 40, compliant: false });
      await expect(manager.createPersona(mockPersonaData.nameEn, 'Invalid Arabic Input', mockPersonaData.domain)).rejects.toThrow('Cultural validation failed');
    });

    it('should reject low cultural relevance memory', async () => {
      const persona = await manager.createPersona(mockPersonaData.nameEn, mockPersonaData.nameAr, mockPersonaData.domain);
      await expect(manager.addMemory(persona.id, 'Irrelevant non-professional content')).rejects.toThrow('Low cultural relevance');
    });

    it('should handle certification expiry', async () => {
      const persona = await manager.createPersona(mockPersonaData.nameEn, mockPersonaData.nameAr, mockPersonaData.domain);
      await manager.certifyPersona(persona.id, new Date(Date.now() - 1000 * 60 * 60 * 24 * 31)); // Expired
      const certified = await manager.isCertified(persona.id);
      expect(certified).toBe(false);
    });

    it('should handle high-load concurrent operations', async () => {
      const promises = Array.from({ length: 10 }, () => manager.createPersona(mockPersonaData.nameEn, mockPersonaData.nameAr, mockPersonaData.domain));
      const personas = await Promise.all(promises);
      expect(personas.length).toBe(10); // No failures under mock load
    });
  });

  // Reporting
  afterAll(() => {
    customReporter.onTestResult(null, { numFailingTests: 0, numTotalTests: 10 }); // Example summary
  });
});
```;
