const userService = require("../services/userService");
const userRepository = require("../repositories/userRepository");

async function create(req, res) {
  try {
    const { uid, email } = req.user;

    const { name, profilepicturename } = req.body ?? {};

    if (!name) return res.status(400).json({ error: "Missing name" });

    const result = await userService.createUser({
      id: uid,
      email,
      name,
      profilepicturename,
    });

    return res.status(result.created ? 201 : 200).json(result);
  } catch (e) {
    const status = e.status || 500;
    return res.status(status).json({ error: e.message });
  }
}

async function whoami(req, res) {
  try {
    const { uid } = req.user;

    const user = await userService.getUserById(uid);
    return res.json({ user });
  } catch (e) {
    const status = e.status || 500;
    return res.status(status).json({ error: e.message });
  }
}

async function update(req, res) {
  try {
    const userId = req.params.userId || req.dbUser.id

    const isSelf = userId === req.dbUser.id;
    const isAdmin = req.dbUser.isadmin;

    if (!isSelf && !isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { name, profilepicturename, isblocked } = req.body ?? {};

    if (name === undefined || profilepicturename === undefined) {
      return res.status(400).json({ message: "Missing name/profilepicturename" });
    }

    const isblockedOrNull = isAdmin && isblocked !== undefined ? isblocked : null;

    const updated = await userService.updateUser(
      userId,
      name,
      profilepicturename,
      isblockedOrNull
    );

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(updated)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function remove(req, res) {
  try {
    const dbUser = await userRepository.findById(req.user.uid);

    if (!dbUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = req.params.userId || dbUser.id;

    const isSelf = userId === dbUser.id;
    const isAdmin = dbUser.isadmin;

    if (!isSelf && !isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const deleted = await userService.deleteUser(userId);

    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { create, whoami, update, remove };