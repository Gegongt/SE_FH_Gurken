const multer = require("multer");
const path = require("path");
const fs = require("fs");

const tmpDir = path.join(process.cwd(), "uploads", "tmp");
fs.mkdirSync(tmpDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, tmpDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

module.exports = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }
});