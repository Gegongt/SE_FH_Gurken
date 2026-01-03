import { Subcategory } from "../../vo/Subcategory.js";
import { NamedEntity } from "../../vo/NamedEntity.js";

export class SubcategoryFactory {
  static fromJson(json: any): Subcategory {
    // shallow:
    return new Subcategory(json.id, json.name);
  }

  static namedEntityFromJson(json: any): NamedEntity {
    return new NamedEntity(json.id, json.name);
  }
}
