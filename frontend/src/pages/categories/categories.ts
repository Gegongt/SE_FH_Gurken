import { CategoriesView } from "./CategoriesView.js";
import { CategoriesViewHandler } from "./CategoriesViewHandler.js";
import { CategoryMemService } from "../../service/CategoryMemService.js";
import { SubcategoryMemService } from "../../service/SubcategoryMemService.js";

const view = new CategoriesView();
const categoryService = new CategoryMemService();
const subcategoryService = new SubcategoryMemService();

const handler = new CategoriesViewHandler(view, categoryService as any, subcategoryService as any);
handler.init();
