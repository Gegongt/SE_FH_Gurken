import { File } from "../../vo/File.js";
declare class FileHttpService {
    private URL_FILE_API_BASE;
    getFiles(subcategoryId: number, _shallow: boolean, success: (files: File[]) => void, errorCallback: (status: any) => void): void;
    uploadFile(subcategoryId: number, file: globalThis.File, success: (created: File) => void, error: (e: any) => void): void;
    reportFile(fileId: number, name: string, reported: boolean, success: (updated: File) => void, error: (status: any) => void): void;
    downloadFile(fileId: number, success: (filename?: string) => void, error: (e: any) => void): void;
    getAllFiles(success: (files: File[]) => void, error: (status: any) => void): void;
    deleteFile(fileId: number, success: () => void, error: (status: any) => void): void;
    getReportedFiles(success: (files: File[]) => void, error: (status: any) => void): void;
}
export declare let fileHttpService: FileHttpService;
export {};
//# sourceMappingURL=FileHttpService.d.ts.map