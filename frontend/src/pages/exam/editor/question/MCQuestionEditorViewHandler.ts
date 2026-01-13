import { MCQuestion } from "../../../../vo/MCQuestion.js";
import { MCQuestionEditorView } from "./MCQuestionEditorView.js";

export class MCQuestionEditorViewHandler
{
    private mcQuestionEditorView:MCQuestionEditorView;
    private parentElementId:string|null = null;
    
    constructor(mcQuestionEditorView:MCQuestionEditorView)
    {
        this.mcQuestionEditorView = mcQuestionEditorView;
    }

    render(question:MCQuestion, parentElementId:string):void
    {
        this.parentElementId = parentElementId;
        this.mcQuestionEditorView.render(question, this.parentElementId);
    }
}
