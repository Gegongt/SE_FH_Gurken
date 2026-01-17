import { HttpMethod } from "../../http/HttpMethod.js";
import { httpService } from "../../http/HttpService.js";
import { ServiceError } from "../error/ServiceError.js";
import { accessTokenUtil } from "./AccessTokenUtil.js";
import { converter } from "../../http/entity/util/Converter.js";
import { File } from "../../vo/File.js";
import { FileEntity } from "../../http/entity/FileEntity.js";

class FileHttpService {
  private URL_FILE_API_BASE = "http://localhost:3000/api/files";

  getFiles(
    subcategoryId: number | string | null,
    success: (files: File[]) => void,
    errorCallback: (status: any) => void
  ): void {
    let params: any = null;

    if (subcategoryId) {
      params = { subcategoryId };
    }

    httpService.sendRequest(
      HttpMethod.METHOD_GET,
      this.URL_FILE_API_BASE,
      params,
      null,
      null,
      "json",
      false,
      accessTokenUtil.getAccessToken(),
      (response: FileEntity[]) => {
        const files: File[] = [];
        for (const fe of response) {
          files.push(converter.convertFileEntityToFile(fe));
        }
        success(files);
      },
      (error: ServiceError) => errorCallback(error)
    );
  }
}

export let fileHttpService = new FileHttpService();
