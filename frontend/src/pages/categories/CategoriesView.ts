import { Category } from "../../vo/Category.js";
import { Subcategory } from "../../vo/Subcategory.js";
import { File } from "../../vo/File.js";
import { RatingSummary } from "../../vo/RatingSummary.js";
import { RatingValue } from "../../vo/RatingSummary.js";

export class CategoriesView {
  private searchInput: HTMLInputElement;
  private categoryList: HTMLUListElement;
  private subcategoryList: HTMLUListElement;
  private btnUploadFile: HTMLButtonElement;
  private filePicker: HTMLInputElement;
  private fileList: HTMLUListElement;

  constructor() {
    const search = document.getElementById("categorySearch");
    const catList = document.getElementById("categoryList");
    const subList = document.getElementById("subcategoryList");
    const fileList = document.getElementById("fileList");

    if (!(search instanceof HTMLInputElement)) throw new Error("categorySearch not found");
    if (!(catList instanceof HTMLUListElement)) throw new Error("categoryList not found");
    if (!(subList instanceof HTMLUListElement)) throw new Error("subcategoryList not found");
    if (!(document.getElementById("btnUploadFile") instanceof HTMLButtonElement)) throw new Error("btnUploadFile not found");
    if (!(document.getElementById("filePicker") instanceof HTMLInputElement)) throw new Error("filePicker not found");
    if (!(fileList instanceof HTMLUListElement)) throw new Error("fileList not found");

    this.searchInput = search;
    this.categoryList = catList;
    this.subcategoryList = subList;
    this.btnUploadFile = document.getElementById("btnUploadFile") as HTMLButtonElement;
    this.filePicker = document.getElementById("filePicker") as HTMLInputElement;
    this.fileList = fileList as HTMLUListElement;

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

      const summary = f.getRatingSummary();

      const scoreText = summary
        ? `Score: ${summary.score} (${summary.overall}) | 👍 ${summary.good} 😐 ${summary.medium} 👎 ${summary.bad}`
        : "Score: -";

      li.innerHTML = `
        <span><b>${f.getName()}</b> | ${scoreText}</span>
        <div style="margin-top:6px;">
          <button data-action="rate" data-value="BAD">Bad</button>
          <button data-action="rate" data-value="MEDIUM">Medium</button>
          <button data-action="rate" data-value="GOOD">Good</button>
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

  renderError(msg: string): void {
    console.error(msg);
    this.subcategoryList.innerHTML = `<li style="color:red;">${msg}</li>`;
  }

  enableActions(enable: boolean): void {
  this.btnUploadFile.disabled = !enable;
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
      const target = e.target as HTMLElement;
      const li = target.closest("li");
      if (!li) return;

      const idStr = li.getAttribute("data-id");
      if (!idStr) return;

      handler(Number(idStr));
    });
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

}
