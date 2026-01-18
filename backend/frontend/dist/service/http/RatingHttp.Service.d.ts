export type RatingRowDTO = {
    id: number;
    userid: string;
    fileid: number;
    ratingisbad: boolean;
    ratingismedium: boolean;
    ratingisgood: boolean;
};
export declare class RatingHttpService {
    private URL;
    listByFile(fileId: number, success: (rows: RatingRowDTO[]) => void, error: (e: any) => void): void;
    create(fileId: number, value: "BAD" | "MEDIUM" | "GOOD", success: () => void, error: (e: any) => void): void;
    update(ratingId: number, value: "BAD" | "MEDIUM" | "GOOD", success: () => void, error: (e: any) => void): void;
    remove(ratingId: number, success: () => void, error: (e: any) => void): void;
}
export declare const ratingHttpService: RatingHttpService;
//# sourceMappingURL=RatingHttp.Service.d.ts.map