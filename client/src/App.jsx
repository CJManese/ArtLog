import { useState } from 'react'
import Dashboard from './components/Dashboard.jsx'
import CreateCommission from './components/CreateCommission.jsx'
import EditCommission from './components/EditCommission.jsx'
import CommissionList from './components/CommissionList.jsx'
import ClientList from './components/ClientList.jsx'
import Sidebar from './components/Sidebar.jsx'

function Settings() {
  return (
    <main className="page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p className="muted">
            Manage your Art Log preferences.
          </p>
        </div>
      </div>

      <section className="settings-card card">
        <h2>Art Log</h2>

        <div className="settings-row">
          <div>
            <strong>Application</strong>
            <p className="muted">
              Commission tracking for your artwork.
            </p>
          </div>
        </div>

        <div className="settings-row">
          <div>
            <strong>Database</strong>
            <p className="muted">
              Your commission and client information is stored
              securely through the Art Log database.
            </p>
          </div>

          <span className="status status-completed">
            Connected
          </span>
        </div>

        <div className="settings-row">
          <div>
            <strong>Password</strong>
            <p className="muted">
              Database access is protected by the server's
              database credentials.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

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

      case 'settings':
        return <Settings />

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
