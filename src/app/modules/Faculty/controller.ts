import { Request, Response } from "express"
import catchAsnc from "../../../shared/catchAsync"
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { facultyService } from "./service";
import pick from "../../../shared/pick";


const myCourses = catchAsnc(async(req:Request,res:Response)=>{
    try {
        const user = (req as any).user;
        const filter = pick(req.query, ['academicSemesterId','courseId'])
        const result = await facultyService.myCourses(user,filter);
        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "My applied courses",
          data: result,
        });
      } catch (error) {
        sendResponse(res, {
          statusCode: httpStatus.BAD_REQUEST,
          success: false,
          message: "No course applied for yet",
          data: null,
        });
      }
})

export const facultyControllter = {
    myCourses
}