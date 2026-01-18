import { QuestionState } from "./QuestionState.js";
export class MCQuestionViewHandler {
    constructor(mcQuestionEditorView) {
        this.question = null;
        this.parentElementId = null;
        this.mcQuestionView = mcQuestionEditorView;
    }
    render(question, parentElementId) {
        this.question = question;
        this.parentElementId = parentElementId;
        this.mcQuestionView.render(question, this.parentElementId);
    }
    remove() {
        this.mcQuestionView.remove();
    }
    isCorrect() {
        let options = this.mcQuestionView.getOptions();
        let isCorrect = true;
        for (let option of options) {
            if ((option.getSelected() && this.question.getWrongAnswers().includes(option.getContent())) ||
                (!option.getSelected() && this.question.getCorrectAnswers().includes(option.getContent()))) {
                isCorrect = false;
                break;
            }
        }
        return isCorrect;
    }
    showResult() {
        this.mcQuestionView.markQuestion(this.isCorrect() ? QuestionState.CORRECT : QuestionState.INCORRECT);
    }
    hideResult() {
        this.mcQuestionView.markQuestion(QuestionState.HIDDEN);
    }
}
//# sourceMappingURL=MCQuestionViewHandler.js.map