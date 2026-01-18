const favouriteService = require("../services/favouriteService");

function canAccess(dbUser, userId) {
  return dbUser.isadmin || dbUser.id === userId;
}

async function list(req, res) {
  try {
    const dbUser = req.dbUser;
    if (!dbUser) return res.status(500).json({ message: "dbUser missing" });

    const { userId } = req.query ?? {};
    if (!userId) return res.status(400).json({ message: "userId query param is required" });

    if (!canAccess(dbUser, String(userId))) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const favs = await favouriteService.getFavouritesByUserId(String(userId));
    return res.status(200).json(favs);
  } catch (err) {
    console.error("list favourites error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function create(req, res) {
  try {
    const dbUser = req.dbUser;
    if (!dbUser) return res.status(500).json({ message: "dbUser missing" });

    const { userid, fileid } = req.body ?? {};
    if (!userid || fileid === undefined) {
      return res.status(400).json({ message: "Missing userid/fileid" });
    }

    const fid = Number(fileid);
    if (!Number.isInteger(fid) || fid <= 0) {
      return res.status(400).json({ message: "fileid must be a positive integer" });
    }

    if (!canAccess(dbUser, String(userid))) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const result = await favouriteService.addFavourite(String(userid), fid);

    if (result === "EXISTS") {
      return res.status(409).json({ message: "Favourite already exists" });
    }

    return res.status(201).json(result);
  } catch (err) {
    console.error("create favourite error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function remove(req, res) {
  try {
    const dbUser = req.dbUser;
    if (!dbUser) return res.status(500).json({ message: "dbUser missing" });

    const { userid, fileid } = req.body ?? {};
    if (!userid || fileid === undefined) {
      return res.status(400).json({ message: "Missing userid/fileid" });
    }

    const fid = Number(fileid);
    if (!Number.isInteger(fid) || fid <= 0) {
      return res.status(400).json({ message: "fileid must be a positive integer" });
    }

    if (!canAccess(dbUser, String(userid))) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const deleted = await favouriteService.removeFavourite(String(userid), fid);
    if (!deleted) return res.status(404).json({ message: "Favourite not found" });

    return res.status(204).send();
  } catch (err) {
    console.error("delete favourite error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { list, create, remove };