import { ServiceError } from "./ServiceError.js";

export class NotAuthorizedError extends ServiceError
{
  constructor(message:string)
  {
    super(message);
  }
}
