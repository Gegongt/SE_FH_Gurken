import { Category } from "../../vo/Category.js";
import { Subcategory } from "../../vo/Subcategory.js";
import { File } from "../../vo/File.js";
import { RatingValue } from "../../vo/RatingSummary.js";
import { Exam } from "../../vo/Exam.js";

export class CategoriesView {
  private searchInput: HTMLInputElement;
  private categoryList: HTMLUListElement;
  private subcategoryList: HTMLUListElement;
  private btnUploadFile: HTMLButtonElement;
  private filePicker: HTMLInputElement;
  private fileList: HTMLUListElement;
  private examList: HTMLUListElement;
  private btnCreateExam: HTMLButtonElement;
  private errorBox = document.getElementById("pageError") as HTMLDivElement;
  private errorText = document.getElementById("pageErrorText") as HTMLSpanElement;
  private errorTimeout: number | null = null;

  constructor() {
    const search = document.getElementById("categorySearch");
    const catList = document.getElementById("categoryList");
    const subList = document.getElementById("subcategoryList");
    const fileList = document.getElementById("fileList");
    const examList = document.getElementById("examList");

    if (!(search instanceof HTMLInputElement)) throw new Error("categorySearch not found");
    if (!(catList instanceof HTMLUListElement)) throw new Error("categoryList not found");
    if (!(subList instanceof HTMLUListElement)) throw new Error("subcategoryList not found");
    if (!(document.getElementById("btnUploadFile") instanceof HTMLButtonElement)) throw new Error("btnUploadFile not found");
    if (!(document.getElementById("filePicker") instanceof HTMLInputElement)) throw new Error("filePicker not found");
    if (!(fileList instanceof HTMLUListElement)) throw new Error("fileList not found");
    if (!(examList instanceof HTMLUListElement)) throw new Error("examList not found");
    if (!(document.getElementById("btnCreateExam") instanceof HTMLButtonElement)) throw new Error("btnCreateExam not found");

    this.searchInput = search;
    this.categoryList = catList;
    this.subcategoryList = subList;
    this.btnUploadFile = document.getElementById("btnUploadFile") as HTMLButtonElement;
    this.filePicker = document.getElementById("filePicker") as HTMLInputElement;
    this.fileList = fileList as HTMLUListElement;
    this.examList = examList;
    this.btnCreateExam = document.getElementById("btnCreateExam") as HTMLButtonElement; 

  }

  bindSearch(handler: (text: string) => void): void {
    this.searchInput.addEventListener("input", () => {
      handler(this.searchInput.value);
    });
  }

  bindCategoryClick(handler: (categoryId: number) => void): void {
    this.categoryList.addEventListener("click", (ev) => {
      const target = ev.target as HTMLElement | null;
      const li = target?.closest("li");
      if (!li) return;

      const idStr = li.getAttribute("data-id");
      if (!idStr) return;

      const id = Number(idStr);
      if (!Number.isFinite(id)) return;

      handler(id);
    });
  }

  renderCategories(categories: Category[]): void {
    this.categoryList.innerHTML = "";

    for (const c of categories) {
      const li = document.createElement("li");
      li.textContent = c.getName();
      li.setAttribute("data-id", String(c.getId()));
      li.style.cursor = "pointer";
      this.categoryList.appendChild(li);
    }
  }

  renderSubcategories(subcategories: Subcategory[]): void {
    this.subcategoryList.innerHTML = "";

    for (const s of subcategories) {
      const li = document.createElement("li");
      li.classList.add("mouse-clickable");
      li.textContent = s.getName();
      li.setAttribute("data-id", String(s.getId()));
      this.subcategoryList.appendChild(li);
    }
  }
    
  renderFiles(files: File[]): void {
    this.fileList.innerHTML = "";

    if (files.length === 0) {
      this.fileList.innerHTML = "<li>No files available</li>";
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

      this.fileList.appendChild(li);
    }
  }


  renderSubcategoriesLoading(): void {
    this.subcategoryList.innerHTML = "<li>Loading...</li>";
  }

  renderFilesLoading(): void {
   this.fileList.innerHTML = "<li>Loading files...</li>";
  }

  renderError(msg: string, autoHideMs = 4000): void {
    console.error(msg);

    this.errorText.textContent = msg;
    this.errorBox.style.display = "block";
    this.errorBox.classList.add("show");

    if (this.errorTimeout) {
      window.clearTimeout(this.errorTimeout);
    }

    this.errorTimeout = window.setTimeout(() => {
      this.hideError();
    }, autoHideMs);
  }

hideError(): void {
  this.errorBox.classList.remove("show");
  this.errorBox.classList.add("fade");

  setTimeout(() => {
    this.errorBox.style.display = "none";
  }, 200);
}

  enableActions(enable: boolean): void {
    console.log("enableActions:", enable);
    this.btnUploadFile.disabled = !enable;
    this.btnCreateExam.disabled = !enable;
  }

