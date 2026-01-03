const userRepository = require("../repositories/userRepository");

async function createUser({ id, email, name, profilepicturename }) {
  return userRepository.createIfNotExists({
    id,
    email,
    name,
    profilepicturename,
  });
}

async function getUserById(id) {
  const user = await userRepository.findById(id);
  if (!user) {
    const err = new Error("User not found.");
    err.status = 404;
    throw err;
  }
  return user;
}

module.exports = { createUser, getUserById };
