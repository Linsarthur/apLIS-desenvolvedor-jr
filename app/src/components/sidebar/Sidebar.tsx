import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styles from './Sidebar.module.css'

const LANGS = [
  { code: 'pt', label: 'PT' },
  { code: 'en', label: 'EN' },
]

export default function Sidebar() {
  const { t, i18n } = useTranslation()

  function changeLang(lang: string) {
    i18n.changeLanguage(lang)
    localStorage.setItem('lang', lang)
  }

  const NAV = [
    { to: '/medicos',   label: t('sidebar.medicos'),   icon: '⚕' },
    { to: '/pacientes', label: t('sidebar.pacientes'), icon: '🪪' },
  ]

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandIcon}>✚</span>
        <span className={styles.brandName}>Clínica</span>
      </div>

      <nav className={styles.nav}>
        {NAV.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ''}`
            }
          >
            <span className={styles.icon}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.langSwitcher}>
        {LANGS.map(({ code, label }) => (
          <button
            key={code}
            className={`${styles.langBtn} ${i18n.language === code ? styles.langActive : ''}`}
            onClick={() => changeLang(code)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={styles.footer}>
        <span>Teste Fullstack Jr.</span>
      </div>
    </aside>
  )
}