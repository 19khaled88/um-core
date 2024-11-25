import { Request, Response } from "express";
import catchAsnc from "../../../shared/catchAsync";
import { courseService } from "./services";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import pick from "../../../shared/pick";
import { searchAndFilterableFields } from "../../../constants/course";
import { paginationFields } from "../../../constants/pagination";

const createCourse = catchAsnc(async (req: Request, res: Response) => {
  try {
    const result = await courseService.createCourse(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Course created",
      data: result,
    });
  } catch (error) {
    const errorMessage =
      error instanceof ApiError ? error.message : "Course not created";
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: errorMessage,
      data: null,
    });
  }
});

const getAllCourse = catchAsnc(async (req: Request, res: Response) => {
  try {
    const filters = pick(req.query, searchAndFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);
    const result = await courseService.getAllCourse(filters, paginationOptions);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: false,
      message: "Course created successfully",
      data: result,
    });
  } catch (error) {
    const errorMessage =
      error instanceof ApiError
        ? error.message
        : "Course or course not found for given ID";
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: false,
      message: errorMessage,
      data: null,
    });
  }
});

const singleCourse = catchAsnc(async (req: Request, res: Response) => {
  try {
    const result = await courseService.getSingleCourse(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: false,
      message: "Course created successfully",
      data: result,
    });
  } catch (error) {
    const errorMessage =
      error instanceof ApiError
        ? error.message
        : "Course not found for given ID";
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: false,
      message: errorMessage,
      data: null,
    });
  }
});

const deleteCourse = catchAsnc(async (req: Request, res: Response) => {
  try {
    const result = await courseService.deleteCourse(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: false,
      message: "Course deleted successfully",
      data: result,
    });
  } catch (error) {
    const errorMessage =
      error instanceof ApiError
        ? error.message
        : "Course not deleted for given ID";
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: false,
      message: errorMessage,
      data: null,
    });
  }
});

const updateCourse = catchAsnc(async (req: Request, res: Response) => {
  try {
    const result = await courseService.updateCourse(req.params.id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: false,
      message: "Course updated successfully",
      data: result,
    });
  } catch (error) {
    const errorMessage =
      error instanceof ApiError
        ? error.message
        : "Course not updated for given ID";
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: false,
      message: errorMessage,
      data: null,
    });
  }
});

const assignFaculty = catchAsnc(async (req: Request, res: Response) => {
  try {
    const result = await courseService.assignFaculty(
      req.params.id,
      req.body.faculties
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Faculty assigned successfully to course",
      data: result,
    });
  } catch (error) {
    const errorMessage =
      error instanceof ApiError
        ? error.message
        : "Faculty did not assign for given ID";
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: errorMessage,
      data: null,
    });
  }
});

const removeFaculty = catchAsnc(async (req: Request, res: Response) => {
  try {
    const result = await courseService.removeFaculty(
      req.params.id,
      req.body.faculties
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Faculty removed successfully from course",
      data: result,
    });
  } catch (error) {
    const errorMessage =
      error instanceof ApiError
        ? error.message
        : "Faculty did not remove for given ID";
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: errorMessage,
      data: null,
    });
  }
});

export const courseController = {
  createCourse,
  getAllCourse,
  singleCourse,
  deleteCourse,
  updateCourse,
  assignFaculty,
  removeFaculty,
};
