import { ExamEntity } from "../../http/entity/ExamEntity.js";
import { converter } from "../../http/entity/util/Converter.js";
import { HttpMethod } from "../../http/HttpMethod.js";
import { httpService } from "../../http/HttpService.js";
import { Exam } from "../../vo/Exam.js";
import { ServiceError } from "../error/ServiceError.js";
import { accessTokenUtil } from "./AccessTokenUtil.js";

class ExamHttpService
{
    private URL_EXAM_API_BASE = "http://localhost:3000/api/exams";
    private URL_EXAM_API_GET_EXAMS = this.URL_EXAM_API_BASE;

    getExam(id:number, successCallback:(exam:Exam) => void, errorCallback:(error:ServiceError) => void):void
    {
        httpService.sendRequest(HttpMethod.METHOD_GET, this.URL_EXAM_API_GET_EXAMS + "/" + id, null,
                                null, null, "json", false, accessTokenUtil.getAccessToken(),
                                (response:ExamEntity) =>
                                {
                                    successCallback(converter.convertExamEntityToExam(response));
                                },

                                (error:ServiceError) => errorCallback(error));
    }
}

export let examHttpService = new ExamHttpService();
