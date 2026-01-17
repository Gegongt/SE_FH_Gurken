export class FavouritesEntity
{
    public userid:number;
    public fileid:number;

    constructor(userid:number, fileid:number)
    {
        this.userid = userid;
        this.fileid = fileid;
    }
}
