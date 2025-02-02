import { Prisma } from "@prisma/client";

export type sortOrder = "asc" | "desc";

export type IStudentFilters = {
  searchTerm?: string;
};

export type ICondition = {
  // OR?: { [key: string]: { contains: string; mode: Prisma.QueryMode } }[];
  OR?:
    | { [key: string]: { contains: string; mode: Prisma.QueryMode } }[]
    | { [key: string]: number }[];
  AND?: { [key: string]: string | number | boolean | null }[];
};

export type StudentCreatedEvent = {
  id: string;
  name: {
    firstName: string;
    lastName: string;
    middleName: string;
  };
  dateOfBirth: string;
  profileImage: string;
  email: string;
  contactNo: string;
  gender: string;
  bloodGroup: string;
  academicFaculty: { syncId: string };
  academicSemester: { syncId: string };
  academicDepartment: { syncId: string };
  emergencyContactNo: string;
  presentAddress: string;
  permanentAddress: string;
  syncId: string;
};

export const transformResponseToStudentCreatedEvent = (
  response: any
): StudentCreatedEvent => {
  return {
    id: response.id,
    name: {
      firstName: response.name.firstName,
      lastName: response.name.lastName,
      middleName: response.name.middleName,
    },
    dateOfBirth: response.dateOfBirth,
    profileImage: response.profileImage,
    email: response.email,
    contactNo: response.contactNo,
    gender: response.gender,
    bloodGroup: response.bloodGroup,
    academicDepartment: {
      syncId: response.academicDepartment.syncId,
    },

    academicSemester: {
      syncId:response.academicSemester.syncId
    },
    academicFaculty:{
      syncId:response.academicFaculty.syncId
    },
    emergencyContactNo: response.emergencyContactNo,
    presentAddress: response.presentAddress,
    permanentAddress: response.permanentAddress,
    syncId: response._id,
  };
};
