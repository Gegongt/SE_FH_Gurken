import { User } from "../vo/User.js";
import { ObjectAlreadyExists } from "./error/ObjectAlreadyExists.js";
import { LoginError } from "./error/LoginError.js";
import { ObjectNotFoundError } from "./error/ObjectNotFoundError.js";
import { InvalidValueError } from "./error/InvalidValueError.js";
class UserMemService {
    constructor() {
        this.nextUserId = 1;
        this.users = [new User(this.nextUserId++, true, "admin@stud.hcw.ac.at", "Admin", false, null, []),
            new User(this.nextUserId++, false, "fred.mueller@stud.hcw.ac.at", "fred", false, null, []),
            new User(this.nextUserId++, false, "blocki.mueller@stud.hcw.ac.at", "blocki", true, null, []),
            new User(this.nextUserId++, false, "susi.schmidt@stud.hcw.ac.at", "susi", true, null, [])];
        this.userPasswords = new Map();
        this.userPasswords.set("Admin", "superSecret");
        this.userPasswords.set("fred", "password");
        this.userPasswords.set("susi", "susisPassword");
    }
    getUserSync(emailOrUserName) {
        for (let user of this.users) {
            if (user.getEmail() === emailOrUserName || user.getName() === emailOrUserName) {
                return user;
            }
        }
        return null;
    }
    getUserByIdSync(id) {
        for (let user of this.users) {
            if (user.getId() === id) {
                return user;
            }
        }
        return null;
    }
    getUser(emailOrUserName, successCallback, errorCallback) {
        setTimeout(() => {
            let user = this.getUserSync(emailOrUserName);
            if (user !== null) {
                successCallback(user);
            }
            else {
                errorCallback(new ObjectNotFoundError("User<" + emailOrUserName + "> has not been found!"));
            }
        }, 500);
    }
    getUserById(id, successCallback, errorCallback) {
        setTimeout(() => {
            let user = this.getUserByIdSync(id);
            if (user !== null) {
                successCallback(user);
            }
            else {
                errorCallback(new ObjectNotFoundError("User<" + id + "> has not been found!"));
            }
        }, 500);
    }
    login(emailOrUserName, password, successCallback, errorCallback) {
        setTimeout(() => {
            this.getUser(emailOrUserName, (user) => {
                console.dir(user);
                console.dir(this.userPasswords);
                if (this.userPasswords.get(user.getName()) === password) {
                    localStorage.setItem("currentUser", user.getName());
                    successCallback(user);
                    return;
                }
                errorCallback(new LoginError("Password is incorrect!"));
            }, (error) => {
                errorCallback(error);
            });
        }, 500);
    }
    logout(successCallback, errorCallback) {
        setTimeout(() => {
            localStorage.setItem("currentUser", "");
            successCallback();
        }, 500);
    }
    getCurrentUser(successCallback, errorCallback) {
        setTimeout(() => {
            let currentUserName = localStorage.getItem("currentUser");
            successCallback(currentUserName ? this.getUserSync(currentUserName) : null);
        }, 500);
    }
    create(email, userName, password, successCallback, errorCallback) {
        setTimeout(() => {
            if (email === "" || userName === "" || password === "") {
                errorCallback(new InvalidValueError("Email, user name and password are not allowed to be empty!"));
            }
            else if (this.getUserSync(email) !== null || this.getUserSync(userName) !== null) {
                errorCallback(new ObjectAlreadyExists("Email or user name already in use!"));
            }
            else {
                let user = new User(this.nextUserId++, false, email, userName, false, null, []);
                this.users.push(user);
                this.userPasswords.set(userName, password);
                successCallback(user);
            }
        }, 500);
    }
    updateProfilePicture(file, success, error) {
        setTimeout(() => {
            const currentUserName = localStorage.getItem("currentUser");
            const loggedInUser = currentUserName ? this.getUserSync(currentUserName) : null;
            if (!loggedInUser) {
                error(401);
                return;
            }
            const url = URL.createObjectURL(file);
            loggedInUser.setProfilePictureName(url);
            success(loggedInUser);
        }, 150);
    }
    getBlockedUsers(success, error) {
        setTimeout(() => {
            success(this.users.filter(u => u.getIsBlocked()));
        }, 150);
    }
    setBlocked(userId, blocked, success, error) {
        setTimeout(() => {
            const u = this.users.find(x => x.getId() === userId);
            if (!u) {
                error(404);
                return;
            }
            u.setIsBlocked(blocked);
            success(u);
        }, 150);
    }
}
export let userMemService = new UserMemService();
//# sourceMappingURL=UserMemService.js.map