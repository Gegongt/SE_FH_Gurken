import { QuestionEntity } from "./QuestionEntity.js";
import { QuestionEntityType } from "./QuestionEntityType.js";
export declare class TrueFalseQuestionEntity extends QuestionEntity {
    istrue: boolean;
    constructor(id: number, examid: number, question: string, questiontype: QuestionEntityType, istrue: boolean);
}
//# sourceMappingURL=TrueFalseQuestionEntity.d.ts.map