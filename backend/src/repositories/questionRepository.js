const pool = require("../db/db");

const TABLE = "public.question";

exports.insertMany = async (questions) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const created = [];

    for (const q of questions) {
      const { rows } = await client.query(
        `
        INSERT INTO ${TABLE} (examid, question, questiontype, istrue, correctanswers, wronganswers)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        `,
        [q.examid, q.question, q.questiontype, q.istrue, q.correctanswers, q.wronganswers]
      );
      created.push(rows[0]);
    }

    await client.query("COMMIT");
    return created;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

exports.findMetaById = async (questionId) => {
  const { rows } = await pool.query(
    `
    SELECT q.id, q.examid, e.creatorid
    FROM ${TABLE} q
    JOIN public.exam e ON e.id = q.examid
    WHERE q.id = $1
    `,
    [questionId]
  );
  return rows[0] ?? null;
};

exports.deleteById = async (questionId) => {
  const { rowCount } = await pool.query(
    `DELETE FROM ${TABLE} WHERE id = $1`,
    [questionId]
  );
  return rowCount > 0;
};

exports.deleteByExamId = async (examId) => {
  const { rowCount } = await pool.query(
    `DELETE FROM ${TABLE} WHERE examid = $1`,
    [examId]
  );
  return rowCount;
};

exports.findByExamId = async (examId) => {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM ${TABLE}
    WHERE examid = $1
    ORDER BY id ASC
    `,
    [examId]
  );
  return rows;
};