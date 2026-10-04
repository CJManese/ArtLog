import { useEffect, useState } from 'react'
import {
  getCommissions,
  deleteCommission
} from '../api.js'

function CommissionList({ onEdit }) {
  const [commissions, setCommissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('recent')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')

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
    if (!window.confirm('Delete this commission?')) {
      return
    }

    try {
      await deleteCommission(id)

      setCommissions((current) =>
        current.filter(
          (commission) => commission.id !== id
        )
      )
    } catch (err) {
      setError(err.message)
    }
  }

  const commissionTypes = [
    ...new Set(
      commissions
        .map((commission) => commission.commission_type)
        .filter(Boolean)
    )
  ]

  let filteredCommissions = commissions.filter(
    (commission) => {
      const searchText = search.trim().toLowerCase()

      const matchesSearch =
        !searchText ||
        commission.title
          ?.toLowerCase()
          .includes(searchText) ||
        commission.client_name
          ?.toLowerCase()
          .includes(searchText)

      const matchesType =
        typeFilter === 'all' ||
        commission.commission_type === typeFilter

      const matchesStatus =
        statusFilter === 'all' ||
        commission.status === statusFilter

      const matchesPayment =
        paymentFilter === 'all' ||
        commission.payment_status === paymentFilter

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus &&
        matchesPayment
      )
    }
  )

  filteredCommissions = [...filteredCommissions].sort(
    (a, b) => {
      if (sort === 'title') {
        return a.title.localeCompare(b.title)
      }

      return (
        new Date(b.starting_date || 0) -
        new Date(a.starting_date || 0)
      )
    }
  )

  if (loading) {
    return (
      <main className="page">
        <h1>Commissions</h1>
        <p>Loading commissions...</p>
      </main>
    )
  }

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <h1>Commissions</h1>

          <p className="muted">
            View and manage your commission logs.
          </p>
        </div>
      </div>

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      <section className="filters card">
        <input
          type="search"
          placeholder="Search by title or client"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

        <select
          value={sort}
          onChange={(event) =>
            setSort(event.target.value)
          }
        >
          <option value="recent">
            Sort by: Most Recent
          </option>

          <option value="title">
            Sort by: Title
          </option>
        </select>

        <select
          value={typeFilter}
          onChange={(event) =>
            setTypeFilter(event.target.value)
          }
        >
          <option value="all">
            Type: Show All
          </option>

          {commissionTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
        >
          <option value="all">
            Completion: Show All
          </option>

          <option value="Ongoing">
            Ongoing
          </option>

          <option value="Completed">
            Completed
          </option>

          <option value="Cancelled">
            Cancelled
          </option>
        </select>

        <select
          value={paymentFilter}
          onChange={(event) =>
            setPaymentFilter(event.target.value)
          }
        >
          <option value="all">
            Payment Status: Show All
          </option>

          <option value="Paid">
            Paid
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Overdue">
            Overdue
          </option>
        </select>
      </section>

      {filteredCommissions.length === 0 ? (
        <div className="card">
          <p>No commissions match your filters.</p>
        </div>
      ) : (
        <div className="card-grid">
          {filteredCommissions.map((commission) => (
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
                <strong>Commission Type:</strong>{' '}
                {commission.commission_type}
              </p>

              <p>
                <strong>Payment Status:</strong>{' '}
                {commission.payment_status}
              </p>

              <p>
                <strong>Started:</strong>{' '}
                {commission.starting_date}
              </p>

              <p>
                <strong>Deadline:</strong>{' '}
                {commission.deadline || 'Not specified'}
              </p>

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
                    handleDelete(commission.id)
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
