import { serviceFactory } from "../../service/factory/ServiceFactory.js";
import { ServiceName } from "../../service/factory/ServiceName.js";
import { locationUtil } from "../../util/LocationUtil.js";
import { User } from "../../vo/User.js";
import { LoginView } from "./LoginView.js";
import { LoginViewHandler } from "./LoginViewHandler.js";

serviceFactory.getService(ServiceName.USER).getCurrentUser((user:User|null) =>
{
    if(user === null)
    {
        let loginViewHandler = new LoginViewHandler(new LoginView());
        loginViewHandler.render("content");
    }

    else
    {
        locationUtil.redirectToUserPage();
    }
});
