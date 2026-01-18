import { converter } from "../../http/entity/util/Converter.js";
import { HttpContentType } from "../../http/HttpContentType.js";
import { HttpMethod } from "../../http/HttpMethod.js";
import { httpService } from "../../http/HttpService.js";
import { ObjectNotFoundError } from "../error/ObjectNotFoundError.js";
import { serviceFactory } from "../factory/ServiceFactory.js";
import { ServiceName } from "../factory/ServiceName.js";
import { accessTokenUtil } from "./AccessTokenUtil.js";
import { errorUtil } from "./ErrorUtil.js";
class ExamHttpService {
    constructor() {
        this.URL_EXAM_API_BASE = "http://localhost:3000/api/exams";
        this.URL_EXAM_API_GET_EXAMS = this.URL_EXAM_API_BASE;
        this.URL_EXAM_API_CREATE_EXAM = this.URL_EXAM_API_BASE;
        this.URL_EXAM_API_UPDATE_EXAM = this.URL_EXAM_API_BASE;
        this.URL_EXAM_API_DELETE_EXAM = this.URL_EXAM_API_BASE;
    }
    getExams(subcategoryId, successCallback, errorCallback) {
        let params = {};
        if (subcategoryId)
            params.subcategoryId = subcategoryId;
        httpService.sendRequest(HttpMethod.METHOD_GET, this.URL_EXAM_API_GET_EXAMS, params, null, null, "json", false, accessTokenUtil.getAccessToken(), (response) => {
            let exams = [];
            for (let examEntity of response) {
                exams.push(converter.convertExamEntityToExam(examEntity));
            }
            successCallback(exams);
        }, (error) => errorCallback(errorUtil.getServiceError(error)));
    }
    getExam(examId, successCallback, errorCallback) {
        this.getExams(null, (exams) => {
            let exam = null;
            for (let e of exams) {
                if (e.getId() == examId) {
                    exam = e;
                    serviceFactory.getService(ServiceName.QUESTION).getQuestions(exam.getId(), (questions) => {
                        exam.setQuestions(questions);
                        successCallback(exam);
                    }, (error) => errorCallback(error));
                }
            }
            if (exam === null) {
                errorCallback(new ObjectNotFoundError("Error! Exam<" + examId + "> not found!"));
            }
        }, (error) => errorCallback(error));
    }
    createExam(exam, subcategoryId, successCallback, errorCallback) {
        httpService.sendRequest(HttpMethod.METHOD_POST, this.URL_EXAM_API_CREATE_EXAM, null, converter.convertExamToExamEntity(exam, subcategoryId), HttpContentType.CONTENT_TYPE_JSON, "json", false, accessTokenUtil.getAccessToken(), (response) => {
            exam.setId(response.id);
            serviceFactory.getService(ServiceName.QUESTION).createQuestions(exam.getQuestions(), exam.getId(), (ids) => {
                successCallback(response.id);
            }, (error) => {
                errorCallback(error);
            });
        }, (error) => { errorCallback(errorUtil.getServiceError(error)); });
    }
    updateExam(exam, successCallback, errorCallback) {
        httpService.sendRequest(HttpMethod.METHOD_PUT, this.URL_EXAM_API_UPDATE_EXAM + "/" + exam.getId(), null, converter.convertExamToExamEntity(exam), HttpContentType.CONTENT_TYPE_JSON, null, false, accessTokenUtil.getAccessToken(), (response) => {
            serviceFactory.getService(ServiceName.QUESTION).deleteQuestions(exam.getId(), () => {
                serviceFactory.getService(ServiceName.QUESTION).createQuestions(exam.getQuestions(), exam.getId(), (ids) => {
                    successCallback();
                }, (error) => {
                    errorCallback(error);
                });
            }, (error) => {
                errorCallback(error);
            });
        }, (error) => { errorCallback(errorUtil.getServiceError(error)); });
    }
    deleteExam(id, successCallback, errorCallback) {
        httpService.sendRequest(HttpMethod.METHOD_DELETE, this.URL_EXAM_API_DELETE_EXAM + "/" + id, null, null, null, null, false, accessTokenUtil.getAccessToken(), (response) => { successCallback(); }, (error) => { errorCallback(errorUtil.getServiceError(error)); });
    }
}
export let examHttpService = new ExamHttpService();
//# sourceMappingURL=ExamHttpService.js.map