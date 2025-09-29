# Character/Persona Management Extraction (TIER 2)

Extracted from agnai: Character creation (CreateCharacter.tsx with Iraqi domains), memory management (IraqiMemoryManager.ts for cultural context), management UI (CharacterManagement.tsx for multi-persona).

Iraqi Adaptations:

- Professional personas (lawyer/doctor with traits like culturalScore >=95%).
- Memory for Iraqi contexts (family hierarchy, Islamic lore).
- Group conversations with domain-specific roles.

Files: web/src/pages/Character/CreateCharacter.tsx, common/memory.ts, web/src/pages/Character/CharacterManagement.tsx.

Test: `npm test persona-management` (cultural validation mocks).
