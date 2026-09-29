export async function getAll(pool) {
  const result = await pool.query(`
    SELECT
      clients.*,
      COUNT(commissions.id)::INTEGER AS commission_count
    FROM clients
    LEFT JOIN commissions
      ON commissions.client_id = clients.id
    GROUP BY clients.id
    ORDER BY clients.name ASC
  `)

  return result.rows
}

export async function getById(pool, id) {
  const result = await pool.query(
    `
    SELECT *
    FROM clients
    WHERE id = $1
    `,
    [id]
  )

  return result.rows[0] ?? null
}

export async function create(pool, { name, notes, blacklisted }) {
  const result = await pool.query(
    `
    INSERT INTO clients (
      name,
      notes,
      blacklisted
    )
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [
      name,
      notes ?? null,
      blacklisted ?? false
    ]
  )

  return result.rows[0]
}

export async function update(pool, id, {
  name,
  notes,
  blacklisted
}) {
  const result = await pool.query(
    `
    UPDATE clients
    SET
      name = $1,
      notes = $2,
      blacklisted = $3
    WHERE id = $4
    RETURNING *
    `,
    [
      name,
      notes ?? null,
      blacklisted ?? false,
      id
    ]
  )

  return result.rows[0] ?? null
}

export async function remove(pool, id) {
  const result = await pool.query(
    'DELETE FROM clients WHERE id = $1 RETURNING id',
    [id]
  )

  return result.rowCount > 0
}
