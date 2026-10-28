<?php
declare(strict_types=1);
require __DIR__ . '/../public/odoo-client.php';
$checks = 0;
function check(bool $condition, string $name): void {
    global $checks;
    if (!$condition) throw new RuntimeException('FAIL: ' . $name);
    $checks++;
}
function rejects(callable $action, string $name): void {
    $rejected = false;
    try { $action(); } catch (RuntimeException $e) { $rejected = true; }
    check($rejected, $name);
}
$root = sys_get_temp_dir() . '/osaec-test-' . bin2hex(random_bytes(6));
mkdir($root . '/public_html', 0700, true);
mkdir($root . '/private', 0700);
try {
    rejects(fn() => osaec_odoo_config($root . '/public_html'), 'missing private configuration');
    file_put_contents($root . '/public_html/odoo-config.php', '<?php return ["url"=>"https://wahattamuyztest.odoo.com", "api_key"=>"fixture-only"];');
    rejects(fn() => osaec_odoo_config($root . '/public_html'), 'public config is never loaded');
    file_put_contents($root . '/private/odoo-config.php', '<?php return ["url"=>"https://wahattamuyztest.odoo.com", "api_key"=>"fixture-only"];');
    $config = osaec_odoo_config($root . '/public_html');
    check($config['url'] === 'https://wahattamuyztest.odoo.com', 'configured staging URL');
    check($config['api_key'] === 'fixture-only', 'private config loaded');
    check(osaec_odoo_response(200, '{"success":true,"defaults":{"source":"Website"}}', false)['defaults']['source'] === 'Website', 'ping preserves default source');
    check(osaec_odoo_response(201, '{"success":true,"lead_id":42}', true)['lead_id'] === 42, 'confirmed created lead');
    rejects(fn() => osaec_odoo_response(401, '{"success":true,"lead_id":42}', true), 'non-2xx rejected');
    rejects(fn() => osaec_odoo_response(200, '{"success":true}', true), 'missing lead ID rejected');
    rejects(fn() => osaec_odoo_response(200, '{"success":true,"lead_id":0}', true), 'zero lead ID rejected');
    rejects(fn() => osaec_odoo_response(200, '<html>error</html>', false), 'malformed response rejected');
    echo "PASS: $checks PHP checks (no network requests).\n";
} finally {
    unlink($root . '/private/odoo-config.php');
    unlink($root . '/public_html/odoo-config.php');
    rmdir($root . '/private'); rmdir($root . '/public_html'); rmdir($root);
}