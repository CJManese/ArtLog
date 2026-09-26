export default function Sidebar({ currentScreen, setCurrentScreen }) {
  return (
    <aside className="sidebar">
      <h2>ArtLog</h2>

      <nav>
        <button onClick={() => setCurrentScreen("dashboard")}>
          Dashboard
        </button>

        <button onClick={() => setCurrentScreen("create")}>
          Create Log
        </button>

        <button onClick={() => setCurrentScreen("commissions")}>
          Commissions
        </button>

        <button onClick={() => setCurrentScreen("clients")}>
          Clients
        </button>

        <button onClick={() => setCurrentScreen("settings")}>
          Settings
        </button>
      </nav>
    </aside>
  )
}
