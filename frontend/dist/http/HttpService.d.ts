import { HttpContentType } from "./HttpContentType.js";
import { HttpMethod } from "./HttpMethod.js";
declare class HttpService {
    sendRequest(method: HttpMethod, url: string, params: any, body: any, bodyContentType: HttpContentType | null, responseType: any, withCredentials: boolean, accessToken: string | null, successCallback: any, errorCallback: any): void;
    get(url: string, params: any, withCredentials: boolean, success: (data: any) => void, error: (status: any) => void): void;
}
export declare let httpService: HttpService;
export {};
//# sourceMappingURL=HttpService.d.ts.map