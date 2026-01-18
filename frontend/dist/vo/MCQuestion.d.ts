import { Question } from "./Question.js";
export declare class MCQuestion extends Question {
    private correctAnswers;
    private wrongAnswers;
    constructor(id: number, question: string, correctAnswers: string[], wrongAnswers: string[]);
    getCorrectAnswers(): string[];
    setCorrectAnswers(correctAnswers: string[]): void;
    getWrongAnswers(): string[];
    setWrongAnswers(wrongAnswers: string[]): void;
}
//# sourceMappingURL=MCQuestion.d.ts.map