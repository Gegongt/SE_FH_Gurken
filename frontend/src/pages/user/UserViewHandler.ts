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
    success: () => void,
    error: (e: any) => void
  ): void;

  unblockUser(userId: string, success:()=>void, error:(s:any)=>void): void;
};

export type FavouriteDTO = { userid: string; fileid: number };

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
    reported: boolean,
    success: (updated: File) => void,
    error: (status: any) => void
  ): void;

  downloadFile(fileId: number, success: (filename?: string) => void, error: (status: any) => void): void;
};


export class UserViewHandler {
  private currentUser: User | null = null;
  private favouriteFileIds: number[] = [];

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

        this.view.bindReportedFileActions((action, fileId, uploaderId) => {
          this.onReportedAction(action, fileId, uploaderId);
        });

        this.view.bindBlockedUserActions((action, userId) => {
          this.onBlockedAction(action, userId);
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


  updateProfilePicture(
    file: globalThis.File,
    success: (url: string) => void,
    error: (s: any) => void
  ): void {
    const fd = new FormData();
    fd.append("file", file); 

    fetch("http://localhost:3000/api/users/profilepicture", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessTokenUtil.getAccessToken()}`
      },
      body: fd
    })
      .then(async (r) => {
        if (!r.ok) throw await r.text();
        return r.json();
      })
      .then((_userJson) => {
        this.getProfilePicture(success, error);
      })
      .catch((e) => error(e));
  }

  getProfilePicture(
    success: (objectUrl: string) => void,
    error: (e: any) => void
  ): void {
    fetch("http://localhost:3000/api/users/profilepicture", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessTokenUtil.getAccessToken()}`
      }
    })
      .then(async (r) => {
        if (r.status === 404) {

          success("");
          return;
        }
        if (!r.ok) throw await r.text();
        return r.blob();
      })
      .then((blob) => {
        if (!blob) return;
        const objectUrl = URL.createObjectURL(blob);
        success(objectUrl);
      })
      .catch((e) => error(e));
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
        this.favouriteFileIds = this.favouriteFileIds.filter(id => id !== fileId);
        this.view.renderFavourites(this.favouriteFileIds as any);
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
  }

  private loadFavourites(): void {
    const uid = this.currentUser ? String(this.currentUser.getId()) : null;
    if (!uid) return;

    this.favouritesService.getFavourites(
      uid,
      (rows) => {
        this.favouriteFileIds = rows.map(r => Number(r.fileid));
        this.view.renderFavourites(this.favouriteFileIds as any); 
      },
      (e) => this.view.showError(`Failed to load favourites: ${String(e)}`)
    );
  }


  private onReportedAction(action: "accept" | "delete" | "block", fileId: number, uploaderId: string): void {
    if (action === "accept") {
      this.fileService.reportFile(fileId, false,
        () => this.loadAdminData(),
        (s) => this.view.showError(`Accept failed: ${String(s)}`)
      );
      return;
    }

    if (action === "delete") {
      this.fileService.deleteFile(fileId,
        () => this.loadAdminData(),
        (s) => this.view.showError(`Delete failed: ${String(s)}`)
      );
      return;
    }

    if (action === "block") {
      this.userService.setBlocked(uploaderId, true,
        () => this.loadAdminData(),
        (s) => this.view.showError(`Block failed: ${String(s)}`)
      );
    }
  }

  private onBlockedAction(action: "unblock", userId: string): void {
    this.userService.setBlocked(userId, false,
      () => this.loadAdminData(),
      (s) => this.view.showError(`Unblock failed: ${String(s)}`)
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
