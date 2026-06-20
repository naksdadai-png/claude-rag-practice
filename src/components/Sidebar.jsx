import { useState } from 'react'
import {
  ChevronDown,
  MessageSquare,
  Plus,
  Search,
  Shield,
  Clock,
  Trash2,
  FolderOpen,
} from 'lucide-react'
import './Sidebar.css'

const PROJECTS = [
  { id: 'all', name: '전체 프로젝트', icon: '🗂️' },
  { id: 'proj-a', name: 'EPS-MCU v3.2', icon: '🚗' },
  { id: 'proj-b', name: 'BMS-Core 2024', icon: '🔋' },
  { id: 'proj-c', name: 'ADAS-Radar L3', icon: '📡' },
  { id: 'proj-d', name: 'ACU-SafetyNet', icon: '🛡️' },
  { id: 'proj-e', name: 'ECU-Thermal Mgmt', icon: '🌡️' },
]

const CHAT_HISTORY = [
  {
    id: 1,
    title: 'ISO 26262 ASIL-D 요구사항 분석',
    project: 'EPS-MCU v3.2',
    time: '방금 전',
  },
  {
    id: 2,
    title: 'RAM 진단 커버리지 테스트 케이스',
    project: 'BMS-Core 2024',
    time: '1시간 전',
  },
  {
    id: 3,
    title: 'Safety Goal SG-04 추적성 검토',
    project: 'EPS-MCU v3.2',
    time: '2시간 전',
  },
  {
    id: 4,
    title: 'FMEA 항목 누락 여부 확인',
    project: 'ADAS-Radar L3',
    time: '어제',
  },
  {
    id: 5,
    title: 'Watchdog 타이머 설계 검토',
    project: 'ACU-SafetyNet',
    time: '어제',
  },
  {
    id: 6,
    title: 'IEC 61508 SIL 2 적합성 분석',
    project: 'ECU-Thermal Mgmt',
    time: '2일 전',
  },
  {
    id: 7,
    title: '소프트웨어 아키텍처 리뷰 체크리스트',
    project: 'BMS-Core 2024',
    time: '3일 전',
  },
]

export default function Sidebar({ selectedProject, onProjectChange, activeChatId, onChatSelect, onNewChat }) {
  const [projectOpen, setProjectOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const currentProject = PROJECTS.find((p) => p.id === selectedProject) || PROJECTS[0]

  const filteredHistory = CHAT_HISTORY.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Shield size={18} />
        </div>
        <span className="sidebar-logo-text">FuSa RAG Chat</span>
      </div>

      {/* New Chat Button */}
      <div className="sidebar-new-chat">
        <button className="new-chat-btn" onClick={onNewChat}>
          <Plus size={15} />
          새 대화 시작
        </button>
      </div>

      {/* Project Selector */}
      <div className="sidebar-section">
        <div className="sidebar-section-label">
          <FolderOpen size={12} />
          프로젝트
        </div>
        <div className="project-selector">
          <button
            className="project-dropdown-trigger"
            onClick={() => setProjectOpen(!projectOpen)}
          >
            <span className="project-icon">{currentProject.icon}</span>
            <span className="project-name">{currentProject.name}</span>
            <ChevronDown
              size={14}
              className={`project-chevron ${projectOpen ? 'open' : ''}`}
            />
          </button>
          {projectOpen && (
            <div className="project-dropdown">
              {PROJECTS.map((p) => (
                <button
                  key={p.id}
                  className={`project-option ${p.id === selectedProject ? 'active' : ''}`}
                  onClick={() => {
                    onProjectChange(p.id)
                    setProjectOpen(false)
                  }}
                >
                  <span>{p.icon}</span>
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat History */}
      <div className="sidebar-section sidebar-history">
        <div className="sidebar-section-label">
          <Clock size={12} />
          대화 기록
        </div>
        <div className="sidebar-search">
          <Search size={13} className="sidebar-search-icon" />
          <input
            type="text"
            placeholder="대화 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="chat-history-list">
          {filteredHistory.map((chat) => (
            <div
              key={chat.id}
              className={`chat-history-item ${activeChatId === chat.id ? 'active' : ''}`}
              onClick={() => onChatSelect(chat.id)}
            >
              <div className="chat-history-icon">
                <MessageSquare size={13} />
              </div>
              <div className="chat-history-content">
                <div className="chat-history-title">{chat.title}</div>
                <div className="chat-history-meta">
                  <span className="chat-history-project">{chat.project}</span>
                  <span className="chat-history-time">{chat.time}</span>
                </div>
              </div>
              <button
                className="chat-history-delete"
                onClick={(e) => {
                  e.stopPropagation()
                }}
                title="삭제"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          {filteredHistory.length === 0 && (
            <div className="chat-history-empty">검색 결과가 없습니다</div>
          )}
        </div>
      </div>
    </aside>
  )
}
