export class UserEntity
{
    private id:number;
    private isAdmin:boolean;
    private email:string;
    private name:string;
    private isBlocked:boolean;
    private profilePictureName:string;

    constructor(id:number, isAdmin:boolean, email:string, name:string,
                isBlocked:boolean, profilePictureName:string)
    {
        this.id = id;
        this.isAdmin = isAdmin;
        this.email = email;
        this.name = name;
        this.isBlocked = isBlocked;
        this.profilePictureName = profilePictureName; 
    }

    getId():number
    {
        return this.id;
    }

    setId(id:number):void
    {
        this.id = id;
    }

    getIsAdmin():boolean
    {
        return this.isAdmin;
    }

    setIsAdmin(isAdmin:boolean):void
    {
        this.isAdmin = isAdmin;
    }

    getEmail():string
    {
        return this.email;
    }

    setEmail(email:string):void
    {
        this.email = email;
    }

    getName():string
    {
        return this.name;
    }

    setName(name:string):void
    {
        this.name = name;
    }

    getIsBlocked():boolean
    {
        return this.isBlocked;
    }

    setIsBlocked(isBlocked:boolean):void
    {
        this.isBlocked = isBlocked;
    }

    getProfilePictureName():string
    {
        return this.profilePictureName;
    }

    setProfilePictureName(profilePictureName:string):void
    {
        this.profilePictureName = profilePictureName;
    }
}
