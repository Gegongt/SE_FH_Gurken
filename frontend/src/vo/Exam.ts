import { Question } from "./Question.js";
import { User } from "./User.js";

export class Exam
{
    private id:number;
    private name:string;
    private questions:Question[];
    private creator:User;

    constructor(id:number, name:string, questions:Question[], creator:User)
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

    setId(id:number):void
    {
        this.id = id;
    }

    getName():string
    {
        return this.name;
    }

    setName(name:string):void
    {
        this.name = name;
    }

    getQuestions():Question[]
    {
        return this.questions;
    }

    setQuestions(questions:Question[]):void
    {
        this.questions = questions;
    }

    getCreator():User
    {
        return this.creator;
    }

    setCreator(creator:User):void
    {
        this.creator = creator;
    }
}