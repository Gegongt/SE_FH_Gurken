import { HttpContentType } from "./HttpContentType.js";
import { HttpMethod } from "./HttpMethod.js";

class HttpService
{
    sendRequest(method:HttpMethod, url:string, params:any, body:any, bodyContentType:HttpContentType,
                responseType:any, withCredentials:boolean, successCallback:any, errorCallback:any)
    {
        let xhr = new XMLHttpRequest();

        let urlObject = new URL(url);

        xhr.withCredentials = withCredentials ?? false;

        if(params)
        {
            for(let param of Object.keys(params))
            {
                urlObject.searchParams.set(param, params[param]);
            }
        }
    
        if(responseType)
        {
            xhr.responseType = responseType;
        }
    
        xhr.open(method, urlObject);

        xhr.onload = () =>
        {
            if(xhr.status != 200 && xhr.status != 201)
            {
                errorCallback(xhr.status);
            }

            else
            {
                successCallback(xhr.response);
            }
        }

        xhr.onerror = () =>
        {
            errorCallback(xhr.status);
        }

        if(body)
        {
            xhr.setRequestHeader("Content-Type", bodyContentType);
            xhr.send(JSON.stringify(body));
        }

        else
        {
            xhr.send();
        }
    }
}

//global httpService
export let httpService = new HttpService();
