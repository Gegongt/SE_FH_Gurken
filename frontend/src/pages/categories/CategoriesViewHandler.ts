import { Category } from "../../vo/Category.js";
import { CategoriesView } from "./CategoriesView.js";
import { File } from "../../vo/File.js";
import { RatingSummary, RatingValue } from "../../vo/RatingSummary.js";
import { Subcategory } from "../../vo/Subcategory.js";
import { Exam } from "../../vo/Exam.js";
import { locationUtil } from "../../util/LocationUtil.js";
import { User } from "../../vo/User.js";
import {
  RatingRowDTO,
  computeSummaryFromRows,
  getUserRatingFromRows
} from "../../util/RatingDtoUtil.js";

type Navigator = {
  redirectToExamExecutorPage(id: number): void;
  redirectToExamEditorPage(id?: number | null, subcategoryId?:number|null): void;
  redirectToLoginPage(): void;
  redirectToUserPage(): void;
  redirectToMainPage(): void;
};

export type UserService = {
   getCurrentUser(
    success: (u: User) => void,
    error: (e: any) => void
  ): void;
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
    name: string,
    reported: boolean,
    success: (updated: File) => void,
    error: (status: any) => void
  ): void;

  downloadFile(
    fileId: number,
    success: (filename?: string) => void,
    error: (status: any) => void
  ): void;

  deleteFile(
    fileId: number,
    success: () => void,
    error: (status: any) => void
  ): void;

};

export type RatingService = {
  listByFile(
    fileId: number,
    success: (rows: RatingRowDTO[]) => void,
    error: (status: any) => void
  ): void;

  create(
    fileId: number,
    value: "BAD" | "MEDIUM" | "GOOD",
    success: () => void,
    error: (status: any) => void
  ): void;

  update(
    ratingId: number,
    value: "BAD" | "MEDIUM" | "GOOD",
    success: () => void,
    error: (status: any) => void
  ): void;

  remove(
    ratingId: number,
    success: () => void,
    error: (status: any) => void
  ): void;
};


export type ExamService = {
  getExams(
    subcategoryId: number,
    success: (exams: Exam[]) => void,
    error: (status: any) => void
  ): void;
};

export type FavouriteDTO = { userId: string; fileId: number };

export type FavouritesService = {
  getFavourites(userId: string, success: (favs: FavouriteDTO[]) => void, error: (e:any)=>void): void;
  addFavourite(userId: string, fileId: number, success: ()=>void, error:(e:any)=>void): void;
  removeFavourite(userId: string, fileId: number, success: ()=>void, error:(e:any)=>void): void;
};


console.log("CategoriesViewHandler init()");

export class CategoriesViewHandler {
  private currentUserUid: string | null = null;
  private currentUserIsAdmin: boolean = false;
  private allCategories: Category[] = [];
  private selectedSubcategoryId: number | null = null;
  private currentFiles: File[] = [];
  private currentExams: Exam[] = [];
  

  constructor(
    private userService: UserService,
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
    this.view.bindDeleteClick((fileId) => this.onDeleteClicked(fileId));


    this.view.bindExamAction((examId, action) => {
      if (action === "edit") this.nav.redirectToExamEditorPage(examId);
      if (action === "execute") this.nav.redirectToExamExecutorPage(examId);
    });

    this.userService.getCurrentUser(
  (u) => {
    this.currentUserUid = String(u.getId());
    this.currentUserIsAdmin = (u.getIsAdmin?.() ?? false) === true;

    if (this.selectedSubcategoryId != null) {
      this.reloadFiles(this.selectedSubcategoryId);
    }
  },
   (_e) => {
      this.currentUserUid = null;
      this.currentUserIsAdmin = false;

      if (this.selectedSubcategoryId != null) {
        this.reloadFiles(this.selectedSubcategoryId);
      }
    }
  );

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

  public setCurrentUser(uid: string): void {
    this.currentUserUid = uid;
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

      // init view-model flags
      for (const f of this.currentFiles) {
        (f as any).fav = false;
        (f as any).canDelete = false;

        // ratings VM
        (f as any).ratingSummary = null;
        (f as any).myRatingId = null;      // <- wichtig für PUT/DELETE
        (f as any).myRatingValue = null;   // <- optional fürs Button-Highlight
      }

      // canDelete bestimmen
      for (const f of this.currentFiles) {
        const uploaderId =
          (f as any).uploader?.id ??
          (f as any).getUploader?.()?.getId?.() ??
          (f as any).getUploader?.()?.id ??
          null;

        const isOwner =
          this.currentUserUid != null && String(uploaderId) === String(this.currentUserUid);

        const isAdmin = this.currentUserIsAdmin === true;
        (f as any).canDelete = isAdmin || isOwner;
      }

      const renderNow = () => this.view.renderFiles(this.currentFiles);

      // 1) ratings laden -> summary + myRatingId/myRatingValue setzen
      this.loadRatingsForCurrentFiles(() => {
        // 2) favourites laden (falls user eingeloggt)
        if (!this.currentUserUid) {
          renderNow();
          return;
        }

        this.favouritesService.getFavourites(
          this.currentUserUid,
          (favs) => {
            const favSet = new Set(favs.map((x: any) => Number(x.fileid ?? x.fileId)));
            for (const f of this.currentFiles) {
              (f as any).fav = favSet.has(f.getId());
            }
            renderNow();
          },
          (_e) => renderNow()
        );
      });
    },
    (status) => this.view.renderError(`Failed to load files: ${String(status)}`)
  );
}

