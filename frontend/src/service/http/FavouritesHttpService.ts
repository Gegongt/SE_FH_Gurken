import { httpService } from "../../http/HttpService.js";
import { HttpMethod } from "../../http/HttpMethod.js";
import { HttpContentType } from "../../http/HttpContentType.js";
import { accessTokenUtil } from "./AccessTokenUtil.js";
import { ServiceError } from "../error/ServiceError.js";

class FavouritesHttpService {
  private BASE = "http://localhost:3000/api"; // wie bei UserHttpService

  // ⚠️ in Swagger nachschauen und hier korrekt setzen
  private URL_GET = this.BASE + "/favourites";           
  private URL_ADD = this.BASE + "/favourites";           
  private URL_REMOVE = this.BASE + "/favourites";        

  getFavourites(success:(fileIds:number[])=>void, error:(status:any)=>void): void {
    httpService.sendRequest(
      HttpMethod.METHOD_GET,
      this.URL_GET,
      null,
      null,
      null,
      "json",
      false,
      accessTokenUtil.getAccessToken(),
      (response:any) => {
        // je nach Backend: response könnte { favourites:[...] } sein
        success(response.favourites ?? response);
      },
      (e:ServiceError) => error(e)
    );
  }

  addFavourite(fileId:number, success:()=>void, error:(status:any)=>void): void {
    httpService.sendRequest(
      HttpMethod.METHOD_POST,
      this.URL_ADD,
      null,
      { fileId },
      HttpContentType.CONTENT_TYPE_JSON,
      "json",
      false,
      accessTokenUtil.getAccessToken(),
      () => success(),
      (e:any) => error(e)
    );
  }

  removeFavourite(fileId:number, success:()=>void, error:(status:any)=>void): void {
    httpService.sendRequest(
      HttpMethod.METHOD_DELETE,
      this.URL_REMOVE + "/" + fileId, // oder params/body – je nach Swagger
      null,
      null,
      null,
      "json",
      false,
      accessTokenUtil.getAccessToken(),
      () => success(),
      (e:any) => error(e)
    );
  }
}

export const favouritesHttpService = new FavouritesHttpService();
