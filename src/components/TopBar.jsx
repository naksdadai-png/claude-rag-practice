import { useState } from 'react'
import {
  ChevronDown,
  LogOut,
  Cpu,
  Database,
  Zap,
  TrendingUp,
} from 'lucide-react'
import './TopBar.css'

const RAG_QUALITY_LEVELS = [
  { value: 'precision', label: 'Precision', color: 'purple', desc: '정밀 검색 · 상위 3개 문서' },
  { value: 'balanced', label: 'Balanced', color: 'green', desc: '균형 검색 · 상위 5개 문서' },
  { value: 'recall', label: 'Recall', color: 'amber', desc: '광범위 검색 · 상위 10개 문서' },
]

const AI_MODELS = [
  { value: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6', tier: 'Standard' },
  { value: 'claude-opus-4-8', label: 'Claude Opus 4.8', tier: 'Advanced' },
  { value: 'claude-haiku-4-5', label: 'Claude Haiku 4.5', tier: 'Fast' },
]

function TokenGauge({ used, limit }) {
  const pct = Math.min((used / limit) * 100, 100)
  const color = pct > 80 ? 'red' : pct > 60 ? 'amber' : 'green'
  return (
    <div className="token-gauge">
      <div className="token-gauge-header">
        <Zap size={12} />
        <span>토큰 사용량</span>
        <span className="token-numbers">
          {used.toLocaleString()} / {limit.toLocaleString()}
        </span>
      </div>
      <div className="token-bar">
        <div
          className={`token-bar-fill token-bar-${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default function TopBar({ user, currentModel, onModelChange, ragQuality, onRagQualityChange, onLogout }) {
  const [modelOpen, setModelOpen] = useState(false)
  const [qualityOpen, setQualityOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)

  const model = AI_MODELS.find((m) => m.value === currentModel) || AI_MODELS[0]
  const quality = RAG_QUALITY_LEVELS.find((q) => q.value === ragQuality) || RAG_QUALITY_LEVELS[1]

  return (
    <header className="topbar">
      {/* Left: spacer for sidebar */}
      <div className="topbar-left">
        <TrendingUp size={14} className="topbar-title-icon" />
        <span className="topbar-title">기능안전 산출물 검색 · AI 분석</span>
      </div>

      <div className="topbar-right">
        {/* Token Usage */}
        <TokenGauge used={user.tokenUsed} limit={user.tokenLimit} />

        <div className="topbar-divider" />

        {/* AI Model Selector */}
        <div className="topbar-dropdown-wrap">
          <button
            className="topbar-badge-btn"
            onClick={() => {
              setModelOpen(!modelOpen)
              setQualityOpen(false)
              setUserOpen(false)
            }}
          >
            <Cpu size={13} />
            <span className="badge-label">{model.label}</span>
            <span className="badge-tier">{model.tier}</span>
            <ChevronDown size={12} className={modelOpen ? 'open' : ''} />
          </button>
          {modelOpen && (
            <div className="topbar-dropdown">
              <div className="dropdown-label">AI 모델 선택</div>
              {AI_MODELS.map((m) => (
                <button
                  key={m.value}
                  className={`dropdown-option ${m.value === currentModel ? 'active' : ''}`}
                  onClick={() => {
                    onModelChange(m.value)
                    setModelOpen(false)
                  }}
                >
                  <span>{m.label}</span>
                  <span className="dropdown-option-sub">{m.tier}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="topbar-divider" />

        {/* RAG Quality Selector */}
        <div className="topbar-dropdown-wrap">
          <button
            className={`topbar-badge-btn quality-btn quality-${quality.color}`}
            onClick={() => {
              setQualityOpen(!qualityOpen)
              setModelOpen(false)
              setUserOpen(false)
            }}
          >
            <Database size={13} />
            <span className="badge-label">RAG</span>
            <span className="badge-quality">{quality.label}</span>
            <ChevronDown size={12} className={qualityOpen ? 'open' : ''} />
          </button>
          {qualityOpen && (
            <div className="topbar-dropdown">
              <div className="dropdown-label">RAG 검색 품질</div>
              {RAG_QUALITY_LEVELS.map((q) => (
                <button
                  key={q.value}
                  className={`dropdown-option ${q.value === ragQuality ? 'active' : ''}`}
                  onClick={() => {
                    onRagQualityChange(q.value)
                    setQualityOpen(false)
                  }}
                >
                  <div>
                    <div className={`quality-label quality-dot-${q.color}`}>{q.label}</div>
                    <div className="dropdown-option-sub">{q.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="topbar-divider" />

        {/* User Menu */}
        <div className="topbar-dropdown-wrap">
          <button
            className="topbar-user-btn"
            onClick={() => {
              setUserOpen(!userOpen)
              setModelOpen(false)
              setQualityOpen(false)
            }}
          >
            <div className="user-avatar">{user.avatar}</div>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-dept">{user.department}</span>
            </div>
            <ChevronDown size={12} className={userOpen ? 'open' : ''} />
          </button>
          {userOpen && (
            <div className="topbar-dropdown user-dropdown">
              <div className="dropdown-label">계정 정보</div>
              <div className="user-detail">
                <div className="user-detail-name">{user.name}</div>
                <div className="user-detail-email">{user.email}</div>
                <div className="user-detail-dept">{user.department}</div>
              </div>
              <div className="dropdown-divider" />
              <button
                className="dropdown-option logout-option"
                onClick={() => {
                  setUserOpen(false)
                  onLogout()
                }}
              >
                <LogOut size={13} />
                <span>로그아웃</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
