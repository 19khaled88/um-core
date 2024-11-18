import { Student, User,AcademicSemester,PrismaClient, Prisma, Faculty } from "@prisma/client";
import config from "../../../config";
import { generateFacultyId, generateStudentId } from "./utils";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import hashPrisma from "../../middlewares/hashPass";

const prismaClient = new PrismaClient();

const createStudent = async (
    student: Student,
    user: Partial<User>
  ): Promise<User | null> => {
    if (!user.password) {
      user.password = config.default_st_pass as string;
    }
  
  
    user.role = "student";
    const academicSemester = await prismaClient.academicSemester.findUnique({where:{id:student.academicSemesterId}} );
  
    console.log(academicSemester)
    let newUserData = null;
  
    try {
      const id = await generateStudentId({
        year: academicSemester?.year,
        code: academicSemester?.code,
      });
      user.studentId = id;
      student.studentId = id;
  
      // Create student
      const newStudent = await prismaClient.student.create({data:student});
      if (!newStudent) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create student");
      }
  
      // Attach student to user
      user.studentId = newStudent.id;

      
  
      // const newUserDataInput: Prisma.UserCreateInput = {
      //   id:user.id,
      //   role:user.role,
      //   password:user.password,
      //   needsPassChange:user.needsPassChange ?? false,
      //   passwordChangedAt:user.passwordChangedAt ?? new Date(),
      //   students:{
      //     connect:{id:user.studentId}
      //   }

      // };

      // Create user
      const newUser = await hashPrisma.user.create({data:{
        role:user.role,
        password:user.password,
        studentId:user.studentId,
        needsPassChange:user.needsPassChange ?? false,
        passwordChangedAt:user.passwordChangedAt ?? new Date(),
      }});

      // const newUser = await prisma.user.create({
      //   data:newUserDataInput
      // })


      
      if (!newUser) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User not created");
      }
  
      newUserData = newUser;
    } catch (error) {
      console.error("Error during creation:", error); // Log the error
      throw error;
    }
  
    if (newUserData) {
      newUserData = await hashPrisma.user.findFirst({ 
        where:{id: newUserData.id},
        include:{
            students:{
                include:{
                    academicSemester:true,
                    academicDepartment:true,
                    academicFaculty:true
                }
            }
        }
     })
    }
  
    return newUserData;
    // return null
  };

const createFaculty = async(
  faculty:Faculty,
  user:User
):Promise<User | null>=>{
  if(!user.password){
    user.password = config.default_faculty_pass as string; 
  }

  user.role = "faulty";

  let newUserData = null;

  try {
    const id = await generateFacultyId();

    user.facultyId = id
    faculty.facultyId = id

    const newFaculty = await prismaClient.faculty.create({
      data:faculty
    })

    if(!newFaculty){
      throw new ApiError(httpStatus.BAD_REQUEST,'Failed to create faculty')
    }

    user.facultyId = newFaculty.id

    const newUser = await prismaClient.user.create({
      data:{
        role:user.role,
        password:user.password,
        facultyId:user.facultyId,
        needsPassChange:user.needsPassChange ?? false,
        passwordChangedAt:user.passwordChangedAt ?? new Date()
      }
    })

    newUserData = newUser

    if(!newUser){
      throw new ApiError(httpStatus.BAD_REQUEST, "User not created");
    }
    
  } catch (error) {
    console.error("Error during creation:", error); // Log the error
      throw error;
  }

  if(newUserData){
    newUserData = await prismaClient.user.findFirst({
      where:{id:newUserData.id},
      include:{
        faculties:{
          include:{
            academicDepartment:true,
            academicFaculty:true
          }
        }
      }
    })
  }
  return newUserData
}

const createAdmin = async()=>{
  
}



export const userService = {
  createStudent,
  createFaculty
}

