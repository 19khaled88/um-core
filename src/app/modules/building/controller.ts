import { Request, Response } from "express";
import catchAsnc from "../../../shared/catchAsync";
import { buildingService } from "./service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";

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

export const buldingController = {
    createBuilding
}
