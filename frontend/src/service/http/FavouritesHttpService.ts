import { HttpMethod } from "../../http/HttpMethod.js";
import { httpService } from "../../http/HttpService.js";
import { HttpContentType } from "../../http/HttpContentType.js";
import { ServiceError } from "../error/ServiceError.js";
import { accessTokenUtil } from "./AccessTokenUtil.js";

export type FavouriteDTO = {
  userId?: string;
  userid?: string;
  fileId?: number;
  fileid?: number;
};

class FavouritesHttpService {
  private URL = "http://localhost:3000/api/favourites";

  getFavourites(userId: string, success: (favs: FavouriteDTO[]) => void, error: (e:any)=>void): void {
    httpService.sendRequest(
      HttpMethod.METHOD_GET,
      this.URL,
      { userId }, 
      null,
      null,
      "json",
      false,
      accessTokenUtil.getAccessToken(),
      (resp: any[]) => success(resp),
      (err: any) => error(err)
    );
  }

addFavourite(userId: string, fileId: number, success: ()=>void, error:(e:any)=>void): void {
  httpService.sendRequest(
    HttpMethod.METHOD_POST,
    this.URL,
    null,
    { userid: userId, fileid: fileId }, // !!! lowercase
    HttpContentType.CONTENT_TYPE_JSON,
    "json",
    false,
    accessTokenUtil.getAccessToken(),
    (_resp:any) => success(),
    (err:any) => error(err)
  );
}

removeFavourite(userId: string, fileId: number, success: ()=>void, error:(e:any)=>void): void {
  httpService.sendRequest(
    HttpMethod.METHOD_DELETE,
    this.URL,
    null,
    { userid: userId, fileid: fileId }, // !!! lowercase
    HttpContentType.CONTENT_TYPE_JSON,
    "json",
    false,
    accessTokenUtil.getAccessToken(),
    (_resp:any) => success(),
    (err:any) => error(err)
  );
}


}

export const favouritesHttpService = new FavouritesHttpService();
