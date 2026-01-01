import { ServiceError } from "./ServiceError.js";

export class InvalidValueError extends ServiceError
{
  constructor(message:string)
  {
    super(message);
  }
}
