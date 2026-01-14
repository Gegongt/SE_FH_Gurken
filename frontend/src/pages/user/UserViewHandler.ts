import { User } from "../../vo/User.js";
import { File } from "../../vo/File.js";
import { UserView } from "./UserView.js";

export type UserService = {
  getCurrentUser(success: (u: User|null)=>void, error:(s:any)=>void): void;
  logout(success: ()=>void, error:(s:any)=>void): void;
  updateProfilePic(file: globalThis.File, success: (url: string)=>void, error:(s:any)=>void): void;

  // admin:
  getReportedFiles(success:(files: File[])=>void, error:(s:any)=>void): void;
  acceptFile(fileId:number, success:()=>void, error:(s:any)=>void): void;
  deleteFile(fileId:number, success:()=>void, error:(s:any)=>void): void;
  blockUploaderOfFile(fileId:number, success:()=>void, error:(s:any)=>void): void;

  getBlockedUsers(success:(users: User[])=>void, error:(s:any)=>void): void;
  unblockUser(userId:number, success:()=>void, error:(s:any)=>void): void;
};

export class UserViewHandler {
  private currentUser: User | null = null;

  constructor(private view: UserView, private userService: UserService) {}

  init(): void {
    this.userService.getCurrentUser(
      (u) => {
        if (!u) {
          window.location.href = "../login/login.html";
          return;
        }

        this.currentUser = u;
        this.view.renderUser(u);

        this.view.bindChangeProfilePic(() => this.view.openProfilePicker());
        this.view.bindProfilePicSelected((file) => this.onProfilePicSelected(file));

        const isAdmin = u.getIsAdmin?.() ?? false;
        this.view.showAdminArea(isAdmin);

        if (isAdmin) this.loadAdminData();
      },
      (status) => this.view.showError(`getCurrentUser failed: ${String(status)}`)
    );
  }

  private onProfilePicSelected(file: globalThis.File): void {
    this.userService.updateProfilePic(
      file,
      (url) => {
        (document.getElementById("profileImg") as HTMLImageElement).src = url;
      },
      (status) => this.view.showError(`Profile pic update failed: ${String(status)}`)
    );
  }

  private loadAdminData(): void {
    this.userService.getReportedFiles(
      (files) => this.view.renderReportedFiles(files),
      (status) => this.view.showError(`Failed to load reported files: ${String(status)}`)
    );

    this.userService.getBlockedUsers(
      (users) => this.view.renderBlockedUsers(users),
      (status) => this.view.showError(`Failed to load blocked users: ${String(status)}`)
    );

    this.view.bindReportedFilesActions((fileId, action) => this.onReportedFileAction(fileId, action));
    this.view.bindBlockedUsersActions((userId) => this.onUnblock(userId));
  }

  private onReportedFileAction(fileId: number, action: "accept"|"delete"|"block"): void {
    const done = () => this.loadAdminData();
    const fail = (s:any) => this.view.showError(`${action} failed: ${String(s)}`);

    if (action === "accept") this.userService.acceptFile(fileId, done, fail);
    if (action === "delete") this.userService.deleteFile(fileId, done, fail);
    if (action === "block") this.userService.blockUploaderOfFile(fileId, done, fail);
  }

  private onUnblock(userId: number): void {
    this.userService.unblockUser(
      userId,
      () => this.loadAdminData(),
      (s) => this.view.showError(`Unblock failed: ${String(s)}`)
    );
  }
}
