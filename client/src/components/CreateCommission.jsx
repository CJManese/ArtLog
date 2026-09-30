import { useEffect, useState } from 'react'
import {
  getClients,
  createClient,
  createCommission
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

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadClients() {
      try {
        const data = await getClients()
        setClients(data)
      } catch (error) {
        setError(error.message)
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

    setSaving(true)

    try {
      let finalClientId = clientId

      // Create a new client first if needed
      if (useNewClient) {
        const newClient = await createClient({
          name: newClientName.trim(),
          notes: '',
          blacklisted: false
        })

        finalClientId = newClient.id
      }

      // Create the commission
      await createCommission({
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

      if (onSaved) {
        onSaved()
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <main>Loading clients...</main>
  }

  return (
    <main>
      <h1>Make Commission</h1>

      {error && (
        <p>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
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
          <div>
            <label htmlFor="client">
              Client
            </label>

            <select
              id="client"
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
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label htmlFor="new-client">
              New Client Name
            </label>

            <input
              id="new-client"
              type="text"
              value={newClientName}
              onChange={(event) =>
                setNewClientName(event.target.value)
              }
            />
          </div>
        )}

        <div>
          <label htmlFor="title">
            Title
          </label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
          />
        </div>

        <div>
          <label htmlFor="description">
            Description
          </label>

          <textarea
            id="description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
          />
        </div>

        <div>
          <label htmlFor="notes">
            Notes
          </label>

          <textarea
            id="notes"
            value={notes}
            onChange={(event) =>
              setNotes(event.target.value)
            }
          />
        </div>

        <div>
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
          />
        </div>

        <div>
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
        </div>

        <div>
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
        </div>

        <div>
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
            <option value="Pending">
              Pending
            </option>

            <option value="Paid">
              Paid
            </option>

            <option value="Overdue">
              Overdue
            </option>
          </select>
        </div>

        <div>
          <label htmlFor="status">
            Status
          </label>

          <select
            id="status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
          >
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
        </div>

        <div>
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
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </main>
  )
}

export default CreateCommission
