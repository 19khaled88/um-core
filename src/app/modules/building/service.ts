import { Building, Prisma, PrismaClient } from "@prisma/client";
import { IBuildingFilters, ICondition, sortOrder } from "./interface";
import { IGenericResponse, IPagniationOptions } from "../../../shared/interfaces";
import { paginationHelper } from "../../../helper/paginationHelper";
import { buildingSearchableFields } from "./contants";

const prisma = new PrismaClient();

const createBuilding = async (payload: Building): Promise<Building> => {
  const result = await prisma.building.create({ data: payload });
  return result;
};

const getAllBuilding = async(
  filters: IBuildingFilters,
  paginationOptions: IPagniationOptions
):Promise<IGenericResponse<Building[]>>=>{
    const { searchTerm, ...filterData } = filters;
    const { limit, page, skip, sortBy, sortOrder } =
          paginationHelper.calculatePagination(paginationOptions);

    const sortConditions: { [key: string]: sortOrder } = {};

    const andCondition: ICondition[] = [];  

    if (searchTerm) {
      andCondition.push({
        OR: buildingSearchableFields.map((field) => ({
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

    const whereConditions:Prisma.BuildingWhereInput = andCondition.length > 0 ? {AND:andCondition} : {}

    const result = await prisma.building.findMany({
      // where: {AND: andCondition.length > 0 ? andCondition : undefined},
      where:whereConditions,
      orderBy: sortConditions,
      skip,
      take: limit,
    });

    let total = await prisma.building.count({
      // where: {AND: andCondition.length > 0 ? andCondition : undefined,}
      where:whereConditions
    });

    if (result.length === 0 && searchTerm) {
      const searchTermAsNumber = Number(searchTerm);
      if (!isNaN(searchTermAsNumber)) {
        andCondition.length = 0;
        andCondition.push({
          OR: buildingSearchableFields.map((field) => ({
            [field]: searchTermAsNumber,
          })),
        });
  
        const result = await prisma.building.findMany({
          // where: { AND: andCondition.length > 0 ? andCondition : undefined },
          where:whereConditions,
          orderBy: sortConditions,
          skip,
          take: limit,
        });
  
        // Count the total matching documents
        total = await prisma.building.count({
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

const getSingleBuilding = async(id:string):Promise<Building | null>=>{
  const result = await prisma.building.findFirst({
    where:{id:id}
  })
  return result
}

const deleteBuilding = async(id:string):Promise<Building>=>{
  const result = await prisma.building.delete({
      where:{id:id},
      include:{
        rooms:true,
        
      }
  })
  return result
}

const updateBuilding  = async(id:string,payload:Partial<Building>):Promise<Building>=>{
  const result = await prisma.building.update({
      where:{id:id},
      data:payload
  })
  return result
}

export const buildingService = {
    createBuilding,
    getAllBuilding,
    getSingleBuilding,
    deleteBuilding,
    updateBuilding
}
