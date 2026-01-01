import { ServiceError } from "./ServiceError.js";

export class ObjectAlreadyExists extends ServiceError
{
  constructor(message:string)
  {
    super(message);
  }
}
