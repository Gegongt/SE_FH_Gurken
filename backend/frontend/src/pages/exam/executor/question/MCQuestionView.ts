import { MCQuestion } from "../../../../vo/MCQuestion.js";
import { AnaswerOption } from "../../component/select/AnswerOption.js";
import { Option } from "../../component/select/Option.js";
import { SelectView } from "../../component/select/SelectView.js";
import { SelectViewHandler } from "../../component/select/SelectViewHandler.js";
import { QuestionState } from "./QuestionState.js";
import { QuestionView } from "./QuestionView.js";

export class MCQuestionView extends QuestionView
{
    private questionContainer:HTMLDivElement|null = null;
    private parentElementId:string|null = null;

    private answerSelectField:SelectViewHandler|null = null;

    constructor()
    {
        super();
    }

    renderAnswers(question:MCQuestion, answerSelectField:SelectViewHandler):string
    {
        /*
            To shuffle the answers, the following algorithm is used:
            There is an array containing all answers that are not
            yet included in the HTML code.
            
                answers = ["A", "B", "C", "D", "E"]

            An element from this array is selected - for example the element
            with the index 3 - using a random number generator. The answer
            choice with index 3 is then inserted into the HTML code and the
            corresponding entry in the answers array is removed.

                answers = ["A", "B", "C", "E"]

            This process is repeated until no answers remain. This is
            intended to prevent potential infinite loops.
        */

        let answers:string[] = [...question.getCorrectAnswers()];
        answers = answers.concat(question.getWrongAnswers());
        let options:Option[] = [];

        for(let i = 0; i < answers.length; i++)
        {
            let isCorrect:boolean = (i < question.getCorrectAnswers().length) ? true : false;
            options.push(new AnaswerOption(false, answers[i] as string, isCorrect));
        }

        let answersContainer = "";
        let numberOfAnswers = answers.length;

        for(let i = 0, answerIndex = Math.floor(Math.random() * (answers.length - i)); i < numberOfAnswers; i++, answerIndex = Math.floor(Math.random() * (answers.length - i)))
        {
            answerSelectField.addOption(options[answerIndex] as Option);
            options.splice(answerIndex, 1);
        }

        return answersContainer;
    }

    render(question:MCQuestion, parentElementId:string):void
    {
        this.questionContainer = document.createElement("div");
        this.questionContainer.id = "question_" + question.getId();
        this.questionContainer.classList.add("mt-3");

        this.questionContainer.innerHTML = `<p class = "m-0 questionText" id = "questionText_${question.getId()}">${question.getQuestion()}</p>`;
        this.parentElementId = parentElementId;
        let parentElement = document.getElementById(this.parentElementId);
        parentElement!.appendChild(this.questionContainer);

        this.answerSelectField = new SelectViewHandler(new SelectView(), false, true);        
        this.answerSelectField.render([], "question_" + question.getId());
        
        this.renderAnswers(question, this.answerSelectField);
    }

    remove():void
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

    getSelection():Option[]
    {
        return this.answerSelectField!.getSelection();
    }

    getOptions():Option[]
    {
        return this.answerSelectField!.getOptions();
    }
}
