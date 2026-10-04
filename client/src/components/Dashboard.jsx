import { useEffect, useState } from 'react'
import { getCommissions } from '../api.js'

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

function Dashboard({ onEditCommission, onCreateCommission }) {
  const [commissions, setCommissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadCommissions() {
    try {
      setError('')

      const data = await getCommissions()

      setCommissions(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCommissions()
  }, [])

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
        {commissions.map((commission) => (
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

            <p className="deadline">
              <strong>
                Deadline: {formatDate(commission.deadline)}
              </strong>
            </p>
          </article>
        ))}

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
