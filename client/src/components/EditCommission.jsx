import { useEffect, useState } from 'react'
import {
  getCommission,
  getClients,
  updateCommission,
  deleteCommission,
  getReferences,
  createReference,
  deleteReference
} from '../api.js'

function EditCommission({
  commissionId,
  onSaved,
  onCancel
}) {
  const [clients, setClients] = useState([])
  const [references, setReferences] = useState([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [error, setError] = useState('')
  const [referenceError, setReferenceError] = useState('')

  const [referenceUrl, setReferenceUrl] = useState('')

  const [clientId, setClientId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [notes, setNotes] = useState('')
  const [commissionType, setCommissionType] = useState('')
  const [startingDate, setStartingDate] = useState('')
  const [deadline, setDeadline] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('Pending')
  const [status, setStatus] = useState('Ongoing')

  async function load() {
    try {
      setLoading(true)
      setError('')

      const [
        commission,
        clientData,
        referenceData
      ] = await Promise.all([
        getCommission(commissionId),
        getClients(),
        getReferences(commissionId)
      ])

      setClients(clientData)
      setReferences(referenceData)

      setClientId(String(commission.client_id))
      setTitle(commission.title || '')
      setDescription(commission.description || '')
      setNotes(commission.notes || '')
      setCommissionType(
        commission.commission_type || ''
      )
      setStartingDate(
        (commission.starting_date || '').slice(0, 10)
      )
      setDeadline(
        (commission.deadline || '').slice(0, 10)
      )
      setPaymentStatus(
        commission.payment_status || 'Pending'
      )
      setStatus(
        commission.status || 'Ongoing'
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [commissionId])

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')

    if (
      !clientId ||
      !title.trim() ||
      !commissionType.trim()
    ) {
      setError(
        'Client, title, and commission type are required.'
      )

      return
    }

    setSaving(true)

    try {
      await updateCommission(
        commissionId,
        {
          client_id: Number(clientId),
          title: title.trim(),
          description: description.trim(),
          notes: notes.trim(),
          commission_type: commissionType.trim(),
          starting_date: startingDate,
          deadline: deadline || null,
          payment_status: paymentStatus,
          status
        }
      )

      onSaved?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (
      !window.confirm(
        'Delete this commission permanently?'
      )
    ) {
      return
    }

    try {
      setError('')

      await deleteCommission(commissionId)

      onCancel?.()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleAddReference(event) {
    event.preventDefault()

    if (!referenceUrl.trim()) {
      setReferenceError(
        'Enter an image URL first.'
      )

      return
    }

    try {
      setReferenceError('')

      const reference = await createReference(
        commissionId,
        referenceUrl.trim()
      )

      setReferences((current) => [
        ...current,
        reference
      ])

      setReferenceUrl('')
    } catch (err) {
      setReferenceError(err.message)
    }
  }

  async function handleDeleteReference(id) {
    if (
      !window.confirm(
        'Delete this reference?'
      )
    ) {
      return
    }

    try {
      setReferenceError('')

      await deleteReference(id)

      setReferences((current) =>
        current.filter(
          (reference) => reference.id !== id
        )
      )
    } catch (err) {
      setReferenceError(err.message)
    }
  }

  if (loading) {
    return (
      <main className="page">
        <div className="page-header">
          <h1>Edit Commission</h1>
        </div>
        <p>Loading commission...</p>
      </main>
    )
  }

  return (
    <main className="page">
      <div className="page-header">
        <h1>Edit Commission</h1>
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
        <label htmlFor="edit-client">
          Client
        </label>

        <select
          id="edit-client"
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

        <label htmlFor="edit-title">
          Title
        </label>

        <input
          id="edit-title"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
        />

        <label htmlFor="edit-description">
          Description
        </label>

        <textarea
          id="edit-description"
          rows="4"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
        />

        <label htmlFor="edit-notes">
          Notes
        </label>

        <textarea
          id="edit-notes"
          rows="4"
          value={notes}
          onChange={(event) =>
            setNotes(event.target.value)
          }
        />

        <label htmlFor="edit-type">
          Commission Type
        </label>

        <input
          id="edit-type"
          value={commissionType}
          onChange={(event) =>
            setCommissionType(event.target.value)
          }
        />

        <label htmlFor="edit-start">
          Starting Date
        </label>

        <input
          id="edit-start"
          type="date"
          value={startingDate}
          onChange={(event) =>
            setStartingDate(event.target.value)
          }
        />

        <label htmlFor="edit-deadline">
          Deadline
        </label>

        <input
          id="edit-deadline"
          type="date"
          value={deadline}
          onChange={(event) =>
            setDeadline(event.target.value)
          }
        />

        <label htmlFor="edit-payment">
          Payment Status
        </label>

        <select
          id="edit-payment"
          value={paymentStatus}
          onChange={(event) =>
            setPaymentStatus(event.target.value)
          }
        >
          <option>Pending</option>
          <option>Paid</option>
          <option>Overdue</option>
        </select>

        <label htmlFor="edit-status">
          Status
        </label>

        <select
          id="edit-status"
          value={status}
          onChange={(event) =>
            setStatus(event.target.value)
          }
        >
          <option>Ongoing</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>

        <div className="button-row form-actions">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
          >
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

          <button
            type="submit"
            disabled={saving}
          >
            {saving
              ? 'Saving...'
              : 'Save Changes'}
          </button>
        </div>
      </form>

      <section className="card references-section">
        <h2>References</h2>

        {referenceError && (
          <p className="error">
            {referenceError}
          </p>
        )}

        <form
          className="reference-form"
          onSubmit={handleAddReference}
        >
          <input
            type="url"
            value={referenceUrl}
            onChange={(event) =>
              setReferenceUrl(event.target.value)
            }
            placeholder="https://example.com/image.jpg"
          />

          <button type="submit">
            + Add Reference
          </button>
        </form>

        {references.length === 0 ? (
          <p className="muted">
            No references added yet.
          </p>
        ) : (
          <div className="reference-grid">
            {references.map((reference) => (
              <article
                className="reference-card"
                key={reference.id}
              >
                <a
                  href={reference.image_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={reference.image_url}
                    alt="Commission reference"
                  />
                </a>

                <button
                  type="button"
                  className="danger"
                  onClick={() =>
                    handleDeleteReference(
                      reference.id
                    )
                  }
                >
                  Delete Reference
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default EditCommission
