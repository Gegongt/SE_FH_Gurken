import { userMemService } from "../UserMemService.js";
import { ServiceName } from "./ServiceName.js";
import { ServiceType } from "./ServiceType.js";
import { categoryMemService } from "../CategoryMemService.js";
import { subcategoryMemService } from "../SubcategoryMemService.js";
import { questionMemService } from "../QuestionMemService.js";
import { examMemService } from "../ExamMemService.js";
import { fileMemService } from "../FileMemService.js";
import { ratingMemService } from "../RatingMemService.js";
import { FavouritesMemService, favouritesMemService } from "../FavouritesMemService.js";
import { userHttpService } from "../http/UserHttpService.js";
import { categoryHttpService } from "../http/CategoryHttpService.js";
import { subcategoryHttpService } from "../http/SubcategoryHttpService.js";
import { examHttpService } from "../http/ExamHttpService.js";
import { questionHttpService } from "../http/QuestionHttpService.js";
import { fileHttpService } from "../http/FileHttpService.js";
import { favouritesHttpService } from "../http/FavouritesHttpService.js";
import { ratingHttpService } from "../http/RatingHttp.Service.js";
import { ChatMessageHttpService } from "../http/ChatMessageHttpService.js";

class ServiceFactory
{
    private serviceType:ServiceType;

    constructor(serviceType:ServiceType)
    {
        this.serviceType = serviceType;
    }

    public getService(serviceName:ServiceName):any
    {
        switch(this.serviceType)
        {
            case ServiceType.MEM: return this.getMemService(serviceName);
            case ServiceType.HTTP: return this.getHttpService(serviceName);
        }
    }

    public getMemService(serviceName:ServiceName):any
    {
        switch(serviceName)
        {
            case ServiceName.USER: return userMemService;
            case ServiceName.CATEGORY: return categoryMemService;
            case ServiceName.SUBCATEGORY: return subcategoryMemService;
            case ServiceName.FILE: return fileMemService;
            case ServiceName.RATING: return ratingMemService;
            case ServiceName.QUESTION: return questionMemService;
            case ServiceName.EXAM: return examMemService;
            case ServiceName.FAVOURITES: return favouritesMemService;
        }
    }

    public getHttpService(serviceName:ServiceName):any
    {
        switch(serviceName)
        {
            case ServiceName.USER: return userHttpService;
            case ServiceName.CATEGORY: return categoryHttpService;
            case ServiceName.SUBCATEGORY: return subcategoryHttpService;
            case ServiceName.FILE: return fileHttpService;
            case ServiceName.RATING: return ratingHttpService;
            case ServiceName.QUESTION: return questionHttpService;
            case ServiceName.EXAM: return examHttpService;
            case ServiceName.FAVOURITES: return favouritesHttpService;
            case ServiceName.CHAT_MESSAGE: return new ChatMessageHttpService(); //this service is not a Singleton, it is unique for every chat participant
        }
    }
}

export let serviceFactory = new ServiceFactory(ServiceType.HTTP);
