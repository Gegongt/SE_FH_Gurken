import { CategoriesView } from "./CategoriesView.js";
import { CategoriesViewHandler } from "./CategoriesViewHandler.js";
import { serviceFactory } from "../../service/factory/ServiceFactory.js";
import { ServiceName } from "../../service/factory/ServiceName.js";
import { locationUtil } from "../../util/LocationUtil.js";

const categoryService = serviceFactory.getService(ServiceName.CATEGORY);
const subcategoryService = serviceFactory.getService(ServiceName.SUBCATEGORY);
const fileService = serviceFactory.getService(ServiceName.FILE);
const ratingService = serviceFactory.getService(ServiceName.RATING);
const examService = serviceFactory.getService(ServiceName.EXAM);

const view = new CategoriesView();

const handler = new CategoriesViewHandler(view, categoryService as any, subcategoryService as any, fileService as any, ratingService as any, examService as any, locationUtil);
handler.init();
