export class SelectViewHandler {
    constructor(selectView, removable = false, multipleSelection = true) {
        this.parentElementId = null;
        this.selectView = selectView;
        this.removable = removable;
        this.multipleSelection = multipleSelection;
    }
    render(options, parentElementId) {
        this.parentElementId = parentElementId;
        this.selectView.bindRemoveButton((option) => {
            this.selectView.removeOption(option);
        });
        this.selectView.render(options, this.parentElementId, this.removable, this.multipleSelection);
    }
    getSelection() {
        return this.selectView.getSelection();
    }
    getSelectionIndexes() {
        return this.selectView.getSelectionIndexes();
    }
    getSelectionContent() {
        return this.selectView.getSelectionContent();
    }
    getOptions() {
        return this.selectView.getOptions();
    }
    addOption(option) {
        this.selectView.addOption(option, this.removable, this.multipleSelection);
    }
    select(index) {
        this.selectView.select(index);
    }
    unselect(index) {
        this.selectView.unselect(index);
    }
    selectOption(option) {
        this.selectView.selectOption(option);
    }
    unselectOption(option) {
        this.selectView.unselectOption(option);
    }
    selectAll() {
        this.selectView.selectAll();
    }
    unselectAll() {
        this.selectView.unselectAll();
    }
}
//# sourceMappingURL=SelectViewHandler.js.map