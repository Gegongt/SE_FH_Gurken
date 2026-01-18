import { NamedEntity } from "./NamedEntity.js";
export declare class Subcategory extends NamedEntity {
    private files?;
    private exams?;
    private chat?;
    constructor(id: number, name: string, files?: NamedEntity[], exams?: NamedEntity[], chat?: NamedEntity);
    getFiles(): NamedEntity[] | undefined;
    getExams(): NamedEntity[] | undefined;
    getChat(): NamedEntity | undefined;
}
//# sourceMappingURL=Subcategory.d.ts.map