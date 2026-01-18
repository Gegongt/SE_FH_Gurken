import { TrueFalseQuestion } from "../../../../vo/TrueFalseQuestion.js";
import { Option } from "../../component/select/Option.js";
import { SelectView } from "../../component/select/SelectView.js";
import { SelectViewHandler } from "../../component/select/SelectViewHandler.js";
import { QuestionEditorView } from "./QuestionEditorView.js";
export class TrueFalseQuestionEditorView extends QuestionEditorView {
    constructor() {
        super();
        this.questionContainer = null;
        this.parentElementId = null;
        this.questionInputElement = null;
        this.answerSelectField = null;
        this.removeQuestionButton = null;
        this.question = null;
        this.removeQuestionClickHandler = () => { };
    }
    render(question, parentElementId) {
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
        this.removeQuestionButton.addEventListener("click", () => {
            this.removeQuestionClickHandler();
        });
        questionHeaderElement.appendChild(this.removeQuestionButton);
        this.questionContainer.appendChild(questionHeaderElement);
        this.parentElementId = parentElementId;
        let parentElement = document.getElementById(this.parentElementId);
        parentElement.appendChild(this.questionContainer);
        let answerOptions = [
            new Option(question.getIsTrue(), "True"),
            new Option(!question.getIsTrue(), "False")
        ];
        this.answerSelectField = new SelectViewHandler(new SelectView(), false, false);
        this.answerSelectField.render(answerOptions, "question_" + question.getId());
    }
    remove() {
        this.questionContainer.remove();
    }
    getOriginalQuestion() {
        return this.question;
    }
    getUpdatedQuestion() {
        let isTrue = this.answerSelectField.getOptions()[0].getSelected(); //Checking if the true option is selected
        return new TrueFalseQuestion(this.question.getId(), this.questionInputElement.value, isTrue);
    }
    bindRemoveQuestionButton(clickHandler) {
        this.removeQuestionClickHandler = clickHandler;
    }
}
//# sourceMappingURL=TrueFalseQuestionEditorView.js.map