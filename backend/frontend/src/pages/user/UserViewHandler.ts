import { User } from "../../vo/User.js";
import { File } from "../../vo/File.js";
import { UserView } from "./UserView.js";
import { accessTokenUtil } from "../../service/http/AccessTokenUtil.js";

export type UserService = {
  getCurrentUser(success: (u: User|null)=>void, error:(s:any)=>void): void;
  logout(success: ()=>void, error:(s:any)=>void): void;
  updateProfilePicture(file: globalThis.File, success: ()=>void, error:(s:any)=>void): void;
  getProfilePicture(success: (url: string | null) => void, error: (e:any)=>void): void;


  deleteOwnUser(success: () => void, error: (e: any) => void): void;

  getReportedFiles(success:(files: File[])=>void, error:(s:any)=>void): void;
  acceptFile(fileId:number, success:()=>void, error:(s:any)=>void): void;
  deleteFile(fileId:number, success:()=>void, error:(s:any)=>void): void;
  blockUploaderOfFile(fileId:number, success:()=>void, error:(s:any)=>void): void;

  getBlockedUsers(
    isBlocked: boolean,
    success: (users: User[]) => void,
    error: (e: any) => void
  ): void;

  setBlocked(
    userId: string,
    blocked: boolean,
    name: string,
    profilePictureName: string | null,
    success: () => void,
    error: (e: any) => void
  ): void;

  unblockUser(userId: string, success:()=>void, error:(s:any)=>void): void;
};

export type FavouriteDTO = { userid: string; fileid: number };

export type FavouriteItemVM = {
  fileId: number;
  name: string;
};


export type FavouritesService = {
  getFavourites(userId: string, success: (favs: FavouriteDTO[]) => void, error: (e: any) => void): void;
  removeFavourite(userId: string, fileId: number, success: () => void, error: (e: any) => void): void;
};

export type FileService = {
  getFiles(
    subcategoryId: number,
    shallow: boolean,
    success: (files: File[]) => void,
    error: (status: any) => void
  ): void;

  getReportedFiles(
    success: (files: File[]) => void,
    error: (status: any) => void
  ): void;

  deleteFile(
    fileId: number,
    success: () => void,
    error: (status: any) => void
  ): void;

reportFile(
  fileId: number,
  name: string,
  reported: boolean,
  success: (updated: File) => void,
  error: (status: any) => void
): void;


  downloadFile(fileId: number, success: (filename?: string) => void, error: (status: any) => void): void;
  getAllFiles(success: (files: File[]) => void, error: (status: any) => void): void;
};


export class UserViewHandler {
  private currentUser: User | null = null;
  private favouriteFileIds: number[] = [];
  private favourites: FavouriteItemVM[] = [];


  constructor(private view: UserView, private userService: UserService, private favouritesService: FavouritesService, private fileService: FileService) {}

  init(): void {
    this.userService.getCurrentUser(
      (u) => {
        if (!u) {
          window.location.href = "../login/login.html";
          return;
        }

        this.currentUser = u;
        this.view.renderUser(u);
        this.loadFavourites();

        this.userService.getProfilePicture(
          (url) => this.view.setProfileImage(url),
          (_e) => this.view.setProfileImage(null)
        );

        this.view.bindReportedFileActions((action, fileId, uploaderId, fileName, uploaderName, uploaderPic) => {
          this.onReportedAction(action, fileId, uploaderId, fileName, uploaderName, uploaderPic);
        });

        this.view.bindBlockedUserActions((action, userId, userName, userPic) => {
          this.onBlockedAction(action, userId, userName, userPic);
        });

      this.view.bindFavouriteAction((fileId, action) => {
        if (action === "download") this.onDownload(fileId);
        if (action === "unfavourite") this.onUnfavourite(fileId);
      });

        this.view.bindChangeProfilePicClick();
        this.view.bindProfilePicSelected((file) => this.onProfilePicSelected(file));
        this.view.bindDeleteAccountClick(() => this.onDeleteAccountClicked());

        const isAdmin = u.getIsAdmin?.() ?? false;
        this.view.showAdminPanel(isAdmin);

         if (u.getIsAdmin()) {
        this.loadAdminData();
         }
      },
      (status) => this.view.showError(`getCurrentUser failed: ${String(status)}`)
    );
  }

