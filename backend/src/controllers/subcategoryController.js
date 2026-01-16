const subcategoryService = require("../services/subcategoryService");

async function list(req, res) {
  try {
    const subcategories = await subcategoryService.getAllCategories();
    return res.status(200).json(subcategories);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { list };