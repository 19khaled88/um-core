import prisma from "../../../helper/prismaKeyWrok";

const myCourses = async (
  user: { userId: string; role: string },
  filter: {
    academicSemesterId?: string | null | undefined;
    courseId?: string | null | undefined;
  }
) => {
  if (!filter.academicSemesterId) {
    const currentSemester = await prisma.academicSemester.findFirst({
      where: {
        isCurrent: true,
      },
    });

    filter.academicSemesterId = currentSemester?.id;
  }

  const offerdCoursesSections = await prisma.offeredCourseSection.findMany({
    where: {
      offeredCourseClassSchedules: {
        some: {
          faculty: {
            facultyId: user.userId,
          },
        },
      },
      offeredCourse: {
        semesterRegistration: {
          academicSemester: {
            id: filter.academicSemesterId,
          },
        },
      },
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
        },
      },
    },
  });

  const courseAndSchedule = offerdCoursesSections.reduce((acc:any,obj:any)=>{
        const course = obj.offeredCourse.course;
        const classSchedules = obj.offeredCourseClassSchedules;
        const existingCourse = acc.find((item:any)=>item.course?.id === course?.id);
        if(existingCourse){
            existingCourse.sections.push({
                section:obj,
                classSchedules
            })
        }else{
            acc.push({
                course,
                sections:[{
                    section:obj,
                    classSchedules
                }]
            })
        }
        return acc
  },[])


  return courseAndSchedule
};

export const facultyService = {
  myCourses,
};
