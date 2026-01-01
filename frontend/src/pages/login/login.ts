import { LoginView } from "./LoginView.js";
import { LoginViewHandler } from "./LoginViewHandler.js";

const loginViewHandler = new LoginViewHandler(new LoginView());
loginViewHandler.render("login");
