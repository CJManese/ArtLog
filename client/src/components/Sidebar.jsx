function Sidebar({ currentScreen, onNavigate }) {
  return (
    <aside>
      <h2>Art Log</h2>

      <nav>
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          disabled={currentScreen === 'dashboard'}
        >
          Dashboard
        </button>

        <button
          type="button"
          onClick={() => onNavigate('create')}
          disabled={currentScreen === 'create'}
        >
          Make Commission
        </button>

        <button
          type="button"
          onClick={() => onNavigate('commissions')}
          disabled={currentScreen === 'commissions'}
        >
          Commission List
        </button>

        <button
          type="button"
          onClick={() => onNavigate('clients')}
          disabled={currentScreen === 'clients'}
        >
          Client List
        </button>

        <button
          type="button"
          onClick={() => onNavigate('settings')}
          disabled={currentScreen === 'settings'}
        >
          Settings
        </button>
      </nav>
    </aside>
  )
}

export default Sidebar
