import { Request, Response } from "express";
import catchAsnc from "../../../shared/catchAsync";
import { offeredCourseService } from "./services";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";

const createOfferedCourse = catchAsnc(
    async (req: Request, res: Response) => {
      try {
        const result =
          await offeredCourseService.createOfferedCourse(req.body);
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
            : "Offered course not created";
        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: false,
          message: errorMessage,
          data: null,
        });
      }
    }
  );

export const offeredCourseController = {
    createOfferedCourse
}