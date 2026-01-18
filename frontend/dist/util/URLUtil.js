class URLUtil {
    getParams(query = window.location.search) {
        return new URLSearchParams(query);
    }
    getParam(paramName, query = window.location.search) {
        return this.getParams(query).get(paramName);
    }
    hasParam(paramName, query = window.location.search) {
        return this.getParams(query).has(paramName);
    }
}
export let urlUtil = new URLUtil();
//# sourceMappingURL=URLUtil.js.map