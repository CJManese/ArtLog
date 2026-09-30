import { useState } from 'react'
import Dashboard from './components/Dashboard.jsx'
import CreateCommission from './components/CreateCommission.jsx'
import CommissionList from './components/CommissionList.jsx'
import ClientList from './components/ClientList.jsx'
import Sidebar from './components/Sidebar.jsx'

function App() {
  const [screen, setScreen] = useState('dashboard')

  function renderScreen() {
    switch (screen) {
      case 'dashboard':
        return (
          <Dashboard
            onEditCommission={(id) => {
              console.log('Edit commission:', id)
            }}
          />
        )

      case 'create':
        return (
          <CreateCommission
            onSaved={() => setScreen('dashboard')}
            onCancel={() => setScreen('dashboard')}
          />
        )

      case 'commissions':
        return <CommissionList />

      case 'clients':
        return <ClientList />

      default:
        return <Dashboard />
    }
  }

  return (
    <div>
      <Sidebar
        currentScreen={screen}
        onNavigate={setScreen}
      />

      {renderScreen()}
    </div>
  )
}

export default App
