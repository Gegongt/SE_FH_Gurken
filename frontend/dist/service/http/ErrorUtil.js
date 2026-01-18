import { BlockedUserError } from "../error/BlockedUserError.js";
import { NotAuthorizedError } from "../error/NotAuthorizedError.js";
import { ObjectNotFoundError } from "../error/ObjectNotFoundError.js";
import { ServiceError } from "../error/ServiceError.js";
class ErrorUtil {
    getServiceError(errorCode) {
        switch (errorCode) {
            case 400: return new ServiceError("Error! Something went wrong!");
            case 401: return new NotAuthorizedError("Error! Not authorized!");
            case 403: return new BlockedUserError("Error! User is blocked!");
            case 404: return new ObjectNotFoundError("Error! Object not found!");
            default: return new ServiceError("Error! Something went wrong!");
        }
    }
}
export let errorUtil = new ErrorUtil();
//# sourceMappingURL=ErrorUtil.js.map