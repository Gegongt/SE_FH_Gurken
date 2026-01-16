export class ExamEntity
{
    private id:number;
    private subcategoryId:number;
    private name:string;
    private creatorId:number;

    constructor(id:number, subcategoryId:number, name:string, creatorId:number)
    {
        this.id = id;
        this.subcategoryId = subcategoryId;
        this.name = name;
        this.creatorId = creatorId;
    }

    getId():number
    {
        return this.id;
    }

    setId(id:number):void
    {
        this.id = id;
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

    getCreatorId():number
    {
        return this.creatorId;
    }

    setCreatorId(creatorId:number):void
    {
        this.creatorId = creatorId;
    }
}
