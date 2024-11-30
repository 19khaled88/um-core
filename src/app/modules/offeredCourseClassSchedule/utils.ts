import { OfferedCourseClassSchedule, WeekDays } from "@prisma/client";
import prisma from "../../../helper/prismaKeyWrok";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";


interface slot {
    startTime:string;
    endTime:string;
    dayOfWeek:WeekDays;
}

const checkRoomAvailable = async (data: OfferedCourseClassSchedule) => {
  const alreadyBookedRoomOnDay =
    await prisma.offeredCourseClassSchedule.findMany({
      where: {
        dayOfWeek: data.dayOfWeek,
        room: {
          id: data.roomId,
        },
      },
    });

  const existingSlots = alreadyBookedRoomOnDay.map((schedule) => ({
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    dayOfWeek: schedule.dayOfWeek,
  }));


  const newSlot = {
    startTime: data.startTime,
    endTime: data.endTime,
    dayOfWeek: data.dayOfWeek,
  }

  if(hasTimeConflict(existingSlots, newSlot)){
    throw new ApiError(httpStatus.CONFLICT, 'Room is alreay booked');
  }
};

const checkFacultyAvailable = async (data: OfferedCourseClassSchedule) => {
  const alreadyFacultyAssigned =
    await prisma.offeredCourseClassSchedule.findMany({
      where: {
        dayOfWeek: data.dayOfWeek,
        faculty: {
          id: data.facultyId,
        },
      },
    });

  const existingSlots = alreadyFacultyAssigned.map((schedule) => ({
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    dayOfWeek: schedule.dayOfWeek,
  }));

  const newSlot = {
    startTime: data.startTime,
    endTime: data.endTime,
    dayOfWeek: data.dayOfWeek,
  };

  if (hasTimeConflict(existingSlots, newSlot)) {
    throw new ApiError(httpStatus.CONFLICT, "Faculty is already booked");
  }
};

const hasTimeConflict = (existingSlots:slot[], newSlots:slot) => {
  const slotsOnSameDay = existingSlots.filter(
    (slot: slot) => slot.dayOfWeek === newSlots.dayOfWeek
  );

  return slotsOnSameDay.some((slot) => {
    const isStartTimeConflict =
      newSlots.startTime < slot.endTime && newSlots.startTime >= slot.startTime;
    const isEndTimeConflict =
      newSlots.endTime > slot.startTime && newSlots.endTime <= slot.endTime;
    const isEnclosingConflict =
      newSlots.startTime <= slot.startTime && newSlots.endTime >= slot.endTime;

      return isStartTimeConflict || isEndTimeConflict || isEnclosingConflict
  });
};

export const OfferedCourseClassScheduleUtils = {
    checkFacultyAvailable,
    checkRoomAvailable
}
