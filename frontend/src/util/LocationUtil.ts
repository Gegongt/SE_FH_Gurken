class LocationUtil
{
    private URL_REDIRECT_BASE = "/src/pages";
    private URL_REDIRECT_LOGIN_PAGE = this.URL_REDIRECT_BASE + "/login/login.html";
    private URL_REDIRECT_USER_PAGE = this.URL_REDIRECT_BASE + "/user/user.html";
    private URL_REDIRECT_MAIN_PAGE = this.URL_REDIRECT_BASE + "";

    redirect(location:string, params?:any)
    {
        const urlObject = new URL(window.location.origin + location);

        if(params)
        {
            for(let param of Object.keys(params))
            {
                urlObject.searchParams.set(param, params[param]);
            }
        }

        window.location.href = urlObject.toString();
    }

    redirectToLoginPage()
    {
        this.redirect(this.URL_REDIRECT_LOGIN_PAGE);
    }

    redirectToUserPage()
    {
        this.redirect(this.URL_REDIRECT_USER_PAGE);
    }

    redirectToMainPage()
    {
        this.redirect(this.URL_REDIRECT_MAIN_PAGE);
    }
}

export const locationUtil = new LocationUtil();
