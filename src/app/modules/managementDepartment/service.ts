import { ManagementDepartment, Prisma, PrismaClient } from "@prisma/client";
import {
  ICondition,
  IManagementDepartment,
  IManagementDepartmentFilters,
  IMnagementDepartmentEvents,
  sortOrder,
} from "./interface";
import {
  IGenericResponse,
  IPagniationOptions,
} from "../../../shared/interfaces";
import { paginationHelper } from "../../../helper/paginationHelper";
import { managementDepartmentSearchableFields } from "./constants";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";


const prisma = new PrismaClient();


const createDepartment = async (
  payload: IManagementDepartment
): Promise<ManagementDepartment> => {
  const result = await prisma.managementDepartment.create({ data: payload });

  return result;
};

const getAllManagementDepart = async (
  filters: IManagementDepartmentFilters,
  paginationOptions: IPagniationOptions
): Promise<IGenericResponse<ManagementDepartment[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: sortOrder } = {};

  const andCondition: ICondition[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: managementDepartmentSearchableFields.map((field) => ({
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

  const whereConditions:Prisma.ManagementDepartmentWhereInput = andCondition.length > 0 ? {AND:andCondition} : {}

  const result = await prisma.managementDepartment.findMany({
    // where: {AND: andCondition.length > 0 ? andCondition : undefined},
    where:whereConditions,
    orderBy: sortConditions,
    skip,
    take: limit,
  });

  let total = await prisma.managementDepartment.count({
    // where: {AND: andCondition.length > 0 ? andCondition : undefined,}
    where:whereConditions
  });

  if (result.length === 0 && searchTerm) {
    const searchTermAsNumber = Number(searchTerm);
    if (!isNaN(searchTermAsNumber)) {
      andCondition.length = 0;
      andCondition.push({
        OR: managementDepartmentSearchableFields.map((field) => ({
          [field]: searchTermAsNumber,
        })),
      });

      const result = await prisma.managementDepartment.findMany({
        // where: { AND: andCondition.length > 0 ? andCondition : undefined },
        where:whereConditions,
        orderBy: sortConditions,
        skip,
        take: limit,
      });

      // Count the total matching documents
      total = await prisma.managementDepartment.count({
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

const getSinglemanagementDeprt = async (
  id: string
): Promise<ManagementDepartment | null> => {
  const result = await prisma.managementDepartment.findFirst({
    where: { id: id },
  });

  return result;
};

const deleteManagementDeprt = async (
  id: string
): Promise<ManagementDepartment | null> => {
  const result = await prisma.managementDepartment.delete({
    where: {
      id: id,
    },
  });

  return result;
};

const updateManagementDeprt = async (
  id: string,
  payload: Partial<ManagementDepartment>
): Promise<ManagementDepartment | null> => {
  const result = await prisma.managementDepartment.update({
    where: {
      id: id,
    },
    data: payload,
  });

  return result;
};

const createManagementDepartmentFromEvents = async(e:IMnagementDepartmentEvents)=>{
  const managementDepartment ={
    title:e.title,
    syncId:e._id
  }
  await prisma.managementDepartment.create({data:managementDepartment})
}

const updateManagementDepartmentFromEvents = async(e:Partial<IMnagementDepartmentEvents>)=>{
  const managementDepartment = {
    title:e.title,
  }

  const isExist = await prisma.managementDepartment.findFirst({where:{syncId:e._id}})
  if(!isExist){
    throw new ApiError(httpStatus.NOT_FOUND,'This ID not found')
  }
  await prisma.managementDepartment.update({
    where:{
      id:isExist.id
    },
    data:managementDepartment
  })
}

const deleteManagementDepartmentFromEvents = async(e:Partial<IMnagementDepartmentEvents>)=>{
  const isExist = await prisma.managementDepartment.findFirst({where:{syncId:e._id}})
  if(!isExist){
    throw new ApiError(httpStatus.NOT_FOUND,'This ID not found')
  }
  await prisma.managementDepartment.delete({
    where:{
      id:isExist.id
    }
  })
}


export const managementDepartmentService = {
  createDepartment,
  getAllManagementDepart,
  getSinglemanagementDeprt,
  deleteManagementDeprt,
  updateManagementDeprt,
  createManagementDepartmentFromEvents,
  updateManagementDepartmentFromEvents,
  deleteManagementDepartmentFromEvents
}