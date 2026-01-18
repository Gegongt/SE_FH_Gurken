import { MCQuestion } from "../../../../vo/MCQuestion.js";
import { Option } from "../../component/select/Option.js";
import { MCQuestionView } from "./MCQuestionView.js";
import { QuestionState } from "./QuestionState.js";

export class MCQuestionViewHandler
{
    private question:MCQuestion|null = null;

    private mcQuestionView:MCQuestionView;
    private parentElementId:string|null = null;
    
    constructor(mcQuestionEditorView:MCQuestionView)
    {
        this.mcQuestionView = mcQuestionEditorView;
    }

    render(question:MCQuestion, parentElementId:string):void
    {
        this.question = question;
        this.parentElementId = parentElementId;
        this.mcQuestionView.render(question, this.parentElementId);
    }

    remove():void
    {
        this.mcQuestionView.remove();
    }

    isCorrect():boolean
    {
        let options:Option[] = this.mcQuestionView.getOptions();
        let isCorrect:boolean = true;

        for(let option of options)
        {
            if((option.getSelected() && this.question!.getWrongAnswers().includes(option.getContent())) ||
               (!option.getSelected() && this.question!.getCorrectAnswers().includes(option.getContent())))
            {
                isCorrect = false;
                break;
            }
        }

        return isCorrect;
    }

    showResult():void
    {
        this.mcQuestionView.markQuestion(this.isCorrect() ? QuestionState.CORRECT : QuestionState.INCORRECT);
    }

    hideResult():void
    {
        this.mcQuestionView.markQuestion(QuestionState.HIDDEN);
    }
}
