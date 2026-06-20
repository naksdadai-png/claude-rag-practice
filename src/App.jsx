import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import MainLayout from './pages/MainLayout'
import './App.css'

const MOCK_USER = {
  name: '김도현',
  email: 'dohyeon.kim@company.com',
  department: 'FuSa Engineering',
  avatar: 'KD',
  tokenUsed: 48320,
  tokenLimit: 100000,
}

export default function App() {
  const [user, setUser] = useState(null)

  const handleLogin = (credentials) => {
    setUser({ ...MOCK_USER, ...credentials })
  }

  const handleLogout = () => setUser(null)

  return user ? (
    <MainLayout user={user} onLogout={handleLogout} />
  ) : (
    <LoginPage onLogin={handleLogin} />
  )
}
