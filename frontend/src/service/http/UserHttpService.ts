import { ServiceError } from "../error/ServiceError.js";
import { User } from "../../vo/User.js";
import { httpService } from "../../http/HttpService.js";
import { HttpMethod } from "../../http/HttpMethod.js";
import { HttpContentType } from "../../http/HttpContentType.js";
import { LoginError } from "../error/LoginError.js";
import { ObjectNotFoundError } from "../error/ObjectNotFoundError.js";
import { UserEntity } from "../../http/entity/UserEntity.js";
import { accessTokenUtil } from "./AccessTokenUtil.js";

class UserHttpService
{
    private URL_USER_API_BASE = "http://localhost:3000/api";
    private URL_USERS_API_BASE = this.URL_USER_API_BASE + "/users";
    private URL_USER_API_LOGIN = this.URL_USER_API_BASE + "/auth/login";
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

    getCurrentUser(successCallback:(user:User|null) => void, errorCallback:(error:ServiceError) => void):void
    {
        httpService.sendRequest(HttpMethod.METHOD_GET, this.URL_USER_API_GET_CURRENT_USER, null,
                                null, null, "json", false, accessTokenUtil.getAccessToken(),
                                (response:any) =>
                                {
                                    let userEntity:UserEntity = response.user;
                                    successCallback(new User(userEntity.id, userEntity.isadmin, userEntity.email, userEntity.name, userEntity.isblocked, userEntity.profilepicturename, []));
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
        httpService.sendRequest(HttpMethod.METHOD_PUT, this.URL_USER_API_UPDATE_OWN_USER, null,
                                new UserEntity(updatedUser.getId(), updatedUser.getIsAdmin(), updatedUser.getEmail(),
                                updatedUser.getName(), updatedUser.getIsBlocked(), updatedUser.getProfilePictureName()),
                                HttpContentType.CONTENT_TYPE_JSON, null, false, accessTokenUtil.getAccessToken(),
                                () => { successCallback(); },
                                (error:any) => { errorCallback(new ServiceError("Error! Something went wrong!")); });
    }
}

export let userHttpService = new UserHttpService();

/*
class UserHttpService
{
    login(userName, password, successCallback, errorCallback)
    {        
        httpService.sendRequest(httpService.METHOD_POST, URL_USER_API_LOGIN,
                                null, { userName: userName, password: password },
                                httpService.CONTENT_TYPE_JSON, null, true,
                                (response) => { successCallback(JSON.parse(response).redirectTo); },
                                (error) => { errorCallback(); });
    }

    logout(successCallback, errorCallback)
    {
        httpService.sendRequest(httpService.METHOD_POST, URL_USER_API_LOGOUT,
                                null, null, null, null, true,
                                (response) => { successCallback(); },
                                (error) => { errorCallback(); });
    }

    register(userName, password, successCallback, errorCallback)
    {
        httpService.sendRequest(httpService.METHOD_POST, URL_USER_API_REGISTER,
                                null, { userName: userName, password: password },
                                httpService.CONTENT_TYPE_JSON, null, false,
                                (response) => { successCallback(JSON.parse(response).redirectTo); },
                                (error) => { errorCallback(); })
    }

    getCurrentUser(successCallback, errorCallback)
    {
        httpService.sendRequest(httpService.METHOD_GET, URL_USER_API_GET_CURRENT_USER,
                                null, null, null, "json", true,
                                (response) => { successCallback(response); },
                                (error) => { errorCallback(); });
    }

    getUser(userName, successCallback, errorCallback)
    {
        httpService.sendRequest(httpService.METHOD_GET, URL_USER_API_GET_USER + "/" + userName,
                                null, null, null, "json", false,
                                (response) => { successCallback(response); },
                                (error) => { errorCallback(); });
    }

    async getUserPromise(userName)
    {
        return new Promise((resolve, reject) =>
        {
            this.getUser(userName, (user) => { resolve(user); }, (error) => { reject(false); } );
        });
    }

    changeUserPassword(userName, newPassword, successCallback, errorCallback)
    {
        httpService.sendRequest(httpService.METHOD_PATCH, URL_USER_API_CHANGE_PASSWORD + "/" + userName,
                                null, { password: newPassword }, httpService.CONTENT_TYPE_JSON, null, true,
                                (response) => { successCallback(); },
                                (error) => { errorCallback(); });
    }

    deleteUser(userName, successCallback, errorCallback)
    {
        httpService.sendRequest(httpService.METHOD_DELETE, URL_USER_API_DELETE + "/" + userName,
                                null, null, null, null, true,
                                (response) => { successCallback(); },
                                (error) => { errorCallback(); });
    }

    addToWatchlist(userName, imdbId, successCallback, errorCallback, createEvent, description, affectedUsers)
    {
        httpService.sendRequest(httpService.METHOD_POST, URL_USER_API_ADD_TO_WATCHLIST_PREFIX + "/" + userName + URL_USER_API_ADD_TO_WATCHLIST_POSTFIX,
                                null, { imdbId: imdbId }, httpService.CONTENT_TYPE_JSON, "json", true,
                                (response) =>
                                {
                                    if(createEvent)
                                    {
                                        this.createBaseEvent(userName, EVENT_TYPES.WATCHLIST_ADD, description, imdbId, affectedUsers);
                                    }
                                    
                                    successCallback();
                                },
                                (status) => { errorCallback(); });
    }

    removeFromWatchList(userName, imdbId, successCallback, errorCallback, createEvent, description, affectedUsers)
    {
        httpService.sendRequest(httpService.METHOD_DELETE, URL_USER_API_REMOVE_FROM_WATCHLIST_PREFIX + "/" + userName + URL_USER_API_REMOVE_FROM_WATCHLIST_POSTFIX,
                                null, { imdbId: imdbId }, httpService.CONTENT_TYPE_JSON, "json", true,
                                (response) =>
                                {
                                    if(createEvent)
                                    {
                                        this.createBaseEvent(userName, EVENT_TYPES.WATCHLIST_REMOVE, description, imdbId, affectedUsers);
                                    }

                                    successCallback();
                                },
                                (status) => { errorCallback(); });
    }

    befriendUser(userName, friendUserName, successCallback, errorCallback)
    {
        httpService.sendRequest(httpService.METHOD_POST, URL_USER_API_ADD_FRIEND_PREFIX + "/" + userName + URL_USER_API_ADD_FRIEND_POSTFIX,
                                null, { friendName: friendUserName }, httpService.CONTENT_TYPE_JSON, null, true,
                                (response) => { successCallback(); },
                                (status) => { errorCallback(); });
    }

    unfriendUser(userName, friendUserName, successCallback, errorCallback)
    {
        httpService.sendRequest(httpService.METHOD_DELETE, URL_USER_API_REMOVE_FRIEND_PREFIX + "/" + userName + URL_USER_API_REMOVE_FRIEND_POSTFIX,
                                null, { friendName: friendUserName }, httpService.CONTENT_TYPE_JSON, null, true,
                                (response) => { successCallback(); },
                                (status) => { errorCallback(); });
    }

    createReview(userName, imdbId, reviewText, like, dislike, date, successCallback, errorCallback, createEvent, description, affectedUsers)
    {
        httpService.sendRequest(httpService.METHOD_POST, URL_USER_API_ADD_MOVIE_REVIEW_PREFIX + "/" + userName + URL_USER_API_ADD_MOVIE_REVIEW_POSTFIX,
                                null, { imdbId: imdbId, reviewText: reviewText, like: like, dislike: dislike, date: date.toISOString() },
                                httpService.CONTENT_TYPE_JSON, null, true,
                                (response) =>
                                {
                                    if(createEvent)
                                    {
                                        this.createBaseEvent(userName, EVENT_TYPES.REVIEW, description, imdbId, affectedUsers);
                                    }

                                    successCallback();
                                },
                                (status) => { errorCallback(); });
    }

    updateReview(userName, imdbId, reviewText, like, dislike, date, successCallback, errorCallback, createEvent, description, affectedUsers)
    {
        httpService.sendRequest(httpService.METHOD_PUT, URL_USER_API_UPDATE_MOVIE_REVIEW_PREFIX + "/" + userName + URL_USER_API_UPDATE_MOVIE_REVIEW_POSTFIX,
                                null, { imdbId: imdbId, reviewText: reviewText, like: like, dislike: dislike, date: date.toISOString() },
                                httpService.CONTENT_TYPE_JSON, null, true,
                                (response) =>
                                {
                                    if(createEvent)
                                    {
                                        this.createBaseEvent(userName, EVENT_TYPES.REVIEW, description, imdbId, affectedUsers);
                                    }

                                    successCallback();
                                },
                                (status) => { errorCallback(); });
    }

    deleteReview(userName, imdbId, successCallback, errorCallback)
    {
        httpService.sendRequest(httpService.METHOD_DELETE, URL_USER_API_DELETE_MOVIE_REVIEW_PREFIX + "/" + userName + URL_USER_API_DELETE_MOVIE_REVIEW_POSTFIX,
                                null, { imdbId: imdbId }, httpService.CONTENT_TYPE_JSON, null, true,
                                (response) => { successCallback(); },
                                (status) => { errorCallback(); });
    }

    createEvent(userName, type, description, date, imdbId, affectedUsers, successCallback, errorCallback)
    {
        httpService.sendRequest(httpService.METHOD_POST, URL_USER_API_ADD_EVENT_PREFIX + "/" + userName + URL_USER_API_ADD_EVENT_POSTFIX,
                                null, { type: type, description: description, date: date, imdbId: imdbId, affectedUsers: affectedUsers },
                                httpService.CONTENT_TYPE_JSON, null, true,
                                (response) => { successCallback(); },
                                (status) => { errorCallback(); });
    }

    createBaseEvent(userName, eventType, description, imdbId, affectedUsers)
    {
        this.createEvent(userName, eventType, description, (new Date()).toISOString(), imdbId, affectedUsers,
                         () => { },
                         () => { console.log("Error: Event could not be created!"); })
    }

    async getAllUsers(users)
    {
        let result = [];

        let userObject;

        for(let user of users)
        {
            userObject = await this.getUserPromise(user);

            if(userObject)
            {
                result.push(userObject);
            }
        }

        return result;
    }
}

export let userHttpService = new UserHttpService();
*/
