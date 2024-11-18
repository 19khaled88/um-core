import { PrismaClient, User, Student, AcademicSemester } from "@prisma/client";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

const prisma = new PrismaClient();

let lastUserId = 0;

// create id for faculty
export const findLastFacultyId = async (): Promise<string | undefined> => {
  const lastFaculty = await prisma.user.findFirst({
    where: { role: "faculty" },
    orderBy: { createdAt: "desc" },
    select: { id: true },
  });

  return lastFaculty?.id;
};

export const generateFacultyId = async (): Promise<string> => {
  const lastId = await findLastFacultyId();
  let currentId = "000000";
  if (lastId && lastId.startsWith("F-")) {
    currentId = lastId.substring(2);
  }
  // const currentId = (await findLastFacultyId()) || (0).toString().padStart(5,'0');

  let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, "0");

  incrementedId = `F-${incrementedId}`;

  return incrementedId;
};

// create id for student
export const findLastStudentId = async (): Promise<string | undefined> => {
  const lastStudent = await prisma.user.findFirst({ where:{role: "student"},orderBy:{createdAt:'desc'},select:{id:true} })
    

  return lastStudent?.id ? lastStudent.id.substring(4) : undefined;
};

export const generateStudentId = async ({
  year,
  code,
}: Partial<AcademicSemester>): Promise<string> => {
  if (year === undefined || code === undefined) {
    throw new ApiError(httpStatus.BAD_REQUEST,"Year and code are required to generate the student ID.");
  }

  const currentId =
    (await findLastStudentId()) || (0).toString().padStart(5, "0");
  let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, "0");
  incrementedId = `${year.toString().substring(2)}${code}${incrementedId}`;
  return incrementedId;
};

//create id for admin
export const findLastAdminId = async (): Promise<string | undefined> => {
  const lastFaculty = await prisma.user.findFirst({ where:{role: "admin"},orderBy:{createdAt:'desc'},select:{id:true}})
   

  return lastFaculty?.id;
};

export const generateAdminId = async (): Promise<string> => {
  const lastId = await findLastAdminId();
  let currentId = "000000";
  if (lastId && lastId.startsWith("A-")) {
    currentId = lastId.substring(2);
  }
  // const currentId = (await findLastFacultyId()) || (0).toString().padStart(5,'0');

  let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, "0");

  incrementedId = `A-${incrementedId}`;

  return incrementedId;
};

//create id for super admin
export const findLastSuperAdminId = async (): Promise<string | undefined> => {
  const lastFaculty = await prisma.user.findFirst(
    { where:{role: "super_admin"},orderBy:{createdAt:'desc'},select:{id:true} })
   

  return lastFaculty?.id;
};

export const generateSuperAdminId = async (): Promise<string> => {
  const lastId = await findLastSuperAdminId();
  let currentId = "000000";
  if (lastId && lastId.startsWith("S-")) {
    currentId = lastId.substring(2);
  }
  // const currentId = (await findLastFacultyId()) || (0).toString().padStart(5,'0');

  let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, "0");

  incrementedId = `S-${incrementedId}`;

  return incrementedId;
};
