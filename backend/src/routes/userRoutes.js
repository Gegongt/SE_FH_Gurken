const express = require("express");
const requireAuth = require("../middlewares/requireAuth");
const userController = require("../controllers/userController")

const router = express.Router();

router.post("/create", requireAuth, userController.create);
router.get("/whoami", requireAuth, userController.whoami);

module.exports = router;