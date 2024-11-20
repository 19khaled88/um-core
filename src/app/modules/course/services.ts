import { Course, Prisma, PrismaClient } from "@prisma/client";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { ICondition, ICourseCreateData, ICourseilters, NullableCourseWithRelations, sortOrder } from "./interface";
import { IGenericResponse, IPagniationOptions } from "../../../shared/interfaces";
import { paginationHelper } from "../../../helper/paginationHelper";
import { courseSearchableFields } from "./contants";


const prisma = new PrismaClient()
const createCourse = async(payload:ICourseCreateData):Promise<NullableCourseWithRelations>=>{
    const {preRequisiteCourses, ...courseData} = payload;

    const newCourse = await prisma.$transaction(async(transactionClient)=>{
        const result = await transactionClient.course.create({
            data:courseData
        })

        if(!result){
            throw new ApiError(httpStatus.BAD_REQUEST,'Course not created')
        }

        // if(preRequisiteCourses && preRequisiteCourses.length > 0){
        //     for(let index = 0;index < preRequisiteCourses.length; index++){
        //         const createPrerequisite = await transactionClient.courseToPrerequisite.create({
        //             data:{
        //                 courseId:result.id,
        //                 preRequisiteId:preRequisiteCourses[index].courseId
        //             }
        //         }) 
        //         if(!createPrerequisite){
        //             throw new ApiError(httpStatus.BAD_REQUEST,'Pre-requisite  creation unsuccessful')
        //         }
        //     }
        // }
        if (preRequisiteCourses && preRequisiteCourses.length > 0) {
            const prerequisiteData = preRequisiteCourses.map((prerequisite) => ({
              courseId: result.id,
              preRequisiteId: prerequisite.courseId,
            }));
      
            const createPrerequisites = await transactionClient.courseToPrerequisite.createMany({
              data: prerequisiteData,
            });
      
            if (createPrerequisites.count !== preRequisiteCourses.length) {
              throw new ApiError(httpStatus.BAD_REQUEST, 'Prerequisite creation unsuccessful');
            }
          }
        return result;
    })
    
  
    if(newCourse){
        const responseData = await prisma.course.findUnique({
            where:{
                id:newCourse.id
            },
            include:{
                preRequisite:{
                    include:{
                        preRequisite:true
                    }
                },
                preRequisiteFor:{
                    include:{
                        course:true
                    }
                }
            }
        })
        return responseData as NullableCourseWithRelations;
    } else{
        throw new ApiError(httpStatus.BAD_REQUEST,'Course creation unsuccessful') 
    }

    
}

const getAllCourse=async(
    filters: ICourseilters,
    paginationOptions: IPagniationOptions
):Promise<IGenericResponse<Course[]>>=>{
    const { searchTerm, ...filterData } = filters;
    const { limit, page, skip, sortBy, sortOrder } =
          paginationHelper.calculatePagination(paginationOptions);

    const sortConditions: { [key: string]: sortOrder } = {};

    const andCondition: ICondition[] = []; 

    if (searchTerm) {
        andCondition.push({
          OR: courseSearchableFields.map((field) => ({
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

      const whereConditions:Prisma.CourseWhereInput = andCondition.length > 0 ? {AND:andCondition} : {}

      const result = await prisma.course.findMany({
        // where: {AND: andCondition.length > 0 ? andCondition : undefined},
        where:whereConditions,
        orderBy: sortConditions,
        skip,
        take: limit,
      });

      let total = await prisma.course.count({
        // where: {AND: andCondition.length > 0 ? andCondition : undefined,}
        where:whereConditions
      });

      if (result.length === 0 && searchTerm) {
        const searchTermAsNumber = Number(searchTerm);
        if (!isNaN(searchTermAsNumber)) {
          andCondition.length = 0;
          andCondition.push({
            OR: courseSearchableFields.map((field) => ({
              [field]: searchTermAsNumber,
            })),
          });
    
          const result = await prisma.course.findMany({
            // where: { AND: andCondition.length > 0 ? andCondition : undefined },
            where:whereConditions,
            orderBy: sortConditions,
            skip,
            take: limit,
          });
    
          // Count the total matching documents
          total = await prisma.course.count({
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

const getSingleCourse = async(id:string):Promise<Course | null>=>{
    const isCourseExist = await prisma.course.findFirst({
        where:{
            id:id
        }
    }) 

    return isCourseExist
}

const deleteCourse = async(id:string)=>{
    const isCourseExist = await prisma.course.delete({
        where:{
            id:id
        }
    }) 

    return isCourseExist
}

const updateCourse = async(id:string,payload:Partial<Course & {preRequisite?: {courseId:string}[]}>):Promise<Course | null>=>{
    const {preRequisite, ...courseData} = payload
    const updatedCourse = await prisma.course.update({
        where:{
            id:id
        },
        data:courseData
    }) 
    if (!updatedCourse) {
        throw new Error("Course not found or not updated");
      }

    // Update prerequisites if provided
    if (preRequisite && preRequisite.length > 0) {
        // Delete existing prerequisites for the course
        await prisma.courseToPrerequisite.deleteMany({
        where: { courseId: id },
        });

        // Add new prerequisites
        for (const prerequisite of preRequisite) {
        await prisma.courseToPrerequisite.create({
            data: {
            courseId: id,
            preRequisiteId: prerequisite.courseId,
            },
        });
        }
    }

    return await prisma.course.findUnique({
    where: { id },
    include: {
        preRequisite: {
        include: { preRequisite: true },
        },
        preRequisiteFor: {
        include: { course: true },
        },
    },
    });
}

export const courseService ={
    createCourse,
    getAllCourse,
    getSingleCourse,
    deleteCourse,
    updateCourse
}