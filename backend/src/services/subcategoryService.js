const subcategoryRepository = require("../repositories/subcategoryRepository");

exports.getAllCategories = async () => {
  return subcategoryRepository.findAll();
};