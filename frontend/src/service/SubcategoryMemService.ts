import { Subcategory } from "../vo/Subcategory.js";

export class SubcategoryMemService {
  getSubcategories(
    categoryId: number,
    shallow: boolean,
    success: (subs: Subcategory[]) => void,
    error: (status: any) => void
  ): void {
    setTimeout(() => {
      if (categoryId === 1) return success([new Subcategory(1, "Datenbanken"), new Subcategory(2, "SE")]);
      if (categoryId === 2) return success([new Subcategory(3, "Analysis"), new Subcategory(4, "Lineare Algebra")]);
      return success([]);
    }, 0);
  }
}

export let subcategoryMemService = new SubcategoryMemService();
