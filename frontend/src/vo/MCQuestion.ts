import { Question } from "./Question.js";

export class MCQuestion extends Question
{
    private correctAnswers:string[];
    private wrongAnswers:string[];

    constructor(id:number, question:string, correctAnswers:string[], wrongAnswers:string[])
    {
        super(id, question);

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
