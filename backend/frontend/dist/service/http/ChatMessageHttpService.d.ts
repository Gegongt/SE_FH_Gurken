import { ChatMessage } from "../../vo/ChatMessage.js";
export declare class ChatMessageHttpService {
    private subcategoryId;
    private socket;
    init(subcategoryId: number, getHistoryCallback: (messages: ChatMessage[]) => void, getMessageCallback: (message: ChatMessage) => void): void;
    sendMessage(chatMessage: ChatMessage): void;
}
//# sourceMappingURL=ChatMessageHttpService.d.ts.map