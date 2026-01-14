import { serviceFactory } from "../../../service/factory/ServiceFactory.js";
import { ServiceName } from "../../../service/factory/ServiceName.js";
import { locationUtil } from "../../../util/LocationUtil.js";
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
        let mcQuestionEditorViewHandler = new MCQuestionEditorViewHandler(new MCQuestionEditorView());
        mcQuestionEditorViewHandler.render(new MCQuestion(1, "What day is today?", ["13.01.2026"], ["14.01.2026", "13.01.2025"]), "questions");

        mcQuestionEditorViewHandler = new MCQuestionEditorViewHandler(new MCQuestionEditorView());
        mcQuestionEditorViewHandler.render(new MCQuestion(2, "What day is today?", ["13.01.2026"], ["14.01.2026", "13.01.2025"]), "questions");

        let trueFalseQuestionEditorViewHandler = new TrueFalseQuestionEditorViewHandler(new TrueFalseQuestionEditorView());
        trueFalseQuestionEditorViewHandler.render(new TrueFalseQuestion(3, "Today is the 13.01.2026", true), "questions");
    }

    else
    {
        locationUtil.redirectToUserPage();
    }
});
