const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

const PORT = process.env.BACKEND_PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get("/", async (req, res) => {
  res.json({ ok: "Hello World" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend listening on :${PORT}`);
});