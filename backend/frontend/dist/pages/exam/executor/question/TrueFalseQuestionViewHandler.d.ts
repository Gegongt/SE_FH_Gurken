import { TrueFalseQuestion } from "../../../../vo/TrueFalseQuestion.js";
import { TrueFalseQuestionView } from "./TrueFalseQuestionView.js";
export declare class TrueFalseQuestionViewHandler {
    private question;
    private trueFalseQuestionView;
    private parentElementId;
    constructor(trueFalseQuestionView: TrueFalseQuestionView);
    render(question: TrueFalseQuestion, parentElementId: string): void;
    remove(): void;
    isCorrect(): boolean;
    showResult(): void;
    hideResult(): void;
}
//# sourceMappingURL=TrueFalseQuestionViewHandler.d.ts.map