export async function getByCommissionId(pool, commissionId) {
  const result = await pool.query(
    `
    SELECT *
    FROM commission_references
    WHERE commission_id = $1
    ORDER BY id ASC
    `,
    [commissionId]
  )

  return result.rows
}

export async function create(pool, commissionId, imageUrl) {
  const result = await pool.query(
    `
    INSERT INTO commission_references (
      commission_id,
      image_url
    )
    VALUES ($1, $2)
    RETURNING *
    `,
    [commissionId, imageUrl]
  )

  return result.rows[0]
}

export async function remove(pool, id) {
  const result = await pool.query(
    `
    DELETE FROM commission_references
    WHERE id = $1
    RETURNING id
    `,
    [id]
  )

  return result.rowCount > 0
}
