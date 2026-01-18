import { Subcategory } from "../vo/Subcategory.js";
export class SubcategoryMemService {
    getSubcategories(categoryId, shallow, success, error) {
        setTimeout(() => {
            if (categoryId === 1)
                return success([new Subcategory(1, "Datenbanken"), new Subcategory(2, "SE")]);
            if (categoryId === 2)
                return success([new Subcategory(3, "Analysis"), new Subcategory(4, "Lineare Algebra")]);
            return success([]);
        }, 0);
    }
}
export let subcategoryMemService = new SubcategoryMemService();
//# sourceMappingURL=SubcategoryMemService.js.map