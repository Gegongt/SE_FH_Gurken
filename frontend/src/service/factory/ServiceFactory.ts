import { userMemService } from "../UserMemService.js";
import { ServiceName } from "./ServiceName.js";
import { ServiceType } from "./ServiceType.js";
import { categoryMemService } from "../CategoryMemService.js";
import { subcategoryMemService } from "../SubcategoryMemService.js";
import { questionMemService } from "../QuestionMemService.js";
import { examMemService } from "../ExamMemService.js";
import { fileMemService } from "../FileMemService.js";
import { ratingMemService } from "../RatingMemService.js";


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
            case ServiceType.HTTP: return null;
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
        }
    }
}

export let serviceFactory = new ServiceFactory(ServiceType.MEM);
