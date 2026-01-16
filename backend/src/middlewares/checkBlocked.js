const userRepository = require('../repositories/userRepository')

module.exports = async function checkBlocked(req, res, next) {
  try {
    const uid = req.user?.uid;
    if (!uid) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await userRepository.findById(uid);

    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.isblocked) {
      return res.status(403).json({ message: "User is blocked" });
    }

    req.dbUser = user;

    next();
  } catch (err) {
    console.error("checkBlocked error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};