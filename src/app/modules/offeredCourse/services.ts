import { OfferedCourse, PrismaClient } from "@prisma/client";
import { ICreateOfferedCourse } from "./interface";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

const prisma = new PrismaClient();

const createOfferedCourse = async (
  payload: ICreateOfferedCourse
): Promise<OfferedCourse[]> => {
  const { academicDepartmentId, semesterRegistrationId, courseIds } = payload;

  // Validate that `courseIds` is an array and not empty
  if (!courseIds || courseIds.length === 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "No courses provided to create offered courses."
    );
  }

  // Check if any of the provided courses already exist for the given department and semeste
  const ifAlreadyExists = await prisma.offeredCourse.findFirst({
    where: {
      academicDepartmentId: academicDepartmentId,
      semesterRegistrationId: semesterRegistrationId,
      courseId: {
        in: courseIds,
      },
    },
  });

  if (ifAlreadyExists) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "One or more same courses are already offered for the specified department and semester."
    );
  }

  // Prepare data for the createMany operation
  const data = courseIds.map((courseId) => ({
    academicDepartmentId,
    semesterRegistrationId,
    courseId,
  }));

  // Use createMany to insert all records at once
  await prisma.offeredCourse.createMany({
    data,
    skipDuplicates: true,
  });

  // Return the newly created offered courses
  const result = await prisma.offeredCourse.findMany({
    where: {
      academicDepartmentId,
      semesterRegistrationId,
      courseId: { in: courseIds },
    },
    include: {
      academicDepartment: true,
      semesterRegistration: true,
      course: true,
    },
  });

  return result;
};

export const offeredCourseService = {
  createOfferedCourse,
};
