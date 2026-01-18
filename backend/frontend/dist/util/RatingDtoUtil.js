import { buildSummary } from "./RatingUtil.js";
export function computeSummaryFromRows(rows) {
    let good = 0, medium = 0, bad = 0;
    for (const r of rows) {
        if (r.ratingisgood)
            good++;
        else if (r.ratingismedium)
            medium++;
        else if (r.ratingisbad)
            bad++;
    }
    return buildSummary(good, medium, bad);
}
export function getUserRatingFromRows(rows, currentUserUid) {
    if (!currentUserUid)
        return { ratingId: null, value: null };
    const mine = rows.find(r => String(r.userid) === String(currentUserUid));
    if (!mine)
        return { ratingId: null, value: null };
    const value = mine.ratingisgood ? "GOOD" :
        mine.ratingismedium ? "MEDIUM" :
            "BAD";
    return { ratingId: mine.id, value };
}
//# sourceMappingURL=RatingDtoUtil.js.map