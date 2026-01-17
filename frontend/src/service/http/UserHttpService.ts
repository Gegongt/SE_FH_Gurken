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

                                (error:any) =>
                                {
                                    errorCallback(new LoginError("Login failed!"));
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

                                (error:any) =>
                                {
                                    errorCallback(new ServiceError("Error! Creation failed!"));
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

                                (error:any) =>
                                {
                                    if(error === 401)
                                    {
                                        successCallback(null); //the user is not logged in
                                    }

                                    errorCallback(new ServiceError("Error: User could not be loaded!"));
                                });
    }

    updateOwnUser(updatedUser:User, successCallback:() => void, errorCallback:(error:ServiceError) => void):void
    {
        httpService.sendRequest(HttpMethod.METHOD_PUT, this.URL_USER_API_UPDATE_OWN_USER, null, converter.convertUserToUserEntity(updatedUser),
                                HttpContentType.CONTENT_TYPE_JSON, null, false, accessTokenUtil.getAccessToken(),
                                () => { successCallback(); },
                                (error:any) => { errorCallback(new ServiceError("Error! Something went wrong!")); });
    }
}

export let userHttpService = new UserHttpService();
