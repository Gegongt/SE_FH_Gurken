import { HttpMethod } from "../../http/HttpMethod.js";
import { HttpContentType } from "../../http/HttpContentType.js";
import { httpService } from "../../http/HttpService.js";
import { accessTokenUtil } from "../http/AccessTokenUtil.js";
export class RatingHttpService {
    constructor() {
        this.URL = "http://localhost:3000/api/ratings";
    }
    listByFile(fileId, success, error) {
        httpService.sendRequest(HttpMethod.METHOD_GET, this.URL, { fileId: String(fileId) }, null, null, "json", false, accessTokenUtil.getAccessToken(), (rows) => success(Array.isArray(rows) ? rows : []), (err) => error(err));
    }
    create(fileId, value, success, error) {
        const body = {
            fileid: fileId,
            ratingisbad: value === "BAD",
            ratingismedium: value === "MEDIUM",
            ratingisgood: value === "GOOD",
        };
        httpService.sendRequest(HttpMethod.METHOD_POST, this.URL, null, body, HttpContentType.CONTENT_TYPE_JSON, "json", false, accessTokenUtil.getAccessToken(), () => success(), (err) => error(err));
    }
    update(ratingId, value, success, error) {
        const body = {
            ratingisbad: value === "BAD",
            ratingismedium: value === "MEDIUM",
            ratingisgood: value === "GOOD",
        };
        httpService.sendRequest(HttpMethod.METHOD_PUT, `${this.URL}/${ratingId}`, null, body, HttpContentType.CONTENT_TYPE_JSON, "json", false, accessTokenUtil.getAccessToken(), () => success(), (err) => error(err));
    }
    remove(ratingId, success, error) {
        httpService.sendRequest(HttpMethod.METHOD_DELETE, `${this.URL}/${ratingId}`, null, null, null, null, false, accessTokenUtil.getAccessToken(), () => success(), (err) => error(err));
    }
}
export const ratingHttpService = new RatingHttpService();
//# sourceMappingURL=RatingHttp.Service.js.map