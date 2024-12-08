import { AcademicSemester, Prisma, PrismaClient } from "@prisma/client";
import {
  IGenericResponse,
  IPagniationOptions,
} from "../../../shared/interfaces";
import { IAcademicSemeterFilters, ICondition, sortOrder } from "./interface";
import { paginationHelper } from "../../../helper/paginationHelper";
import {
  academicSemesternumericSearchableFields,
  academicSemesterSearchableFields,
} from "../../../constants/academicSemester";
import { academicSemesterTitleCodeMapper } from "./constants";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

const prisma = new PrismaClient();

const createAcademicSemester = async (
  payload: AcademicSemester
): Promise<AcademicSemester> => {
  const {title,code,year} = payload


  // Optionally, you can set the code based on the mapper if needed
  if(academicSemesterTitleCodeMapper[title] !== code){
    throw new ApiError(400,'Invalid Semester Code')
  }else{

    const ifExist = await prisma.academicSemester.findFirst({
      where:{
        year:year,
        title:title,
        code:code
      }
    })

    if(ifExist){
      throw new ApiError(httpStatus.BAD_REQUEST,'This semester already exist')
    }
    const result = await prisma.academicSemester.create({
      data: payload,
    });
  
    return result;
  }

};

const getAllSemesters = async (
  filters: IAcademicSemeterFilters,
  paginationOptions: IPagniationOptions
): Promise<IGenericResponse<AcademicSemester[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: sortOrder } = {};

  const andCondition: ICondition[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: academicSemesterSearchableFields.map((field) => ({
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

  const whereConditions:Prisma.AcademicSemesterWhereInput = andCondition.length > 0 ? {AND:andCondition} : {}

  const result = await prisma.academicSemester.findMany({
    // where: {AND: andCondition.length > 0 ? andCondition : undefined},
    where:whereConditions,
    orderBy: sortConditions,
    skip,
    take: limit,
  });

  let total = await prisma.academicSemester.count({
    // where: {AND: andCondition.length > 0 ? andCondition : undefined,}
    where:whereConditions
  });

  if (result.length === 0 && searchTerm) {
    const searchTermAsNumber = Number(searchTerm);
    if (!isNaN(searchTermAsNumber)) {
      andCondition.length = 0;
      andCondition.push({
        OR: academicSemesternumericSearchableFields.map((field) => ({
          [field]: searchTermAsNumber,
        })),
      });

      const result = await prisma.academicSemester.findMany({
        // where: { AND: andCondition.length > 0 ? andCondition : undefined },
        where:whereConditions,
        orderBy: sortConditions,
        skip,
        take: limit,
      });

      // Count the total matching documents
      total = await prisma.academicSemester.count({
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

const getSingleSemester = async(id:string):Promise<AcademicSemester | null>=>{
    const result = await prisma.academicSemester.findUnique({
        where:{
            id
        }
    })

    return result
}

const updateSemester = async(id:string,payload:Partial<AcademicSemester>):Promise<AcademicSemester>=>{
    if(payload.title && payload.code && academicSemesterTitleCodeMapper[payload.title] !== payload.code){
        throw new ApiError(httpStatus.BAD_REQUEST,'Semester must match with relevent code requirement')
    }else{
        const result = await prisma.academicSemester.update({
            where:{id},
            data:payload
        })
    
        return result
    }

    
}

const deleteSemester = async(id:string):Promise<AcademicSemester>=>{
    const result = await prisma.academicSemester.delete({
        where:{id}
    })
    return result
}

export const academicSemesterService = {
  createAcademicSemester,
  getAllSemesters,
  getSingleSemester,
  updateSemester,
  deleteSemester
};
