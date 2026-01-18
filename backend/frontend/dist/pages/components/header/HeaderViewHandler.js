import { serviceFactory } from "../../../service/factory/ServiceFactory.js";
import { ServiceName } from "../../../service/factory/ServiceName.js";
import { locationUtil } from "../../../util/LocationUtil.js";
export class HeaderViewHandler {
    constructor(headerView) {
        this.headerView = headerView;
    }
    render(parentElementId) {
        this.headerView.render(parentElementId);
        this.headerView.bindLogoLink(locationUtil.getMainPageAddress());
        this.headerView.bindHomeLink(locationUtil.getMainPageAddress());
        this.headerView.bindProfileLink(locationUtil.getUserPageAddress());
        this.headerView.bindLogoutLink(() => {
            serviceFactory.getService(ServiceName.USER).logout(() => locationUtil.redirectToLoginPage(), (error) => console.log("Error! Logout failed!"));
        });
    }
}
//# sourceMappingURL=HeaderViewHandler.js.map