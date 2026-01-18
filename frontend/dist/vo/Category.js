import { NamedEntity } from "./NamedEntity.js";
export class Category extends NamedEntity {
    constructor(id, name, subcategories) {
        super(id, name);
        this.subcategories = subcategories;
    }
    getSubcategories() {
        return this.subcategories;
    }
    setSubcategories(subcategories) {
        this.subcategories = subcategories;
    }
}
//# sourceMappingURL=Category.js.map