import { serviceFactory } from "../../service/factory/ServiceFactory.js";
import { ServiceName } from "../../service/factory/ServiceName.js";
import { locationUtil } from "../../util/LocationUtil.js";
import { LoginView } from "./LoginView.js";
import { LoginViewHandler } from "./LoginViewHandler.js";
serviceFactory.getService(ServiceName.USER).getCurrentUser((user) => {
    if (user === null) {
        let loginViewHandler = new LoginViewHandler(new LoginView());
        loginViewHandler.render("content");
    }
    else {
        locationUtil.redirectToUserPage();
    }
}, (error) => {
    console.error("Error!");
});
//# sourceMappingURL=login.js.map