import { TrueFalseQuestion } from "../../../../vo/TrueFalseQuestion.js";
import { TrueFalseQuestionEditorView } from "./TrueFalseQuestionEditorView.js";

export class TrueFalseQuestionEditorViewHandler
{
    private trueFalseQuestionEditorView:TrueFalseQuestionEditorView;
    private parentElementId:string|null = null;
    
    constructor(trueFalseQuestionEditorView:TrueFalseQuestionEditorView)
    {
        this.trueFalseQuestionEditorView = trueFalseQuestionEditorView;
    }

    render(question:TrueFalseQuestion, parentElementId:string):void
    {
        this.parentElementId = parentElementId;
        this.trueFalseQuestionEditorView.render(question, this.parentElementId);
    }
}