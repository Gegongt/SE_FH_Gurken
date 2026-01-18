import { serviceFactory } from "./factory/ServiceFactory.js";
import { ServiceName } from "./factory/ServiceName.js";
export class FavouritesMemService {
    getFavourites(userId, success, error) {
        serviceFactory.getService(ServiceName.USER).getUserById(userId, (u) => success(u.getFavourites()), (e) => error(e));
    }
    addFavourite(userId, file, success, error) {
        serviceFactory.getService(ServiceName.USER).getUserById(userId, (u) => {
            u.addFavourite(file);
            success();
        }, (e) => error(e));
    }
    removeFavourite(userId, fileId, success, error) {
        serviceFactory.getService(ServiceName.USER).getUserById(userId, (u) => {
            u.removeFavourite(fileId);
            success();
        }, (e) => error(e));
    }
    isFavourite(userId, fileId, success, error) {
        serviceFactory.getService(ServiceName.USER).getUserById(userId, (u) => success(u.isFavourite(fileId)), (e) => error(e));
    }
}
export const favouritesMemService = new FavouritesMemService();
//# sourceMappingURL=FavouritesMemService.js.map