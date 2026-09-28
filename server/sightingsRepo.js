export async function getAll(pool) {
  const result = await pool.query(`
    SELECT
      commissions.*,
      clients.name AS client_name
    FROM commissions
    JOIN clients ON commissions.client_id = clients.id
    ORDER BY commissions.starting_date DESC
  `)

  return result.rows
}

export async function getById(pool, id) {
  const result = await pool.query(
    `
    SELECT
      commissions.*,
      clients.name AS client_name
    FROM commissions
    JOIN clients ON commissions.client_id = clients.id
    WHERE commissions.id = $1
    `,
    [id]
  )

  return result.rows[0] ?? null
}

export async function create(pool, {
  client_id,
  title,
  description,
  notes,
  commission_type,
  starting_date,
  deadline,
  payment_status,
  status
}) {
  const result = await pool.query(
    `
    INSERT INTO commissions (
      client_id,
      title,
      description,
      notes,
      commission_type,
      starting_date,
      deadline,
      payment_status,
      status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
    `,
    [
      client_id,
      title,
      description ?? null,
      notes ?? null,
      commission_type,
      starting_date,
      deadline ?? null,
      payment_status ?? 'Pending',
      status ?? 'Ongoing'
    ]
  )

  return result.rows[0]
}

export async function update(pool, id, {
  client_id,
  title,
  description,
  notes,
  commission_type,
  starting_date,
  deadline,
  payment_status,
  status
}) {
  const result = await pool.query(
    `
    UPDATE commissions
    SET
      client_id = $1,
      title = $2,
      description = $3,
      notes = $4,
      commission_type = $5,
      starting_date = $6,
      deadline = $7,
      payment_status = $8,
      status = $9
    WHERE id = $10
    RETURNING *
    `,
    [
      client_id,
      title,
      description ?? null,
      notes ?? null,
      commission_type,
      starting_date,
      deadline ?? null,
      payment_status,
      status,
      id
    ]
  )

  return result.rows[0] ?? null
}

export async function remove(pool, id) {
  const result = await pool.query(
    'DELETE FROM commissions WHERE id = $1 RETURNING id',
    [id]
  )

  return result.rowCount > 0
}
