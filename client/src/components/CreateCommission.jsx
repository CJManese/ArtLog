import { useEffect, useState } from 'react'
import {
  getClients,
  createClient,
  createCommission,
  createReference
} from '../api.js'

function CreateCommission({ onSaved, onCancel }) {
  const [clients, setClients] = useState([])

  const [clientName, setClientName] = useState('')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [notes, setNotes] = useState('')
  const [commissionType, setCommissionType] = useState('')

  const [startingDate, setStartingDate] = useState(
    new Date().toISOString().split('T')[0]
  )

  const [deadline, setDeadline] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('Pending')

  const [referenceUrl, setReferenceUrl] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadClients() {
      try {
        const data = await getClients()

        setClients(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadClients()
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')

    const typedName = clientName.trim()

    if (!typedName) {
      setError('Please enter or select a client.')
      return
    }

    if (!title.trim()) {
      setError('Please enter a title.')
      return
    }

    if (!commissionType.trim()) {
      setError('Please enter a commission type.')
      return
    }

    if (!startingDate) {
      setError('Please select a start date.')
      return
    }

    setSaving(true)

    try {
      // If the typed name matches an existing client, use it.
      // Otherwise create a new client with that name.
      const existing = clients.find(
        (client) =>
          client.name.toLowerCase() === typedName.toLowerCase()
      )

      let finalClientId

      if (existing) {
        finalClientId = existing.id
      } else {
        const newClient = await createClient({
          name: typedName,
          notes: '',
          blacklisted: false
        })

        finalClientId = newClient.id
      }

      const commission = await createCommission({
        client_id: Number(finalClientId),
        title: title.trim(),
        description: description.trim(),
        notes: notes.trim(),
        commission_type: commissionType.trim(),
        starting_date: startingDate,
        deadline: deadline || null,
        payment_status: paymentStatus,
        status: 'Ongoing'
      })

      if (referenceUrl.trim()) {
        await createReference(commission.id, referenceUrl.trim())
      }

      onSaved?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="page">
        <p>Loading clients...</p>
      </main>
    )
  }

  return (
    <main className="page">
      {error && <p className="error">{error}</p>}

      <form className="card log-form" onSubmit={handleSubmit}>
        <div className="log-head">
          <h2>
            <span className="log-navy">Commission</span> Log
          </h2>

          <select
            aria-label="Payment status"
            value={paymentStatus}
            onChange={(event) => setPaymentStatus(event.target.value)}
          >
            <option value="Pending">Payment Status: Pending</option>
            <option value="Paid">Payment Status: Paid</option>
            <option value="Overdue">Payment Status: Overdue</option>
          </select>
        </div>

        <div className="log-row2">
          <div>
            <label htmlFor="commission-title">Title</label>
            <input
              id="commission-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter the title of your commission"
              required
            />
          </div>

          <div>
            <label htmlFor="commission-client">Commissioned by</label>
            <input
              id="commission-client"
              type="text"
              list="client-options"
              value={clientName}
              onChange={(event) => setClientName(event.target.value)}
              placeholder="Enter the client, or select from the Clients list"
              required
            />
            <datalist id="client-options">
              {clients.map((client) => (
                <option key={client.id} value={client.name} />
              ))}
            </datalist>
          </div>
        </div>

        <div>
          <label htmlFor="commission-description">
            Description (Optional)
          </label>
          <textarea
            id="commission-description"
            rows="3"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe the commission in 300 words or less"
          />
        </div>

        <div>
          <label htmlFor="commission-notes">Notes (Optional)</label>
          <textarea
            id="commission-notes"
            rows="3"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Add notes or preferences in 300 words or less"
          />
        </div>

        <div className="log-row3">
          <div>
            <label htmlFor="commission-type">Commission Type</label>
            <input
              id="commission-type"
              type="text"
              value={commissionType}
              onChange={(event) => setCommissionType(event.target.value)}
              placeholder="Enter Commission Type"
              required
            />
          </div>

          <div>
            <label htmlFor="starting-date">Started in</label>
            <input
              id="starting-date"
              type="date"
              value={startingDate}
              onChange={(event) => setStartingDate(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="deadline">Deadline (Optional)</label>
            <input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(event) => setDeadline(event.target.value)}
            />
          </div>
        </div>

        <div className="log-bottom">
          <div>
            <label htmlFor="reference-url">References (Optional)</label>

            <div className="ref-box">
              <span className="ref-plus">+</span>

              <input
                id="reference-url"
                type="url"
                value={referenceUrl}
                onChange={(event) => setReferenceUrl(event.target.value)}
                placeholder="Paste an image link, https://..."
              />
            </div>
          </div>

          <div className="log-buttons">
            <button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>

            <button
              type="button"
              className="link-button"
              onClick={onCancel}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </main>
  )
}

export default CreateCommission
