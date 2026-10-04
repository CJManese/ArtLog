import { useEffect, useState } from 'react'
import { getCommissions, getReferences } from '../api.js'

// Turns "2026-10-03T00:00:00.000Z" into "10/03/2026"
function formatDate(value) {
  if (!value) {
    return 'Not Specified'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    timeZone: 'UTC'
  })
}

// One thumbnail. If the link is not a working image, it hides itself.
function RefThumb({ url }) {
  const [broken, setBroken] = useState(false)

  if (broken) {
    return null
  }

  return (
    <a
      className="ref-thumb"
      href={url}
      target="_blank"
      rel="noreferrer"
    >
      <img
        src={url}
        alt="Reference"
        loading="lazy"
        onError={() => setBroken(true)}
      />
    </a>
  )
}

function Dashboard({ onEditCommission, onCreateCommission }) {
  const [commissions, setCommissions] = useState([])
  const [references, setReferences] = useState({})
  const [collapsed, setCollapsed] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadCommissions() {
    try {
      setError('')

      const all = await getCommissions()

      // Completed commissions do not show on the Dashboard
      const data = all.filter(
        (commission) => commission.status !== 'Completed'
      )

      setCommissions(data)

      // Load the references for every commission shown.
      // If one fails, that card just shows no references.
      const entries = await Promise.all(
        data.map(async (commission) => {
          try {
            const list = await getReferences(commission.id)
            return [commission.id, list]
          } catch {
            return [commission.id, []]
          }
        })
      )

      setReferences(Object.fromEntries(entries))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCommissions()
  }, [])

  function toggleReferences(id) {
    setCollapsed((current) => ({
      ...current,
      [id]: !current[id]
    }))
  }

  if (loading) {
    return (
      <main className="page">
        <div className="page-header">
          <h1>Dashboard</h1>
        </div>
        <p>Loading commissions...</p>
      </main>
    )
  }

  return (
    <main className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      <div className="card-scroll">
        {commissions.map((commission) => {
          const refs = references[commission.id] || []
          const isCollapsed = collapsed[commission.id]

          return (
            <article
              className="card commission-card"
              key={commission.id}
            >
              <div className="row-head">
                <div>
                  <h2>{commission.title}</h2>

                  <p className="muted">
                    for {commission.client_name}
                  </p>
                </div>

                <button
                  type="button"
                  className="icon-button"
                  title="Edit commission"
                  aria-label={`Edit ${commission.title}`}
                  onClick={() =>
                    onEditCommission?.(commission.id)
                  }
                >
                  ⚙
                </button>
              </div>

              <hr className="dotted" />

              <p>
                <strong>Commission Type:</strong>
                <br />
                {commission.commission_type}
              </p>

              <p>
                <strong>Payment Status:</strong>
                <br />
                <span
                  className={`pay pay-${(
                    commission.payment_status || ''
                  ).toLowerCase()}`}
                >
                  {commission.payment_status}
                </span>
              </p>

              {refs.length > 0 && (
                <div className="ref-block">
                  <button
                    type="button"
                    className="ref-toggle"
                    onClick={() =>
                      toggleReferences(commission.id)
                    }
                  >
                    References {isCollapsed ? '▸' : '▾'}
                  </button>

                  {!isCollapsed && (
                    <div className="ref-strip">
                      {refs.map((reference) => (
                        <RefThumb
                          key={reference.id}
                          url={reference.image_url}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              <p className="deadline">
                <strong>
                  Deadline: {formatDate(commission.deadline)}
                </strong>
              </p>
            </article>
          )
        })}

        {/* "+ Create Log" card: the empty state, and a shortcut at the end of the row */}
        <button
          type="button"
          className="card create-card"
          onClick={onCreateCommission}
        >
          <span className="plus">+</span>
          Create Log
        </button>
      </div>
    </main>
  )
}

export default Dashboard
