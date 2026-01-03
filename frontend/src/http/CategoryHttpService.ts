import { httpService } from "./HttpService.js";
import { Category } from "../vo/Category.js";
import { CategoryFactory } from "../service/factory/CategoryFactory.js";

export class CategoryHttpService {

  async getCategories(shallow: boolean = true): Promise<Category[]> {
    const data = await httpService.get<any[]>(
      "/api/categories",
      { shallow }
    );

    return data.map(CategoryFactory.fromJson);
  }
}

