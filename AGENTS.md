# AGENTS.md

- Service requests: `src/components/ServiceRequestForm.tsx` posts to `public/odoo-bridge.php` (ships in the Vite build, runs on the client's Hostinger PHP hosting) which calls the client's custom Odoo REST endpoint `POST /api/v1/crm/leads` with an `X-API-Key` header and a deterministic `external_id` for idempotency; if the bridge fails, the form falls back to WhatsApp so no request is lost. Why: Odoo has no CORS and the key must stay server-side; site is static on Hostinger, so the bridge is plain PHP with config constants at the top.
