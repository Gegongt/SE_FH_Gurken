import { RatingSummary, RatingValue } from "../vo/RatingSummary.js";
import { buildSummary } from "./RatingUtil.js";

export type RatingRowDTO = {
  id: number;
  userid: string;
  fileid: number;
  ratingisbad: boolean;
  ratingismedium: boolean;
  ratingisgood: boolean;
};

export function computeSummaryFromRows(rows: RatingRowDTO[]): RatingSummary {
  let good = 0, medium = 0, bad = 0;

  for (const r of rows) {
    if (r.ratingisgood) good++;
    else if (r.ratingismedium) medium++;
    else if (r.ratingisbad) bad++;
  }

  return buildSummary(good, medium, bad);
}

export function getUserRatingFromRows(
  rows: RatingRowDTO[],
  currentUserUid: string | null
): { ratingId: number | null; value: RatingValue | null } {
  if (!currentUserUid) return { ratingId: null, value: null };

  const mine = rows.find(r => String(r.userid) === String(currentUserUid));
  if (!mine) return { ratingId: null, value: null };

  const value: RatingValue =
    mine.ratingisgood ? "GOOD" :
    mine.ratingismedium ? "MEDIUM" :
    "BAD";

  return { ratingId: mine.id, value };
}
