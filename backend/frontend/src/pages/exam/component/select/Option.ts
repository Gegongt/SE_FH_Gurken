export class Option
{
    private selected:boolean;
    private content:string;

    constructor(selected:boolean, content:string)
    {
        this.selected = selected;
        this.content = content;
    }

    getSelected():boolean
    {
        return this.selected;
    }

    setSelected(selected:boolean):void
    {
        this.selected = selected;
    }

    getContent():string
    {
        return this.content;
    }

    setContent(content:string):void
    {
        this.content = content;
    }
}
