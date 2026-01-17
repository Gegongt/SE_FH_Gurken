import { SubcategoryEntity } from "../../http/entity/SubcategoryEntity.js";
import { converter } from "../../http/entity/util/Converter.js";
import { HttpMethod } from "../../http/HttpMethod.js";
import { httpService } from "../../http/HttpService.js";
import { Subcategory } from "../../vo/Subcategory.js";
import { ServiceError } from "../error/ServiceError.js";
import { accessTokenUtil } from "./AccessTokenUtil.js";

class SubcategoryHttpService
{
    private URL_SUBCATEGORY_API_BASE = "http://localhost:3000/api/subcategories";
    private URL_SUBCATEGORY_API_GET_SUBCATEGORIES = this.URL_SUBCATEGORY_API_BASE;

    getSubcategories(categoryId:number|string|null, successCallback:(subcategories:Subcategory[]) => void, errorCallback:(status: any) => void):void
    {
        let params:any = null;

        if(categoryId)
        {
            params = { categoryId };
        }

        httpService.sendRequest(HttpMethod.METHOD_GET, this.URL_SUBCATEGORY_API_GET_SUBCATEGORIES, params, null,
                                null, "json", false, accessTokenUtil.getAccessToken(),
                                (response:SubcategoryEntity[]) =>
                                {
                                    let subcategories:Subcategory[] = [];

                                    for(let subcategorieEntity of response)
                                    {
                                        subcategories.push(converter.convertSubcategoryEntityToSubcategory(subcategorieEntity));
                                    }

                                    successCallback(subcategories);
                                },

                                (error:ServiceError) =>
                                {
                                    errorCallback(error);
                                }
        )
    }
}

export let subcategoryHttpService = new SubcategoryHttpService();
