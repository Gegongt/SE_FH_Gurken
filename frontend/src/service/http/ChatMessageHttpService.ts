import { ChatMessageEntity } from "../../http/entity/ChatMessageEntity.js";
import { converter } from "../../http/entity/util/Converter.js";
import { ChatMessage } from "../../vo/ChatMessage.js";
import { accessTokenUtil } from "./AccessTokenUtil.js";

declare const io: any; //from the socket library

export class ChatMessageHttpService
{
    private subcategoryId:number|null = null;
    private socket:any;

    init(subcategoryId:number, getHistoryCallback:(messages:ChatMessage[]) => void, getMessageCallback:(message:ChatMessage) => void):void
    {
        this.subcategoryId = subcategoryId;

        this.socket = io({auth: {token: `Bearer ${accessTokenUtil.getAccessToken()}`}});

        this.socket.on("connect", () =>
        {
            this.socket.emit("join_subcategory", { subcategoryId }, (ack:any) =>
            {
                if(!ack?.ok)
                {
                    console.error("Joining chat failed.");
                }
            });

            this.socket.on("history", (payload:any) =>
            {
                let chatMessages:ChatMessage[] = [];

                for(let message of payload.messages)
                {
                    chatMessages.push(converter.convertChatMessageEntityToChatMessage(message));
                }

                getHistoryCallback(chatMessages);
            });

            this.socket.on("message", (message:any) =>
            {
                getMessageCallback(converter.convertChatMessageEntityToChatMessage(message.message));
            });

            this.socket.on("connect_error", (error:any) =>
            {
                if(error.message)
                {
                    console.error("Connection error: " + error?.message);
                }

                else
                {
                    console.error("Connection error:");
                    console.log(error);
                }
            });
        });
    }

    sendMessage(chatMessage:ChatMessage):void
    {
        this.socket.emit("message", converter.convertChatMessageToChatMessageEntity(chatMessage));
    }
}
