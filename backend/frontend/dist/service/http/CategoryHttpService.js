import { converter } from "../../http/entity/util/Converter.js";
import { HttpMethod } from "../../http/HttpMethod.js";
import { httpService } from "../../http/HttpService.js";
import { accessTokenUtil } from "./AccessTokenUtil.js";
class CategoryHttpService {
    constructor() {
        this.URL_CATEGORY_API_BASE = "http://localhost:3000/api/categories";
        this.URL_CATEGORY_API_GET_CATEGORIES = this.URL_CATEGORY_API_BASE;
    }
    //TODO: remove shallow parameter
    getCategories(shallow, success, errorCallback) {
        httpService.sendRequest(HttpMethod.METHOD_GET, this.URL_CATEGORY_API_GET_CATEGORIES, null, null, null, "json", false, accessTokenUtil.getAccessToken(), (response) => {
            let categories = [];
            for (let categorieEntity of response) {
                categories.push(converter.convertCategoryEntityToCategory(categorieEntity));
            }
            if (shallow) {
                success(categories);
            }
            else {
            }
        }, (error) => {
            errorCallback(error);
        });
    }
}
export let categoryHttpService = new CategoryHttpService();
//# sourceMappingURL=CategoryHttpService.js.map