import { UserEntity } from "./UserEntity";

export class ExamEntity
{
    public id:number;
    public subcategoryid:number;
    public name:string;
    public creator:UserEntity;

    constructor(id:number, subcategoryid:number, name:string, creator:UserEntity)
    {
        this.id = id;
        this.subcategoryid = subcategoryid;
        this.name = name;
        this.creator = creator;
    }
}
