<?php
declare(strict_types=1);

function osaec_odoo_config(string $webRoot): array {
    $path = dirname($webRoot) . '/private/odoo-config.php';
    if (!is_file($path) || !is_readable($path)) throw new RuntimeException('Private Odoo configuration is missing or unreadable.');
    $config = require $path;
    if (!is_array($config)) throw new RuntimeException('Invalid private Odoo configuration.');
    $url = rtrim((string) ($config['url'] ?? ''), '/');
    $key = (string) ($config['api_key'] ?? '');
    if (parse_url($url, PHP_URL_SCHEME) !== 'https' || $key === '' || preg_match('/[\r\n]/', $key)) {
        throw new RuntimeException('An HTTPS URL and a valid private API key are required.');
    }
    return ['url' => $url, 'api_key' => $key];
}

function osaec_odoo_response(int $http, string $raw, bool $lead): array {
    $json = json_decode($raw, true);
    if ($http < 200 || $http >= 300 || !is_array($json) || ($json['success'] ?? null) !== true) {
        throw new RuntimeException('Odoo request failed (HTTP ' . $http . ').');
    }
    if ($lead && (!isset($json['lead_id']) || !is_numeric($json['lead_id']) || (int) $json['lead_id'] <= 0)) {
        throw new RuntimeException('Odoo did not confirm a valid lead ID.');
    }
    return $json;
}

function osaec_odoo_request(array $config, string $method, string $path, ?array $payload = null): array {
    if (!function_exists('curl_init')) throw new RuntimeException('PHP cURL is required.');
    $ch = curl_init($config['url'] . $path);
    if ($ch === false) throw new RuntimeException('Unable to initialize Odoo connection.');
    $options = [
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_TIMEOUT => 25,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json; charset=utf-8', 'X-API-Key: ' . $config['api_key']],
    ];
    if ($payload !== null) $options[CURLOPT_POSTFIELDS] = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    curl_setopt_array($ch, $options);
    $raw = curl_exec($ch);
    $http = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);
    if ($raw === false) throw new RuntimeException('Unable to reach Odoo.');
    return osaec_odoo_response($http, (string) $raw, $method === 'POST');
}