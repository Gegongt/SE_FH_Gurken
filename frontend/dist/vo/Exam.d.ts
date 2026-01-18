import { Question } from "./Question.js";
import { User } from "./User.js";
export declare class Exam {
    private id;
    private name;
    private questions;
    private creator;
    constructor(id: number, name: string, questions: Question[], creator: User);
    getId(): number;
    setId(id: number): void;
    getName(): string;
    setName(name: string): void;
    getQuestions(): Question[];
    setQuestions(questions: Question[]): void;
    getCreator(): User;
    setCreator(creator: User): void;
}
//# sourceMappingURL=Exam.d.ts.map