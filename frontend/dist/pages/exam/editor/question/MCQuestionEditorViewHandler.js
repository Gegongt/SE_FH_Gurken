export class MCQuestionEditorViewHandler {
    constructor(mcQuestionEditorView) {
        this.parentElementId = null;
        this.removed = false;
        this.mcQuestionEditorView = mcQuestionEditorView;
    }
    render(question, parentElementId) {
        this.parentElementId = parentElementId;
        this.mcQuestionEditorView.bindAddAnswerButton((addAnswerInputField) => {
            let answerText = addAnswerInputField.value;
            if (answerText) //should not be empty
             {
                this.mcQuestionEditorView.addAnswer(answerText);
                addAnswerInputField.value = "";
            }
        });
        this.mcQuestionEditorView.bindRemoveQuestionButton(() => {
            this.remove();
        });
        this.mcQuestionEditorView.render(question, this.parentElementId);
    }
    remove() {
        this.removed = true;
        this.mcQuestionEditorView.remove();
    }
    isRemoved() {
        return this.removed;
    }
    getOriginalQuestion() {
        return this.mcQuestionEditorView.getOriginalQuestion();
    }
    getUpdatedQuestion() {
        if (!this.removed) {
            return this.mcQuestionEditorView.getUpdatedQuestion();
        }
        else {
            return null;
        }
    }
}
//# sourceMappingURL=MCQuestionEditorViewHandler.js.map