import { HttpContentType } from "./HttpContentType.js";
import { HttpMethod } from "./HttpMethod.js";
class HttpService {
    sendRequest(method, url, params, body, bodyContentType, responseType, withCredentials, accessToken, successCallback, errorCallback) {
        let xhr = new XMLHttpRequest();
        //let urlObject = new URL(url);
        let urlObject = new URL(url, window.location.origin);
        xhr.withCredentials = withCredentials ?? false;
        if (params) {
            for (let param of Object.keys(params)) {
                urlObject.searchParams.set(param, params[param]);
            }
        }
        if (responseType) {
            xhr.responseType = responseType;
        }
        xhr.open(method, urlObject.toString());
        if (accessToken) {
            xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
        }
        xhr.onload = () => {
            if (xhr.status < 200 || xhr.status > 299) {
                errorCallback(xhr.status);
            }
            else {
                successCallback(xhr.response);
            }
        };
        xhr.onerror = () => {
            errorCallback(xhr.status);
        };
        if (body && bodyContentType) {
            xhr.setRequestHeader("Content-Type", bodyContentType);
            xhr.send(JSON.stringify(body));
        }
        else {
            xhr.send();
        }
    }
    get(url, params, withCredentials, success, error) {
        this.sendRequest(HttpMethod.METHOD_GET, url, params ?? null, null, HttpContentType.CONTENT_TYPE_JSON, "json", withCredentials ?? true, null, (data) => success(data), (status) => error(status));
    }
}
//global httpService
export let httpService = new HttpService();
//# sourceMappingURL=HttpService.js.map