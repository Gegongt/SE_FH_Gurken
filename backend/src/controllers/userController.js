const userService = require("../services/userService");
const userRepository = require("../repositories/userRepository");
const path = require("path");
const fs = require("fs/promises");

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

async function list(req, res) {
  try {
    const dbUser = req.dbUser;

    if (!dbUser) {
      return res.status(500).json({ message: "User missing" });
    }

    if (!dbUser.isadmin) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const query = req.query?.isBlocked;

    if (query === undefined) {
      return res.status(400).json({ message: "Query param isBlocked is required (true|false)" });
    }

    const blockedBool = String(query).toLowerCase();
    if (blockedBool !== "true" && blockedBool !== "false") {
      return res.status(400).json({ message: "isBlocked must be 'true' or 'false'" });
    }

    const isBlocked = blockedBool === "true";
    const users = await userService.listUsersByBlocked(isBlocked);

    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function uploadProfilePicture(req, res) {
  try {
    const dbUser = req.dbUser;
    if (!dbUser) return res.status(500).json({ message: "dbUser missing" });

    if (!req.file) {
      return res.status(400).json({ message: "Missing file" });
    }

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(req.file.mimetype)) {
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({ message: "Only jpg/png/webp allowed" });
    }

    const dir = path.join(process.cwd(), "uploads", "profilepictures");
    await fs.mkdir(dir, { recursive: true });

    const finalPath = path.join(dir, String(dbUser.id));
    await fs.rename(req.file.path, finalPath);

    const updated = await userService.updateProfilePictureName(dbUser.id, req.file.originalname);

    return res.status(200).json(updated);
  } catch (err) {
    console.error("upload profile picture error:", err);
    try {
      if (req.file?.path) await fs.unlink(req.file.path);
    } catch {}
    return res.status(500).json({ message: "Internal server error" });
  }
}

function extFromFilename(filename) {
  const lower = String(filename || "").toLowerCase();
  if (lower.endsWith(".png")) return ".png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return ".jpg";
  if (lower.endsWith(".webp")) return ".webp";
  return "";
}

function contentTypeFromExt(ext) {
  if (ext === ".png") return "image/png";
  if (ext === ".jpg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  return "application/octet-stream";
}

async function getMyProfilePicture(req, res) {
  try {
    const dbUser = req.dbUser;
    if (!dbUser) return res.status(500).json({ message: "dbUser missing" });

    const user = await userService.getUserById(dbUser.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const filePath = path.join(process.cwd(), "uploads", "profilepictures", String(dbUser.id));

    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({ message: "Profile picture not found" });
    }

    const ext = extFromFilename(user.profilepicturename);
    res.setHeader("Content-Type", contentTypeFromExt(ext));

    return res.sendFile(filePath);
  } catch (err) {
    console.error("get profile picture error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { create, whoami, update, remove, list, uploadProfilePicture, getMyProfilePicture };