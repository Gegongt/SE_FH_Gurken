const pool = require("../db/db");

const TABLE = 'public.exam';

exports.createExam = async (subcategoryId, name, creatorId) => {
  const { rows } = await pool.query(
    `INSERT INTO ${TABLE} (subcategoryid, "name", creatorid)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [subcategoryId, name, creatorId]
  );

  return rows[0] ?? null;
};

exports.findAll = async () => {
  const { rows } = await pool.query(
    `
    SELECT
      e.id,
      e.subcategoryid,
      e."name",
      u.id AS "uid",
      u.email,
      u.name AS "uname",
      u.isadmin,
      u.isblocked,
      u.profilepicturename
    FROM ${TABLE} e
    JOIN public."User" u ON u.id = e.creatorid
    ORDER BY e.id DESC
    `
  );
  return rows;
};

exports.findBySubcategoryId = async (subcategoryId) => {
  const { rows } = await pool.query(
    `
    SELECT
      e.id,
      e.subcategoryid,
      e."name",
      u.id AS "uid",
      u.email,
      u.name AS "uname",
      u.isadmin,
      u.isblocked,
      u.profilepicturename
    FROM ${TABLE} e
    JOIN public."User" u ON u.id = e.creatorid
    WHERE e.subcategoryid = $1
    ORDER BY e.id DESC
    `,
    [subcategoryId]
  );
  return rows;
};

exports.updateById = async (examId, name) => {
  const { rows } = await pool.query(
    `
    UPDATE ${TABLE}
    SET "name" = $2
    WHERE id = $1
    RETURNING *
    `,
    [examId, name]
  );

  return rows[0] ?? null;
};

exports.deleteById = async (examId) => {
  const { rowCount } = await pool.query(
    `DELETE FROM ${TABLE} WHERE id = $1`,
    [examId]
  );

  return rowCount > 0;
};

exports.findById = async (examId) => {
  const { rows } = await pool.query(
    `
    SELECT
      e.id,
      e.subcategoryid,
      e."name",
      u.id AS "uid",
      u.email,
      u.name AS "uname",
      u.isadmin,
      u.isblocked,
      u.profilepicturename
    FROM ${TABLE} e
    JOIN public."User" u ON u.id = e.creatorid
    WHERE e.id = $1
    `,
    [examId]
  );

  return rows[0] ?? null;
};

exports.findCreatorIdByExamId = async (examId) => {
  const { rows } = await pool.query(
    `SELECT creatorid FROM ${TABLE} WHERE id = $1`,
    [examId]
  );
  return rows[0]?.creatorid ?? null;
};