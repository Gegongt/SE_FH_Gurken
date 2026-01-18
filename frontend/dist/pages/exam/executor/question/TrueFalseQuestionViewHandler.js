import { QuestionState } from "./QuestionState.js";
export class TrueFalseQuestionViewHandler {
    constructor(trueFalseQuestionView) {
        this.question = null;
        this.parentElementId = null;
        this.trueFalseQuestionView = trueFalseQuestionView;
    }
    render(question, parentElementId) {
        this.question = question;
        this.parentElementId = parentElementId;
        this.trueFalseQuestionView.render(question, this.parentElementId);
    }
    remove() {
        this.trueFalseQuestionView.remove();
    }
    isCorrect() {
        let selection = this.trueFalseQuestionView.getSelection();
        return selection === this.question.getIsTrue();
    }
    showResult() {
        this.trueFalseQuestionView.markQuestion(this.isCorrect() ? QuestionState.CORRECT : QuestionState.INCORRECT);
    }
    hideResult() {
        this.trueFalseQuestionView.markQuestion(QuestionState.HIDDEN);
    }
}
//# sourceMappingURL=TrueFalseQuestionViewHandler.js.map