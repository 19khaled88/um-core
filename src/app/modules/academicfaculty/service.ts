import { AcademicFaculty, Prisma, PrismaClient } from "@prisma/client";
import {
  IGenericResponse,
  IPagniationOptions,
} from "../../../shared/interfaces";
import { IAcademicFacultyFilters, ICondition, sortOrder } from "./interface";
import { paginationHelper } from "../../../helper/paginationHelper";
import {
  academicSemesternumericSearchableFields,
 
} from "../../../constants/academicSemester";
import { academicSemesterTitleCodeMapper } from "./constants";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { academicFacultySearchableFiels } from "../../../constants/academicFaculty";

const prisma = new PrismaClient();

const createFaculty = async (
  payload: AcademicFaculty
): Promise<AcademicFaculty> => {
    const result = await prisma.academicFaculty.create({
      data: payload,
    });

    return result;
};

const getAllFaculties= async (
  filters: IAcademicFacultyFilters,
  paginationOptions: IPagniationOptions
): Promise<IGenericResponse<AcademicFaculty[]>> => {
    const { searchTerm, ...filterData } = filters;
    const { limit, page, skip, sortBy, sortOrder } =
      paginationHelper.calculatePagination(paginationOptions);

    const sortConditions: { [key: string]: sortOrder } = {};

    const andCondition: ICondition[] = [];

    if (searchTerm) {
      andCondition.push({
        OR: academicFacultySearchableFiels.map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: "insensitive" as Prisma.QueryMode,
          },
        })),
      });
    }

    if (Object.keys(filterData).length) {
      andCondition.push({
        AND: Object.entries(filterData).map(([field, value]) => ({
          [field]: value as string | number | boolean | null,
        })),
      });
    }

    if (sortBy && sortOrder) {
      sortConditions[sortBy] = sortOrder as sortOrder;
    }

    const whereConditions:Prisma.AcademicFacultyWhereInput = andCondition.length > 0 ? {AND:andCondition} : {}

    const result = await prisma.academicFaculty.findMany({
      // where: {AND: andCondition.length > 0 ? andCondition : undefined},
      where:whereConditions,
      orderBy: sortConditions,
      skip,
      take: limit,
    });

    let total = await prisma.academicFaculty.count({
      // where: {AND: andCondition.length > 0 ? andCondition : undefined,}
      where:whereConditions
    });

    if (result.length === 0 && searchTerm) {
      const searchTermAsNumber = Number(searchTerm);
      if (!isNaN(searchTermAsNumber)) {
        andCondition.length = 0;
        andCondition.push({
          OR: academicFacultySearchableFiels.map((field) => ({
            [field]: searchTermAsNumber,
          })),
        });

        const result = await prisma.academicFaculty.findMany({
          // where: { AND: andCondition.length > 0 ? andCondition : undefined },
          where:whereConditions,
          orderBy: sortConditions,
          skip,
          take: limit,
        });

        // Count the total matching documents
        total = await prisma.academicFaculty.count({
          // where: { AND: andCondition.length > 0 ? andCondition : undefined},
          where:whereConditions
        });
      }
    }

    return {
      meta: {
        total,
        limit: 10,
        page: 1,
      },
      data: result,
    };
};

const getSingleFaculty = async(id:string):Promise<AcademicFaculty | null>=>{
    const result = await prisma.academicFaculty.findUnique({
      where: { id }
    })
    return result
}

const updateFaculty = async(id:string,payload:Partial<AcademicFaculty>):Promise<AcademicFaculty>=>{
    
    const result = await prisma.academicFaculty.update({
        where:{id},
        data:payload
    })
    return result
}

const deleteFaculty = async(id:string):Promise<AcademicFaculty>=>{
    const result = await prisma.academicFaculty.delete({
        where:{id}
    })
    return result
}

export const academicfacultyService = {
  createFaculty,
  getAllFaculties,
  getSingleFaculty,
  updateFaculty,
  deleteFaculty
};
