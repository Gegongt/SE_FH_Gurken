import { serviceFactory } from "../../../service/factory/ServiceFactory.js";
import { ServiceName } from "../../../service/factory/ServiceName.js";
import { locationUtil } from "../../../util/LocationUtil.js";
import { urlUtil } from "../../../util/URLUtil.js";
import { MCQuestion } from "../../../vo/MCQuestion.js";
import { TrueFalseQuestion } from "../../../vo/TrueFalseQuestion.js";
import { HeaderView } from "../../components/header/HeaderView.js";
import { HeaderViewHandler } from "../../components/header/HeaderViewHandler.js";
import { MCQuestionView } from "./question/MCQuestionView.js";
import { MCQuestionViewHandler } from "./question/MCQuestionViewHandler.js";
import { TrueFalseQuestionView } from "./question/TrueFalseQuestionView.js";
import { TrueFalseQuestionViewHandler } from "./question/TrueFalseQuestionViewHandler.js";
function showResults(questionViewHandlers, resultsArea) {
    let numberOfCorrectQuestions = 0;
    let numberOfIncorrectQuestions = 0;
    for (let questionViewHandler of questionViewHandlers) {
        if (questionViewHandler.isCorrect()) {
            numberOfCorrectQuestions++;
        }
        else {
            numberOfIncorrectQuestions++;
        }
        questionViewHandler.showResult();
    }
    resultsArea.innerHTML = numberOfCorrectQuestions + " of " + (numberOfCorrectQuestions + numberOfIncorrectQuestions) + " are correct.";
    resultsArea.hidden = false;
}
function hideResults(questionViewHandlers, resultsArea) {
    resultsArea.innerHTML = "";
    resultsArea.hidden = true;
    for (let questionViewHandler of questionViewHandlers) {
        questionViewHandler.hideResult();
    }
}
function addTrueFalseQuestion(question, questionViewHandlers) {
    let trueFalseQuestionViewHandler = new TrueFalseQuestionViewHandler(new TrueFalseQuestionView());
    trueFalseQuestionViewHandler.render(question, "questions");
    questionViewHandlers.push(trueFalseQuestionViewHandler);
}
function addMCQuestion(question, questionViewHandlers) {
    let mcQuestionViewHandler = new MCQuestionViewHandler(new MCQuestionView());
    mcQuestionViewHandler.render(question, "questions");
    questionViewHandlers.push(mcQuestionViewHandler);
}
function loadPage(exam) {
    let examNameElement = document.getElementById("examName");
    examNameElement.innerHTML = exam.getName();
    const questionViewHandlers = [];
    for (let question of exam.getQuestions()) {
        if (question instanceof TrueFalseQuestion) {
            addTrueFalseQuestion(question, questionViewHandlers);
        }
        else if (question instanceof MCQuestion) {
            addMCQuestion(question, questionViewHandlers);
        }
    }
    const operationsElement = document.getElementById("operations");
    operationsElement.hidden = false;
    const leaveButton = document.getElementById("leaveButton");
    leaveButton.addEventListener("click", () => {
        locationUtil.redirectToMainPage();
    });
    const hideResultsButton = document.getElementById("hideResultsButton");
    const showResultsButton = document.getElementById("showResultsButton");
    const resultsArea = document.getElementById("results");
    hideResultsButton.addEventListener("click", () => {
        hideResults(questionViewHandlers, resultsArea);
    });
    showResultsButton.addEventListener("click", () => {
        showResults(questionViewHandlers, resultsArea);
    });
}
serviceFactory.getService(ServiceName.USER).getCurrentUser((user) => {
    if (user === null) {
        locationUtil.redirectToLoginPage();
    }
    let headerViewHandler = new HeaderViewHandler(new HeaderView());
    headerViewHandler.render("header");
    const examId = Number(urlUtil.getParam("examId"));
    if (!examId) {
        locationUtil.redirectToMainPage();
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
//# sourceMappingURL=exam.js.map