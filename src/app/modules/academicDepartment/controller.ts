import { NextFunction, Request, Response } from "express";

import sendResponse from "../../../shared/sendResponse";
import { AcademicDepartment } from "@prisma/client";
import httpStatus from "http-status";
import catchAsnc from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { academicDepartmentService } from "./service";
import { academicFacultySearchableFiels } from "../../../constants/academicFaculty";

const createAcademicDepartment = catchAsnc(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await academicDepartmentService.createAcademicDepartment(
        req.body
      );
      sendResponse<AcademicDepartment>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "New Academic department created",
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

const getAllAcademicDepartment = catchAsnc(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = pick(req.query, academicFacultySearchableFiels);
      const paginationOptions = pick(req.query, paginationFields);
      const result = await academicDepartmentService.getAllAcademicDepartments(
        filters,
        paginationOptions
      );
      sendResponse<AcademicDepartment[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message:
          result.meta.total > 0 ? "All Academic Department List" : "No records found!",
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

const getSingleAcademicDepartment = catchAsnc(
  async (req: Request, res: Response, next: NextFunction) => {
    
    try {
      const result = await academicDepartmentService.getSingleAcademicDepartment(req.params.id);
      sendResponse<AcademicDepartment>(res, {
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

const updateAcademicDepartment = catchAsnc(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await academicDepartmentService.updateAcademicDepartment(req.params.id,req.body);
        sendResponse<AcademicDepartment>(res, {
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


const deleteAcademicDepartment = catchAsnc(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await academicDepartmentService.deleteAcademicDepartment(req.params.id);
        sendResponse<AcademicDepartment>(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Delete Faculty for given Id",
          data: result,
        });
      } catch (error) {
        console.log(error)
        next(error);
      }
    }
  );

export const academicDepartmentController = {
  createAcademicDepartment,
  getAllAcademicDepartment,
  getSingleAcademicDepartment,
  updateAcademicDepartment,
  deleteAcademicDepartment
};
