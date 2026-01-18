import { MCQuestion } from "../../../../vo/MCQuestion.js";
import { AnaswerOption } from "../../component/select/AnswerOption.js";
import { Option } from "../../component/select/Option.js";
import { SelectView } from "../../component/select/SelectView.js";
import { SelectViewHandler } from "../../component/select/SelectViewHandler.js";
import { QuestionEditorView } from "./QuestionEditorView.js";
export class MCQuestionEditorView extends QuestionEditorView {
    constructor() {
        super();
        this.questionContainer = null;
        this.answerSelectField = null;
        this.questionInputElement = null;
        this.parentElementId = null;
        this.removeQuestionButton = null;
        this.question = null;
        this.addAnswerButtonClickHandler = (addAnswerInputField) => { };
        this.removeQuestionClickHandler = () => { };
    }
    renderAnswers(question, answerSelectField) {
        this.question = question;
        let answers = [...question.getCorrectAnswers()];
        answers = answers.concat(question.getWrongAnswers());
        for (let i = 0; i < answers.length; i++) {
            let isCorrect = (i < question.getCorrectAnswers().length) ? true : false;
            answerSelectField.addOption(new AnaswerOption(isCorrect, answers[i], isCorrect));
        }
    }
    renderAddAnswerArea(answerContainerId) {
        let answerAreaElement = document.createElement("div");
        answerAreaElement.classList.add("d-flex", "justify-content-between", "align-items-center", "pe-1", "mt-2");
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
        addAnswerInputButton.addEventListener("click", () => {
            this.addAnswerButtonClickHandler(answerInputElement);
        });
        answerAreaElement.appendChild(addAnswerInputButton);
        document.getElementById(answerContainerId).appendChild(answerAreaElement);
    }
    render(question, parentElementId) {
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
        this.removeQuestionButton.addEventListener("click", () => {
            this.removeQuestionClickHandler();
        });
        questionHeaderElement.appendChild(this.removeQuestionButton);
        this.questionContainer.appendChild(questionHeaderElement);
        let answerContainer = document.createElement("div");
        answerContainer.id = this.questionContainer.id + "_answers";
        this.questionContainer.appendChild(answerContainer);
        this.parentElementId = parentElementId;
        let parentElement = document.getElementById(this.parentElementId);
        parentElement.appendChild(this.questionContainer);
        this.answerSelectField = new SelectViewHandler(new SelectView(), true, true);
        this.answerSelectField.render([], answerContainer.id);
        let addAnswerArea = document.createElement("div");
        addAnswerArea.id = "question_" + question.getId() + "_add";
        this.questionContainer.appendChild(addAnswerArea);
        this.renderAnswers(question, this.answerSelectField);
        this.renderAddAnswerArea(addAnswerArea.id);
    }
    remove() {
        this.questionContainer.remove();
    }
    addAnswer(text) {
        this.answerSelectField.addOption(new Option(false, text));
    }
    bindAddAnswerButton(clickHandler) {
        this.addAnswerButtonClickHandler = clickHandler;
    }
    bindRemoveQuestionButton(clickHandler) {
        this.removeQuestionClickHandler = clickHandler;
    }
    getOriginalQuestion() {
        return this.question;
    }
    getUpdatedQuestion() {
        let answers = this.answerSelectField.getOptions();
        let correctAnswers = [];
        let wrongAnswers = [];
        for (let answer of answers) {
            if (answer.getSelected()) {
                correctAnswers.push(answer.getContent());
            }
            else {
                wrongAnswers.push(answer.getContent());
            }
        }
        return new MCQuestion(this.question.getId(), this.questionInputElement.value, correctAnswers, wrongAnswers);
    }
}
//# sourceMappingURL=MCQuestionEditorView.js.map