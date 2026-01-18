import { NamedEntity } from "./NamedEntity.js";
import { Subcategory } from "./Subcategory.js";
export declare class Category extends NamedEntity {
    private subcategories;
    constructor(id: number, name: string, subcategories?: Subcategory[]);
    getSubcategories(): Subcategory[] | undefined;
    setSubcategories(subcategories: Subcategory[]): void;
}
//# sourceMappingURL=Category.d.ts.map