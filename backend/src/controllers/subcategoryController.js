const subcategoryService = require("../services/subcategoryService");

async function list(req, res) {
  try {
    const { categoryId } = req.query ?? {};

    if (categoryId === undefined) {
      const subcategories = await subcategoryService.getAllCategories();
      return res.status(200).json(subcategories);
    }

    const id = Number(categoryId);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: "categoryId must be a positive number" });
    }

    const subcategories = await subcategoryService.getSubcategoriesByCategoryId(id);
    return res.status(200).json(subcategories);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { list };