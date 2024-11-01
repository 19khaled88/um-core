import { NextFunction, Request, Response } from "express";

import sendResponse from "../../../shared/sendResponse";
import { AcademicFaculty } from "@prisma/client";
import httpStatus from "http-status";
import catchAsnc from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { academicfacultyService } from "./service";
import { academicFacultySearchableFiels } from "../../../constants/academicFaculty";

const createFaculty = catchAsnc(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await academicfacultyService.createFaculty(
        req.body
      );
      sendResponse<AcademicFaculty>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "New Faculty created",
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

const getAllFaculties = catchAsnc(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = pick(req.query, academicFacultySearchableFiels);
      const paginationOptions = pick(req.query, paginationFields);
      const result = await academicfacultyService.getAllFaculties(
        filters,
        paginationOptions
      );
      sendResponse<AcademicFaculty[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message:
          result.meta.total > 0 ? "All Faculty List" : "No records found!",
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

const getSingleFaculty = catchAsnc(
  async (req: Request, res: Response, next: NextFunction) => {
    
    try {
      const result = await academicfacultyService.getSingleFaculty(req.params.id);
      sendResponse<AcademicFaculty>(res, {
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

const updateFaculty = catchAsnc(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await academicfacultyService.updateFaculty(req.params.id,req.body);
        sendResponse<AcademicFaculty>(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Update Faculty for given Id",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  );


const deleteFaculty = catchAsnc(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await academicfacultyService.deleteFaculty(req.params.id);
        sendResponse<AcademicFaculty>(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Delete Faculty for given Id",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  );

export const academicfacultyController = {
  createFaculty,
  getAllFaculties,
  getSingleFaculty,
  updateFaculty,
  deleteFaculty
};
