import { Category } from "../../vo/Category.js";
import { CategoriesView } from "./CategoriesView.js";
import { CategoryHttpService } from "../../http/CategoryHttpService.js";
import { SubcategoryHttpService } from "../../http/SubcategoryHttpService.js";


console.log("CategoriesViewHandler init()");

export class CategoriesViewHandler {
  private allCategories: Category[] = [];

  constructor(
    private view: CategoriesView,
    private categoryService: CategoryHttpService,
    private subcategoryService: SubcategoryHttpService
  ) {}

  async init(): Promise<void> {
    // UI bindings
    this.view.bindSearch((text) => this.onSearch(text));
    this.view.bindCategoryClick((categoryId) => this.onCategoryClicked(categoryId));

    // initial load (shallow)
    try {
      this.allCategories = await this.categoryService.getCategories(true);
      this.view.renderCategories(this.allCategories);
      this.view.renderSubcategories([]); 
    } catch (e) {
      this.view.renderError(`Failed to load categories: ${String(e)}`);
    }
  }

  private onSearch(text: string): void {
    const q = text.trim().toLowerCase();

    if (!q) {
      this.view.renderCategories(this.allCategories);
      return;
    }

    const filtered = this.allCategories.filter(c =>
      (c.getName?.() ?? "").toLowerCase().includes(q)
    );

    this.view.renderCategories(filtered);
  }

  private async onCategoryClicked(categoryId: number): Promise<void> {
    this.view.renderSubcategoriesLoading();

    try {
      const subs = await this.subcategoryService.getSubcategories(categoryId, true);
      this.view.renderSubcategories(subs);
    } catch (e) {
      this.view.renderError(`Failed to load subcategories: ${String(e)}`);
    }
  }
}
