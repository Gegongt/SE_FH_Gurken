import { TrueFalseQuestion } from "../../../../vo/TrueFalseQuestion.js";
import { QuestionEditorView } from "./QuestionEditorView.js";

export class TrueFalseQuestionEditorView extends QuestionEditorView
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

        this.questionContainer.innerHTML = `
            <p id = "questionText_${question.getId()}">${question.getQuestion()}</p>
            
            <div class="form-check">
                <input class = "form-check-input" type = "radio" name = "answer_${question.getId()}" id = "answer_${question.getId()}_true">
                <label class = "form-check-label" for = "answer_${question.getId()}_true">True</label>
            </div>

            <div class = "form-check">
                <input class = "form-check-input" type = "radio" name = "answer_${question.getId()}" id = "answer_${question.getId()}_false" checked>
                <label class = "form-check-label" for = "answer_${question.getId()}_false">False</label>
            </div>`;

        this.parentElementId = parentElementId;
        let parentElement = document.getElementById(this.parentElementId);
        parentElement?.appendChild(this.questionContainer);
    }
}
