import { File } from "./File.js";

export class User
{
  private id:number|string;
  private isAdmin:boolean;
  private email:string;
  private name:string;
  private isBlocked:boolean;
  private profilePictureName:string|null;
  private favourites:File[];

  constructor(id:number|string, isAdmin:boolean, email:string, name:string, isBlocked:boolean,
              profilePictureName:string|null, favourites:File[] = [])
  {
    this.id = id;
    this.isAdmin = isAdmin;
    this.email = email;
    this.name = name;
    this.isBlocked = isBlocked;
    this.profilePictureName = profilePictureName;
    this.favourites = favourites;
  }

  public getId():number|string
  {
    return this.id;
  }

  public getIsAdmin():boolean
  {
    return this.isAdmin;
  }

  public getEmail():string
  {
    return this.email;
  }

  public setEmail(email:string):void
  {
    this.email = email;
  }

  public getName():string
  {
    return this.name;
  }

  public setName(name:string):void
  {
    this.name = name;
  }

  public getIsBlocked():boolean
  {
    return this.isBlocked;
  }

  public setIsBlocked(isBlocked:boolean):void
  {
    this.isBlocked = isBlocked;
  }

  public getFavourites():File[]
  {
    return this.favourites;
  }

  public isFavourite(fileId: number): boolean {
    return this.favourites.some(f => f.getId() === fileId);
  }

  public addFavourite(file: File): void {
    if (!this.isFavourite(file.getId())) {
      this.favourites.push(file);
    }
  }

  public removeFavourite(fileId: number): void {
    this.favourites = this.favourites.filter(f => f.getId() !== fileId);
  }

  public setFavourites(files: File[]): void {
    this.favourites = files ?? [];
  }

  public getProfilePictureName():string|null
  {
    return this.profilePictureName;
  }

  public setProfilePictureName(profilePictureName:string|null):void
  {
    this.profilePictureName = profilePictureName;
  }
}
