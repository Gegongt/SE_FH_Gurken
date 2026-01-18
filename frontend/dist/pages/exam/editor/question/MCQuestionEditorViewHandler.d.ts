import { MCQuestion } from "../../../../vo/MCQuestion.js";
import { MCQuestionEditorView } from "./MCQuestionEditorView.js";
export declare class MCQuestionEditorViewHandler {
    private mcQuestionEditorView;
    private parentElementId;
    private removed;
    constructor(mcQuestionEditorView: MCQuestionEditorView);
    render(question: MCQuestion, parentElementId: string): void;
    remove(): void;
    isRemoved(): boolean;
    getOriginalQuestion(): MCQuestion | null;
    getUpdatedQuestion(): MCQuestion | null;
}
//# sourceMappingURL=MCQuestionEditorViewHandler.d.ts.map