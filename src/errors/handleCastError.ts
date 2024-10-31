import mongoose from "mongoose";
import { IGenericErrorMessage } from "../interfaces/error";

export const handleCastError=(err:mongoose.Error.CastError)=>{

    const error:IGenericErrorMessage[] = [
        {
            path:err.path,
            message:err.message
        }
    ]
    const statusCode = 400;
    return{
        statusCode,
        message:'Cast error',
        errorMessage:error
    }
}