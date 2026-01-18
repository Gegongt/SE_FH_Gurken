import { File } from "./File.js";
export declare class User {
    private id;
    private isAdmin;
    private email;
    private name;
    private isBlocked;
    private profilePictureName;
    private favourites;
    constructor(id: number | string, isAdmin: boolean, email: string, name: string, isBlocked: boolean, profilePictureName: string | null, favourites?: File[]);
    getId(): number | string;
    getIsAdmin(): boolean;
    getEmail(): string;
    setEmail(email: string): void;
    getName(): string;
    setName(name: string): void;
    getIsBlocked(): boolean;
    setIsBlocked(isBlocked: boolean): void;
    getFavourites(): File[];
    isFavourite(fileId: number): boolean;
    addFavourite(file: File): void;
    removeFavourite(fileId: number): void;
    setFavourites(files: File[]): void;
    getProfilePictureName(): string | null;
    setProfilePictureName(profilePictureName: string | null): void;
}
//# sourceMappingURL=User.d.ts.map