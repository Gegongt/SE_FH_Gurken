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

async function update(req, res) {
  try {
    const dbUser = req.dbUser;
    if (!dbUser) {
        return res.status(500).json({ message: "dbUser missing" });
    }

    const fileId = Number(req.params.fileId);
    if (!Number.isInteger(fileId) || fileId <= 0) {
      return res.status(400).json({ message: "fileId must be a positive number" });
    }

    const file = await fileService.getFileById(fileId);
    if (!file) {
        return res.status(404).json({ message: "File not found" });
    }

    const isAdmin = dbUser.isadmin;
    const isUploader = file.uploaderid === dbUser.id;

    if (!isUploader && !isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { name, isreported } = req.body ?? {};

    if (name === undefined || isreported === undefined) {
      return res.status(400).json({ message: "Missing  name / isreported" });
    }

    if (typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ message: "name must be a non-empty string" });
    }

    let parsedReported;
    if (typeof isreported === "boolean") {
      parsedReported = isreported;
    } else {
      const s = String(isreported).toLowerCase();
      if (s !== "true" && s !== "false") {
        return res.status(400).json({ message: "isreported must be true/false" });
      }
      parsedReported = s === "true";
    }

    if (parsedReported === false && !isAdmin) {
      return res.status(403).json({ message: "Only admin can set isreported to false" });
    }

    const updated = await fileService.updateFile(fileId, name.trim(), parsedReported);
    if (!updated) return res.status(404).json({ message: "File not found" });

    return res.status(200).json(updated);
  } catch (err) {
    console.error("update file error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function remove(req, res) {
  try {
    const dbUser = req.dbUser;
    if (!dbUser) {
        return res.status(500).json({ message: "dbUser missing" });
    }

    const fileId = Number(req.params.fileId);
    if (!Number.isInteger(fileId) || fileId <= 0) {
      return res.status(400).json({ message: "fileId must be a positive number" });
    }

    const file = await fileService.getFileById(fileId);
    if (!file) {
        return res.status(404).json({ message: "File not found" });
    }

    const isAdmin = dbUser.isadmin;
    const isUploader = file.uploaderid === dbUser.id;

    if (!isUploader && !isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const deleted = await fileService.deleteFileEverywhere(fileId);
    if (!deleted) {
        return res.status(404).json({ message: "File not found" });
    }

    return res.status(204).send();
  } catch (err) {
    console.error("delete file error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function download(req, res) {
  try {
    const fileId = Number(req.params.fileId);
    if (!Number.isInteger(fileId) || fileId <= 0) {
      return res.status(400).json({ message: "fileId must be a positive number" });
    }

    const file = await fileService.getFileById(fileId);
    if (!file) return res.status(404).json({ message: "File not found" });

    const filePath = path.join(process.cwd(), "uploads", "files", String(fileId));
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({ message: "Uploaded file not found on server" });
    }

    return res.download(filePath, file.name || `file-${fileId}`);
  } catch (err) {
    console.error("download file error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { create, list, update, remove, download };