import { userMemService } from "../UserMemService.js";
import { ServiceName } from "./ServiceName.js";
import { ServiceType } from "./ServiceType.js";

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
        }
    }
}

export let serviceFactory = new ServiceFactory(ServiceType.MEM);
