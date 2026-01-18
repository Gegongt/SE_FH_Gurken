import { converter } from "../../http/entity/util/Converter.js";
import { HttpContentType } from "../../http/HttpContentType.js";
import { HttpMethod } from "../../http/HttpMethod.js";
import { httpService } from "../../http/HttpService.js";
import { accessTokenUtil } from "./AccessTokenUtil.js";
import { errorUtil } from "./ErrorUtil.js";
class QuestionHttpService {
    constructor() {
        this.URL_QUESTION_API_BASE = "http://localhost:3000/api/questions";
        this.URL_QUESTION_API_GET_QUESTION = this.URL_QUESTION_API_BASE;
        this.URL_QUESTION_API_CREATE_QUESTION = this.URL_QUESTION_API_BASE;
        this.URL_QUESTION_API_UPDATE_QUESTION = this.URL_QUESTION_API_BASE;
        this.URL_QUESTION_API_DELETE_QUESTION = this.URL_QUESTION_API_BASE;
        this.URL_QUESTION_API_GET_QUESTIONS = this.URL_QUESTION_API_BASE;
        this.URL_QUESTION_API_CREATE_QUESTIONS = this.URL_QUESTION_API_BASE;
        this.URL_QUESTION_API_UPDATE_QUESTIONS = this.URL_QUESTION_API_BASE;
        this.URL_QUESTION_API_DELETE_QUESTIONS = this.URL_QUESTION_API_BASE;
    }
    getQuestion(id, successCallback, errorCallback) {
        httpService.sendRequest(HttpMethod.METHOD_GET, this.URL_QUESTION_API_GET_QUESTION + "/" + id, null, null, null, "json", false, accessTokenUtil.getAccessToken(), (response) => { successCallback(converter.convertQuestionEntityToQuestion(response)); }, (error) => { errorCallback(errorUtil.getServiceError(error)); });
    }
    getQuestions(examId, successCallback, errorCallback) {
        httpService.sendRequest(HttpMethod.METHOD_GET, this.URL_QUESTION_API_GET_QUESTIONS, { examId }, null, null, "json", false, accessTokenUtil.getAccessToken(), (response) => {
            let questions = [];
            for (let questionEntity of response) {
                questions.push(converter.convertQuestionEntityToQuestion(questionEntity));
            }
            successCallback(questions);
        }, (error) => {
            errorCallback(errorUtil.getServiceError(error));
        });
    }
    /*
    Old version:
    createQuestion(question:Question, examId:number, successCallback:(id:number) => void, errorCallback:(error:ServiceError) => void):void
    {
        httpService.sendRequest(HttpMethod.METHOD_POST, this.URL_QUESTION_API_CREATE_QUESTION, null,
                                converter.convertQuestionToQuestionEntity(question, examId), HttpContentType.CONTENT_TYPE_JSON,
                                "json", false, accessTokenUtil.getAccessToken(),
                                (response:any) => { successCallback(-1); },
                                (error:any) => { errorCallback(new ServiceError("Error! Create failed!")); });
    }*/
    createQuestions(questions, examId, successCallback, errorCallback) {
        let body = [];
        for (let question of questions) {
            body.push(converter.convertQuestionToQuestionEntity(question, examId));
        }
        httpService.sendRequest(HttpMethod.METHOD_POST, this.URL_QUESTION_API_CREATE_QUESTIONS, null, body, HttpContentType.CONTENT_TYPE_JSON, "json", false, accessTokenUtil.getAccessToken(), (response) => { successCallback([]); }, (error) => { errorCallback(errorUtil.getServiceError(error)); });
    }
    /*
    Old version:
    updateQuestion(question:Question, examId:number, successCallback:() => void, errorCallback:(error:ServiceError) => void):void
    {
        httpService.sendRequest(HttpMethod.METHOD_PUT, this.URL_QUESTION_API_UPDATE_QUESTION + "/" + question.getId(), null,
                                converter.convertQuestionToQuestionEntity(question, examId), HttpContentType.CONTENT_TYPE_JSON,
                                "json", false, accessTokenUtil.getAccessToken(),
                                (response:any) => { successCallback(); },
                                (error:any) => { errorCallback(new ServiceError("Error! Update failed!")); });
    }
    
    updateQuestions(questions:Question[], examId:number, successCallback:() => void, errorCallback:(error:ServiceError) => void):void
    {
        let body:any[] = [];

        for(let question of questions)
        {
            body.push(converter.convertQuestionToQuestionEntity(question, examId));
        }

        httpService.sendRequest(HttpMethod.METHOD_PUT, this.URL_QUESTION_API_UPDATE_QUESTIONS, null,
                                body, HttpContentType.CONTENT_TYPE_JSON, "json", false, accessTokenUtil.getAccessToken(),
                                (response:any) => { successCallback(); },
                                (error:any) => { errorCallback(new ServiceError("Error! Update failed!")); });
    }
    */
    /*
    Old version:
    deleteQuestion(id:number, successCallback:() => void, errorCallback:(error:ServiceError) => void):void
    {
        httpService.sendRequest(HttpMethod.METHOD_DELETE, this.URL_QUESTION_API_DELETE_QUESTION + "/" + id, null,
                                null, null, null, false, accessTokenUtil.getAccessToken(),
                                (response:any) => { successCallback(); },
                                (error:any) => { errorCallback(new ServiceError("Error! Delete failed!")); });
    }*/
    deleteQuestions(examId, successCallback, errorCallback) {
        httpService.sendRequest(HttpMethod.METHOD_DELETE, this.URL_QUESTION_API_DELETE_QUESTIONS, { examId }, null, null, null, false, accessTokenUtil.getAccessToken(), (response) => { successCallback(); }, (error) => { errorCallback(errorUtil.getServiceError(error)); });
    }
}
export let questionHttpService = new QuestionHttpService();
//# sourceMappingURL=QuestionHttpService.js.map