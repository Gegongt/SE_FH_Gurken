export class ChatMessage
{
    private id:number;
    private userId:string;
    private subcategoryId:number;
    private name:string;
    private message:string;
    private createdAt:any;

    constructor(id:number, userId:string, subcategoryId:number, name:string, message:string, createdAt:any)
    {
        this.id = id;
        this.userId = userId;
        this.subcategoryId = subcategoryId;
        this.name = name;
        this.message = message;
        this.createdAt = createdAt;
    }

    getId():number
    {
        return this.id;
    }

    setId(id:number):void
    {
        this.id = id;
    }
    
    getUserId():string
    {
        return this.userId;
    }

    setUserId(userId:string):void
    {
        this.userId = userId;
    }

    getSubcategoryId():number
    {
        return this.subcategoryId;
    }

    setSubcategoryId(subcategoryId:number):void
    {
        this.subcategoryId = subcategoryId;
    }

    getName():string
    {
        return this.name;
    }

    setName(name:string):void
    {
        this.name = name;
    }

    getMessage():string
    {
        return this.message;
    }

    setMessage(message:string):void
    {
        this.message = message;
    }

    getCreatedAt():any
    {
        return this.createdAt;
    }

    setCreatedAt(createdAt:any):void
    {
        this.createdAt = createdAt;
    }
}
