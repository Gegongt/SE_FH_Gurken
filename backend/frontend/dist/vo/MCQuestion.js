import { Question } from "./Question.js";
export class MCQuestion extends Question {
    constructor(id, question, correctAnswers, wrongAnswers) {
        super(id, question);
        this.correctAnswers = correctAnswers;
        this.wrongAnswers = wrongAnswers;
    }
    getCorrectAnswers() {
        return this.correctAnswers;
    }
    setCorrectAnswers(correctAnswers) {
        this.correctAnswers = correctAnswers;
    }
    getWrongAnswers() {
        return this.wrongAnswers;
    }
    setWrongAnswers(wrongAnswers) {
        this.wrongAnswers = wrongAnswers;
    }
}
//# sourceMappingURL=MCQuestion.js.map