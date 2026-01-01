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

        formElement.innerHTML = `
            <label for = "${this.emailOrUserNameInputFieldId}">Email or Username</label>
            <input id = "${this.emailOrUserNameInputFieldId}" type = "text" />

            <label for = "${this.passwordInputFieldId}">Password</label>
            <input id = "${this.passwordInputFieldId}" type = "password" />

            <input id = "${this.loginButtonId}" type = "button" value = "Login" />
            <input id = "${this.registerButtonId}" type = "button" value = "Register" />`;

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

    remove()
    {
        if(this.parentElementId !== null)
        {
            document.getElementById(this.parentElementId)!.innerHTML = "";
        }
    }
}
