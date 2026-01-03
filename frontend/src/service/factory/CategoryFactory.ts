import { Category } from "../../vo/Category.js";

export class CategoryFactory {
  static fromJson(json: any): Category {
    return new Category(json.id, json.name);
  }
}
