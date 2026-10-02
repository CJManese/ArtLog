import { useEffect, useState } from 'react'
import {
  getCommissions,
  deleteCommission,
} from '../api.js'

export default function CommissionList({ onEdit }) {
  const [commissions, setCommissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadCommissions() {
    try {
      setLoading(true)
      setError('')

      const data = await getCommissions()
      setCommissions(data)
    } catch (err) {
      setError(err.message || 'Failed to load commissions.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCommissions()
  }, [])

  async function handleDelete(id) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this commission?'
    )

    if (!confirmed) return

    try {
      await deleteCommission(id)
      setCommissions((current) =>
        current.filter((commission) => commission.id !== id)
      )
    } catch (err) {
      setError(err.message || 'Failed to delete commission.')
    }
  }

  if (loading) {
    return <p>Loading commissions...</p>
  }

  return (
    <div>
      <h1>Commission Logs</h1>

      {error && <p>{error}</p>}

      {commissions.length === 0 ? (
        <p>No commissions found.</p>
      ) : (
        <div>
          {commissions.map((commission) => (
            <article key={commission.id}>
              <h2>{commission.title}</h2>

              <p>
                <strong>Client:</strong>{' '}
                {commission.client_name || 'Unknown client'}
              </p>

              <p>
                <strong>Commission Type:</strong>{' '}
                {commission.commission_type || 'Not specified'}
              </p>

              <p>
                <strong>Payment:</strong>{' '}
                {commission.payment_status || 'Pending'}
              </p>

              <p>
                <strong>Status:</strong>{' '}
                {commission.status || 'Ongoing'}
              </p>

              {commission.deadline && (
                <p>
                  <strong>Deadline:</strong> {commission.deadline}
                </p>
              )}

              <button
                type="button"
                onClick={() => onEdit?.(commission.id)}
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => handleDelete(commission.id)}
              >
                Delete
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
