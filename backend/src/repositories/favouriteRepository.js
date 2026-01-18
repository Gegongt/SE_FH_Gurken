const pool = require("../db/db");

const TABLE = "public.favourite";

exports.findByUserId = async (userId) => {
  const { rows } = await pool.query(
    `
    SELECT userid, fileid
    FROM ${TABLE}
    WHERE userid = $1
    ORDER BY fileid ASC
    `,
    [userId]
  );
  return rows;
};

exports.exists = async (userId, fileId) => {
  const { rows } = await pool.query(
    `
    SELECT 1
    FROM ${TABLE}
    WHERE userid = $1 AND fileid = $2
    LIMIT 1
    `,
    [userId, fileId]
  );
  return rows.length > 0;
};

exports.insert = async (userId, fileId) => {
  const { rows } = await pool.query(
    `
    INSERT INTO ${TABLE} (userid, fileid)
    VALUES ($1, $2)
    RETURNING *
    `,
    [userId, fileId]
  );
  return rows[0];
};

exports.delete = async (userId, fileId) => {
  const { rowCount } = await pool.query(
    `
    DELETE FROM ${TABLE}
    WHERE userid = $1 AND fileid = $2
    `,
    [userId, fileId]
  );
  return rowCount > 0;
};