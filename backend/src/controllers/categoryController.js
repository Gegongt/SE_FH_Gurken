const categoryService = require("../services/categoryService");

async function list(req, res) {
  try {
    const categories = await categoryService.getAllCategories();
    return res.status(200).json(categories);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { list };