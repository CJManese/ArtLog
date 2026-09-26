import { useState } from "react"
import Sidebar from "./components/Sidebar"
import Dashboard from "./components/Dashboard"
import CreateCommission from "./components/CreateCommission"
import CommissionList from "./components/CommissionList"
import ClientList from "./components/ClientList"

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("dashboard")

  return (
    <div className="app">
      <Sidebar
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
      />

      <main className="main-content">
        {currentScreen === "dashboard" && <Dashboard />}

        {currentScreen === "create" && <CreateCommission />}

        {currentScreen === "commissions" && <CommissionList />}

        {currentScreen === "clients" && <ClientList />}

        {currentScreen === "settings" && (
          <h1>Settings</h1>
        )}
      </main>
    </div>
  )
}
