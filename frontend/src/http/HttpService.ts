import { HttpContentType } from "./HttpContentType.js";
import { HttpMethod } from "./HttpMethod.js";

class HttpService
{
    sendRequest(method:HttpMethod, url:string, params:any, body:any, bodyContentType:HttpContentType,
                responseType:any, withCredentials:boolean, successCallback:any, errorCallback:any)
    {
        let xhr = new XMLHttpRequest();

        //let urlObject = new URL(url);
        let urlObject = new URL(url, window.location.origin);

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
    
        xhr.open(method, urlObject.toString());

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

     get<T>(url: string, params?: any, withCredentials: boolean = true): Promise<T> {
    return new Promise((resolve, reject) => {
      this.sendRequest(
        HttpMethod.METHOD_GET,
        url,
        params ?? null,
        null,
        HttpContentType.CONTENT_TYPE_JSON,
        "json",
        withCredentials,
        (data: T) => resolve(data as T),
        (status: any) => reject(status)
      );
    });
  }
}

//global httpService
export let httpService = new HttpService();
