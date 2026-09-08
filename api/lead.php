<?php
/* ================================================================
   LEAD ENDPOINT
   Receives a JSON post from the site's forms, verifies the reCAPTCHA
   token with Google, and emails the lead on. Also appends it to a CSV
   so nothing is lost if an email goes astray.

   Runs on any host with PHP, which includes Hostinger shared plans.
   Nothing to install and no dependencies.

   Edit api/config.php, not this file.
   ================================================================ */

declare(strict_types=1);

$cfg = require __DIR__ . '/config.php';

/* ---------- CORS, only for the origins we allow ---------- */
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && (empty($cfg['allowedOrigins']) || in_array($origin, $cfg['allowedOrigins'], true))) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    http_response_code(204);
    exit;
}

function out(int $code, array $body): never {
    http_response_code($code);
    echo json_encode($body, JSON_UNESCAPED_SLASHES);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    out(405, ['ok' => false, 'error' => 'Method not allowed.']);
}

/* ---------- read the body ---------- */
$raw = file_get_contents('php://input') ?: '';
if (strlen($raw) > 20000) {
    out(413, ['ok' => false, 'error' => 'That message is too long.']);
}
$in = json_decode($raw, true);
if (!is_array($in)) {
    $in = $_POST;                     // also accept a normal form post
}

function field(array $in, string $key, int $max = 500): string {
    $v = trim((string)($in[$key] ?? ''));
    $v = str_replace(["\r", "\0"], '', $v);
    return mb_substr($v, 0, $max);
}

$name    = field($in, 'name', 120);
$email   = field($in, 'email', 200);
$phone   = field($in, 'phone', 60);
$range   = field($in, 'range', 80);
$type    = field($in, 'type', 60);
$goal    = field($in, 'goal', 80);
$message = field($in, 'message', 4000);
$page    = field($in, 'page', 300);
$token   = (string)($in['token'] ?? '');

/* ---------- honeypot: real people leave it empty ---------- */
if (field($in, 'company', 100) !== '') {
    out(200, ['ok' => true]);        // pretend it worked, drop it silently
}

/* ---------- validate ---------- */
$errors = [];
if ($name === '')  { $errors[] = 'name'; }
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { $errors[] = 'email'; }
if ($errors) {
    out(422, ['ok' => false, 'error' => 'Please check the name and email fields.']);
}
/* header injection guard */
if (preg_match('/[\r\n]/', $name . $email)) {
    out(422, ['ok' => false, 'error' => 'Invalid characters in the form.']);
}

/* ---------- rate limit per IP, per hour ---------- */
$ip  = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$dir = sys_get_temp_dir() . '/bramwell-rate';
@mkdir($dir, 0700, true);
$slot = $dir . '/' . sha1($ip . gmdate('YmdH')) . '.txt';
$hits = (int)@file_get_contents($slot);
if ($hits >= (int)$cfg['rateLimit']) {
    out(429, ['ok' => false, 'error' => 'Too many messages from this connection. Please email us directly.']);
}
@file_put_contents($slot, (string)($hits + 1));

/* ---------- reCAPTCHA ---------- */
$secret = (string)$cfg['recaptchaSecret'];
if ($secret !== '' && !str_starts_with($secret, 'REPLACE_WITH')) {
    if ($token === '') {
        out(422, ['ok' => false, 'error' => 'Please confirm you are not a robot.']);
    }
    $verify = @file_get_contents(
        'https://www.google.com/recaptcha/api/siteverify',
        false,
        stream_context_create(['http' => [
            'method'  => 'POST',
            'header'  => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => http_build_query([
                'secret'   => $secret,
                'response' => $token,
                'remoteip' => $ip,
            ]),
            'timeout' => 10,
        ]])
    );
    $vr = $verify ? json_decode($verify, true) : null;
    if (!is_array($vr) || empty($vr['success'])) {
        out(422, ['ok' => false, 'error' => 'Captcha check failed. Please try again.']);
    }
}

/* ---------- compose ---------- */
$lines = [
    'Name:            ' . $name,
    'Email:           ' . $email,
    'Phone:           ' . ($phone !== '' ? $phone : 'not given'),
    'Capital range:   ' . ($range !== '' ? $range : 'not given'),
    'Property type:   ' . ($type  !== '' ? $type  : 'no preference'),
    'Primary goal:    ' . ($goal  !== '' ? $goal  : 'not given'),
    '',
    'Message:',
    $message !== '' ? $message : '(none)',
    '',
    '---',
    'Submitted: ' . gmdate('D, d M Y H:i') . ' UTC',
    'From page: ' . ($page !== '' ? $page : 'unknown'),
    'IP:        ' . $ip,
];
$body = implode("\n", $lines);

$subject = 'Website enquiry: ' . $name . ($range !== '' ? ' (' . $range . ')' : '');
/* keep the subject header safe and encoded */
$subjectHeader = '=?UTF-8?B?' . base64_encode($subject) . '?=';

$fromName = '=?UTF-8?B?' . base64_encode((string)$cfg['fromName']) . '?=';
$headers  = [
    'From: ' . $fromName . ' <' . $cfg['from'] . '>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'MIME-Version: 1.0',
    'X-Mailer: Bramwell Website',
];

/* ---------- CSV backup ---------- */
if (!empty($cfg['logToCsv'])) {
    $csv = __DIR__ . '/leads.csv';
    $new = !file_exists($csv);
    if ($fh = @fopen($csv, 'a')) {
        if ($new) {
            fputcsv($fh, ['timestamp_utc','name','email','phone','range','type','goal','message','page','ip']);
        }
        fputcsv($fh, [gmdate('c'), $name, $email, $phone, $range, $type, $goal, $message, $page, $ip]);
        fclose($fh);
        @chmod($csv, 0640);
    }
}

/* ---------- send ---------- */
$sent = @mail(
    (string)$cfg['to'],
    $subjectHeader,
    $body,
    implode("\r\n", $headers),
    '-f' . $cfg['from']
);

if (!$sent) {
    /* the CSV still has it, so tell the truth without losing the lead */
    out(500, ['ok' => false, 'error' => 'We could not send that just now. Please email enquiries@bramwellre.com.']);
}

out(200, ['ok' => true]);
