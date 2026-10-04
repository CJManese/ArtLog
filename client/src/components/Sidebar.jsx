import logo from '../Assets/Logo.png'

function Sidebar({ currentScreen, onNavigate }) {
  const items = [
    ['dashboard', 'Dashboard'],
    ['create', 'Create Log'],
    ['commissions', 'Commissions'],
    ['clients', 'Clients']
  ]

  return (
    <aside className="sidebar">
      <div className="logo">
        <img src={logo} alt="" />
        <h2>
          Art<span>Log</span>
        </h2>
      </div>

      <nav>
        {items.map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={currentScreen === key ? 'active' : ''}
            onClick={() => onNavigate(key)}
          >
            {label}
          </button>
        ))}
      </nav>

      <button
        type="button"
        className="logout"
        onClick={() => window.alert('Log out is not available yet.')}
      >
        Log Out
      </button>
    </aside>
  )
}

export default Sidebar
