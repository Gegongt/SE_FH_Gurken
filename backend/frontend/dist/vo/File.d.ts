import { NamedEntity } from "./NamedEntity.js";
import { Rating } from "./Rating.js";
import { User } from "./User.js";
import { RatingSummary } from "./RatingSummary.js";
export declare class File extends NamedEntity {
    private isReported;
    private uploader;
    private ratings;
    private ratingSummary?;
    constructor(id: number, name: string, isReported: boolean, uploader: User, ratings?: Rating[]);
    getUploader(): User;
    getIsReported(): boolean;
    setIsReported(isReported: boolean): void;
    getRatings(): Rating[];
    getRatingSummary(): RatingSummary | undefined;
    setRatingSummary(summary: RatingSummary): void;
}
//# sourceMappingURL=File.d.ts.map