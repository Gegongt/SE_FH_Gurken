import { Category } from "../../vo/Category.js";
import { CategoriesView } from "./CategoriesView.js";
import { File } from "../../vo/File.js";
import { Subcategory } from "../../vo/Subcategory.js";
import { Exam } from "../../vo/Exam.js";
import { User } from "../../vo/User.js";
import { RatingRowDTO } from "../../util/RatingDtoUtil.js";
type Navigator = {
    redirectToExamExecutorPage(id: number): void;
    redirectToExamEditorPage(id?: number | null, subcategoryId?: number | null): void;
    redirectToLoginPage(): void;
    redirectToUserPage(): void;
    redirectToMainPage(): void;
};
export type UserService = {
    getCurrentUser(success: (u: User) => void, error: (e: any) => void): void;
};
export type CategoryService = {
    getCategories(shallow: boolean, success: (cats: Category[]) => void, error: (status: any) => void): void;
};
export type SubcategoryService = {
    getSubcategories(categoryId: number, success: (subs: Subcategory[]) => void, error: (status: any) => void): void;
};
export type FileService = {
    getFiles(subcategoryId: number, shallow: boolean, success: (files: File[]) => void, error: (status: any) => void): void;
    uploadFile(subcategoryId: number, file: globalThis.File, success: (created: File) => void, error: (status: any) => void): void;
    reportFile(fileId: number, name: string, reported: boolean, success: (updated: File) => void, error: (status: any) => void): void;
    downloadFile(fileId: number, success: (filename?: string) => void, error: (status: any) => void): void;
    deleteFile(fileId: number, success: () => void, error: (status: any) => void): void;
};
export type RatingService = {
    listByFile(fileId: number, success: (rows: RatingRowDTO[]) => void, error: (status: any) => void): void;
    create(fileId: number, value: "BAD" | "MEDIUM" | "GOOD", success: () => void, error: (status: any) => void): void;
    update(ratingId: number, value: "BAD" | "MEDIUM" | "GOOD", success: () => void, error: (status: any) => void): void;
    remove(ratingId: number, success: () => void, error: (status: any) => void): void;
};
export type ExamService = {
    getExams(subcategoryId: number, success: (exams: Exam[]) => void, error: (status: any) => void): void;
};
export type FavouriteDTO = {
    userId: string;
    fileId: number;
};
export type FavouritesService = {
    getFavourites(userId: string, success: (favs: FavouriteDTO[]) => void, error: (e: any) => void): void;
    addFavourite(userId: string, fileId: number, success: () => void, error: (e: any) => void): void;
    removeFavourite(userId: string, fileId: number, success: () => void, error: (e: any) => void): void;
};
export declare class CategoriesViewHandler {
    private userService;
    private view;
    private categoryService;
    private subcategoryService;
    private fileService;
    private ratingService;
    private examService;
    private favouritesService;
    private nav;
    private currentUserUid;
    private currentUserIsAdmin;
    private allCategories;
    private selectedSubcategoryId;
    private currentFiles;
    private currentExams;
    constructor(userService: UserService, view: CategoriesView, categoryService: CategoryService, subcategoryService: SubcategoryService, fileService: FileService, ratingService: RatingService, examService: ExamService, favouritesService: FavouritesService, nav?: Navigator);
    init(): void;
    setCurrentUser(uid: string): void;
    private onSearch;
    private onCategoryClicked;
    private onSubcategoryClicked;
    private onUploadClicked;
    private onFileSelected;
    private reloadFiles;
    private loadRatingsForCurrentFiles;
    private onReportClicked;
    private onDownloadClicked;
    private reloadExams;
    private onCreateExamClicked;
    private onFavouriteClicked;
    private onDeleteClicked;
    private onRateClicked;
}
export {};
//# sourceMappingURL=CategoriesViewHandler.d.ts.map