export class ChatMessageEntity
{
    public id:number;
    public userid:string;
    public subcategoryid:number;
    public name:string;
    public message:string;
    public created_at:any;

    constructor(id:number, userid:string, subcategoryid:number, name:string, message:string, created_at:any)
    {
        this.id = id;
        this.userid = userid;
        this.subcategoryid = subcategoryid;
        this.name = name;
        this.message = message;
        this.created_at = created_at;
    }
}
