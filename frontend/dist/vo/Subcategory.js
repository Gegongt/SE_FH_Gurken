import { NamedEntity } from "./NamedEntity.js";
export class Subcategory extends NamedEntity {
    constructor(id, name, files, exams, chat) {
        super(id, name);
        this.files = files;
        this.exams = exams;
        this.chat = chat;
    }
    getFiles() {
        return this.files;
    }
    getExams() {
        return this.exams;
    }
    getChat() {
        return this.chat;
    }
}
//# sourceMappingURL=Subcategory.js.map