const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  'https://artlog-zk7a.onrender.com'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}/api${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))

    throw new Error(
      error.error || `Request failed with status ${response.status}`
    )
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

// ====================
// COMMISSIONS
// ====================

export async function getCommissions() {
  return request('/commissions')
}

export async function getCommission(id) {
  return request(`/commissions/${id}`)
}

export async function createCommission(data) {
  return request('/commissions', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateCommission(id, data) {
  return request(`/commissions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteCommission(id) {
  return request(`/commissions/${id}`, {
    method: 'DELETE',
  })
}

// ====================
// CLIENTS
// ====================

export async function getClients() {
  return request('/clients')
}

export async function getClient(id) {
  return request(`/clients/${id}`)
}

export async function createClient(data) {
  return request('/clients', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateClient(id, data) {
  return request(`/clients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteClient(id) {
  return request(`/clients/${id}`, {
    method: 'DELETE',
  })
}
