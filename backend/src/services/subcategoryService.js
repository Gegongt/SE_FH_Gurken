const subcategoryRepository = require("../repositories/subcategoryRepository");

exports.getAllCategories = async () => {
  return subcategoryRepository.findAll();
};

exports.getSubcategoriesByCategoryId = async (categoryId) => {
  return subcategoryRepository.findByCategoryId(categoryId);
};