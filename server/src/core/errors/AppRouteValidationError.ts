import { AppError } from "./AppError";
import * as Joi from 'joi';
export class AppRouteValidationError extends AppError {
    protected message = "invalid_request"

    parse(error: Joi.ValidationError): AppRouteValidationError {
        this.debug(error);
        
        this.payload = {
            errors: [],
            invalid: error._object
        }

        error.details.forEach((e) => {
            (this.payload as any).errors.push({
                path: e.path,
                type: e.type,
                context: e.context
            })
        })
        return this;
    }
}