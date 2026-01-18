import { Exam } from "../vo/Exam.js";
import { ServiceError } from "./error/ServiceError.js";
export declare class ExamMemService {
    private exams;
    private nextExamId;
    constructor();
    private saveData;
    private getExamIndexSync;
    private getExamSync;
    getExam(id: number, successCallback: (exam: Exam) => void, errorCallback: (error: ServiceError) => void): void;
    createExam(exam: Exam, successCallback: (id: number) => void, errorCallback: (error: ServiceError) => void): void;
    updateExam(exam: Exam, successCallback: () => void, errorCallback: (error: ServiceError) => void): void;
    deleteExam(id: number, successCallback: () => void, errorCallback: (error: ServiceError) => void): void;
    getExams(_subcategoryId: number, // aktuell noch nicht im Model -> ignorieren
    _shallow: boolean, successCallback: (exams: Exam[]) => void, errorCallback: (error: ServiceError) => void): void;
}
export declare let examMemService: ExamMemService;
//# sourceMappingURL=ExamMemService.d.ts.map