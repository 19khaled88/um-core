import { Faculty, Prisma, PrismaClient } from "@prisma/client";
import { FacultyCreatedEvent } from "./interface";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { FileUploadCloudinary } from "../../../helper/cloudinary";

const prisma = new PrismaClient();
const myCourses = async (
  user: { userId: string; role: string },
  filter: {
    academicSemesterId?: string | null | undefined;
    courseId?: string | null | undefined;
  }
) => {
  if (!filter.academicSemesterId) {
    const currentSemester = await prisma.academicSemester.findFirst({
      where: {
        isCurrent: true,
      },
    });

    filter.academicSemesterId = currentSemester?.id;
  }

  const offerdCoursesSections = await prisma.offeredCourseSection.findMany({
    where: {
      offeredCourseClassSchedules: {
        some: {
          faculty: {
            facultyId: user.userId,
          },
        },
      },
      offeredCourse: {
        semesterRegistration: {
          academicSemester: {
            id: filter.academicSemesterId,
          },
        },
      },
    },
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
      offeredCourseClassSchedules: {
        include: {
          room: {
            include: {
              building: true,
            },
          },
        },
      },
    },
  });

  const courseAndSchedule = offerdCoursesSections.reduce((acc:any,obj:any)=>{
        const course = obj.offeredCourse.course;
        const classSchedules = obj.offeredCourseClassSchedules;
        const existingCourse = acc.find((item:any)=>item.course?.id === course?.id);
        if(existingCourse){
            existingCourse.sections.push({
                section:obj,
                classSchedules
            })
        }else{
            acc.push({
                course,
                sections:[{
                    section:obj,
                    classSchedules
                }]
            })
        }
        return acc
  },[])


  return courseAndSchedule
};

const createFacultyFromEvent = async(e:FacultyCreatedEvent):Promise<void> =>{
  const faculty={
    facultyId:e.id,
    firstName:e.name.firstName,
    lastName:e.name.lastName,
    middleName:e.name.middleName,
    dateOfBirth:e.dateOfBirth,
    profileImage:e.profileImage,
    email:e.email,
    contactNo:e.contactNo,
    gender:e.gender,
    bloodGroup:e.bloodGroup,
    designation:e.designation,
    academicDepartmentId:e.academicDepartment.syncId,
    academicFacultyId:e.academicFaculty.syncId,
    emergencyContactNo:e.emergencyContactNo,
    presentAddress:e.presentAddress,
    permanentAddress:e.permanentAddress,
    syncId:e.syncId,
  }

  await prisma.faculty.create({
    data:faculty
  })
}

const updateFacultyFromEvent = async(e:any):Promise<void> =>{
  const isExist = await prisma.faculty.findFirst({
    where:{
      facultyId:e.id
    }
  });

  if(!isExist){
    createFacultyFromEvent(e)
  }else{
    const facultyData:Partial<Faculty>={
      facultyId:e.id,
      firstName:e.name.firstName,
      lastName:e.name.lastName,
      middleName:e.name.middleName,
      dateOfBirth:e.dateOfBirth,
      profileImage:e.profileImage,
      email:e.email,
      contactNo:e.contactNo,
      gender:e.gender,
      bloodGroup:e.bloodGroup,
      designation:e.designation,
      academicDepartmentId:e.academicDepartment.syncId,
      academicFacultyId:e.academicFaculty.syncId,
      emergencyContactNo:e.emergencyContactNo,
      presentAddress:e.presentAddress,
      permanentAddress:e.permanentAddress,
    };

    await prisma.faculty.update({
      where:{
        id:isExist.id 
      },
      data:facultyData
    })
  }
}

const deleteFacultyFromEvent = async(e:any):Promise<void> =>{
  
  const isExist = await prisma.faculty.findFirst({
    where:{
      syncId:e._id
    }
  });
 
  if(isExist){
    const deleted = await prisma.faculty.delete({
      where:{
        id:isExist.id
      }
    })

    if(deleted){
     const res = await FileUploadCloudinary.deleteFromCloudinary(e.profileImage,'single')
     
     
    }
    
  }
  
}


export const facultyService = {
  myCourses,
  createFacultyFromEvent,
  updateFacultyFromEvent,
  deleteFacultyFromEvent
};
