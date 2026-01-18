import { RatingSummary, RatingValue } from "../vo/RatingSummary.js";
export type RatingRowDTO = {
    id: number;
    userid: string;
    fileid: number;
    ratingisbad: boolean;
    ratingismedium: boolean;
    ratingisgood: boolean;
};
export declare function computeSummaryFromRows(rows: RatingRowDTO[]): RatingSummary;
export declare function getUserRatingFromRows(rows: RatingRowDTO[], currentUserUid: string | null): {
    ratingId: number | null;
    value: RatingValue | null;
};
//# sourceMappingURL=RatingDtoUtil.d.ts.map