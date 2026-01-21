import { ServiceError } from "../../service/error/ServiceError.js";
import { serviceFactory } from "../../service/factory/ServiceFactory.js";
import { ServiceName } from "../../service/factory/ServiceName.js";
import { accessTokenUtil } from "../../service/http/AccessTokenUtil.js";
import { locationUtil } from "../../util/LocationUtil.js";
import { urlUtil } from "../../util/URLUtil.js";
import { User } from "../../vo/User.js";
import { HeaderView } from "../components/header/HeaderView.js";
import { HeaderViewHandler } from "../components/header/HeaderViewHandler.js";

declare const io: any; //from the socket library

function loadSocket(subcategoryId:number):any
{
  const socket = io({auth: {token: `Bearer ${accessTokenUtil.getAccessToken()}`}});

  socket.on("connect", () =>
  {
    socket.emit("join_subcategory", { subcategoryId }, (ack: any) =>
    {
      if(!ack?.ok)
      {
        console.error("Join failed:", ack?.error);
      }

      else
      {
        console.log("Joined");
      }
    });
  });

  // 4) History bekommen
  socket.on("history", (payload: any) =>
  {
    payload.messages.forEach((message:any) =>
    {
      showMessage(message, "chatMessages");
    });
    // payload = { subcategoryId, messages: [...] }
    console.log("History:", payload.subcategoryId, payload.messages);
  });

  socket.on("message", (message:any) =>
  {
    showMessage(message.message, "chatMessages");
  });

  socket.on("connect_error", (err: any) =>
  {
    if(err.message)
    {
      console.error("Connection error: ", err?.message);        
    }

    else
    {
      console.error("Connecton error:");
      console.log(err);
    }
  });

  return socket;
}

function showMessage(chatMessage:any, parentElementId:string)
{
  let messageElement = document.createElement("div");
  messageElement.innerHTML =
  `
    <div>
      <p>${chatMessage.message}</p>
    </div>`

  document.getElementById(parentElementId)!.appendChild(messageElement);
}

function loadPage(subcategoryId:number, user:User):void
{
    let headerViewHandler = new HeaderViewHandler(new HeaderView());
    headerViewHandler.render("header");

    let socket = loadSocket(subcategoryId);

    let messageInputField:HTMLInputElement = document.getElementById("messageInput") as HTMLInputElement;
    let sendButton:HTMLButtonElement = document.getElementById("sendButton") as HTMLButtonElement;

    sendButton.addEventListener("click", () =>
    {
      const message = messageInputField.value;

      if(message.trim() === "")
      {
        return;
      }

      socket.emit("message",
      {
        userid: 123,
        subcategoryId: subcategoryId,
        name: user.getName(),
        message: message
      });

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

    if(!subcategoryId) //a new exam is being created
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
