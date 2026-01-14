import { ServiceError } from "../../service/error/ServiceError.js";
import { serviceFactory } from "../../service/factory/ServiceFactory.js";
import { ServiceName } from "../../service/factory/ServiceName.js";
import { locationUtil } from "../../util/LocationUtil.js";
import { User } from "../../vo/User.js";
import { UserView } from "./UserView.js";
import { UserViewHandler } from "./UserViewHandler.js";

const view = new UserView();
const userService = serviceFactory.getService(ServiceName.USER);
const handler = new UserViewHandler(view, userService as any);

handler.init();

userService.getCurrentUser((user:User|null) =>
{
    if(user === null)
    {
        locationUtil.redirectToLoginPage();
    }

    else
    {
        document.getElementById("content")!.innerHTML = `
            <p>Already logged in as ${user.getName()}</p>
            <input type = "button" value = "Logout" id = "logoutButton" />`;

        document.getElementById("logoutButton")?.addEventListener("click", () =>
        {
            userService.logout(() => { locationUtil.redirectToLoginPage() },
                               (error:ServiceError) => { console.log("Something went wrong!"); });
        })
    }
});
