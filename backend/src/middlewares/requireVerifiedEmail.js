const admin = require("../firebase");

module.exports = async function requireVerifiedEmail(req, res, next) {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ message: "Unauthorized" });

    const userRecord = await admin.auth().getUser(uid);
    if (!userRecord.emailVerified) {
      return res.status(403).json({ message: "Email not verified" });
    }

    next();
  } catch (e) {
    console.error("requireVerifiedEmail error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};