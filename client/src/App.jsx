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

      case 'settings':
        return (
          <main className="page">
            <h1>Settings</h1>

            <div className="card">
              <h2>Art Log</h2>
              <p className="muted">
                Commission tracking application for artists.
              </p>

              <p>
                This application stores client and commission
                information through the Art Log API.
              </p>
            </div>
          </main>
        )

      default:
        return <Dashboard />
    }
  }

  return (
    <div className="app">
      <Sidebar
        currentScreen={screen}
        onNavigate={(nextScreen) => {
          setEditingCommissionId(null)
          setScreen(nextScreen)
        }}
      />

      <div className="content">
        {renderScreen()}
      </div>
    </div>
  )
}

export default App
