import { ServiceError } from "../../../service/error/ServiceError.js";
import { serviceFactory } from "../../../service/factory/ServiceFactory.js";
import { ServiceName } from "../../../service/factory/ServiceName.js";
import { locationUtil } from "../../../util/LocationUtil.js";
import { urlUtil } from "../../../util/URLUtil.js";
import { Exam } from "../../../vo/Exam.js";
import { MCQuestion } from "../../../vo/MCQuestion.js";
import { Question } from "../../../vo/Question.js";
import { TrueFalseQuestion } from "../../../vo/TrueFalseQuestion.js";
import { User } from "../../../vo/User.js";
import { HeaderView } from "../../components/header/HeaderView.js";
import { HeaderViewHandler } from "../../components/header/HeaderViewHandler.js";
import { MCQuestionEditorView } from "./question/MCQuestionEditorView.js";
import { MCQuestionEditorViewHandler } from "./question/MCQuestionEditorViewHandler.js";
import { TrueFalseQuestionEditorView } from "./question/TrueFalseQuestionEditorView.js";
import { TrueFalseQuestionEditorViewHandler } from "./question/TrueFalseQuestionEditorViewHandler.js";

let nextNewQuestionId = -1;

function saveExam(exam:Exam, nameInputElement:HTMLInputElement, questionEditorViewHandlers:any[]):void
{
    exam.setName(nameInputElement.value);

    let questions:Question[] = [];

    for(let questionEditorViewHandler of questionEditorViewHandlers)
    {
        let updatedQuestion = questionEditorViewHandler.getUpdatedQuestion();

        if(updatedQuestion)
        {
            questions.push(updatedQuestion);
        }
    }

    exam.setQuestions(questions);

    if(exam.getId() < 0)
    {
        let subcategoryId:number = Number(urlUtil.getParam("subcategoryId"));

        serviceFactory.getService(ServiceName.EXAM).createExam(exam, subcategoryId, (id:number) =>
        {
            console.log(id);
            locationUtil.redirectToMainPage();
        },
    
        (error:ServiceError) =>
        {
            console.log("Error: " + error);
            alert("Error! Saving failed!");
            locationUtil.redirectToMainPage();
        });
    }

    else
    {
        serviceFactory.getService(ServiceName.EXAM).updateExam(exam, () =>
        {
            locationUtil.redirectToMainPage();
        },
    
        (error:ServiceError) =>
        {
            console.log("Error: " + error);
            alert("Error! Saving failed!");
            locationUtil.redirectToMainPage();
        });
    }
}

function deleteExam(exam:Exam):void
{
    serviceFactory.getService(ServiceName.EXAM).deleteExam(exam.getId(),
    () => { locationUtil.redirectToMainPage(); },
    (error:ServiceError) => { locationUtil.redirectToMainPage(); });
}

function addTrueFalseQuestion(question:TrueFalseQuestion|null, questionEditorViewHandlers:any[]):void
{
    let trueFalseQuestionEditorViewHandler = new TrueFalseQuestionEditorViewHandler(new TrueFalseQuestionEditorView());
    trueFalseQuestionEditorViewHandler.render(question ? question : new TrueFalseQuestion(nextNewQuestionId--, "", true), "questions");

    questionEditorViewHandlers.push(trueFalseQuestionEditorViewHandler);
}

function addMCQuestion(question:MCQuestion|null, questionEditorViewHandlers:any[]):void
{
    let mcQuestionEditorViewHandler = new MCQuestionEditorViewHandler(new MCQuestionEditorView());
    mcQuestionEditorViewHandler.render(question ? question : new MCQuestion(nextNewQuestionId--, "", [], []), "questions");

    questionEditorViewHandlers.push(mcQuestionEditorViewHandler);
}

function loadPage(exam:Exam):void
{
    document.getElementById("mainArea")!.hidden = false;

    let headerViewHandler = new HeaderViewHandler(new HeaderView());
    headerViewHandler.render("header");

    const nameInputElement:HTMLInputElement = document.getElementById("nameInput") as HTMLInputElement;
    nameInputElement!.value = exam.getName();
    nameInputElement!.disabled = false;

    const questionEditorViewHandlers:any[] = [];

    for(let question of exam.getQuestions())
    {
        if(question instanceof TrueFalseQuestion)
        {
            addTrueFalseQuestion(question as TrueFalseQuestion, questionEditorViewHandlers);
        }
        
        else if(question instanceof MCQuestion)
        {
            addMCQuestion(question as MCQuestion, questionEditorViewHandlers);
        }
    }

    const operationsElement = document.getElementById("operations");
    operationsElement!.hidden = false;

    const addMCQuestionButton = document.getElementById("addMCQuestionButton");

    addMCQuestionButton!.addEventListener("click", () =>
    {
        addMCQuestion(null, questionEditorViewHandlers);
    });

    const addTrueFalseQuestionButton = document.getElementById("addTrueFalseQuestionButton");

    addTrueFalseQuestionButton!.addEventListener("click", () =>
    {
        addTrueFalseQuestion(null, questionEditorViewHandlers);
    });

    const cancelButton = document.getElementById("cancelButton");

    cancelButton!.addEventListener("click", () =>
    {
        locationUtil.redirectToMainPage();
    });

    const saveButton:HTMLButtonElement = document.getElementById("saveButton") as HTMLButtonElement;
    const deleteButton:HTMLButtonElement = document.getElementById("deleteButton") as HTMLButtonElement;

    saveButton!.addEventListener("click", () =>
    {
        saveButton!.disabled = true;
        deleteButton!.disabled = true;
        saveExam(exam, nameInputElement, questionEditorViewHandlers);
    });

    deleteButton!.addEventListener("click", () =>
    {
        saveButton!.disabled = true;
        deleteButton!.disabled = true;
        deleteExam(exam);
    });
}

serviceFactory.getService(ServiceName.USER).getCurrentUser((user:User|null) =>
{
    if(user === null)
    {
        locationUtil.redirectToLoginPage();
    }

    const examId = Number(urlUtil.getParam("examId"));

    if(!examId) //a new exam is being created
    {
        loadPage(new Exam(-1, "", [], user as User));
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
