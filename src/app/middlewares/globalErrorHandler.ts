import { ErrorRequestHandler } from "express";
import { IGenericErrorMessage } from "../../interfaces/error";
import config from "../../config";
import ApiError from "../../errors/ApiError";
import handleValidationError from "../../errors/handleValidationError";
import { errorLogger } from "../../shared/logger/logger";
import { ZodError } from "zod";
import handleZodError from "../../errors/handleZodError";
import { handleClientError } from "../../errors/handleClientError";
import { Prisma } from "@prisma/client";

const globalErrorHandler:ErrorRequestHandler =(
    err,
    req,
    res,
    next
)=>{

    // config.env === 'development'?console.log('globalErrorHandler',err) : errorLogger.error('globalErrorHandler',err)
    
    let statusCode = 500;
    let message ='Something went wrong'
    let errorMessage:IGenericErrorMessage[] = []

    if(err instanceof ApiError){
        statusCode = err?.statusCode
        message = err?.message 
        errorMessage = err?.message?
        [
            {
                path:'',
                message:err?.message
            }
        ]:[]
    }
    else if(err instanceof Prisma.PrismaClientValidationError){
        const simplifiedError = handleValidationError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessage = simplifiedError.errorMessage
    }else if(err instanceof ZodError){
        const simplifiedError = handleZodError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessage = simplifiedError.errorMessage;
    }else if(err instanceof Prisma.PrismaClientKnownRequestError){
        const simplifiedError = handleClientError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessage = simplifiedError.errorMessage;
    }else if(err instanceof Error){
        message = err?.message; 
        errorMessage = err?.message?
        [
            {
                path:'',
                message:err?.message
            }
        ]:[]
    }

    res.status(statusCode).json({
        success:false,
        message,
        errorMessage,
        stack:config.env !== 'production' ? err?.stack : undefined,
    })
    
}

export default globalErrorHandler