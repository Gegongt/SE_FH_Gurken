import { Option } from "./Option.js";

export class SelectView
{
    private parentElementId:string|null = null;
    private selectionElement:HTMLDivElement|null = null;
    private optionContainer:HTMLDivElement|null = null;

    private removeButtonClickHandler:(option:Option) => void = (option:Option) => {};

    private options:Option[] = [];
    private renderedOptions:HTMLDivElement[] = [];

    selectOrUnselect(index:number):void
    {
        let option = this.options[index];

        if(!option!.getSelected())
        {
            this.select(index);
        }

        else
        {
            this.unselect(index);
        }
    }

    select(index:number):void
    {
        this.options[index]!.setSelected(true);
        
        this.renderedOptions[index]!.classList.remove("unselectedOption");
        this.renderedOptions[index]!.classList.add("selectedOption");
    }

    unselect(index:number):void
    {
        this.options[index]!.setSelected(false);
        
        this.renderedOptions[index]!.classList.remove("selectedOption");
        this.renderedOptions[index]!.classList.add("unselectedOption");
    }

    selectOption(option:Option):void
    {
        this.select(this.options.indexOf(option));
    }

    unselectOption(option:Option):void
    {
        this.unselect(this.options.indexOf(option));
    }

    selectAll():void
    {
        for(let i = 0; i < this.options.length; i++)
        {
            this.select(i);
        }
    }

    unselectAll(skipIndexes:number[] = []):void
    {
        for(let i = 0; i < this.options.length; i++)
        {
            if(!skipIndexes.includes(i))
            {
                this.unselect(i);
            }
        }
    }

    addOption(option:Option, removable:boolean = false, multipleSelection:boolean = true):void
    {
        this.options!.push(option);

        let renderedOption = document.createElement("div");
        renderedOption.classList.add(option.getSelected() ? "selectedOption" : "unselectedOption");
        renderedOption.classList.add("mt-2", "p-1", "d-flex", "justify-content-between", "align-items-center");
        renderedOption.innerHTML = `<div>` + option.getContent() + "</div>";

        if(removable)
        {
            let removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.innerHTML = `<i class = "bi bi-trash-fill"></i></button>`;
            removeButton.classList.add("btn", "btn-secondary", "p-2");

            removeButton.addEventListener("click", () =>
            {
                this.options.splice(this.options.indexOf(option), 1);
                this.renderedOptions.splice(this.renderedOptions.indexOf(renderedOption), 1);

                renderedOption.remove();
            });

            renderedOption.appendChild(removeButton);
        }

        renderedOption.addEventListener("click", () =>
        {
            let optionIndex = this.options.indexOf(option);

            if(!multipleSelection)
            {
                this.unselectAll([optionIndex]);
            }

            this.selectOrUnselect(optionIndex);
        });

        this.renderedOptions.push(renderedOption);
        this.optionContainer!.appendChild(renderedOption);
    }

    removeOption(option:Option):void
    {
        let optionIndex = this.options.indexOf(option);

        this.options.splice(optionIndex, 1);

        let renderedOption = this.renderedOptions[optionIndex];
        this.renderedOptions.splice(optionIndex, 1);
        renderedOption!.remove();
    }

    bindRemoveButton(clickHandler:(option:Option) => void):void
    {
        this.removeButtonClickHandler = clickHandler;
    }

    renderOptions(options:Option[], removable:boolean = false, multipleSelection = true):void
    {
        if(this.optionContainer !== null)
        {
            this.optionContainer.remove();
        }

        this.options = [];
        this.renderedOptions = [];

        this.optionContainer = document.createElement("div");
        this.selectionElement!.appendChild(this.optionContainer);

        for(let option of options)
        {
            this.addOption(option, removable, multipleSelection);
        }
    }

    render(options:Option[], parentElementId:string, removable:boolean = false, multipleSelection:boolean = true):void
    {
        this.options = [];

        this.parentElementId = parentElementId;
        let parentElement = document.getElementById(this.parentElementId);

        this.selectionElement = document.createElement("div");
        this.selectionElement.classList.add("nonSelectable");
        this.renderOptions(options, removable, multipleSelection);

        parentElement!.appendChild(this.selectionElement);
    }

    getSelection():Option[]
    {
        let indexes = this.getSelectionIndexes();
        let selectedOptions:Option[] = [];

        for(let i of indexes)
        {
            selectedOptions.push(this.options[i] as Option);
        }

        return selectedOptions;
    }

    getSelectionIndexes():number[]
    {
        let indexes:number[] = [];

        if(this.options)
        {
            for(let i = 0; i < this.options.length; i++)
            {
                if(this.options[i]!.getSelected())
                {
                    indexes.push(i);
                }
            }
        }

        return indexes;
    }

    getSelectionContent():string[]
    {
        let content:string[] = [];

        if(this.options)
        {
            let indexes = this.getSelectionIndexes();
            
            for(let index of indexes)
            {
                content.push(this.options[index]!.getContent());
            }
        }

        return content;
    }

    getOptions():Option[]
    {
        return this.options || [];
    }
}
