export class UserEntity
{
    public id:number|string;
    public isadmin:boolean;
    public email:string;
    public name:string;
    public isblocked:boolean;
    public profilepicturename:string|null;

    constructor(id:number|string, isadmin:boolean, email:string, name:string,
                isblocked:boolean, profilepicturename:string|null)
    {
        this.id = id;
        this.isadmin = isadmin;
        this.email = email;
        this.name = name;
        this.isblocked = isblocked;
        this.profilepicturename = profilepicturename; 
    }
}
