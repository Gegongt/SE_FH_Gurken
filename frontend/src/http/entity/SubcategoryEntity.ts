export class SubcategoryEntity
{
    public id:number;
    public categoryid:number;
    public name:string;

    constructor(id:number, categoryid:number, name:string)
    {
        this.id = id;
        this.categoryid = categoryid;
        this.name = name;
    }
}