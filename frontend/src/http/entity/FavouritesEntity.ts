export class FavouritesEntity
{
    private userId:number;
    private fileId:number;

    constructor(userId:number, fileId:number)
    {
        this.userId = userId;
        this.fileId = fileId;
    }

    getUserId():number
    {
        return this.userId;
    }

    setUserId(userId:number):void
    {
        this.userId = userId;
    }

    getFileId():number
    {
        return this.fileId;
    }

    setFileId(fileId:number):void
    {
        this.fileId = fileId;
    }
}
