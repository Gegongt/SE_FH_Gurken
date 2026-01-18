import { NotAuthorizedError } from "../../service/error/NotAuthorizedError.js";
import { serviceFactory } from "../../service/factory/ServiceFactory.js";
import { ServiceName } from "../../service/factory/ServiceName.js";
import { LoginView } from "./LoginView.js";
import { LoginViewHandler } from "./LoginViewHandler.js";
export class RegisterViewHandler {
    constructor(registerView) {
        this.parentElementId = null;
        this.registerView = registerView;
    }
    render(parentElementId) {
        this.parentElementId = parentElementId;
        this.registerView.render(this.parentElementId);
        let switchToLoginView = () => {
            let loginViewHandler = new LoginViewHandler(new LoginView());
            this.registerView.remove();
            loginViewHandler.render(this.parentElementId);
        };
        this.registerView.bindRegisterButton((email, userName, password) => {
            serviceFactory.getService(ServiceName.USER).create(email, userName, password, switchToLoginView, (error) => {
                let errorMessage = "Failed to register!";
                if (error instanceof NotAuthorizedError) {
                    errorMessage = "User already exists or password is to weak!";
                }
                this.registerView.showError(errorMessage, this.parentElementId);
            });
        });
        this.registerView.bindLoginButton(switchToLoginView);
    }
}
//# sourceMappingURL=RegisterViewHandler.js.map