import { User } from "../vo/User.js";
import { LoginError } from "./error/LoginError.js";
import { ObjectNotFoundError } from "./error/ObjectNotFoundError.js";
import { ServiceError } from "./error/ServiceError.js";

class UserMemService
{
    private users:User[];
    private nextUserId:number = 1;
    private userPasswords:Map<string, string>;

    public constructor()
    {
        this.users = [new User(this.nextUserId++, true, "admin@stud.hcw.ac.at", "Admin", false, null, []),
                      new User(this.nextUserId++, false, "fred.mueller@stud.hcw.ac.at", "fred", false, null, []),
                      new User(this.nextUserId++, false, "susi.schmidt@stud.hcw.ac.at", "susi", true, null, [])];
        
        this.userPasswords = new Map<string, string>();
        this.userPasswords.set("Admin", "superSecret");
        this.userPasswords.set("fred", "password");
        this.userPasswords.set("susi", "susisPassword");
    }

    getUser(emailOrUserName:string, successCallback:(user:User) => void, errorCallback:(error:ServiceError) => void):void
    {
        setTimeout(() =>
        {
            for(let user of this.users)
            {
                if(user.getEmail() === emailOrUserName || user.getName() === emailOrUserName)
                {
                    successCallback(user);
                    return;
                }
            }

            errorCallback(new ObjectNotFoundError("User<" + emailOrUserName + "> has not been found!"));
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
    
    logout(successCallback:() => void, errorCallback:() => void)
    {
        setTimeout(() =>
        {
            successCallback();
        }, 500);
    }
}

export let userMemService = new UserMemService();