private loadRatingsForCurrentFiles(done: () => void): void {
  const files = this.currentFiles;
  if (!files || files.length === 0) {
    done();
    return;
  }

  let remaining = files.length;

  const tick = () => {
    remaining--;
    if (remaining <= 0) done();
  };

  for (const f of files) {
    this.ratingService.listByFile(
      f.getId(),
      (rows) => {
        (f as any).ratingSummary = computeSummaryFromRows(rows);

        const mine = getUserRatingFromRows(rows, this.currentUserUid ?? null);
        (f as any).myRatingId = mine.ratingId;
        (f as any).myRatingValue = mine.value;

        tick();
      },
      (_e) => tick()
    );
  }
}


private onReportClicked(fileId: number): void {
  const f = this.currentFiles.find(x => x.getId() === fileId);
  if (!f) return;

  const newReported = !f.getIsReported();


  if (newReported === false && !this.currentUserIsAdmin) {
    this.view.renderError("Only admins can unreport files.");
    return; 
  }

  const name = f.getName();
  if (!name || typeof name !== "string") {
    this.view.renderError("Cannot update file: missing filename.");
    return;
  }

  this.fileService.reportFile(
    fileId,
    name,
    newReported,
    (updated) => {
      f.setIsReported(updated.getIsReported());
      if (updated.getName?.()) f.setName(updated.getName());
      this.view.renderFiles(this.currentFiles);
    },
    (status) => this.view.renderError(`Report failed: ${String(status)}`)
  );
}

  private onDownloadClicked(fileId: number): void {
    this.fileService.downloadFile(
      fileId,
      (filename) => {
        console.log("Downloaded:", filename);
      },
      (err) => this.view.renderError(`Download failed: ${String(err)}`)
    );
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
    this.nav.redirectToExamEditorPage(null, this.selectedSubcategoryId); 
  }

  private onFavouriteClicked(fileId: number): void {
    const uid = this.currentUserUid;
    if (!uid) {
      this.view.renderError("Not logged in.");
      return;
    }

    const f = this.currentFiles.find(x => x.getId() === fileId);
    if (!f) return;

    const isFav = (f as any).fav === true;

    const done = () => {
      (f as any).fav = !isFav;
      this.view.renderFiles(this.currentFiles);
    };

    if (!isFav) {
      this.favouritesService.addFavourite(uid, fileId, done, (e) => this.view.renderError(String(e)));
    } else {
      this.favouritesService.removeFavourite(uid, fileId, done, (e) => this.view.renderError(String(e)));
    }
  }

 private onDeleteClicked(fileId: number): void {
  const f = this.currentFiles.find(x => x.getId() === fileId);
  if (!f) return;

  const canDelete = (f as any).canDelete === true;
  if (!canDelete) {
    this.view.renderError("You are not allowed to delete this file.");
    return;
  }

  const ok = confirm("Delete this file?");
  if (!ok) return;

  this.fileService.deleteFile(
    fileId,
    () => {

      this.currentFiles = this.currentFiles.filter(x => x.getId() !== fileId);
      this.view.renderFiles(this.currentFiles);

      if (this.selectedSubcategoryId != null) {
        this.reloadFiles(this.selectedSubcategoryId);
      }
    },
    (e) => this.view.renderError(`Delete failed: ${String(e)}`)
  );
}

private onRateClicked(fileId: number, value: "BAD"|"MEDIUM"|"GOOD"): void {
  if (!this.currentUserUid) {
    this.view.renderError("You must be logged in to rate.");
    return;
  }

  this.ratingService.listByFile(
    fileId,
    (rows) => {
      const mine = rows.find(r => String(r.userid) === String(this.currentUserUid));

      const mineValue =
        mine?.ratingisgood ? "GOOD" :
        mine?.ratingismedium ? "MEDIUM" :
        mine?.ratingisbad ? "BAD" : null;

      const refresh = () => {
        // danach Summary neu laden + UI refreshen (so wie du es jetzt schon machst)
        this.reloadFiles(this.selectedSubcategoryId!);
      };

      if (!mine) {
        this.ratingService.create(fileId, value, refresh, (e) => this.view.renderError(`Rating failed: ${String(e)}`));
        return;
      }

      // gleiches Rating nochmal => entfernen
      if (mineValue === value) {
        this.ratingService.remove(mine.id, refresh, (e) => this.view.renderError(`Delete rating failed: ${String(e)}`));
        return;
      }

      // anderes Rating => ändern
      this.ratingService.update(mine.id, value, refresh, (e) => this.view.renderError(`Update rating failed: ${String(e)}`));
    },
    (e) => this.view.renderError(`Load ratings failed: ${String(e)}`)
  );
}



}