import { Navigate, Route, Routes } from 'react-router-dom'
import Sidebar from './components/sidebar/Sidebar'
import MedicosPage from './pages/MedicosPage'
import PacientesPage from './pages/PacientesPage'
import styles from './App.module.css'

export default function App() {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<Navigate to="/medicos" replace />} />
          <Route path="/medicos"   element={<MedicosPage />} />
          <Route path="/pacientes" element={<PacientesPage />} />
        </Routes>
      </main>
    </div>
  )
}