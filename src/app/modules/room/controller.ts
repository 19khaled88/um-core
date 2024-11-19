import { Request, Response } from "express";
import catchAsnc from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { roomService } from "./service";
import pick from "../../../shared/pick";
import { searchAndFilterableFields } from "../../../constants/room";
import { paginationFields } from "../../../constants/pagination";

const createRoom = catchAsnc(async (req: Request, res: Response) => {
  try {
    const result = await roomService.createRoom(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Room created successfully",
      data: result,
    });
  } catch (error) {
    const errorMessage =
      error instanceof ApiError ? error.message : "Failed to create room";
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: errorMessage,
      data: null,
    });
  }
});

const getAllRoom = catchAsnc(async(req:Request, res:Response)=>{
  try {
      const filters = pick(req.query, searchAndFilterableFields);
      const paginationOptions = pick(req.query, paginationFields);
      const result = await roomService.getAllRoom(
          filters,
          paginationOptions
      )
      sendResponse(res,{
          statusCode:httpStatus.OK,
          success:true,
          message:'All rooms found!',
          data:result
      })
  } catch (error) {
      sendResponse(res,{
          statusCode:httpStatus.BAD_REQUEST,
          success:false,
          message:'No room found',
          data:null
      })
  }

})

const getSinglRoom = catchAsnc(async(req:Request,res:Response)=>{
  try {
      const result = await roomService.getSingleRoom(req.params.id)
      sendResponse(res,{
          statusCode:httpStatus.OK,
          success:true,
          message:'Single room found!',
          data:result
      })
  } catch (error) {
      sendResponse(res,{
          statusCode:httpStatus.BAD_REQUEST,
          success:false,
          message:'Room not found for given ID',
          data:null
      })
  }
})

const deleteRoom = catchAsnc(async(req:Request,res:Response)=>{
  try {
      const result = await roomService.deleteRoom(req.params.id)
      sendResponse(res,{
          statusCode:httpStatus.OK,
          success:true,
          message:'Room deleted for given ID!',
          data:result
      })
  } catch (error) {
      sendResponse(res,{
          statusCode:httpStatus.BAD_REQUEST,
          success:false,
          message:'Room not deleted',
          data:null
      })
  }
})

const updateRoom = catchAsnc(async(req:Request,res:Response)=>{
  try {
      const result = await roomService.updateRoom(req.params.id,req.body)
      sendResponse(res,{
          statusCode:httpStatus.OK,
          success:true,
          message:'Room updated for given ID!',
          data:result
      })
  } catch (error) {
      sendResponse(res,{
          statusCode:httpStatus.BAD_REQUEST,
          success:false,
          message:'Room not updated',
          data:null
      })
  }
})

export const roomController = {
    createRoom,
    getAllRoom,
    getSinglRoom,
    deleteRoom,
    updateRoom
}