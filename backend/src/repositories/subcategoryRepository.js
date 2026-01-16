const pool = require("../db/db");

const TABLE = 'public.subcategory';

exports.findAll = async () => {
  const { rows } = await pool.query(
    `SELECT id, name
     FROM ${TABLE}
     ORDER BY name ASC`
  );
  return rows;
};