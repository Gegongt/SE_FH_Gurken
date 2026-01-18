import { ServiceError } from "../error/ServiceError.js";
import { User } from "../../vo/User.js";
declare class UserHttpService {
    private URL_USER_API_BASE;
    private URL_USERS_API_BASE;
    private URL_USER_API_LOGIN;
    private URL_USER_API_REGISTER;
    private URL_USER_API_GET_CURRENT_USER;
    private URL_USER_API_UPDATE_OWN_USER;
    login(email: string, password: string, successCallback: (user: User) => void, errorCallback: (error: ServiceError) => void): void;
    logout(successCallback: () => void, errorCallback: (error: ServiceError) => void): void;
    create(email: string, userName: string, password: string, successCallback: () => void, errorCallback: (error: ServiceError) => void): void;
    getCurrentUser(successCallback: (user: User | null) => void, errorCallback: (error: ServiceError) => void): void;
    updateOwnUser(updatedUser: User, successCallback: () => void, errorCallback: (error: ServiceError) => void): void;
    getBlockedUsers(isBlocked: boolean, successCallback: (users: User[]) => void, errorCallback: (error: ServiceError) => void): void;
    setBlocked(userId: string, blocked: boolean, name: string, profilePictureName: string | null, successCallback: () => void, errorCallback: (error: ServiceError) => void): void;
    deleteOwnUser(successCallback: () => void, errorCallback: (error: ServiceError) => void): void;
    getProfilePicture(success: (blobUrl: string | null) => void, error: (e: any) => void): void;
    updateProfilePicture(file: globalThis.File, successCallback: () => void, errorCallback: (error: ServiceError) => void): void;
}
export declare let userHttpService: UserHttpService;
export {};
//# sourceMappingURL=UserHttpService.d.ts.map