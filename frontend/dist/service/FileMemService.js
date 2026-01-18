import { File as FileVO } from "../vo/File.js";
import { User } from "../vo/User.js";
export class FileMemService {
    constructor() {
        this.dummyUser = new User(3, false, "fred.mueller@stud.hcw.ac.at", "fred", false, null, []);
        this.filesBySubcat = new Map([
            [
                1,
                [
                    new FileVO(101, "ER-Modell.pdf", false, this.dummyUser, []),
                    new FileVO(102, "SQL-Übung.zip", false, this.dummyUser, []),
                    new FileVO(103, "reported-file.txt", true, this.dummyUser, []),
                ],
            ],
            [
                2,
                [
                    new FileVO(201, "UML-Cheatsheet.pdf", false, this.dummyUser, []),
                    new FileVO(202, "SoC-Pattern.txt", false, this.dummyUser, []),
                ],
            ],
        ]);
    }
    getFiles(subcategoryId, shallow, success, error) {
        setTimeout(() => {
            const files = this.filesBySubcat.get(subcategoryId) ?? [];
            success(files);
        }, 150);
    }
    uploadFile(subcategoryId, file, success, error) {
        setTimeout(() => {
            const list = this.filesBySubcat.get(subcategoryId) ?? [];
            const created = new FileVO(Date.now(), file.name, false, this.dummyUser, []);
            list.push(created);
            this.filesBySubcat.set(subcategoryId, list);
            success(created);
        }, 150);
    }
    reportFile(fileId, reported, success, error) {
        setTimeout(() => {
            for (const list of this.filesBySubcat.values()) {
                const f = list.find(x => x.getId() === fileId);
                if (f) {
                    f.setIsReported(reported);
                    success(f);
                    return;
                }
            }
            error(404);
        }, 120);
    }
    getReportedFiles(success, error) {
        setTimeout(() => {
            const reported = [];
            for (const list of this.filesBySubcat.values()) {
                for (const f of list) {
                    if (f.getIsReported())
                        reported.push(f);
                }
            }
            success(reported);
        }, 150);
    }
    deleteFile(fileId, success, error) {
        setTimeout(() => {
            for (const list of this.filesBySubcat.values()) {
                const idx = list.findIndex((x) => x.getId() === fileId);
                if (idx >= 0) {
                    list.splice(idx, 1);
                    success();
                    return;
                }
            }
            error(404);
        }, 150);
    }
}
export const fileMemService = new FileMemService();
//# sourceMappingURL=FileMemService.js.map