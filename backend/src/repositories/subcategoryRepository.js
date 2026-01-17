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

exports.findByCategoryId = async (categoryId) => {
  const { rows } = await pool.query(
    `SELECT id, categoryid AS "categoryId", name
     FROM ${TABLE}
     WHERE categoryid = $1
     ORDER BY name ASC`,
    [categoryId]
  );
  return rows;
};