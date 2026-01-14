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

  uploadFile(
    subcategoryId: number,
    file: globalThis.File,
    success: (created: File) => void,
    error: (status: any) => void
  ): void;

  reportFile(
    fileId: number,
    reported: boolean,
    success: (updated: File) => void,
    error: (status: any) => void
  ): void;
};

export type RatingService = {
  getSummary(fileId: number, success: (s: RatingSummary) => void, error: (status:any)=>void): void;
    setUserRating(fileId: number, userId: number, value: RatingValue,
    success: (s: RatingSummary) => void,
    error: (status:any) => void
  ): void;
};

console.log("CategoriesViewHandler init()");

export class CategoriesViewHandler {
  private currentUserId = 1;
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

    this.view.bindReportClick((fileId) => this.onReportClicked(fileId));
    this.view.bindUploadClick(() => this.onUploadClicked());
    this.view.bindFileSelected((file) => this.onFileSelected(file));
    this.view.bindSubcategoryClick((subcategoryId) => this.onSubcategoryClicked(subcategoryId));
    this.view.bindRatingClick((fileId, value) => this.onRateClicked(fileId, value));
    this.view.bindDownloadClick((fileId) => this.onDownloadClicked(fileId));


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
    this.selectedSubcategoryId = null;
    this.currentFiles = [];
    this.view.resetDetails();

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

    this.view.clearSubcategories();
    this.view.clearFiles();

    this.view.renderSubcategoriesLoading();

    this.subcategoryService.getSubcategories(
      categoryId,
      true,
      (subs: any[]) => this.view.renderSubcategories(subs as any),
      (status) => this.view.renderError(`Failed to load subcategories: ${String(status)}`)
    );
  }


  private onSubcategoryClicked(subcategoryId: number): void {
    this.selectedSubcategoryId = subcategoryId;
    this.view.enableActions(true);

    this.reloadFiles(subcategoryId);
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

    const subId = this.selectedSubcategoryId;

    this.fileService.uploadFile(
      subId,
      file,
      (_created) => {
        this.reloadFiles(subId);
      },
      (status) => {
        this.view.renderError(`Upload failed: ${String(status)}`);
      }
    );
  }

  private reloadFiles(subcategoryId: number): void {
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
            (_status) => {}
          );
        }
      },
      (status) => {
        this.view.renderError(`Failed to load files: ${String(status)}`);
      }
    );
  }

  private onRateClicked(fileId: number, value: RatingValue): void {
    this.ratingService.setUserRating(
      fileId,
      this.currentUserId,
      value,
      (summary) => {
        const f = this.currentFiles.find(x => x.getId() === fileId);
        if (f) f.setRatingSummary(summary);
        this.view.renderFiles(this.currentFiles);
      },
      (status) => this.view.renderError(`Rating failed: ${String(status)}`)
    );
  }

  private onReportClicked(fileId: number): void {
    const f = this.currentFiles.find(x => x.getId() === fileId);
    if (!f) return;

    const newValue = !f.getIsReported();

    this.fileService.reportFile(
      fileId,
      newValue,
      (updated) => {
        // simplest: update local object
        f.setIsReported(updated.getIsReported());
        this.view.renderFiles(this.currentFiles);
      },
      (status) => {
        this.view.renderError(`Report failed: ${String(status)}`);
      }
    );
  }

  private onDownloadClicked(fileId: number): void {
  //BaseURL
  const url = `/api/files/${fileId}/download`;

  //Browser download
  window.open(url, "_blank");
}


}
