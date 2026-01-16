import { Question } from "./Question.js";

export class TrueFalseQuestion extends Question
{
    private isTrue:boolean;

    constructor(id:number, question:string, isTrue:boolean)
    {
        super(id, question);

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
