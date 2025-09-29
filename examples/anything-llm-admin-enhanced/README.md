# Advanced Admin System Extraction (TIER 2)

Extracted from anything-llm: Admin interface for users/roles/metrics.

Iraqi Adaptations:

- Roles: super-admin, iraqi-admin, cultural-validator (95%+ compliance checks).
- Metrics: Cultural validation dashboard, domain usage (legal/medical).
- Permissions: Role-based for Iraqi organizations (e.g., ministry access).

Files: frontend/src/pages/Admin/Users.tsx (user list with roles), RolePermissions.tsx (permissions UI), SystemMetrics.tsx (analytics).

Test: `npm test admin-components` (simulate Supabase queries).
