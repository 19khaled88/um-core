import { Request, Response } from "express";
import catchAsnc from "../../../shared/catchAsync";
import { offeredCourseSectionService } from "./service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";


const createOfferedCourseSection = catchAsnc(
    async (req: Request, res: Response) => {
      try {
        const result =
          await offeredCourseSectionService.createOfferedCourseSection(req.body);
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
            : "Offered course section not created";
        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: false,
          message: errorMessage,
          data: null,
        });
      }
    }
  );

export const offeredCourseSectionController = {
    createOfferedCourseSection
}