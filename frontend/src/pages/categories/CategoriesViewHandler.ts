import { Category } from "../../vo/Category.js";
import { CategoriesView } from "./CategoriesView.js";
import { File } from "../../vo/File.js";
import { RatingSummary, RatingValue } from "../../vo/RatingSummary.js";
import { Subcategory } from "../../vo/Subcategory.js";
import { Exam } from "../../vo/Exam.js";
import { locationUtil } from "../../util/LocationUtil.js";

type Navigator = {
  redirectToExamExecutorPage(id: number): void;
  redirectToExamEditorPage(id?: number | null, subcategoryId?:number|null): void;
  redirectToLoginPage(): void;
  redirectToUserPage(): void;
  redirectToMainPage(): void;
};

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
    success: (subs: Subcategory[]) => void,   
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

export type ExamService = {
  getExams(
    subcategoryId: number,
    success: (exams: Exam[]) => void,
    error: (status: any) => void
  ): void;
};

export type FavouritesService = {
  getFavourites(userId: number, success: (files: File[]) => void, error: (e:any)=>void): void;
  addFavourite(userId: number, file: File, success: ()=>void, error:(e:any)=>void): void;
  removeFavourite(userId: number, fileId: number, success: ()=>void, error:(e:any)=>void): void;
};



console.log("CategoriesViewHandler init()");

export class CategoriesViewHandler {
  private currentUserId = 1;
  private allCategories: Category[] = [];
  private selectedSubcategoryId: number | null = null;
  private currentFiles: File[] = [];
  private currentExams: Exam[] = [];

  constructor(
    private view: CategoriesView,
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService,
    private fileService: FileService,
    private ratingService: RatingService,
    private examService: ExamService,
    private favouritesService: FavouritesService,
    private nav: Navigator = locationUtil
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
    this.view.bindCreateExam(() => this.onCreateExamClicked());
    this.view.bindFavouriteClick((fileId) => this.onFavouriteClicked(fileId));


    this.view.bindExamAction((examId, action) => {
      if (action === "edit") this.nav.redirectToExamEditorPage(examId);
      if (action === "execute") this.nav.redirectToExamExecutorPage(examId);
    });

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
    this.currentExams = [];
    this.view.clearExams();

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
    this.view.clearExams();
    this.currentExams = [];

    this.view.clearSubcategories();
    this.view.clearFiles();

    this.view.renderSubcategoriesLoading();

    this.subcategoryService.getSubcategories(
      categoryId,
      (subs: any[]) => this.view.renderSubcategories(subs as any),
      (status: any) => this.view.renderError(`Failed to load subcategories: ${String(status)}`)
    );

  }

  private onSubcategoryClicked(subcategoryId: number): void {
    this.selectedSubcategoryId = subcategoryId;
    this.view.enableActions(true);

    this.reloadFiles(subcategoryId);
    this.reloadExams(subcategoryId);
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
        console.log("UPLOAD ERROR raw:", status);
         this.view.renderError(`Upload failed: ${JSON.stringify(status)}`);
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

  private reloadExams(subcategoryId: number): void {
    this.examService.getExams(
      subcategoryId,
      (exams) => {
        this.currentExams = exams;
        this.view.renderExams(this.currentExams);
      },
      (status) => this.view.renderError(`Failed to load exams: ${String(status)}`)
    );
  }

  private onCreateExamClicked(): void {
    if (this.selectedSubcategoryId == null) {
      this.view.renderError("Please select a subcategory first.");
      return;
    }
    this.nav.redirectToExamEditorPage(null, this.selectedSubcategoryId); // erstellen (ohne id)
  }

  private onFavouriteClicked(fileId: number): void {
    const f = this.currentFiles.find(x => x.getId() === fileId);
    if (!f) return;

    const isFav = (f as any).fav === true;

    const done = () => {
      (f as any).fav = !isFav;
      this.view.renderFiles(this.currentFiles);
    };

    if (!isFav) {
      this.favouritesService.addFavourite(this.currentUserId, f, done, (e)=>this.view.renderError(String(e)));
    } else {
      this.favouritesService.removeFavourite(this.currentUserId, fileId, done, (e)=>this.view.renderError(String(e)));
    }
  }


}