import { useEffect, useState } from 'react'
import {
  getClients,
  createClient,
  updateClient,
  deleteClient
} from '../api.js'

function ClientList() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [editingClient, setEditingClient] = useState(null)
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')
  const [blacklisted, setBlacklisted] = useState(false)

  async function loadClients() {
    try {
      setError('')

      const data = await getClients()

      setClients(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClients()
  }, [])

  function resetForm() {
    setEditingClient(null)
    setName('')
    setNotes('')
    setBlacklisted(false)
  }

  function startCreate() {
    resetForm()
    setEditingClient('new')
    setError('')
  }

  function startEdit(client) {
    setEditingClient(client.id)
    setName(client.name || '')
    setNotes(client.notes || '')
    setBlacklisted(Boolean(client.blacklisted))
    setError('')
  }

  async function handleSave(event) {
    event.preventDefault()

    if (!name.trim()) {
      setError('Client name is required.')
      return
    }

    setSaving(true)
    setError('')

    try {
      const data = {
        name: name.trim(),
        notes: notes.trim(),
        blacklisted
      }

      if (editingClient === 'new') {
        await createClient(data)
      } else {
        await updateClient(editingClient, data)
      }

      resetForm()
      await loadClients()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      'Delete this client? Any commissions belonging to this client will also be deleted.'
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')

      await deleteClient(id)

      await loadClients()
    } catch (err) {
      setError(err.message)
    }
  }

  async function toggleBlacklist(client) {
    try {
      setError('')

      await updateClient(client.id, {
        name: client.name,
        notes: client.notes || '',
        blacklisted: !client.blacklisted
      })

      await loadClients()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <main className="page">
        <h1>Client List</h1>
        <p>Loading clients...</p>
      </main>
    )
  }

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <h1>Client List</h1>
          <p className="muted">
            Keep track of frequent buyers and blacklisted clients.
          </p>
        </div>

        <button
          type="button"
          onClick={startCreate}
        >
          + Add Client
        </button>
      </div>

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      {editingClient !== null && (
        <form
          className="card form-grid"
          onSubmit={handleSave}
        >
          <h2 className="form-title">
            {editingClient === 'new'
              ? 'Add Client'
              : 'Edit Client'}
          </h2>

          <label htmlFor="client-name">
            Name
          </label>

          <input
            id="client-name"
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            required
          />

          <label htmlFor="client-notes">
            Notes
          </label>

          <textarea
            id="client-notes"
            rows="4"
            value={notes}
            onChange={(event) =>
              setNotes(event.target.value)
            }
          />

          <label htmlFor="client-blacklisted">
            Blacklisted
          </label>

          <div>
            <input
              id="client-blacklisted"
              type="checkbox"
              checked={blacklisted}
              onChange={(event) =>
                setBlacklisted(event.target.checked)
              }
            />

            <span className="checkbox-text">
              Do not accept commissions from this client
            </span>
          </div>

          <div className="button-row form-actions">
            <button
              type="button"
              onClick={resetForm}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Client'}
            </button>
          </div>
        </form>
      )}

      {clients.length === 0 ? (
        <div className="card">
          <p>No clients yet.</p>
          <button
            type="button"
            onClick={startCreate}
          >
            Add Your First Client
          </button>
        </div>
      ) : (
        <div className="card-grid">
          {clients.map((client) => (
            <article
              className={`card client-card ${
                client.blacklisted
                  ? 'blacklisted-card'
                  : ''
              }`}
              key={client.id}
            >
              <div className="row-head">
                <div>
                  <h2>{client.name}</h2>

                  {client.blacklisted && (
                    <span className="status status-cancelled">
                      Blacklisted
                    </span>
                  )}
                </div>
              </div>

              <p>
                <strong>Commissions:</strong>{' '}
                {client.commission_count ?? 0}
              </p>

              {client.notes && (
                <p>
                  <strong>Notes:</strong>{' '}
                  {client.notes}
                </p>
              )}

              <div className="button-row">
                <button
                  type="button"
                  onClick={() => startEdit(client)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => toggleBlacklist(client)}
                >
                  {client.blacklisted
                    ? 'Remove Blacklist'
                    : 'Blacklist'}
                </button>

                <button
                  type="button"
                  className="danger"
                  onClick={() =>
                    handleDelete(client.id)
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

export default ClientList
