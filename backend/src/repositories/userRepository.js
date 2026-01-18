const pool = require("../db/db");

const TABLE = 'public."User"';

async function findById(id) {
  const query = `SELECT *
             FROM ${TABLE}
             WHERE id = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
}

async function createIfNotExists({ id, email, name, profilepicturename }) {
  let query;
  let params;

  if (profilepicturename === undefined) {
    query = `INSERT INTO ${TABLE} (id, email, "name")
               VALUES ($1, $2, $3)
               ON CONFLICT (id) DO NOTHING
               RETURNING *`;
    params = [id, email, name];
  } else {
    query = `INSERT INTO ${TABLE} (id, email, "name", profilepicturename)
               VALUES ($1, $2, $3, $4)
               ON CONFLICT (id) DO NOTHING
               RETURNING *`;
    params = [id, email, name, profilepicturename];
  }

  const inserted = await pool.query(query, params);

  if (inserted.rowCount > 0) {
    return { created: true, user: inserted.rows[0] };
  }

  const existing = await findById(id);
  if (existing) return { created: false, user: existing };

  const err = new Error("User could not be created (possible email conflict).");
  err.status = 409;
  throw err;
}

async function updateById(id, name, profilepicturename, isblocked) {
  const sql = `
    UPDATE ${TABLE}
    SET
      name = $2,
      profilepicturename = $3,
      isblocked = COALESCE($4, isblocked)
    WHERE id = $1
    RETURNING *
  `;

  const params = [id, name, profilepicturename, isblocked];
  const { rows } = await pool.query(sql, params);
  return rows[0] ?? null;
}

async function deleteById(id) {
  const { rowCount } = await pool.query(`DELETE FROM ${TABLE} WHERE id = $1`, [
    id,
  ]);

  return rowCount > 0;
}

async function findByBlocked(isBlocked) {
  const { rows } = await pool.query(
    `SELECT *
     FROM ${TABLE}
     WHERE isblocked = $1`,
    [isBlocked],
  );

  return rows;
}

async function updateProfilePictureName(userId, profilepicturename) {
  const { rows } = await pool.query(
    `
    UPDATE ${TABLE}
    SET profilepicturename = $2
    WHERE id = $1
    RETURNING *
    `,
    [userId, profilepicturename],
  );
  return rows[0] ?? null;
}

exports.findByName = async (name) => {
  const { rows } = await pool.query(
    `SELECT *
     FROM ${TABLE}
     WHERE name = $1
     LIMIT 1`,
    [name],
  );
  return rows[0] ?? null;
};

module.exports = {
  findById,
  createIfNotExists,
  updateById,
  deleteById,
  findByBlocked,
  updateProfilePictureName,
};
