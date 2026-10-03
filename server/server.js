import express from 'express'
import cors from 'cors'
import { pool } from './db/pool.js'
import * as commissions from './sightingsRepo.js'
import * as clients from './clientsRepo.js'
import * as references from './referencesRepo.js'

const app = express()

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(cors({ origin: allowedOrigins }))
app.use(express.json({ limit: '100kb' }))

// ====================
// HEALTH
// ====================

app.get('/healthz', (request, response) => {
  response.json({ ok: true })
})

app.get('/readyz', async (request, response) => {
  try {
    await pool.query('SELECT 1')

    response.json({
      ok: true,
      db: 'up'
    })
  } catch (error) {
    console.error('readyz failed:', error.message)

    response.status(503).json({
      ok: false,
      db: 'down'
    })
  }
})

// ====================
// COMMISSION VALIDATION
// ====================

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

// ====================
// COMMISSIONS
// ====================

app.get('/api/commissions', async (request, response, next) => {
  try {
    response.json(
      await commissions.getAll(pool)
    )
  } catch (error) {
    next(error)
  }
})

app.get('/api/commissions/:id', async (request, response, next) => {
  try {
    const row = await commissions.getById(
      pool,
      request.params.id
    )

    if (!row) {
      return response.status(404).json({
        error: 'Commission not found'
      })
    }

    response.json(row)
  } catch (error) {
    next(error)
  }
})

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
        error: 'Commission not found'
      })
    }

    response.json(row)
  } catch (error) {
    next(error)
  }
})

app.delete('/api/commissions/:id', async (request, response, next) => {
  try {
    const removed = await commissions.remove(
      pool,
      request.params.id
    )

    if (!removed) {
      return response.status(404).json({
        error: 'Commission not found'
      })
    }

    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

// ====================
// COMMISSION REFERENCES
// ====================

app.get(
  '/api/commissions/:id/references',
  async (request, response, next) => {
    try {
      const commission = await commissions.getById(
        pool,
        request.params.id
      )

      if (!commission) {
        return response.status(404).json({
          error: 'Commission not found'
        })
      }

      const rows = await references.getByCommissionId(
        pool,
        request.params.id
      )

      response.json(rows)
    } catch (error) {
      next(error)
    }
  }
)

app.post(
  '/api/commissions/:id/references',
  async (request, response, next) => {
    const imageUrl =
      typeof request.body?.image_url === 'string'
        ? request.body.image_url.trim()
        : ''

    if (!imageUrl) {
      return response.status(400).json({
        error: 'image_url is required'
      })
    }

    try {
      const commission = await commissions.getById(
        pool,
        request.params.id
      )

      if (!commission) {
        return response.status(404).json({
          error: 'Commission not found'
        })
      }

      const row = await references.create(
        pool,
        request.params.id,
        imageUrl
      )

      response.status(201).json(row)
    } catch (error) {
      next(error)
    }
  }
)

app.delete(
  '/api/references/:id',
  async (request, response, next) => {
    try {
      const removed = await references.remove(
        pool,
        request.params.id
      )

      if (!removed) {
        return response.status(404).json({
          error: 'Reference not found'
        })
      }

      response.status(204).end()
    } catch (error) {
      next(error)
    }
  }
)

// ====================
// CLIENTS
// ====================

app.get('/api/clients', async (request, response, next) => {
  try {
    response.json(
      await clients.getAll(pool)
    )
  } catch (error) {
    next(error)
  }
})

app.get('/api/clients/:id', async (request, response, next) => {
  try {
    const row = await clients.getById(
      pool,
      request.params.id
    )

    if (!row) {
      return response.status(404).json({
        error: 'Client not found'
      })
    }

    response.json(row)
  } catch (error) {
    next(error)
  }
})

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
    Boolean(request.body?.blacklisted)

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
    Boolean(request.body?.blacklisted)

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
        error: 'Client not found'
      })
    }

    response.json(row)
  } catch (error) {
    next(error)
  }
})

app.delete('/api/clients/:id', async (request, response, next) => {
  try {
    const removed = await clients.remove(
      pool,
      request.params.id
    )

    if (!removed) {
      return response.status(404).json({
        error: 'Client not found'
      })
    }

    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

// ====================
// 404
// ====================

app.use((request, response) => {
  response.status(404).json({
    error: 'No such route'
  })
})

// ====================
// ERROR HANDLER
// ====================

app.use((error, request, response, next) => {
  console.error(error)

  response.status(500).json({
    error: 'Something went wrong on the server'
  })
})

// ====================
// START SERVER
// ====================

const port = process.env.PORT || 3000

app.listen(port, '0.0.0.0', () => {
  console.log(`API listening on port ${port}`)
  console.log(`CORS allows: ${allowedOrigins.join(', ')}`)
})
