import { ServiceError } from "../error/ServiceError.js";
import { User } from "../../vo/User.js";
import { httpService } from "../../http/HttpService.js";
import { HttpMethod } from "../../http/HttpMethod.js";
import { HttpContentType } from "../../http/HttpContentType.js";
import { LoginError } from "../error/LoginError.js";
import { ObjectNotFoundError } from "../error/ObjectNotFoundError.js";
import { UserEntity } from "../../http/entity/UserEntity.js";
import { accessTokenUtil } from "./AccessTokenUtil.js";
import { converter } from "../../http/entity/util/Converter.js";
import { errorUtil } from "./ErrorUtil.js";

class UserHttpService
{
    private URL_USER_API_BASE = "http://localhost:3000/api";
    private URL_USERS_API_BASE = this.URL_USER_API_BASE + "/users";
    private URL_USER_API_LOGIN = this.URL_USER_API_BASE + "/auth/login";
    private URL_USER_API_REGISTER = this.URL_USER_API_BASE + "/auth/register";
    private URL_USER_API_GET_CURRENT_USER = this.URL_USERS_API_BASE + "/whoami";
    private URL_USER_API_UPDATE_OWN_USER = this.URL_USERS_API_BASE;

    login(email:string, password:string, successCallback:(user:User) => void, errorCallback:(error:ServiceError) => void):void
    {
        httpService.sendRequest(HttpMethod.METHOD_POST, this.URL_USER_API_LOGIN, null,
                                { email, password }, HttpContentType.CONTENT_TYPE_JSON,
                                "json", false, null,

                                (userCredentials:any) =>
                                {
                                    accessTokenUtil.setAccessToken(userCredentials.accessToken);

                                    this.getCurrentUser((user:User|null) =>
                                                        {
                                                            if(user === null)
                                                            {
                                                                errorCallback(new ObjectNotFoundError("User not found!"));
                                                            }

                                                            else
                                                            {
                                                                successCallback(user)
                                                            }
                                                        },

                                                        (error:ServiceError) => errorCallback(error));
                                },

                                (error:number) =>
                                {
                                    errorCallback(errorUtil.getServiceError(error));
                                });
    }

    logout(successCallback:() => void, errorCallback:(error:ServiceError) => void):void
    {
        accessTokenUtil.deleteAccessToken();

        successCallback();
    }

    create(email:string, userName:string, password:string, successCallback:() => void,
            errorCallback:(error:ServiceError) => void):void
    {
        let body:any = new UserEntity(-1, false, email, userName, false, null);
        body.password = password;

        httpService.sendRequest(HttpMethod.METHOD_POST, this.URL_USER_API_REGISTER, null,
                                body, HttpContentType.CONTENT_TYPE_JSON, "json", false, null,
                                (userCredentials:any) =>
                                {
                                    successCallback();
                                },

                                (error:number) =>
                                {
                                    errorCallback(errorUtil.getServiceError(error));
                                }
        )
    }

    getCurrentUser(successCallback:(user:User|null) => void, errorCallback:(error:ServiceError) => void):void
    {
        httpService.sendRequest(HttpMethod.METHOD_GET, this.URL_USER_API_GET_CURRENT_USER, null,
                                null, null, "json", false, accessTokenUtil.getAccessToken(),
                                (response:any) =>
                                {
                                    let userEntity:UserEntity = response.user;
                                    successCallback(converter.convertUserEntityToUser(userEntity));
                                },

                                (error:number) =>
                                {
                                    if(error === 401)
                                    {
                                        successCallback(null); //the user is not logged in
                                    }

                                    errorCallback(errorUtil.getServiceError(error));
                                });
    }

    updateOwnUser(updatedUser:User, successCallback:() => void, errorCallback:(error:ServiceError) => void):void
    {
        httpService.sendRequest(HttpMethod.METHOD_PUT, this.URL_USER_API_UPDATE_OWN_USER, null, converter.convertUserToUserEntity(updatedUser),
                                HttpContentType.CONTENT_TYPE_JSON, null, false, accessTokenUtil.getAccessToken(),
                                () => { successCallback(); },
                                (error:number) => { errorCallback(errorUtil.getServiceError(error)); });
    }

  getBlockedUsers(
    isBlocked: boolean,
    successCallback: (users: User[]) => void,
    errorCallback: (error: ServiceError) => void
    ): void {
    const params = { isBlocked: String(isBlocked) }; // Swagger: isBlocked query param

    httpService.sendRequest(
        HttpMethod.METHOD_GET,
        this.URL_USERS_API_BASE,   
        params,
        null,
        null,
        "json",
        false,
        accessTokenUtil.getAccessToken(),
        (response: any) => {
        const arr: any[] = Array.isArray(response) ? response : (response.users ?? []);
        const users = arr.map((ue) => converter.convertUserEntityToUser(ue));
        successCallback(users);
        },
        (error: any) => errorCallback(new ServiceError("Error: could not load blocked users"))
    );
    }

    setBlocked(
        userId: string,
        blocked: boolean,
        name: string,
        profilePictureName: string | null,
        successCallback: () => void,
        errorCallback: (error: ServiceError) => void
        ): void {

        const body = {
            name: name,                      
            profilepicturename: profilePictureName, 
            isblocked: blocked,
        };

        httpService.sendRequest(
            HttpMethod.METHOD_PUT,
            `${this.URL_USERS_API_BASE}/${userId}`,
            null,
            body,
            HttpContentType.CONTENT_TYPE_JSON,
            "json",
            false,
            accessTokenUtil.getAccessToken(),
            () => successCallback(),
            (error: any) => errorCallback(errorUtil.getServiceError?.(error) ?? new ServiceError(String(error)))
        );
    }


    deleteOwnUser(successCallback: () => void, errorCallback: (error: ServiceError) => void): void {
        httpService.sendRequest(
            HttpMethod.METHOD_DELETE,
            this.URL_USERS_API_BASE,   
            null,
            null,
            null,
            null,
            false,
            accessTokenUtil.getAccessToken(),
            () => {
            accessTokenUtil.deleteAccessToken();
            successCallback();
            },
            (error: any) => {
            errorCallback(new ServiceError("Error! Delete user failed!"));
            }
        );
    }

    getProfilePicture(
        success: (blobUrl: string | null) => void,
        error: (e: any) => void
        ): void {
        fetch(this.URL_USERS_API_BASE + "/profilepicture", {
            method: "GET",
            headers: {
            Authorization: `Bearer ${accessTokenUtil.getAccessToken()}`
            }
        })
            .then(async (r) => {
            if (r.status === 404) {
                success(null);
                return;
            }
            if (!r.ok) throw await r.text();

            const blob = await r.blob();
            const url = URL.createObjectURL(blob);
            success(url);
            })
            .catch((e) => error(e));
    }

    updateProfilePicture(
        file: globalThis.File,
        successCallback: () => void,
        errorCallback: (error: ServiceError) => void
        ): void {
        const fd = new FormData();
        fd.append("file", file); // <- MUSS "file" heißen (Swagger + Controller)

        fetch(this.URL_USERS_API_BASE + "/profilepicture", {
            method: "PUT",
            headers: {
            Authorization: `Bearer ${accessTokenUtil.getAccessToken()}`
            // KEIN Content-Type setzen bei FormData!
            },
            body: fd
        })
            .then(async (r) => {
            if (!r.ok) throw await r.text();
            // response ist updated user JSON, aber brauchen wir nicht zwingend
            successCallback();
            })
            .catch((_e) => errorCallback(new ServiceError("Error! Upload profile picture failed!")));
    }



}

export let userHttpService = new UserHttpService();
