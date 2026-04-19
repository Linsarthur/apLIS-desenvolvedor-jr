export interface Medico {
  id: number
  nome: string
  CRM: string
  UFCRM: string
}

export interface MedicoPayload {
  nome: string
  CRM: string
  UFCRM: string
}

export interface Paciente {
  id: number
  nome: string
  dataNascimento: string | null
  carteirinha: string
  cpf: string
}

export interface PacientePayload {
  nome: string
  dataNascimento: string
  carteirinha: string
  cpf: string
}