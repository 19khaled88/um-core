import {
  OfferedCourseClassSchedule,
  OfferedCourseSection,
  Prisma,
  PrismaClient,
} from "@prisma/client";
import { ICondition, IOfferedCourseSchedule, IOfferedCourseScheduleFilters, sortOrder } from "./interface";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { paginationHelper } from "../../../helper/paginationHelper";
import { IGenericResponse, IPagniationOptions } from "../../../shared/interfaces";
import { offeredCourseScheduleRelationalMapper, offeredCourseScheduleRelationFields, offeredCourseScheduleSearchableFields } from "./constants";

const prisma = new PrismaClient();
const create = async (
  payload: IOfferedCourseSchedule
): Promise<OfferedCourseClassSchedule> => {
  // Destructure necessary fields from the payload
  const { dayOfWeek, roomId, facultyId, startTime, endTime } = payload;

  // Check for existing schedules
  const existingSchedule = await prisma.offeredCourseClassSchedule.findFirst({
    where: {
      dayOfWeek: dayOfWeek,
      roomId: roomId,
      facultyId:facultyId,
      OR: [
        {
          startTime: {
            gte: startTime, // New start time is after or at the existing start time
          },
          endTime: {
            lte: endTime, // New end time is before or at the existing end time
          },
        },
        {
          startTime: {
            lte: startTime, // Existing start time is before or at the new start time
          },
          endTime: {
            gte: startTime, // Existing end time is after or at the new start time
          },
        },
        {
            startTime: {
                lte: endTime, // Existing start time is before or at the new end time
            },
            endTime: {
                gte: endTime, // Existing end time is after or at the new end time
            },
        }
      ],
    },
  });

  // If an existing schedule is found, throw an error or handle it as needed
  if (existingSchedule) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "A class schedule already exists for this day, room, faculty and time."
    );
  }

  const result = await prisma.offeredCourseClassSchedule.create({
    data: payload,
    include: {
      faculty: true,
      offeredCourseSection: true,
      room: true,
      semesterRegistration: true,
    },
  });
  return result;
};

const getAllOfferedCourseSchedule = async(
    filters: IOfferedCourseScheduleFilters,
    paginationOptions: IPagniationOptions
  ):Promise<IGenericResponse<OfferedCourseClassSchedule[]>>=>{
      const { searchTerm, ...filterData } = filters;
      const { limit, page, skip, sortBy, sortOrder } =
            paginationHelper.calculatePagination(paginationOptions);
  
      const sortConditions: { [key: string]: sortOrder } = {};
  
    //   const andCondition: ICondition[] = [];  
    const andCondition =[]
  
      if (searchTerm) {
        andCondition.push({
          OR: offeredCourseScheduleSearchableFields.map((field) => ({
            [field]: {
              contains: searchTerm,
              mode: "insensitive" as Prisma.QueryMode,
            },
          })),
        });
      }
    
    //   if (Object.keys(filterData).length) {
    //     andCondition.push({
    //         AND: Object.entries(filterData).map(([field, value]) => ({
    //         [field]: value as string | number | boolean | null,
    //         })),
    //     });
    //   } 

      if(Object.keys(filterData).length > 0){
        andCondition.push({
            AND:Object.keys(filterData).map((key)=>{
                if(offeredCourseScheduleRelationFields.includes(key)){
                    return{
                        [offeredCourseScheduleRelationalMapper[key]]:{
                            id:(filterData as any)[key]
                        }
                    }
                }else{
                    return{
                        [key]:{
                            equals:(filterData as any)[key]
                        }
                    }
                }
            })
        })
      }
  
      if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder as sortOrder;
      }
  
      const whereConditions:Prisma.OfferedCourseClassScheduleWhereInput = andCondition.length > 0 ? {AND:andCondition} : {}
  
      const result = await prisma.offeredCourseClassSchedule.findMany({
        // where: {AND: andCondition.length > 0 ? andCondition : undefined},
        where:whereConditions,
        orderBy: sortConditions,
        skip,
        take: limit,
        include:{
            faculty:true,
            semesterRegistration:true,
            room:true,
            offeredCourseSection:true
        }
      });
  
      let total = await prisma.offeredCourseClassSchedule.count({
        // where: {AND: andCondition.length > 0 ? andCondition : undefined,}
        where:whereConditions
      });
  
      if (result.length === 0 && searchTerm) {
        const searchTermAsNumber = Number(searchTerm);
        if (!isNaN(searchTermAsNumber)) {
          andCondition.length = 0;
          andCondition.push({
            OR: offeredCourseScheduleSearchableFields.map((field) => ({
              [field]: searchTermAsNumber,
            })),
          });
    
          const result = await prisma.offeredCourseClassSchedule.findMany({
            // where: { AND: andCondition.length > 0 ? andCondition : undefined },
            where:whereConditions,
            orderBy: sortConditions,
            skip,
            take: limit,
          });
    
          // Count the total matching documents
          total = await prisma.offeredCourseClassSchedule.count({
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

export const offeredCourseScheduleService = {
  create,
  getAllOfferedCourseSchedule
};
