import { httpService } from "./HttpService.js";
import { Subcategory } from "../vo/Subcategory.js";

export class SubcategoryHttpService {
  getSubcategories(
    categoryId: number,
    shallow: boolean,
    success: (subs: Subcategory[]) => void,
    error: (status: any) => void
  ): void {
    httpService.get<any[]>(
      `/api/categories/${categoryId}/subcategories`,
      { shallow },
      true,
      (data) => success(data.map(j => new Subcategory(j.id, j.name))),
      (status) => error(status)
    );
  }
}
