import { CategoriesView } from "./CategoriesView.js";
import { CategoriesViewHandler } from "./CategoriesViewHandler.js";
import { serviceFactory } from "../../service/factory/ServiceFactory.js";
import { ServiceName } from "../../service/factory/ServiceName.js";
import { locationUtil } from "../../util/LocationUtil.js";
import { HeaderView } from "../components/header/HeaderView.js";
import { HeaderViewHandler } from "../components/header/HeaderViewHandler.js";


const categoryService = serviceFactory.getService(ServiceName.CATEGORY);
const subcategoryService = serviceFactory.getService(ServiceName.SUBCATEGORY);
const fileService = serviceFactory.getService(ServiceName.FILE);
const ratingService = serviceFactory.getService(ServiceName.RATING);
const examService = serviceFactory.getService(ServiceName.EXAM);
const favouritesService = serviceFactory.getService(ServiceName.FAVOURITES);
const headerViewHandler = new HeaderViewHandler(new HeaderView());
headerViewHandler.render("header");

const view = new CategoriesView();

const handler = new CategoriesViewHandler(view, categoryService as any, subcategoryService as any, fileService as any, ratingService as any, examService as any, favouritesService as any, locationUtil);
handler.init();
