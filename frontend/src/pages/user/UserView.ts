import { User } from "../../vo/User.js";
import { File } from "../../vo/File.js";

export class UserView {
  private profileImg = document.getElementById("profileImg") as HTMLImageElement;
  private username = document.getElementById("username") as HTMLDivElement;
  private btnChange = document.getElementById("btnChangeProfilePic") as HTMLButtonElement;
  private picker = document.getElementById("profilePicPicker") as HTMLInputElement;

  private adminArea = document.getElementById("adminArea") as HTMLDivElement;
  private reportedFilesList = document.getElementById("reportedFilesList") as HTMLUListElement;
  private blockedUsersList = document.getElementById("blockedUsersList") as HTMLUListElement;

  renderUser(user: User): void {
    this.username.textContent = `Logged in as: ${user.getName()}`;

    //this.profileImg.src = user.getProfileImageUrl?.() ?? "https://via.placeholder.com/96";
  }

  showAdminArea(show: boolean): void {
    this.adminArea.style.display = show ? "block" : "none";
  }

  bindChangeProfilePic(handler: () => void): void {
    this.btnChange.addEventListener("click", handler);
  }

  openProfilePicker(): void {
    this.picker.value = "";
    this.picker.click();
  }

  bindProfilePicSelected(handler: (file: globalThis.File) => void): void {
    this.picker.addEventListener("change", () => {
      const f = this.picker.files?.[0];
      if (f) handler(f);
    });
  }

  renderReportedFiles(files: File[]): void {
    this.reportedFilesList.innerHTML = "";
    if (files.length === 0) {
      this.reportedFilesList.innerHTML = "<li>No reported files</li>";
      return;
    }
    for (const f of files) {
      const li = document.createElement("li");
      li.setAttribute("data-file-id", String(f.getId()));
      li.innerHTML = `
        <b>${f.getName()}</b>
        <button data-action="accept">Accept</button>
        <button data-action="delete">Delete</button>
        <button data-action="block">Block uploader</button>
      `;
      this.reportedFilesList.appendChild(li);
    }
  }

  bindReportedFilesActions(handler: (fileId: number, action: "accept"|"delete"|"block") => void): void {
    this.reportedFilesList.addEventListener("click", (e) => {
      const btn = (e.target as HTMLElement).closest("button");
      if (!btn) return;

      const li = btn.closest("li");
      const idStr = li?.getAttribute("data-file-id");
      if (!idStr) return;

      const action = btn.getAttribute("data-action") as any;
      if (action !== "accept" && action !== "delete" && action !== "block") return;

      handler(Number(idStr), action);
    });
  }

  renderBlockedUsers(users: User[]): void {
    this.blockedUsersList.innerHTML = "";
    if (users.length === 0) {
      this.blockedUsersList.innerHTML = "<li>No blocked users</li>";
      return;
    }
    for (const u of users) {
      const li = document.createElement("li");
      li.setAttribute("data-user-id", String(u.getId()));
      li.innerHTML = `
        <b>${u.getName()}</b>
        <button data-action="unblock">Unblock</button>
      `;
      this.blockedUsersList.appendChild(li);
    }
  }

  bindBlockedUsersActions(handler: (userId: number) => void): void {
    this.blockedUsersList.addEventListener("click", (e) => {
      const btn = (e.target as HTMLElement).closest("button");
      if (!btn) return;
      if (btn.getAttribute("data-action") !== "unblock") return;

      const li = btn.closest("li");
      const idStr = li?.getAttribute("data-user-id");
      if (!idStr) return;

      handler(Number(idStr));
    });
  }

  showError(msg: string): void {
    alert(msg);
  }
}
