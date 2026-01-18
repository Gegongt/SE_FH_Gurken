import { HttpMethod } from "../../http/HttpMethod.js";
import { httpService } from "../../http/HttpService.js";
import { accessTokenUtil } from "./AccessTokenUtil.js";
import { converter } from "../../http/entity/util/Converter.js";
import { HttpContentType } from "../../http/HttpContentType.js";
class FileHttpService {
    constructor() {
        this.URL_FILE_API_BASE = "http://localhost:3000/api/files";
    }
    getFiles(subcategoryId, _shallow, success, errorCallback) {
        const params = { subcategoryid: String(subcategoryId) };
        httpService.sendRequest(HttpMethod.METHOD_GET, this.URL_FILE_API_BASE, params, null, null, "json", false, accessTokenUtil.getAccessToken(), (response) => {
            const arr = Array.isArray(response) ? response : (response.files ?? []);
            success(arr.map(fe => converter.convertFileEntityToFile(fe)));
        }, (error) => errorCallback(error));
    }
    uploadFile(subcategoryId, file, success, error) {
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
            .then(async (r) => {
            if (!r.ok)
                throw await r.text();
            return r.json();
        })
            .then(json => success(converter.convertFileEntityToFile(json)))
            .catch(err => error(err));
    }
    reportFile(fileId, name, reported, success, error) {
        const body = { name, isreported: reported };
        if (reported) {
            httpService.sendRequest(HttpMethod.METHOD_PUT, this.URL_FILE_API_BASE + "/" + fileId + "/report", null, null, null, null, false, accessTokenUtil.getAccessToken(), (resp) => {
                let file = converter.convertFileEntityToFile(converter.convertFileEntityToFile(fileId));
                file.setIsReported(true);
                success(file);
            }, (err) => error(err));
        }
        else {
            httpService.sendRequest(HttpMethod.METHOD_PUT, `${this.URL_FILE_API_BASE}/${fileId}`, null, body, HttpContentType.CONTENT_TYPE_JSON, "json", false, accessTokenUtil.getAccessToken(), (resp) => success(converter.convertFileEntityToFile(resp)), (err) => error(err));
        }
    }
    downloadFile(fileId, success, error) {
        fetch(`${this.URL_FILE_API_BASE}/${fileId}/download`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessTokenUtil.getAccessToken()}`,
            },
        })
            .then(async (r) => {
            if (!r.ok)
                throw await r.text();
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
    getAllFiles(success, error) {
        httpService.sendRequest(HttpMethod.METHOD_GET, "http://localhost:3000/api/files", null, null, null, "json", false, accessTokenUtil.getAccessToken(), (resp) => {
            const arr = Array.isArray(resp) ? resp : (resp.files ?? []);
            const files = arr.map((fe) => converter.convertFileEntityToFile(fe));
            success(files);
        }, (e) => error(e));
    }
    deleteFile(fileId, success, error) {
        httpService.sendRequest(HttpMethod.METHOD_DELETE, `${this.URL_FILE_API_BASE}/${fileId}`, // -> /api/files/{fileId}
        null, null, null, null, false, accessTokenUtil.getAccessToken(), () => success(), (e) => error(e));
    }
    getReportedFiles(success, error) {
        const params = { reported: "true" };
        httpService.sendRequest(HttpMethod.METHOD_GET, this.URL_FILE_API_BASE, params, null, null, "json", false, accessTokenUtil.getAccessToken(), (resp) => {
            const arr = Array.isArray(resp) ? resp : (resp.files ?? []);
            const files = arr.map((fe) => converter.convertFileEntityToFile(fe));
            success(files);
        }, (err) => error(err));
    }
}
export let fileHttpService = new FileHttpService();
//# sourceMappingURL=FileHttpService.js.map