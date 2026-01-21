import { File } from "../../vo/File.js";
import { User } from "../../vo/User.js";
import { UserFilesView } from "./UserFilesView.js";
import { locationUtil } from "../../util/LocationUtil.js";
import {
  RatingRowDTO,
  computeSummaryFromRows,
  getUserRatingFromRows
} from "../../util/RatingDtoUtil.js";

type Navigator = {
  redirectToLoginPage(): void;
  redirectToMainPage(): void;
};

export type UserService = {
  getCurrentUser(success: (u: User) => void, error: (e: any) => void): void;
};

export type FileService = {
  getFilesByUser(
    userId: string,
    success: (files: File[]) => void,
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

export type FavouriteDTO = { userId: string; fileId: number };

export type FavouritesService = {
  getFavourites(userId: string, success: (favs: FavouriteDTO[]) => void, error: (e: any) => void): void;
  addFavourite(userId: string, fileId: number, success: () => void, error: (e: any) => void): void;
  removeFavourite(userId: string, fileId: number, success: () => void, error: (e: any) => void): void;
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

export class UserFilesViewHandler {
  private currentUser: User | null = null;
  private currentUserUid: string | null = null;
  private currentUserIsAdmin = false;

  private uploaderId: string | null = null;
  private currentFiles: File[] = [];

  constructor(
    private view: UserFilesView,
    private userService: UserService,
    private fileService: FileService,
    private favouritesService: FavouritesService,
    private ratingService: RatingService,
    private nav: Navigator = locationUtil
  ) {}

  init(): void {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) {
      this.view.showError("Missing uploader id in URL (?id=...)");
      return;
    }
    this.uploaderId = id;

    this.view.bindFileActions((action, fileId, rateValue) => {
      this.view.clearError();

      if (action === "download") this.onDownloadClicked(fileId);
      if (action === "report") this.onReportClicked(fileId);
      if (action === "delete") this.onDeleteClicked(fileId);
      if (action === "favourite") this.onFavouriteClicked(fileId);

      if (action === "rate") {
        const v = String(rateValue ?? "").toUpperCase();
        if (v !== "BAD" && v !== "MEDIUM" && v !== "GOOD") return;
        this.onRateClicked(fileId, v as any);
      }
    });

    this.userService.getCurrentUser(
      (u) => {
        this.currentUser = u;
        this.currentUserUid = String(u.getId());
        this.currentUserIsAdmin = (u.getIsAdmin?.() ?? false) === true;

        this.reloadFilesForUploader();
      },
      (_e) => {
        this.currentUser = null;
        this.currentUserUid = null;
        this.currentUserIsAdmin = false;

        this.reloadFilesForUploader();
      }
    );
  }

  private reloadFilesForUploader(): void {
    if (!this.uploaderId) return;

    this.view.renderFilesLoading();

    this.fileService.getFilesByUser(
      this.uploaderId,
      (files) => {
        this.currentFiles = files;

        const firstUploader =
          (files?.[0] as any)?.uploader ??
          (files?.[0] as any)?.getUploader?.();

        const uploaderName =
          firstUploader?.name ??
          firstUploader?.getName?.() ??
          this.uploaderId;

        this.view.setUploaderLabel(`Files uploaded by ${uploaderName}`);

        for (const f of this.currentFiles) {
          (f as any).fav = false;
          (f as any).canDelete = false;

          (f as any).ratingSummary = null;
          (f as any).myRatingId = null;
          (f as any).myRatingValue = null;
        }

        for (const f of this.currentFiles) {
          const uploaderId =
            (f as any).uploader?.id ??
            (f as any).getUploader?.()?.getId?.() ??
            (f as any).getUploader?.()?.id ??
            null;

          const isOwner = this.currentUserUid != null && String(uploaderId) === String(this.currentUserUid);
          const isAdmin = this.currentUserIsAdmin === true;

          (f as any).canDelete = isAdmin || isOwner;
        }

        const renderNow = () => this.view.renderFiles(this.currentFiles);

        this.loadRatingsForCurrentFiles(() => {
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
      (status) => this.view.showError(`Failed to load user files: ${String(status)}`)
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

  private onDownloadClicked(fileId: number): void {
    this.fileService.downloadFile(
      fileId,
      (_filename) => {},
      (e) => this.view.showError(`Download failed: ${String(e)}`)
    );
  }

  private onReportClicked(fileId: number): void {
    const f = this.currentFiles.find(x => x.getId() === fileId);
    if (!f) return;

    if (!this.currentUserUid) {
      this.view.showError("Not logged in.");
      return;
    }

    const newReported = !f.getIsReported();

    if (newReported === false && !this.currentUserIsAdmin) {
      this.view.showError("Only admins can unreport files.");
      return;
    }

    const name = f.getName();
    if (!name || typeof name !== "string") {
      this.view.showError("Cannot update file: missing filename.");
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
      (status) => this.view.showError(`Report failed: ${String(status)}`)
    );
  }

  private onDeleteClicked(fileId: number): void {
    const f = this.currentFiles.find(x => x.getId() === fileId);
    if (!f) return;

    const canDelete = (f as any).canDelete === true;
    if (!canDelete) {
      this.view.showError("You are not allowed to delete this file.");
      return;
    }

    const ok = confirm("Delete this file?");
    if (!ok) return;

    this.fileService.deleteFile(
      fileId,
      () => {
        this.currentFiles = this.currentFiles.filter(x => x.getId() !== fileId);
        this.view.renderFiles(this.currentFiles);
        this.reloadFilesForUploader();
      },
      (e) => this.view.showError(`Delete failed: ${String(e)}`)
    );
  }

  private onFavouriteClicked(fileId: number): void {
    const uid = this.currentUserUid;
    if (!uid) {
      this.view.showError("Not logged in.");
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
      this.favouritesService.addFavourite(uid, fileId, done, (e) => this.view.showError(String(e)));
    } else {
      this.favouritesService.removeFavourite(uid, fileId, done, (e) => this.view.showError(String(e)));
    }
  }

  private onRateClicked(fileId: number, value: "BAD" | "MEDIUM" | "GOOD"): void {
    if (!this.currentUserUid) {
      this.view.showError("You must be logged in to rate.");
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

        const refresh = () => this.reloadFilesForUploader();

        if (!mine) {
          this.ratingService.create(
            fileId,
            value,
            refresh,
            (e) => this.view.showError(`Rating failed: ${String(e)}`)
          );
          return;
        }

        if (mineValue === value) {
          this.ratingService.remove(
            mine.id,
            refresh,
            (e) => this.view.showError(`Delete rating failed: ${String(e)}`)
          );
          return;
        }

        this.ratingService.update(
          mine.id,
          value,
          refresh,
          (e) => this.view.showError(`Update rating failed: ${String(e)}`)
        );
      },
      (e) => this.view.showError(`Load ratings failed: ${String(e)}`)
    );
  }
}
