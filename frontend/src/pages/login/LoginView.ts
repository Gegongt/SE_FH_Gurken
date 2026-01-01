export class LoginView
{
    private emailOrUserNameInputField:HTMLInputElement|null = null;
    private passwordInputField:HTMLInputElement|null = null;
    private loginButton:HTMLInputElement|null = null;

    private emailOrUserNameInputFieldId:string = "emailOrUserNameInputField";
    private passwordInputFieldId:string = "passwordInputField";
    private loginButtonId = "loginButton";

    render(parentElementId:string)
    {
        let formElement = document.createElement("form");

        formElement.innerHTML = `
            <label for = "${this.emailOrUserNameInputFieldId}">Email or Username</label>
            <input id = "${this.emailOrUserNameInputFieldId}" type = "text" />

            <label for = "${this.passwordInputFieldId}">Password</label>
            <input id = "${this.passwordInputFieldId}" type = "password" />

            <input id = "${this.loginButtonId}" type = "button" value = "Login">`;

        let parentElement = document.getElementById(parentElementId);
        parentElement?.appendChild(formElement);

        this.emailOrUserNameInputField = document.getElementById(this.emailOrUserNameInputFieldId) as HTMLInputElement | null;
        this.passwordInputField = document.getElementById(this.passwordInputFieldId) as HTMLInputElement | null;
        this.loginButton = document.getElementById(this.loginButtonId) as HTMLInputElement | null;
    }

    bindLoginButton(clickHandler:(emailOrUserName:string, password:string) => void):void
    {
        this.loginButton?.addEventListener("click", () =>
        {
            clickHandler(this.emailOrUserNameInputField?.value || "", this.passwordInputField?.value || "");
        });
    }
}
