import { Request, Response } from "express";
import catchAsnc from "../../../shared/catchAsync";
import { buildingService } from "./service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import pick from "../../../shared/pick";
import { searchAndFilterableFields } from "../../../constants/building";
import { paginationFields } from "../../../constants/pagination";

const createBuilding = catchAsnc(async (req: Request, res: Response) => {
  try {
    const result = await buildingService.createBuilding(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Building created successfully",
      data: result,
    });
  } catch (error) {
    const errorMessage =
      error instanceof ApiError ? error.message : "Failed to create building";
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: errorMessage,
      data: null,
    });
  }
});

const getAllBuilding = catchAsnc(async(req:Request, res:Response)=>{
  try {
      const filters = pick(req.query, searchAndFilterableFields);
      const paginationOptions = pick(req.query, paginationFields);
      const result = await buildingService.getAllBuilding(
          filters,
          paginationOptions
      )
      sendResponse(res,{
          statusCode:httpStatus.OK,
          success:true,
          message:'All buildings found!',
          data:result
      })
  } catch (error) {
      sendResponse(res,{
          statusCode:httpStatus.BAD_REQUEST,
          success:false,
          message:'No building found',
          data:null
      })
  }

})

const getSingleBuilding = catchAsnc(async(req:Request,res:Response)=>{
  try {
      const result = await buildingService.getSingleBuilding(req.params.id)
      sendResponse(res,{
          statusCode:httpStatus.OK,
          success:true,
          message:'Single building found!',
          data:result
      })
  } catch (error) {
      sendResponse(res,{
          statusCode:httpStatus.BAD_REQUEST,
          success:false,
          message:'Building not found for given ID',
          data:null
      })
  }
})

const deleteBuilding = catchAsnc(async(req:Request,res:Response)=>{
  try {
      const result = await buildingService.deleteBuilding(req.params.id)
      sendResponse(res,{
          statusCode:httpStatus.OK,
          success:true,
          message:'Building deleted for given ID!',
          data:result
      })
  } catch (error) {
      sendResponse(res,{
          statusCode:httpStatus.BAD_REQUEST,
          success:false,
          message:'Building not deleted',
          data:null
      })
  }
})

const updateBuilding = catchAsnc(async(req:Request,res:Response)=>{
  try {
      const result = await buildingService.updateBuilding(req.params.id,req.body)
      sendResponse(res,{
          statusCode:httpStatus.OK,
          success:true,
          message:'Building updated for given ID!',
          data:result
      })
  } catch (error) {
      sendResponse(res,{
          statusCode:httpStatus.BAD_REQUEST,
          success:false,
          message:'Building not updated',
          data:null
      })
  }
})



export const buildingController = {
    createBuilding,
    getAllBuilding,
    getSingleBuilding,
    deleteBuilding,
    updateBuilding
}
