import { ServiceError } from "../../../service/error/ServiceError.js";
import { serviceFactory } from "../../../service/factory/ServiceFactory.js";
import { ServiceName } from "../../../service/factory/ServiceName.js";
import { locationUtil } from "../../../util/LocationUtil.js";
import { HeaderView } from "./HeaderView.js";

export class HeaderViewHandler
{
    private headerView:HeaderView;

    constructor(headerView:HeaderView)
    {
        this.headerView = headerView;
    }

    render(parentElementId:string):void
    {
        this.headerView.render(parentElementId);

        this.headerView.bindLogoLink(locationUtil.getMainPageAddress());
        this.headerView.bindHomeLink(locationUtil.getMainPageAddress());
        this.headerView.bindLogoutLink(() =>
                                       {
                                        serviceFactory.getService(ServiceName.USER).logout(() => locationUtil.redirectToLoginPage(),
                                                                                           (error:ServiceError) => console.log("Error! Logout failed!"));
                                       });
    }
}
