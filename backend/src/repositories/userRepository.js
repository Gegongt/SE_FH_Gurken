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

module.exports = { findById, createIfNotExists };