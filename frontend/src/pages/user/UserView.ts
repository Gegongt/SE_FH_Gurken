import { User } from "../../vo/User.js";
import { File } from "../../vo/File.js";

export class UserView {
  private profileImg = document.getElementById("profileImg") as HTMLImageElement;
  private lastBlobUrl: string | null = null;
  private roleLabel: HTMLElement;
  private username = document.getElementById("username") as HTMLDivElement;
  private btnChange = document.getElementById("btnChangeProfilePic") as HTMLButtonElement;
  private picker = document.getElementById("profilePicPicker") as HTMLInputElement;
  private favouritesList: HTMLUListElement;
  private btnDeleteAccount: HTMLButtonElement;

  private adminPanel= document.getElementById("adminPanel") as HTMLDivElement;
  private reportedFileList = document.getElementById("reportedFileList") as HTMLUListElement;
  private blockedUsersList = document.getElementById("blockedUsersList") as HTMLUListElement;

  constructor() {
    const btn = document.getElementById("btnChangeProfilePic");
    const picker = document.getElementById("profilePicPicker");
    this.roleLabel = document.getElementById("roleLabel")!;
    const favList = document.getElementById("favouritesList");
    const delBtn = document.getElementById("btnDeleteAccount");

    if (!(btn instanceof HTMLButtonElement)) throw new Error("btnChangeProfilePic not found");
    if (!(picker instanceof HTMLInputElement)) throw new Error("profilePicPicker not found");
    if (!(favList instanceof HTMLUListElement)) throw new Error("favouritesList not found");
    if (!(delBtn instanceof HTMLButtonElement)) throw new Error("btnDeleteAccount not found");

    this.btnChange = btn;
    this.picker = picker;
    this.favouritesList = favList;
    this.btnDeleteAccount = delBtn;
  }

  renderUser(user: User): void {
    this.roleLabel.textContent = user.getIsAdmin() ? "Admin" : "User";
    this.username.textContent = `Logged in as: ${user.getName()} (${user.getEmail()})`;

    const img = document.getElementById("profileImg") as HTMLImageElement | null;
    if (img) {
      img.src = ""; 
    }
  }


  showAdminPanel(show: boolean): void {
    this.adminPanel.style.display = show ? "block" : "none";
 }

   renderProfilePicture(objectUrl: string): void {
    const img = document.getElementById("profileImg") as HTMLImageElement;
    if (!img) return;

    if (!objectUrl) {
      img.src = ""; 
      return;
    }
    img.src = objectUrl;
  }

