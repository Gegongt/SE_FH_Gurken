import { UserEntity } from "./UserEntity";

export class FileEntity
{
    public id:number;
    public subcategoryid:number;
    public name:string;
    public uploader:UserEntity;
    public isreported:boolean;

    constructor(id:number, subcategoryid:number, name:string, uploader:UserEntity, isreported:boolean)
    {
        this.id = id;
        this.subcategoryid = subcategoryid;
        this.name = name;
        this.uploader = uploader;
        this.isreported = isreported;
    }
}
