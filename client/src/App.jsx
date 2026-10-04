import { useState } from 'react'
import Dashboard from './components/Dashboard.jsx'
import CreateCommission from './components/CreateCommission.jsx'
import EditCommission from './components/EditCommission.jsx'
import CommissionList from './components/CommissionList.jsx'
import ClientList from './components/ClientList.jsx'
import Sidebar from './components/Sidebar.jsx'

function App() {
  const [screen, setScreen] = useState('dashboard')
  const [editingCommissionId, setEditingCommissionId] = useState(null)

  function editCommission(id) {
    setEditingCommissionId(id)
    setScreen('edit')
  }

  function goDashboard() {
    setEditingCommissionId(null)
    setScreen('dashboard')
  }

  function navigate(nextScreen) {
    setEditingCommissionId(null)
    setScreen(nextScreen)
  }

  function renderScreen() {
    switch (screen) {
      case 'dashboard':
        return (
          <Dashboard
            onEditCommission={editCommission}
            onCreateCommission={() => setScreen('create')}
          />
        )

      case 'create':
        return (
          <CreateCommission
            onSaved={goDashboard}
            onCancel={goDashboard}
          />
        )

      case 'edit':
        return (
          <EditCommission
            commissionId={editingCommissionId}
            onSaved={goDashboard}
            onCancel={goDashboard}
          />
        )

      case 'commissions':
        return (
          <CommissionList
            onEdit={editCommission}
          />
        )

      case 'clients':
        return <ClientList />

      default:
        return (
          <Dashboard
            onEditCommission={editCommission}
            onCreateCommission={() => setScreen('create')}
          />
        )
    }
  }

  return (
    <div className="app">
      <Sidebar
        currentScreen={screen}
        onNavigate={navigate}
      />

      <div className="content">
        {renderScreen()}
      </div>
    </div>
  )
}

export default App
