import { MCQuestion } from "../../../../vo/MCQuestion.js";
import { QuestionEditorView } from "./QuestionEditorView.js";

export class MCQuestionEditorView extends QuestionEditorView
{
    private questionContainer:HTMLDivElement|null = null;
    private parentElementId:string|null = null;

    constructor()
    {
        super();
    }

    //TODO: Die Antwortmöglichkeiten sollen in einem selbst erstellten HTML-Element enthalten sein,
    //      nicht in einer Checkbox. Damit soll sichergestellt werden, dass das Design auch mit einem
    //      zusätzlichen Delete BUtton schön ist.
    renderAnswers(question:MCQuestion):string
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

        let answers = [...question.getCorrectAnswers()];
        answers = answers.concat(question.getWrongAnswers());

        let answersContainer = "";
        let numberOfAnswers = answers.length;

        for(let i = 0, answerIndex = Math.floor(Math.random() * answers.length); i < numberOfAnswers; i++, answerIndex = Math.floor(Math.random() * answers.length))
        {
            answersContainer = answersContainer + `
                <div class = "form-check">
                    <input class = "form-check-input" type = "checkbox" name = "answer_${question.getId()}_${i}" />    
                    <label class = "form-check-label" for = "answer_${question.getId()}_${i}">
                        ${answers[answerIndex]}
                    </label>
                </div>`;
            
            answers.splice(answerIndex, 1);
        }

        return answersContainer;
    }

    render(question:MCQuestion, parentElementId:string):void
    {
        this.questionContainer = document.createElement("div");
        this.questionContainer.id = "question_" + question.getId();

        this.questionContainer.innerHTML = `<p id = "questionText_${question.getId()}">${question.getQuestion()}</p>` +
                                      this.renderAnswers(question);


        this.parentElementId = parentElementId;
        let parentElement = document.getElementById(this.parentElementId);
        parentElement?.appendChild(this.questionContainer);
    }
}
