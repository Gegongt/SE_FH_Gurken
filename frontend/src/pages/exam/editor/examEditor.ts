import { MCQuestion } from "../../../vo/MCQuestion.js";
import { TrueFalseQuestion } from "../../../vo/TrueFalseQuestion.js";
import { Option } from "../component/select/Option.js";
import { SelectView } from "../component/select/SelectView.js";
import { SelectViewHandler } from "../component/select/SelectViewHandler.js";
import { MCQuestionEditorView } from "./question/MCQuestionEditorView.js";
import { MCQuestionEditorViewHandler } from "./question/MCQuestionEditorViewHandler.js";
import { TrueFalseQuestionEditorView } from "./question/TrueFalseQuestionEditorView.js";
import { TrueFalseQuestionEditorViewHandler } from "./question/TrueFalseQuestionEditorViewHandler.js";

let mcQuestionEditorViewHandler = new MCQuestionEditorViewHandler(new MCQuestionEditorView());
mcQuestionEditorViewHandler.render(new MCQuestion(1, "What day is today?", ["13.01.2026"], ["14.01.2026", "13.01.2025"]), "questions");

mcQuestionEditorViewHandler = new MCQuestionEditorViewHandler(new MCQuestionEditorView());
mcQuestionEditorViewHandler.render(new MCQuestion(2, "What day is today?", ["13.01.2026"], ["14.01.2026", "13.01.2025"]), "questions");

let trueFalseQuestionEditorViewHandler = new TrueFalseQuestionEditorViewHandler(new TrueFalseQuestionEditorView());
trueFalseQuestionEditorViewHandler.render(new TrueFalseQuestion(3, "Today is the 13.01.2026", true), "questions");

let selectViewHandler = new SelectViewHandler(new SelectView(), true, true);
selectViewHandler.render([new Option(true, "ABC"), new Option(false, "DEF"), new Option(true, "GHI")], "selection");