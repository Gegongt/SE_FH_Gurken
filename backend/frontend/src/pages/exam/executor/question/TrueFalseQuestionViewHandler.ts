import { TrueFalseQuestion } from "../../../../vo/TrueFalseQuestion.js";
import { QuestionState } from "./QuestionState.js";
import { TrueFalseQuestionView } from "./TrueFalseQuestionView.js";

export class TrueFalseQuestionViewHandler
{
    private question:TrueFalseQuestion|null = null;

    private trueFalseQuestionView:TrueFalseQuestionView;
    private parentElementId:string|null = null;
    
    constructor(trueFalseQuestionView:TrueFalseQuestionView)
    {
        this.trueFalseQuestionView = trueFalseQuestionView;
    }

    render(question:TrueFalseQuestion, parentElementId:string):void
    {
        this.question = question;
        this.parentElementId = parentElementId;
        this.trueFalseQuestionView.render(question, this.parentElementId);
    }

    remove():void
    {
        this.trueFalseQuestionView.remove();
    }

    isCorrect():boolean
    {
        let selection:boolean|null = this.trueFalseQuestionView.getSelection();
    
        return selection === this.question!.getIsTrue()
    }

    showResult():void
    {
        this.trueFalseQuestionView.markQuestion(this.isCorrect() ? QuestionState.CORRECT : QuestionState.INCORRECT);
    }

    hideResult():void
    {
        this.trueFalseQuestionView.markQuestion(QuestionState.HIDDEN);
    }
}
