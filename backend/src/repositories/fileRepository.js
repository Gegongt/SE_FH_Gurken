const pool = require("../db/db");

const TABLE = "public.file";

exports.insert = async (subcategoryId, name, uploaderId) => {
  const { rows } = await pool.query(
    `
    INSERT INTO ${TABLE} (subcategoryid, "name", uploaderid, isreported)
    VALUES ($1, $2, $3, false)
    RETURNING *
    `,
    [subcategoryId, name, uploaderId]
  );

  return rows[0] ?? null;
};

exports.findAll = async () => {
  const { rows } = await pool.query(`
    SELECT
      f.id,
      f.subcategoryid,
      f."name",
      f.isreported,
      u.id AS "uid",
      u.email,
      u.name AS "uname",
      u.isadmin,
      u.isblocked,
      u.profilepicturename
    FROM ${TABLE} f
    JOIN public."User" u ON u.id = f.uploaderid
    ORDER BY f.id DESC`);
  return rows;
};

exports.findBySubcategoryId = async (subcategoryId) => {
  const { rows } = await pool.query(
    `SELECT
      f.id,
      f.subcategoryid,
      f."name",
      f.isreported,
      u.id AS "uid",
      u.email,
      u.name AS "uname",
      u.isadmin,
      u.isblocked,
      u.profilepicturename
    FROM ${TABLE} f
    JOIN public."User" u ON u.id = f.uploaderid
    WHERE f.subcategoryid = $1 ORDER BY f.id DESC`,
    [subcategoryId]
  );
  return rows;
};

exports.findByReported = async (reported) => {
  const { rows } = await pool.query(
    `SELECT
      f.id,
      f.subcategoryid,
      f."name",
      f.isreported,
      u.id AS "uid",
      u.email,
      u.name AS "uname",
      u.isadmin,
      u.isblocked,
      u.profilepicturename
    FROM ${TABLE} f
    JOIN public."User" u ON u.id = f.uploaderid
    WHERE f.isreported = $1 ORDER BY f.id DESC`,
    [reported]
  );
  return rows;
};