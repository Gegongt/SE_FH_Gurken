import { File as FileVO } from "../vo/File.js";
import { User } from "../vo/User.js";
import { Rating } from "../vo/Rating.js";

export class FileMemService {
  private dummyUser = new User(3, false, "fred.mueller@stud.hcw.ac.at", "fred", false, null, []);

  private filesBySubcat = new Map<number, FileVO[]>([
    [
      1,
      [
        new FileVO(101, "ER-Modell.pdf", false, this.dummyUser, []),
        new FileVO(102, "SQL-Übung.zip", false, this.dummyUser, []),
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

  getFiles(
    subcategoryId: number,
    shallow: boolean,
    success: (files: FileVO[]) => void,
    error: (status: any) => void
  ): void {
    setTimeout(() => {
      const files = this.filesBySubcat.get(subcategoryId) ?? [];
      success(files);
    }, 150);
  }

  uploadFile(
    subcategoryId: number,
    file: globalThis.File,
    success: (created: FileVO) => void,
    error: (status: any) => void
  ): void {
    setTimeout(() => {
      const newId = Date.now(); 
      const created = new FileVO(newId, file.name, false, this.dummyUser, []);

      const list = this.filesBySubcat.get(subcategoryId) ?? [];
      list.push(created);
      this.filesBySubcat.set(subcategoryId, list);

      success(created);
    }, 250);
  }
}

export const fileMemService = new FileMemService();

