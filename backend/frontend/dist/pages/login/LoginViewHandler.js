import { serviceFactory } from "../../service/factory/ServiceFactory.js";
import { ServiceName } from "../../service/factory/ServiceName.js";
import { locationUtil } from "../../util/LocationUtil.js";
import { RegisterView } from "./RegisterView.js";
import { RegisterViewHandler } from "./RegisterViewHandler.js";
export class LoginViewHandler {
    constructor(loginView) {
        this.parentElementId = null;
        this.loginView = loginView;
    }
    render(parentElementId) {
        this.parentElementId = parentElementId;
        this.loginView.render(this.parentElementId);
        this.loginView.bindLoginButton((emailOrUserName, password) => {
            serviceFactory.getService(ServiceName.USER).login(emailOrUserName, password, (user) => {
                locationUtil.redirectToUserPage();
            }, (error) => {
                this.loginView.showError("Login failed!", this.parentElementId);
            });
        });
        this.loginView.bindRegisterButton(() => {
            let registerViewHandler = new RegisterViewHandler(new RegisterView());
            this.loginView.remove();
            registerViewHandler.render(this.parentElementId);
        });
    }
}
//# sourceMappingURL=LoginViewHandler.js.map