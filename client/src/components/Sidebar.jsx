function Sidebar({ currentScreen, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="logo">
        <h2>Art Log</h2>
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
          + Make Commission
        </button>

        <button
          type="button"
          className={currentScreen === 'commissions' ? 'active' : ''}
          onClick={() => onNavigate('commissions')}
        >
          Commission Logs
        </button>

        <button
          type="button"
          className={currentScreen === 'clients' ? 'active' : ''}
          onClick={() => onNavigate('clients')}
        >
          Client List
        </button>

        <button
          type="button"
          className={currentScreen === 'settings' ? 'active' : ''}
          onClick={() => onNavigate('settings')}
        >
          Settings
        </button>
      </nav>
    </aside>
  )
}

export default Sidebar
