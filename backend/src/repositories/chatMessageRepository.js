const pool = require("../db/db");

const TABLE = 'public.chatmessage';

exports.createChatMessage = async (subcategoryid, userid, name, message, created_at) => {
  const { rows } = await pool.query(
    `INSERT INTO ${TABLE} (subcategoryid, userid, "name", "message")
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [subcategoryid, userid, name, message]
  );

  return rows[0] ?? null;
};

exports.findBySubcategoryId = async (subcategoryId) => {
  const { rows } = await pool.query(
    `
    SELECT
      m.id,
      m.subcategoryid,
      u."name",
      u.id AS "userid",
      m.created_at,
      m."message"
    FROM ${TABLE} m
    JOIN public."User" u ON u.id = m.userid
    WHERE m.subcategoryid = $1
    ORDER BY m.created_at ASC
    `,
    [subcategoryId]
  );

  return rows;
};
