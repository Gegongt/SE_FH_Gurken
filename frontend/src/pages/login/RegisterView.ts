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

        formElement.innerHTML = `
            <label for = "${this.emailInputFieldId}">Email</label>
            <input id = "${this.emailInputFieldId}" type = "email" />

            <label for = "${this.userNameInputFieldId}">User name</label>
            <input id = "${this.userNameInputFieldId}" type = "text" />
            
            <label for = "${this.passwordInputFieldId}">Password</label>
            <input id = "${this.passwordInputFieldId}" type = "password" />

            <input id = "${this.registerButtonId}" type = "button" value = "Register" />
            <input id = "${this.loginButtonId}" type = "button" value = "Login" />`;

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
