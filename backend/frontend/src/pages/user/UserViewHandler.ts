import { User } from "../../vo/User.js";
import { File } from "../../vo/File.js";
import { UserView } from "./UserView.js";

export type UserService = {
  getCurrentUser(success: (u: User|null)=>void, error:(s:any)=>void): void;
  logout(success: ()=>void, error:(s:any)=>void): void;
  updateProfilePicture(file: globalThis.File, success: (url: string)=>void, error:(s:any)=>void): void;
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
};


export class UserViewHandler {
  private currentUser: User | null = null;

  constructor(private view: UserView, private userService: UserService, private fileService: FileService) {}

  init(): void {
    this.userService.getCurrentUser(
      (u) => {
        if (!u) {
          window.location.href = "../login/login.html";
          return;
        }

        this.currentUser = u;
        this.view.renderUser(u);
        this.view.renderFavourites(u.getFavourites());

        this.view.bindReportedFileActions((action, fileId, uploaderId) => {
          this.onReportedAction(action, fileId, uploaderId);
        });

        this.view.bindBlockedUserActions((action, userId) => {
          this.onBlockedAction(action, userId);
        });

        this.view.bindFavouriteAction((fileId, action) => {
          if (action === "download") window.open(`/api/files/${fileId}/download`, "_blank");

          if (action === "remove") {
            this.userService.getCurrentUser((u) => {
              if (!u) return;
              u.removeFavourite(fileId);
              this.view.renderFavourites(u.getFavourites());
            }, () => {});
          }
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
      (url) => {
        if (this.currentUser) {
          this.view.renderUser(this.currentUser);
        }
      },
      (err) => this.view.showError(String(err))
    );
  }



  private loadAdminData(): void {

    this.userService.getBlockedUsers(
      true, 
      (users) => this.view.renderBlockedUsers(users),
      (err) => this.view.showError(`Failed to load blocked users`)
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
