import { MCQuestion } from "../../../../vo/MCQuestion.js";
import { SelectViewHandler } from "../../component/select/SelectViewHandler.js";
import { QuestionEditorView } from "./QuestionEditorView.js";
export declare class MCQuestionEditorView extends QuestionEditorView {
    private questionContainer;
    private answerSelectField;
    private questionInputElement;
    private parentElementId;
    private removeQuestionButton;
    private question;
    private addAnswerButtonClickHandler;
    private removeQuestionClickHandler;
    constructor();
    renderAnswers(question: MCQuestion, answerSelectField: SelectViewHandler): void;
    renderAddAnswerArea(answerContainerId: string): void;
    render(question: MCQuestion, parentElementId: string): void;
    remove(): void;
    addAnswer(text: string): void;
    bindAddAnswerButton(clickHandler: (addAnswerInputField: HTMLInputElement) => void): void;
    bindRemoveQuestionButton(clickHandler: () => void): void;
    getOriginalQuestion(): MCQuestion | null;
    getUpdatedQuestion(): MCQuestion;
}
//# sourceMappingURL=MCQuestionEditorView.d.ts.map