import { TrueFalseQuestion } from "../../../../vo/TrueFalseQuestion.js";
import { TrueFalseQuestionEditorView } from "./TrueFalseQuestionEditorView.js";
export declare class TrueFalseQuestionEditorViewHandler {
    private trueFalseQuestionEditorView;
    private parentElementId;
    private removed;
    constructor(trueFalseQuestionEditorView: TrueFalseQuestionEditorView);
    render(question: TrueFalseQuestion, parentElementId: string): void;
    remove(): void;
    getOriginalQuestion(): TrueFalseQuestion | null;
    getUpdatedQuestion(): TrueFalseQuestion | null;
}
//# sourceMappingURL=TrueFalseQuestionEditorViewHandler.d.ts.map