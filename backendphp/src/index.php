<?php

require_once __DIR__ . '/medicos.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$uri    = rtrim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');

$idMatch = [];
$temId   = preg_match('#^/api/v1/medicos/(\d+)$#', $uri, $idMatch);
$id      = $temId ? (int) $idMatch[1] : null;

match (true) {
    $method === 'GET'  && $uri === '/api/v1/medicos' => getAllMedicos(),
    $method === 'POST' && $uri === '/api/v1/medicos' => createMedico(),

    $method === 'GET'    && $temId => getMedicoById($id),
    $method === 'PUT'    && $temId => updateMedico($id),
    $method === 'DELETE' && $temId => deleteMedico($id),

    default => (function () use ($uri) {
        http_response_code(404);
        echo json_encode(['error' => "Rota não encontrada: {$uri}"]);
    })()
};