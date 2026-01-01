import { ServiceError } from "./ServiceError.js";

export class ObjectNotFoundError extends ServiceError
{
  constructor(message:string)
  {
    super(message);
  }
}
