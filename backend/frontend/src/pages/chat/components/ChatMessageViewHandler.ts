import { ChatMessage } from "../../../vo/ChatMessage.js";
import { ChatMessageView } from "./ChatMessageView.js";

export class ChatMessageViewHandler
{
    private chatMessageView:ChatMessageView;

    constructor(chatMessageView:ChatMessageView)
    {
        this.chatMessageView = chatMessageView;
    }

    render(chatMessage:ChatMessage, parentElementId:string):void
    {
        this.chatMessageView.render(chatMessage, parentElementId);
    }
}
