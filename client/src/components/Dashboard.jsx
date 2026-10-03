import { useEffect, useState } from 'react'
import { getCommissions } from '../api.js'

function Dashboard({
  onEditCommission,
  onCreateCommission
}) {
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
    (commission) =>
      commission.status === 'Ongoing'
  ).length

  const completed = commissions.filter(
    (commission) =>
      commission.status === 'Completed'
  ).length

  const pending = commissions.filter(
    (commission) =>
      commission.payment_status === 'Pending'
  ).length

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>

          <p className="muted">
            Keep track of your current art commissions.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateCommission}
        >
          + New Commission
        </button>
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

      <div className="section-heading">
        <h2>Commission Board</h2>
      </div>

      {commissions.length === 0 ? (
        <div className="card">
          <p>No commissions yet.</p>

          <button
            type="button"
            onClick={onCreateCommission}
          >
            Create Your First Commission
          </button>
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
                    {commission.client_name}
                  </p>
                </div>

                <button
                  type="button"
                  className="icon-button"
                  title="Edit commission"
                  onClick={() =>
                    onEditCommission?.(
                      commission.id
                    )
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
                <strong>Deadline:</strong>{' '}
                {commission.deadline ||
                  'Not Specified'}
              </p>

              <p>
                <strong>Status:</strong>{' '}
                <span
                  className={`status status-${commission.status?.toLowerCase()}`}
                >
                  {commission.status}
                </span>
              </p>

              <button
                type="button"
                onClick={() =>
                  onEditCommission?.(
                    commission.id
                  )
                }
              >
                Edit Commission
              </button>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

export default Dashboard
