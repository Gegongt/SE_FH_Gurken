import { Subcategory } from "../vo/Subcategory.js";

export class SubcategoryMemService {
  async getSubcategories(categoryId: number, shallow: boolean = true): Promise<Subcategory[]> {
    if (categoryId === 1) return [new Subcategory(1, "Datenbanken"), new Subcategory(2, "SE")];
    if (categoryId === 2) return [new Subcategory(3, "Analysis"), new Subcategory(4, "Algebra")];
    return [];
  }
}
