import { User } from "../vo/User.js";
import { ObjectAlreadyExists } from "./error/ObjectAlreadyExists.js";
import { LoginError } from "./error/LoginError.js";
import { ObjectNotFoundError } from "./error/ObjectNotFoundError.js";
import { ServiceError } from "./error/ServiceError.js";
import { InvalidValueError } from "./error/InvalidValueError.js";

class UserMemService
{
    private users:User[];
    private nextUserId:number = 1;
    private userPasswords:Map<string, string>;

    public constructor()
    {
        this.users = [new User(this.nextUserId++, true, "admin@stud.hcw.ac.at", "Admin", false, null, []),
                      new User(this.nextUserId++, false, "fred.mueller@stud.hcw.ac.at", "fred", false, null, []),
                      new User(this.nextUserId++, false, "blocki.mueller@stud.hcw.ac.at", "blocki", true, null, []),
                      new User(this.nextUserId++, false, "susi.schmidt@stud.hcw.ac.at", "susi", true, null, [])];
        
        this.userPasswords = new Map<string, string>();
        this.userPasswords.set("Admin", "superSecret");
        this.userPasswords.set("fred", "password");
        this.userPasswords.set("susi", "susisPassword");
    }

    private getUserSync(emailOrUserName:string):User|null
    {
        for(let user of this.users)
        {
            if(user.getEmail() === emailOrUserName || user.getName() === emailOrUserName)
            {
                return user;
            }
        }

        return null;
    }

    getUser(emailOrUserName:string, successCallback:(user:User) => void, errorCallback:(error:ServiceError) => void):void
    {
        setTimeout(() =>
        {
            let user:User|null = this.getUserSync(emailOrUserName);
            
            if(user !== null)
            {
                successCallback(user);
            }

            else
            {
                errorCallback(new ObjectNotFoundError("User<" + emailOrUserName + "> has not been found!"));
            }
        }, 500);
    }

    login(emailOrUserName:string, password:string, successCallback:(user:User) => void, errorCallback:(error:ServiceError) => void):void
    {
        setTimeout(() =>
        {
            this.getUser(emailOrUserName,
            (user:User) =>
            {
                console.dir(user);
                console.dir(this.userPasswords);
                if(this.userPasswords.get(user.getName()) === password)
                {
                    localStorage.setItem("currentUser", user.getName());
                    successCallback(user);
                    return;
                }

                errorCallback(new LoginError("Password is incorrect!"));
            },
        
            (error:ServiceError) =>
            {
                errorCallback(error);
            });

        }, 500);
    }
    
    logout(successCallback:() => void, errorCallback:(error:ServiceError) => void):void
    {
        setTimeout(() =>
        {
            localStorage.setItem("currentUser", "");
            successCallback();
        }, 500);
    }

    getCurrentUser(successCallback:(user:User|null) => void, errorCallback:(error:ServiceError) => void):void
    {
        setTimeout(() =>
        {
            let currentUserName:string|null = localStorage.getItem("currentUser");

            successCallback(currentUserName ? this.getUserSync(currentUserName) : null);
        }, 500);
    }

    create(email:string, userName:string, password:string, successCallback:(user:User) => void,
           errorCallback:(error:ServiceError) => void):void
    {
        setTimeout(() =>
        {
            if(email === "" || userName === "" || password === "")
            {
                errorCallback(new InvalidValueError("Email, user name and password are not allowed to be empty!"));
            }

            else if(this.getUserSync(email) !== null || this.getUserSync(userName) !== null)
            {
                errorCallback(new ObjectAlreadyExists("Email or user name already in use!"));
            }

            else
            {
                let user = new User(this.nextUserId++, false, email, userName, false, null, []);

                this.users.push(user);
                this.userPasswords.set(userName, password);

                successCallback(user);
            }
        }, 500);
    }

    updateProfilePicture(
        file: globalThis.File,
        success: (updatedUser: User) => void,
        error: (status: any) => void
        ): void {
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


    getBlockedUsers(
        success: (users: User[]) => void,
        error: (status: any) => void
        ): void {
        setTimeout(() => {
            success(this.users.filter(u => u.getIsBlocked()));
        }, 150);
    }

    setBlocked(
        userId: number,
        blocked: boolean,
        success: (u: User) => void,
        error: (status: any) => void
        ): void {
        setTimeout(() => {
            const u = this.users.find(x => x.getId() === userId);
            if (!u) { error(404); return; }
            u.setIsBlocked(blocked);
            success(u);
        }, 150);
    }

}

export let userMemService = new UserMemService();
