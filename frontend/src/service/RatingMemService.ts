import { RatingSummary, RatingValue } from "../vo/RatingSummary.js";
import { buildSummary } from "../util/RatingUtil.js";

export class RatingMemService {
  private byFile = new Map<number, Map<number, RatingValue>>();

  constructor() {
    this.byFile.set(201, new Map<number, RatingValue>([
      [3, "GOOD"],
      [2, "GOOD"],
    ]));

    this.byFile.set(202, new Map<number, RatingValue>([
      [2, "MEDIUM"],
      [4, "MEDIUM"],
      [5, "GOOD"],
      [6, "MEDIUM"],
      [6, "GOOD"],
    ]));

  }

  private computeSummary(fileId: number): RatingSummary {
    const map = this.byFile.get(fileId) ?? new Map<number, RatingValue>();

    let good = 0, medium = 0, bad = 0;
    for (const v of map.values()) {
      if (v === "GOOD") good++;
      else if (v === "MEDIUM") medium++;
      else bad++;
    }
    return buildSummary(good, medium, bad);
  }

  getSummary(
    fileId: number,
    success: (s: RatingSummary) => void,
    error: (status: any) => void
  ): void {
    setTimeout(() => {
      success(this.computeSummary(fileId));
    }, 50);
  }

  setUserRating(
    fileId: number,
    userId: number,
    value: RatingValue,
    success: (s: RatingSummary) => void,
    error: (status: any) => void
  ): void {
    setTimeout(() => {
      const map = this.byFile.get(fileId) ?? new Map<number, RatingValue>();
      const old = map.get(userId);

      if (!old) {
        map.set(userId, value);
      } else if (old === value) {
        map.delete(userId);
      } else {
        map.set(userId, value);
      }

      this.byFile.set(fileId, map);
      success(this.computeSummary(fileId));
    }, 80);
  }

}

export const ratingMemService = new RatingMemService();
