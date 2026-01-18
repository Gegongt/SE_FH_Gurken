const pool = require("../db/db");

const TABLE = "public.rating";

exports.insert = async (userId, fileId, ratingEnum) => {
  const { rows } = await pool.query(
    `
    INSERT INTO ${TABLE} (userid, fileid, rating)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [userId, fileId, ratingEnum]
  );

  return rows[0] ?? null;
};


exports.findByFileId = async (fileId) => {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM ${TABLE}
    WHERE fileid = $1
    ORDER BY id DESC
    `,
    [fileId]
  );
  return rows;
};

exports.findById = async (ratingId) => {
  const { rows } = await pool.query(
    `SELECT * FROM ${TABLE} WHERE id = $1`,
    [ratingId]
  );
  return rows[0] ?? null;
};

exports.updateById = async (ratingId, ratingEnum) => {
  const { rows } = await pool.query(
    `
    UPDATE ${TABLE}
    SET rating = $2
    WHERE id = $1
    RETURNING *
    `,
    [ratingId, ratingEnum]
  );
  return rows[0] ?? null;
};

exports.deleteById = async (ratingId) => {
  const { rowCount } = await pool.query(
    `DELETE FROM ${TABLE} WHERE id = $1`,
    [ratingId]
  );
  return rowCount > 0;
};