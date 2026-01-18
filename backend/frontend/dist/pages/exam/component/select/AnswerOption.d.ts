import { Option } from "./Option.js";
/**
 * This class represents an option that can be correct or wrong.
 */
export declare class AnaswerOption extends Option {
    private isCorrect;
    constructor(selected: boolean, content: string, isCorrect: boolean);
    getIsCorrect(): boolean;
    setIsCorrect(isCorrect: boolean): void;
}
//# sourceMappingURL=AnswerOption.d.ts.map