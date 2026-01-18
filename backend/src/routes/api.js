const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes")
const categoryRoutes = require("./categoryRoutes")
const subcategoryRoutes = require("./subcategoryRoutes")
const examRoutes = require("./examRoutes")
const fileRoutes = require("./fileRoutes")
const questionRoutes = require("./questionRoutes")

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/subcategories", subcategoryRoutes);
router.use("/exams", examRoutes);
router.use("/files", fileRoutes);
router.use("/questions", questionRoutes);

module.exports = router;