import { ServiceError } from "../../service/error/ServiceError.js";
import { serviceFactory } from "../../service/factory/ServiceFactory.js";
import { ServiceName } from "../../service/factory/ServiceName.js";
import { locationUtil } from "../../util/LocationUtil.js";
import { urlUtil } from "../../util/URLUtil.js";
import { ChatMessage } from "../../vo/ChatMessage.js";
import { User } from "../../vo/User.js";
import { HeaderView } from "../components/header/HeaderView.js";
import { HeaderViewHandler } from "../components/header/HeaderViewHandler.js";
import { ChatMessageView } from "./components/ChatMessageView.js";
import { ChatMessageViewHandler } from "./components/ChatMessageViewHandler.js";

function showMessage(chatMessage:ChatMessage, parentElementId:string)
{
  let chatMessageViewHandler = new ChatMessageViewHandler(new ChatMessageView());
  chatMessageViewHandler.render(chatMessage, parentElementId);
}

function loadPage(subcategoryId:number, user:User):void
{
    let headerViewHandler = new HeaderViewHandler(new HeaderView());
    headerViewHandler.render("header");

    let chatMessageService = serviceFactory.getHttpService(ServiceName.CHAT_MESSAGE);
    chatMessageService.init(subcategoryId,
    (messages:ChatMessage[]) =>
    {
      messages.forEach((message:ChatMessage) =>
      {
        showMessage(message, "chatMessages");
      })
    },
  
    (message:ChatMessage) =>
    {
      showMessage(message, "chatMessages");
    });

    let messageInputField:HTMLInputElement = document.getElementById("messageInput") as HTMLInputElement;
    let sendButton:HTMLButtonElement = document.getElementById("sendButton") as HTMLButtonElement;

    sendButton.addEventListener("click", () =>
    {
      const message = messageInputField.value;

      if(message.trim() === "")
      {
        return;
      }

      chatMessageService.sendMessage(new ChatMessage(-1, user.getId() as string, subcategoryId, user.getName(), message, undefined));
      messageInputField.value = "";
    });
}

serviceFactory.getService(ServiceName.USER).getCurrentUser((user:User|null) =>
{
    if(user === null)
    {
        locationUtil.redirectToLoginPage();
    }

    const subcategoryId:number = Number(urlUtil.getParam("subcategoryId"));

    if(!subcategoryId)
    {
        locationUtil.redirectToMainPage();
    }

    else
    {
        loadPage(subcategoryId, user as User);
    }
},

(error:ServiceError) =>
{
    console.log("Error: " + error);
    locationUtil.redirectToMainPage();
});
