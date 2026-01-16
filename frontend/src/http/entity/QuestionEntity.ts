import { QuestionEntityType } from "./QuestionEntityType.js";

export class QuestionEntity
{
    private id:number;
    private examId:number;
    private question:string;
    private questionType:QuestionEntityType;

    constructor(id:number, examId:number, question:string, questionType:QuestionEntityType)
    {
        this.id = id;
        this.examId = examId;
        this.question = question;
        this.questionType = questionType;
    }

    getId():number
    {
        return this.id;
    }

    setId(id:number):void
    {
        this.id = id;
    }

    getExamId():number
    {
        return this.examId;
    }

    setExamId(examId:number):void
    {
        this.examId = examId;
    }

    getQuestion():string
    {
        return this.question;
    }

    setQuestion(question:string):void
    {
        this.question = question;
    }

    getQuestionType():QuestionEntityType
    {
        return this.questionType;
    }

    setQuestionType(questionType:QuestionEntityType):void
    {
        this.questionType = questionType;
    }
}
