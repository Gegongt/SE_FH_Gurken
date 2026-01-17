import { QuestionEntity } from "./QuestionEntity.js";
import { QuestionEntityType } from "./QuestionEntityType.js";

export class TrueFalseQuestionEntity extends QuestionEntity
{
    public istrue:boolean;

    constructor(id:number, examid:number, question:string, questiontype:QuestionEntityType, istrue:boolean)
    {
        super(id, examid, question, questiontype);

        this.istrue = istrue;
    }
}
