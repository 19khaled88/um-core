import { PrismaClient, Room,Prisma } from "@prisma/client"
import { ICondition, IRoomFilters, sortOrder } from "./interface"
import { IGenericResponse, IPagniationOptions } from "../../../shared/interfaces"
import { paginationHelper } from "../../../helper/paginationHelper"
import { roomSearchableFields } from "./contants"


const prisma = new PrismaClient();

const createRoom = async(payload:Room):Promise<Room>=>{
    const result = await prisma.room.create({
        data:payload,
        include:{
            building:true
        }
    })

    return result
}

const getAllRoom = async(
    filters: IRoomFilters,
    paginationOptions: IPagniationOptions
  ):Promise<IGenericResponse<Room[]>>=>{
      const { searchTerm, ...filterData } = filters;
      const { limit, page, skip, sortBy, sortOrder } =
            paginationHelper.calculatePagination(paginationOptions);
  
      const sortConditions: { [key: string]: sortOrder } = {};
  
      const andCondition: ICondition[] = [];  
  
      if (searchTerm) {
        andCondition.push({
          OR: roomSearchableFields.map((field) => ({
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
  
      const whereConditions:Prisma.RoomWhereInput = andCondition.length > 0 ? {AND:andCondition} : {}
  
      const result = await prisma.room.findMany({
        // where: {AND: andCondition.length > 0 ? andCondition : undefined},
        where:whereConditions,
        orderBy: sortConditions,
        skip,
        take: limit,
      });
  
      let total = await prisma.room.count({
        // where: {AND: andCondition.length > 0 ? andCondition : undefined,}
        where:whereConditions
      });
  
      if (result.length === 0 && searchTerm) {
        const searchTermAsNumber = Number(searchTerm);
        if (!isNaN(searchTermAsNumber)) {
          andCondition.length = 0;
          andCondition.push({
            OR: roomSearchableFields.map((field) => ({
              [field]: searchTermAsNumber,
            })),
          });
    
          const result = await prisma.room.findMany({
            // where: { AND: andCondition.length > 0 ? andCondition : undefined },
            where:whereConditions,
            orderBy: sortConditions,
            skip,
            take: limit,
          });
    
          // Count the total matching documents
          total = await prisma.room.count({
            // where: { AND: andCondition.length > 0 ? andCondition : undefined},
            where:whereConditions
          });
        }
      }
  
      return {
        meta: {
          total,
          limit: 10,
          page,
        },
        data: result,
      };
  
  }
  
const getSingleRoom = async(id:string):Promise<Room | null>=>{
  const result = await prisma.room.findFirst({
    where:{id:id}
  })
  return result
}
  
const deleteRoom = async(id:string):Promise<Room>=>{
  const result = await prisma.room.delete({
      where:{id:id},
      include:{
        building:true
      }
  })
  return result
}
  
const updateRoom  = async(id:string,payload:Partial<Room>):Promise<Room>=>{
  const result = await prisma.room.update({
      where:{id:id},
      data:payload
  })
  return result
}


export const roomService = {
    createRoom,
    getAllRoom,
    getSingleRoom,
    deleteRoom,
    updateRoom
}