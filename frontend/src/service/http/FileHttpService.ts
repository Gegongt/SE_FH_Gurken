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
    name: string,
    reported: boolean,
    success: (updated: File) => void,
    error: (status: any) => void
  ): void {
    const body = { name, isreported: reported };

    if(reported)
    {
      httpService.sendRequest(HttpMethod.METHOD_PUT, this.URL_FILE_API_BASE + "/" + fileId + "/report", null,
                              null, null, null, false, accessTokenUtil.getAccessToken(),
                              (resp: any) => success(converter.convertFileEntityToFile(converter.convertFileEntityToFile(fileId))),
                              (err: any) => error(err));
    }

    else
    {
      httpService.sendRequest(
        HttpMethod.METHOD_PUT,
        `${this.URL_FILE_API_BASE}/${fileId}`,
        null,
        body,
        HttpContentType.CONTENT_TYPE_JSON,
        "json",
        false,
        accessTokenUtil.getAccessToken(),
        (resp: any) => success(converter.convertFileEntityToFile(resp)),
        (err: any) => error(err)
      );
    }
  }


  downloadFile(
    fileId: number,
    success: (filename?: string) => void,
    error: (e: any) => void
  ): void {
    fetch(`${this.URL_FILE_API_BASE}/${fileId}/download`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessTokenUtil.getAccessToken()}`,
      },
    })
      .then(async (r) => {
        if (!r.ok) throw await r.text();

        const cd = r.headers.get("content-disposition") ?? "";
        const match = /filename="?([^"]+)"?/i.exec(cd);
        const filename = match?.[1] ?? `file_${fileId}`;

        const blob = await r.blob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();

        URL.revokeObjectURL(url);
        success(filename);
      })
      .catch((err) => error(err));
  }

  getAllFiles(
    success: (files: File[]) => void,
    error: (status: any) => void
  ): void {
    httpService.sendRequest(
      HttpMethod.METHOD_GET,
      "http://localhost:3000/api/files",
      null,   
      null,
      null,
      "json",
      false,
      accessTokenUtil.getAccessToken(),
      (resp: any) => {
        const arr = Array.isArray(resp) ? resp : (resp.files ?? []);
        const files = arr.map((fe: any) => converter.convertFileEntityToFile(fe));
        success(files);
      },
      (e: any) => error(e)
    );
  }

  deleteFile(
    fileId: number,
    success: () => void,
    error: (status: any) => void
  ): void {
    httpService.sendRequest(
      HttpMethod.METHOD_DELETE,
      `${this.URL_FILE_API_BASE}/${fileId}`, // -> /api/files/{fileId}
      null,
      null,
      null,
      null,
      false,
      accessTokenUtil.getAccessToken(),
      () => success(),
      (e: any) => error(e)
    );
  }

  getReportedFiles(
    success: (files: File[]) => void,
    error: (status: any) => void
  ): void {
    const params = { reported: "true" };

    httpService.sendRequest(
      HttpMethod.METHOD_GET,
      this.URL_FILE_API_BASE,   
      params,
      null,
      null,
      "json",
      false,
      accessTokenUtil.getAccessToken(),
      (resp: any) => {
        const arr = Array.isArray(resp) ? resp : (resp.files ?? []);
        const files = arr.map((fe: any) => converter.convertFileEntityToFile(fe));
        success(files);
      },
      (err: any) => error(err)
    );
  }

}

export let fileHttpService = new FileHttpService();