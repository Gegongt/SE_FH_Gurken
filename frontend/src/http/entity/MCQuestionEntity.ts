import { QuestionEntity } from "./QuestionEntity.js";
import { QuestionEntityType } from "./QuestionEntityType.js";

export class MCQuestionEntity extends QuestionEntity
{
    private correctAnswers:string[];
    private wrongAnswers:string[];
    
    constructor(id:number, examId:number, question:string, questionType:QuestionEntityType, correctAnswers:string[], wrongAnswers:string[])
    {
        super(id, examId, question, questionType);

        this.correctAnswers = correctAnswers;
        this.wrongAnswers = wrongAnswers;
    }

    getCorrectAnswers():string[]
    {
        return this.correctAnswers;
    }

    setCorrectAnswers(correctAnswers:string[]):void
    {
        this.correctAnswers = correctAnswers;
    }

    getWrongAnswers():string[]
    {
        return this.wrongAnswers;
    }

    setWrongAnswers(wrongAnswers:string[]):void
    {
        this.wrongAnswers = wrongAnswers;
    }
}
