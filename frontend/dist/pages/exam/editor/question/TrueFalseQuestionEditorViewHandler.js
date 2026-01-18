export class TrueFalseQuestionEditorViewHandler {
    constructor(trueFalseQuestionEditorView) {
        this.parentElementId = null;
        this.removed = false;
        this.trueFalseQuestionEditorView = trueFalseQuestionEditorView;
    }
    render(question, parentElementId) {
        this.parentElementId = parentElementId;
        this.trueFalseQuestionEditorView.bindRemoveQuestionButton(() => {
            this.remove();
        });
        this.trueFalseQuestionEditorView.render(question, this.parentElementId);
    }
    remove() {
        this.removed = true;
        this.trueFalseQuestionEditorView.remove();
    }
    getOriginalQuestion() {
        return this.trueFalseQuestionEditorView.getOriginalQuestion();
    }
    getUpdatedQuestion() {
        if (!this.removed) {
            return this.trueFalseQuestionEditorView.getUpdatedQuestion();
        }
        else {
            return null;
        }
    }
}
//# sourceMappingURL=TrueFalseQuestionEditorViewHandler.js.map