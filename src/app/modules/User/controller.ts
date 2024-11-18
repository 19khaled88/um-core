import { Request, Response } from "express";
import catchAsnc from "../../../shared/catchAsync";
import { userService } from "./services";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";


const createStudent = catchAsnc(async(req:Request,res:Response)=>{
    try {
        const {student, ...data} = req.body
        const result = await userService.createStudent(
            student,data
        )

        sendResponse(res,{
            statusCode:httpStatus.OK,
            success:true,
            message:'User created successfully',
            data:result
        })
    } catch (error) {
        const errorMessage = error instanceof  ApiError ? error.message : 'Failed to create user'
        sendResponse(res,{
            statusCode:httpStatus.BAD_REQUEST,
            success:false,
            message:errorMessage,
            data:null
        })
    }
})

const createFaculty = catchAsnc(async(req:Request,res:Response)=>{
    try {
        const {faculty, ...data} = req.body
        const result = await userService.createFaculty(
            faculty,data
        )

        sendResponse(res,{
            statusCode:httpStatus.OK,
            success:true,
            message:'User created successfully',
            data:result
        })
    } catch (error) {
        sendResponse(res,{
            statusCode:httpStatus.BAD_REQUEST,
            success:false,
            message:'Failed to create user',
            data:null
        })
    }
})

export const userController = {
    createFaculty,
    createStudent
}

