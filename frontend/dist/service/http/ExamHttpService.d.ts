import { Exam } from "../../vo/Exam.js";
import { ServiceError } from "../error/ServiceError.js";
declare class ExamHttpService {
    private URL_EXAM_API_BASE;
    private URL_EXAM_API_GET_EXAMS;
    private URL_EXAM_API_CREATE_EXAM;
    private URL_EXAM_API_UPDATE_EXAM;
    private URL_EXAM_API_DELETE_EXAM;
    getExams(subcategoryId: number | null, successCallback: (exams: Exam[]) => void, errorCallback: (error: ServiceError) => void): void;
    getExam(examId: number, successCallback: (exam: Exam) => void, errorCallback: (error: ServiceError) => void): void;
    createExam(exam: Exam, subcategoryId: number, successCallback: (id: number) => void, errorCallback: (error: ServiceError) => void): void;
    updateExam(exam: Exam, successCallback: () => void, errorCallback: (error: ServiceError) => void): void;
    deleteExam(id: number, successCallback: () => void, errorCallback: (error: ServiceError) => void): void;
}
export declare let examHttpService: ExamHttpService;
export {};
//# sourceMappingURL=ExamHttpService.d.ts.map