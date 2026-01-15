import { Exam } from "../vo/Exam.js";
import { Question } from "../vo/Question.js";
import { User } from "../vo/User.js";
import { ObjectNotFoundError } from "./error/ObjectNotFoundError.js";
import { ServiceError } from "./error/ServiceError.js";
import { serviceFactory } from "./factory/ServiceFactory.js";
import { ServiceName } from "./factory/ServiceName.js";

class ExamMem
{
    private id:number;
    private name:string;
    private questions:number[];
    private creator:number;

    constructor(id:number, name:string, questions:number[], creator:number)
    {
        this.id = id;
        this.name = name;
        this.questions = questions;
        this.creator = creator;
    }

    getId():number
    {
        return this.id;
    }

    getName():string
    {
        return this.name;
    }

    getQuestions():number[]
    {
        return this.questions;
    }

    getCreator():number
    {
        return this.creator;
    }

    setId(id:number):void
    {
        this.id = id;
    }

    setName(name:string):void
    {
        this.name = name;
    }

    setQuestions(questions:number[]):void
    {
        this.questions = questions;
    }

    setCreator(creator:number):void
    {
        this.creator = creator;
    }
}

export class ExamMemService
{
    private exams:ExamMem[];
    private nextExamId:number = 1;
        
    public constructor()
    {
        this.exams = [];

        this.exams.push(new ExamMem(this.nextExamId++, "IoT", [1, 2, 3, 4], 1));
    }

    private getExamIndexSync(id:number):number
    {
        for(let i = 0; i < this.exams.length; i++)
        {
            if(this.exams[i]!.getId() === id)
            {
                return i;
            }
        }

        return -1;
    }

    private getExamSync(id:number):ExamMem|null
    {
        let questionIndex = this.getExamIndexSync(id);

        return (questionIndex !== -1) ? (this.exams[questionIndex] as ExamMem) : null;
    }
    
    getExam(id:number, successCallback:(exam:Exam) => void, errorCallback:(error:ServiceError) => void):void
    {
        setTimeout(() =>
        {
            let examMem:ExamMem|null = this.getExamSync(id);

            if(examMem !== null)
            {
                let questions:Question[]|undefined;
                let user:User|undefined;

                serviceFactory.getService(ServiceName.QUESTION).getQuestions(examMem.getQuestions(),
                                                                             (q:Question[]) =>
                                                                             {
                                                                                questions = q;

                                                                                serviceFactory.getService(ServiceName.USER).getUserById(examMem.getCreator(),
                                                                                (u:User) =>
                                                                                {
                                                                                    user = u;

                                                                                    successCallback(new Exam(examMem.getId(), examMem.getName(), questions as Question[], user));
                                                                                },
                                                                            
                                                                                (error:ServiceError) =>
                                                                                {
                                                                                    errorCallback(error);
                                                                                });
                                                                             },

                                                                             (error:ServiceError) =>
                                                                             {
                                                                                errorCallback(error);
                                                                             });
            }

            else
            {
                errorCallback(new ObjectNotFoundError("Exam<" + id + "> has not been found!"));
            }
        }, 500);
    }

    createExam(exam:Exam, successCallback:(id:number) => void, errorCallback:(error:ServiceError) => void):void
    {
        setTimeout(() =>
        {
            serviceFactory.getService(ServiceName.QUESTION).createQuestions(exam.getQuestions(),
                                                                            (ids:number[]) =>
                                                                            {
                                                                                this.exams.push(new ExamMem(this.nextExamId++, exam.getName(), ids, exam.getCreator().getId()));
                                                                                successCallback(this.nextExamId);
                                                                            },

                                                                            (error:ServiceError) =>
                                                                            {
                                                                                errorCallback(error);
                                                                            })
        });
    }
    
    updateExam(exam:Exam, successCallback:() => void, errorCallback:(error:ServiceError) => void):void
    {
        setTimeout(() =>
        {
            let examMem = this.getExamSync(exam.getId());

            if(examMem === null)
            {
                errorCallback(new ObjectNotFoundError("Exam<" + exam.getId() + "> has not been found!"));
                return;
            }

            let existingQuestions:Question[] = [];
            let newQuestions:Question[] = [];

            for(let question of exam.getQuestions())
            {
                if(question.getId() > 0)
                {
                    existingQuestions.push(question);
                }

                else
                {
                    newQuestions.push(question);
                }
            }

            serviceFactory.getService(ServiceName.QUESTION).updateQuestions(existingQuestions,
                                                                            () =>
                                                                            {
                                                                                serviceFactory.getService(ServiceName.QUESTION).createQuestions(newQuestions,
                                                                                                                                                (ids:number[]) =>
                                                                                                                                                {
                                                                                                                                                    examMem.setName(exam.getName());
                                                                                                                                                    examMem.setQuestions(examMem.getQuestions().concat(ids));
                                                                                                                                                    examMem.setCreator(exam.getCreator().getId());

                                                                                                                                                    successCallback();
                                                                                                                                                });
                                                                            },
                                                                        
                                                                            (error:ServiceError) =>
                                                                            {
                                                                                errorCallback(error);
                                                                            });
        }, 500);
    }
    
    deleteExam(id:number, successCallback:() => void, errorCallback:(error:ServiceError) => void):void
    {
        setTimeout(() =>
        {
            let index = this.getExamIndexSync(id);

            if(index === -1)
            {
                errorCallback(new ObjectNotFoundError("Exam<" + id + "> has not been found!"));
                return;
            }

            let examMem = this.exams[index];

            serviceFactory.getService(ServiceName.QUESTION).deleteQuestions(examMem!.getQuestions(),
                                                                            () =>
                                                                            {
                                                                                this.exams.splice(index, 1);

                                                                                successCallback();
                                                                            },
                                                                        
                                                                            (error:ServiceError) =>
                                                                            {
                                                                                errorCallback(error);
                                                                            });
        }, 500);
    }
}

export let examMemService = new ExamMemService();
