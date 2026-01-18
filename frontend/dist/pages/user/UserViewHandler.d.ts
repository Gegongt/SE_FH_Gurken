import { User } from "../../vo/User.js";
import { File } from "../../vo/File.js";
import { UserView } from "./UserView.js";
export type UserService = {
    getCurrentUser(success: (u: User | null) => void, error: (s: any) => void): void;
    logout(success: () => void, error: (s: any) => void): void;
    updateProfilePicture(file: globalThis.File, success: () => void, error: (s: any) => void): void;
    getProfilePicture(success: (url: string | null) => void, error: (e: any) => void): void;
    deleteOwnUser(success: () => void, error: (e: any) => void): void;
    getReportedFiles(success: (files: File[]) => void, error: (s: any) => void): void;
    acceptFile(fileId: number, success: () => void, error: (s: any) => void): void;
    deleteFile(fileId: number, success: () => void, error: (s: any) => void): void;
    blockUploaderOfFile(fileId: number, success: () => void, error: (s: any) => void): void;
    getBlockedUsers(isBlocked: boolean, success: (users: User[]) => void, error: (e: any) => void): void;
    setBlocked(userId: string, blocked: boolean, name: string, profilePictureName: string | null, success: () => void, error: (e: any) => void): void;
    unblockUser(userId: string, success: () => void, error: (s: any) => void): void;
};
export type FavouriteDTO = {
    userid: string;
    fileid: number;
};
export type FavouriteItemVM = {
    fileId: number;
    name: string;
};
export type FavouritesService = {
    getFavourites(userId: string, success: (favs: FavouriteDTO[]) => void, error: (e: any) => void): void;
    removeFavourite(userId: string, fileId: number, success: () => void, error: (e: any) => void): void;
};
export type FileService = {
    getFiles(subcategoryId: number, shallow: boolean, success: (files: File[]) => void, error: (status: any) => void): void;
    getReportedFiles(success: (files: File[]) => void, error: (status: any) => void): void;
    deleteFile(fileId: number, success: () => void, error: (status: any) => void): void;
    reportFile(fileId: number, name: string, reported: boolean, success: (updated: File) => void, error: (status: any) => void): void;
    downloadFile(fileId: number, success: (filename?: string) => void, error: (status: any) => void): void;
    getAllFiles(success: (files: File[]) => void, error: (status: any) => void): void;
};
export declare class UserViewHandler {
    private view;
    private userService;
    private favouritesService;
    private fileService;
    private currentUser;
    private favouriteFileIds;
    private favourites;
    constructor(view: UserView, userService: UserService, favouritesService: FavouritesService, fileService: FileService);
    init(): void;
    onProfilePicSelected(file: globalThis.File): void;
    private onUnfavourite;
    private onDownload;
    private loadAdminData;
    private loadFavourites;
    private onReportedAction;
    private onBlockedAction;
    private onDeleteAccountClicked;
}
//# sourceMappingURL=UserViewHandler.d.ts.map