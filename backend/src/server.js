const express = require("express");
const cors = require("cors");
const path = require("path");
const { createServer } = require('node:http');

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const apiRoutes = require("./routes/api");
const { initChatMessageSocket } = require("./sockets/chatMessageSocket");

const app = express();
const server = createServer(app);

app.use(cors());

app.use(express.json());
const frontendPath = path.join(__dirname, "..", "frontend");
app.use(express.static(frontendPath));

const PORT = process.env.BACKEND_PORT || 3000;

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", apiRoutes)

app.get("/", (req, res) => res.redirect("/src/pages/login/login.html"));

initChatMessageSocket(server);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend listening on :${PORT}`);
});
