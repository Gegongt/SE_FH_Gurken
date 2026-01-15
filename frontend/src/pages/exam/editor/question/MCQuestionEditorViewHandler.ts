import { MCQuestion } from "../../../../vo/MCQuestion.js";
import { MCQuestionEditorView } from "./MCQuestionEditorView.js";

export class MCQuestionEditorViewHandler
{
    private mcQuestionEditorView:MCQuestionEditorView;
    private parentElementId:string|null = null;
 
    private removed:boolean = false;

    constructor(mcQuestionEditorView:MCQuestionEditorView)
    {
        this.mcQuestionEditorView = mcQuestionEditorView;
    }

    render(question:MCQuestion, parentElementId:string):void
    {
        this.parentElementId = parentElementId;
        this.mcQuestionEditorView.bindAddAnswerButton((addAnswerInputField:HTMLInputElement) =>
        {
            let answerText = addAnswerInputField.value;

            if(answerText) //should not be empty
            {
                this.mcQuestionEditorView.addAnswer(answerText);
                addAnswerInputField.value = "";
            }
        });

        this.mcQuestionEditorView.bindRemoveQuestionButton(() =>
        {
            this.remove();
        });

        this.mcQuestionEditorView.render(question, this.parentElementId);
    }

    remove():void
    {
        this.removed = true;
        this.mcQuestionEditorView.remove();
    }

    isRemoved():boolean
    {
        return this.removed;
    }

    getOriginalQuestion():MCQuestion|null
    {
        return this.mcQuestionEditorView.getOriginalQuestion();
    }

    getUpdatedQuestion():MCQuestion|null
    {
        if(!this.removed)
        {
            return this.mcQuestionEditorView.getUpdatedQuestion();
        }

        else
        {
            return null;
        }
    }
}
