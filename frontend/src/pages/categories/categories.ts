import { CategoriesView } from "./CategoriesView.js";
import { CategoriesViewHandler } from "./CategoriesViewHandler.js";
import { serviceFactory } from "../../service/factory/ServiceFactory.js";
import { ServiceName } from "../../service/factory/ServiceName.js";

const categoryService = serviceFactory.getService(ServiceName.CATEGORY);
const subcategoryService = serviceFactory.getService(ServiceName.SUBCATEGORY);
const view = new CategoriesView();

const handler = new CategoriesViewHandler(view, categoryService as any, subcategoryService as any);
handler.init();
