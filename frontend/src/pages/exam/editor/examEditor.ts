import { ServiceError } from "../../../service/error/ServiceError.js";
import { serviceFactory } from "../../../service/factory/ServiceFactory.js";
import { ServiceName } from "../../../service/factory/ServiceName.js";
import { locationUtil } from "../../../util/LocationUtil.js";
import { urlUtil } from "../../../util/URLUtil.js";
import { Exam } from "../../../vo/Exam.js";
import { MCQuestion } from "../../../vo/MCQuestion.js";
import { TrueFalseQuestion } from "../../../vo/TrueFalseQuestion.js";
import { User } from "../../../vo/User.js";
import { MCQuestionEditorView } from "./question/MCQuestionEditorView.js";
import { MCQuestionEditorViewHandler } from "./question/MCQuestionEditorViewHandler.js";
import { TrueFalseQuestionEditorView } from "./question/TrueFalseQuestionEditorView.js";
import { TrueFalseQuestionEditorViewHandler } from "./question/TrueFalseQuestionEditorViewHandler.js";

serviceFactory.getService(ServiceName.USER).getCurrentUser((user:User|null) =>
{
    if(user === null)
    {
        locationUtil.redirectToLoginPage();
    }

    const examId = Number(urlUtil.getParam("examId"));

    if(examId === null)
    {
        locationUtil.redirectToMainPage();
    }

    serviceFactory.getService(ServiceName.EXAM).getExam(examId, (exam:Exam) =>
    {
        const nameInputElement:HTMLInputElement = document.getElementById("nameInput") as HTMLInputElement;
        nameInputElement!.value = exam.getName();
        nameInputElement!.disabled = false;

        const questionEditorViewHandlers:any[] = [];

        for(let question of exam.getQuestions())
        {
            if(question instanceof TrueFalseQuestion)
            {
                let trueFalseQuestionEditorViewHandler = new TrueFalseQuestionEditorViewHandler(new TrueFalseQuestionEditorView());
                trueFalseQuestionEditorViewHandler.render(question as TrueFalseQuestion, "questions");

                questionEditorViewHandlers.push(trueFalseQuestionEditorViewHandler);
            }
            
            else if(question instanceof MCQuestion)
            {
                let mcQuestionEditorViewHandler = new MCQuestionEditorViewHandler(new MCQuestionEditorView());
                mcQuestionEditorViewHandler.render(question as MCQuestion, "questions");

                questionEditorViewHandlers.push(mcQuestionEditorViewHandler);
            }
        }
    },

    (error:ServiceError) =>
    {
        console.log("Error: " + error);
        locationUtil.redirectToMainPage();
    });
},

(error:ServiceError) =>
{
    console.log("Error: " + error);
    locationUtil.redirectToMainPage();
});
