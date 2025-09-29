# Voice Features Extraction (TIER 3)

Extracted from agnai: TTS/STT providers (tts_provider.py, stt_processor.py for Iraqi dialects), voice customization (VoiceCustomization.tsx per character), audio controls (AudioPlaybackControls.tsx).

Iraqi Adaptations:

- Dialect-specific TTS/STT (Baghdad/Basra/Mosul; 85%+ accuracy).
- Cultural filters (e.g., pause family topics during prayer).
- Integration: Chain with agent_orchestrator.py for voice-to-text.

Files: srv/voice/tts_provider.py (Arabic TTS), stt_processor.py (Whisper STT), web/src/components/VoiceCustomization.tsx, AudioPlaybackControls.tsx.

Test: `python -m pytest test_voice_features.py` (add for dialects/prayer).
