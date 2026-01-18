import { TrueFalseQuestion } from "../../../../vo/TrueFalseQuestion.js";
import { Option } from "../../component/select/Option.js";
import { QuestionState } from "./QuestionState.js";
import { QuestionView } from "./QuestionView.js";
export declare class TrueFalseQuestionView extends QuestionView {
    private answerSelectField;
    private questionContainer;
    private parentElementId;
    constructor();
    render(question: TrueFalseQuestion, parentElementId: string): void;
    remove(): void;
    markQuestion(state: QuestionState): void;
    getSelection(): boolean | null;
    getOptions(): Option[];
}
//# sourceMappingURL=TrueFalseQuestionView.d.ts.map