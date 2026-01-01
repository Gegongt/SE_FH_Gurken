import { AppError } from "../../error/AppError.js";

export class ServiceError extends AppError
{  
    constructor(message:string)
    {
        super(message);
    }
}
