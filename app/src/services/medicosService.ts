import i18n from '../i18n'
import type { Medico, MedicoPayload } from '../types'

const BASE = '/api/v1/medicos'

function headers() {
  return {
    'Content-Type': 'application/json',
    'Accept-Language': i18n.language,
  }
}

export async function getMedicos(): Promise<Medico[]> {
  const res = await fetch(BASE, { headers: headers() })
  if (!res.ok) throw new Error('Erro ao buscar médicos.')
  return res.json()
}

export async function getMedicoById(id: number): Promise<Medico> {
  const res = await fetch(`${BASE}/${id}`, { headers: headers() })
  if (!res.ok) throw new Error('Médico não encontrado.')
  return res.json()
}

export async function createMedico(payload: MedicoPayload): Promise<void> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Erro ao criar médico.')
}

export async function updateMedico(id: number, payload: MedicoPayload): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Erro ao atualizar médico.')
}

export async function deleteMedico(id: number): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'DELETE',
    headers: headers(),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Erro ao remover médico.')
}