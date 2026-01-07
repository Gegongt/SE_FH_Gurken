import { Category } from "../../vo/Category.js";
import { CategoriesView } from "./CategoriesView.js";

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
    success: (subs: any[]) => void,   
    error: (status: any) => void
  ): void;
};

console.log("CategoriesViewHandler init()");

export class CategoriesViewHandler {
  private allCategories: Category[] = [];
  private selectedSubcategoryId: number | null = null;

  constructor(
    private view: CategoriesView,
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService
  ) {}

  init(): void {
    // UI bindings
    this.view.bindSearch((text) => this.onSearch(text));
    this.view.bindCategoryClick((categoryId) => this.onCategoryClicked(categoryId));
    this.view.enableActions(false);

    this.view.bindUploadClick(() => this.onUploadClicked());
    this.view.bindFileSelected((file) => this.onFileSelected(file));
    this.view.bindSubcategoryClick((subcategoryId) => this.onSubcategoryClicked(subcategoryId));

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

    const filtered = this.allCategories.filter((c) =>
      c.getName().toLowerCase().includes(q)
    );

    this.view.renderCategories(filtered);
  }

  private onCategoryClicked(categoryId: number): void {
    this.selectedSubcategoryId = null;
    this.view.enableActions(false);

    this.view.renderSubcategoriesLoading();

    this.subcategoryService.getSubcategories(
      categoryId,
      true,
      (subs: any[]) => {
        this.view.renderSubcategories(subs as any);
      },
      (status) => {
        this.view.renderError(`Failed to load subcategories: ${String(status)}`);
      }
    );
  }


  private onSubcategoryClicked(subcategoryId: number): void {
    this.selectedSubcategoryId = subcategoryId;
    this.view.enableActions(true);
    console.log("Selected subcategory:", subcategoryId);
  }


  private onUploadClicked(): void {
    if (this.selectedSubcategoryId == null) {
      this.view.renderError("Please select a subcategory first.");
      return;
    }
    this.view.openFilePicker();
  }

  private onFileSelected(file: File): void {
  if (this.selectedSubcategoryId == null) return;

  console.log("Selected file:", file.name, file.size);

  }

}
