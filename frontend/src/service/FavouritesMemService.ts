import { File } from "../vo/File.js";
import { User } from "../vo/User.js";
import { ServiceError } from "./error/ServiceError.js";
import { serviceFactory } from "./factory/ServiceFactory.js";
import { ServiceName } from "./factory/ServiceName.js";

export class FavouritesMemService {

  getFavourites(
    userId: number,
    success: (files: File[]) => void,
    error: (e: ServiceError) => void
  ): void {
    serviceFactory.getService(ServiceName.USER).getUserById(
      userId,
      (u: User) => success(u.getFavourites()),
      (e: ServiceError) => error(e)
    );
  }

  addFavourite(
    userId: number,
    file: File,
    success: () => void,
    error: (e: ServiceError) => void
  ): void {
    serviceFactory.getService(ServiceName.USER).getUserById(
      userId,
      (u: User) => {
        u.addFavourite(file);
        success();
      },
      (e: ServiceError) => error(e)
    );
  }

  removeFavourite(
    userId: number,
    fileId: number,
    success: () => void,
    error: (e: ServiceError) => void
  ): void {
    serviceFactory.getService(ServiceName.USER).getUserById(
      userId,
      (u: User) => {
        u.removeFavourite(fileId);
        success();
      },
      (e: ServiceError) => error(e)
    );
  }

  isFavourite(
    userId: number,
    fileId: number,
    success: (isFav: boolean) => void,
    error: (e: ServiceError) => void
  ): void {
    serviceFactory.getService(ServiceName.USER).getUserById(
      userId,
      (u: User) => success(u.isFavourite(fileId)),
      (e: ServiceError) => error(e)
    );
  }
}

export const favouritesMemService = new FavouritesMemService();
