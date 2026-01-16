const express = require("express");
<<<<<<< HEAD
const { Pool } = require("pg");
=======
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const apiRoutes = require("./routes/api");
>>>>>>> origin/main

const app = express();
app.use(express.json());

const PORT = process.env.BACKEND_PORT || 3000;

<<<<<<< HEAD
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get("/", async (req, res) => {
  res.json({ ok: "Hello World" });
});
=======
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", apiRoutes)
>>>>>>> origin/main

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend listening on :${PORT}`);
});