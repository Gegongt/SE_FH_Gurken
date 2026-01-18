import { serviceFactory } from "../../../service/factory/ServiceFactory.js";
import { ServiceName } from "../../../service/factory/ServiceName.js";
import { locationUtil } from "../../../util/LocationUtil.js";
import { urlUtil } from "../../../util/URLUtil.js";
import { Exam } from "../../../vo/Exam.js";
import { MCQuestion } from "../../../vo/MCQuestion.js";
import { TrueFalseQuestion } from "../../../vo/TrueFalseQuestion.js";
import { HeaderView } from "../../components/header/HeaderView.js";
import { HeaderViewHandler } from "../../components/header/HeaderViewHandler.js";
import { MCQuestionEditorView } from "./question/MCQuestionEditorView.js";
import { MCQuestionEditorViewHandler } from "./question/MCQuestionEditorViewHandler.js";
import { TrueFalseQuestionEditorView } from "./question/TrueFalseQuestionEditorView.js";
import { TrueFalseQuestionEditorViewHandler } from "./question/TrueFalseQuestionEditorViewHandler.js";
let nextNewQuestionId = -1;
function saveExam(exam, nameInputElement, questionEditorViewHandlers) {
    exam.setName(nameInputElement.value);
    let questions = [];
    for (let questionEditorViewHandler of questionEditorViewHandlers) {
        let updatedQuestion = questionEditorViewHandler.getUpdatedQuestion();
        if (updatedQuestion) {
            questions.push(updatedQuestion);
        }
    }
    exam.setQuestions(questions);
    if (exam.getId() < 0) {
        let subcategoryId = Number(urlUtil.getParam("subcategoryId"));
        serviceFactory.getService(ServiceName.EXAM).createExam(exam, subcategoryId, (id) => {
            console.log(id);
            locationUtil.redirectToMainPage();
        }, (error) => {
            console.log("Error: " + error);
            locationUtil.redirectToMainPage();
        });
    }
    else {
        serviceFactory.getService(ServiceName.EXAM).updateExam(exam, () => {
            locationUtil.redirectToMainPage();
        }, (error) => {
            console.log("Error: " + error);
            locationUtil.redirectToMainPage();
        });
    }
}
function deleteExam(exam) {
    serviceFactory.getService(ServiceName.EXAM).deleteExam(exam.getId(), () => { locationUtil.redirectToMainPage(); }, (error) => { locationUtil.redirectToMainPage(); });
}
function addTrueFalseQuestion(question, questionEditorViewHandlers) {
    let trueFalseQuestionEditorViewHandler = new TrueFalseQuestionEditorViewHandler(new TrueFalseQuestionEditorView());
    trueFalseQuestionEditorViewHandler.render(question ? question : new TrueFalseQuestion(nextNewQuestionId--, "", true), "questions");
    questionEditorViewHandlers.push(trueFalseQuestionEditorViewHandler);
}
function addMCQuestion(question, questionEditorViewHandlers) {
    let mcQuestionEditorViewHandler = new MCQuestionEditorViewHandler(new MCQuestionEditorView());
    mcQuestionEditorViewHandler.render(question ? question : new MCQuestion(nextNewQuestionId--, "", [], []), "questions");
    questionEditorViewHandlers.push(mcQuestionEditorViewHandler);
}
function loadPage(exam) {
    document.getElementById("mainArea").hidden = false;
    let headerViewHandler = new HeaderViewHandler(new HeaderView());
    headerViewHandler.render("header");
    const nameInputElement = document.getElementById("nameInput");
    nameInputElement.value = exam.getName();
    nameInputElement.disabled = false;
    const questionEditorViewHandlers = [];
    for (let question of exam.getQuestions()) {
        if (question instanceof TrueFalseQuestion) {
            addTrueFalseQuestion(question, questionEditorViewHandlers);
        }
        else if (question instanceof MCQuestion) {
            addMCQuestion(question, questionEditorViewHandlers);
        }
    }
    const operationsElement = document.getElementById("operations");
    operationsElement.hidden = false;
    const addMCQuestionButton = document.getElementById("addMCQuestionButton");
    addMCQuestionButton.addEventListener("click", () => {
        addMCQuestion(null, questionEditorViewHandlers);
    });
    const addTrueFalseQuestionButton = document.getElementById("addTrueFalseQuestionButton");
    addTrueFalseQuestionButton.addEventListener("click", () => {
        addTrueFalseQuestion(null, questionEditorViewHandlers);
    });
    const cancelButton = document.getElementById("cancelButton");
    cancelButton.addEventListener("click", () => {
        locationUtil.redirectToMainPage();
    });
    const saveButton = document.getElementById("saveButton");
    const deleteButton = document.getElementById("deleteButton");
    saveButton.addEventListener("click", () => {
        saveButton.disabled = true;
        deleteButton.disabled = true;
        saveExam(exam, nameInputElement, questionEditorViewHandlers);
    });
    deleteButton.addEventListener("click", () => {
        saveButton.disabled = true;
        deleteButton.disabled = true;
        deleteExam(exam);
    });
    if (exam.getId() !== -1) {
        deleteButton.hidden = false;
    }
}
serviceFactory.getService(ServiceName.USER).getCurrentUser((user) => {
    if (user === null) {
        locationUtil.redirectToLoginPage();
    }
    const examId = Number(urlUtil.getParam("examId"));
    if (!examId) //a new exam is being created
     {
        loadPage(new Exam(-1, "", [], user));
    }
    else {
        serviceFactory.getService(ServiceName.EXAM).getExam(examId, (exam) => {
            loadPage(exam);
        }, (error) => {
            console.log("Error: " + error);
            locationUtil.redirectToMainPage();
        });
    }
}, (error) => {
    console.log("Error: " + error);
    locationUtil.redirectToMainPage();
});
//# sourceMappingURL=examEditor.js.map