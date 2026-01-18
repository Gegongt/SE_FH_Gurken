import { TrueFalseQuestion } from "../../../../vo/TrueFalseQuestion.js";
import { QuestionEditorView } from "./QuestionEditorView.js";
export declare class TrueFalseQuestionEditorView extends QuestionEditorView {
    private questionContainer;
    private parentElementId;
    private questionInputElement;
    private answerSelectField;
    private removeQuestionButton;
    private question;
    private removeQuestionClickHandler;
    constructor();
    render(question: TrueFalseQuestion, parentElementId: string): void;
    remove(): void;
    getOriginalQuestion(): TrueFalseQuestion | null;
    getUpdatedQuestion(): TrueFalseQuestion;
    bindRemoveQuestionButton(clickHandler: () => void): void;
}
//# sourceMappingURL=TrueFalseQuestionEditorView.d.ts.map