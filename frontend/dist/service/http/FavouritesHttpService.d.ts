export type FavouriteDTO = {
    userId?: string;
    userid?: string;
    fileId?: number;
    fileid?: number;
};
declare class FavouritesHttpService {
    private URL;
    getFavourites(userId: string, success: (favs: FavouriteDTO[]) => void, error: (e: any) => void): void;
    addFavourite(userId: string, fileId: number, success: () => void, error: (e: any) => void): void;
    removeFavourite(userId: string, fileId: number, success: () => void, error: (e: any) => void): void;
}
export declare const favouritesHttpService: FavouritesHttpService;
export {};
//# sourceMappingURL=FavouritesHttpService.d.ts.map