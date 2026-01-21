import { ServiceError } from "../error/ServiceError.js";
import { httpService } from "../../http/HttpService.js";
import { HttpMethod } from "../../http/HttpMethod.js";
import { HttpContentType } from "../../http/HttpContentType.js";
import { ObjectNotFoundError } from "../error/ObjectNotFoundError.js";
import { UserEntity } from "../../http/entity/UserEntity.js";
import { accessTokenUtil } from "./AccessTokenUtil.js";
import { converter } from "../../http/entity/util/Converter.js";
import { errorUtil } from "./ErrorUtil.js";
class UserHttpService {
    constructor() {
        this.URL_USER_API_BASE = "http://localhost:3000/api";
        this.URL_USERS_API_BASE = this.URL_USER_API_BASE + "/users";
        this.URL_USER_API_LOGIN = this.URL_USER_API_BASE + "/auth/login";
        this.URL_USER_API_REGISTER = this.URL_USER_API_BASE + "/auth/register";
        this.URL_USER_API_GET_CURRENT_USER = this.URL_USERS_API_BASE + "/whoami";
        this.URL_USER_API_UPDATE_OWN_USER = this.URL_USERS_API_BASE;
    }
    login(email, password, successCallback, errorCallback) {
        httpService.sendRequest(HttpMethod.METHOD_POST, this.URL_USER_API_LOGIN, null, { email, password }, HttpContentType.CONTENT_TYPE_JSON, "json", false, null, (userCredentials) => {
            accessTokenUtil.setAccessToken(userCredentials.accessToken);
            this.getCurrentUser((user) => {
                if (user === null) {
                    errorCallback(new ObjectNotFoundError("User not found!"));
                }
                else {
                    successCallback(user);
                }
            }, (error) => errorCallback(error));
        }, (error) => {
            errorCallback(errorUtil.getServiceError(error));
        });
    }
    logout(successCallback, errorCallback) {
        accessTokenUtil.deleteAccessToken();
        successCallback();
    }
    create(email, userName, password, successCallback, errorCallback) {
        let body = new UserEntity(-1, false, email, userName, false, null);
        body.password = password;
        httpService.sendRequest(HttpMethod.METHOD_POST, this.URL_USER_API_REGISTER, null, body, HttpContentType.CONTENT_TYPE_JSON, "json", false, null, (userCredentials) => {
            successCallback();
        }, (error) => {
            errorCallback(errorUtil.getServiceError(error));
        });
    }
    getCurrentUser(successCallback, errorCallback) {
        httpService.sendRequest(HttpMethod.METHOD_GET, this.URL_USER_API_GET_CURRENT_USER, null, null, null, "json", false, accessTokenUtil.getAccessToken(), (response) => {
            let userEntity = response.user;
            successCallback(converter.convertUserEntityToUser(userEntity));
        }, (error) => {
            if (error === 401) {
                successCallback(null); //the user is not logged in
            }
            errorCallback(errorUtil.getServiceError(error));
        });
    }
    updateOwnUser(updatedUser, successCallback, errorCallback) {
        httpService.sendRequest(HttpMethod.METHOD_PUT, this.URL_USER_API_UPDATE_OWN_USER, null, converter.convertUserToUserEntity(updatedUser), HttpContentType.CONTENT_TYPE_JSON, null, false, accessTokenUtil.getAccessToken(), () => { successCallback(); }, (error) => { errorCallback(errorUtil.getServiceError(error)); });
    }
    getBlockedUsers(isBlocked, successCallback, errorCallback) {
        const params = { isBlocked: String(isBlocked) };
        httpService.sendRequest(HttpMethod.METHOD_GET, this.URL_USERS_API_BASE, params, null, null, "json", false, accessTokenUtil.getAccessToken(), (response) => {
            const arr = Array.isArray(response) ? response : (response.users ?? []);
            const users = arr.map((ue) => converter.convertUserEntityToUser(ue));
            successCallback(users);
        }, (error) => errorCallback(new ServiceError("Error: could not load blocked users")));
    }
    setBlocked(userId, blocked, name, profilePictureName, successCallback, errorCallback) {
        const body = {
            name: name,
            profilepicturename: profilePictureName,
            isblocked: blocked,
        };
        httpService.sendRequest(HttpMethod.METHOD_PUT, `${this.URL_USERS_API_BASE}/${userId}`, null, body, HttpContentType.CONTENT_TYPE_JSON, "json", false, accessTokenUtil.getAccessToken(), () => successCallback(), (error) => errorCallback(errorUtil.getServiceError?.(error) ?? new ServiceError(String(error))));
    }
    deleteOwnUser(successCallback, errorCallback) {
        httpService.sendRequest(HttpMethod.METHOD_DELETE, this.URL_USERS_API_BASE, null, null, null, null, false, accessTokenUtil.getAccessToken(), () => {
            accessTokenUtil.deleteAccessToken();
            successCallback();
        }, (error) => {
            errorCallback(new ServiceError("Error! Delete user failed!"));
        });
    }
    getProfilePicture(success, error) {
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
            if (!r.ok)
                throw await r.text();
            const blob = await r.blob();
            const url = URL.createObjectURL(blob);
            success(url);
        })
            .catch((e) => error(e));
    }
    updateProfilePicture(file, successCallback, errorCallback) {
        const fd = new FormData();
        fd.append("file", file);
        fetch(this.URL_USERS_API_BASE + "/profilepicture", {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessTokenUtil.getAccessToken()}`
            },
            body: fd
        })
            .then(async (r) => {
            if (!r.ok)
                throw await r.text();
            successCallback();
        })
            .catch((_e) => errorCallback(new ServiceError("Error! Upload profile picture failed!")));
    }
    deleteProfilePicture(successCallback, errorCallback) {
        fetch(this.URL_USERS_API_BASE + "/profilepicture", {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessTokenUtil.getAccessToken()}`
            }
        })
            .then(async (r) => {
            if (!r.ok)
                throw await r.text();
            successCallback();
        })
            .catch((_e) => errorCallback(new ServiceError("Error! Delete profile picture failed!")));
    }
}
export let userHttpService = new UserHttpService();
//# sourceMappingURL=UserHttpService.js.map