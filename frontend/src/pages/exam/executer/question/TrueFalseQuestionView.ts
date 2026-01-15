import { TrueFalseQuestion } from "../../../../vo/TrueFalseQuestion.js";
import { Option } from "../../component/select/Option.js";
import { SelectView } from "../../component/select/SelectView.js";
import { SelectViewHandler } from "../../component/select/SelectViewHandler.js";
import { QuestionView } from "./QuestionView.js";

export class TrueFalseQuestionView extends QuestionView
{
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
                                new Option(question.getIsTrue(), "True"),
                                new Option(!question.getIsTrue(), "False")
                            ];

        let answerSelectField = new SelectViewHandler(new SelectView(), false, false);
        answerSelectField.render(answerOptions, "question_" + question.getId());
    }

    remove()
    {
        this.questionContainer!.remove();
    }
}
