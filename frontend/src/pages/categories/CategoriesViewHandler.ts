import { Category } from "../../vo/Category.js";
import { CategoriesView } from "./CategoriesView.js";

// WICHTIG: Type nur als "Service-Interface" verwenden,
// nicht hart auf HttpService typisieren, sonst bist du nicht austauschbar.
export type CategoryService = {
  getCategories(
    shallow: boolean,
    success: (cats: Category[]) => void,
    error: (status: any) => void
  ): void;
};

export type SubcategoryService = {
  getSubcategories(
    categoryId: number,
    shallow: boolean,
    success: (subs: any[]) => void,   // wenn du Subcategory importieren willst: Subcategory[]
    error: (status: any) => void
  ): void;
};

console.log("CategoriesViewHandler init()");

export class CategoriesViewHandler {
  private allCategories: Category[] = [];

  constructor(
    private view: CategoriesView,
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService
  ) {}

  init(): void {
    // UI bindings
    this.view.bindSearch((text) => this.onSearch(text));
    this.view.bindCategoryClick((categoryId) => this.onCategoryClicked(categoryId));

    // initial load (shallow) - CALLBACK STYLE
    this.categoryService.getCategories(
      true,
      (categories) => {
        this.allCategories = categories;
        this.view.renderCategories(this.allCategories);
        this.view.renderSubcategories([]);
      },
      (status) => {
        this.view.renderError(`Failed to load categories: ${String(status)}`);
      }
    );
  }

  private onSearch(text: string): void {
    const q = text.trim().toLowerCase();

    if (!q) {
      this.view.renderCategories(this.allCategories);
      return;
    }

    // weil du getters nutzt:
    const filtered = this.allCategories.filter((c) =>
      c.getName().toLowerCase().includes(q)
    );

    this.view.renderCategories(filtered);
  }

  private onCategoryClicked(categoryId: number): void {
    this.view.renderSubcategoriesLoading();

    this.subcategoryService.getSubcategories(
      categoryId,
      true,
      (subs: any[]) => {
        // wenn du Subcategory[] typisieren willst: import { Subcategory }...
        this.view.renderSubcategories(subs as any);
      },
      (status) => {
        this.view.renderError(`Failed to load subcategories: ${String(status)}`);
      }
    );
  }
}
