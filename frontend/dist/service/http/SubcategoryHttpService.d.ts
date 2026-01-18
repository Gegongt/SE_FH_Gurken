import { Subcategory } from "../../vo/Subcategory.js";
declare class SubcategoryHttpService {
    private URL_SUBCATEGORY_API_BASE;
    private URL_SUBCATEGORY_API_GET_SUBCATEGORIES;
    getSubcategories(categoryId: number | string | null, successCallback: (subcategories: Subcategory[]) => void, errorCallback: (status: any) => void): void;
}
export declare let subcategoryHttpService: SubcategoryHttpService;
export {};
//# sourceMappingURL=SubcategoryHttpService.d.ts.map