import { User } from "./User.js";
import { File } from "./File.js";
export declare class Rating {
    private id;
    private ratingIsBad;
    private ratingIsMedium;
    private ratingIsGood;
    private user;
    private file;
    constructor(id: number, ratingIsBad: boolean, ratingIsMedium: boolean, ratingIsGood: boolean, user: User, file: File);
    getId(): number;
    getUser(): User;
    getFile(): File;
    getRatingIsBad(): boolean;
    getRatingIsMedium(): boolean;
    getRatingIsGood(): boolean;
    setRatingIsBad(ratingIsBad: boolean): boolean;
    setRatingIsMedium(ratingIsMedium: boolean): boolean;
    setRatingIsGood(ratingIsGood: boolean): boolean;
}
//# sourceMappingURL=Rating.d.ts.map