export class RatingEntity
{
    public id:number;
    public ratingisbad:boolean;
    public ratingismedium:boolean;
    public ratingisgood:boolean;
    public userid:number;
    public fileid:number;

    constructor(id:number, ratingisbad:boolean, ratingismedium:boolean, ratingisgood:boolean,
                userid:number, fileid:number)
    {
        this.id = id;
        this.ratingisbad = ratingisbad;
        this.ratingismedium = ratingismedium;
        this.ratingisgood = ratingisgood;
        this.userid = userid;
        this.fileid = fileid;
    }
}
