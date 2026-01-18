export class LoginView {
    constructor() {
        this.emailOrUserNameInputField = null;
        this.passwordInputField = null;
        this.loginButton = null;
        this.registerButton = null;
        this.emailOrUserNameInputFieldId = "emailOrUserNameInputField";
        this.passwordInputFieldId = "passwordInputField";
        this.loginButtonId = "loginButton";
        this.registerButtonId = "registerButton";
        this.parentElementId = null;
    }
    render(parentElementId) {
        let formElement = document.createElement("form");
        formElement.classList.add("p-4", "mb-0");
        formElement.innerHTML = `
            <div class = "mb-3 row">
                <label for = "${this.emailOrUserNameInputFieldId}" class = "col-sm-2 col-form-label">Email</label>
                
                <div class = "col-sm-10">
                    <input id = "${this.emailOrUserNameInputFieldId}" class = "form-control" type = "text" />
                </div>
            </div>

            <div class = "mb-3 row">
                <label for = "${this.passwordInputFieldId}" class = "col-sm-2 col-form-label">Password</label>
                
                <div class = "col-sm-10">
                    <input id = "${this.passwordInputFieldId}" class = "form-control" type = "password" />
                </div>
            </div>

            <input id = "${this.registerButtonId}" type = "button" class = "btn btn-secondary p-2" value = "Register"/>
            <input id = "${this.loginButtonId}" type = "button" class = "btn btn-primary p-2" value = "Login"/>`;
        this.parentElementId = parentElementId;
        let parentElement = document.getElementById(this.parentElementId);
        parentElement?.appendChild(formElement);
        this.emailOrUserNameInputField = document.getElementById(this.emailOrUserNameInputFieldId);
        this.passwordInputField = document.getElementById(this.passwordInputFieldId);
        this.loginButton = document.getElementById(this.loginButtonId);
        this.registerButton = document.getElementById(this.registerButtonId);
    }
    bindLoginButton(clickHandler) {
        this.loginButton?.addEventListener("click", () => {
            clickHandler(this.emailOrUserNameInputField?.value || "", this.passwordInputField?.value || "");
        });
    }
    bindRegisterButton(clickHandler) {
        this.registerButton?.addEventListener("click", () => {
            clickHandler();
        });
    }
    showError(errorMessage, parentElementId) {
        let errorArea = document.getElementById("errorArea");
        if (!errorArea) {
            errorArea = document.createElement("div");
            errorArea.id = "errorArea";
            errorArea.classList.add("p-2", "mt-2", "mb-4", "d-flex", "justify-content-center", "align-items-center", "errorArea");
            document.getElementById(parentElementId).appendChild(errorArea);
        }
        errorArea.innerHTML = `<p class = "p-2 m-0">${errorMessage}</p>`;
        errorArea.hidden = false;
    }
    remove() {
        if (this.parentElementId !== null) {
            document.getElementById(this.parentElementId).innerHTML = "";
        }
    }
}
//# sourceMappingURL=LoginView.js.map