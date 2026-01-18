import { locationUtil } from "../../util/LocationUtil.js";
import { computeSummaryFromRows, getUserRatingFromRows } from "../../util/RatingDtoUtil.js";
console.log("CategoriesViewHandler init()");
export class CategoriesViewHandler {
    constructor(userService, view, categoryService, subcategoryService, fileService, ratingService, examService, favouritesService, nav = locationUtil) {
        this.userService = userService;
        this.view = view;
        this.categoryService = categoryService;
        this.subcategoryService = subcategoryService;
        this.fileService = fileService;
        this.ratingService = ratingService;
        this.examService = examService;
        this.favouritesService = favouritesService;
        this.nav = nav;
        this.currentUserUid = null;
        this.currentUserIsAdmin = false;
        this.allCategories = [];
        this.selectedSubcategoryId = null;
        this.currentFiles = [];
        this.currentExams = [];
    }
    init() {
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
            if (action === "edit")
                this.nav.redirectToExamEditorPage(examId);
            if (action === "execute")
                this.nav.redirectToExamExecutorPage(examId);
        });
        this.userService.getCurrentUser((u) => {
            this.currentUserUid = String(u.getId());
            this.currentUserIsAdmin = (u.getIsAdmin?.() ?? false) === true;
            if (this.selectedSubcategoryId != null) {
                this.reloadFiles(this.selectedSubcategoryId);
            }
        }, (_e) => {
            this.currentUserUid = null;
            this.currentUserIsAdmin = false;
            if (this.selectedSubcategoryId != null) {
                this.reloadFiles(this.selectedSubcategoryId);
            }
        });
        this.categoryService.getCategories(true, (categories) => {
            this.allCategories = categories;
            this.view.renderCategories(this.allCategories);
            this.view.renderSubcategories([]);
        }, (status) => {
            this.view.renderError(`Failed to load categories: ${String(status)}`);
        });
    }
    setCurrentUser(uid) {
        this.currentUserUid = uid;
    }
    onSearch(text) {
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
        const filtered = this.allCategories.filter((c) => c.getName().toLowerCase().includes(q));
        this.view.renderCategories(filtered);
    }
    onCategoryClicked(categoryId) {
        this.selectedSubcategoryId = null;
        this.view.enableActions(false);
        this.currentFiles = [];
        this.view.clearExams();
        this.currentExams = [];
        this.view.clearSubcategories();
        this.view.clearFiles();
        this.view.renderSubcategoriesLoading();
        this.subcategoryService.getSubcategories(categoryId, (subs) => this.view.renderSubcategories(subs), (status) => this.view.renderError(`Failed to load subcategories: ${String(status)}`));
    }
    onSubcategoryClicked(subcategoryId) {
        this.selectedSubcategoryId = subcategoryId;
        this.view.enableActions(true);
        this.reloadFiles(subcategoryId);
        this.reloadExams(subcategoryId);
    }
    onUploadClicked() {
        if (this.selectedSubcategoryId == null) {
            this.view.renderError("Please select a subcategory first.");
            return;
        }
        this.view.openFilePicker();
    }
    onFileSelected(file) {
        if (this.selectedSubcategoryId == null)
            return;
        const subId = this.selectedSubcategoryId;
        this.fileService.uploadFile(subId, file, (_created) => {
            this.reloadFiles(subId);
        }, (status) => {
            console.log("UPLOAD ERROR raw:", status);
            this.view.renderError(`Upload failed: ${JSON.stringify(status)}`);
        });
    }
    reloadFiles(subcategoryId) {
        this.view.renderFilesLoading();
        this.fileService.getFiles(subcategoryId, true, (files) => {
            this.currentFiles = files;
            // init view-model flags
            for (const f of this.currentFiles) {
                f.fav = false;
                f.canDelete = false;
                // ratings VM
                f.ratingSummary = null;
                f.myRatingId = null; // <- wichtig für PUT/DELETE
                f.myRatingValue = null; // <- optional fürs Button-Highlight
            }
            // canDelete bestimmen
            for (const f of this.currentFiles) {
                const uploaderId = f.uploader?.id ??
                    f.getUploader?.()?.getId?.() ??
                    f.getUploader?.()?.id ??
                    null;
                const isOwner = this.currentUserUid != null && String(uploaderId) === String(this.currentUserUid);
                const isAdmin = this.currentUserIsAdmin === true;
                f.canDelete = isAdmin || isOwner;
            }
            const renderNow = () => this.view.renderFiles(this.currentFiles);
            // 1) ratings laden -> summary + myRatingId/myRatingValue setzen
            this.loadRatingsForCurrentFiles(() => {
                // 2) favourites laden (falls user eingeloggt)
                if (!this.currentUserUid) {
                    renderNow();
                    return;
                }
                this.favouritesService.getFavourites(this.currentUserUid, (favs) => {
                    const favSet = new Set(favs.map((x) => Number(x.fileid ?? x.fileId)));
                    for (const f of this.currentFiles) {
                        f.fav = favSet.has(f.getId());
                    }
                    renderNow();
                }, (_e) => renderNow());
            });
        }, (status) => this.view.renderError(`Failed to load files: ${String(status)}`));
    }
    loadRatingsForCurrentFiles(done) {
        const files = this.currentFiles;
        if (!files || files.length === 0) {
            done();
            return;
        }
        let remaining = files.length;
        const tick = () => {
            remaining--;
            if (remaining <= 0)
                done();
        };
        for (const f of files) {
            this.ratingService.listByFile(f.getId(), (rows) => {
                f.ratingSummary = computeSummaryFromRows(rows);
                const mine = getUserRatingFromRows(rows, this.currentUserUid ?? null);
                f.myRatingId = mine.ratingId;
                f.myRatingValue = mine.value;
                tick();
            }, (_e) => tick());
        }
    }
    onReportClicked(fileId) {
        const f = this.currentFiles.find(x => x.getId() === fileId);
        if (!f)
            return;
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
        this.fileService.reportFile(fileId, name, newReported, (updated) => {
            f.setIsReported(updated.getIsReported());
            if (updated.getName?.())
                f.setName(updated.getName());
            this.view.renderFiles(this.currentFiles);
        }, (status) => this.view.renderError(`Report failed: ${String(status)}`));
    }
    onDownloadClicked(fileId) {
        this.fileService.downloadFile(fileId, (filename) => {
            console.log("Downloaded:", filename);
        }, (err) => this.view.renderError(`Download failed: ${String(err)}`));
    }
    reloadExams(subcategoryId) {
        this.examService.getExams(subcategoryId, (exams) => {
            this.currentExams = exams;
            this.view.renderExams(this.currentExams);
        }, (status) => this.view.renderError(`Failed to load exams: ${String(status)}`));
    }
    onCreateExamClicked() {
        if (this.selectedSubcategoryId == null) {
            this.view.renderError("Please select a subcategory first.");
            return;
        }
        this.nav.redirectToExamEditorPage(null, this.selectedSubcategoryId);
    }
    onFavouriteClicked(fileId) {
        const uid = this.currentUserUid;
        if (!uid) {
            this.view.renderError("Not logged in.");
            return;
        }
        const f = this.currentFiles.find(x => x.getId() === fileId);
        if (!f)
            return;
        const isFav = f.fav === true;
        const done = () => {
            f.fav = !isFav;
            this.view.renderFiles(this.currentFiles);
        };
        if (!isFav) {
            this.favouritesService.addFavourite(uid, fileId, done, (e) => this.view.renderError(String(e)));
        }
        else {
            this.favouritesService.removeFavourite(uid, fileId, done, (e) => this.view.renderError(String(e)));
        }
    }
    onDeleteClicked(fileId) {
        const f = this.currentFiles.find(x => x.getId() === fileId);
        if (!f)
            return;
        const canDelete = f.canDelete === true;
        if (!canDelete) {
            this.view.renderError("You are not allowed to delete this file.");
            return;
        }
        const ok = confirm("Delete this file?");
        if (!ok)
            return;
        this.fileService.deleteFile(fileId, () => {
            this.currentFiles = this.currentFiles.filter(x => x.getId() !== fileId);
            this.view.renderFiles(this.currentFiles);
            if (this.selectedSubcategoryId != null) {
                this.reloadFiles(this.selectedSubcategoryId);
            }
        }, (e) => this.view.renderError(`Delete failed: ${String(e)}`));
    }
    onRateClicked(fileId, value) {
        if (!this.currentUserUid) {
            this.view.renderError("You must be logged in to rate.");
            return;
        }
        this.ratingService.listByFile(fileId, (rows) => {
            const mine = rows.find(r => String(r.userid) === String(this.currentUserUid));
            const mineValue = mine?.ratingisgood ? "GOOD" :
                mine?.ratingismedium ? "MEDIUM" :
                    mine?.ratingisbad ? "BAD" : null;
            const refresh = () => {
                // danach Summary neu laden + UI refreshen (so wie du es jetzt schon machst)
                this.reloadFiles(this.selectedSubcategoryId);
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
        }, (e) => this.view.renderError(`Load ratings failed: ${String(e)}`));
    }
}
//# sourceMappingURL=CategoriesViewHandler.js.map