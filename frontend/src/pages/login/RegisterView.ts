export class RegisterView
{
    private emailInputField:HTMLInputElement|null = null;
    private userNameInputField:HTMLInputElement|null = null;
    private passwordInputField:HTMLInputElement|null = null;
    private registerButton:HTMLInputElement|null = null;
    private loginButton:HTMLInputElement|null = null;

    private emailInputFieldId:string = "emailInputField";
    private userNameInputFieldId:string = "userNameInputField";
    private passwordInputFieldId:string = "passwordInputField";
    private registerButtonId = "registerButton";
    private loginButtonId = "loginButton";

    private parentElementId:string|null = null;

    render(parentElementId:string)
    {
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
                    <input id = "${this.passwordInputFieldId}" class = "form-control" type = "password" />
                </div>
            </div>

            <input id = "${this.loginButtonId}" type = "button" value = "Login" class = "btn btn-secondary p-2" />
            <input id = "${this.registerButtonId}" type = "button" value = "Register" class = "btn btn-primary p-2" />`;

        this.parentElementId = parentElementId;
        let parentElement = document.getElementById(this.parentElementId);
        parentElement?.appendChild(formElement);

        this.emailInputField = document.getElementById(this.emailInputFieldId) as HTMLInputElement | null;
        this.userNameInputField = document.getElementById(this.userNameInputFieldId) as HTMLInputElement | null;
        this.passwordInputField = document.getElementById(this.passwordInputFieldId) as HTMLInputElement | null;
        this.registerButton = document.getElementById(this.registerButtonId) as HTMLInputElement | null;
        this.loginButton = document.getElementById(this.loginButtonId) as HTMLInputElement | null;
    }

    bindRegisterButton(clickHandler:(email:string, userName:string, password:string) => void):void
    {
        this.registerButton?.addEventListener("click", () =>
        {
            clickHandler(this.emailInputField?.value || "", this.userNameInputField?.value || "", this.passwordInputField?.value || "");
        });
    }

    bindLoginButton(clickHandler:() => void):void
    {
        this.loginButton?.addEventListener("click", () =>
        {
            clickHandler();
        });
    }

    remove()
    {
        if(this.parentElementId !== null)
        {
            document.getElementById(this.parentElementId)!.innerHTML = "";
        }
    }
}
