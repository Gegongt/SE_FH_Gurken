export class RatingEntity
{
    private id:number;
    private ratingIsBad:boolean;
    private ratingIsMedium:boolean;
    private ratingIsGood:boolean;
    private userId:number;
    private fileId:number;

    constructor(id:number, ratingIsBad:boolean, ratingIsMedium:boolean, ratingIsGood:boolean,
                userId:number, fileId:number)
    {
        this.id = id;
        this.ratingIsBad = ratingIsBad;
        this.ratingIsMedium = ratingIsMedium;
        this.ratingIsGood = ratingIsGood;
        this.userId = userId;
        this.fileId = fileId;
    }

    getId():number
    {
        return this.id;
    }

    setId(id:number):void
    {
        this.id = id;
    }

    getRatingIsBad():boolean
    {
        return this.ratingIsBad;
    }

    setRatingIsBad(ratingIsBad:boolean):void
    {
        this.ratingIsBad = ratingIsBad;
    }

    getRatingIsMedium():boolean
    {
        return this.ratingIsMedium;
    }

    setRatingIsMedium(ratingIsMedium:boolean):void
    {
        this.ratingIsMedium = ratingIsMedium;
    }

    getRatingIsGood():boolean
    {
        return this.ratingIsGood;
    }

    setRatingIsGood(ratingIsGood:boolean):void
    {
        this.ratingIsGood = ratingIsGood;
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