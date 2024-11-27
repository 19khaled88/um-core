import { Request, Response } from "express";
import catchAsnc from "../../../shared/catchAsync";
import { offeredCourseScheduleService } from "./service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import pick from "../../../shared/pick";
import { searchAndFilterableFields } from "../../../constants/classSchedult";
import { paginationFields } from "../../../constants/pagination";

const create = catchAsnc(async(req:Request,res:Response)=>{
    try {
        const result =
          await offeredCourseScheduleService.create(req.body);
        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "",
          data: result,
        });
      } catch (error) {
        const errorMessage =
          error instanceof ApiError
            ? error.message
            : "Offered course class schedule not created";
        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: false,
          message: errorMessage,
          data: null,
        });
      }
})

const getAllClassSchedule= catchAsnc(async(req:Request, res:Response)=>{
  try {
      const filters = pick(req.query, searchAndFilterableFields);
      const paginationOptions = pick(req.query, paginationFields);
      const result = await offeredCourseScheduleService.getAllOfferedCourseSchedule(
          filters,
          paginationOptions
      )
      sendResponse(res,{
          statusCode:httpStatus.OK,
          success:true,
          message:'All class schedule found!',
          data:result
      })
  } catch (error) {
      sendResponse(res,{
          statusCode:httpStatus.BAD_REQUEST,
          success:false,
          message:'No class schedule found',
          data:null
      })
  }

})

export const offeredCourseClassScheduleController = {
    create,
    getAllClassSchedule
}