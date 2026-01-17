import { MCQuestion } from "../../../../vo/MCQuestion.js";
import { AnaswerOption } from "../../component/select/AnswerOption.js";
import { Option } from "../../component/select/Option.js";
import { SelectView } from "../../component/select/SelectView.js";
import { SelectViewHandler } from "../../component/select/SelectViewHandler.js";
import { QuestionEditorView } from "./QuestionEditorView.js";

export class MCQuestionEditorView extends QuestionEditorView
{
    private questionContainer:HTMLDivElement|null = null;
    private answerSelectField:SelectViewHandler|null = null;
    private questionInputElement:HTMLInputElement|null = null;
    private parentElementId:string|null = null;
    private removeQuestionButton:HTMLButtonElement|null = null;

    private question:MCQuestion|null = null;

    private addAnswerButtonClickHandler:(addAnswerInputField:HTMLInputElement) => void = (addAnswerInputField:HTMLInputElement) => {};
    private removeQuestionClickHandler:() => void = () => {};

    constructor()
    {
        super();
    }

    renderAnswers(question:MCQuestion, answerSelectField:SelectViewHandler):void
    {
        this.question = question;

        let answers:string[] = [...question.getCorrectAnswers()];
        answers = answers.concat(question.getWrongAnswers());

        for(let i = 0; i < answers.length; i++)
        {
            let isCorrect:boolean = (i < question.getCorrectAnswers().length) ? true : false;
            answerSelectField.addOption(new AnaswerOption(isCorrect, answers[i] as string, isCorrect));
        }
    }

    renderAddAnswerArea(answerContainerId:string):void
    {
        let answerAreaElement = document.createElement("div");
        answerAreaElement.classList.add("d-flex", "justify-content-between", "align-items-center", "pe-1", "mt-2")
        
        let answerInputElementContainer = document.createElement("div");
        answerInputElementContainer.classList.add("col-9", "col-lg-10");

        let answerInputElement = document.createElement("input");
        answerInputElement.classList.add("form-control");
        answerInputElement.type = "text";
        answerInputElement.placeholder = "New answer ...";

        answerInputElementContainer.appendChild(answerInputElement);
        answerAreaElement.appendChild(answerInputElementContainer);

        let addAnswerInputButton = document.createElement("button");
        addAnswerInputButton.type = "button";
        addAnswerInputButton.innerHTML = `<i class="bi bi-plus-lg"></i>`;
        addAnswerInputButton.classList.add("btn", "btn-secondary", "p-2");

        addAnswerInputButton.addEventListener("click", () =>
        {
            this.addAnswerButtonClickHandler(answerInputElement);
        });

        answerAreaElement.appendChild(addAnswerInputButton);
        document.getElementById(answerContainerId)!.appendChild(answerAreaElement);
    }

    render(question:MCQuestion, parentElementId:string):void
    {
        this.questionContainer = document.createElement("div");
        this.questionContainer.id = "question_" + question.getId();
        this.questionContainer.classList.add("mt-3", "editorQuestionContainer");

        let questionHeaderElement = document.createElement("div");
        questionHeaderElement.classList.add("d-flex", "justify-content-between", "align-items-center", "pe-1");

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

        let answerContainer = document.createElement("div");
        answerContainer.id = this.questionContainer.id + "_answers";
        this.questionContainer.appendChild(answerContainer);
        
        this.parentElementId = parentElementId;
        let parentElement = document.getElementById(this.parentElementId);
        parentElement!.appendChild(this.questionContainer);

        this.answerSelectField = new SelectViewHandler(new SelectView(), true, true);        
        this.answerSelectField.render([], answerContainer.id);
        
        let addAnswerArea = document.createElement("div");
        addAnswerArea.id = "question_" + question.getId() + "_add";
        this.questionContainer.appendChild(addAnswerArea);

        this.renderAnswers(question, this.answerSelectField);
        this.renderAddAnswerArea(addAnswerArea.id);
    }

    remove():void
    {
        this.questionContainer!.remove();
    }

    addAnswer(text:string):void
    {
        this.answerSelectField!.addOption(new Option(false, text));
    }

    bindAddAnswerButton(clickHandler:(addAnswerInputField:HTMLInputElement) => void):void
    {
        this.addAnswerButtonClickHandler = clickHandler;
    }

    bindRemoveQuestionButton(clickHandler:() => void)
    {
        this.removeQuestionClickHandler = clickHandler;
    }

    getOriginalQuestion():MCQuestion|null
    {
        return this.question;
    }

    getUpdatedQuestion():MCQuestion
    {
        let answers = this.answerSelectField!.getOptions();

        let correctAnswers = [];
        let wrongAnswers = [];

        for(let answer of answers)
        {
            if(answer.getSelected())
            {
                correctAnswers.push(answer.getContent());
            }

            else
            {
                wrongAnswers.push(answer.getContent());
            }
        }

        return new MCQuestion(this.question!.getId(), this.questionInputElement!.value, correctAnswers, wrongAnswers);
    }
}
