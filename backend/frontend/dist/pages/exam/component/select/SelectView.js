export class SelectView {
    constructor() {
        this.parentElementId = null;
        this.selectionElement = null;
        this.optionContainer = null;
        this.removeButtonClickHandler = (option) => { };
        this.options = [];
        this.renderedOptions = [];
    }
    selectOrUnselect(index) {
        let option = this.options[index];
        if (!option.getSelected()) {
            this.select(index);
        }
        else {
            this.unselect(index);
        }
    }
    select(index) {
        this.options[index].setSelected(true);
        this.renderedOptions[index].classList.remove("unselectedOption");
        this.renderedOptions[index].classList.add("selectedOption");
    }
    unselect(index) {
        this.options[index].setSelected(false);
        this.renderedOptions[index].classList.remove("selectedOption");
        this.renderedOptions[index].classList.add("unselectedOption");
    }
    selectOption(option) {
        this.select(this.options.indexOf(option));
    }
    unselectOption(option) {
        this.unselect(this.options.indexOf(option));
    }
    selectAll() {
        for (let i = 0; i < this.options.length; i++) {
            this.select(i);
        }
    }
    unselectAll(skipIndexes = []) {
        for (let i = 0; i < this.options.length; i++) {
            if (!skipIndexes.includes(i)) {
                this.unselect(i);
            }
        }
    }
    addOption(option, removable = false, multipleSelection = true) {
        this.options.push(option);
        let renderedOption = document.createElement("div");
        renderedOption.classList.add(option.getSelected() ? "selectedOption" : "unselectedOption");
        renderedOption.classList.add("mt-2", "p-1", "d-flex", "justify-content-between", "align-items-center");
        renderedOption.innerHTML = `<div>` + option.getContent() + "</div>";
        if (removable) {
            let removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.innerHTML = `<i class = "bi bi-trash-fill"></i></button>`;
            removeButton.classList.add("btn", "btn-secondary", "p-2");
            removeButton.addEventListener("click", () => {
                this.options.splice(this.options.indexOf(option), 1);
                this.renderedOptions.splice(this.renderedOptions.indexOf(renderedOption), 1);
                renderedOption.remove();
            });
            renderedOption.appendChild(removeButton);
        }
        renderedOption.addEventListener("click", () => {
            let optionIndex = this.options.indexOf(option);
            if (!multipleSelection) {
                this.unselectAll([optionIndex]);
            }
            this.selectOrUnselect(optionIndex);
        });
        this.renderedOptions.push(renderedOption);
        this.optionContainer.appendChild(renderedOption);
    }
    removeOption(option) {
        let optionIndex = this.options.indexOf(option);
        this.options.splice(optionIndex, 1);
        let renderedOption = this.renderedOptions[optionIndex];
        this.renderedOptions.splice(optionIndex, 1);
        renderedOption.remove();
    }
    bindRemoveButton(clickHandler) {
        this.removeButtonClickHandler = clickHandler;
    }
    renderOptions(options, removable = false, multipleSelection = true) {
        if (this.optionContainer !== null) {
            this.optionContainer.remove();
        }
        this.options = [];
        this.renderedOptions = [];
        this.optionContainer = document.createElement("div");
        this.selectionElement.appendChild(this.optionContainer);
        for (let option of options) {
            this.addOption(option, removable, multipleSelection);
        }
    }
    render(options, parentElementId, removable = false, multipleSelection = true) {
        this.options = [];
        this.parentElementId = parentElementId;
        let parentElement = document.getElementById(this.parentElementId);
        this.selectionElement = document.createElement("div");
        this.selectionElement.classList.add("nonSelectable");
        this.renderOptions(options, removable, multipleSelection);
        parentElement.appendChild(this.selectionElement);
    }
    getSelection() {
        let indexes = this.getSelectionIndexes();
        let selectedOptions = [];
        for (let i of indexes) {
            selectedOptions.push(this.options[i]);
        }
        return selectedOptions;
    }
    getSelectionIndexes() {
        let indexes = [];
        if (this.options) {
            for (let i = 0; i < this.options.length; i++) {
                if (this.options[i].getSelected()) {
                    indexes.push(i);
                }
            }
        }
        return indexes;
    }
    getSelectionContent() {
        let content = [];
        if (this.options) {
            let indexes = this.getSelectionIndexes();
            for (let index of indexes) {
                content.push(this.options[index].getContent());
            }
        }
        return content;
    }
    getOptions() {
        return this.options || [];
    }
}
//# sourceMappingURL=SelectView.js.map