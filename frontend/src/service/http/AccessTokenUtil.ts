class AccessTokenUtil
{
    setAccessToken(accessToken:string):void
    {
        localStorage.setItem("accessToken", accessToken);
    }

    getAccessToken():string|null
    {
        let accessToken = localStorage.getItem("accessToken");
    
        return accessToken ? accessToken : null;
    }

    deleteAccessToken():void
    {
        localStorage.removeItem("accessToken");
    }
}

export let accessTokenUtil = new AccessTokenUtil();
