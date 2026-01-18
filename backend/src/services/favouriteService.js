const favouriteRepository = require("../repositories/favouriteRepository");

exports.getFavouritesByUserId = async (userId) => {
  return favouriteRepository.findByUserId(userId);
};

exports.addFavourite = async (userId, fileId) => {
  const exists = await favouriteRepository.exists(userId, fileId);
  if (exists) return "EXISTS";

  return favouriteRepository.insert(userId, fileId);
};

exports.removeFavourite = async (userId, fileId) => {
  return favouriteRepository.delete(userId, fileId);
};