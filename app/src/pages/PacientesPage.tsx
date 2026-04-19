import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Paciente, PacientePayload } from '../types'
import {
  getPacientes,
  createPaciente,
  updatePaciente,
  deletePaciente,
} from '../services/pacientesService'
import ConfirmModal from '../components/confirmModal/ConfirmModal'
import styles from './Page.module.css'

const EMPTY: PacientePayload = { nome: '', dataNascimento: '', carteirinha: '', cpf: '' }

export default function PacientesPage() {
  const { t } = useTranslation()

  const [pacientes, setPacientes]   = useState<Paciente[]>([])
  const [form, setForm]             = useState<PacientePayload>(EMPTY)
  const [editingId, setEditingId]   = useState<number | null>(null)
  const [loading, setLoading]       = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState('')
  const [success, setSuccess]       = useState('')
  const [deleteId, setDeleteId]     = useState<number | null>(null)

  async function load() {
    setLoading(true)
    try {
      setPacientes(await getPacientes())
    } catch {
      setError(t('pacientes.mensagens.erroCarregar'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function startEdit(p: Paciente) {
    setEditingId(p.id)
    setForm({
      nome: p.nome,
      dataNascimento: p.dataNascimento ?? '',
      carteirinha: p.carteirinha,
      cpf: p.cpf,
    })
    setError('')
    setSuccess('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(EMPTY)
    setError('')
  }

  async function handleSubmit() {
    setError('')
    setSuccess('')

    if (!form.nome.trim() || !form.carteirinha.trim() || !form.cpf.trim()) {
      setError(t('pacientes.mensagens.erroCampos'))
      return
    }

    setSubmitting(true)
    try {
      if (editingId !== null) {
        await updatePaciente(editingId, form)
        setSuccess(t('pacientes.mensagens.atualizado'))
        setEditingId(null)
      } else {
        await createPaciente(form)
        setSuccess(t('pacientes.mensagens.criado'))
      }
      setForm(EMPTY)
      await load()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t('pacientes.mensagens.erroCarregar'))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (deleteId === null) return
    try {
      await deletePaciente(deleteId)
      setSuccess(t('pacientes.mensagens.removido'))
      await load()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t('pacientes.mensagens.erroRemover'))
    } finally {
      setDeleteId(null)
    }
  }

  function formatCPF(cpf: string) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  return (
    <div className={styles.page}>
      {deleteId !== null && (
        <ConfirmModal
          message={t('pacientes.mensagens.confirmarRemover')}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

      <h1 className={styles.title}>{t('pacientes.titulo')}</h1>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>
          {editingId !== null ? t('pacientes.editar') : t('pacientes.novo')}
        </h2>

        {error   && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.successMsg}>{success}</div>}

        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label>{t('pacientes.campos.nome')}</label>
            <input
              placeholder={t('pacientes.campos.nomePlaceholder')}
              value={form.nome}
              onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
            />
          </div>
          <div className={styles.field}>
            <label>{t('pacientes.campos.cpf')}</label>
            <input
              placeholder={t('pacientes.campos.cpfPlaceholder')}
              value={form.cpf}
              onChange={e => setForm(f => ({ ...f, cpf: e.target.value }))}
            />
          </div>
          <div className={styles.field}>
            <label>{t('pacientes.campos.carteirinha')}</label>
            <input
              placeholder={t('pacientes.campos.carteirinhaPlaceholder')}
              value={form.carteirinha}
              onChange={e => setForm(f => ({ ...f, carteirinha: e.target.value }))}
            />
          </div>
          <div className={styles.field}>
            <label>{t('pacientes.campos.dataNascimento')}</label>
            <input
              type="date"
              value={form.dataNascimento}
              onChange={e => setForm(f => ({ ...f, dataNascimento: e.target.value }))}
            />
          </div>
        </div>

        <div className={styles.formActions}>
          {editingId !== null && (
            <button className={styles.btnSecondary} onClick={cancelEdit}>
              {t('pacientes.cancelar')}
            </button>
          )}
          <button
            className={styles.btnPrimary}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting
              ? t('pacientes.salvando')
              : editingId !== null
                ? t('pacientes.salvar')
                : t('pacientes.cadastrar')}
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>{t('pacientes.lista.titulo')}</h2>

        {loading ? (
          <p className={styles.empty}>{t('pacientes.lista.carregando')}</p>
        ) : pacientes.length === 0 ? (
          <p className={styles.empty}>{t('pacientes.lista.vazio')}</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t('pacientes.lista.id')}</th>
                  <th>{t('pacientes.lista.nome')}</th>
                  <th>{t('pacientes.lista.cpf')}</th>
                  <th>{t('pacientes.lista.carteirinha')}</th>
                  <th>{t('pacientes.lista.nascimento')}</th>
                  <th>{t('pacientes.lista.acoes')}</th>
                </tr>
              </thead>
              <tbody>
                {pacientes.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.nome}</td>
                    <td>{formatCPF(p.cpf)}</td>
                    <td>{p.carteirinha}</td>
                    <td>{p.dataNascimento ?? '—'}</td>
                    <td>
                      <div className={styles.rowActions}>
                        <button className={styles.btnEdit} onClick={() => startEdit(p)}>
                          {t('pacientes.acoes.editar')}
                        </button>
                        <button className={styles.btnDelete} onClick={() => setDeleteId(p.id)}>
                          {t('pacientes.acoes.remover')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}