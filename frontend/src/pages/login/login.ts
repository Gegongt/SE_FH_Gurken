import { LoginView } from "./LoginView.js";
import { LoginViewHandler } from "./LoginViewHandler.js";

let loginViewHandler = new LoginViewHandler(new LoginView());
loginViewHandler.render("content");
