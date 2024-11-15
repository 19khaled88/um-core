import { Request, Response } from "express";
import catchAsnc from "../../../shared/catchAsync";
import { managementDepartmentService } from "./service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { searchAndFilterableFields } from "../../../constants/managementDepartment";


const createManagementDepartment = catchAsnc(async(req:Request, res:Response)=>{
    try {
        const result = await managementDepartmentService.createDepartment(req.body)
        sendResponse(res,{
            statusCode:httpStatus.OK,
            success:true,
            message:'Management department created successfully',
            data:result
        })
    } catch (error) {
        sendResponse(res,{
            statusCode:httpStatus.BAD_REQUEST,
            success:false,
            message:'Managment department not created',
            data:null
        })
    }

})
const getAllManagementDepartment = catchAsnc(async(req:Request, res:Response)=>{
    try {
        const filters = pick(req.query, searchAndFilterableFields);
        const paginationOptions = pick(req.query, paginationFields);
        const result = await managementDepartmentService.getAllManagementDepart(
            filters,
            paginationOptions
        )
        sendResponse(res,{
            statusCode:httpStatus.OK,
            success:true,
            message:'All Management department found!',
            data:result
        })
    } catch (error) {
        sendResponse(res,{
            statusCode:httpStatus.BAD_REQUEST,
            success:false,
            message:'No management department found',
            data:null
        })
    }

})

const getSingleManagementDepartment = catchAsnc(async(req:Request,res:Response)=>{
    try {
        const result = await managementDepartmentService.getSinglemanagementDeprt(req.params.id)
        sendResponse(res,{
            statusCode:httpStatus.OK,
            success:true,
            message:'Single Management department found!',
            data:result
        })
    } catch (error) {
        sendResponse(res,{
            statusCode:httpStatus.BAD_REQUEST,
            success:false,
            message:'Management department not found for given ID',
            data:null
        })
    }
})

const deleteManagementDepartment = catchAsnc(async(req:Request,res:Response)=>{
    try {
        const result = await managementDepartmentService.deleteManagementDeprt(req.params.id)
        sendResponse(res,{
            statusCode:httpStatus.OK,
            success:true,
            message:'Management department deleted for given ID!',
            data:result
        })
    } catch (error) {
        sendResponse(res,{
            statusCode:httpStatus.BAD_REQUEST,
            success:false,
            message:'Management department not deleted',
            data:null
        })
    }
})

const updateManagementDepartment = catchAsnc(async(req:Request,res:Response)=>{
    try {
        const result = await managementDepartmentService.updateManagementDeprt(req.params.id,req.body)
        sendResponse(res,{
            statusCode:httpStatus.OK,
            success:true,
            message:'Management department updated for given ID!',
            data:result
        })
    } catch (error) {
        sendResponse(res,{
            statusCode:httpStatus.BAD_REQUEST,
            success:false,
            message:'Management department not updated',
            data:null
        })
    }
})

export const managementDepartmentController = {
    createManagementDepartment,
    getAllManagementDepartment,
    getSingleManagementDepartment,
    deleteManagementDepartment,
    updateManagementDepartment
}