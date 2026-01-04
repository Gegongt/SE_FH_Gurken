import { httpService } from "./HttpService.js";
import { Category } from "../vo/Category.js";

export class CategoryHttpService {
  getCategories(
    shallow: boolean,
    success: (cats: Category[]) => void,
    error: (status: any) => void
  ): void {
    httpService.get<any[]>(
      "/api/categories",
      { shallow },
      true,
      (data) => success(data.map(j => new Category(j.id, j.name))),
      (status) => error(status)
    );
  }
}

