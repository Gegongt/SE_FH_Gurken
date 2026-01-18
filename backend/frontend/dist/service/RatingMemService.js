import { buildSummary } from "../util/RatingUtil.js";
export class RatingMemService {
    constructor() {
        this.byFile = new Map();
        this.byFile.set(201, new Map([
            [3, "GOOD"],
            [2, "GOOD"],
        ]));
        this.byFile.set(202, new Map([
            [2, "MEDIUM"],
            [4, "MEDIUM"],
            [5, "GOOD"],
            [6, "MEDIUM"],
            [6, "GOOD"],
        ]));
    }
    computeSummary(fileId) {
        const map = this.byFile.get(fileId) ?? new Map();
        let good = 0, medium = 0, bad = 0;
        for (const v of map.values()) {
            if (v === "GOOD")
                good++;
            else if (v === "MEDIUM")
                medium++;
            else
                bad++;
        }
        return buildSummary(good, medium, bad);
    }
    getSummary(fileId, success, error) {
        setTimeout(() => {
            success(this.computeSummary(fileId));
        }, 50);
    }
    setUserRating(fileId, userId, value, success, error) {
        setTimeout(() => {
            const map = this.byFile.get(fileId) ?? new Map();
            const old = map.get(userId);
            if (!old) {
                map.set(userId, value);
            }
            else if (old === value) {
                map.delete(userId);
            }
            else {
                map.set(userId, value);
            }
            this.byFile.set(fileId, map);
            success(this.computeSummary(fileId));
        }, 80);
    }
}
export const ratingMemService = new RatingMemService();
//# sourceMappingURL=RatingMemService.js.map