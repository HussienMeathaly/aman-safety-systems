<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
$webRoot = $argv[1] ?? '';
$create = ($argv[2] ?? '') === '--create-test-lead';
if ($webRoot === '' || !is_file($webRoot . '/odoo-client.php')) {
    fwrite(STDERR, "Usage: php check-odoo-staging.php /absolute/path/public_html [--create-test-lead]\n");
    exit(1);
}
require $webRoot . '/odoo-client.php';
try {
    $config = osaec_odoo_config($webRoot);
    if ($config['url'] !== 'https://wahattamuyztest.odoo.com') {
        throw new RuntimeException('Stopped: this test permits only the documented staging URL.');
    }
    $ping = osaec_odoo_request($config, 'GET', '/api/v1/crm/ping');
    $defaults = is_array($ping['defaults'] ?? null) ? $ping['defaults'] : [];
    $source = $defaults['source'] ?? null;
    echo "PASS: staging connection and API key.\n";
    echo 'Default source: ' . json_encode($source, JSON_UNESCAPED_UNICODE) . "\n";
    echo 'Default team: ' . json_encode($defaults['team'] ?? null, JSON_UNESCAPED_UNICODE) . "\n";
    if (!is_string($source) || trim($source) === '') {
        throw new RuntimeException('No default source returned. Ask the Odoo administrator to configure the website source.');
    }
    echo "Confirm the displayed source with the Odoo administrator; its exact spelling is not assumed.\n";
    if (!$create) { echo "No lead created. Use --create-test-lead after confirming the defaults.\n"; exit(0); }
    $reference = 'OSAEC-STAGING-' . gmdate('Ymd-His') . '-' . bin2hex(random_bytes(4));
    $payload = [
        'external_id' => $reference,
        'name' => 'اختبار ربط الموقع — ' . $reference,
        'contact_name' => 'اختبار أسس السلامة',
        'description' => 'اختبار تقني للنسخة التجريبية بعد إعادة التجهيز. ليس طلب عميل. الموقع: https://www.osaec.sa/',
        'country_code' => 'SA',
    ];
    // No source override: verify the Odoo API client's default.
    $first = osaec_odoo_request($config, 'POST', '/api/v1/crm/leads', $payload);
    echo 'Reference: ' . $reference . "\nLead ID: " . (int) $first['lead_id'] . "\n";
    $second = osaec_odoo_request($config, 'POST', '/api/v1/crm/leads', $payload);
    if ((int) $second['lead_id'] !== (int) $first['lead_id'] || ($second['created'] ?? null) !== false) {
        throw new RuntimeException('Retry did not confirm the same lead without duplication.');
    }
    echo "PASS: repeated reference returned the same lead without creation.\n";
    if (!empty($first['warnings']) || !empty($second['warnings'])) echo "WARNING: review warnings in the Odoo API log.\n";
    echo "Still required: open this lead in staging CRM and verify its Source is the website source. The API cannot read leads back.\n";
} catch (Throwable $e) {
    fwrite(STDERR, 'FAIL: ' . $e->getMessage() . "\n");
    exit(1);
}