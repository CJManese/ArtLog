import express from 'express'
import cors from 'cors'
import { pool } from './db/pool.js'
import * as commissions from './sightingsRepo.js'
import * as clients from './clientsRepo.js'

const app = express()

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(cors({ origin: allowedOrigins }))
app.use(express.json({ limit: '100kb' }))

// Health check
app.get('/healthz', (request, response) => {
  response.json({ ok: true })
})

// Database check
app.get('/readyz', async (request, response) => {
  try {
    await pool.query('SELECT 1')
    response.json({ ok: true, db: 'up' })
  } catch (error) {
    console.error('readyz failed:', error.message)
    response.status(503).json({ ok: false, db: 'down' })
  }
})

// --------------------
// COMMISSION VALIDATION
// --------------------

function validateCommission(body) {
  const errors = []

  const client_id = Number(body.client_id)

  const title =
    typeof body.title === 'string'
      ? body.title.trim()
      : ''

  const description =
    typeof body.description === 'string'
      ? body.description.trim()
      : ''

  const notes =
    typeof body.notes === 'string'
      ? body.notes.trim()
      : ''

  const commission_type =
    typeof body.commission_type === 'string'
      ? body.commission_type.trim()
      : ''

  const starting_date =
    typeof body.starting_date === 'string'
      ? body.starting_date
      : ''

  const deadline =
    typeof body.deadline === 'string' && body.deadline
      ? body.deadline
      : null

  const payment_status =
    typeof body.payment_status === 'string'
      ? body.payment_status.trim()
      : 'Pending'

  const status =
    typeof body.status === 'string'
      ? body.status.trim()
      : 'Ongoing'

  if (!Number.isInteger(client_id) || client_id < 1) {
    errors.push('client_id must be a valid client ID')
  }

  if (!title) {
    errors.push('title is required')
  }

  if (title.length > 200) {
    errors.push('title must be 200 characters or fewer')
  }

  if (!commission_type) {
    errors.push('commission_type is required')
  }

  if (!starting_date) {
    errors.push('starting_date is required')
  }

  if (!['Pending', 'Paid', 'Overdue'].includes(payment_status)) {
    errors.push(
      'payment_status must be Pending, Paid, or Overdue'
    )
  }

  if (!['Ongoing', 'Completed', 'Cancelled'].includes(status)) {
    errors.push(
      'status must be Ongoing, Completed, or Cancelled'
    )
  }

  return {
    errors,
    value: {
      client_id,
      title,
      description,
      notes,
      commission_type,
      starting_date,
      deadline,
      payment_status,
      status
    }
  }
}

// --------------------
// COMMISSION ROUTES
// --------------------

// GET all commissions
app.get('/api/commissions', async (request, response, next) => {
  try {
    response.json(
      await commissions.getAll(pool)
    )
  } catch (error) {
    next(error)
  }
})

// GET one commission
app.get('/api/commissions/:id', async (request, response, next) => {
  try {
    const row = await commissions.getById(
      pool,
      request.params.id
    )

    if (!row) {
      return response.status(404).json({
        error: 'Not found'
      })
    }

    response.json(row)
  } catch (error) {
    next(error)
  }
})

// CREATE commission
app.post('/api/commissions', async (request, response, next) => {
  const { errors, value } = validateCommission(
    request.body ?? {}
  )

  if (errors.length > 0) {
    return response.status(400).json({
      error: errors.join('; ')
    })
  }

  try {
    const row = await commissions.create(
      pool,
      value
    )

    response.status(201).json(row)
  } catch (error) {
    next(error)
  }
})

// UPDATE commission
app.put('/api/commissions/:id', async (request, response, next) => {
  const { errors, value } = validateCommission(
    request.body ?? {}
  )

  if (errors.length > 0) {
    return response.status(400).json({
      error: errors.join('; ')
    })
  }

  try {
    const row = await commissions.update(
      pool,
      request.params.id,
      value
    )

    if (!row) {
      return response.status(404).json({
        error: 'Not found'
      })
    }

    response.json(row)
  } catch (error) {
    next(error)
  }
})

// DELETE commission
app.delete('/api/commissions/:id', async (request, response, next) => {
  try {
    const removed = await commissions.remove(
      pool,
      request.params.id
    )

    if (!removed) {
      return response.status(404).json({
        error: 'Not found'
      })
    }

    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

// --------------------
// CLIENT ROUTES
// --------------------

// GET all clients
app.get('/api/clients', async (request, response, next) => {
  try {
    response.json(
      await clients.getAll(pool)
    )
  } catch (error) {
    next(error)
  }
})

// GET one client
app.get('/api/clients/:id', async (request, response, next) => {
  try {
    const row = await clients.getById(
      pool,
      request.params.id
    )

    if (!row) {
      return response.status(404).json({
        error: 'Not found'
      })
    }

    response.json(row)
  } catch (error) {
    next(error)
  }
})

// CREATE client
app.post('/api/clients', async (request, response, next) => {
  const name =
    typeof request.body?.name === 'string'
      ? request.body.name.trim()
      : ''

  const notes =
    typeof request.body?.notes === 'string'
      ? request.body.notes.trim()
      : ''

  const blacklisted =
    request.body?.blacklisted ?? false

  if (!name) {
    return response.status(400).json({
      error: 'name is required'
    })
  }

  try {
    const row = await clients.create(
      pool,
      {
        name,
        notes,
        blacklisted
      }
    )

    response.status(201).json(row)
  } catch (error) {
    next(error)
  }
})

// UPDATE client
app.put('/api/clients/:id', async (request, response, next) => {
  const name =
    typeof request.body?.name === 'string'
      ? request.body.name.trim()
      : ''

  const notes =
    typeof request.body?.notes === 'string'
      ? request.body.notes.trim()
      : ''

  const blacklisted =
    request.body?.blacklisted ?? false

  if (!name) {
    return response.status(400).json({
      error: 'name is required'
    })
  }

  try {
    const row = await clients.update(
      pool,
      request.params.id,
      {
        name,
        notes,
        blacklisted
      }
    )

    if (!row) {
      return response.status(404).json({
        error: 'Not found'
      })
    }

    response.json(row)
  } catch (error) {
    next(error)
  }
})

// DELETE client
app.delete('/api/clients/:id', async (request, response, next) => {
  try {
    const removed = await clients.remove(
      pool,
      request.params.id
    )

    if (!removed) {
      return response.status(404).json({
        error: 'Not found'
      })
    }

    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

// --------------------
// 404 HANDLER
// --------------------

app.use((request, response) => {
  response.status(404).json({
    error: 'No such route'
  })
})

// --------------------
// ERROR HANDLER
// --------------------

app.use((error, request, response, next) => {
  console.error(error)

  response.status(500).json({
    error: 'Something went wrong on the server'
  })
})

// --------------------
// START SERVER
// --------------------

const port = process.env.PORT || 3000

app.listen(port, '0.0.0.0', () => {
  console.log(`API listening on port ${port}`)
  console.log(`CORS allows: ${allowedOrigins.join(', ')}`)
})
