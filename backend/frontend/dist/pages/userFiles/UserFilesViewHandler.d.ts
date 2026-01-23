import { File } from "../../vo/File.js";
import { User } from "../../vo/User.js";
import { UserFilesView } from "./UserFilesView.js";
import { RatingRowDTO } from "../../util/RatingDtoUtil.js";
type Navigator = {
    redirectToLoginPage(): void;
    redirectToMainPage(): void;
};
export type UserService = {
    getCurrentUser(success: (u: User) => void, error: (e: any) => void): void;
};
export type FileService = {
    getFilesByUser(userId: string, success: (files: File[]) => void, error: (status: any) => void): void;
    reportFile(fileId: number, name: string, reported: boolean, success: (updated: File) => void, error: (status: any) => void): void;
    downloadFile(fileId: number, success: (filename?: string) => void, error: (status: any) => void): void;
    deleteFile(fileId: number, success: () => void, error: (status: any) => void): void;
};
export type FavouriteDTO = {
    userId: string;
    fileId: number;
};
export type FavouritesService = {
    getFavourites(userId: string, success: (favs: FavouriteDTO[]) => void, error: (e: any) => void): void;
    addFavourite(userId: string, fileId: number, success: () => void, error: (e: any) => void): void;
    removeFavourite(userId: string, fileId: number, success: () => void, error: (e: any) => void): void;
};
export type RatingService = {
    listByFile(fileId: number, success: (rows: RatingRowDTO[]) => void, error: (status: any) => void): void;
    create(fileId: number, value: "BAD" | "MEDIUM" | "GOOD", success: () => void, error: (status: any) => void): void;
    update(ratingId: number, value: "BAD" | "MEDIUM" | "GOOD", success: () => void, error: (status: any) => void): void;
    remove(ratingId: number, success: () => void, error: (status: any) => void): void;
};
export declare class UserFilesViewHandler {
    private view;
    private userService;
    private fileService;
    private favouritesService;
    private ratingService;
    private nav;
    private currentUser;
    private currentUserUid;
    private currentUserIsAdmin;
    private uploaderId;
    private currentFiles;
    constructor(view: UserFilesView, userService: UserService, fileService: FileService, favouritesService: FavouritesService, ratingService: RatingService, nav?: Navigator);
    init(): void;
    private reloadFilesForUploader;
    private loadRatingsForCurrentFiles;
    private onDownloadClicked;
    private onReportClicked;
    private onDeleteClicked;
    private onFavouriteClicked;
    private onRateClicked;
}
export {};
//# sourceMappingURL=UserFilesViewHandler.d.ts.map