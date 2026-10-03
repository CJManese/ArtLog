import { useEffect, useState } from 'react'
import {
  getCommissions,
  deleteCommission
} from '../api.js'

function CommissionList({ onEdit }) {
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

  async function handleDelete(id) {
    if (
      !window.confirm(
        'Delete this commission permanently?'
      )
    ) {
      return
    }

    try {
      setError('')

      await deleteCommission(id)

      setCommissions((current) =>
        current.filter(
          (commission) =>
            commission.id !== id
        )
      )
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <main className="page">
        <h1>Commission Logs</h1>
        <p>Loading commissions...</p>
      </main>
    )
  }

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <h1>Commission Logs</h1>

          <p className="muted">
            View and manage all commissions.
          </p>
        </div>
      </div>

      {error && (
        <p className="error">
          {error}
        </p>
      )}

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
                    Client: {commission.client_name}
                  </p>
                </div>

                <span
                  className={`status status-${commission.status?.toLowerCase()}`}
                >
                  {commission.status}
                </span>
              </div>

              <p>
                <strong>Type:</strong>{' '}
                {commission.commission_type}
              </p>

              <p>
                <strong>Payment:</strong>{' '}
                {commission.payment_status}
              </p>

              <p>
                <strong>Started:</strong>{' '}
                {commission.starting_date}
              </p>

              <p>
                <strong>Deadline:</strong>{' '}
                {commission.deadline ||
                  'Not specified'}
              </p>

              {commission.description && (
                <p>
                  <strong>Description:</strong>{' '}
                  {commission.description}
                </p>
              )}

              <div className="button-row">
                <button
                  type="button"
                  onClick={() =>
                    onEdit?.(commission.id)
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="danger"
                  onClick={() =>
                    handleDelete(
                      commission.id
                    )
                  }
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

export default CommissionList
