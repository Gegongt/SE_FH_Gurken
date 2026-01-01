import { ServiceError } from "../../service/error/ServiceError.js";
import { serviceFactory } from "../../service/factory/ServiceFactory.js";
import { ServiceName } from "../../service/factory/ServiceName.js";
import { locationUtil } from "../../util/LocationUtil.js";
import { User } from "../../vo/User.js";

const userService = serviceFactory.getService(ServiceName.USER);

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
