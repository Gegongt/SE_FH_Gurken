import { ExamEntity } from "../../http/entity/ExamEntity.js";
import { converter } from "../../http/entity/util/Converter.js";
import { HttpContentType } from "../../http/HttpContentType.js";
import { HttpMethod } from "../../http/HttpMethod.js";
import { httpService } from "../../http/HttpService.js";
import { Exam } from "../../vo/Exam.js";
import { Question } from "../../vo/Question.js";
import { ObjectNotFoundError } from "../error/ObjectNotFoundError.js";
import { ServiceError } from "../error/ServiceError.js";
import { serviceFactory } from "../factory/ServiceFactory.js";
import { ServiceName } from "../factory/ServiceName.js";
import { accessTokenUtil } from "./AccessTokenUtil.js";

class ExamHttpService
{
    private URL_EXAM_API_BASE = "http://localhost:3000/api/exams";
    private URL_EXAM_API_GET_EXAMS = this.URL_EXAM_API_BASE;
    private URL_EXAM_API_CREATE_EXAM = this.URL_EXAM_API_BASE;
    private URL_EXAM_API_UPDATE_EXAM = this.URL_EXAM_API_BASE;
    private URL_EXAM_API_DELETE_EXAM = this.URL_EXAM_API_BASE;

    getExams(subcategoryId:number|null, successCallback:(exams:Exam[]) => void, errorCallback:(error:ServiceError) => void):void
    {
        let params:any = {};
        if(subcategoryId) params.subcategoryId = subcategoryId;

        httpService.sendRequest(HttpMethod.METHOD_GET, this.URL_EXAM_API_GET_EXAMS, params,
                                null, null, "json", false, accessTokenUtil.getAccessToken(),
                                (response:ExamEntity[]) =>
                                {
                                    let exams:Exam[] = [];

                                    for(let examEntity of response)
                                    {
                                        exams.push(converter.convertExamEntityToExam(examEntity));
                                    }

                                    successCallback(exams);
                                },

                                (error:ServiceError) => errorCallback(error));
    }

    getExam(examId:number, successCallback:(exam:Exam) => void, errorCallback:(error:ServiceError) => void):void
    {
        this.getExams(null,
        (exams:Exam[]) =>
        {
            let exam:Exam|null = null;

            for(let e of exams)
            {
                if(e.getId() == examId)
                {
                    exam = e;
                    serviceFactory.getService(ServiceName.QUESTION).getQuestions(exam.getId(),
                    (questions:Question[]) =>
                    {
                        exam!.setQuestions(questions);
                        successCallback(exam as Exam);
                    },
                
                    (error:ServiceError) => errorCallback(error));
                }
            }

            if(exam === null)
            {
                errorCallback(new ObjectNotFoundError("Error! Exam<" + examId + "> not found!"));
            }
        },

        (error:ServiceError) => errorCallback(error));
    }

    createExam(exam:Exam, subcategoryId:number, successCallback:(id:number) => void, errorCallback:(error:ServiceError) => void):void
    {
        httpService.sendRequest(HttpMethod.METHOD_POST, this.URL_EXAM_API_CREATE_EXAM, null,
                                converter.convertExamToExamEntity(exam, subcategoryId), HttpContentType.CONTENT_TYPE_JSON,
                                "json", false, accessTokenUtil.getAccessToken(),
                                (response:ExamEntity) =>
                                {
                                    exam.setId(response.id);

                                    serviceFactory.getService(ServiceName.QUESTION).createQuestions(exam.getQuestions(), exam.getId(),
                                    (ids:number) =>
                                    {
                                        successCallback(response.id);
                                    },

                                    (error:ServiceError) =>
                                    {
                                        errorCallback(error);
                                    });
                                },

                                (error:any) => { errorCallback(new ServiceError("Error! Creation failed!")); });
    }

    updateExam(exam:Exam, successCallback:() => void, errorCallback:(error:ServiceError) => void):void
    {
        httpService.sendRequest(HttpMethod.METHOD_PUT, this.URL_EXAM_API_UPDATE_EXAM + "/" + exam.getId(), null,
                                converter.convertExamToExamEntity(exam), HttpContentType.CONTENT_TYPE_JSON,
                                null, false, accessTokenUtil.getAccessToken(),
                                (response:any) =>
                                {
                                    serviceFactory.getService(ServiceName.QUESTION).deleteQuestions(exam.getId(),
                                    () =>
                                    {
                                        serviceFactory.getService(ServiceName.QUESTION).createQuestions(exam.getQuestions(), exam.getId(),
                                        (ids:number) =>
                                        {
                                            successCallback();
                                        },
                                    
                                        (error:ServiceError) =>
                                        {
                                            errorCallback(error);
                                        })
                                    },
                                
                                    (error:ServiceError) =>
                                    {
                                        errorCallback(error);
                                    });
                                },

                                (error:any) => { errorCallback(new ServiceError("Error! Update failed!")); });
    }

    deleteExam(id:number, successCallback:() => void, errorCallback:(error:ServiceError) => void):void
    {
        httpService.sendRequest(HttpMethod.METHOD_DELETE, this.URL_EXAM_API_DELETE_EXAM + "/" + id, null,
                                null, null, null, false, accessTokenUtil.getAccessToken(),
                                (response:any) => { successCallback(); },
                                (error:any) => { errorCallback(new ServiceError("Error! Delete failed!")); });
    }
}

export let examHttpService = new ExamHttpService();
