import { httpService } from "./HttpService.js";
import { Subcategory } from "../vo/Subcategory.js";
import { SubcategoryFactory } from "../service/factory/SubcategoryFactory.js";

export class SubcategoryHttpService {
  async getSubcategories(categoryId: number, shallow: boolean = true): Promise<Subcategory[]> {
    const data = await httpService.get<any[]>(
      `/api/categories/${categoryId}/subcategories`,
      { shallow }
    );
    return data.map(SubcategoryFactory.fromJson);
  }
}
