<?php
/**
 * =====================================================================
 *  odoo-bridge.php — وسيط طلبات الخدمة | أسس السلامة والعمارة (OSAEC)
 *  يستقبل الطلبات من الموقع وينشئها كفرص بيع (Leads) في Odoo CRM
 *
 *  مكان الرفع: المجلد الرئيسي للموقع على استضافة هوستنجر (بجانب index.html).
 *
 *  المطلوب من مبرمج أودو: تعبئة الإعدادات الأربعة أدناه فقط.
 *  ملاحظة: أثناء فراغ الإعدادات يرجع الوسيط code = not_configured
 *  والموقع يفتح واتساب تلقائياً كخطوة احتياطية — لن تضيع أي طلبات.
 * =====================================================================
 */

declare(strict_types=1);

/* ==================== الإعدادات ==================== */

// رابط أودو بدون شرطة مائلة في النهاية (حالياً النسخة التجريبية)
const ODOO_URL     = 'https://wahattamuyztest.odoo.com';

// مفتاح API الخاص بالموقع (CRM → Configuration → Lead API Clients)
const ODOO_API_KEY = 'rZb9uqghPIx7_YnKoMih0M6w9KoXzPQfH-wHCN4KRZk';

// اسم "المصدر" في أودو للفلترة — يجب أن يكون موجوداً مسبقاً في أودو بنفس الاسم حرفياً
// (وإلا يُستخدم المصدر الافتراضي المحدد في أودو). اتركه فارغاً للاعتماد على إعداد أودو.
const ODOO_SOURCE_NAME = '';

/* ==================== ثوابت النظام ==================== */

const LOG_DIR        = __DIR__ . '/odoo-logs';
const MAX_BODY_BYTES = 10000;
const RATE_LIMIT_MAX = 5;    // أقصى عدد طلبات من نفس الزائر
const RATE_WINDOW    = 900;  // خلال 15 دقيقة (بالثواني)

/* ==================== أدوات مساعدة ==================== */

function send_json(array $data, int $http = 200): void {
    http_response_code($http);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function ensure_log_dir(): void {
    if (!is_dir(LOG_DIR)) {
        @mkdir(LOG_DIR, 0750, true);
        // منع الوصول لملفات السجلات من المتصفح
        @file_put_contents(LOG_DIR . '/.htaccess', "Require all denied\nOrder allow,deny\nDeny from all\n");
        @file_put_contents(LOG_DIR . '/index.html', '');
    }
}

function append_log(string $file, array $data): void {
    ensure_log_dir();
    @file_put_contents(
        LOG_DIR . '/' . $file,
        json_encode($data, JSON_UNESCAPED_UNICODE) . "\n",
        FILE_APPEND | LOCK_EX
    );
}

function client_ip(): string {
    return $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

function rate_limited(): bool {
    ensure_log_dir();
    $file = LOG_DIR . '/rate-' . md5(client_ip()) . '.json';
    $now = time();
    $stamps = [];
    if (is_file($file)) {
        $stamps = json_decode((string) @file_get_contents($file), true) ?: [];
    }
    $stamps = array_values(array_filter($stamps, static fn($t) => ($now - (int) $t) < RATE_WINDOW));
    if (count($stamps) >= RATE_LIMIT_MAX) return true;
    $stamps[] = $now;
    @file_put_contents($file, json_encode($stamps), LOCK_EX);
    return false;
}

/** إرسال الطلب إلى واجهة أودو المخصصة: POST /api/v1/crm/leads */
function odoo_create_lead(array $payload): array {
    $ch = curl_init(rtrim(ODOO_URL, '/') . '/api/v1/crm/leads');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => json_encode($payload, JSON_UNESCAPED_UNICODE),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_TIMEOUT        => 25,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json; charset=utf-8',
            'X-API-Key: ' . ODOO_API_KEY,
        ],
    ]);
    $raw  = curl_exec($ch);
    $err  = curl_error($ch);
    $http = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);

    if ($raw === false) throw new RuntimeException('تعذر الاتصال بأودو: ' . $err);
    $json = json_decode((string) $raw, true);
    if (!is_array($json) || empty($json['success'])) {
        throw new RuntimeException('رد أودو (HTTP ' . $http . '): ' . substr((string) $raw, 0, 500));
    }
    return $json;
}

/* ==================== التحقق من المدخلات ==================== */

