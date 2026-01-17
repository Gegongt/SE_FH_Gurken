const path = require("path");
const fs = require("fs/promises");
const fileService = require("../services/fileService");

async function create(req, res) {
  try {
    const dbUser = req.dbUser;
    if (!dbUser) return res.status(500).json({ message: "dbUser missing" });

    const { subcategoryid } = req.body ?? {};

    const sid = Number(subcategoryid);
    if (!Number.isInteger(sid) || sid <= 0) {
      if (req.file?.path) await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({ message: "subcategoryid must be a positive number" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Missing file" });
    }

    const created = await fileService.createFile({
      subcategoryId: sid,
      name: req.file.originalname,
      uploaderId: dbUser.id,
    });

    const filesDir = path.join(process.cwd(), "uploads", "files");
    await fs.mkdir(filesDir, { recursive: true });

    const finalPath = path.join(filesDir, String(created.id));
    await fs.rename(req.file.path, finalPath);

    return res.status(201).json(created);
  } catch (err) {
    try {
      if (req.file?.path) await fs.unlink(req.file.path);
    } catch {}

    return res.status(500).json({ message: "Internal server error" });
  }
}

async function list(req, res) {
  try {
    const { subcategoryId, subcategoryid, reported } = req.query ?? {};
    const subIdRaw = subcategoryId ?? subcategoryid;

    if (reported !== undefined) {
      const s = String(reported).toLowerCase();
      if (s !== "true" && s !== "false") {
        return res.status(400).json({ message: "reported must be 'true' or 'false'" });
      }
      const files = await fileService.getFilesByReported(s === "true");
      return res.status(200).json(files);
    }

    if (subIdRaw !== undefined) {
      const sid = Number(subIdRaw);
      if (!Number.isInteger(sid) || sid <= 0) {
        return res.status(400).json({ message: "subcategoryId must be a positive number" });
      }
      const files = await fileService.getFilesBySubcategoryId(sid);
      return res.status(200).json(files);
    }

    const files = await fileService.getAllFiles();
    return res.status(200).json(files);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { create, list };