import { AcademicDepartment, Prisma, PrismaClient } from "@prisma/client";
import {
  IGenericResponse,
  IPagniationOptions,
} from "../../../shared/interfaces";

import { paginationHelper } from "../../../helper/paginationHelper";
import { IAcademicDepartmentFilters, ICondition, sortOrder } from "./interface";
import { academicDepartmentSearchableFiels } from "../../../constants/academicDepartments";
import { RedisClient } from "../../../shared/redis";
import { EVENT_ACADEMIC_DEPARTMENT_CREATED, EVENT_ACADEMIC_DEPARTMENT_DELETED, EVENT_ACADEMIC_DEPARTMENT_UPDATED } from "./constants";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

const prisma = new PrismaClient();

const createAcademicDepartment = async (
  payload: AcademicDepartment
): Promise<AcademicDepartment> => {
    const result = await prisma.academicDepartment.create({
      data: payload,
    });
    
    if(result){
      RedisClient.publish(EVENT_ACADEMIC_DEPARTMENT_CREATED,JSON.stringify(result))
    }
    return result;
};

const getAllAcademicDepartments= async (
  filters: IAcademicDepartmentFilters,
  paginationOptions: IPagniationOptions
): Promise<IGenericResponse<AcademicDepartment[]>> => {
    const { searchTerm, ...filterData } = filters;
    const { limit, page, skip, sortBy, sortOrder } =
      paginationHelper.calculatePagination(paginationOptions);

    const sortConditions: { [key: string]: sortOrder } = {};

    const andCondition: ICondition[] = [];

    if (searchTerm) {
      andCondition.push({
        OR: academicDepartmentSearchableFiels.map((field) => ({
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

    const whereConditions:Prisma.AcademicDepartmentWhereInput = andCondition.length > 0 ? {AND:andCondition} : {}

    const result = await prisma.academicDepartment.findMany({
      // where: {AND: andCondition.length > 0 ? andCondition : undefined},
      where:whereConditions,
      orderBy: sortConditions,
      skip,
      take: limit,
      include:{
        academicFaculty:true,
        faculties:{
          select:{
            id:true,
            firstName:true,
            lastName:true,
            email:true
          }
        },
        students:{
          select:{
            id:true,
            firstName:true,
            lastName:true,
            email:true
          }
        }
      }
    });

    let total = await prisma.academicDepartment.count({
      // where: {AND: andCondition.length > 0 ? andCondition : undefined,}
      where:whereConditions
    });

    if (result.length === 0 && searchTerm) {
      const searchTermAsNumber = Number(searchTerm);
      if (!isNaN(searchTermAsNumber)) {
        andCondition.length = 0;
        andCondition.push({
          OR: academicDepartmentSearchableFiels.map((field) => ({
            [field]: searchTermAsNumber,
          })),
        });

        const result = await prisma.academicDepartment.findMany({
          // where: { AND: andCondition.length > 0 ? andCondition : undefined },
          where:whereConditions,
          orderBy: sortConditions,
          skip,
          take: limit,
        });

        // Count the total matching documents
        total = await prisma.academicDepartment.count({
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

const getSingleAcademicDepartment = async(id:string):Promise<AcademicDepartment | null>=>{
    const result = await prisma.academicDepartment.findUnique({
      where: { id },

      include:{
        faculties:{
          
        }
      }
    })
    
    return result
}

const updateAcademicDepartment = async(id:string,payload:Partial<AcademicDepartment>):Promise<AcademicDepartment>=>{
    const ifExist = await prisma.academicDepartment.findFirst({
      where:{
        id:id
      }
    });
    if(!ifExist){
      throw new ApiError(httpStatus.NOT_FOUND,'Data not found for given ID')
    }
    const result = await prisma.academicDepartment.update({
        where:{id},
        data:payload
    });
    if(result){
      RedisClient.publish(EVENT_ACADEMIC_DEPARTMENT_UPDATED,JSON.stringify(result))
    }
    return result
}

const deleteAcademicDepartment = async(id:string):Promise<AcademicDepartment>=>{
  const ifExist = await prisma.academicDepartment.findFirst({
    where:{
      id:id
    }
  });
  if(!ifExist){
    throw new ApiError(httpStatus.NOT_FOUND,'Data not found for given ID')
  }
    const result = await prisma.academicDepartment.delete({
        where:{id}
    })
    if(result){
      RedisClient.publish(EVENT_ACADEMIC_DEPARTMENT_DELETED,JSON.stringify(result))
    }
    return result
}

export const academicDepartmentService = {
  createAcademicDepartment,
  getAllAcademicDepartments,
  getSingleAcademicDepartment,
  updateAcademicDepartment,
  deleteAcademicDepartment
};
