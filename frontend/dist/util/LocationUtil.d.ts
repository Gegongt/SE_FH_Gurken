declare class LocationUtil {
    private URL_REDIRECT_BASE;
    private URL_REDIRECT_LOGIN_PAGE;
    private URL_REDIRECT_USER_PAGE;
    private URL_REDIRECT_EXAM_EXECUTOR_PAGE;
    private URL_REDIRECT_EXAM_EDITOR_PAGE;
    private URL_REDIRECT_MAIN_PAGE;
    redirect(location: string, params?: any): void;
    redirectToLoginPage(): void;
    redirectToUserPage(): void;
    redirectToMainPage(): void;
    redirectToExamExecutorPage(id: number): void;
    redirectToExamEditorPage(id?: number | null, subcategoryId?: number | null): void;
    getLoginPageAddress(): string;
    getUserPageAddress(): string;
    getExamExecutorAddress(): string;
    getExamEditorAddress(): string;
    getMainPageAddress(): string;
}
export declare const locationUtil: LocationUtil;
export {};
//# sourceMappingURL=LocationUtil.d.ts.map