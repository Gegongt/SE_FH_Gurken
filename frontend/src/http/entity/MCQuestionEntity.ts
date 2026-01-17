import { QuestionEntity } from "./QuestionEntity.js";
import { QuestionEntityType } from "./QuestionEntityType.js";

export class MCQuestionEntity extends QuestionEntity
{
    public correctanswers:string[];
    public wronganswers:string[];
    
    constructor(id:number, examid:number, question:string, questiontype:QuestionEntityType, correctanswers:string[], wronganswers:string[])
    {
        super(id, examid, question, questiontype);

        this.correctanswers = correctanswers;
        this.wronganswers = wronganswers;
    }
}
