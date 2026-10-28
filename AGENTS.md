# AGENTS.md

- Service requests use the Hostinger PHP bridge and shared `public/odoo-client.php`; load credentials only from `../private/odoo-config.php` relative to deployed public_html and keep logs in that private directory. Why: this static Hostinger deployment must not expose credentials through GitHub or public build artifacts.
- The bridge sends deterministic external_id references and relies on Odoo for deduplication; WhatsApp fallback requires the visitor to send the message. Why: opening WhatsApp is not delivery confirmation.
- Staging checks are CLI-only in `scripts/check-odoo-staging.php`, restrict the hostname to documented staging, and omit source overrides. Why: verify Odoo's configured website source without creating a public diagnostic endpoint or assuming production readiness.
