import { Option } from "./Option.js";
export declare class SelectView {
    private parentElementId;
    private selectionElement;
    private optionContainer;
    private removeButtonClickHandler;
    private options;
    private renderedOptions;
    selectOrUnselect(index: number): void;
    select(index: number): void;
    unselect(index: number): void;
    selectOption(option: Option): void;
    unselectOption(option: Option): void;
    selectAll(): void;
    unselectAll(skipIndexes?: number[]): void;
    addOption(option: Option, removable?: boolean, multipleSelection?: boolean): void;
    removeOption(option: Option): void;
    bindRemoveButton(clickHandler: (option: Option) => void): void;
    renderOptions(options: Option[], removable?: boolean, multipleSelection?: boolean): void;
    render(options: Option[], parentElementId: string, removable?: boolean, multipleSelection?: boolean): void;
    getSelection(): Option[];
    getSelectionIndexes(): number[];
    getSelectionContent(): string[];
    getOptions(): Option[];
}
//# sourceMappingURL=SelectView.d.ts.map