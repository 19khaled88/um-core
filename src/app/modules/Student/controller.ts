import { Request, Response } from "express";
import catchAsnc from "../../../shared/catchAsync";
import { studentServices } from "./service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { searchAndFilterableFields } from "../../../constants/student";

const getAllStudent = catchAsnc(async (req: Request, res: Response) => {
  try {
    const filters = pick(req.query, searchAndFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);
    const result = await studentServices.getAllStudent(
      filters,
      paginationOptions
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Students found!",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "No student found",
      data: null,
    });
  }
});

const getSingleStudent = catchAsnc(async (req: Request, res: Response) => {
  try {
    const result = await studentServices.getSingleStudent(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Single student found!",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Student not found for given ID",
      data: null,
    });
  }
});

const deleteStudent = catchAsnc(async (req: Request, res: Response) => {
  try {
    const result = await studentServices.deleteStudent(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Student deleted for given ID!",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Student not deleted",
      data: null,
    });
  }
});

const updateStudent = catchAsnc(async (req: Request, res: Response) => {
  try {
    const result = await studentServices.updateStudent(req.params.id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Student updated for given ID!",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Student not updated",
      data: null,
    });
  }
});

const myCourses = catchAsnc(async (req: Request, res: Response) => {
  try {
    const result = await studentServices.myCourses(req.params.id);
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
});

export const studentController = {
  getAllStudent,
  getSingleStudent,
  deleteStudent,
  updateStudent,
  myCourses
};
