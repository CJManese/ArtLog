import { useEffect, useState } from 'react'
import {
  getCommissions,
  deleteCommission
} from '../api.js'

// Turns "2026-10-03T00:00:00.000Z" into "10/03/2026"
function formatDate(value) {
  if (!value) {
    return '--/--/----'
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

// "AA 0001" style code, based on the commission id
function makeCode(commission, index) {
  const number = Number(commission.id)
  const value = Number.isFinite(number) ? number : index + 1

  return `AA ${String(value).padStart(4, '0')}`
}

function CommissionList({ onEdit }) {
  const [commissions, setCommissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openId, setOpenId] = useState(null)

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
        current.filter((commission) => commission.id !== id)
      )
    } catch (err) {
      setError(err.message)
    }
  }

  const commissionTypes = [
    ...new Set(
      commissions.map((c) => c.commission_type).filter(Boolean)
    )
  ]

  let filteredCommissions = commissions.filter((commission) => {
    const searchText = search.trim().toLowerCase()

    const matchesSearch =
      !searchText ||
      commission.title?.toLowerCase().includes(searchText) ||
      commission.client_name?.toLowerCase().includes(searchText)

    const matchesType =
      typeFilter === 'all' ||
      commission.commission_type === typeFilter

    const matchesStatus =
      statusFilter === 'all' || commission.status === statusFilter

    const matchesPayment =
      paymentFilter === 'all' ||
      commission.payment_status === paymentFilter

    return (
      matchesSearch && matchesType && matchesStatus && matchesPayment
    )
  })

  filteredCommissions = [...filteredCommissions].sort((a, b) => {
    if (sort === 'title') {
      return a.title.localeCompare(b.title)
    }

    return (
      new Date(b.starting_date || 0) - new Date(a.starting_date || 0)
    )
  })

  if (loading) {
    return (
      <main className="page">
        <div className="page-header">
          <h1>Commission Board</h1>
        </div>
        <p>Loading commissions...</p>
      </main>
    )
  }

  return (
    <main className="page">
      <div className="page-header">
        <h1>Commission Board</h1>
      </div>

      {error && <p className="error">{error}</p>}

      <section className="filters">
        <input
          type="search"
          className="filter-search"
          placeholder="Search by title or client"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
        >
          <option value="recent">Sort by: Most Recent</option>
          <option value="title">Sort by: Title</option>
        </select>

        <select
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value)}
        >
          <option value="all">Type: Show All</option>
          {commissionTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="all">Completion: Show All</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <select
          value={paymentFilter}
          onChange={(event) => setPaymentFilter(event.target.value)}
        >
          <option value="all">Payment Status: Show All</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Overdue">Overdue</option>
        </select>
      </section>

      {filteredCommissions.length === 0 ? (
        <div className="card">
          <p>No commissions match your filters.</p>
        </div>
      ) : (
        <div className="board">
          {filteredCommissions.map((commission, index) => {
            const isOpen = openId === commission.id

            return (
              <article
                className="card board-card"
                key={commission.id}
              >
                <div className="board-head">
                  <h2>
                    <span className="board-code">
                      {makeCode(commission, index)}
                    </span>
                    <span className="board-bar">|</span>
                    {commission.title}
                  </h2>

                  <button
                    type="button"
                    className="icon-button"
                    title="Edit commission"
                    aria-label={`Edit ${commission.title}`}
                    onClick={() => onEdit?.(commission.id)}
                  >
                    ⚙
                  </button>
                </div>

                <div className="board-grid">
                  <div className="board-col">
                    <p>
                      <strong>Client</strong>
                      <span>: {commission.client_name}</span>
                    </p>
                    <p>
                      <strong>Commission Type</strong>
                      <span>: {commission.commission_type}</span>
                    </p>
                    <p>
                      <strong>Payment Status</strong>
                      <span>: {commission.payment_status}</span>
                    </p>
                  </div>

                  <div className="board-col">
                    <p>
                      <strong>Started on</strong>
                      <span>: {formatDate(commission.starting_date)}</span>
                    </p>
                    <p>
                      <strong>Deadline</strong>
                      <span>: {formatDate(commission.deadline)}</span>
                    </p>
                    <p>
                      <strong>Completion</strong>
                      <span>: {commission.status}</span>
                    </p>
                  </div>
                </div>

                {isOpen && (
                  <div className="board-more">
                    <h3>Description:</h3>
                    <div className="note-box">
                      {commission.description || 'No description.'}
                    </div>

                    <h3>Notes</h3>
                    <div className="note-box">
                      {commission.notes || 'No notes.'}
                    </div>

                    <div className="button-row">
                      <button
                        type="button"
                        className="danger"
                        onClick={() => handleDelete(commission.id)}
                      >
                        Delete Commission
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  className="expand"
                  onClick={() => setOpenId(isOpen ? null : commission.id)}
                >
                  {isOpen ? 'Compress ▴' : 'Expand ▾'}
                </button>
              </article>
            )
          })}
        </div>
      )}
    </main>
  )
}

export default CommissionList
