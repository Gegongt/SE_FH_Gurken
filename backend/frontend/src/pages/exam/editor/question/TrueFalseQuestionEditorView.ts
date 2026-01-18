import { TrueFalseQuestion } from "../../../../vo/TrueFalseQuestion.js";
import { Option } from "../../component/select/Option.js";
import { SelectView } from "../../component/select/SelectView.js";
import { SelectViewHandler } from "../../component/select/SelectViewHandler.js";
import { QuestionEditorView } from "./QuestionEditorView.js";

export class TrueFalseQuestionEditorView extends QuestionEditorView
{
    private questionContainer:HTMLDivElement|null = null;
    private parentElementId:string|null = null;
    private questionInputElement:HTMLInputElement|null = null;
    private answerSelectField:SelectViewHandler|null = null;
    private removeQuestionButton:HTMLButtonElement|null = null;

    private question:TrueFalseQuestion|null = null;

    private removeQuestionClickHandler:() => void = () => {};

    constructor()
    {
        super();
    }

    render(question:TrueFalseQuestion, parentElementId:string):void
    {
        this.question = question;

        this.questionContainer = document.createElement("div");
        this.questionContainer.id = "question_" + question.getId();
        this.questionContainer.classList.add("mt-3", "editorQuestionContainer");

        let questionHeaderElement = document.createElement("div");
        questionHeaderElement.classList.add("d-flex", "justify-content-between", "align-items-center", "pe-1", "mt-2");

        let questionInputElementContainer = document.createElement("div");
        questionInputElementContainer.classList.add("col-9", "col-lg-10");

        this.questionInputElement = document.createElement("input");
        this.questionInputElement.classList.add("form-control");
        this.questionInputElement.type = "text";
        this.questionInputElement.value = question.getQuestion();

        questionInputElementContainer.appendChild(this.questionInputElement);
        questionHeaderElement.appendChild(questionInputElementContainer);

        this.removeQuestionButton = document.createElement("button");
        this.removeQuestionButton.type = "button";
        this.removeQuestionButton.innerHTML = `<i class = "bi bi-trash-fill"></i></button>`;
        this.removeQuestionButton.classList.add("btn", "btn-secondary", "p-2");

        this.removeQuestionButton.addEventListener("click", () =>
        {
            this.removeQuestionClickHandler();
        });

        questionHeaderElement.appendChild(this.removeQuestionButton);

        this.questionContainer.appendChild(questionHeaderElement);
        
        this.parentElementId = parentElementId;
        let parentElement = document.getElementById(this.parentElementId);
        parentElement!.appendChild(this.questionContainer);

        let answerOptions = [
                                new Option(question.getIsTrue(), "True"),
                                new Option(!question.getIsTrue(), "False")
                            ];

        this.answerSelectField = new SelectViewHandler(new SelectView(), false, false);
        this.answerSelectField.render(answerOptions, "question_" + question.getId());
    }

    remove()
    {
        this.questionContainer!.remove();
    }

    getOriginalQuestion():TrueFalseQuestion|null
    {
        return this.question;
    }

    getUpdatedQuestion():TrueFalseQuestion
    {
        let isTrue:boolean = this.answerSelectField!.getOptions()[0]!.getSelected(); //Checking if the true option is selected

        return new TrueFalseQuestion(this.question!.getId(), this.questionInputElement!.value, isTrue)
    }

    bindRemoveQuestionButton(clickHandler:() => void)
    {
        this.removeQuestionClickHandler = clickHandler;
    }
}
