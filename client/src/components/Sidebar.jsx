import logo from '../Assets/Logo.png'

/* Simple line icons, drawn here so no extra files are needed.
   They use currentColor, so CSS controls their colour. */
const icons = {
  dashboard: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 11.2 12 4l8 7.2V19a1.5 1.5 0 0 1-1.5 1.5H15v-5.5H9v5.5H5.5A1.5 1.5 0 0 1 4 19z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  ),

  create: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 4v16M4 12h16"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  ),

  commissions: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M9.5 3.5C5.4 3.5 2.5 6.6 2.5 10.4c0 3.8 2.7 7.4 6.4 7.4 1.4 0 1.6-1 1.1-1.8-.6-1 0-2 1.1-2h1.2c1.5 0 2.7-1.1 2.7-2.6 0-3.6-2.8-5.9-5.5-5.9z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="8.5" r="1" fill="currentColor" />
      <circle cx="10.5" cy="7.5" r="1" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r="1" fill="currentColor" />
      <path
        d="M19 3v8M17.6 11h2.8v2.2h-2.8zM19 13.2V21"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  clients: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="7.5" r="4.2" fill="currentColor" />
      <path
        d="M3.5 20.5c0-4.2 3.6-6.7 8.5-6.7s8.5 2.5 8.5 6.7z"
        fill="currentColor"
      />
    </svg>
  )
}

const items = [
  ['dashboard', 'Dashboard'],
  ['create', 'Create Log'],
  ['commissions', 'Commissions'],
  ['clients', 'Clients']
]

/* The active item is two-coloured: first part navy, rest dark */
function ActiveLabel({ text }) {
  const split = Math.round(text.length * 0.45)

  return (
    <span className="nav-label">
      <span className="nav-first">{text.slice(0, split)}</span>
      {text.slice(split)}
    </span>
  )
}

function Sidebar({ currentScreen, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="logo">
        <img src={logo} alt="" />

        <h2>
          <span className="logo-art">Art</span>
          <span className="logo-log">
            <u>Lo</u>g
          </span>
        </h2>
      </div>

      <nav>
        {items.map(([key, label]) => {
          const isActive = currentScreen === key

          return (
            <button
              key={key}
              type="button"
              className={isActive ? 'nav-item active' : 'nav-item'}
              onClick={() => onNavigate(key)}
            >
              <span className="nav-icon">{icons[key]}</span>

              {isActive ? (
                <ActiveLabel text={label} />
              ) : (
                <span className="nav-label">{label}</span>
              )}
            </button>
          )
        })}
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
