import { MCQuestion } from "../../../../vo/MCQuestion.js";
import { Option } from "../../component/select/Option.js";
import { SelectViewHandler } from "../../component/select/SelectViewHandler.js";
import { QuestionState } from "./QuestionState.js";
import { QuestionView } from "./QuestionView.js";
export declare class MCQuestionView extends QuestionView {
    private questionContainer;
    private parentElementId;
    private answerSelectField;
    constructor();
    renderAnswers(question: MCQuestion, answerSelectField: SelectViewHandler): string;
    render(question: MCQuestion, parentElementId: string): void;
    remove(): void;
    markQuestion(state: QuestionState): void;
    getSelection(): Option[];
    getOptions(): Option[];
}
//# sourceMappingURL=MCQuestionView.d.ts.map