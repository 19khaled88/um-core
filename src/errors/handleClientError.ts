
import { Prisma } from "@prisma/client";
import { IGenericErrorMessage } from "../interfaces/error";

export const handleClientError=(err:Prisma.PrismaClientKnownRequestError)=>{

    let errors:IGenericErrorMessage[] = []
    let message =""
    const statusCode = 400;

    if(err.code === 'P2025'){
        message = (err.meta?.cause as string) || 'Record not found!'
        errors =[
            {
                path:"",
                message
            }
        ]
    }
    else if(err.code === 'P2003'){
        if(err.message.includes('delete()` invocation:')){
            message="Delete failed"
            errors =[
                {
                    path:'',
                    message
                }
            ]
        }
    }
    return{
        statusCode,
        message:message,
        errorMessage:errors
    }
}