import { User } from "../../vo/User.js";
import { File } from "../../vo/File.js";
import { UserView } from "./UserView.js";

export type UserService = {
  getCurrentUser(success: (u: User|null)=>void, error:(s:any)=>void): void;
  logout(success: ()=>void, error:(s:any)=>void): void;
  updateProfilePicture(file: globalThis.File, success: (url: string)=>void, error:(s:any)=>void): void;

  getReportedFiles(success:(files: File[])=>void, error:(s:any)=>void): void;
  acceptFile(fileId:number, success:()=>void, error:(s:any)=>void): void;
  deleteFile(fileId:number, success:()=>void, error:(s:any)=>void): void;
  blockUploaderOfFile(fileId:number, success:()=>void, error:(s:any)=>void): void;

  getBlockedUsers(success:(users: User[])=>void, error:(s:any)=>void): void;
  setBlocked(userId:number, blocked:boolean, success:()=>void, error:(s:any)=>void): void;
  unblockUser(userId:number, success:()=>void, error:(s:any)=>void): void;
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
        this.view.showAdminPanel(u.getIsAdmin());

        this.view.bindReportedFileActions((action, fileId, uploaderId) => {
          this.onReportedAction(action, fileId, uploaderId);
        });
        this.view.bindBlockedUserActions((action, userId) => {
          this.onBlockedAction(action, userId);
        });

        this.view.bindChangeProfilePicClick();
        this.view.bindProfilePicSelected((file) => this.onProfilePicSelected(file));


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
    this.fileService.getReportedFiles(
      (files) => this.view.renderReportedFiles(files),
      (status) => this.view.showError(`Failed to load reported files: ${String(status)}`)
    );

    this.userService.getBlockedUsers(
      (users) => this.view.renderBlockedUsers(users),
      (status) => this.view.showError(`Failed to load blocked users: ${String(status)}`)
    );
  }


  private onReportedAction(action: "accept" | "delete" | "block", fileId: number, uploaderId: number): void {
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

  private onBlockedAction(action: "unblock", userId: number): void {
    this.userService.setBlocked(userId, false,
      () => this.loadAdminData(),
      (s) => this.view.showError(`Unblock failed: ${String(s)}`)
    );
  }

}
