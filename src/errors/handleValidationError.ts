import { IGenericErrorResponse } from "../interfaces/common";
import { Prisma } from "@prisma/client";


const handleValidationError =(err:Prisma.PrismaClientValidationError):IGenericErrorResponse=>{
    const errors = [
        {
            path:"",
            message:err.message,
        }
    ]

    const statusCode = 400 
    return{
        statusCode,
        message:'Validation Error',
        errorMessage:errors
    }
}

export default handleValidationError