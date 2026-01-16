import { User } from "../../vo/User.js";
import { File } from "../../vo/File.js";

export class UserView {
  private profileImg = document.getElementById("profileImg") as HTMLImageElement;
  private roleLabel: HTMLElement;
  private username = document.getElementById("username") as HTMLDivElement;
  private btnChange = document.getElementById("btnChangeProfilePic") as HTMLButtonElement;
  private picker = document.getElementById("profilePicPicker") as HTMLInputElement;
  private favouritesList: HTMLUListElement;

  private adminPanel= document.getElementById("adminPanel") as HTMLDivElement;
  private reportedFilesList = document.getElementById("reportedFilesList") as HTMLUListElement;
  private blockedUsersList = document.getElementById("blockedUsersList") as HTMLUListElement;

  constructor() {
    const btn = document.getElementById("btnChangeProfilePic");
    const picker = document.getElementById("profilePicPicker");
    this.roleLabel = document.getElementById("roleLabel")!;
    const favList = document.getElementById("favouritesList");

    if (!(btn instanceof HTMLButtonElement)) throw new Error("btnChangeProfilePic not found");
    if (!(picker instanceof HTMLInputElement)) throw new Error("profilePicPicker not found");
    if (!(favList instanceof HTMLUListElement)) throw new Error("favouritesList not found");

    this.btnChange = btn;
    this.picker = picker;
    this.favouritesList = favList;
  }

  renderUser(user: User): void {
    this.roleLabel.textContent = user.getIsAdmin() ? "Admin" : "User";
    this.username.textContent = `Logged in as: ${user.getName()} (${user.getEmail()})`;

    const pictureName = user.getProfilePictureName();
    if (pictureName) {
      this.profileImg.src = pictureName;
    } else {
      this.profileImg.src = "";
    }
  }


  showAdminPanel(show: boolean): void {
    this.adminPanel.style.display = show ? "block" : "none";
 }


  bindChangeProfilePic(handler: () => void): void {
    this.btnChange.addEventListener("click", handler);
  }

  openProfilePicker(): void {
    this.picker.value = "";
    this.picker.click();
  }

  bindProfilePicSelected(handler: (file: globalThis.File) => void): void {
    const input = document.getElementById("profilePicPicker") as HTMLInputElement | null;
    if (!input) throw new Error("profilePicPicker not found");

    input.onchange = () => {             
      const f = input.files?.[0];
      if (f) handler(f);
    };
  }

  bindChangeProfilePicClick(): void {
    const btn = document.getElementById("btnChangeProfilePic") as HTMLButtonElement | null;
    const input = document.getElementById("profilePicPicker") as HTMLInputElement | null;
    if (!btn || !input) return;

    btn.onclick = () => {
      input.value = "";
      input.click();
    };
  }

  showProfilePicturePreview(file: globalThis.File): void {
    const img = document.getElementById("profileImg") as HTMLImageElement;
    if (!img) return;

    const url = URL.createObjectURL(file);
    img.src = url;
  }

  setProfilePreviewUrl(url: string): void {
    this.profileImg.src = url;
  }

  showError(msg: string): void {
    console.error(msg);
    alert(msg);
  }

  renderReportedFiles(files: any[]): void {
    this.reportedFilesList.innerHTML = "";

    if (!files || files.length === 0) {
      this.reportedFilesList.innerHTML = "<li>No reported files.</li>";
      return;
    }

    for (const f of files) {
      const li = document.createElement("li");
      li.setAttribute("data-file-id", String(f.getId()));
      li.setAttribute("data-uploader-id", String(f.getUploader().getId()));

      li.innerHTML = `
        <b>${f.getName()}</b> (Uploader: ${f.getUploader().getName()})
        <button data-action="accept">Accept</button>
        <button data-action="delete">Delete</button>
        <button data-action="block">Block user</button>
      `;
      this.reportedFilesList.appendChild(li);
    }
  }

  bindReportedFileActions(
    handler: (action: "accept" | "delete" | "block", fileId: number, uploaderId: number) => void
  ): void {
    const list = document.getElementById("reportedFilesList");
    if (!list) return;

    list.addEventListener("click", (e) => {
      const target = e.target as HTMLElement | null;
      const btn = target?.closest("button");
      if (!btn) return;

      const action = btn.getAttribute("data-action") as any;
      const fileId = Number(btn.getAttribute("data-file-id"));
      const uploaderId = Number(btn.getAttribute("data-uploader-id"));

      if (!action || !Number.isFinite(fileId) || !Number.isFinite(uploaderId)) return;

      handler(action, fileId, uploaderId);
    });
  }


  bindBlockedUserActions(
    handler: (action: "unblock", userId: number) => void
  ): void {
    this.blockedUsersList.addEventListener("click", (e) => {
      const btn = (e.target as HTMLElement).closest("button");
      if (!btn) return;

      const action = btn.getAttribute("data-action") as any;
      const li = btn.closest("li");
      if (!li) return;

      const userId = Number(li.getAttribute("data-user-id"));
      if (!Number.isFinite(userId)) return;

      handler(action, userId);
    });
  }

  renderBlockedUsers(users: any[]): void {
    this.blockedUsersList.innerHTML = "";

    if (!users || users.length === 0) {
      this.blockedUsersList.innerHTML = "<li>No blocked users.</li>";
      return;
    }

    for (const u of users) {
      const li = document.createElement("li");
      li.setAttribute("data-user-id", String(u.getId()));
      li.innerHTML = `
        <b>${u.getName()}</b> (${u.getEmail()})
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

  renderFavourites(files: import("../../vo/File.js").File[]): void {
    this.favouritesList.innerHTML = "";

    if (files.length === 0) {
      this.favouritesList.innerHTML = "<li>No favourites yet</li>";
      return;
    }

    for (const f of files) {
      const li = document.createElement("li");
      li.setAttribute("data-file-id", String(f.getId()));
      li.innerHTML = `
        <span><b>${f.getName()}</b></span>
        <button data-action="remove">Remove</button>
        <button data-action="download">Download</button>
      `;
      this.favouritesList.appendChild(li);
    }
  }

  bindFavouriteAction(handler: (fileId: number, action: "remove" | "download") => void): void {
    this.favouritesList.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const btn = target.closest("button");
      if (!btn) return;

      const action = btn.getAttribute("data-action");
      if (action !== "remove" && action !== "download") return;

      const li = btn.closest("li");
      const idStr = li?.getAttribute("data-file-id");
      if (!idStr) return;

      handler(Number(idStr), action);
    });
  }
  
}
