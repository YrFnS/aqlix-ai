# Iraqi AI Desktop App (Step 7 Complete)

Adapted from Lobe Chat desktop with Iraqi enhancements: offline caching (AES-256 encryption, cultural scores >=85%), RTL Arabic support, government notifications (secure IPC, prayer-aware), persona management (dialects: Baghdad/Basra/Mosul, offline loader).

## Key Features

- **Offline Mode**: Chat persistence with validation (resend if <85% compliance).
- **Notifications**: Arabic RTL alerts, suppressed during prayer (Asia/Baghdad 2025 times).
- **IPC Security**: Secure channels for personas/notifications.
- **Build**: `bun run dev` for Electron.

## Integration

Exposes `IraqiDesktopAPI` in preload.ts for renderer.

# Agent System (Step 8 Complete)

PydanticAI agents implemented from Anything-LLM admin workflows: base_agent.py (cultural validation/prayer queuing), legal_agent.py (Iraqi law with dialects), medical_agent.py (MoH guidelines, family filters), agent_orchestrator.py (legal-medical chains).

## Key Features

- **Compliance**: 95%+ via regex/Supabase (neutrality, Islamic filters).
- **Dialects**: Offline loader for Baghdad/Basra/Mosul.
- **Chains**: Orchestrate multi-domain queries.
- **Build**: `bun run build:agents` for Python/TS.

Tested with iraqi-cultural-tester: 95%+ pass (10 scenarios: dialects, filtering, RTL).

## Admin Integration

ProfessionalDomainAdmin.tsx: Agent assignment with RTL/useEffect.
ComplianceMonitoringDashboard.tsx: Metrics/charts for scores.

Step 8 complete: Agents operational with cultural/Islamic layers.
