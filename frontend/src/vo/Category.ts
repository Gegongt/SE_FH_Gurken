import { NamedEntity } from "./NamedEntity.js";
import { Subcategory } from "./Subcategory.js";

export class Category extends NamedEntity {
  private subcategories: Subcategory[] | undefined;

  constructor(id: number, name: string, subcategories?: Subcategory[]) {
    super(id, name);
    this.subcategories = subcategories;
  }

  getSubcategories(): Subcategory[] | undefined {
    return this.subcategories;
  }

  setSubcategories(subcategories: Subcategory[]): void {
    this.subcategories = subcategories;
  }
}

