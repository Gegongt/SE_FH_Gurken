import { Option } from "./Option.js";
/**
 * This class represents an option that can be correct or wrong.
 */
export class AnaswerOption extends Option {
    constructor(selected, content, isCorrect) {
        super(selected, content);
        this.isCorrect = isCorrect;
    }
    getIsCorrect() {
        return this.isCorrect;
    }
    setIsCorrect(isCorrect) {
        this.isCorrect = isCorrect;
    }
}
//# sourceMappingURL=AnswerOption.js.map