import { ServiceError } from "../../service/error/ServiceError.js";
import { serviceFactory } from "../../service/factory/ServiceFactory.js";
import { ServiceName } from "../../service/factory/ServiceName.js";
import { User } from "../../vo/User.js";
import { LoginView } from "./LoginView.js";
import { LoginViewHandler } from "./LoginViewHandler.js";
import { RegisterView } from "./RegisterView.js";

export class RegisterViewHandler
{
    private registerView:RegisterView;
    private parentElementId:string|null = null;
    
    constructor(registerView:RegisterView)
    {
        this.registerView = registerView;
    }

    render(parentElementId:string):void
    {
        this.parentElementId = parentElementId;
        this.registerView.render(this.parentElementId);

        let switchToLoginView = () =>
        {
            let loginViewHandler = new LoginViewHandler(new LoginView());

            this.registerView.remove();
            loginViewHandler.render(this.parentElementId as string);
        };

        this.registerView.bindRegisterButton((email:string, userName:string, password:string) =>
        {
            serviceFactory.getService(ServiceName.USER).create(email, userName, password,
                                                               switchToLoginView,
                                                            
                                                               (error:ServiceError) =>
                                                               {
                                                                   this.registerView.showError("Failed to register!", this.parentElementId as string);
                                                               })
        });

        this.registerView.bindLoginButton(switchToLoginView);
    }
}
