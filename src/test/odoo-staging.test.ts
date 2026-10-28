import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// Pure fixtures; no secrets and no network. PHP_BIN may point to a local PHP CLI.
const php = process.env.PHP_BIN || "php";
function runFixture(url: string, create: boolean) {
  const root = mkdtempSync(resolve(tmpdir(), "osaec-cli-"));
  const web = resolve(root, "public_html");
  mkdirSync(web);
  writeFileSync(resolve(web, "odoo-client.php"), `<?php
function osaec_odoo_config($root) { return ['url' => '${url}', 'api_key' => 'fixture-only']; }
function osaec_odoo_request($config, $method, $path, $payload = null) {
    if ($method === 'GET') return ['success'=>true, 'defaults'=>['source'=>'Website', 'team'=>'Sales']];
    if (array_key_exists('source', $payload)) throw new RuntimeException('Source override forbidden');
    static $reference = null;
    if ($reference !== null && $reference !== $payload['external_id']) throw new RuntimeException('Retry reference changed');
    $created = $reference === null;
    $reference = $payload['external_id'];
    return ['success'=>true, 'lead_id'=>42, 'created'=>$created];
}`);
  try {
    return execFileSync(php, [resolve("scripts/check-odoo-staging.php"), web, ...(create ? ["--create-test-lead"] : [])], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

describe("Odoo staging safety", () => {
  it("refuses production even when a key exists", () => {
    expect(() => runFixture("https://production.example.com", true)).toThrow();
  });
  it("defaults to a ping without creating a lead", () => {
    const result = runFixture("https://wahattamuyztest.odoo.com", false);
    expect(result).toContain("No lead created.");
    expect(result).not.toContain("Lead ID:");
  });
  it("uses the configured Website source and the same reference for retry", () => {
    const result = runFixture("https://wahattamuyztest.odoo.com", true);
    expect(result).toContain('Default source: "Website"');
    expect(result).toContain("Lead ID: 42");
    expect(result).toContain("PASS: repeated reference returned the same lead without creation.");
    expect(result).not.toContain("fixture-only");
  });
});