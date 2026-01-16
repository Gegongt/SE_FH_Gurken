import { TrueFalseQuestion } from "../../../../vo/TrueFalseQuestion.js";
import { TrueFalseQuestionEditorView } from "./TrueFalseQuestionEditorView.js";

export class TrueFalseQuestionEditorViewHandler
{
    private trueFalseQuestionEditorView:TrueFalseQuestionEditorView;
    private parentElementId:string|null = null;

    private removed:boolean = false;
    
    constructor(trueFalseQuestionEditorView:TrueFalseQuestionEditorView)
    {
        this.trueFalseQuestionEditorView = trueFalseQuestionEditorView;
    }

    render(question:TrueFalseQuestion, parentElementId:string):void
    {
        this.parentElementId = parentElementId;

        this.trueFalseQuestionEditorView.bindRemoveQuestionButton(() =>
        {
            this.remove();
        });

        this.trueFalseQuestionEditorView.render(question, this.parentElementId);
    }

    remove()
    {
        this.removed = true;
        this.trueFalseQuestionEditorView.remove();
    }

    getOriginalQuestion():TrueFalseQuestion|null
    {
        return this.trueFalseQuestionEditorView.getOriginalQuestion();
    }

    getUpdatedQuestion():TrueFalseQuestion|null
    {
        if(!this.removed)
        {
            return this.trueFalseQuestionEditorView.getUpdatedQuestion();
        }

        else
        {
            return null;
        }
    }
}
