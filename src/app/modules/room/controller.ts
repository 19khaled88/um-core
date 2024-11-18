import { Request, Response } from "express";
import catchAsnc from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { roomService } from "./service";

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

export const roomController = {
    createRoom
}