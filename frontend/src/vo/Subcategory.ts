import { NamedEntity } from "./NamedEntity.js";

export class Subcategory extends NamedEntity {
  private files?: NamedEntity[] | undefined;
  private exams?: NamedEntity[] | undefined;
  private chat?: NamedEntity | undefined;

  constructor(
    id: number,
    name: string,
    files?: NamedEntity[],
    exams?: NamedEntity[],
    chat?: NamedEntity
  ) {
    super(id, name);
    this.files = files;
    this.exams = exams;
    this.chat = chat;
  }

  getFiles(): NamedEntity[] | undefined {
    return this.files;
  }

  getExams(): NamedEntity[] | undefined {
    return this.exams;
  }

  getChat(): NamedEntity | undefined {
    return this.chat;
  }
}
