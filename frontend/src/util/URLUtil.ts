class URLUtil
{
    getParams(query:string = window.location.search):URLSearchParams
    {
        return new URLSearchParams(query);
    }

    getParam(paramName:string, query:string = window.location.search):string|null
    {
        return this.getParams(query).get(paramName);
    }

    hasParam(paramName:string, query:string = window.location.search):boolean
    {
        return this.getParams(query).has(paramName);
    }
}

export let urlUtil = new URLUtil();
