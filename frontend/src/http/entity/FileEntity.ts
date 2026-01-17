export class FileEntity
{
    public id:number;
    public subcategoryid:number;
    public name:string;
    public uploaderid:number;
    public isreported:boolean;

    constructor(id:number, subcategoryid:number, name:string, uploaderid:number, isreported:boolean)
    {
        this.id = id;
        this.subcategoryid = subcategoryid;
        this.name = name;
        this.uploaderid = uploaderid;
        this.isreported = isreported;
    }
}
