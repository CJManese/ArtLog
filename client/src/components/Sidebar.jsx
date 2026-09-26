export default function Sidebar({ currentScreen, setCurrentScreen }) {
  return (
    <aside className="sidebar">
      <h2>ArtLog</h2>

      <nav>
        <button onClick={() => setCurrentScreen("dashboard")}>
          Dashboard
        </button>

        <button onClick={() => setCurrentScreen("create")}>
          Make Commission Log
        </button>

        <button onClick={() => setCurrentScreen("commissions")}>
          Commission List
        </button>

        <button onClick={() => setCurrentScreen("clients")}>
          Client List
        </button>

        <button onClick={() => setCurrentScreen("settings")}>
          Settings
        </button>
      </nav>
    </aside>
  )
}
