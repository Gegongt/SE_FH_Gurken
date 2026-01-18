class AccessTokenUtil {
    setAccessToken(accessToken) {
        localStorage.setItem("accessToken", accessToken);
    }
    getAccessToken() {
        let accessToken = localStorage.getItem("accessToken");
        return accessToken ? accessToken : null;
    }
    deleteAccessToken() {
        localStorage.removeItem("accessToken");
    }
}
export let accessTokenUtil = new AccessTokenUtil();
//# sourceMappingURL=AccessTokenUtil.js.map