  onProfilePicSelected(file: globalThis.File): void {
    this.view.showProfilePicturePreview(file);

    this.userService.updateProfilePicture(
      file,
      () => {
        this.userService.getProfilePicture(
          (url) => this.view.setProfileImage(url),
          (_e) => this.view.setProfileImage(null)
        );
      },
      (err) => this.view.showError(String(err))
    );
  }

  private onUnfavourite(fileId: number): void {
    const uid = this.currentUser ? String(this.currentUser.getId()) : null;
    if (!uid) {
      this.view.showError("Not logged in.");
      return;
    }

    this.favouritesService.removeFavourite(
      uid,
      fileId,
      () => {
        this.favourites = this.favourites.filter(x => x.fileId !== fileId);
        this.view.renderFavourites(this.favourites as any);
      },
      (e) => this.view.showError(`Unfavourite failed: ${String(e)}`)
    );
  }


  private onDownload(fileId: number): void {
    this.fileService.downloadFile(
      fileId,
      (_filename) => {},
      (e) => this.view.showError(`Download failed: ${String(e)}`)
    );
  }

  private loadAdminData(): void {
    this.userService.getBlockedUsers(
      true, 
      (users) => this.view.renderBlockedUsers(users),
      (err) => this.view.showError(`Failed to load blocked users`)
    );

    this.fileService.getReportedFiles(
      (files) => this.view.renderReportedFiles(files),
      (err) => this.view.showError(`Failed to load reported files: ${String(err)}`)
    );
  }

  private loadFavourites(): void {
    const uid = this.currentUser ? String(this.currentUser.getId()) : null;
    if (!uid) return;

    this.favouritesService.getFavourites(
      uid,
      (rows) => {
        const favIds = rows.map(r => Number(r.fileid));

        this.fileService.getAllFiles(
          (allFiles) => {
            const nameById = new Map<number, string>();
            for (const f of allFiles) nameById.set(f.getId(), f.getName());

            this.favourites = favIds.map(id => ({
              fileId: id,
              name: nameById.get(id) ?? `File #${id}` 
            }));

            this.view.renderFavourites(this.favourites as any);
          },
          (_e) => {
            this.favourites = favIds.map(id => ({ fileId: id, name: `File #${id}` }));
            this.view.renderFavourites(this.favourites as any);
          }
        );
      },
      (e) => this.view.showError(`Failed to load favourites: ${String(e)}`)
    );
  }

  private onReportedAction(
    action: "unreport" | "delete" | "block",
    fileId: number,
    uploaderId: string,
    fileName: string,
    uploaderName: string,
    uploaderPic: string | null
  ): void {
    if (action === "unreport") {
      this.fileService.reportFile(
        fileId,
        fileName,
        false,
        () => this.loadAdminData(),
        (s) => this.view.showError(`Unreport failed: ${String(s)}`)
      );
      return;
    }

    if (action === "delete") {
      const ok = confirm("Delete this file?");
      if (!ok) return;

      this.fileService.deleteFile(
        fileId,
        () => this.loadAdminData(),
        (s) => this.view.showError(`Delete failed: ${String(s)}`)
      );
      return;
    }

    if (action === "block") {
      const ok = confirm(`Block this user (${uploaderId})?`);
      if (!ok) return;

      this.userService.setBlocked(
      uploaderId,
      true,
      uploaderName,
      uploaderPic || null,
      () => this.loadAdminData(),
      (e) => this.view.showError(`Block failed: ${String(e)}`)
    );
    }
  }


  private onBlockedAction(action: "unblock", userId: string, userName: string, userPic: string | null): void {
    this.userService.setBlocked(
      userId,
      false,
      userName,
      userPic,
      () => this.loadAdminData(),
      (e) => this.view.showError(`Unblock failed: ${String(e)}`)
    );
  }

  private onDeleteAccountClicked(): void {
    const ok = confirm("Really delete your account? This cannot be undone.");
    if (!ok) return;

    this.userService.deleteOwnUser(
      () => {
        window.location.href = "../login/login.html";
      },
      (err) => this.view.showError(`Delete failed: ${String(err)}`)
    );
  }


}
