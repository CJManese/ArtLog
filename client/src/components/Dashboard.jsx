import { useEffect, useState } from 'react'
import { getCommissions } from '../api.js'

function Dashboard({ onEditCommission }) {
  const [commissions, setCommissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadCommissions() {
      try {
        const data = await getCommissions()
        setCommissions(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadCommissions()
  }, [])

  if (loading) {
    return (
      <main>
        <h1>Dashboard</h1>
        <p>Loading commissions...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main>
        <h1>Dashboard</h1>
        <p>Error: {error}</p>
      </main>
    )
  }

  return (
    <main>
      <h1>Dashboard</h1>

      {commissions.length === 0 ? (
        <p>No commissions yet.</p>
      ) : (
        <div>
          {commissions.map((commission) => (
            <article key={commission.id}>
              <h2>{commission.title}</h2>

              <p>
                for {commission.client_name}
              </p>

              <p>
                Commission Type: {commission.commission_type}
              </p>

              <p>
                Payment Status: {commission.payment_status}
              </p>

              <p>
                Deadline:{' '}
                {commission.deadline || 'Not Specified'}
              </p>

              <p>
                References
              </p>

              <button
                type="button"
                onClick={() => onEditCommission?.(commission.id)}
              >
                ⚙
              </button>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

export default Dashboard
