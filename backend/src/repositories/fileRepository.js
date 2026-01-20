const pool = require("../db/db");

const TABLE = "public.file";

exports.insert = async (subcategoryId, name, uploaderId) => {
  const { rows } = await pool.query(
    `
    INSERT INTO ${TABLE} (subcategoryid, "name", uploaderid, isreported)
    VALUES ($1, $2, $3, false)
    RETURNING *
    `,
    [subcategoryId, name, uploaderId],
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
    [subcategoryId],
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
    [reported],
  );
  return rows;
};

exports.findById = async (fileId) => {
  const { rows } = await pool.query(`SELECT * FROM ${TABLE} WHERE id = $1`, [
    fileId,
  ]);
  return rows[0] ?? null;
};

exports.updateById = async (fileId, name, isReported) => {
  const { rowCount } = await pool.query(
    `
    UPDATE ${TABLE}
    SET
      "name" = COALESCE($2, "name"),
      isreported = COALESCE($3, isreported)
    WHERE id = $1
    `,
    [fileId, name, isReported],
  );

  if (rowCount === 0) return null;

  return exports.findById(fileId);
};

exports.deleteById = async (fileId) => {
  const { rowCount } = await pool.query(`DELETE FROM ${TABLE} WHERE id = $1`, [
    fileId,
  ]);
  return rowCount > 0;
};

exports.setReportedTrue = async (fileId) => {
  const { rowCount } = await pool.query(
    `UPDATE ${TABLE} SET isreported = true WHERE id = $1`,
    [fileId],
  );
  if (rowCount === 0) return null;
  return exports.findById(fileId);
};

exports.findByUploaderId = async (uploaderId) => {
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
    FROM public."file" f
    JOIN public."User" u ON u.id = f.uploaderid
    WHERE f.uploaderid = $1
    ORDER BY f.id DESC
    `,
    [uploaderId]
  );

  return rows;
};