  setProfileImage(url: string | null): void {
    const img = document.getElementById("profileImg") as HTMLImageElement | null;
    if (!img) return;

    if (this.lastBlobUrl) URL.revokeObjectURL(this.lastBlobUrl);
    this.lastBlobUrl = url;

    img.src = url ?? "";
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

  renderReportedFiles(files: File[]): void {
    this.reportedFileList.innerHTML = "";

    if (!files || files.length === 0) {
      this.reportedFileList.innerHTML =
        `<li class="list-group-item text-muted">No reported files</li>`;
      return;
    }

    for (const f of files) {
      const uploader = (f as any).getUploader?.() ?? (f as any).uploader;

      const uploaderName = uploader?.getName?.() ?? uploader?.name ?? "unknown";
      const uploaderEmail = uploader?.getEmail?.() ?? uploader?.email ?? "";
      const uploaderId = uploader?.getId?.() ?? uploader?.id ?? "";
      const uploaderPic = uploader?.profilepicturename ?? uploader?.getProfilePictureName?.() ?? null;

      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-start";
      li.setAttribute("data-file-id", String(f.getId()));
      li.setAttribute("data-file-name", f.getName());
      li.setAttribute("data-uploader-id", String(uploaderId));
      li.setAttribute("data-uploader-name", uploaderName);
      li.setAttribute("data-uploader-pic", uploaderPic ?? "");

      li.innerHTML = `
        <div class="me-3">
          <div class="fw-semibold">${f.getName()}</div>
          <div class="small text-muted">
            Uploader: ${uploaderName}${uploaderEmail ? ` (${uploaderEmail})` : ""}
          </div>
        </div>

        <div class="d-flex gap-2">
          <button class="btn btn-outline-secondary btn-sm" data-action="unreport">Unreport</button>
          <button class="btn btn-outline-danger btn-sm" data-action="delete">Delete</button>
          <button class="btn btn-primary btn-sm " data-action="block">Block user</button>
        </div>
      `;

      this.reportedFileList.appendChild(li);
    }
  }

  bindReportedFileActions(
    handler: (action: "unreport" | "delete" | "block", fileId: number, uploaderId: string, fileName: string, uploaderName: string, uploaderPic: string) => void
  ): void {
    this.reportedFileList.addEventListener("click", (e) => {
      const btn = (e.target as HTMLElement).closest("button[data-action]") as HTMLButtonElement | null;
      if (!btn) return;

      const action = btn.getAttribute("data-action") as any;
      if (action !== "unreport" && action !== "delete" && action !== "block") return;

      const li = btn.closest("li[data-file-id]") as HTMLLIElement | null;
      if (!li) return;

      const fileId = Number(li.getAttribute("data-file-id"));
      const uploaderId = String(li.getAttribute("data-uploader-id") ?? "");
      const fileName = String(li.getAttribute("data-file-name") ?? "");
      const uploaderName = String(li.getAttribute("data-uploader-name") ?? "");
      const uploaderPic = String(li.getAttribute("data-uploader-pic") ?? "");

      if (!Number.isFinite(fileId) || !uploaderId) return;
      handler(action, fileId, uploaderId, fileName, uploaderName, uploaderPic);
    });
  }


  bindBlockedUserActions(
    handler: (action: "unblock", userId: string, userName: string, userPic: string | null) => void
  ): void {
    this.blockedUsersList.addEventListener("click", (e) => {
      const btn = (e.target as HTMLElement).closest("button[data-action]") as HTMLButtonElement | null;
      if (!btn) return;

      const action = btn.getAttribute("data-action");
      if (action !== "unblock") return;

      const li = btn.closest("li[data-user-id]") as HTMLLIElement | null;
      if (!li) return;

      const userId = String(li.getAttribute("data-user-id") ?? "");
      const userName = String(li.getAttribute("data-user-name") ?? "");
      const userPicAttr = String(li.getAttribute("data-user-pic") ?? "");
      const userPic = userPicAttr.length > 0 ? userPicAttr : null;

      if (!userId) return;
      handler("unblock", userId, userName, userPic);
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
      li.setAttribute("data-user-name", u.getName());
      li.setAttribute("data-user-pic", (u as any).getProfilePictureName?.() ?? (u as any).profilepicturename ?? "");

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

  renderFavourites(items: { fileId: number; name: string }[]): void {
    this.favouritesList.innerHTML = "";

    if (items.length === 0) {
      this.favouritesList.innerHTML = "<li>No favourites yet</li>";
      return;
    }

    for (const item of items) {
      const li = document.createElement("li");
      li.setAttribute("data-file-id", String(item.fileId));

      li.innerHTML = `
        <span><b>${item.name}</b></span>
        <div style="margin-top:6px;">
          <button class="btn btn-primary btn-sm " data-action="download">Download</button>
          <button data-action="unfavourite">Unfavourite</button>
        </div>
      `;

      this.favouritesList.appendChild(li);
    }
  }

  bindFavouriteAction(handler: (fileId: number, action: "download" | "unfavourite") => void): void {
    this.favouritesList.addEventListener("click", (e) => {
      const btn = (e.target as HTMLElement).closest("button");
      if (!btn) return;

      const action = btn.getAttribute("data-action");
      if (action !== "download" && action !== "unfavourite") return;

      const li = btn.closest("li");
      const idStr = li?.getAttribute("data-file-id");
      if (!idStr) return;

      handler(Number(idStr), action);
    });
  }

  bindDeleteAccountClick(handler: () => void): void {
    this.btnDeleteAccount.addEventListener("click", handler);
  }
  
}
