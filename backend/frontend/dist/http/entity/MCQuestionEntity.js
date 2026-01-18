import { QuestionEntity } from "./QuestionEntity.js";
export class MCQuestionEntity extends QuestionEntity {
    constructor(id, examid, question, questiontype, correctanswers, wronganswers) {
        super(id, examid, question, questiontype);
        this.correctanswers = correctanswers;
        this.wronganswers = wronganswers;
    }
}
//# sourceMappingURL=MCQuestionEntity.js.map