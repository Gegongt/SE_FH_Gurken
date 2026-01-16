import { ServiceError } from "../../../service/error/ServiceError.js";
import { serviceFactory } from "../../../service/factory/ServiceFactory.js";
import { ServiceName } from "../../../service/factory/ServiceName.js";
import { locationUtil } from "../../../util/LocationUtil.js";
import { urlUtil } from "../../../util/URLUtil.js";
import { Exam } from "../../../vo/Exam.js";
import { MCQuestion } from "../../../vo/MCQuestion.js";
import { TrueFalseQuestion } from "../../../vo/TrueFalseQuestion.js";
import { User } from "../../../vo/User.js";
import { MCQuestionView } from "./question/MCQuestionView.js";
import { MCQuestionViewHandler } from "./question/MCQuestionViewHandler.js";
import { TrueFalseQuestionView } from "./question/TrueFalseQuestionView.js";
import { TrueFalseQuestionViewHandler } from "./question/TrueFalseQuestionViewHandler.js";

function showResults(questionViewHandlers:any[], resultsArea:HTMLElement):void
{
    let numberOfCorrectQuestions = 0;
    let numberOfIncorrectQuestions = 0;

    for(let questionViewHandler of questionViewHandlers)
    {
        if(questionViewHandler.isCorrect())
        {
            numberOfCorrectQuestions++;
        }

        else
        {
            numberOfIncorrectQuestions++;
        }

        questionViewHandler.showResult();
    }

    resultsArea.innerHTML = numberOfCorrectQuestions + " of " + (numberOfCorrectQuestions + numberOfIncorrectQuestions) + " are correct.";
    resultsArea.hidden = false;
}

function hideResults(questionViewHandlers:any[], resultsArea:HTMLElement):void
{
    resultsArea.innerHTML = "";
    resultsArea.hidden = true;

    for(let questionViewHandler of questionViewHandlers)
    {
        questionViewHandler.hideResult();
    }
}

function addTrueFalseQuestion(question:TrueFalseQuestion, questionViewHandlers:any[]):void
{
    let trueFalseQuestionViewHandler = new TrueFalseQuestionViewHandler(new TrueFalseQuestionView());
    trueFalseQuestionViewHandler.render(question, "questions");

    questionViewHandlers.push(trueFalseQuestionViewHandler);
}

function addMCQuestion(question:MCQuestion, questionViewHandlers:any[]):void
{
    let mcQuestionViewHandler = new MCQuestionViewHandler(new MCQuestionView());
    mcQuestionViewHandler.render(question, "questions");

    questionViewHandlers.push(mcQuestionViewHandler);
}

function loadPage(exam:Exam):void
{
    let examNameElement:HTMLHeadingElement = document.getElementById("examName") as HTMLHeadingElement;
    examNameElement.innerHTML = exam.getName();

    const questionViewHandlers:any[] = [];

    for(let question of exam.getQuestions())
    {
        if(question instanceof TrueFalseQuestion)
        {
            addTrueFalseQuestion(question as TrueFalseQuestion, questionViewHandlers);
        }
        
        else if(question instanceof MCQuestion)
        {
            addMCQuestion(question as MCQuestion, questionViewHandlers);
        }
    }

    const operationsElement = document.getElementById("operations");
    operationsElement!.hidden = false;

    const leaveButton = document.getElementById("leaveButton");

    leaveButton!.addEventListener("click", () =>
    {
        locationUtil.redirectToMainPage();
    });

    const hideResultsButton:HTMLInputElement = document.getElementById("hideResultsButton") as HTMLInputElement;
    const showResultsButton:HTMLInputElement = document.getElementById("showResultsButton") as HTMLInputElement;

    const resultsArea:HTMLElement = document.getElementById("results") as HTMLElement;

    hideResultsButton!.addEventListener("click", () =>
    {
        hideResults(questionViewHandlers, resultsArea);
    });

    showResultsButton!.addEventListener("click", () =>
    {
        showResults(questionViewHandlers, resultsArea);
    });
}

serviceFactory.getService(ServiceName.USER).getCurrentUser((user:User|null) =>
{
    if(user === null)
    {
        locationUtil.redirectToLoginPage();
    }

    const examId = Number(urlUtil.getParam("examId"));

    if(!examId)
    {
        locationUtil.redirectToMainPage();
    }

    else
    {
        serviceFactory.getService(ServiceName.EXAM).getExam(examId, (exam:Exam) =>
        {
            loadPage(exam);
        },

        (error:ServiceError) =>
        {
            console.log("Error: " + error);
            locationUtil.redirectToMainPage();
        });
    }
},

(error:ServiceError) =>
{
    console.log("Error: " + error);
    locationUtil.redirectToMainPage();
});
