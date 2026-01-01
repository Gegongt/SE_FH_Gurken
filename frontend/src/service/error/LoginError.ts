import { ServiceError } from "./ServiceError.js";

export class LoginError extends ServiceError
{
  constructor(message:string)
  {
    super(message);
  }
}
