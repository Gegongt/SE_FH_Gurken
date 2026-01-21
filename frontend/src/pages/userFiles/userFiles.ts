import { serviceFactory } from "../../service/factory/ServiceFactory.js";
import { ServiceName } from "../../service/factory/ServiceName.js";
import { locationUtil } from "../../util/LocationUtil.js";
import { User } from "../../vo/User.js";
import { UserFilesView } from "./UserFilesView.js";
import { UserFilesViewHandler } from "./UserFilesViewHandler.js";
import { HeaderView } from "../components/header/HeaderView.js";
import { HeaderViewHandler } from "../components/header/HeaderViewHandler.js";

const view = new UserFilesView();
const userService = serviceFactory.getService(ServiceName.USER);
const fileService = serviceFactory.getService(ServiceName.FILE);
const favouritesService = serviceFactory.getService(ServiceName.FAVOURITES);
const ratingService = serviceFactory.getService(ServiceName.RATING); // falls du ServiceName.RATING so hast

const handler = new UserFilesViewHandler(
  view,
  userService as any,
  fileService as any,
  favouritesService as any,
  ratingService as any
);

const headerViewHandler = new HeaderViewHandler(new HeaderView());
headerViewHandler.render("header");

handler.init();

userService.getCurrentUser((user: User | null) => {
  if (user === null) {
    locationUtil.redirectToLoginPage();
  }
});
