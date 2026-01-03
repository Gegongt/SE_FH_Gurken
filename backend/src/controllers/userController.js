const userService = require("../services/userService");

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

module.exports = { create, whoami };