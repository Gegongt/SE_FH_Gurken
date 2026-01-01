import { Rating } from "./Rating.js";
import { User } from "./User.js";

export class File
{
  private id:number;
  private name:string;
  private isReported:boolean;
  private uploader:User;
  private ratings:Rating[];

  constructor(id:number, name:string, isReported:boolean, uploader:User, ratings:Rating[] = [])
  {
    this.id = id;
    this.name = name;
    this.isReported = isReported;
    this.uploader = uploader;
    this.ratings = ratings;
  }

  public getId():number
  {
    return this.id;
  }

  public getName():string
  {
    return this.name;
  }

  public setName(name:string):void
  {
    this.name = name;
  }

  public getUploader():User
  {
    return this.uploader;
  }

  public getIsReported():boolean
  {
    return this.isReported;
  }

  public setIsReported(isReported:boolean):void
  {
    this.isReported = isReported;
  }

  public getRatings():Rating[]
  {
    return this.ratings;
  }
}
