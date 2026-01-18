const ratingRepository = require("../repositories/ratingRepository");

function boolsToEnum({ ratingisbad, ratingismedium, ratingisgood }) {
  if (ratingisbad) return "BAD";
  if (ratingismedium) return "MEDIUM";
  if (ratingisgood) return "GOOD";

  throw new Error("Invalid rating flags");
}

function enumToBools(ratingEnum) {
  return {
    ratingisbad: ratingEnum === "BAD",
    ratingismedium: ratingEnum === "MEDIUM",
    ratingisgood: ratingEnum === "GOOD",
  };
}

exports.createRating = async (userId, fileId, flags) => {
  const ratingEnum = boolsToEnum(flags);
  const row = await ratingRepository.insert(userId, fileId, ratingEnum);

  return {
    id: row.id,
    userid: row.userid,
    fileid: row.fileid,
    ...enumToBools(row.rating),
  };
};

exports.getRatingsByFileId = async (fileId) => {
  const rows = await ratingRepository.findByFileId(fileId);

  return rows.map((r) => ({
    id: r.id,
    userid: r.userid,
    fileid: r.fileid,
    ...enumToBools(r.rating),
  }));
};

exports.getRatingByIdRaw = async (ratingId) => {
  return ratingRepository.findById(ratingId);
};

exports.updateRating = async (ratingId, flags) => {
  const ratingEnum = boolsToEnum(flags);
  const row = await ratingRepository.updateById(ratingId, ratingEnum);

  if (!row) return null;

  return {
    id: row.id,
    userid: row.userid,
    fileid: row.fileid,
    ...enumToBools(row.rating),
  };
};

exports.deleteRatingById = async (ratingId) => {
  return ratingRepository.deleteById(ratingId);
};