import { User } from "./User.js";
import { File } from "./File.js";

export class Rating
{
  private id:number;
  private ratingIsBad:boolean;
  private ratingIsMedium:boolean;
  private ratingIsGood:boolean;
  private user:User;
  private file:File;

  constructor(id:number, ratingIsBad:boolean, ratingIsMedium:boolean, ratingIsGood:boolean,
              user:User, file:File)
  {
    this.id = id;
    this.ratingIsBad = ratingIsBad;
    this.ratingIsMedium = ratingIsMedium;
    this.ratingIsGood = ratingIsGood;
    this.user = user;
    this.file = file;
  }

  public getId():number
  {
    return this.id;
  }

  public getUser():User
  {
    return this.user;
  }

  public getFile():File
  {
    return this.file;
  }

  public getRatingIsBad():boolean
  {
    return this.ratingIsBad;
  }

  public getRatingIsMedium():boolean
  {
    return this.ratingIsMedium;
  }

  public getRatingIsGood():boolean
  {
    return this.ratingIsGood;
  }

  public setRatingIsBad(ratingIsBad:boolean):boolean
  {
    this.ratingIsBad = ratingIsBad;
    return true;
  }

  public setRatingIsMedium(ratingIsMedium:boolean):boolean
  {
    this.ratingIsMedium = ratingIsMedium;
    return true;
  }

  public setRatingIsGood(ratingIsGood:boolean):boolean
  {
    this.ratingIsGood = ratingIsGood;
    return true;
  }
}
