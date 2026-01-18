import { HttpMethod } from "../../http/HttpMethod.js";
import { httpService } from "../../http/HttpService.js";
import { HttpContentType } from "../../http/HttpContentType.js";
import { accessTokenUtil } from "./AccessTokenUtil.js";
class FavouritesHttpService {
    constructor() {
        this.URL = "http://localhost:3000/api/favourites";
    }
    getFavourites(userId, success, error) {
        httpService.sendRequest(HttpMethod.METHOD_GET, this.URL, { userId }, null, null, "json", false, accessTokenUtil.getAccessToken(), (resp) => success(resp), (err) => error(err));
    }
    addFavourite(userId, fileId, success, error) {
        httpService.sendRequest(HttpMethod.METHOD_POST, this.URL, null, { userid: userId, fileid: fileId }, // !!! lowercase
        HttpContentType.CONTENT_TYPE_JSON, "json", false, accessTokenUtil.getAccessToken(), (_resp) => success(), (err) => error(err));
    }
    removeFavourite(userId, fileId, success, error) {
        httpService.sendRequest(HttpMethod.METHOD_DELETE, this.URL, null, { userid: userId, fileid: fileId }, // !!! lowercase
        HttpContentType.CONTENT_TYPE_JSON, "json", false, accessTokenUtil.getAccessToken(), (_resp) => success(), (err) => error(err));
    }
}
export const favouritesHttpService = new FavouritesHttpService();
//# sourceMappingURL=FavouritesHttpService.js.map