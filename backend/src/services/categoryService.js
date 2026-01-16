const categoryRepository = require("../repositories/categoryRepository");

exports.getAllCategories = async () => {
  return categoryRepository.findAll();
};