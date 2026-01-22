import { ChatMessage } from "../../../vo/ChatMessage.js";

export class ChatMessageView
{
    private formatDate(date:string):string
    {
        let formattedDate = new Date(date);

        return new Intl.DateTimeFormat("de-DE",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(formattedDate);
    }

    render(chatMessage:ChatMessage, parentElementId:string):void
    {
        let messageElement = document.createElement("div");
        messageElement.innerHTML = `
            <div class = "card message mt-2">
                <div class = "card-header message-header d-flex justify-content-between align-items-center p-2">
                    <div class = "userName p-1 me-2">${chatMessage.getName()}</div>
                    <div class = "date p-1">${this.formatDate(chatMessage.getCreatedAt())}</div>
                </div>

                <div class = "card-body p-2">
                    <p class = "card-text m-0">${chatMessage.getMessage()}</p>
                </div>
            </div>`;

        let parentElement = document.getElementById(parentElementId);
        parentElement!.appendChild(messageElement);
        parentElement!.scrollTo({top: parentElement!.scrollHeight, behavior: "smooth"});
    }
}
