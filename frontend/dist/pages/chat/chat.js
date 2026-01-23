import { serviceFactory } from "../../service/factory/ServiceFactory.js";
import { ServiceName } from "../../service/factory/ServiceName.js";
import { locationUtil } from "../../util/LocationUtil.js";
import { urlUtil } from "../../util/URLUtil.js";
import { ChatMessage } from "../../vo/ChatMessage.js";
import { HeaderView } from "../components/header/HeaderView.js";
import { HeaderViewHandler } from "../components/header/HeaderViewHandler.js";
import { ChatMessageView } from "./components/ChatMessageView.js";
import { ChatMessageViewHandler } from "./components/ChatMessageViewHandler.js";
function showMessage(chatMessage, parentElementId) {
    let chatMessageViewHandler = new ChatMessageViewHandler(new ChatMessageView());
    chatMessageViewHandler.render(chatMessage, parentElementId);
}
function loadPage(subcategoryId, user) {
    let headerViewHandler = new HeaderViewHandler(new HeaderView());
    headerViewHandler.render("header");
    let chatMessageService = serviceFactory.getHttpService(ServiceName.CHAT_MESSAGE);
    chatMessageService.init(subcategoryId, (messages) => {
        messages.forEach((message) => {
            showMessage(message, "chatMessages");
        });
    }, (message) => {
        showMessage(message, "chatMessages");
    });
    let messageInputField = document.getElementById("messageInput");
    let sendButton = document.getElementById("sendButton");
    sendButton.addEventListener("click", () => {
        const message = messageInputField.value;
        if (message.trim() === "") {
            return;
        }
        chatMessageService.sendMessage(new ChatMessage(-1, user.getId(), subcategoryId, user.getName(), message, undefined));
        messageInputField.value = "";
    });
}
serviceFactory.getService(ServiceName.USER).getCurrentUser((user) => {
    if (user === null) {
        locationUtil.redirectToLoginPage();
    }
    const subcategoryId = Number(urlUtil.getParam("subcategoryId"));
    if (!subcategoryId) {
        locationUtil.redirectToMainPage();
    }
    else {
        loadPage(subcategoryId, user);
    }
}, (error) => {
    console.log("Error: " + error);
    locationUtil.redirectToMainPage();
});
//# sourceMappingURL=chat.js.map