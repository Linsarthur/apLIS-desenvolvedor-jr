const pool  = require('../database')
const { t } = require('../i18n')

async function getAllPacientes(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT id, nome, dataNascimento, carteirinha, cpf FROM pacientes ORDER BY id'
    )
    return res.status(200).json(rows.map(formatPaciente))
  } catch (error) {
    console.error('[GET /pacientes]', error)
    return res.status(500).json({ error: t(req, 'erro_buscar') })
  }
}

async function getPacienteById(req, res) {
  const { id } = req.params
  try {
    const [rows] = await pool.query(
      'SELECT id, nome, dataNascimento, carteirinha, cpf FROM pacientes WHERE id = ?',
      [id]
    )
    if (rows.length === 0) {
      return res.status(404).json({ error: t(req, 'paciente_nao_encontrado') })
    }
    return res.status(200).json(formatPaciente(rows[0]))
  } catch (error) {
    console.error('[GET /pacientes/:id]', error)
    return res.status(500).json({ error: t(req, 'erro_buscar') })
  }
}

async function createPaciente(req, res) {
  const { nome, dataNascimento, carteirinha, cpf } = req.body

  const validationError = validatePaciente(req, { nome, carteirinha, cpf })
  if (validationError) return res.status(422).json({ error: validationError })

  const cpfLimpo = cpf.replace(/\D/g, '')

  try {
    const [existing] = await pool.query('SELECT id FROM pacientes WHERE cpf = ?', [cpfLimpo])
    if (existing.length > 0) {
      return res.status(409).json({ error: t(req, 'cpf_duplicado') })
    }

    const [result] = await pool.query(
      'INSERT INTO pacientes (nome, dataNascimento, carteirinha, cpf) VALUES (?, ?, ?, ?)',
      [nome.trim(), dataNascimento || null, carteirinha.trim(), cpfLimpo]
    )

    return res.status(201).json({ message: t(req, 'paciente_criado'), id: result.insertId })
  } catch (error) {
    console.error('[POST /pacientes]', error)
    return res.status(500).json({ error: t(req, 'erro_criar') })
  }
}

async function updatePaciente(req, res) {
  const { id } = req.params
  const { nome, dataNascimento, carteirinha, cpf } = req.body

  const validationError = validatePaciente(req, { nome, carteirinha, cpf })
  if (validationError) return res.status(422).json({ error: validationError })

  const cpfLimpo = cpf.replace(/\D/g, '')

  try {
    const [existing] = await pool.query('SELECT id FROM pacientes WHERE id = ?', [id])
    if (existing.length === 0) {
      return res.status(404).json({ error: t(req, 'paciente_nao_encontrado') })
    }

    const [conflict] = await pool.query(
      'SELECT id FROM pacientes WHERE cpf = ? AND id != ?',
      [cpfLimpo, id]
    )
    if (conflict.length > 0) {
      return res.status(409).json({ error: t(req, 'cpf_conflito') })
    }

    await pool.query(
      'UPDATE pacientes SET nome = ?, dataNascimento = ?, carteirinha = ?, cpf = ? WHERE id = ?',
      [nome.trim(), dataNascimento || null, carteirinha.trim(), cpfLimpo, id]
    )

    return res.status(200).json({ message: t(req, 'paciente_atualizado') })
  } catch (error) {
    console.error('[PUT /pacientes/:id]', error)
    return res.status(500).json({ error: t(req, 'erro_atualizar') })
  }
}

async function deletePaciente(req, res) {
  const { id } = req.params
  try {
    const [existing] = await pool.query('SELECT id FROM pacientes WHERE id = ?', [id])
    if (existing.length === 0) {
      return res.status(404).json({ error: t(req, 'paciente_nao_encontrado') })
    }

    await pool.query('DELETE FROM pacientes WHERE id = ?', [id])
    return res.status(200).json({ message: t(req, 'paciente_removido') })
  } catch (error) {
    console.error('[DELETE /pacientes/:id]', error)
    return res.status(500).json({ error: t(req, 'erro_remover') })
  }
}

function formatPaciente(p) {
  return {
    ...p,
    dataNascimento: p.dataNascimento
      ? p.dataNascimento.toISOString().split('T')[0]
      : null,
  }
}

function validatePaciente(req, { nome, carteirinha, cpf }) {
  if (!nome || !carteirinha || !cpf) return t(req, 'campos_obrigatorios')
  const cpfLimpo = cpf.replace(/\D/g, '')
  if (cpfLimpo.length !== 11) return t(req, 'cpf_invalido')
  return null
}

module.exports = { getAllPacientes, getPacienteById, createPaciente, updatePaciente, deletePaciente }