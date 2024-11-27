import { OfferedCourseSection, PrismaClient } from "@prisma/client";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { IOfferedCourseSection } from "./interface";

const prisma = new PrismaClient()
const createOfferedCourseSection = async(payload:IOfferedCourseSection):Promise<OfferedCourseSection>=>{
    const isExistOfferedCourse = await prisma.offeredCourse.findFirst({
        where:{
            id:payload.offeredCourseId
        }
    })
    if(!isExistOfferedCourse){
        throw new ApiError(httpStatus.BAD_REQUEST,'Offered course not exist')
    }
    payload.semesterRegistrationId = isExistOfferedCourse.semesterRegistrationId
    const result = await prisma.offeredCourseSection.create({
        data:payload
    })

    return result
}

export const offeredCourseSectionService ={
    createOfferedCourseSection
}