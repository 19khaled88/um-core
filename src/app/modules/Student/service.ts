import { Request, Response } from "express";
import { IGenericResponse, IPagniationOptions } from "../../../shared/interfaces";
import { ICondition, IStudentFilters, sortOrder } from "./interface";
import { paginationHelper } from "../../../helper/paginationHelper";
import { studentSearchableFields } from "./contants";
import { Prisma, PrismaClient, Student } from "@prisma/client";

const prisma = new PrismaClient();

const getAllStudent = async(
    filters: IStudentFilters,
    paginationOptions: IPagniationOptions
):Promise<IGenericResponse<Student[]>>=>{
    const { searchTerm, ...filterData } = filters;
    const { limit, page, skip, sortBy, sortOrder } =
        paginationHelper.calculatePagination(paginationOptions);


    const sortConditions: { [key: string]: sortOrder } = {};

    const andCondition: ICondition[] = [];   
    
    if (searchTerm) {
        andCondition.push({
          OR: studentSearchableFields.map((field) => ({
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

    const whereConditions:Prisma.StudentWhereInput = andCondition.length > 0 ? {AND:andCondition} : {}

    const result = await prisma.student.findMany({
        // where: {AND: andCondition.length > 0 ? andCondition : undefined},
        where:whereConditions,
        orderBy: sortConditions,
        skip,
        take: limit,
    });

    let total = await prisma.student.count({
        // where: {AND: andCondition.length > 0 ? andCondition : undefined,}
        where:whereConditions
    });

    if (result.length === 0 && searchTerm) {
        const searchTermAsNumber = Number(searchTerm);
        if (!isNaN(searchTermAsNumber)) {
          andCondition.length = 0;
          andCondition.push({
            OR: studentSearchableFields.map((field) => ({
              [field]: searchTermAsNumber,
            })),
          });
    
          const result = await prisma.student.findMany({
            // where: { AND: andCondition.length > 0 ? andCondition : undefined },
            where:whereConditions,
            orderBy: sortConditions,
            skip,
            take: limit,
          });
    
          // Count the total matching documents
          total = await prisma.student.count({
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

}

const getSingleStudent = async(id:string)=>{
    const result = await prisma.student.findFirst({
        where:{id:id}
    })
    return result
}

const deleteStudent = async(id:string)=>{
    const result = await prisma.student.delete({
        where:{id:id}
    })
    return result
}

const updateStudent = async(id:string,payload:Partial<Student>)=>{
    const result = await prisma.student.update({
        where:{id:id},
        data:payload
    })
    return result
}

export const studentServices = {
    getAllStudent,
    getSingleStudent,
    deleteStudent,
    updateStudent
}