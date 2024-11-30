import {
  OfferedCourseClassSchedule,
  OfferedCourseSection,
  PrismaClient,
} from "@prisma/client";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { IOfferedCourseSection } from "./interface";
import { offeredCourseClassScheduleController } from "../offeredCourseClassSchedule/controller";
import { OfferedCourseClassScheduleUtils } from "../offeredCourseClassSchedule/utils";

const prisma = new PrismaClient();
// const createOfferedCourseSection = async(payload:IOfferedCourseSection):Promise<OfferedCourseSection>=>{
const createOfferedCourseSection = async (
  payload: IOfferedCourseSection
): Promise<OfferedCourseSection | null> => {
  const { classSchedules, ...data } = payload;

  const isExistOfferedCourse = await prisma.offeredCourse.findFirst({
    where: {
      id: payload.offeredCourseId,
    },
  });

  if (!isExistOfferedCourse) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Offered course not exist");
  }

  payload.semesterRegistrationId = isExistOfferedCourse.semesterRegistrationId;

  classSchedules.forEach(async (schedule: any) => {
    await OfferedCourseClassScheduleUtils.checkRoomAvailable(schedule);
    await OfferedCourseClassScheduleUtils.checkFacultyAvailable(schedule);
  });

  const offeredCourseSectionData = await prisma.offeredCourseSection.findFirst({
    where: {
      offeredCourse: {
        id: data.offeredCourseId,
      },
      title: data.title,
    },
  });

  if (offeredCourseSectionData) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Course section already exist");
  }

  const result = await prisma.offeredCourseSection.create({
    data: payload,
  });

  const scheduledData = classSchedules.map((schedule: any) => ({
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    dayOfWeek: schedule.dayOfWeek,
    roomId: schedule.roomId,
    facultyId: schedule.facultyId,
    offeredCourseSectionId: result.id,
    semesterRegistrationId: isExistOfferedCourse.semesterRegistrationId,
  }));

  const createSchedules = await prisma.offeredCourseClassSchedule.createMany({
    data: scheduledData,
  });

  const offerdCourseSectionWithSchedules =
    await prisma.offeredCourseSection.findFirst({
      where: {
        id: result.id,
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
            faculty: true,
          },
        },
      },
    });
  return offerdCourseSectionWithSchedules;
};

export const offeredCourseSectionService = {
  createOfferedCourseSection,
};
