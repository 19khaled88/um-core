import { SuperAdmin } from "@prisma/client";
import {
  Prisma,
  PrismaClient,
  Student,
  StudentEnrolledCourse,
  StudentEnrolledCourseStatus,
} from "@prisma/client";
import { RedisClient } from "../../../shared/redis";

const prisma = new PrismaClient();

const create_super_admin_from_events = async(e:any)=>{
  try {
    
    const manageDeptId = await prisma.managementDepartment.findFirst({where:{syncId:e.managementDepartmentId}})
    
    const superAdminData:Partial<SuperAdmin> = {
      superAdminId: e.id,
      firstName: e.name.firstName,
      lastName: e.name.lastName,
      middleName:e.name.middleName,
      profileImage:e.profileImage,
      email:e.email,
      dateOfBirth:e.dateOfBirth,
      emergencyContactNo:e.emergencyContactNo,
      permanentAddress:e.permanentAddress,
      presentAddress:e.presentAddress,
      contactNo :e.contactNo,
      gender:e.gender,
      bloodGroup:e.bloodGroup,
      managementDepartmentId:manageDeptId?.id,
      designation:e.designation,
      isSuperAdmin:e.isSuperAdmin,
      permissions:e.permissions,
      syncId:e.syncId
    }
    
    await prisma.superAdmin.create({data:superAdminData as SuperAdmin})
  } catch (error) {
    //  try {
    //     await RedisClient.
    //  } catch (error) {
      
    //  }
  }

}




export const superAdminServices = {
    create_super_admin_from_events
  };