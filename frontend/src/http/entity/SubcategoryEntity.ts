export class SubcategoryEntity
{
    private id:number;
    private categoryId:number;
    private name:string;

    constructor(id:number, categoryId:number, name:string)
    {
        this.id = id;
        this.categoryId = categoryId;
        this.name = name;
    }

    getId():number
    {
        return this.id;
    }

    setId(id:number):void
    {
        this.id = id;
    }

    getCategoryId():number
    {
        return this.categoryId;
    }

    setCategoryId(categoryId:number):void
    {
        this.categoryId = categoryId;
    }

    getName():string
    {
        return this.name;
    }

    setName(name:string):void
    {
        this.name = name;
    }
}