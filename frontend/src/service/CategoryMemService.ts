import { Category } from "../vo/Category.js";

export class CategoryMemService {
  async getCategories(shallow: boolean = true): Promise<Category[]> {
    return [
      new Category(1, "Informatik"),
      new Category(2, "Mathematik"),
      new Category(3, "Netzwerke"),
    ];
  }
}
