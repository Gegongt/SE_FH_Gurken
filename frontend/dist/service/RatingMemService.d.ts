import { RatingSummary, RatingValue } from "../vo/RatingSummary.js";
export declare class RatingMemService {
    private byFile;
    constructor();
    private computeSummary;
    getSummary(fileId: number, success: (s: RatingSummary) => void, error: (status: any) => void): void;
    setUserRating(fileId: number, userId: number, value: RatingValue, success: (s: RatingSummary) => void, error: (status: any) => void): void;
}
export declare const ratingMemService: RatingMemService;
//# sourceMappingURL=RatingMemService.d.ts.map