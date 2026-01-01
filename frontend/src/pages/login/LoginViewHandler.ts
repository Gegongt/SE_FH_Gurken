import { ServiceError } from "../../service/error/ServiceError.js";
import { serviceFactory } from "../../service/factory/ServiceFactory.js";
import { ServiceName } from "../../service/factory/ServiceName.js";
import { User } from "../../vo/User.js";
import { LoginView } from "./LoginView.js";

export class LoginViewHandler
{
    private loginView:LoginView;
    
    constructor(loginView:LoginView)
    {
        this.loginView = loginView;
    }

    render(parentElementId:string):void
    {
        this.loginView.render(parentElementId);
        this.loginView.bindLoginButton((emaliOrUserName:string, password:string) =>
        {
            serviceFactory.getService(ServiceName.USER).login(emaliOrUserName, password, (user:User) =>
            {
                console.dir(user);
            },
        
            (error:ServiceError) =>
            {
                console.log(error);
            })            
        });
    }
}
