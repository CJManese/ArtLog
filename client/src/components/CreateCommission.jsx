import { useEffect, useState } from 'react'
import {
  getClients,
  createClient,
  createCommission,
  createReference
} from '../api.js'

function CreateCommission({ onSaved, onCancel }) {
  const [clients, setClients] = useState([])

  const [clientId, setClientId] = useState('')
  const [newClientName, setNewClientName] = useState('')
  const [useNewClient, setUseNewClient] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [notes, setNotes] = useState('')
  const [commissionType, setCommissionType] = useState('')

  const [startingDate, setStartingDate] = useState(
    new Date().toISOString().split('T')[0]
  )

  const [deadline, setDeadline] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('Pending')
  const [status, setStatus] = useState('Ongoing')

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

    if (!useNewClient && !clientId) {
      setError('Please select a client.')
      return
    }

    if (useNewClient && !newClientName.trim()) {
      setError('Please enter the new client name.')
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
      setError('Please select a starting date.')
      return
    }

    setSaving(true)

    try {
      let finalClientId = clientId

      if (useNewClient) {
        const newClient = await createClient({
          name: newClientName.trim(),
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
        status
      })

      if (referenceUrl.trim()) {
        await createReference(
          commission.id,
          referenceUrl.trim()
        )
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
        <h1>Create Log</h1>
        <p>Loading clients...</p>
      </main>
    )
  }

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <h1>Make Commission</h1>

          <p className="muted">
            Create a new commission log.
          </p>
        </div>
      </div>

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      <form
        className="card form-grid"
        onSubmit={handleSubmit}
      >
        <label>Client</label>

        <div className="client-choice">
          <div className="radio-row">
            <label>
              <input
                type="radio"
                checked={!useNewClient}
                onChange={() => setUseNewClient(false)}
              />
              Existing Client
            </label>

            <label>
              <input
                type="radio"
                checked={useNewClient}
                onChange={() => setUseNewClient(true)}
              />
              New Client
            </label>
          </div>

          {!useNewClient ? (
            <select
              value={clientId}
              onChange={(event) =>
                setClientId(event.target.value)
              }
            >
              <option value="">
                Select a client
              </option>

              {clients.map((client) => (
                <option
                  key={client.id}
                  value={client.id}
                >
                  {client.name}
                  {client.blacklisted
                    ? ' — BLACKLISTED'
                    : ''}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={newClientName}
              onChange={(event) =>
                setNewClientName(event.target.value)
              }
              placeholder="Client name"
            />
          )}
        </div>

        <label htmlFor="commission-title">
          Title
        </label>

        <input
          id="commission-title"
          type="text"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          placeholder="Commission title"
          required
        />

        <label htmlFor="commission-description">
          Description
        </label>

        <textarea
          id="commission-description"
          rows="4"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          placeholder="Optional description"
        />

        <label htmlFor="commission-notes">
          Notes
        </label>

        <textarea
          id="commission-notes"
          rows="4"
          value={notes}
          onChange={(event) =>
            setNotes(event.target.value)
          }
          placeholder="Optional notes"
        />

        <label htmlFor="commission-type">
          Commission Type
        </label>

        <input
          id="commission-type"
          type="text"
          value={commissionType}
          onChange={(event) =>
            setCommissionType(event.target.value)
          }
          placeholder="Portrait, illustration, etc."
          required
        />

        <label htmlFor="starting-date">
          Starting Date
        </label>

        <input
          id="starting-date"
          type="date"
          value={startingDate}
          onChange={(event) =>
            setStartingDate(event.target.value)
          }
        />

        <label htmlFor="deadline">
          Deadline
        </label>

        <input
          id="deadline"
          type="date"
          value={deadline}
          onChange={(event) =>
            setDeadline(event.target.value)
          }
        />

        <label htmlFor="payment-status">
          Payment Status
        </label>

        <select
          id="payment-status"
          value={paymentStatus}
          onChange={(event) =>
            setPaymentStatus(event.target.value)
          }
        >
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="Overdue">Overdue</option>
        </select>

        <label htmlFor="commission-status">
          Status
        </label>

        <select
          id="commission-status"
          value={status}
          onChange={(event) =>
            setStatus(event.target.value)
          }
        >
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <label htmlFor="reference-url">
          Reference
        </label>

        <div>
          <input
            id="reference-url"
            type="url"
            value={referenceUrl}
            onChange={(event) =>
              setReferenceUrl(event.target.value)
            }
            placeholder="https://example.com/reference-image.jpg"
          />

          <p className="field-help">
            Optional image URL for the commission reference.
          </p>
        </div>

        <div className="button-row form-actions">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Commission'}
          </button>
        </div>
      </form>
    </main>
  )
}

export default CreateCommission
