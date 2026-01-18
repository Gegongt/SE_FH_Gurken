import { Question } from "../../vo/Question.js";
import { ServiceError } from "../error/ServiceError.js";
declare class QuestionHttpService {
    private URL_QUESTION_API_BASE;
    private URL_QUESTION_API_GET_QUESTION;
    private URL_QUESTION_API_CREATE_QUESTION;
    private URL_QUESTION_API_UPDATE_QUESTION;
    private URL_QUESTION_API_DELETE_QUESTION;
    private URL_QUESTION_API_GET_QUESTIONS;
    private URL_QUESTION_API_CREATE_QUESTIONS;
    private URL_QUESTION_API_UPDATE_QUESTIONS;
    private URL_QUESTION_API_DELETE_QUESTIONS;
    getQuestion(id: number, successCallback: (question: Question) => void, errorCallback: (error: ServiceError) => void): void;
    getQuestions(examId: number, successCallback: (questions: Question[]) => void, errorCallback: (error: ServiceError) => void): void;
    createQuestions(questions: Question[], examId: number, successCallback: (ids: number[]) => void, errorCallback: (error: ServiceError) => void): void;
    deleteQuestions(examId: number, successCallback: () => void, errorCallback: (error: ServiceError) => void): void;
}
export declare let questionHttpService: QuestionHttpService;
export {};
//# sourceMappingURL=QuestionHttpService.d.ts.map