export class ExamEntity
{
    public id:number;
    public subcategoryid:number;
    public name:string;
    public creatorid:number|string;

    constructor(id:number, subcategoryid:number, name:string, creatorid:number|string)
    {
        this.id = id;
        this.subcategoryid = subcategoryid;
        this.name = name;
        this.creatorid = creatorid;
    }
}
