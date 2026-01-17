import { ServiceError } from "../../service/error/ServiceError.js";
import { serviceFactory } from "../../service/factory/ServiceFactory.js";
import { ServiceName } from "../../service/factory/ServiceName.js";
import { locationUtil } from "../../util/LocationUtil.js";
import { User } from "../../vo/User.js";
import { LoginView } from "./LoginView.js";
import { RegisterView } from "./RegisterView.js";
import { RegisterViewHandler } from "./RegisterViewHandler.js";

export class LoginViewHandler
{
    private loginView:LoginView;
    private parentElementId:string|null = null;
    
    constructor(loginView:LoginView)
    {
        this.loginView = loginView;
    }

    render(parentElementId:string):void
    {
        this.parentElementId = parentElementId;
        this.loginView.render(this.parentElementId);

        this.loginView.bindLoginButton((emailOrUserName:string, password:string) =>
        {
            serviceFactory.getService(ServiceName.USER).login(emailOrUserName, password, (user:User) =>
            {
                locationUtil.redirectToUserPage();
            },
        
            (error:ServiceError) =>
            {
                this.loginView.showError("Login failed!", this.parentElementId as string);
            });
        });

        this.loginView.bindRegisterButton(() =>
        {
            let registerViewHandler = new RegisterViewHandler(new RegisterView());

            this.loginView.remove();
            registerViewHandler.render(this.parentElementId as string);
        });
    }
}
