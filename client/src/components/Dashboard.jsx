import { useEffect, useState } from 'react'
import { getCommissions } from '../api.js'

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
        <h1>Dashboard</h1>
        <p>Loading commissions...</p>
      </main>
    )
  }

  const ongoing = commissions.filter(
    (commission) => commission.status === 'Ongoing'
  ).length

  const completed = commissions.filter(
    (commission) => commission.status === 'Completed'
  ).length

  const pending = commissions.filter(
    (commission) => commission.payment_status === 'Pending'
  ).length

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
        </div>
      </div>

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      <section className="stats">
        <div className="stat-card">
          <strong>{commissions.length}</strong>
          <span>Total</span>
        </div>

        <div className="stat-card">
          <strong>{ongoing}</strong>
          <span>Ongoing</span>
        </div>

        <div className="stat-card">
          <strong>{completed}</strong>
          <span>Completed</span>
        </div>

        <div className="stat-card">
          <strong>{pending}</strong>
          <span>Payment Pending</span>
        </div>
      </section>

      <h2>Commission Board</h2>

      {commissions.length === 0 ? (
        <div className="card">
          <p>No commissions yet.</p>
        </div>
      ) : (
        <div className="card-grid">
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

              <p>
                <strong>Commission Type:</strong>{' '}
                {commission.commission_type}
              </p>

              <p>
                <strong>Payment Status:</strong>{' '}
                {commission.payment_status}
              </p>

              <p>
                <strong>Started:</strong>{' '}
                {commission.starting_date || 'Not Specified'}
              </p>

              <p>
                <strong>Deadline:</strong>{' '}
                {commission.deadline || 'Not Specified'}
              </p>

              <p>
                <strong>Status:</strong>{' '}
                {commission.status}
              </p>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

export default Dashboard
