import { Question } from "./Question.js";
export class TrueFalseQuestion extends Question {
    constructor(id, question, isTrue) {
        super(id, question);
        this.isTrue = isTrue;
    }
    getIsTrue() {
        return this.isTrue;
    }
    setIsTrue(isTrue) {
        this.isTrue = isTrue;
    }
}
//# sourceMappingURL=TrueFalseQuestion.js.map