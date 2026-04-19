import i18n from '../i18n'
import type { Paciente, PacientePayload } from '../types'

const BASE = '/api/v1/pacientes'

function headers() {
  return {
    'Content-Type': 'application/json',
    'Accept-Language': i18n.language,
  }
}

export async function getPacientes(): Promise<Paciente[]> {
  const res = await fetch(BASE, { headers: headers() })
  if (!res.ok) throw new Error('Erro ao buscar pacientes.')
  return res.json()
}

export async function getPacienteById(id: number): Promise<Paciente> {
  const res = await fetch(`${BASE}/${id}`, { headers: headers() })
  if (!res.ok) throw new Error('Paciente não encontrado.')
  return res.json()
}

export async function createPaciente(payload: PacientePayload): Promise<void> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Erro ao criar paciente.')
}

export async function updatePaciente(id: number, payload: PacientePayload): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Erro ao atualizar paciente.')
}

export async function deletePaciente(id: number): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'DELETE',
    headers: headers(),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Erro ao remover paciente.')
}