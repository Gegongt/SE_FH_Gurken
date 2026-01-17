import { CategoryEntity } from "../../http/entity/CategoryEntity.js";
import { converter } from "../../http/entity/util/Converter.js";
import { HttpMethod } from "../../http/HttpMethod.js";
import { httpService } from "../../http/HttpService.js";
import { Category } from "../../vo/Category.js";
import { ServiceError } from "../error/ServiceError.js";
import { accessTokenUtil } from "./AccessTokenUtil.js";

class CategoryHttpService
{
    private URL_CATEGORY_API_BASE = "http://localhost:3000/api/categories";
    private URL_CATEGORY_API_GET_CATEGORIES = this.URL_CATEGORY_API_BASE;

    //TODO: remove shallow parameter
    getCategories(shallow:boolean, success:(cats: Category[]) => void, errorCallback:(status: any) => void):void
    {
        httpService.sendRequest(HttpMethod.METHOD_GET, this.URL_CATEGORY_API_GET_CATEGORIES, null, null,
                                null, "json", false, accessTokenUtil.getAccessToken(),
                                (response:CategoryEntity[]) =>
                                {
                                    let categories:Category[] = [];

                                    for(let categorieEntity of response)
                                    {
                                        categories.push(converter.convertCategoryEntityToCategory(categorieEntity));
                                    }

                                    if(shallow)
                                    {
                                        success(categories);
                                    }

                                    else
                                    {

                                    }
                                },

                                (error:ServiceError) =>
                                {
                                    errorCallback(error);
                                }
        )
    }
}

export let categoryHttpService = new CategoryHttpService();
