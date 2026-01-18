import { File } from "../vo/File.js";
import { ServiceError } from "./error/ServiceError.js";
export declare class FavouritesMemService {
    getFavourites(userId: number, success: (files: File[]) => void, error: (e: ServiceError) => void): void;
    addFavourite(userId: number, file: File, success: () => void, error: (e: ServiceError) => void): void;
    removeFavourite(userId: number, fileId: number, success: () => void, error: (e: ServiceError) => void): void;
    isFavourite(userId: number, fileId: number, success: (isFav: boolean) => void, error: (e: ServiceError) => void): void;
}
export declare const favouritesMemService: FavouritesMemService;
//# sourceMappingURL=FavouritesMemService.d.ts.map