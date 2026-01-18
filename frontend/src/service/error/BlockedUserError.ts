import { ServiceError } from "./ServiceError.js";

export class BlockedUserError extends ServiceError
{
  constructor(message:string)
  {
    super(message);
  }
}
