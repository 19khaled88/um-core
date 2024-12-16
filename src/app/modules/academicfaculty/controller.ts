import { NextFunction, Request, Response } from "express";

import sendResponse from "../../../shared/sendResponse";
import { AcademicFaculty } from "@prisma/client";
import httpStatus from "http-status";
import catchAsnc from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { academicfacultyService } from "./service";
import { academicFacultySearchableFiels } from "../../../constants/academicFaculty";

const createAcademicFaculty = catchAsnc(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await academicfacultyService.createAcademicFaculty(
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

const getAllAcademicFaculties = catchAsnc(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = pick(req.query, academicFacultySearchableFiels);
      const paginationOptions = pick(req.query, paginationFields);
      const result = await academicfacultyService.getAllAcademicFaculties(
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

const getSingleAcademicFaculty = catchAsnc(
  async (req: Request, res: Response, next: NextFunction) => {
    
    try {
      const result = await academicfacultyService.getSingleAcademicFaculty(req.params.id);
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

const updateAcademicFaculty = catchAsnc(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await academicfacultyService.updateAcademicFaculty(req.params.id,req.body);
        sendResponse<AcademicFaculty>(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Updated Faculty for given Id",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  );

const deleteAcademicFaculty = catchAsnc(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await academicfacultyService.deleteAcademicFaculty(req.params.id);
        sendResponse<AcademicFaculty>(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Deleted Faculty for given Id",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  );

export const academicfacultyController = {
  createAcademicFaculty,
  getAllAcademicFaculties,
  getSingleAcademicFaculty,
  updateAcademicFaculty,
  deleteAcademicFaculty
};
