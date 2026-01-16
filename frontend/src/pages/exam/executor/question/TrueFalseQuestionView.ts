import { TrueFalseQuestion } from "../../../../vo/TrueFalseQuestion.js";
import { Option } from "../../component/select/Option.js";
import { SelectView } from "../../component/select/SelectView.js";
import { SelectViewHandler } from "../../component/select/SelectViewHandler.js";
import { QuestionState } from "./QuestionState.js";
import { QuestionView } from "./QuestionView.js";

export class TrueFalseQuestionView extends QuestionView
{
    private answerSelectField:SelectViewHandler|null = null;

    private questionContainer:HTMLDivElement|null = null;
    private parentElementId:string|null = null;

    constructor()
    {
        super();
    }

    render(question:TrueFalseQuestion, parentElementId:string):void
    {
        this.questionContainer = document.createElement("div");
        this.questionContainer.id = "question_" + question.getId();

        this.questionContainer.innerHTML = `<p id = "questionText_${question.getId()}">${question.getQuestion()}</p>`;

        this.parentElementId = parentElementId;
        let parentElement = document.getElementById(this.parentElementId);
        parentElement!.appendChild(this.questionContainer);

        let answerOptions = [
                                new Option(false, "True"),
                                new Option(false, "False")
                            ];

        this.answerSelectField = new SelectViewHandler(new SelectView(), false, false);
        this.answerSelectField.render(answerOptions, "question_" + question.getId());
    }

    remove()
    {
        this.questionContainer!.remove();
    }

    markQuestion(state:QuestionState):void
    {
        switch(state)
        {
            case QuestionState.HIDDEN:
                this.questionContainer!.classList.remove("incorrectQuestion", "correctQuestion");
                break;

            case QuestionState.CORRECT:
                this.questionContainer!.classList.remove("incorrectQuestion");
                this.questionContainer!.classList.add("correctQuestion");
                break;

            case QuestionState.INCORRECT:
                this.questionContainer!.classList.remove("correctQuestion");
                this.questionContainer!.classList.add("incorrectQuestion");
                break;
        }
    }

    getSelection():boolean|null
    {
        let selection:Option[] = this.answerSelectField!.getSelection();

        if(selection.length > 0) //checking whether a selection has been made
        {
            return selection[0]!.getContent() === "True";
        }

        return null;
    }

    getOptions():Option[]
    {
        return this.answerSelectField!.getOptions();
    }
}
