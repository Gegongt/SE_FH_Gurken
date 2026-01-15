import { ObjectNotFoundError } from "./error/ObjectNotFoundError.js";
import { ServiceError } from "./error/ServiceError.js";
import { Question } from "../vo/Question.js";
import { MCQuestion } from "../vo/MCQuestion.js";
import { TrueFalseQuestion } from "../vo/TrueFalseQuestion.js";

class QuestionMemService
{
    private questions:Question[];
    private nextQuestionId:number;
    
    public constructor()
    {
        if(localStorage.getItem("questions"))
        {
            let storedQuestions:any[] = JSON.parse(localStorage.getItem("questions") as string); //these question objects do not have the methods of a real Question object, because these methods are not contained in the JSON representation that is used for storage in the localStorage
            
            this.questions = [];

            for(let storedQuestion of storedQuestions)
            {
                this.questions.push((storedQuestion.isTrue !== undefined) ? new TrueFalseQuestion(storedQuestion.id, storedQuestion.question, storedQuestion.isTrue) : new MCQuestion(storedQuestion.id, storedQuestion.question, storedQuestion.correctAnswers, storedQuestion.wrongAnswers));
            }

            this.nextQuestionId = this.questions[this.questions.length - 1]!.getId() + 1;
        }

        else
        {
            this.questions = [];
            this.nextQuestionId = 1;

            this.questions.push(new MCQuestion(this.nextQuestionId++, "Which of the following are true?",
                                [
                                    "At the time of his retirement in 1999, he held 61 NHL records: 40 regular season records, 15 playoff records, and 6 All-Star records",
                                    "Wayne Gretzky (born January 26, 1961) is a Canadian former professional ice hockey player.",
                                    "Wayne Gretzky played 20 seasons in the National Hockey League (NHL) for four teams from 1979 to 1999."
                                ],

                                [
                                    "Gretzky was the top scorer in the 1978 World Championships.",
                                    "10 years after his retirement in 1999, Gretzky was inducted into the Hockey Hall of Fame."
                                ]));

            this.questions.push(new MCQuestion(this.nextQuestionId++, "Which of the following is true for water (H2O)?",
                                [
                                    "Water (H2O) is a polar inorganic compound",
                                    "Water differs from most liquids in that it becomes less dense as it freezes.",
                                    "Water is at room temperature a tasteless and odorless liquid."
                                ],
                                
                                [
                                    "In a lake or ocean, water at 10 °C sinks to the bottom, and ice forms on the surface, floating on the liquid water",
                                    "At a pressure of one atmosphere (atm), ice melts or water freezes at 0°C and water boils or vapor condenses at 90°C"
                                ]));

            this.questions.push(new MCQuestion(this.nextQuestionId++, "Is 42 the answer to everything?",
                                [
                                    "Yes"
                                ],
                            
                                [
                                    "No",
                                    "The answer is somewhere out there...",
                                    "I don't know",
                                    "Maybe"
                                ]));

            this.questions.push(new TrueFalseQuestion(this.nextQuestionId++, "The density of gold is 19.32 g/cm³.", true));

            this.saveData();
        }
    }

    private saveData()
    {
        localStorage.setItem("questions", JSON.stringify(this.questions));
    }

    private getQuestionIndexSync(id:number):number
    {
        for(let i = 0; i < this.questions.length; i++)
        {
            if(this.questions[i]!.getId() === id)
            {
                return i;
            }
        }

        return -1;
    }

    private getQuestionSync(id:number):Question|null
    {
        let questionIndex = this.getQuestionIndexSync(id);

        return (questionIndex !== -1) ? (this.questions[questionIndex] as Question) : null;
    }

    getQuestion(id:number, successCallback:(question:Question) => void, errorCallback:(error:ServiceError) => void):void
    {
        setTimeout(() =>
        {
            let question:Question|null = this.getQuestionSync(id);

            if(question !== null)
            {
                successCallback(question);
            }

            else
            {
                errorCallback(new ObjectNotFoundError("Question<" + id + "> has not been found!"));
            }
        }, 500);
    }

    getQuestions(ids:number[], successCallback:(questions:Question[]) => void, errorCallback:(error:ServiceError) => void):void
    {
        setTimeout(() =>
        {
            let questions:Question[] = [];

            for(let id of ids)
            {
                let question = this.getQuestionSync(id);

                if(question === null)
                {
                    errorCallback(new ObjectNotFoundError("Question<" + id + "> has not been found!"));
                    return;
                }

                else
                {
                    questions.push(question);
                }
            }

            successCallback(questions);
        }, 500);
    }

    createQuestion(question:Question, successCallback:(id:number) => void, errorCallback:(error:ServiceError) => void):void
    {
        setTimeout(() =>
        {
            question.setId(this.nextQuestionId++);
            this.questions.push(question);

            this.saveData();
            successCallback(question.getId());
        }, 500);
    }

    createQuestions(questions:Question[], successCallback:(ids:number[]) => void, errorCallback:(error:ServiceError) => void):void
    {
        setTimeout(() =>
        {
            let ids:number[] = [];

            for(let question of questions)
            {
                question.setId(this.nextQuestionId++);
                this.questions.push(question);

                ids.push(question.getId());
            }

            this.saveData();
            successCallback(ids);
        }, 500);
    }

    updateQuestion(question:Question, successCallback:() => void, errorCallback:(error:ServiceError) => void):void
    {
        setTimeout(() =>
        {
            let questionIndex = this.getQuestionIndexSync(question.getId());

            if(questionIndex !== -1)
            {
                question.setId(this.questions[questionIndex]!.getId());
                this.questions[questionIndex] = question;

                this.saveData();
                successCallback();
            }

            else
            {
                errorCallback(new ObjectNotFoundError("Question<" + question.getId() + "> has not been found!"));
            }
        }, 500);
    }

    updateQuestions(questions:Question[], successCallback:() => void, errorCallback:(error:ServiceError) => void):void
    {
        setTimeout(() =>
        {
            for(let question of questions)
            {
                let questionIndex = this.getQuestionIndexSync(question.getId());

                if(questionIndex !== -1)
                {
                    question.setId(this.questions[questionIndex]!.getId());
                    this.questions[questionIndex] = question;
                }

                else
                {
                    errorCallback(new ObjectNotFoundError("Question<" + question.getId() + "> has not been found!"));
                    return;
                }
            }

            this.saveData();
            successCallback();
        }, 500);
    }

    deleteQuestion(id:number, successCallback:() => void, errorCallback:(error:ServiceError) => void):void
    {
        setTimeout(() =>
        {
            let questionIndex = this.getQuestionIndexSync(id);

            if(questionIndex !== -1)
            {
                this.questions.splice(questionIndex, 1);

                this.saveData();
                successCallback();
            }

            else
            {
                errorCallback(new ObjectNotFoundError("Question<" + id + "> has not been found!"));
            }
        }, 500);
    }

    deleteQuestions(ids:number[], successCallback:() => void, errorCallback:(error:ServiceError) => void):void
    {
        setTimeout(() =>
        {
            for(let id of ids)
            {
                let questionIndex = this.getQuestionIndexSync(id);

                if(questionIndex !== -1)
                {
                    this.questions.splice(questionIndex, 1);
                }

                else
                {
                    errorCallback(new ObjectNotFoundError("Question<" + id + "> has not been found!"));
                    return;
                }
            }

            this.saveData();
            successCallback();
        }, 500);
    }
}

export let questionMemService = new QuestionMemService();
