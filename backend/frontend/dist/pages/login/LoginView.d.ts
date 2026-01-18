export declare class LoginView {
    private emailOrUserNameInputField;
    private passwordInputField;
    private loginButton;
    private registerButton;
    private emailOrUserNameInputFieldId;
    private passwordInputFieldId;
    private loginButtonId;
    private registerButtonId;
    private parentElementId;
    render(parentElementId: string): void;
    bindLoginButton(clickHandler: (emailOrUserName: string, password: string) => void): void;
    bindRegisterButton(clickHandler: () => void): void;
    showError(errorMessage: string, parentElementId: string): void;
    remove(): void;
}
//# sourceMappingURL=LoginView.d.ts.map