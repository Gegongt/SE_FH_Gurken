import { MCQuestion } from "../../../../vo/MCQuestion.js";
import { MCQuestionView } from "./MCQuestionView.js";
export declare class MCQuestionViewHandler {
    private question;
    private mcQuestionView;
    private parentElementId;
    constructor(mcQuestionEditorView: MCQuestionView);
    render(question: MCQuestion, parentElementId: string): void;
    remove(): void;
    isCorrect(): boolean;
    showResult(): void;
    hideResult(): void;
}
//# sourceMappingURL=MCQuestionViewHandler.d.ts.map