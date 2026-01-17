import { HttpMethod } from "../../http/HttpMethod.js";
import { httpService } from "../../http/HttpService.js";
import { ServiceError } from "../error/ServiceError.js";
import { accessTokenUtil } from "./AccessTokenUtil.js";
import { converter } from "../../http/entity/util/Converter.js";
import { File } from "../../vo/File.js";
import { FileEntity } from "../../http/entity/FileEntity.js";
import { HttpContentType } from "../../http/HttpContentType.js";

class FileHttpService {
  private URL_FILE_API_BASE = "http://localhost:3000/api/files";

   getFiles(
    subcategoryId: number,
    _shallow: boolean, 
    success: (files: File[]) => void,
    errorCallback: (status: any) => void
  ): void {
    const params = { subcategoryid: String(subcategoryId) }; 

    httpService.sendRequest(
      HttpMethod.METHOD_GET,
      this.URL_FILE_API_BASE,
      params,
      null,
      null,
      "json",
      false,
      accessTokenUtil.getAccessToken(),
      (response: any) => {
        const arr: FileEntity[] = Array.isArray(response) ? response : (response.files ?? []);
        success(arr.map(fe => converter.convertFileEntityToFile(fe)));
      },
      (error: any) => errorCallback(error)
    );
  }

    uploadFile(subcategoryId: number, file: globalThis.File, success: (created: File)=>void, error:(e:any)=>void): void {
    const fd = new FormData();
    fd.append("subcategoryid", String(subcategoryId));
    fd.append("file", file, file.name);

    fetch(this.URL_FILE_API_BASE, {
        method: "POST",
        headers: {
        Authorization: `Bearer ${accessTokenUtil.getAccessToken()}`
        },
        body: fd
    })
    .then(async r => {
        if (!r.ok) throw await r.text();
        return r.json();
    })
    .then(json => success(converter.convertFileEntityToFile(json)))
    .catch(err => error(err));
    }


  reportFile(
    fileId: number,
    reported: boolean,
    success: (updated: File) => void,
    errorCallback: (status: any) => void
  ): void {
    const body = { isreported: reported };

    httpService.sendRequest(
      HttpMethod.METHOD_PUT,
      `${this.URL_FILE_API_BASE}/${fileId}`,
      null,
      body,
      HttpContentType.CONTENT_TYPE_JSON,
      "json",
      false,
      accessTokenUtil.getAccessToken(),
      (response: any) => {
        const updated = converter.convertFileEntityToFile(response as FileEntity);
        success(updated);
      },
      (error: any) => errorCallback(error)
    );
  }
}

export let fileHttpService = new FileHttpService();