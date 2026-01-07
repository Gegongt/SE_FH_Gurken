import { Category } from "../../vo/Category.js";
import { Subcategory } from "../../vo/Subcategory.js";

export class CategoriesView {
  private searchInput: HTMLInputElement;
  private categoryList: HTMLUListElement;
  private subcategoryList: HTMLUListElement;
  private btnUploadFile: HTMLButtonElement;
  private filePicker: HTMLInputElement;


  constructor() {
    const search = document.getElementById("categorySearch");
    const catList = document.getElementById("categoryList");
    const subList = document.getElementById("subcategoryList");

    if (!(search instanceof HTMLInputElement)) throw new Error("categorySearch not found");
    if (!(catList instanceof HTMLUListElement)) throw new Error("categoryList not found");
    if (!(subList instanceof HTMLUListElement)) throw new Error("subcategoryList not found");

    this.searchInput = search;
    this.categoryList = catList;
    this.subcategoryList = subList;
    this.btnUploadFile = document.getElementById("btnUploadFile") as HTMLButtonElement;
    this.filePicker = document.getElementById("filePicker") as HTMLInputElement;

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

  renderSubcategoriesLoading(): void {
    this.subcategoryList.innerHTML = "<li>Loading...</li>";
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

  bindFileSelected(handler: (file: File) => void): void {
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


}
