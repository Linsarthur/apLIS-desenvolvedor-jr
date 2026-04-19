const translations = {
  pt: {
    paciente_criado:        'Paciente criado com sucesso',
    paciente_atualizado:    'Paciente atualizado com sucesso',
    paciente_removido:      'Paciente removido com sucesso',
    paciente_nao_encontrado:'Paciente não encontrado.',
    cpf_duplicado:          'Já existe um paciente com este CPF.',
    cpf_conflito:           'Já existe outro paciente com este CPF.',
    campos_obrigatorios:    'Os campos nome, carteirinha e cpf são obrigatórios.',
    cpf_invalido:           'CPF deve conter 11 dígitos numéricos.',
    erro_buscar:            'Erro ao buscar pacientes.',
    erro_criar:             'Erro ao criar paciente.',
    erro_atualizar:         'Erro ao atualizar paciente.',
    erro_remover:           'Erro ao remover paciente.',
  },
  en: {
    paciente_criado:        'Patient created successfully',
    paciente_atualizado:    'Patient updated successfully',
    paciente_removido:      'Patient removed successfully',
    paciente_nao_encontrado:'Patient not found.',
    cpf_duplicado:          'A patient with this CPF already exists.',
    cpf_conflito:           'Another patient with this CPF already exists.',
    campos_obrigatorios:    'Fields nome, carteirinha and cpf are required.',
    cpf_invalido:           'CPF must contain 11 numeric digits.',
    erro_buscar:            'Error fetching patients.',
    erro_criar:             'Error creating patient.',
    erro_atualizar:         'Error updating patient.',
    erro_remover:           'Error removing patient.',
  },
}

function getLang(req) {
  const header = req.headers['accept-language'] || 'pt'
  const lang   = header.slice(0, 2).toLowerCase()
  return lang === 'en' ? 'en' : 'pt'
}

function t(req, key) {
  const lang = getLang(req)
  return translations[lang][key] ?? key
}

module.exports = { t }