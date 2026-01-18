import { converter } from "../../http/entity/util/Converter.js";
import { HttpMethod } from "../../http/HttpMethod.js";
import { httpService } from "../../http/HttpService.js";
import { accessTokenUtil } from "./AccessTokenUtil.js";
class SubcategoryHttpService {
    constructor() {
        this.URL_SUBCATEGORY_API_BASE = "http://localhost:3000/api/subcategories";
        this.URL_SUBCATEGORY_API_GET_SUBCATEGORIES = this.URL_SUBCATEGORY_API_BASE;
    }
    getSubcategories(categoryId, successCallback, errorCallback) {
        let params = null;
        if (categoryId) {
            params = { categoryId };
        }
        httpService.sendRequest(HttpMethod.METHOD_GET, this.URL_SUBCATEGORY_API_GET_SUBCATEGORIES, params, null, null, "json", false, accessTokenUtil.getAccessToken(), (response) => {
            let subcategories = [];
            for (let subcategorieEntity of response) {
                subcategories.push(converter.convertSubcategoryEntityToSubcategory(subcategorieEntity));
            }
            successCallback(subcategories);
        }, (error) => {
            errorCallback(error);
        });
    }
}
export let subcategoryHttpService = new SubcategoryHttpService();
//# sourceMappingURL=SubcategoryHttpService.js.map