import { File } from "../../vo/File.js";

export class UserFilesView {
  private list: HTMLUListElement;
  private uploaderLabel: HTMLElement;
  private errorBox: HTMLElement;

  constructor() {
    this.list = document.getElementById("userFileList") as HTMLUListElement;
    this.uploaderLabel = document.getElementById("uploaderLabel") as HTMLElement;
    this.errorBox = document.getElementById("errorBox") as HTMLElement;
  }

  setUploaderLabel(text: string): void {
    this.uploaderLabel.textContent = text;
  }

  showError(msg: string): void {
    this.errorBox.textContent = msg;
    this.errorBox.classList.remove("d-none");
  }

  clearError(): void {
    this.errorBox.classList.add("d-none");
    this.errorBox.textContent = "";
  }

  renderFilesLoading(): void {
    this.list.innerHTML = `<li class="list-group-item text-muted">Loading...</li>`;
  }

  renderFiles(files: File[]): void {
    this.list.innerHTML = "";

    if (!files || files.length === 0) {
      this.list.innerHTML = `<li class="list-group-item text-muted">No files</li>`;
      return;
    }

      for (const f of files) {
        const li = document.createElement("li");
        li.setAttribute("data-file-id", String(f.getId()));
        li.style.marginLeft = "18px";  
        li.style.marginBottom = "12px";
        li.style.listStyle = "none";
        
        const uploader = (f as any).getUploader?.() ?? (f as any).uploader;

        const uploaderName = uploader?.getName?.() ?? uploader?.name ?? "unknown";
        const uploaderEmail = uploader?.getEmail?.() ?? uploader?.email ?? "";
        const uploaderId = uploader?.getId?.() ?? uploader?.id ?? "";

        const isFav = (f as any).fav === true;
        const favBtnText = isFav ? `<i class="bi bi-bookmark-fill"></i>` : `<i class="bi bi-bookmark"></i>`;

        const reportedText = f.getIsReported() ? `<i class="bi bi-flag-fill"></i>` : `<i class="bi bi-flag"></i>`;
        const reportBtnText = f.getIsReported() ? `<i class="bi bi-flag-fill"></i>` : `<i class="bi bi-flag"></i>`;

        const canDelete = (f as any).canDelete === true;

        const summary = (f as any).ratingSummary;
        const scoreText = summary
          ? `Score: ${summary.score} (${summary.overall}) | <i class="bi bi-hand-thumbs-up-fill"></i> ${summary.good} <i class="bi bi-dash"></i> ${summary.medium} <i class="bi bi-hand-thumbs-down-fill"></i> ${summary.bad}`
          : "Score: -";

        li.innerHTML = `
          <div class="fw-semibold mb-2">${f.getName()}</div>
          <div class="small text-muted mb-2">${scoreText} | <i>${reportedText}</i></div>
          <div class="small mb-2">Uploaded by: <a href="../userFiles/userFiles.html?id=${uploaderId}">${uploaderName}</a> (${uploaderEmail})</div>

          <div style="margin-top:8px;">
            <button class = "btn btn-primary p-2" data-action="download"><i class="bi bi-download"></i></button>
            <button class = "btn btn-primary p-2" data-action="report" ${f.getIsReported() ? "disabled" : ""}>${reportBtnText}</button>

            <button class = "btn btn-primary p-2" data-action="rate" data-value="GOOD"><i class="bi bi-hand-thumbs-up-fill"></i></button>
            <button class = "btn btn-primary p-2" data-action="rate" data-value="MEDIUM"><i class="bi bi-dash"></i></button>
            <button class = "btn btn-primary p-2" data-action="rate" data-value="BAD"><i class="bi bi-hand-thumbs-down-fill"></i></button>
            

            <button class = "btn btn-primary p-2" data-action="favourite">${favBtnText}</button>

            ${canDelete ? `<button data-action="delete" class="btn btn-danger p-2"><i class="bi bi-trash-fill"></i></button>` : ``}
          </div>
        `;

        this.list.appendChild(li);
      }
  }

  bindFileActions(
    handler: (action: "download" | "report" | "rate" | "favourite" | "delete", fileId: number, rateValue?: string) => void
  ): void {
    this.list.addEventListener("click", (ev) => {
      const btn = (ev.target as HTMLElement).closest("button[data-action]") as HTMLButtonElement | null;
      if (!btn) return;

      const li = btn.closest("li[data-file-id]") as HTMLLIElement | null;
      if (!li) return;

      const fileId = Number(li.getAttribute("data-file-id"));
      if (!Number.isFinite(fileId)) return;

      const action = btn.getAttribute("data-action") as any;
      if (!action) return;

      const rateValue = btn.getAttribute("data-value") ?? undefined;
      handler(action, fileId, rateValue);
    });
  }
}
