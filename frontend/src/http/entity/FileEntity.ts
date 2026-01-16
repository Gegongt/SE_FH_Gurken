export class FileEntity
{
    private id:number;
    private subcategoryId:number;
    private name:string;
    private uploaderId:number;
    private isReported:boolean;

    constructor(id:number, subcategoryId:number, name:string, uploaderId:number, isReported:boolean)
    {
        this.id = id;
        this.subcategoryId = subcategoryId;
        this.name = name;
        this.uploaderId = uploaderId;
        this.isReported = isReported;
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

    getUploaderId():number
    {
        return this.uploaderId;
    }

    setUploaderId(uploaderId:number):void
    {
        this.uploaderId = uploaderId;
    }

    getIsReported():boolean
    {
        return this.isReported;
    }

    setIsReported(isReported:boolean):void
    {
        this.isReported = isReported;
    }

}