  bindUploadClick(handler: () => void): void {
    this.btnUploadFile.addEventListener("click", handler);
  }

  openFilePicker(): void {
    this.filePicker.value = ""; 
    this.filePicker.click();
  }

  bindFileSelected(handler: (file: globalThis.File) => void): void {
    this.filePicker.addEventListener("change", () => {
      const f = this.filePicker.files?.[0];
      if (f) handler(f);
    });
  }

  bindSubcategoryClick(handler: (subcategoryId: number) => void): void {
    this.subcategoryList.addEventListener("click", (e) => {
      const target = e.target as HTMLElement | null;
      const li = target?.closest("li");
      if (!li) return;

      const idStr = li.getAttribute("data-id");
      if (!idStr) return;

      const id = Number(idStr);
      if (!Number.isFinite(id)) return;

      handler(id);
    });
  }


  resetDetails(): void {
    this.renderSubcategories([]);
    this.clearFiles();     
    this.enableActions(false);
    this.renderExams([]);
  }

  clearFiles(): void {
    this.fileList.innerHTML = ""; 
  }

  clearSubcategories(): void {
    this.subcategoryList.innerHTML = "";
  }

  clearExams(): void {
    this.examList.innerHTML = "";
  }

  bindRatingClick(handler: (fileId: number, value: RatingValue) => void): void {
    this.fileList.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const btn = target.closest("button");
      if (!btn) return;

      if (btn.getAttribute("data-action") !== "rate") return;

      const value = btn.getAttribute("data-value") as RatingValue | null;
      if (!value) return;

      const li = btn.closest("li");
      const idStr = li?.getAttribute("data-file-id");
      if (!idStr) return;

      handler(Number(idStr), value);
    });
  }

bindReportClick(handler: (fileId: number) => void): void {
  this.fileList.addEventListener("click", (ev) => {
    const btn = (ev.target as HTMLElement)?.closest("button[data-action='report']");
    if (!btn) return;

    if((btn as HTMLButtonElement).disabled) return;

    const li = btn.closest("li[data-file-id]") as HTMLLIElement | null;
    if (!li) return;

    const fileId = Number(li.getAttribute("data-file-id"));
    if (!Number.isFinite(fileId)) return;

    handler(fileId);
  });
}


  bindDownloadClick(handler: (fileId: number) => void): void {
    this.fileList.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const btn = target.closest("button");
      if (!btn) return;

      if (btn.getAttribute("data-action") !== "download") return;

      const li = btn.closest("li");
      const idStr = li?.getAttribute("data-file-id");
      if (!idStr) return;

      handler(Number(idStr));
    });
  }

  renderExams(exams: Exam[]): void {
    this.examList.innerHTML = "";

    if (exams.length === 0) {
      this.examList.innerHTML = "<li>No exams available</li>";
      return;
    }

    for (const ex of exams) {
      const li = document.createElement("li");
      li.setAttribute("data-exam-id", String(ex.getId()));

      li.innerHTML = `
        <span><b>${ex.getName()}</b></span>
        <div style="margin-top:6px;">
          <button class = "btn btn-primary p-2" data-action="execute"><i class="bi bi-caret-right"></i></button>
          <button class = "btn btn-primary p-2" data-action="edit"><i class="bi bi-pencil-fill"></i></button>
        </div>
      `;
      this.examList.appendChild(li);
    }
  }

  bindCreateExam(handler: () => void): void {
    this.btnCreateExam.addEventListener("click", handler);
  }

  bindExamAction(handler: (examId: number, action: "execute" | "edit") => void): void {
    this.examList.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const btn = target.closest("button");
      if (!btn) return;

      const action = btn.getAttribute("data-action");
      if (action !== "execute" && action !== "edit") return;

      const li = btn.closest("li");
      const idStr = li?.getAttribute("data-exam-id");
      if (!idStr) return;

      handler(Number(idStr), action);
    });
  }

  bindFavouriteClick(handler: (fileId: number) => void): void {
    this.fileList.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const btn = target.closest("button");
      if (!btn) return;

      if (btn.getAttribute("data-action") !== "favourite") return;

      const li = btn.closest("li");
      const idStr = li?.getAttribute("data-file-id");
      if (!idStr) return;

      handler(Number(idStr));
    });
  }

  bindDeleteClick(handler: (fileId: number) => void): void {
    this.fileList.addEventListener("click", (ev) => {
      const btn = (ev.target as HTMLElement)?.closest("button[data-action='delete']") as HTMLButtonElement | null;
      if (!btn) return;

      const li = btn.closest("li[data-file-id]") as HTMLLIElement | null;
      if (!li) return;

      const fileId = Number(li.getAttribute("data-file-id"));
      if (!Number.isFinite(fileId)) return;

      handler(fileId);
    });
  }



}
