import { User } from "../../vo/User.js";
import { File } from "../../vo/File.js";
export declare class UserView {
    private profileImg;
    private lastBlobUrl;
    private roleLabel;
    private username;
    private btnChange;
    private picker;
    private favouritesList;
    private btnDeleteAccount;
    private adminPanel;
    private reportedFileList;
    private blockedUsersList;
    constructor();
    renderUser(user: User): void;
    showAdminPanel(show: boolean): void;
    renderProfilePicture(objectUrl: string): void;
    setProfileImage(url: string | null): void;
    bindChangeProfilePic(handler: () => void): void;
    openProfilePicker(): void;
    bindProfilePicSelected(handler: (file: globalThis.File) => void): void;
    bindChangeProfilePicClick(): void;
    showProfilePicturePreview(file: globalThis.File): void;
    setProfilePreviewUrl(url: string): void;
    showError(msg: string): void;
    renderReportedFiles(files: File[]): void;
    bindReportedFileActions(handler: (action: "unreport" | "delete" | "block", fileId: number, uploaderId: string, fileName: string, uploaderName: string, uploaderPic: string) => void): void;
    bindBlockedUserActions(handler: (action: "unblock", userId: string, userName: string, userPic: string | null) => void): void;
    renderBlockedUsers(users: any[]): void;
    bindBlockedUsersActions(handler: (userId: number) => void): void;
    renderFavourites(items: {
        fileId: number;
        name: string;
    }[]): void;
    bindFavouriteAction(handler: (fileId: number, action: "download" | "unfavourite") => void): void;
    bindDeleteAccountClick(handler: () => void): void;
}
//# sourceMappingURL=UserView.d.ts.map