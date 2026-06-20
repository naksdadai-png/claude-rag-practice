import { useState, useRef, useEffect } from 'react'
import {
  Send,
  Bot,
  User,
  FileText,
  Copy,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  Hash,
  RotateCcw,
  Paperclip,
} from 'lucide-react'
import './ChatArea.css'

const TOP_QUERIES = [
  { rank: 1, text: 'ASIL-D 요구사항 추적성', count: 47 },
  { rank: 2, text: 'Safety Goal 분석', count: 38 },
  { rank: 3, text: 'FMEA 누락 항목 검토', count: 31 },
  { rank: 4, text: 'Watchdog 설계 기준', count: 24 },
  { rank: 5, text: 'ISO 26262 2nd Edition', count: 19 },
]

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: 'assistant',
    content:
      '안녕하세요! FuSa RAG Chat입니다.\n\n현재 **EPS-MCU v3.2** 프로젝트의 기능안전 산출물을 검색할 준비가 되었습니다. 요구사항, 설계 문서, 테스트 케이스, 표준 규격 등에 관한 질문을 자유롭게 입력해주세요.',
    sources: [],
    time: '09:32',
  },
  {
    id: 2,
    role: 'user',
    content: 'EPS-MCU 프로젝트에서 ASIL-D로 분류된 Safety Goal 목록을 알려줘.',
    time: '09:33',
  },
  {
    id: 3,
    role: 'assistant',
    content:
      'EPS-MCU v3.2 프로젝트에서 **ASIL-D**로 분류된 Safety Goal은 다음과 같습니다:\n\n**SG-01. 의도하지 않은 조향 토크 발생 방지**\n- ASIL: D\n- 안전 상태: 전동 어시스트 토크 출력 차단\n- 관련 규격: ISO 26262-6, §8.4.4\n\n**SG-02. 과도한 조향 어시스트로 인한 차량 제어 불능 방지**\n- ASIL: D\n- 안전 상태: 어시스트 토크 ≤ 2Nm 제한\n- 관련 규격: ISO 26262-4, §6.4\n\n**SG-03. 모터 위치 센서 오류 시 안전한 전환 보장**\n- ASIL: C(D)\n- 안전 상태: Limp-home 모드 진입\n- 관련 규격: ISO 26262-5, §9.4.3',
    sources: [
      { id: 'SRS-EPS-001', type: 'requirement', title: 'EPS Safety Requirements Spec v2.1' },
      { id: 'HARA-EPS-003', type: 'analysis', title: 'HARA Report Rev.B' },
      { id: 'ISO26262-4', type: 'standard', title: 'ISO 26262-4:2018 §6' },
    ],
    time: '09:33',
  },
]

const SUGGESTED_QUESTIONS = [
  'SG-01의 하위 Safety Requirement를 보여줘',
  'ASIL 분해 적용 항목은 무엇이 있어?',
  '안전 상태 전환 로직의 테스트 케이스를 찾아줘',
  '이 프로젝트의 Verification Report 현황은?',
]

function Message({ msg }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const sourceTypeIcon = (type) => {
    const icons = { requirement: '📋', analysis: '🔍', standard: '📖', test: '🧪' }
    return icons[type] || '📄'
  }

  const formatContent = (text) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g)
      return (
        <span key={i}>
          {parts.map((part, j) =>
            part.startsWith('**') && part.endsWith('**') ? (
              <strong key={j}>{part.slice(2, -2)}</strong>
            ) : (
              part
            )
          )}
          {i < text.split('\n').length - 1 && <br />}
        </span>
      )
    })
  }

  return (
    <div className={`message message-${msg.role}`}>
      <div className="message-avatar">
        {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
      </div>
      <div className="message-body">
        <div className="message-meta">
          <span className="message-sender">
            {msg.role === 'assistant' ? 'FuSa AI' : '나'}
          </span>
          <span className="message-time">{msg.time}</span>
        </div>
        <div className="message-content">{formatContent(msg.content)}</div>

        {msg.sources && msg.sources.length > 0 && (
          <div className="message-sources">
            <div className="sources-label">
              <FileText size={12} />
              참조 문서
            </div>
            <div className="sources-list">
              {msg.sources.map((src) => (
                <div key={src.id} className="source-chip">
                  <span>{sourceTypeIcon(src.type)}</span>
                  <span className="source-id">{src.id}</span>
                  <span className="source-title">{src.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {msg.role === 'assistant' && (
          <div className="message-actions">
            <button onClick={handleCopy} className="msg-action-btn">
              <Copy size={12} />
              {copied ? '복사됨' : '복사'}
            </button>
            <button className="msg-action-btn">
              <ThumbsUp size={12} />
            </button>
            <button className="msg-action-btn">
              <ThumbsDown size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ChatArea({ projectName }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    await new Promise((r) => setTimeout(r, 1800))

    const aiMsg = {
      id: Date.now() + 1,
      role: 'assistant',
      content:
        '해당 질문에 대한 관련 산출물을 검색했습니다.\n\nRAG 데이터베이스에서 **3개**의 관련 문서를 찾았으며, 요청하신 내용을 분석 중입니다. 실제 구현 시 벡터 검색 결과가 이 위치에 표시됩니다.',
      sources: [
        { id: 'DOC-PROTO', type: 'requirement', title: '프로토타입 응답 예시' },
      ],
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, aiMsg])
    setLoading(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggest = (q) => {
    setInput(q)
    textareaRef.current?.focus()
  }

  return (
    <div className="chat-root">
      {/* Top Queries Panel */}
      <div className="top-queries-bar">
        <div className="top-queries-label">
          <TrendingUp size={13} />
          <span>{projectName} · 인기 검색어</span>
        </div>
        <div className="top-queries-list">
          {TOP_QUERIES.map((q) => (
            <button
              key={q.rank}
              className="top-query-chip"
              onClick={() => handleSuggest(q.text)}
            >
              <span className="top-query-rank">
                <Hash size={10} />
                {q.rank}
              </span>
              <span className="top-query-text">{q.text}</span>
              <span className="top-query-count">{q.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg) => (
          <Message key={msg.id} msg={msg} />
        ))}
        {loading && (
          <div className="message message-assistant">
            <div className="message-avatar">
              <Bot size={16} />
            </div>
            <div className="message-body">
              <div className="message-meta">
                <span className="message-sender">FuSa AI</span>
              </div>
              <div className="typing-indicator">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length <= 3 && (
        <div className="suggested-questions">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button key={q} className="suggested-btn" onClick={() => handleSuggest(q)}>
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="chat-input-area">
        <div className="chat-input-wrap">
          <button className="input-attach-btn" title="파일 첨부">
            <Paperclip size={16} />
          </button>
          <textarea
            ref={textareaRef}
            className="chat-input"
            placeholder="기능안전 산출물에 대해 질문하세요... (Enter: 전송, Shift+Enter: 줄바꿈)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button
            className={`chat-send-btn ${input.trim() ? 'active' : ''}`}
            onClick={handleSend}
            disabled={!input.trim() || loading}
            title="전송"
          >
            <Send size={16} />
          </button>
        </div>
        <div className="chat-input-hint">
          RAG 검색 범위: 요구사항 · 설계 · 테스트케이스 · 테스트결과 · 표준 · 데이터시트
        </div>
      </div>
    </div>
  )
}
