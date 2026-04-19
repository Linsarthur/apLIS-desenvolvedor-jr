import { useTranslation } from 'react-i18next'
import styles from './ConfirmModal.module.css'

interface Props {
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({ message, onConfirm, onCancel }: Props) {
  const { t } = useTranslation()

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onCancel}>
            {t('modal.cancelar')}
          </button>
          <button className={styles.confirm} onClick={onConfirm}>
            {t('modal.confirmar')}
          </button>
        </div>
      </div>
    </div>
  )
}