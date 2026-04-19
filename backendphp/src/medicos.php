<?php

require_once __DIR__ . '/database.php';
require_once __DIR__ . '/i18n.php';

function getAllMedicos(): void
{
    try {
        $pdo     = getConnection();
        $stmt    = $pdo->query('SELECT id, nome, CRM, UFCRM FROM medicos ORDER BY id');
        $medicos = $stmt->fetchAll();

        http_response_code(200);
        echo json_encode($medicos);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => t('erro_buscar') . ': ' . $e->getMessage()]);
    }
}

function getMedicoById(int $id): void
{
    try {
        $pdo    = getConnection();
        $stmt   = $pdo->prepare('SELECT id, nome, CRM, UFCRM FROM medicos WHERE id = :id');
        $stmt->execute([':id' => $id]);
        $medico = $stmt->fetch();

        if (!$medico) {
            http_response_code(404);
            echo json_encode(['error' => t('medico_nao_encontrado')]);
            return;
        }

        http_response_code(200);
        echo json_encode($medico);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => t('erro_buscar') . ': ' . $e->getMessage()]);
    }
}

function createMedico(): void
{
    $body = json_decode(file_get_contents('php://input'), true);

    if (empty($body['nome']) || empty($body['CRM']) || empty($body['UFCRM'])) {
        http_response_code(422);
        echo json_encode(['error' => t('campos_obrigatorios')]);
        return;
    }

    if (strlen($body['UFCRM']) !== 2) {
        http_response_code(422);
        echo json_encode(['error' => t('ufcrm_invalida')]);
        return;
    }

    try {
        $pdo   = getConnection();
        $check = $pdo->prepare('SELECT id FROM medicos WHERE CRM = :CRM AND UFCRM = :UFCRM');
        $check->execute([':CRM' => trim($body['CRM']), ':UFCRM' => strtoupper(trim($body['UFCRM']))]);

        if ($check->fetch()) {
            http_response_code(409);
            echo json_encode(['error' => t('crm_duplicado')]);
            return;
        }

        $stmt = $pdo->prepare('INSERT INTO medicos (nome, CRM, UFCRM) VALUES (:nome, :CRM, :UFCRM)');
        $stmt->execute([
            ':nome'  => trim($body['nome']),
            ':CRM'   => trim($body['CRM']),
            ':UFCRM' => strtoupper(trim($body['UFCRM'])),
        ]);

        http_response_code(201);
        echo json_encode([
            'message' => t('medico_criado'),
            'id'      => (int) $pdo->lastInsertId(),
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => t('erro_criar') . ': ' . $e->getMessage()]);
    }
}

function updateMedico(int $id): void
{
    $body = json_decode(file_get_contents('php://input'), true);

    if (empty($body['nome']) || empty($body['CRM']) || empty($body['UFCRM'])) {
        http_response_code(422);
        echo json_encode(['error' => t('campos_obrigatorios')]);
        return;
    }

    if (strlen($body['UFCRM']) !== 2) {
        http_response_code(422);
        echo json_encode(['error' => t('ufcrm_invalida')]);
        return;
    }

    try {
        $pdo   = getConnection();
        $check = $pdo->prepare('SELECT id FROM medicos WHERE id = :id');
        $check->execute([':id' => $id]);

        if (!$check->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => t('medico_nao_encontrado')]);
            return;
        }

        $conflict = $pdo->prepare('SELECT id FROM medicos WHERE CRM = :CRM AND UFCRM = :UFCRM AND id != :id');
        $conflict->execute([
            ':CRM'   => trim($body['CRM']),
            ':UFCRM' => strtoupper(trim($body['UFCRM'])),
            ':id'    => $id,
        ]);

        if ($conflict->fetch()) {
            http_response_code(409);
            echo json_encode(['error' => t('crm_conflito')]);
            return;
        }

        $stmt = $pdo->prepare('UPDATE medicos SET nome = :nome, CRM = :CRM, UFCRM = :UFCRM WHERE id = :id');
        $stmt->execute([
            ':nome'  => trim($body['nome']),
            ':CRM'   => trim($body['CRM']),
            ':UFCRM' => strtoupper(trim($body['UFCRM'])),
            ':id'    => $id,
        ]);

        http_response_code(200);
        echo json_encode(['message' => t('medico_atualizado')]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => t('erro_atualizar') . ': ' . $e->getMessage()]);
    }
}

function deleteMedico(int $id): void
{
    try {
        $pdo   = getConnection();
        $check = $pdo->prepare('SELECT id FROM medicos WHERE id = :id');
        $check->execute([':id' => $id]);

        if (!$check->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => t('medico_nao_encontrado')]);
            return;
        }

        $stmt = $pdo->prepare('DELETE FROM medicos WHERE id = :id');
        $stmt->execute([':id' => $id]);

        http_response_code(200);
        echo json_encode(['message' => t('medico_removido')]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => t('erro_remover') . ': ' . $e->getMessage()]);
    }
}