import { useState } from 'react'
import { Lock, User, Building2, Shield } from 'lucide-react'
import './LoginPage.css'

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username || !password) {
      setError('아이디와 비밀번호를 입력해주세요.')
      return
    }
    setLoading(true)
    setError('')
    // Simulate AD auth delay
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    onLogin({ adUsername: username })
  }

  return (
    <div className="login-root">
      <div className="login-bg">
        <div className="login-bg-grid" />
      </div>

      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">
            <Shield size={28} />
          </div>
          <div className="login-logo-text">
            <span className="login-logo-primary">FuSa</span>
            <span className="login-logo-secondary">RAG Chat</span>
          </div>
        </div>

        <div className="login-header">
          <h1>안전하게 접속하세요</h1>
          <p>사내 Active Directory 계정으로 로그인합니다</p>
        </div>

        <div className="login-ad-badge">
          <Building2 size={14} />
          <span>Microsoft AD (Azure Active Directory)</span>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="username">사용자 ID (AD 계정)</label>
            <div className="login-input-wrap">
              <User size={16} className="login-input-icon" />
              <input
                id="username"
                type="text"
                placeholder="username@company.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="password">비밀번호</label>
            <div className="login-input-wrap">
              <Lock size={16} className="login-input-icon" />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? (
              <span className="login-spinner" />
            ) : (
              'AD 계정으로 로그인'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>기능안전 산출물 검색 및 AI 분석 플랫폼</p>
          <p className="login-footer-sub">
            ISO 26262 · IEC 61508 · ASPICE 지원
          </p>
        </div>
      </div>
    </div>
  )
}
