import { RatingSummary, RatingValue } from "../vo/RatingSummary.js";
import { buildSummary } from "../util/RatingUtil.js";

export class RatingMemService {
  private store = new Map<number, { good: number; medium: number; bad: number }>();

  getSummary(
    fileId: number,
    success: (summary: RatingSummary) => void,
    error: (status: any) => void
  ): void {
    setTimeout(() => {
      const c = this.store.get(fileId) ?? { good: 0, medium: 0, bad: 0 };
      success(buildSummary(c.good, c.medium, c.bad));
    }, 50);
  }

  rateFile(
    fileId: number,
    value: RatingValue,
    success: (summary: RatingSummary) => void,
    error: (status: any) => void
  ): void {
    setTimeout(() => {
      const c = this.store.get(fileId) ?? { good: 0, medium: 0, bad: 0 };

      if (value === "GOOD") c.good++;
      else if (value === "MEDIUM") c.medium++;
      else c.bad++;

      this.store.set(fileId, c);

      success(buildSummary(c.good, c.medium, c.bad));
    }, 80);
  }
}

export const ratingMemService = new RatingMemService();
