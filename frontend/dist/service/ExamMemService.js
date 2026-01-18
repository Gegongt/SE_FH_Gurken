import { Exam } from "../vo/Exam.js";
import { ObjectNotFoundError } from "./error/ObjectNotFoundError.js";
import { serviceFactory } from "./factory/ServiceFactory.js";
import { ServiceName } from "./factory/ServiceName.js";
class ExamMem {
    constructor(id, name, questions, creator) {
        this.id = id;
        this.name = name;
        this.questions = questions;
        this.creator = creator;
    }
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getQuestions() {
        return this.questions;
    }
    getCreator() {
        return this.creator;
    }
    setId(id) {
        this.id = id;
    }
    setName(name) {
        this.name = name;
    }
    setQuestions(questions) {
        this.questions = questions;
    }
    setCreator(creator) {
        this.creator = creator;
    }
}
export class ExamMemService {
    constructor() {
        if (localStorage.getItem("exams")) {
            let storedExams = JSON.parse(localStorage.getItem("exams")); //the stored exam objects do not have the methods of a real ExamMem object
            this.exams = [];
            for (let storedExam of storedExams) {
                this.exams.push(new ExamMem(storedExam.id, storedExam.name, storedExam.questions, storedExam.creator));
            }
            this.nextExamId = this.exams[this.exams.length - 1].getId() + 1;
        }
        else {
            this.exams = [];
            this.nextExamId = 1;
            this.exams.push(new ExamMem(this.nextExamId++, "IoT", [1, 2, 3, 4], 1));
            this.saveData();
        }
    }
    saveData() {
        localStorage.setItem("exams", JSON.stringify(this.exams));
    }
    getExamIndexSync(id) {
        for (let i = 0; i < this.exams.length; i++) {
            if (this.exams[i].getId() === id) {
                return i;
            }
        }
        return -1;
    }
    getExamSync(id) {
        let questionIndex = this.getExamIndexSync(id);
        return (questionIndex !== -1) ? this.exams[questionIndex] : null;
    }
    getExam(id, successCallback, errorCallback) {
        setTimeout(() => {
            let examMem = this.getExamSync(id);
            if (examMem !== null) {
                let questions;
                let user;
                serviceFactory.getService(ServiceName.QUESTION).getQuestions(examMem.getQuestions(), (q) => {
                    questions = q;
                    serviceFactory.getService(ServiceName.USER).getUserById(examMem.getCreator(), (u) => {
                        user = u;
                        successCallback(new Exam(examMem.getId(), examMem.getName(), questions, user));
                    }, (error) => {
                        errorCallback(error);
                    });
                }, (error) => {
                    errorCallback(error);
                });
            }
            else {
                errorCallback(new ObjectNotFoundError("Exam<" + id + "> has not been found!"));
            }
        }, 500);
    }
    createExam(exam, successCallback, errorCallback) {
        setTimeout(() => {
            serviceFactory.getService(ServiceName.QUESTION).createQuestions(exam.getQuestions(), (ids) => {
                this.exams.push(new ExamMem(this.nextExamId++, exam.getName(), ids, exam.getCreator().getId()));
                this.saveData();
                successCallback(this.nextExamId);
            }, (error) => {
                errorCallback(error);
            });
        });
    }
    updateExam(exam, successCallback, errorCallback) {
        setTimeout(() => {
            let examMem = this.getExamSync(exam.getId());
            if (examMem === null) {
                errorCallback(new ObjectNotFoundError("Exam<" + exam.getId() + "> has not been found!"));
                return;
            }
            let existingQuestions = [];
            let newQuestions = [];
            for (let question of exam.getQuestions()) {
                if (question.getId() > 0) {
                    existingQuestions.push(question);
                }
                else {
                    newQuestions.push(question);
                }
            }
            let deletedQuestions = [...examMem.getQuestions()];
            for (let questionId of examMem.getQuestions()) {
                if (questionId > 0) {
                    deletedQuestions.splice(deletedQuestions.indexOf(questionId), 1);
                }
            }
            serviceFactory.getService(ServiceName.QUESTION).deleteQuestions(deletedQuestions, () => {
                serviceFactory.getService(ServiceName.QUESTION).updateQuestions(existingQuestions, () => {
                    serviceFactory.getService(ServiceName.QUESTION).createQuestions(newQuestions, (ids) => {
                        examMem.setName(exam.getName());
                        let existingQuestionIds = [];
                        for (let existingQ of existingQuestions) {
                            existingQuestionIds.push(existingQ.getId());
                        }
                        examMem.setQuestions(existingQuestionIds.concat(ids));
                        examMem.setCreator(exam.getCreator().getId());
                        this.saveData();
                        successCallback();
                    });
                }, (error) => {
                    errorCallback(error);
                });
            }, (error) => {
                errorCallback(error);
            });
        }, 500);
    }
    deleteExam(id, successCallback, errorCallback) {
        setTimeout(() => {
            let index = this.getExamIndexSync(id);
            if (index === -1) {
                errorCallback(new ObjectNotFoundError("Exam<" + id + "> has not been found!"));
                return;
            }
            let examMem = this.exams[index];
            serviceFactory.getService(ServiceName.QUESTION).deleteQuestions(examMem.getQuestions(), () => {
                this.exams.splice(index, 1);
                this.saveData();
                successCallback();
            }, (error) => {
                errorCallback(error);
            });
        }, 500);
    }
    getExams(_subcategoryId, // aktuell noch nicht im Model -> ignorieren
    _shallow, successCallback, errorCallback) {
        setTimeout(() => {
            // Wenn keine Exams existieren
            if (this.exams.length === 0) {
                successCallback([]);
                return;
            }
            const result = [];
            let remaining = this.exams.length;
            for (const em of this.exams) {
                // Creator laden (Questions lassen wir leer -> reicht für Listendarstellung)
                serviceFactory.getService(ServiceName.USER).getUserById(em.getCreator(), (u) => {
                    result.push(new Exam(em.getId(), em.getName(), [], u));
                    remaining--;
                    if (remaining === 0)
                        successCallback(result);
                }, (err) => {
                    errorCallback(err);
                });
            }
        }, 200);
    }
}
export let examMemService = new ExamMemService();
//# sourceMappingURL=ExamMemService.js.map