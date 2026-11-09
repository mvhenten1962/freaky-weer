<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    http_response_code(405);
    header('Allow: GET');
    echo json_encode(['error' => 'Alleen GET is toegestaan.']);
    exit;
}
// Fixed public Worker endpoint. No API key is stored or accepted here.
$endpoint = 'https://freaky-verkeer.mvhenten.workers.dev/traffic?region=rotterdam';
$handle = curl_init($endpoint);
curl_setopt_array($handle, [CURLOPT_RETURNTRANSFER => true, CURLOPT_CONNECTTIMEOUT => 4,
    CURLOPT_TIMEOUT => 12, CURLOPT_FOLLOWLOCATION => false, CURLOPT_HTTPHEADER => ['Accept: application/json']]);
$body = curl_exec($handle);
$status = curl_getinfo($handle, CURLINFO_HTTP_CODE);
curl_close($handle);
$data = is_string($body) ? json_decode($body, true) : null;
if ($status !== 200 || !is_array($data) || ($data['region'] ?? '') !== 'rotterdam' ||
    !isset($data['live'], $data['planned'], $data['bridges']) ||
    !is_array($data['live']) || !is_array($data['planned']) || !is_array($data['bridges'])) {
    http_response_code(502);
    echo json_encode(['error' => 'De verkeersdienst is tijdelijk niet bereikbaar.']);
    exit;
}
echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
