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
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClients()
  }, [])

  function startCreate() {
    setEditingClient('new')
    setName('')
    setNotes('')
    setBlacklisted(false)
    setError('')
  }

  function startEdit(client) {
    setEditingClient(client.id)
    setName(client.name)
    setNotes(client.notes || '')
    setBlacklisted(client.blacklisted)
    setError('')
  }

  function cancelEdit() {
    setEditingClient(null)
    setName('')
    setNotes('')
    setBlacklisted(false)
    setError('')
  }

  async function handleSave(event) {
    event.preventDefault()

    if (!name.trim()) {
      setError('Client name is required.')
      return
    }

    try {
      setError('')

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

      cancelEdit()
      await loadClients()
    } catch (error) {
      setError(error.message)
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this client?'
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')
      await deleteClient(id)
      await loadClients()
    } catch (error) {
      setError(error.message)
    }
  }

  if (loading) {
    return (
      <main>
        <h1>Clients</h1>
        <p>Loading clients...</p>
      </main>
    )
  }

  return (
    <main>
      <h1>Clients</h1>

      {error && (
        <p>
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={startCreate}
      >
        Add a Client
      </button>

      {editingClient !== null && (
        <form onSubmit={handleSave}>
          <h2>
            {editingClient === 'new'
              ? 'Add a Client'
              : 'Edit Client'}
          </h2>

          <div>
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
            />
          </div>

          <div>
            <label htmlFor="client-notes">
              Notes
            </label>

            <textarea
              id="client-notes"
              value={notes}
              onChange={(event) =>
                setNotes(event.target.value)
              }
            />
          </div>

          <div>
            <label>
              <input
                type="checkbox"
                checked={blacklisted}
                onChange={(event) =>
                  setBlacklisted(event.target.checked)
                }
              />

              Blacklisted
            </label>
          </div>

          <button
            type="button"
            onClick={cancelEdit}
          >
            Cancel
          </button>

          <button type="submit">
            Save
          </button>
        </form>
      )}

      {clients.length === 0 ? (
        <p>No clients yet.</p>
      ) : (
        <div>
          {clients.map((client) => (
            <article key={client.id}>
              <h2>{client.name}</h2>

              <p>
                ID: {client.id}
              </p>

              <p>
                Commissions made: {client.commission_count}
              </p>

              <p>
                {client.blacklisted
                  ? 'Blacklisted'
                  : 'Not Blacklisted'}
              </p>

              {client.notes && (
                <p>
                  Notes: {client.notes}
                </p>
              )}

              <button
                type="button"
                onClick={() => startEdit(client)}
              >
                Edit Client
              </button>

              <button
                type="button"
                onClick={() =>
                  handleDelete(client.id)
                }
              >
                Delete Client
              </button>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

export default ClientList
