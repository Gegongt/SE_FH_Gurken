import { QuestionEntityType } from "./QuestionEntityType.js";

export class QuestionEntity
{
    public id:number;
    public examid:number;
    public question:string;
    public questiontype:QuestionEntityType;

    constructor(id:number, examid:number, question:string, questiontype:QuestionEntityType)
    {
        this.id = id;
        this.examid = examid;
        this.question = question;
        this.questiontype = questiontype;
    }
}
