export class RegisterView {
    constructor() {
        this.emailInputField = null;
        this.userNameInputField = null;
        this.passwordInputField = null;
        this.registerButton = null;
        this.loginButton = null;
        this.emailInputFieldId = "emailInputField";
        this.userNameInputFieldId = "userNameInputField";
        this.passwordInputFieldId = "passwordInputField";
        this.registerButtonId = "registerButton";
        this.loginButtonId = "loginButton";
        this.parentElementId = null;
    }
    render(parentElementId) {
        let formElement = document.createElement("form");
        formElement.classList.add("p-4", "mb-0");
        formElement.innerHTML = `
            <div class = "mb-3 row">
                <label for = "${this.emailInputFieldId}" class = "col-sm-2 col-form-label">Email</label>
            
                <div class = "col-sm-10">
                    <input id = "${this.emailInputFieldId}" class = "form-control" type = "email" />
                </div>
            </div>

            <div class = "mb-3 row">
                <label for = "${this.userNameInputFieldId}" class = "col-sm-2 col-form-label">User name</label>

                <div class = "col-sm-10">
                    <input id = "${this.userNameInputFieldId}" class = "form-control" type = "text" />
                </div>
            </div>

            <div class = "mb-3 row">
                <label for = "${this.passwordInputFieldId}" class = "col-sm-2 col-form-label">Password</label>
                
                <div class = "col-sm-10">
                    <input id = "${this.passwordInputFieldId}" aria-describedby = "passwordRules" class = "form-control" type = "password" />
                    
                    <div id = "passwordRules" class = "form-text">
                        Your password must be at least 6 characters long.
                    </div>
                </div>
            </div>

            <input id = "${this.loginButtonId}" type = "button" value = "Login" class = "btn btn-secondary p-2" />
            <input id = "${this.registerButtonId}" type = "button" value = "Register" class = "btn btn-primary p-2" />`;
        this.parentElementId = parentElementId;
        let parentElement = document.getElementById(this.parentElementId);
        parentElement?.appendChild(formElement);
        this.emailInputField = document.getElementById(this.emailInputFieldId);
        this.userNameInputField = document.getElementById(this.userNameInputFieldId);
        this.passwordInputField = document.getElementById(this.passwordInputFieldId);
        this.registerButton = document.getElementById(this.registerButtonId);
        this.loginButton = document.getElementById(this.loginButtonId);
    }
    bindRegisterButton(clickHandler) {
        this.registerButton?.addEventListener("click", () => {
            clickHandler(this.emailInputField?.value || "", this.userNameInputField?.value || "", this.passwordInputField?.value || "");
        });
    }
    bindLoginButton(clickHandler) {
        this.loginButton?.addEventListener("click", () => {
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
//# sourceMappingURL=RegisterView.js.map