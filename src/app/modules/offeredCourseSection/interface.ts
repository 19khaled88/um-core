import { WeekDays } from "@prisma/client"

export type IClassSchedules = {
    startTime: string,
    endTime: string,
    dayOfWeek: WeekDays,
    roomId: string,
    facultyId: string,
}
export type IOfferedCourseSection = {
    title:string,
    maxCapacity:number,
    offeredCourseId:string,
    semesterRegistrationId:string,
    classSchedules:IClassSchedules[]
}