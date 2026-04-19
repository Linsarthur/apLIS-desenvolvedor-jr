<?php

$translations = [
    'pt' => [
        'medico_criado'       => 'Médico criado com sucesso',
        'medico_atualizado'   => 'Médico atualizado com sucesso',
        'medico_removido'     => 'Médico removido com sucesso',
        'medico_nao_encontrado' => 'Médico não encontrado.',
        'crm_duplicado'       => 'Já existe um médico com este CRM nesta UF.',
        'crm_conflito'        => 'Já existe outro médico com este CRM nesta UF.',
        'campos_obrigatorios' => 'Os campos nome, CRM e UFCRM são obrigatórios.',
        'ufcrm_invalida'      => 'UFCRM deve ter exatamente 2 caracteres.',
        'rota_nao_encontrada' => 'Rota não encontrada',
        'erro_buscar'         => 'Erro ao buscar médicos',
        'erro_criar'          => 'Erro ao criar médico',
        'erro_atualizar'      => 'Erro ao atualizar médico',
        'erro_remover'        => 'Erro ao remover médico',
    ],
    'en' => [
        'medico_criado'       => 'Doctor created successfully',
        'medico_atualizado'   => 'Doctor updated successfully',
        'medico_removido'     => 'Doctor removed successfully',
        'medico_nao_encontrado' => 'Doctor not found.',
        'crm_duplicado'       => 'A doctor with this CRM already exists in this state.',
        'crm_conflito'        => 'Another doctor with this CRM already exists in this state.',
        'campos_obrigatorios' => 'Fields nome, CRM and UFCRM are required.',
        'ufcrm_invalida'      => 'UFCRM must be exactly 2 characters.',
        'rota_nao_encontrada' => 'Route not found',
        'erro_buscar'         => 'Error fetching doctors',
        'erro_criar'          => 'Error creating doctor',
        'erro_atualizar'      => 'Error updating doctor',
        'erro_remover'        => 'Error removing doctor',
    ],
];

function getLang(): string
{
    $header = $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? 'pt';
    $lang   = strtolower(substr($header, 0, 2));
    return $lang === 'en' ? 'en' : 'pt';
}

function t(string $key): string
{
    global $translations;
    $lang = getLang();
    return $translations[$lang][$key] ?? $key;
}