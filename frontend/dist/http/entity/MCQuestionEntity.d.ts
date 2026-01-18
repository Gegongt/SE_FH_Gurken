import { QuestionEntity } from "./QuestionEntity.js";
import { QuestionEntityType } from "./QuestionEntityType.js";
export declare class MCQuestionEntity extends QuestionEntity {
    correctanswers: string[];
    wronganswers: string[];
    constructor(id: number, examid: number, question: string, questiontype: QuestionEntityType, correctanswers: string[], wronganswers: string[]);
}
//# sourceMappingURL=MCQuestionEntity.d.ts.map