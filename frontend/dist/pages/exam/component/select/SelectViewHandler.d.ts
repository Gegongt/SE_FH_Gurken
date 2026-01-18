import { Option } from "./Option.js";
import { SelectView } from "./SelectView.js";
export declare class SelectViewHandler {
    private selectView;
    private removable;
    private multipleSelection;
    private parentElementId;
    constructor(selectView: SelectView, removable?: boolean, multipleSelection?: boolean);
    render(options: Option[], parentElementId: string): void;
    getSelection(): Option[];
    getSelectionIndexes(): number[];
    getSelectionContent(): string[];
    getOptions(): Option[];
    addOption(option: Option): void;
    select(index: number): void;
    unselect(index: number): void;
    selectOption(option: Option): void;
    unselectOption(option: Option): void;
    selectAll(): void;
    unselectAll(): void;
}
//# sourceMappingURL=SelectViewHandler.d.ts.map