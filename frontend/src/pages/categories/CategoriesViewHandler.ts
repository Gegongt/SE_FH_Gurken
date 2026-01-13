import { Category } from "../../vo/Category.js";
import { CategoriesView } from "./CategoriesView.js";
import { File } from "../../vo/File.js";
import { RatingSummary, RatingValue } from "../../vo/RatingSummary.js";

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

export type FileService = {
  getFiles(
    subcategoryId: number,
    shallow: boolean,
    success: (files: File[]) => void,
    error: (status: any) => void
  ): void;
};

export type RatingService = {
  getSummary(fileId: number, success: (s: RatingSummary) => void, error: (status:any)=>void): void;
  rateFile(fileId: number, value: RatingValue, success: (s: RatingSummary) => void, error: (status:any)=>void): void;
};

console.log("CategoriesViewHandler init()");

export class CategoriesViewHandler {
  private allCategories: Category[] = [];
  private selectedSubcategoryId: number | null = null;
  private currentFiles: File[] = [];

  constructor(
    private view: CategoriesView,
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService,
    private fileService: FileService,
    private ratingService: RatingService

  ) {}

  init(): void {
    // UI bindings
    this.view.bindSearch((text) => this.onSearch(text));
    this.view.bindCategoryClick((categoryId) => this.onCategoryClicked(categoryId));
    this.view.enableActions(false);

    this.view.bindUploadClick(() => this.onUploadClicked());
    this.view.bindFileSelected((file) => this.onFileSelected(file));
    this.view.bindSubcategoryClick((subcategoryId) => this.onSubcategoryClicked(subcategoryId));
    this.view.bindRatingClick((fileId, value) => this.onRateClicked(fileId, value));

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

  this.currentFiles = [];            
  this.view.renderFiles([]);

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

    this.view.renderFilesLoading();

    this.fileService.getFiles(
      subcategoryId,
      true,
      (files) => {
        this.currentFiles = files;             
        this.view.renderFiles(this.currentFiles);

        for (const f of this.currentFiles) {
          this.ratingService.getSummary(
            f.getId(),
            (summary) => {
              f.setRatingSummary(summary);
              this.view.renderFiles(this.currentFiles);
            },
            (_status) => {
              // ignore errors for summaries
            }
          );
        }
      },
      (status) => {
        this.view.renderError(`Failed to load files: ${String(status)}`);
      }
    );
  }


  private onUploadClicked(): void {
    if (this.selectedSubcategoryId == null) {
      this.view.renderError("Please select a subcategory first.");
      return;
    }
    this.view.openFilePicker();
  }

  private onFileSelected(file: globalThis.File): void {
    if (this.selectedSubcategoryId == null) return;
    console.log("Selected file:", file.name);

  }

  private onRateClicked(fileId: number, value: RatingValue): void {
    this.ratingService.rateFile(
      fileId,
      value,
      (summary) => {
        const f = this.currentFiles.find(x => x.getId() === fileId);
        if (f) f.setRatingSummary(summary);
        this.view.renderFiles(this.currentFiles);
      },
      (status) => {
        this.view.renderError(`Rating failed: ${String(status)}`);
      }
    );
  }


}