function validate(array $in): array {
    $errors = [];

    $name = trim((string) ($in['name'] ?? ''));
    if ($name === '')        $errors['name'] = 'الاسم مطلوب';
    elseif (mb_strlen($name) < 3)  $errors['name'] = 'الاسم قصير جداً';
    elseif (mb_strlen($name) > 100) $errors['name'] = 'الاسم طويل جداً';

    $mobile = preg_replace('/\D/', '', (string) ($in['mobile'] ?? ''));
    if ($mobile === '' || !preg_match('/^05\d{8}$/', $mobile)) {
        $errors['mobile'] = 'رقم الجوال يجب أن يكون 10 أرقام ويبدأ بـ 05';
    }

    // البريد اختياري — يُتحقق منه فقط إن أُرسل
    $email = trim((string) ($in['email'] ?? ''));
    if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'صيغة البريد الإلكتروني غير صحيحة';
    }

    $message = trim((string) ($in['message'] ?? ''));
    if ($message === '')        $errors['message'] = 'وصف الطلب مطلوب';
    elseif (mb_strlen($message) > 1000) $errors['message'] = 'وصف الطلب طويل جداً';

    return [$errors, $name, $mobile, $email, $message];
}

/* ==================== التنفيذ ==================== */

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        send_json(['ok' => false, 'code' => 'method', 'message' => 'طريقة الطلب غير مدعومة'], 405);
    }

    if (rate_limited()) {
        send_json(['ok' => false, 'code' => 'rate_limited',
            'message' => 'تم إرسال عدة طلبات من جهازك — حاول مرة أخرى بعد قليل']);
    }

    $raw = file_get_contents('php://input');
    if (strlen((string) $raw) > MAX_BODY_BYTES) {
        send_json(['ok' => false, 'code' => 'too_large', 'message' => 'حجم الطلب كبير جداً'], 413);
    }
    $in = json_decode((string) $raw, true);
    if (!is_array($in)) $in = $_POST;

    // حقل الفخ ضد الروبوتات: يُملأ من الروبوتات فقط — نتظاهر بالنجاح ونتجاهل الطلب
    if (!empty($in['website'] ?? '')) {
        send_json(['ok' => true]);
    }

    [$errors, $name, $mobile, $email, $message] = validate(is_array($in) ? $in : []);
    if ($errors) {
        send_json(['ok' => false, 'code' => 'invalid', 'errors' => $errors,
            'message' => 'تحقق من البيانات المدخلة']);
    }

    $serviceName = trim((string) ($in['service_name'] ?? ''));
    $page        = trim((string) ($in['page'] ?? ''));

    // الوسيط غير مهيأ بعد → الموقع يتحول تلقائياً لواتساب
    if (ODOO_URL === '' || ODOO_API_KEY === '') {
        append_log('submissions.jsonl', [
            'at' => date('c'), 'ip' => client_ip(), 'status' => 'not_configured',
            'name' => $name, 'mobile' => $mobile, 'service' => $serviceName, 'page' => $page, 'message' => $message,
        ]);
        send_json(['ok' => false, 'code' => 'not_configured', 'message' => 'لم يتم ربط أودو بعد']);
    }

    // مرجع ثابت لمنع تكرار الطلب عند إعادة المحاولة أو الضغط مرتين
    $externalId = 'WEB-' . substr(sha1($mobile . '|' . $message), 0, 16);

    $title = 'طلب خدمة من الموقع' . ($serviceName !== '' ? ' – ' . $serviceName : '') . ' – ' . $name;
    $description = ($serviceName !== '' ? "الخدمة المطلوبة: {$serviceName}\n" : '')
        . ($page !== '' ? "الصفحة: {$page}\n" : '')
        . "وصف الطلب:\n{$message}";

    $payload = [
        'external_id'  => $externalId,
        'name'         => $title,
        'contact_name' => $name,
        'mobile'       => $mobile,
        'description'  => $description,
        'country_code' => 'SA',
    ];
    if ($email !== '') $payload['email'] = $email;
    if (ODOO_SOURCE_NAME !== '') $payload['source'] = ODOO_SOURCE_NAME;

    $res = odoo_create_lead($payload);
    $leadId = (int) ($res['lead_id'] ?? 0);

    if (!empty($res['warnings'])) {
        append_log('warnings.jsonl', ['at' => date('c'), 'lead_id' => $leadId, 'warnings' => $res['warnings']]);
    }
    append_log('submissions.jsonl', [
        'at' => date('c'), 'ip' => client_ip(), 'status' => 'ok', 'lead_id' => $leadId,
        'created' => $res['created'] ?? null, 'external_id' => $externalId,
        'name' => $name, 'mobile' => $mobile, 'service' => $serviceName, 'page' => $page, 'message' => $message,
    ]);

    send_json(['ok' => true, 'lead_id' => $leadId,
        'message' => 'تم إرسال طلبك بنجاح']);
} catch (Throwable $e) {
    append_log('errors.jsonl', ['at' => date('c'), 'ip' => client_ip(), 'error' => $e->getMessage()]);
    send_json(['ok' => false, 'code' => 'odoo_error',
        'message' => 'تعذر إرسال الطلب حالياً — حاول مرة أخرى']);
}
