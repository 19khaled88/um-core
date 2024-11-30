import { Prisma } from "@prisma/client";

export enum WeekDays {
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
}

export type IOfferedCourseSchedule = {
  startTime: string;
  endTime: string;
  dayOfWeek: WeekDays;
  offeredCourseSectionId: string;
  semesterRegistrationId: string;
  roomId: string;
  facultyId: string;
};

export type IOfferedCourseScheduleFilters = {
  searchTerm?: string | null;
  offeredCourseSectionId?: string | null;
  roomId?: string | null;
  facultyId?: string | null;
};

export type sortOrder = "asc" | "desc";

export type ICondition = {
  // OR?: { [key: string]: { contains: string; mode: Prisma.QueryMode } }[];
  OR?:
    | { [key: string]: { contains: string; mode: Prisma.QueryMode } }[]
    | { [key: string]: number }[];
  AND?: { [key: string]: string | number | boolean | null }[];
};


