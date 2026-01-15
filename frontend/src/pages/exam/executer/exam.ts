import { ServiceError } from "../../../service/error/ServiceError.js";
import { serviceFactory } from "../../../service/factory/ServiceFactory.js";
import { ServiceName } from "../../../service/factory/ServiceName.js";
import { locationUtil } from "../../../util/LocationUtil.js";
import { urlUtil } from "../../../util/URLUtil.js";
import { Exam } from "../../../vo/Exam.js";
import { User } from "../../../vo/User.js";

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
