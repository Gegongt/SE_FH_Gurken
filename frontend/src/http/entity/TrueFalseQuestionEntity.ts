import { QuestionEntity } from "./QuestionEntity.js";
import { QuestionEntityType } from "./QuestionEntityType.js";

export class TrueFalseQuestionEntity extends QuestionEntity
{
    private isTrue:boolean;

    constructor(id:number, examId:number, question:string, questionType:QuestionEntityType, isTrue:boolean)
    {
        super(id, examId, question, questionType);

        this.isTrue = isTrue;
    }

    getIsTrue():boolean
    {
        return this.isTrue;
    }

    setIsTrue(isTrue:boolean):void
    {
        this.isTrue = isTrue;
    }
}