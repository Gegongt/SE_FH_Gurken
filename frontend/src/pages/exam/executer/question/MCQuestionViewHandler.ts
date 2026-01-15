import { MCQuestion } from "../../../../vo/MCQuestion.js";
import { MCQuestionView } from "./MCQuestionView.js";

export class MCQuestionViewHandler
{
    private mcQuestionView:MCQuestionView;
    private parentElementId:string|null = null;
    
    constructor(mcQuestionEditorView:MCQuestionView)
    {
        this.mcQuestionView = mcQuestionEditorView;
    }

    render(question:MCQuestion, parentElementId:string):void
    {
        this.parentElementId = parentElementId;
        this.mcQuestionView.render(question, this.parentElementId);
    }

    remove()
    {
        this.mcQuestionView.remove();
    }
}
