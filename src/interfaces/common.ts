import { Model } from "mongoose";
import { IGenericErrorMessage } from "./error"



export type IGenericErrorResponse ={
    statusCode:number,
    message:string,
    errorMessage:IGenericErrorMessage[]
}



