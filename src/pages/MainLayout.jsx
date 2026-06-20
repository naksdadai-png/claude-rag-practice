import { useState } from 'react'
import TopBar from '../components/TopBar'
import Sidebar from '../components/Sidebar'
import ChatArea from '../components/ChatArea'
import './MainLayout.css'

const PROJECT_NAMES = {
  all: '전체 프로젝트',
  'proj-a': 'EPS-MCU v3.2',
  'proj-b': 'BMS-Core 2024',
  'proj-c': 'ADAS-Radar L3',
  'proj-d': 'ACU-SafetyNet',
  'proj-e': 'ECU-Thermal Mgmt',
}

export default function MainLayout({ user, onLogout }) {
  const [selectedProject, setSelectedProject] = useState('proj-a')
  const [activeChatId, setActiveChatId] = useState(1)
  const [currentModel, setCurrentModel] = useState('claude-sonnet-4-6')
  const [ragQuality, setRagQuality] = useState('balanced')

  const handleNewChat = () => {
    setActiveChatId(null)
  }

  return (
    <div className="main-root">
      <TopBar
        user={user}
        currentModel={currentModel}
        onModelChange={setCurrentModel}
        ragQuality={ragQuality}
        onRagQualityChange={setRagQuality}
        onLogout={onLogout}
      />
      <div className="main-body">
        <Sidebar
          selectedProject={selectedProject}
          onProjectChange={setSelectedProject}
          activeChatId={activeChatId}
          onChatSelect={setActiveChatId}
          onNewChat={handleNewChat}
        />
        <ChatArea projectName={PROJECT_NAMES[selectedProject] || '전체 프로젝트'} />
      </div>
    </div>
  )
}
