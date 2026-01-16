import { Option } from "./Option.js";

/**
 * This class represents an option that can be correct or wrong.
 */
export class AnaswerOption extends Option
{
    private isCorrect:boolean;

    constructor(selected:boolean, content:string, isCorrect:boolean)
    {
        super(selected, content);

        this.isCorrect = isCorrect;
    }

    getIsCorrect():boolean
    {
        return this.isCorrect;
    }

    setIsCorrect(isCorrect:boolean):void
    {
        this.isCorrect = isCorrect;
    }
}
