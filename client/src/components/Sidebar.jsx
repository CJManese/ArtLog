function Sidebar({ currentScreen, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="logo">
        <h2>ArtLog</h2>
        <span>Commission Tracker</span>
      </div>

      <nav>
        <button
          type="button"
          className={currentScreen === 'dashboard' ? 'active' : ''}
          onClick={() => onNavigate('dashboard')}
        >
          Dashboard
        </button>

        <button
          type="button"
          className={currentScreen === 'create' ? 'active' : ''}
          onClick={() => onNavigate('create')}
        >
          Create Log
        </button>

        <button
          type="button"
          className={currentScreen === 'commissions' ? 'active' : ''}
          onClick={() => onNavigate('commissions')}
        >
          Commissions
        </button>

        <button
          type="button"
          className={currentScreen === 'clients' ? 'active' : ''}
          onClick={() => onNavigate('clients')}
        >
          Clients
        </button>

      </nav>
    </aside>
  )
}

export default Sidebar
