```typescript
// examples/iraqi-ai-persona-enhanced/src/__tests__/persona/setup.ts

import { vi, type MockedFunction } from 'vitest'; // Using Vitest/Jest-compatible mocks
import { PersonaManager } from '../../services/PersonaManager'; // Adjust import based on actual service path
import { CulturalValidatorAgent } from '../../agents/iraqi-cultural-validator'; // Mocked agent
import { ArabicProcessor } from '../../utils/arabic-processor'; // Mocked utility
import { MemoryStore } from '../../storage/memory-store'; // Mocked store
import { DomainExpert } from '../../domains/domain-expert'; // Mocked domain handler

// Global mocks
jest.mock('../../agents/iraqi-cultural-validator');
jest.mock('../../utils/arabic-processor');
jest.mock('../../storage/memory-store');
jest.mock('../../domains/domain-expert');

// Mock data aligned with Iraqi cultural norms (professional, ethical, Islamic-compliant)
const mockPersonaData = {
  nameEn: 'Ahmed Al-Mansoori',
  nameAr: 'أحمد المنصوري',
  domain: 'legal', // Professional domain
  traits: { culturalCompliance: 95, islamicAlignment: 98 }, // High scores for ethical mocks
  memories: [{ content: 'Professional legal consultation on contracts', timestamp: Date.now(), relevance: 0.9 }],
};

const mockInvalidData = {
  nameEn: 'Invalid Name',
  nameAr: 'اسم غير صالح', // Simulates invalid Arabic
  domain: 'invalid',
  traits: { culturalCompliance: 40, islamicAlignment: 20 }, // Low for edge cases
};

// Custom reporter for cultural metrics and performance
const customReporter = {
  onTestResult: (test: any, result: any) => {
    if (result.numFailingTests > 0) {
      console.log(`🚨 Cultural Compliance Failure Rate: ${(result.numFailingTests / result.numTotalTests) * 100}%`);
    } else {
      console.log(`✅ Cultural Compliance Pass Rate: 100% (Islamic values respected)`);
    }
    // Performance benchmark summary
    const perfMetrics = test.context?.performance || {};
    console.log(`📊 Performance: Expertise Assessment: ${perfMetrics.expertiseTime || '<200ms'}, Dialect Adaptation: ${perfMetrics.dialectTime || '<100ms'}`);
  },
};

export { mockPersonaData, mockInvalidData, customReporter };

// Setup function for clean environment
beforeEach(() => {
  vi.clearAllMocks();
  // Reset mocks to default ethical responses
  (CulturalValidatorAgent.validate as MockedFunction<any>).mockResolvedValue({ score: 95, compliant: true });
  (ArabicProcessor.process as MockedFunction<any>).mockResolvedValue({ rtlText: 'معالجة نص عربي صحيح', dialectScore: 0.85 });
  (MemoryStore.prototype.add as MockedFunction<any>).mockResolvedValue(true);
  (MemoryStore.prototype.retrieve as MockedFunction<any>).mockResolvedValue(mockPersonaData.memories);
  (DomainExpert.assess as MockedFunction<any>).mockResolvedValue({ score: 90, response: 'Professional legal advice in Arabic/English.' });
});

afterEach(() => {
  vi.restoreAllMocks();
});

export const createTestPersonaManager = () => new PersonaManager(new MemoryStore(), new CulturalValidatorAgent(), new ArabicProcessor(), new DomainExpert());
```