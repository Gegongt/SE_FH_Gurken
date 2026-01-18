import { Category } from "../../vo/Category.js";
declare class CategoryHttpService {
    private URL_CATEGORY_API_BASE;
    private URL_CATEGORY_API_GET_CATEGORIES;
    getCategories(shallow: boolean, success: (cats: Category[]) => void, errorCallback: (status: any) => void): void;
}
export declare let categoryHttpService: CategoryHttpService;
export {};
//# sourceMappingURL=CategoryHttpService.d.ts.map