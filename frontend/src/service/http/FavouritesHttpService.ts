import { File } from "../../vo/File.js";
import { ServiceError } from "../error/ServiceError.js";

class FavouritesHttpService {
  getFavourites(userId: number, success: (files: File[]) => void, error: (e: any) => void): void {
    error(new ServiceError("Favourites API not implemented yet"));
  }

  addFavourite(userId: number, file: File, success: () => void, error: (e: any) => void): void {
    error(new ServiceError("Favourites API not implemented yet"));
  }

  removeFavourite(userId: number, fileId: number, success: () => void, error: (e: any) => void): void {
    error(new ServiceError("Favourites API not implemented yet"));
  }
}

export const favouritesHttpService = new FavouritesHttpService();

