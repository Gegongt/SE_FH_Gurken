import { ServiceError } from "./error/ServiceError.js";
import { Question } from "../vo/Question.js";
declare class QuestionMemService {
    private questions;
    private nextQuestionId;
    constructor();
    private saveData;
    private getQuestionIndexSync;
    private getQuestionSync;
    getQuestion(id: number, successCallback: (question: Question) => void, errorCallback: (error: ServiceError) => void): void;
    getQuestions(ids: number[], successCallback: (questions: Question[]) => void, errorCallback: (error: ServiceError) => void): void;
    createQuestion(question: Question, successCallback: (id: number) => void, errorCallback: (error: ServiceError) => void): void;
    createQuestions(questions: Question[], successCallback: (ids: number[]) => void, errorCallback: (error: ServiceError) => void): void;
    updateQuestion(question: Question, successCallback: () => void, errorCallback: (error: ServiceError) => void): void;
    updateQuestions(questions: Question[], successCallback: () => void, errorCallback: (error: ServiceError) => void): void;
    deleteQuestion(id: number, successCallback: () => void, errorCallback: (error: ServiceError) => void): void;
    deleteQuestions(ids: number[], successCallback: () => void, errorCallback: (error: ServiceError) => void): void;
}
export declare let questionMemService: QuestionMemService;
export {};
//# sourceMappingURL=QuestionMemService.d.ts.map