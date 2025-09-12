# Lobe Chat Desktop - Iraqi AI Adaptations

Extracted and adapted Electron snippets for Iraqi AI Chat System. Focuses on offline capabilities with cultural compliance.

## Key Adaptations
- **Offline Caching**: AES-256 encrypted IndexedDB for personas/docs. 95%+ cultural validation via iraqi-cultural-validator hook.
- **Arabic Offline TTS/STT**: Vosk/Whisper integration for 85%+ Iraqi dialect accuracy. 99%+ RTL rendering.
- **Prayer Notifications**: Asia/Baghdad timezone, 5 daily calls (Fajr, Dhuhr, Asr, Maghrib, Isha) via node-notifier.
- **IPC Security**: Context isolation, sandboxed preload, validated channels.
- **Supabase Offline Sync**: Bidirectional real-time sync when online, queued offline.

## Files
- `main.ts`: App lifecycle with prayer scheduler and offline init.
- `preload.ts`: Secure API exposure (offline-cache, Arabic TTS/STT, prayer listener).
- `offline-manager.ts`: IndexedDB caching, encryption, cultural/RTL validation, Supabase sync.

## Testing
Use Bun for offline validation:

```bash
bun test desktop-offline  # Tests RTL rendering, prayer scheduling, cultural compliance (95%+), Arabic accuracy (99%+)
```

- **RTL Test**: Verify Arabic text direction and mixed LTR/RTL.
- **Prayer Test**: Simulate notifications in Asia/Baghdad (2025 dates).
- **Offline Sync**: Mock Supabase for caching/pulling with validation hooks.
- **Cultural Compliance**: Integrate iraqi-cultural-validator; assert 95%+ pass rate.
- **Dialect Accuracy**: Test Vosk/Whisper with Iraqi audio samples (85%+ threshold).

## Integration Notes for Supabase Offline Sync
1. **Setup**: Use `@supabase/supabase-js` with offline-first config. Enable real-time channels for 'personas' and 'documents' tables.
2. **Sync Flow**:
   - Cache locally → Validate culturally/RTL → Encrypt → Queue upsert to Supabase.
   - On reconnect: Pull changes via `postgres_changes` subscription → Decrypt → Re-validate → Update IndexedDB.
3. **Edge Cases**:
   - Offline: Queue operations in local storage; sync on online event.
   - Conflicts: Use timestamps for last-write-wins; validate all incoming data.
   - Security: Encrypt all cached data; never store unvalidated content.
4. **Performance**: <200ms sync latency; batch operations for efficiency.
5. **Compliance**: All synced data must pass iraqi-cultural-validator (95%+) and arabic-rtl-processor (99%+).

For production, delegate validation to Iraqi AI agents via Task tool. Ensure 2025 prayer times use astronomical calculations compliant with Iraqi standards.
