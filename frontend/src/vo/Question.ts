export class Question
{
    private id:number;
    private question:string;

    constructor(id:number, question:string)
    {
        this.id = id;
        this.question = question;
    }

    getId():number
    {
        return this.id;
    }

    setId(id:number):void
    {
        this.id = id;
    }

    getQuestion():string
    {
        return this.question;
    }

    setQuestion(question:string):void
    {
        this.question = question;
    }
}
