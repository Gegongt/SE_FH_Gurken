import { User } from "../vo/User.js";
import { ServiceError } from "./error/ServiceError.js";
declare class UserMemService {
    private users;
    private nextUserId;
    private userPasswords;
    constructor();
    private getUserSync;
    private getUserByIdSync;
    getUser(emailOrUserName: string, successCallback: (user: User) => void, errorCallback: (error: ServiceError) => void): void;
    getUserById(id: number, successCallback: (user: User) => void, errorCallback: (error: ServiceError) => void): void;
    login(emailOrUserName: string, password: string, successCallback: (user: User) => void, errorCallback: (error: ServiceError) => void): void;
    logout(successCallback: () => void, errorCallback: (error: ServiceError) => void): void;
    getCurrentUser(successCallback: (user: User | null) => void, errorCallback: (error: ServiceError) => void): void;
    create(email: string, userName: string, password: string, successCallback: (user: User) => void, errorCallback: (error: ServiceError) => void): void;
    updateProfilePicture(file: globalThis.File, success: (updatedUser: User) => void, error: (status: any) => void): void;
    getBlockedUsers(success: (users: User[]) => void, error: (status: any) => void): void;
    setBlocked(userId: number, blocked: boolean, success: (u: User) => void, error: (status: any) => void): void;
}
export declare let userMemService: UserMemService;
export {};
//# sourceMappingURL=UserMemService.d.ts.map