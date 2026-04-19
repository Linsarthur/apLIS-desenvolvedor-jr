import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Medico, MedicoPayload } from '../types'
import {
  getMedicos,
  createMedico,
  updateMedico,
  deleteMedico,
} from '../services/medicosService'
import ConfirmModal from '../components/confirmModal/ConfirmModal'
import styles from './Page.module.css'

const EMPTY: MedicoPayload = { nome: '', CRM: '', UFCRM: '' }

export default function MedicosPage() {
  const { t } = useTranslation()

  const [medicos, setMedicos]       = useState<Medico[]>([])
  const [form, setForm]             = useState<MedicoPayload>(EMPTY)
  const [editingId, setEditingId]   = useState<number | null>(null)
  const [loading, setLoading]       = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState('')
  const [success, setSuccess]       = useState('')
  const [deleteId, setDeleteId]     = useState<number | null>(null)

  async function load() {
    setLoading(true)
    try {
      setMedicos(await getMedicos())
    } catch {
      setError(t('medicos.mensagens.erroCarregar'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function startEdit(m: Medico) {
    setEditingId(m.id)
    setForm({ nome: m.nome, CRM: m.CRM, UFCRM: m.UFCRM })
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

    if (!form.nome.trim() || !form.CRM.trim() || !form.UFCRM.trim()) {
      setError(t('medicos.mensagens.erroCampos'))
      return
    }

    setSubmitting(true)
    try {
      if (editingId !== null) {
        await updateMedico(editingId, form)
        setSuccess(t('medicos.mensagens.atualizado'))
        setEditingId(null)
      } else {
        await createMedico(form)
        setSuccess(t('medicos.mensagens.criado'))
      }
      setForm(EMPTY)
      await load()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t('medicos.mensagens.erroCarregar'))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (deleteId === null) return
    try {
      await deleteMedico(deleteId)
      setSuccess(t('medicos.mensagens.removido'))
      await load()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t('medicos.mensagens.erroRemover'))
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <div className={styles.page}>
      {deleteId !== null && (
        <ConfirmModal
          message={t('medicos.mensagens.confirmarRemover')}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

      <h1 className={styles.title}>{t('medicos.titulo')}</h1>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>
          {editingId !== null ? t('medicos.editar') : t('medicos.novo')}
        </h2>

        {error   && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.successMsg}>{success}</div>}

        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label>{t('medicos.campos.nome')}</label>
            <input
              placeholder={t('medicos.campos.nomePlaceholder')}
              value={form.nome}
              onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
            />
          </div>
          <div className={styles.field}>
            <label>{t('medicos.campos.crm')}</label>
            <input
              placeholder={t('medicos.campos.crmPlaceholder')}
              value={form.CRM}
              onChange={e => setForm(f => ({ ...f, CRM: e.target.value }))}
            />
          </div>
          <div className={styles.field}>
            <label>{t('medicos.campos.uf')}</label>
            <input
              placeholder={t('medicos.campos.ufPlaceholder')}
              maxLength={2}
              value={form.UFCRM}
              onChange={e => setForm(f => ({ ...f, UFCRM: e.target.value.toUpperCase() }))}
            />
          </div>
        </div>

        <div className={styles.formActions}>
          {editingId !== null && (
            <button className={styles.btnSecondary} onClick={cancelEdit}>
              {t('medicos.cancelar')}
            </button>
          )}
          <button
            className={styles.btnPrimary}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting
              ? t('medicos.salvando')
              : editingId !== null
                ? t('medicos.salvar')
                : t('medicos.cadastrar')}
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>{t('medicos.lista.titulo')}</h2>

        {loading ? (
          <p className={styles.empty}>{t('medicos.lista.carregando')}</p>
        ) : medicos.length === 0 ? (
          <p className={styles.empty}>{t('medicos.lista.vazio')}</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t('medicos.lista.id')}</th>
                  <th>{t('medicos.lista.nome')}</th>
                  <th>{t('medicos.lista.crm')}</th>
                  <th>{t('medicos.lista.uf')}</th>
                  <th>{t('medicos.lista.acoes')}</th>
                </tr>
              </thead>
              <tbody>
                {medicos.map(m => (
                  <tr key={m.id}>
                    <td>{m.id}</td>
                    <td>{m.nome}</td>
                    <td>{m.CRM}</td>
                    <td><span className={styles.badge}>{m.UFCRM}</span></td>
                    <td>
                      <div className={styles.rowActions}>
                        <button className={styles.btnEdit} onClick={() => startEdit(m)}>
                          {t('medicos.acoes.editar')}
                        </button>
                        <button className={styles.btnDelete} onClick={() => setDeleteId(m.id)}>
                          {t('medicos.acoes.remover')}
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