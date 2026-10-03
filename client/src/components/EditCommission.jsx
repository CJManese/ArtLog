import { useEffect, useState } from 'react'
import {
  getCommission,
  getClients,
  updateCommission,
  deleteCommission
} from '../api.js'

function EditCommission({ commissionId, onSaved, onCancel }) {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [clientId, setClientId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [notes, setNotes] = useState('')
  const [commissionType, setCommissionType] = useState('')
  const [startingDate, setStartingDate] = useState('')
  const [deadline, setDeadline] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('Pending')
  const [status, setStatus] = useState('Ongoing')

  useEffect(() => {
    async function load() {
      try {
        const [commission, clientData] = await Promise.all([
          getCommission(commissionId),
          getClients()
        ])

        setClients(clientData)
        setClientId(String(commission.client_id))
        setTitle(commission.title || '')
        setDescription(commission.description || '')
        setNotes(commission.notes || '')
        setCommissionType(commission.commission_type || '')
        setStartingDate(commission.starting_date || '')
        setDeadline(commission.deadline || '')
        setPaymentStatus(commission.payment_status || 'Pending')
        setStatus(commission.status || 'Ongoing')
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [commissionId])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!clientId || !title.trim() || !commissionType.trim()) {
      setError('Client, title, and commission type are required.')
      return
    }

    setSaving(true)

    try {
      await updateCommission(commissionId, {
        client_id: Number(clientId),
        title: title.trim(),
        description: description.trim(),
        notes: notes.trim(),
        commission_type: commissionType.trim(),
        starting_date: startingDate,
        deadline: deadline || null,
        payment_status: paymentStatus,
        status
      })

      onSaved?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm('Delete this commission permanently?')) {
      return
    }

    try {
      await deleteCommission(commissionId)
      onCancel?.()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <main className="page">
        <h1>Edit Commission</h1>
        <p>Loading...</p>
      </main>
    )
  }

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <h1>Edit Commission</h1>
          <p className="muted">Update the commission log.</p>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <form className="card form-grid" onSubmit={handleSubmit}>
        <label htmlFor="edit-client">Client</label>
        <select
          id="edit-client"
          value={clientId}
          onChange={(event) => setClientId(event.target.value)}
        >
          <option value="">Select a client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>

        <label htmlFor="edit-title">Title</label>
        <input
          id="edit-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <label htmlFor="edit-description">Description</label>
        <textarea
          id="edit-description"
          rows="4"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <label htmlFor="edit-notes">Notes</label>
        <textarea
          id="edit-notes"
          rows="4"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />

        <label htmlFor="edit-type">Commission Type</label>
        <input
          id="edit-type"
          value={commissionType}
          onChange={(event) => setCommissionType(event.target.value)}
        />

        <label htmlFor="edit-start">Starting Date</label>
        <input
          id="edit-start"
          type="date"
          value={startingDate}
          onChange={(event) => setStartingDate(event.target.value)}
        />

        <label htmlFor="edit-deadline">Deadline</label>
        <input
          id="edit-deadline"
          type="date"
          value={deadline}
          onChange={(event) => setDeadline(event.target.value)}
        />

        <label htmlFor="edit-payment">Payment Status</label>
        <select
          id="edit-payment"
          value={paymentStatus}
          onChange={(event) => setPaymentStatus(event.target.value)}
        >
          <option>Pending</option>
          <option>Paid</option>
          <option>Overdue</option>
        </select>

        <label htmlFor="edit-status">Status</label>
        <select
          id="edit-status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option>Ongoing</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>

        <div className="button-row">
          <button type="button" onClick={onCancel} disabled={saving}>
            Cancel
          </button>

          <button
            type="button"
            className="danger"
            onClick={handleDelete}
            disabled={saving}
          >
            Delete
          </button>

          <button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </main>
  )
}

export default EditCommission
