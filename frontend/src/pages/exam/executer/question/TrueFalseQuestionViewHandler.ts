import { TrueFalseQuestion } from "../../../../vo/TrueFalseQuestion.js";
import { TrueFalseQuestionView } from "./TrueFalseQuestionView.js";

export class TrueFalseQuestionViewHandler
{
    private trueFalseQuestionView:TrueFalseQuestionView;
    private parentElementId:string|null = null;
    
    constructor(trueFalseQuestionView:TrueFalseQuestionView)
    {
        this.trueFalseQuestionView = trueFalseQuestionView;
    }

    render(question:TrueFalseQuestion, parentElementId:string):void
    {
        this.parentElementId = parentElementId;
        this.trueFalseQuestionView.render(question, this.parentElementId);
    }

    remove()
    {
        this.trueFalseQuestionView.remove();
    }
}
