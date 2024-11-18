import { NextFunction, Request, Response } from "express";
import { academicSemesterService } from "./service";
import sendResponse from "../../../shared/sendResponse";
import { AcademicSemester } from "@prisma/client";
import httpStatus from "http-status";
import catchAsnc from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { searchAndFilterableFields } from "../../../constants/academicSemester";
import { paginationFields } from "../../../constants/pagination";

const createAcademicSemester = catchAsnc(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await academicSemesterService.createAcademicSemester(
        req.body
      );
      sendResponse<AcademicSemester>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic Semester created",
        data: result,
      });
    } catch (error) {
      // sendResponse(res,{
      //     statusCode:httpStatus.NOT_IMPLEMENTED,
      //     success:false,
      //     message:'Academic semester not craeted',
      //     data:null
      // })
      next(error);
    }
  }
);

const getAllSemesters = catchAsnc(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = pick(req.query, searchAndFilterableFields);
      const paginationOptions = pick(req.query, paginationFields);
      const result = await academicSemesterService.getAllSemesters(
        filters,
        paginationOptions
      );
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message:
          result.meta.total > 0 ? "All Semester list" : "No records found!",
        meta: result.meta,
        data: result.data,
      });
    } catch (error) {
      // sendResponse(res,{
      //     statusCode:httpStatus.NOT_IMPLEMENTED,
      //     success:false,
      //     message:'Somethin error',
      //     data:null
      // })
      next(error);
    }
  }
);

const getSingleSemester = catchAsnc(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await academicSemesterService.getSingleSemester(req.params.id);
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Data found for given Id",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

const updateSemester = catchAsnc(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await academicSemesterService.updateSemester(req.params.id,req.body);
        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Update Academic Semester for given Id",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  );

const deleteSemester = catchAsnc(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await academicSemesterService.deleteSemester(req.params.id);
        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Delete Academic Semester for given Id",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  );

export const academicSemesterController = {
  createAcademicSemester,
  getAllSemesters,
  getSingleSemester,
  updateSemester,
  deleteSemester
};
