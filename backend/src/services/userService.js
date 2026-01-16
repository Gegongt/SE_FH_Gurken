const userRepository = require("../repositories/userRepository");
const admin = require("firebase-admin");

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

async function updateUser(userId, name, profilepicturename, isblockedOrNull) {
  return userRepository.updateById(userId, name, profilepicturename, isblockedOrNull);
};

async function deleteUser(userId) {
  try{
    await admin.auth().deleteUser(userId);
  } catch (e) {

  }

  return userRepository.deleteById(userId);
}

async function listUsersByBlocked(isBlocked) {
  return userRepository.findByBlocked(isBlocked);
}

module.exports = { createUser, getUserById, updateUser, deleteUser, listUsersByBlocked };
