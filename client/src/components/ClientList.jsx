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

  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)
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

      resetForm()
      setSelectedId(null)
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
        <div className="page-header">
          <h1>Clients</h1>
        </div>
        <p>Loading clients...</p>
      </main>
    )
  }

  const visibleClients = clients.filter((client) =>
    client.name?.toLowerCase().includes(search.trim().toLowerCase())
  )

  const selectedClient = clients.find((c) => c.id === selectedId)

  return (
    <main className="page">
      <div className="page-header">
        <h1>Clients</h1>
      </div>

      {error && <p className="error">{error}</p>}

      {editingClient !== null && (
        <form className="card client-form" onSubmit={handleSave}>
          <h2>
            {editingClient === 'new' ? 'Add Client' : 'Edit Client'}
          </h2>

          <label htmlFor="client-name">Client</label>
          <input
            id="client-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <label htmlFor="client-notes">Notes (Optional)</label>
          <textarea
            id="client-notes"
            rows="6"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />

          <label className="checkbox-row" htmlFor="client-blacklisted">
            <input
              id="client-blacklisted"
              type="checkbox"
              checked={blacklisted}
              onChange={(event) => setBlacklisted(event.target.checked)}
            />
            Do not accept commissions from this client
          </label>

          <div className="form-actions">
            {editingClient !== 'new' && (
              <button
                type="button"
                className="danger"
                onClick={() => handleDelete(editingClient)}
              >
                Delete Client
              </button>
            )}

            <span className="spacer" />

            <button
              type="button"
              className="secondary"
              onClick={resetForm}
              disabled={saving}
            >
              Cancel
            </button>

            <button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      )}

      {editingClient === null && (
        <>
          <section className="filters">
            <input
              type="search"
              className="filter-search"
              placeholder="Search by name"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </section>

          <div className="card table-card">
            <table className="client-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Commissions made</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {visibleClients.length === 0 && (
                  <tr>
                    <td colSpan="4" className="table-empty">
                      No clients yet. Use "Add a Client" to create one.
                    </td>
                  </tr>
                )}

                {visibleClients.map((client, index) => (
                  <tr
                    key={client.id}
                    className={
                      (client.blacklisted ? 'row-bad ' : '') +
                      (selectedId === client.id ? 'row-selected' : '')
                    }
                    onClick={() => setSelectedId(client.id)}
                  >
                    <td>{String(index + 1).padStart(4, '0')}</td>
                    <td>{client.name}</td>
                    <td>{client.commission_count ?? 0}</td>
                    <td>
                      {client.blacklisted ? 'Blacklisted' : 'Active'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="table-actions">
            <button
              type="button"
              className="secondary"
              disabled={!selectedClient}
              onClick={() => selectedClient && startEdit(selectedClient)}
            >
              Edit Client
            </button>

            <button
              type="button"
              className="danger"
              disabled={!selectedClient}
              onClick={() =>
                selectedClient && toggleBlacklist(selectedClient)
              }
            >
              {selectedClient?.blacklisted
                ? 'Remove Blacklist'
                : 'Blacklist a Client'}
            </button>

            <span className="spacer" />

            <button type="button" className="navy" onClick={startCreate}>
              Add a Client +
            </button>
          </div>
        </>
      )}
    </main>
  )
}

export default ClientList
