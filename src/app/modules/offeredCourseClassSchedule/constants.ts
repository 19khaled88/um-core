export const offeredCourseScheduleSearchableFields = ['dayOfWeek'];

export const offeredCourseScheduleRelationFields = [
    "offeredCourseSectionId",
    "semesterRegistrationId",
    "roomId",
    "facultyId",
]

export const offeredCourseScheduleRelationalMapper:{[key:string]:string} = {
    offeredCourseSectionId:'offeredCourseSection',
    semesterRegistrationId:'semesterRegistration',
    roomId:"room",
    facultyId:"faculty",
}

