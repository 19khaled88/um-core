import { Request, Response } from "express";
import catchAsnc from "../../../shared/catchAsync";
import { semesterRegistrationService } from "./service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import pick from "../../../shared/pick";
import { searchAndFilterableFields } from "../../../constants/semesterRegistration";
import { paginationFields } from "../../../constants/pagination";


const createSemesterRegistration = catchAsnc(
  async (req: Request, res: Response) => {
    try {
      const result =
        await semesterRegistrationService.createSemesterRegistration(req.body);
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
          : "Semester registration not created";
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: false,
        message: errorMessage,
        data: null,
      });
    }
  }
);

const getAllSemesterRegistration = catchAsnc(
  async (req: Request, res: Response) => {
    try {
      const filters = pick(req.query, searchAndFilterableFields);
      const paginationOptions = pick(req.query, paginationFields);
      const result =
        await semesterRegistrationService.getAllSemesterRegistrations(
          filters,
          paginationOptions
        );
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
          : "Failed to get Semester Registrations";
      sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: errorMessage,
        data: null,
      });
    }
  }
);

const getSinglSemesterRegistration = catchAsnc(
  async (req: Request, res: Response) => {
    try {
      const result =
        await semesterRegistrationService.getSingleSemesterRegistration(
          req.params.id
        );
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Single semester registration found!",
        data: result,
      });
    } catch (error) {
      const errorMessage = 
        error instanceof ApiError
          ? error.message
          : "Semester registration not found for given ID";
      sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: errorMessage,
        data: null,
      });
    }
  }
);

const deleteSemesterRegistration = catchAsnc(
  async (req: Request, res: Response) => {
    try {
      const result =
        await semesterRegistrationService.deleteSemesterRegistration(
          req.params.id
        );
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Semester registration deleted for given ID!",
        data: result,
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "Semester registration not deleted",
        data: null,
      });
    }
  }
);

const updateSemesterRegistration = catchAsnc(
  async (req: Request, res: Response) => {
    try {
      const result =
        await semesterRegistrationService.updateSemesterRegistration(
          req.params.id,
          req.body
        );
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Semester registration updated for given ID!",
        data: result,
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "Semester registration not updated",
        data: null,
      });
    }
  }
);

export const semesterRegistrationController = {
  createSemesterRegistration,
  getAllSemesterRegistration,
  getSinglSemesterRegistration,
  deleteSemesterRegistration,
  updateSemesterRegistration,
};
