import { Option } from "./Option.js";
import { SelectView } from "./SelectView.js";

export class SelectViewHandler
{
    private selectView:SelectView;
    private removable:boolean;
    private multipleSelection:boolean;
    private parentElementId:string|null = null;
    
    constructor(selectView:SelectView, removable:boolean = false, multipleSelection:boolean = true)
    {
        this.selectView = selectView;
        this.removable = removable;
        this.multipleSelection = multipleSelection;
    }

    render(options:Option[], parentElementId:string):void
    {
        this.parentElementId = parentElementId;

        this.selectView.bindRemoveButton((option:Option) =>
        {
            this.selectView.removeOption(option);
        });

        this.selectView.render(options, this.parentElementId, this.removable, this.multipleSelection);
    }

    getSelection():Option[]
    {
        return this.selectView.getSelection();
    }

    getSelectionIndexes():number[]
    {
        return this.selectView.getSelectionIndexes();
    }

    getSelectionContent():string[]
    {
        return this.selectView.getSelectionContent();
    }

    getOptions():Option[]
    {
        return this.selectView.getOptions();
    }

    addOption(option:Option):void
    {
        this.selectView.addOption(option, this.removable, this.multipleSelection);
    }

    select(index:number):void
    {
        this.selectView.select(index);
    }

    unselect(index:number):void
    {
        this.selectView.unselect(index);
    }

    selectOption(option:Option):void
    {
        this.selectView.selectOption(option);
    }

    unselectOption(option:Option):void
    {
        this.selectView.unselectOption(option);
    }

    selectAll():void
    {
        this.selectView.selectAll();
    }

    unselectAll():void
    {
        this.selectView.unselectAll();
    }
}
