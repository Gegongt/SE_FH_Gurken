export class UserFilesView {
    constructor() {
        this.list = document.getElementById("userFileList");
        this.uploaderLabel = document.getElementById("uploaderLabel");
        this.errorBox = document.getElementById("errorBox");
    }
    setUploaderLabel(text) {
        this.uploaderLabel.textContent = text;
    }
    showError(msg) {
        this.errorBox.textContent = msg;
        this.errorBox.classList.remove("d-none");
    }
    clearError() {
        this.errorBox.classList.add("d-none");
        this.errorBox.textContent = "";
    }
    renderFilesLoading() {
        this.list.innerHTML = `<li class="list-group-item text-muted">Loading...</li>`;
    }
    renderFiles(files) {
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
            const uploader = f.getUploader?.() ?? f.uploader;
            const uploaderName = uploader?.getName?.() ?? uploader?.name ?? "unknown";
            const uploaderEmail = uploader?.getEmail?.() ?? uploader?.email ?? "";
            const uploaderId = uploader?.getId?.() ?? uploader?.id ?? "";
            const isFav = f.fav === true;
            const favBtnText = isFav ? `<i class="bi bi-bookmark-fill"></i>` : `<i class="bi bi-bookmark"></i>`;
            const reportedText = f.getIsReported() ? `<i class="bi bi-flag-fill"></i>` : `<i class="bi bi-flag"></i>`;
            const reportBtnText = f.getIsReported() ? `<i class="bi bi-flag-fill"></i>` : `<i class="bi bi-flag"></i>`;
            const canDelete = f.canDelete === true;
            const summary = f.ratingSummary;
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
    bindFileActions(handler) {
        this.list.addEventListener("click", (ev) => {
            const btn = ev.target.closest("button[data-action]");
            if (!btn)
                return;
            const li = btn.closest("li[data-file-id]");
            if (!li)
                return;
            const fileId = Number(li.getAttribute("data-file-id"));
            if (!Number.isFinite(fileId))
                return;
            const action = btn.getAttribute("data-action");
            if (!action)
                return;
            const rateValue = btn.getAttribute("data-value") ?? undefined;
            handler(action, fileId, rateValue);
        });
    }
}
//# sourceMappingURL=UserFilesView.js.map