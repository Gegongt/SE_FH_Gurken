import { Category } from "../vo/Category.js";

export class CategoryMemService {
  getCategories(
    shallow: boolean,
    success: (cats: Category[]) => void,
    error: (status: any) => void
  ): void {
    setTimeout(() => {
      success([
        new Category(1, "Informatik"),
        new Category(2, "Mathematik"),
        new Category(3, "Netzwerke"),
      ]);
    }, 0);
  }
}

export let categoryMemService = new CategoryMemService();
