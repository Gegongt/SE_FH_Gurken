const ratingService = require("../services/ratingService");

async function create(req, res) {
  try {
    const dbUser = req.dbUser;
    if (!dbUser) return res.status(500).json({ message: "dbUser missing" });

    const { fileid, ratingisbad, ratingismedium, ratingisgood } = req.body ?? {};

    const fid = Number(fileid);
    if (!Number.isInteger(fid) || fid <= 0) {
      return res.status(400).json({ message: "fileid must be a positive integer" });
    }

    if (
      typeof ratingisbad !== "boolean" ||
      typeof ratingismedium !== "boolean" ||
      typeof ratingisgood !== "boolean"
    ) {
      return res.status(400).json({ message: "ratingisbad/ratingIsMedium/ratingIsGood must be booleans" });
    }

    const countTrue =
      (ratingisbad ? 1 : 0) + (ratingismedium ? 1 : 0) + (ratingisgood ? 1 : 0);

    if (countTrue !== 1) {
      return res.status(400).json({ message: "Exactly one rating flag must be true" });
    }

    const created = await ratingService.createRating(dbUser.id, fid, {
      ratingisbad,
      ratingismedium,
      ratingisgood,
    });

    return res.status(201).json(created);
  } catch (err) {
    if (err?.code === "23505") {
      return res.status(409).json({ message: "User already rated this file" });
    }
    console.error("create rating error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function listByFile(req, res) {
  try {
    const { fileId } = req.query ?? {};

    if (fileId === undefined) {
      return res.status(400).json({ message: "fileId query param is required" });
    }

    const fid = Number(fileId);
    if (!Number.isInteger(fid) || fid <= 0) {
      return res.status(400).json({ message: "fileId must be a positive number" });
    }

    const ratings = await ratingService.getRatingsByFileId(fid);
    return res.status(200).json(ratings);
  } catch (err) {
    console.error("list ratings error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

function parseBool(val) {
  if (typeof val === "boolean") return val;
  const s = String(val).toLowerCase();
  if (s === "true") return true;
  if (s === "false") return false;
  return undefined;
}

async function update(req, res) {
  try {
    const dbUser = req.dbUser;
    if (!dbUser) return res.status(500).json({ message: "dbUser missing" });

    const ratingId = Number(req.params.ratingId);
    if (!Number.isInteger(ratingId) || ratingId <= 0) {
      return res.status(400).json({ message: "ratingId must be a positive number" });
    }

    const { ratingisbad, ratingismedium, ratingisgood } = req.body ?? {};

    if (ratingisbad === undefined || ratingismedium === undefined || ratingisgood === undefined) {
      return res.status(400).json({ message: "Missing ratingisbad/ratingismedium/ratingisgood" });
    }

    const bBad = parseBool(ratingisbad);
    const bMed = parseBool(ratingismedium);
    const bGood = parseBool(ratingisgood);

    if (bBad === undefined || bMed === undefined || bGood === undefined) {
      return res.status(400).json({ message: "rating flags must be booleans (true/false)" });
    }

    const countTrue = (bBad ? 1 : 0) + (bMed ? 1 : 0) + (bGood ? 1 : 0);
    if (countTrue !== 1) {
      return res.status(400).json({ message: "Exactly one rating flag must be true" });
    }

    const existing = await ratingService.getRatingByIdRaw(ratingId);
    if (!existing) {
      return res.status(404).json({ message: "Rating not found" });
    }

    if (existing.userid !== dbUser.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updated = await ratingService.updateRating(ratingId, {
      ratingisbad: bBad,
      ratingismedium: bMed,
      ratingisgood: bGood,
    });

    if (!updated) return res.status(404).json({ message: "Rating not found" });
    return res.status(200).json(updated);
  } catch (err) {
    console.error("update rating error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function remove(req, res) {
  try {
    const dbUser = req.dbUser;
    if (!dbUser) return res.status(500).json({ message: "dbUser missing" });

    const ratingId = Number(req.params.ratingId);
    if (!Number.isInteger(ratingId) || ratingId <= 0) {
      return res.status(400).json({ message: "ratingId must be a positive number" });
    }

    const existing = await ratingService.getRatingByIdRaw(ratingId);
    if (!existing) return res.status(404).json({ message: "Rating not found" });

    const isAdmin = dbUser.isadmin;
    const isOwner = existing.userid === dbUser.id;

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const deleted = await ratingService.deleteRatingById(ratingId);
    if (!deleted) return res.status(404).json({ message: "Rating not found" });

    return res.status(204).send();
  } catch (err) {
    console.error("delete rating error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}


module.exports = { create, listByFile, update, remove };