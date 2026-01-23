import { converter } from "../../http/entity/util/Converter.js";
import { accessTokenUtil } from "./AccessTokenUtil.js";
export class ChatMessageHttpService {
    constructor() {
        this.subcategoryId = null;
    }
    init(subcategoryId, getHistoryCallback, getMessageCallback) {
        this.subcategoryId = subcategoryId;
        this.socket = io({ auth: { token: `Bearer ${accessTokenUtil.getAccessToken()}` } });
        this.socket.on("connect", () => {
            this.socket.emit("join_subcategory", { subcategoryId }, (ack) => {
                if (!ack?.ok) {
                    console.error("Joining chat failed.");
                }
            });
            this.socket.on("history", (payload) => {
                let chatMessages = [];
                for (let message of payload.messages) {
                    chatMessages.push(converter.convertChatMessageEntityToChatMessage(message));
                }
                getHistoryCallback(chatMessages);
            });
            this.socket.on("message", (message) => {
                getMessageCallback(converter.convertChatMessageEntityToChatMessage(message.message));
            });
            this.socket.on("connect_error", (error) => {
                if (error.message) {
                    console.error("Connection error: " + error?.message);
                }
                else {
                    console.error("Connection error:");
                    console.log(error);
                }
            });
        });
    }
    sendMessage(chatMessage) {
        this.socket.emit("message", converter.convertChatMessageToChatMessageEntity(chatMessage));
    }
}
//# sourceMappingURL=ChatMessageHttpService.js.map