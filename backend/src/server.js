const express = require("express");

const apiRoutes = require("./routes/api");

const app = express();
app.use(express.json());

const PORT = process.env.BACKEND_PORT || 3000;

app.use("/api", apiRoutes)

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend listening on :${PORT}`);
});