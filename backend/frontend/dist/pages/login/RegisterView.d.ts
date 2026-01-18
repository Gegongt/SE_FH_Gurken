export declare class RegisterView {
    private emailInputField;
    private userNameInputField;
    private passwordInputField;
    private registerButton;
    private loginButton;
    private emailInputFieldId;
    private userNameInputFieldId;
    private passwordInputFieldId;
    private registerButtonId;
    private loginButtonId;
    private parentElementId;
    render(parentElementId: string): void;
    bindRegisterButton(clickHandler: (email: string, userName: string, password: string) => void): void;
    bindLoginButton(clickHandler: () => void): void;
    showError(errorMessage: string, parentElementId: string): void;
    remove(): void;
}
//# sourceMappingURL=RegisterView.d.ts.map