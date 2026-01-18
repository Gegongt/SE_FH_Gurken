import { serviceFactory } from "../../service/factory/ServiceFactory.js";
import { ServiceName } from "../../service/factory/ServiceName.js";
import { locationUtil } from "../../util/LocationUtil.js";
import { UserView } from "./UserView.js";
import { UserViewHandler } from "./UserViewHandler.js";
import { HeaderView } from "../components/header/HeaderView.js";
import { HeaderViewHandler } from "../components/header/HeaderViewHandler.js";
const view = new UserView();
const userService = serviceFactory.getService(ServiceName.USER);
const fileService = serviceFactory.getService(ServiceName.FILE);
const favouritesService = serviceFactory.getService(ServiceName.FAVOURITES);
const handler = new UserViewHandler(view, userService, favouritesService, fileService);
const headerViewHandler = new HeaderViewHandler(new HeaderView());
headerViewHandler.render("header");
handler.init();
console.log("user.ts loaded");
userService.getCurrentUser((user) => {
    if (user === null) {
        locationUtil.redirectToLoginPage();
    }
});
//# sourceMappingURL=user.js.map