import { File } from "../../vo/File.js";
export declare class UserFilesView {
    private list;
    private uploaderLabel;
    private errorBox;
    constructor();
    setUploaderLabel(text: string): void;
    showError(msg: string): void;
    clearError(): void;
    renderFilesLoading(): void;
    renderFiles(files: File[]): void;
    bindFileActions(handler: (action: "download" | "report" | "rate" | "favourite" | "delete", fileId: number, rateValue?: string) => void): void;
}
//# sourceMappingURL=UserFilesView.d.ts.map