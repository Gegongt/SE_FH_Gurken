const authService = require("../services/authService");
const userService = require("../services/userService");
const admin = require("../firebase");

async function register(req, res) {
  const { email, password, name, profilepicturename } = req.body ?? {};

  if (!email || !password || !name) {
    return res.status(400).json({ error: "Missing email/password/name" });
  }

  let firebaseResult = null;

  try {
    firebaseResult = await authService.register(email, password);
    const uid = firebaseResult.localId;

    await userService.createUser({
      id: uid,
      email,
      name,
      profilepicturename: profilepicturename ?? null,
    });

    return res.status(201).json({
      userId: uid,
      accessToken: firebaseResult.idToken,
      refreshToken: firebaseResult.refreshToken,
      expiresIn: Number(firebaseResult.expiresIn)
    });
  } catch (err) {
    if (firebaseResult?.localId) {
      try {
        await admin.auth().deleteUser(firebaseResult.localId);
      } catch {
        console.log("Something went wrong...");
      }
    }

    const status = err.status || 500;
    return res.status(status).json({ error: err.message || "Internal server error" });
  }
}

async function login(req, res) {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ error: "Missing email/password" });
  }

  try {
    const firebaseResult = await authService.login(email, password);
    const uid = firebaseResult.localId;

    const dbUser = await userService.getUserById(uid);
    if (!dbUser) {
      return res.status(404).json({ error: "User not found in database. Please register first." });
    }

    if (dbUser.isblocked) {
      return res.status(403).json({ error: "User is blocked" });
    }

    return res.json({
      userId: uid,
      accessToken: firebaseResult.idToken,
      refreshToken: firebaseResult.refreshToken,
      expiresIn: Number(firebaseResult.expiresIn)
    });
  } catch (err) {
    const status = err.status || 401;
    return res.status(status).json({ error: err.message || "Unauthorized" });
  }
}

module.exports = { register, login };