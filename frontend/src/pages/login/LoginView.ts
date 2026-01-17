export class LoginView
{
    private emailOrUserNameInputField:HTMLInputElement|null = null;
    private passwordInputField:HTMLInputElement|null = null;
    private loginButton:HTMLInputElement|null = null;
    private registerButton:HTMLInputElement|null = null;

    private emailOrUserNameInputFieldId:string = "emailOrUserNameInputField";
    private passwordInputFieldId:string = "passwordInputField";
    private loginButtonId = "loginButton";
    private registerButtonId = "registerButton";

    private parentElementId:string|null = null;

    render(parentElementId:string)
    {
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

            <input id = "${this.registerButtonId}" type = "button" class = "btn btn-secondary p-2" value = "Register" />
            <input id = "${this.loginButtonId}" type = "button" class = "btn btn-primary p-2" value = "Login" />`;

        this.parentElementId = parentElementId;
        let parentElement = document.getElementById(this.parentElementId);
        parentElement?.appendChild(formElement);

        this.emailOrUserNameInputField = document.getElementById(this.emailOrUserNameInputFieldId) as HTMLInputElement | null;
        this.passwordInputField = document.getElementById(this.passwordInputFieldId) as HTMLInputElement | null;
        this.loginButton = document.getElementById(this.loginButtonId) as HTMLInputElement | null;
        this.registerButton = document.getElementById(this.registerButtonId) as HTMLInputElement | null;
    }

    bindLoginButton(clickHandler:(emailOrUserName:string, password:string) => void):void
    {
        this.loginButton?.addEventListener("click", () =>
        {
            clickHandler(this.emailOrUserNameInputField?.value || "", this.passwordInputField?.value || "");
        });
    }

    bindRegisterButton(clickHandler:() => void):void
    {
        this.registerButton?.addEventListener("click", () =>
        {
            clickHandler();
        });
    }

    showError(errorMessage:string, parentElementId:string)
    {
        let errorArea:HTMLDivElement = document.createElement("div") as HTMLDivElement;
        errorArea.classList.add("p-2", "mt-2", "mb-4", "d-flex", "justify-content-center", "align-items-center", "errorArea");
        
        errorArea.innerHTML = `<p class = "p-2 m-0">${errorMessage}</p>`;
        errorArea.hidden = false;
        
        document.getElementById(parentElementId)!.appendChild(errorArea);
    }

    remove()
    {
        if(this.parentElementId !== null)
        {
            document.getElementById(this.parentElementId)!.innerHTML = "";
        }
    }
}
