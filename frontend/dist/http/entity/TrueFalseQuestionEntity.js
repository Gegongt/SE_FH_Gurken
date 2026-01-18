import { QuestionEntity } from "./QuestionEntity.js";
export class TrueFalseQuestionEntity extends QuestionEntity {
    constructor(id, examid, question, questiontype, istrue) {
        super(id, examid, question, questiontype);
        this.istrue = istrue;
    }
}
//# sourceMappingURL=TrueFalseQuestionEntity.js.map