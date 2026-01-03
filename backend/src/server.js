const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const apiRoutes = require("./routes/api");

const app = express();
app.use(express.json());

const PORT = process.env.BACKEND_PORT || 3000;

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", apiRoutes)

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend listening on :${PORT}`);
});