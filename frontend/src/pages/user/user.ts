import { ServiceError } from "../../service/error/ServiceError.js";
import { serviceFactory } from "../../service/factory/ServiceFactory.js";
import { ServiceName } from "../../service/factory/ServiceName.js";
import { locationUtil } from "../../util/LocationUtil.js";
import { User } from "../../vo/User.js";
import { UserView } from "./UserView.js";
import { UserViewHandler } from "./UserViewHandler.js";
import { HeaderView } from "../components/header/HeaderView.js";
import { HeaderViewHandler } from "../components/header/HeaderViewHandler.js";
import { Category } from "../../vo/Category.js";
import { Subcategory } from "../../vo/Subcategory.js";

const view = new UserView();
const userService = serviceFactory.getService(ServiceName.USER);
const fileService = serviceFactory.getService(ServiceName.FILE);
const handler = new UserViewHandler(view, userService as any, fileService as any);
const headerViewHandler = new HeaderViewHandler(new HeaderView());
headerViewHandler.render("header");

handler.init();
console.log("user.ts loaded");

userService.getCurrentUser((user:User|null) =>
{
    if(user === null)
    {
        locationUtil.redirectToLoginPage();
    }

    else
    {
        serviceFactory.getService(ServiceName.CATEGORY).getCategories(true,
        (categories:Category[]) =>
        {
            console.log(categories);

            serviceFactory.getService(ServiceName.SUBCATEGORY).getSubcategories(null,
            (subcategories:Subcategory[]) =>
            {
                console.log(subcategories);
            },
        
            (error:ServiceError) =>
            {
                console.log(error);
            });

            serviceFactory.getService(ServiceName.SUBCATEGORY).getSubcategories(categories[0]?.getId(),
            (subcategories:Subcategory[]) =>
            {
                console.log("Subcategories of " + categories[0]?.getId());
                console.log(subcategories);
            },
            
            (error:ServiceError) =>
            {
                console.log(error);
            });
        },
    
        (error:ServiceError) => console.log(error));
    }
});
