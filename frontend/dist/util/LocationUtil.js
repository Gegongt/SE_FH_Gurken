class LocationUtil {
    constructor() {
        this.URL_REDIRECT_BASE = "/src/pages";
        this.URL_REDIRECT_LOGIN_PAGE = this.URL_REDIRECT_BASE + "/login/login.html";
        this.URL_REDIRECT_USER_PAGE = this.URL_REDIRECT_BASE + "/user/user.html";
        this.URL_REDIRECT_EXAM_EXECUTOR_PAGE = this.URL_REDIRECT_BASE + "/exam/executor/exam.html";
        this.URL_REDIRECT_EXAM_EDITOR_PAGE = this.URL_REDIRECT_BASE + "/exam/editor/examEditor.html";
        this.URL_REDIRECT_MAIN_PAGE = this.URL_REDIRECT_BASE + "/categories/categories.html";
    }
    redirect(location, params) {
        const urlObject = new URL(window.location.origin + location);
        if (params) {
            for (let param of Object.keys(params)) {
                urlObject.searchParams.set(param, params[param]);
            }
        }
        window.location.href = urlObject.toString();
    }
    redirectToLoginPage() {
        this.redirect(this.URL_REDIRECT_LOGIN_PAGE);
    }
    redirectToUserPage() {
        this.redirect(this.URL_REDIRECT_USER_PAGE);
    }
    redirectToMainPage() {
        this.redirect(this.URL_REDIRECT_MAIN_PAGE);
    }
    redirectToExamExecutorPage(id) {
        this.redirect(this.URL_REDIRECT_EXAM_EXECUTOR_PAGE, { examId: id });
    }
    redirectToExamEditorPage(id = null, subcategoryId = null) {
        let params = {};
        if (id)
            params.examId = id;
        if (subcategoryId)
            params.subcategoryId = subcategoryId;
        this.redirect(this.URL_REDIRECT_EXAM_EDITOR_PAGE, params);
    }
    getLoginPageAddress() {
        return this.URL_REDIRECT_LOGIN_PAGE;
    }
    getUserPageAddress() {
        return this.URL_REDIRECT_USER_PAGE;
    }
    getExamExecutorAddress() {
        return this.URL_REDIRECT_EXAM_EXECUTOR_PAGE;
    }
    getExamEditorAddress() {
        return this.URL_REDIRECT_EXAM_EDITOR_PAGE;
    }
    getMainPageAddress() {
        return this.URL_REDIRECT_MAIN_PAGE;
    }
}
export const locationUtil = new LocationUtil();
//# sourceMappingURL=LocationUtil.js.map