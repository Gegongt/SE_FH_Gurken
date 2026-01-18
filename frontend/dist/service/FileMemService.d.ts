import { File as FileVO } from "../vo/File.js";
export declare class FileMemService {
    private dummyUser;
    private filesBySubcat;
    getFiles(subcategoryId: number, shallow: boolean, success: (files: FileVO[]) => void, error: (status: any) => void): void;
    uploadFile(subcategoryId: number, file: globalThis.File, success: (created: FileVO) => void, error: (status: any) => void): void;
    reportFile(fileId: number, reported: boolean, success: (updated: FileVO) => void, error: (status: any) => void): void;
    getReportedFiles(success: (files: any[]) => void, error: (status: any) => void): void;
    deleteFile(fileId: number, success: () => void, error: (status: any) => void): void;
}
export declare const fileMemService: FileMemService;
//# sourceMappingURL=FileMemService.d.ts.map