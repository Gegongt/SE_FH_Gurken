import { HttpMethod } from "../../http/HttpMethod.js";
import { HttpContentType } from "../../http/HttpContentType.js";
import { httpService } from "../../http/HttpService.js";
import { accessTokenUtil } from "../http/AccessTokenUtil.js";

export type RatingRowDTO = {
  id: number;
  userid: string;
  fileid: number;
  ratingisbad: boolean;
  ratingismedium: boolean;
  ratingisgood: boolean;
};

export class RatingHttpService {
  private URL = "http://localhost:3000/api/ratings";

  listByFile(fileId: number, success: (rows: RatingRowDTO[]) => void, error: (e:any)=>void) {
    httpService.sendRequest(
      HttpMethod.METHOD_GET,
      this.URL,
      { fileId: String(fileId) },          
      null, null, "json", false,
      accessTokenUtil.getAccessToken(),
      (rows:any) => success(Array.isArray(rows) ? rows : []),
      (err:any) => error(err)
    );
  }

  create(fileId: number, value: "BAD"|"MEDIUM"|"GOOD", success: ()=>void, error:(e:any)=>void) {
    const body = {
      fileid: fileId,
      ratingisbad: value === "BAD",
      ratingismedium: value === "MEDIUM",
      ratingisgood: value === "GOOD",
    };

    httpService.sendRequest(
      HttpMethod.METHOD_POST,
      this.URL,
      null,
      body,
      HttpContentType.CONTENT_TYPE_JSON,
      "json",
      false,
      accessTokenUtil.getAccessToken(),
      () => success(),
      (err:any) => error(err)
    );
  }

  update(ratingId: number, value: "BAD"|"MEDIUM"|"GOOD", success: ()=>void, error:(e:any)=>void) {
    const body = {
      ratingisbad: value === "BAD",
      ratingismedium: value === "MEDIUM",
      ratingisgood: value === "GOOD",
    };

    httpService.sendRequest(
      HttpMethod.METHOD_PUT,
      `${this.URL}/${ratingId}`,
      null,
      body,
      HttpContentType.CONTENT_TYPE_JSON,
      "json",
      false,
      accessTokenUtil.getAccessToken(),
      () => success(),
      (err:any) => error(err)
    );
  }

  remove(ratingId: number, success: ()=>void, error:(e:any)=>void) {
    httpService.sendRequest(
      HttpMethod.METHOD_DELETE,
      `${this.URL}/${ratingId}`,
      null,
      null,
      null,
      null,
      false,
      accessTokenUtil.getAccessToken(),
      () => success(),
      (err:any) => error(err)
    );
  }
}

export const ratingHttpService = new RatingHttpService();
