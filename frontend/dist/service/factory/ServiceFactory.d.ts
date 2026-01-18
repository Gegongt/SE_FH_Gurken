import { ServiceName } from "./ServiceName.js";
import { ServiceType } from "./ServiceType.js";
declare class ServiceFactory {
    private serviceType;
    constructor(serviceType: ServiceType);
    getService(serviceName: ServiceName): any;
    getMemService(serviceName: ServiceName): any;
    getHttpService(serviceName: ServiceName): any;
}
export declare let serviceFactory: ServiceFactory;
export {};
//# sourceMappingURL=ServiceFactory.d.ts.map