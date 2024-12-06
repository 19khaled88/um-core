import {
  Course,
  ExamType,
  OfferedCourse,
  Prisma,
  PrismaClient,
  SemesterRegistration,
  SemesterRegistrationStatus,
  StudentEnrolledCourse,
  StudentEnrolledCourseStatus,
  StudentSemesterRegistration,
  StudentSemesterRegistrationCourse,
} from "@prisma/client";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import {
  IGenericResponse,
  IPagniationOptions,
} from "../../../shared/interfaces";
import {
  ICondition,
  ISemesterRegistrationFilters,
  sortOrder,
} from "./interface";
import { paginationHelper } from "../../../helper/paginationHelper";
import { semesterRegistrationSearchableFields } from "./contants";
import { StudentSemesterUtils } from "./utils";

const prisma = new PrismaClient();

const createSemesterRegistration = async (
  payload: SemesterRegistration
): Promise<SemesterRegistration> => {
  const isAnySemesterRegistrationExist =
    await prisma.semesterRegistration.findFirst({
      where: {
        OR: [
          {
            status: SemesterRegistrationStatus.UPCOMING,
          },
          {
            status: SemesterRegistrationStatus.ONGOING,
          },
        ],
      },
    });

  if (isAnySemesterRegistrationExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Semester reistration already ongoing or upcoming"
    );
  }
  const result = await prisma.semesterRegistration.create({
    data: payload,
  });
  return result;
};

const startNewSemester = async (id: string): Promise<{ message: string }> => {
  const semesterRegistration = await prisma.semesterRegistration.findUnique({
    where: {
      id,
    },
    include: {
      academicSemester: true,
    },
  });

  if (!semesterRegistration) {
    throw new ApiError(httpStatus.NOT_FOUND, "This semester data not found");
  }

  if (semesterRegistration.status !== SemesterRegistrationStatus.ENDED) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Semester is not ended yet");
  }

  if (semesterRegistration.academicSemester.isCurrent) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Semester is already started!");
  }

  const falseAll = await prisma.academicSemester.updateMany({
    where: {
      isCurrent: true,
    },
    data: {
      isCurrent: false,
    },
  });

  let updateStatus = false;
  if (falseAll.count > 0) {
    const result = await prisma.academicSemester.update({
      where: {
        id: semesterRegistration.academicSemester.id,
      },
      data: {
        isCurrent: true,
      },
    });

    if (result) {
      updateStatus = true;
    }

    if (result) {
      const studentSemesterRegistrations =
        await prisma.studentSemesterRegistration.findMany({
          where: {
            semesterRegistration: {
              id,
            },
            isConfirmed: true,
          },
        });

      studentSemesterRegistrations.length > 0
        ? studentSemesterRegistrations.map(async (individualRegistration) => {
            if (individualRegistration.totalCreditTaken) {
              const totalPaymentAmount =
                individualRegistration.totalCreditTaken * 5000;
              await StudentSemesterUtils.createSemesterPayment({
                studentId: individualRegistration.studentId,
                academicSemesterId: semesterRegistration.academicSemesterId,
                totalPaymentAmount: totalPaymentAmount,
              });
            }
            const studentSemesterRegistrationCourses =
              await prisma.studentSemesterRegistrationCourse.findMany({
                where: {
                  semesterRegistration: { id },
                  student: { id: individualRegistration.studentId },
                },
                include: {
                  offeredCourse: {
                    include: {
                      course: true,
                    },
                  },
                },
              });

            studentSemesterRegistrationCourses.forEach(
              async (
                item: StudentSemesterRegistrationCourse & {
                  offeredCourse: OfferedCourse & {
                    course: Course;
                  };
                }
              ) => {
                const isExistEnrolledData =
                  await prisma.studentEnrolledCourse.findFirst({
                    where: {
                      studentId: item.studentId,
                      courseId: item.offeredCourse.courseId,
                      academicSemesterId:
                        semesterRegistration.academicSemesterId,
                    },
                  });
                if (!isExistEnrolledData) {
                  const enrolledCourseData = {
                    studentId: item.studentId,
                    courseId: item.offeredCourse.courseId,
                    academicSemesterId: semesterRegistration.academicSemesterId,
                  };

                  const studentEnrolledCourseData =
                    await prisma.studentEnrolledCourse.create({
                      data: enrolledCourseData,
                    });

                  await StudentSemesterUtils.createStudentsEnrolledCourseDefaultMarks(
                    {
                      studentId: studentEnrolledCourseData.studentId,
                      studentEnrolledCourseId: studentEnrolledCourseData.id,
                      academicSemesterId:
                        semesterRegistration.academicSemesterId,
                    }
                  );
                }
              }
            );
          })
        : "";
    }
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Failed to modify academic semesters."
    );
  }
  return updateStatus === false
    ? { message: "Semester failed to start" }
    : { message: "Semester started successfully" };
};

const getAllSemesterRegistrations = async (
  filters: ISemesterRegistrationFilters,
  paginationOptions: IPagniationOptions
): Promise<IGenericResponse<SemesterRegistration[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: sortOrder } = {};

  const andCondition: ICondition[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: semesterRegistrationSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive" as Prisma.QueryMode,
        },
      })),
    });
  }

  if (Object.keys(filterData).length) {
    andCondition.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]: value as string | number | boolean | null,
      })),
    });
  }

  const whereConditions: Prisma.SemesterRegistrationWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.semesterRegistration.findMany({
    // where: {AND: andCondition.length > 0 ? andCondition : undefined},
    where: whereConditions,
    orderBy: sortConditions,
    skip,
    take: limit,
  });

  let total = await prisma.semesterRegistration.count({
    // where: {AND: andCondition.length > 0 ? andCondition : undefined,}
    where: whereConditions,
  });

  if (result.length === 0 && searchTerm) {
    const searchTermAsNumber = Number(searchTerm);
    if (!isNaN(searchTermAsNumber)) {
      andCondition.length = 0;
      andCondition.push({
        OR: semesterRegistrationSearchableFields.map((field) => ({
          [field]: searchTermAsNumber,
        })),
      });

      const result = await prisma.semesterRegistration.findMany({
        // where: { AND: andCondition.length > 0 ? andCondition : undefined },
        where: whereConditions,
        orderBy: sortConditions,
        skip,
        take: limit,
      });

      // Count the total matching documents
      total = await prisma.semesterRegistration.count({
        // where: { AND: andCondition.length > 0 ? andCondition : undefined},
        where: whereConditions,
      });
    }
  }

  return {
    meta: {
      total,
      limit: 10,
      page,
    },
    data: result,
  };
};

const getSingleSemesterRegistration = async (
  id: string
): Promise<SemesterRegistration | null> => {
  const result = await prisma.semesterRegistration.findFirst({
    where: { id: id },
  });
  return result;
};

const deleteSemesterRegistration = async (
  id: string
): Promise<SemesterRegistration> => {
  const result = await prisma.semesterRegistration.delete({
    where: { id: id },
    include: {
      academicSemester: true,
    },
  });
  return result;
};

// thorough check
// const updateSemesterRegistration = async (
//   id: string,
//   payload: Partial<SemesterRegistration>
// ): Promise<SemesterRegistration> => {
//   // Fetch the current semester registration status
//   const currentSemester = await prisma.semesterRegistration.findUnique({
//     where: { id: id },
//     select: { status: true },
//   });

//   if (!currentSemester) {
//     throw new ApiError(
//       httpStatus.BAD_REQUEST,
//       "Semester registration not found"
//     );
//   }

//   // Validate and update the status based on the current status
//   if (payload.status) {
//     const currentStatus = currentSemester.status;

//     if (currentStatus === "UPCOMING" && payload.status !== "ONGOING") {
//       throw new ApiError(
//         httpStatus.BAD_REQUEST,
//         "Invalid status update: Status can only be updated from 'UPCOMING' to 'ONGOING'."
//       );
//     }

//     if (currentStatus === "ONGOING" && payload.status !== "ENDED") {
//       throw new ApiError(
//         httpStatus.BAD_REQUEST,
//         "Invalid status update: Status can only be updated from 'ONGOING' to 'ENDED'."
//       );
//     }

//     if (currentStatus === "ENDED") {
//       throw new ApiError(
//         httpStatus.BAD_REQUEST,
//         "Invalid status update: Status cannot be changed from 'ENDED'."
//       );
//     }
//   }

//   const result = await prisma.semesterRegistration.update({
//     where: { id: id },
//     data: payload,
//     include: {
//       academicSemester: true,
//     },
//   });
//   return result;
// };

// transition map check
const updateSemesterRegistration = async (
  id: string,
  payload: Partial<SemesterRegistration>
): Promise<SemesterRegistration> => {
  // Define allowed status transitions
  const statusTransitionMap: Record<
    SemesterRegistrationStatus,
    SemesterRegistrationStatus | null
  > = {
    UPCOMING: "ONGOING",
    ONGOING: "ENDED",
    ENDED: null, // No transitions allowed
  };

  // Fetch the current semester registration status
  const currentSemester = await prisma.semesterRegistration.findUnique({
    where: { id: id },
    select: { status: true },
  });

  if (!currentSemester) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Semester registration not found"
    );
  }

  const currentStatus = currentSemester.status as SemesterRegistrationStatus;

  // Validate the status transition if `status` is being updated
  if (payload.status && payload.status !== statusTransitionMap[currentStatus]) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Invalid status update: Status can only transition from '${currentStatus}' to '${
        statusTransitionMap[currentStatus] ?? "no further state"
      }'.`
    );
  }

  const result = await prisma.semesterRegistration.update({
    where: { id: id },
    data: payload,
    include: {
      academicSemester: true,
    },
  });
  return result;
};

const registerToNewSemester = async (
  role: string,
  id: string
): Promise<{
  semesterRegistration: SemesterRegistration | null;
  studentSemesterRegistration: StudentSemesterRegistration | null;
}> => {
  let semesterRegistration: SemesterRegistration | null = null; // Initialize to null
  let studentSemesterRegistration: StudentSemesterRegistration | null = null; // Initialize to null
  if (role === "student") {
    const user = await prisma.student.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
    }

    const semesterRegistrationInfo =
      await prisma.semesterRegistration.findFirst({
        where: {
          status: {
            in: [
              SemesterRegistrationStatus.ONGOING,
              SemesterRegistrationStatus.UPCOMING,
            ],
          },
        },
      });

    if (
      semesterRegistrationInfo?.status === SemesterRegistrationStatus.UPCOMING
    ) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Registration is not started yet"
      );
    }

    semesterRegistration = semesterRegistrationInfo;
    let studentRegistration =
      await prisma.studentSemesterRegistration.findFirst({
        where: {
          student: {
            id: user.id,
          },
          semesterRegistration: {
            id: semesterRegistrationInfo?.id,
          },
        },
      });

    if (!studentRegistration) {
      studentRegistration = await prisma.studentSemesterRegistration.create({
        data: {
          student: {
            connect: {
              id: user?.id,
            },
          },
          semesterRegistration: {
            connect: {
              id: semesterRegistrationInfo?.id,
            },
          },
        },
      });
      studentSemesterRegistration = studentRegistration;
    }

    // return {
    //   semesterRegistration:semesterRegistrationInfo,
    //   studentSemesterRegistration:studentRegistration
    // };
  }
  return {
    semesterRegistration,
    studentSemesterRegistration,
  };
};

const enrollIntoCourse = async (
  role: string,
  id: string,
  payload: { offeredCourseId: string; offeredCourseSectionId: string }
): Promise<StudentSemesterRegistrationCourse> => {
  const student = await prisma.student.findFirst({
    where: { id: id },
  });

  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING,
    },
  });

  const offeredCourse = await prisma.offeredCourse.findFirst({
    where: {
      id: payload.offeredCourseId,
    },
    include: {
      course: true,
    },
  });

  const offeredCourseSection = await prisma.offeredCourseSection.findFirst({
    where: {
      id: payload.offeredCourseSectionId,
    },
  });

  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, "student not found");
  }
  if (!semesterRegistration) {
    throw new ApiError(httpStatus.NOT_FOUND, "semester not found");
  }
  if (!offeredCourse) {
    throw new ApiError(httpStatus.NOT_FOUND, "offered course not found");
  }
  if (!offeredCourseSection) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "offered course section not found"
    );
  }

  if (
    offeredCourseSection.maxCapacity &&
    offeredCourseSection.currentlyEnrolledStudent &&
    offeredCourseSection.currentlyEnrolledStudent >=
      offeredCourseSection.maxCapacity
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, "student capacity is full");
  }
  const enrollToCourse = await prisma.studentSemesterRegistrationCourse.create({
    data: {
      studentId: student?.id,
      semesterRegistrationId: semesterRegistration?.id,
      offeredCourseId: payload.offeredCourseId,
      offeredCourseSectionId: payload.offeredCourseSectionId,
    },
  });

  if (enrollToCourse) {
    await prisma.offeredCourseSection.update({
      where: {
        id: payload.offeredCourseSectionId,
      },
      data: {
        currentlyEnrolledStudent: {
          increment: 1,
        },
      },
    });

    await prisma.studentSemesterRegistration.updateMany({
      where: {
        student: {
          id: student.id,
        },
        semesterRegistration: {
          id: semesterRegistration.id,
        },
      },
      data: {
        totalCreditTaken: {
          increment: offeredCourse.course.credits,
        },
      },
    });
  }

  return enrollToCourse;
};

const withdrawCourse = async (
  role: string,
  id: string,
  payload: { offeredCourseId: string; offeredCourseSectionId: string }
): Promise<StudentSemesterRegistrationCourse> => {
  const student = await prisma.student.findFirst({
    where: { id: id },
  });

  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING,
    },
  });

  const offeredCourse = await prisma.offeredCourse.findFirst({
    where: {
      id: payload.offeredCourseId,
    },
    include: {
      course: true,
    },
  });

  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, "student not found");
  }
  if (!semesterRegistration) {
    throw new ApiError(httpStatus.NOT_FOUND, "semester not found");
  }
  if (!offeredCourse) {
    throw new ApiError(httpStatus.NOT_FOUND, "offered course not found");
  }

  const withdrawCourse = await prisma.studentSemesterRegistrationCourse.delete({
    where: {
      semesterRegistrationId_studentId_offeredCourseId: {
        semesterRegistrationId: semesterRegistration.id,
        studentId: student.id,
        offeredCourseId: offeredCourse.id,
      },
    },
  });

  if (withdrawCourse) {
    await prisma.offeredCourseSection.update({
      where: {
        id: payload.offeredCourseSectionId,
      },
      data: {
        currentlyEnrolledStudent: {
          decrement: 1,
        },
      },
    });

    await prisma.studentSemesterRegistration.updateMany({
      where: {
        student: {
          id: student.id,
        },
        semesterRegistration: {
          id: semesterRegistration.id,
        },
      },
      data: {
        totalCreditTaken: {
          decrement: offeredCourse.course.credits,
        },
      },
    });
  }

  return withdrawCourse;
};

const confirmRegistration = async (
  // role: string,
  id: string
): Promise<{ message: string }> => {
  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING,
    },
  });

  const studentSemesterRegistration =
    await prisma.studentSemesterRegistration.findFirst({
      where: {
        semesterRegistration: {
          id: semesterRegistration?.id,
        },
        student: {
          id: id,
        },
      },
    });

  if (!studentSemesterRegistration) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Not eligible for this semester"
    );
  }

  if (
    studentSemesterRegistration.totalCreditTaken &&
    studentSemesterRegistration.totalCreditTaken < 0
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Toal credit not enough");
  }

  if (
    studentSemesterRegistration.totalCreditTaken &&
    semesterRegistration?.minCredit &&
    semesterRegistration.maxCredit &&
    studentSemesterRegistration.totalCreditTaken <
      semesterRegistration?.minCredit &&
    studentSemesterRegistration.totalCreditTaken >
      semesterRegistration?.maxCredit
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `You can take only ${semesterRegistration.minCredit} to ${semesterRegistration.maxCredit}`
    );
  }

  await prisma.studentSemesterRegistration.update({
    where: {
      id: studentSemesterRegistration.id,
    },
    data: {
      isConfirmed: true,
    },
  });

  return {
    message: "Your registration is confirmed",
  };
};

const getMyRegistrations = async (
  id: string
): Promise<{
  semesterRegistration: SemesterRegistration;
  studentSemesterRegistration: StudentSemesterRegistration;
}> => {
  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING,
    },
    include: {
      academicSemester: true,
    },
  });

  if (!semesterRegistration) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "No ongoing semester registration found."
    );
  }

  const studentSemesterRegistration =
    await prisma.studentSemesterRegistration.findFirst({
      where: {
        semesterRegistration: {
          id: semesterRegistration?.id,
        },
        student: {
          id: id,
        },
      },
      include: {
        student: true,
      },
    });
  if (!studentSemesterRegistration) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "No ongoing semester registration found."
    );
  }

  return { semesterRegistration, studentSemesterRegistration };
};

const updateStudentMarks = async (payload: any) => {
  const { studentId, academicSemesterId, courseId, examType, marks } = payload;

  const studentEnrolledCourseMarks =
    await prisma.studentEnrolledCourseMark.findFirst({
      where: {
        student: {
          id: studentId,
        },
        academicSemester: {
          id: academicSemesterId,
        },
        studentEnrolledCourse: {
          course: {
            id: courseId,
          },
        },
        examType,
      },
    });

  if (!studentEnrolledCourseMarks) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Student enrolled course mark not found"
    );
  }

  // let grade: string = "";
  // if (marks >= 0 && marks <= 39) {
  //   grade = "F";
  // } else if (marks >= 40 && marks <= 49) {
  //   grade = "D";
  // } else if (marks >= 50 && marks <= 59) {
  //   grade = "C";
  // } else if (marks >= 60 && marks <= 69) {
  //   grade = "B";
  // } else if (marks >= 70 && marks <= 79) {
  //   grade = "A";
  // } else if (marks >= 80 && marks <= 100) {
  //   grade = "A+";
  // }

  const result = await StudentSemesterUtils.getGrade(payload);

  const updateStudentMarks = await prisma.studentEnrolledCourseMark.update({
    where: {
      id: studentEnrolledCourseMarks.id,
    },
    data: {
      marks,
      grade: result.grade,
    },
  });
  return updateStudentMarks;
};

const updateFinalMarks = async (
  payload: any
): Promise<StudentEnrolledCourse[]> => {
  const { studentId, academicSemesterId, courseId } = payload;

  const studentEnrolledCourse = await prisma.studentEnrolledCourse.findFirst({
    where: {
      student: {
        id: studentId,
      },
      academicSemester: {
        id: academicSemesterId,
      },
      course: {
        id: courseId,
      },
    },
  });

  if (!studentEnrolledCourse) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Student enrolled course data not found"
    );
  }

  const studentEnrolledCourseMarks =
    await prisma.studentEnrolledCourseMark.findMany({
      where: {
        student: {
          id: studentId,
        },
        academicSemester: {
          id: academicSemesterId,
        },
        studentEnrolledCourse: {
          course: {
            id: courseId,
          },
        },
      },
    });

  if (!studentEnrolledCourseMarks) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Student enrolled course mark not found"
    );
  }

  const midTermsMarks =
    studentEnrolledCourseMarks.find(
      (item) => item.examType === ExamType.MIDTERM
    )?.marks || 0;
  const finalTermMarks =
    studentEnrolledCourseMarks.find((item) => item.examType === ExamType.FINAL)
      ?.marks || 0;

  const totalFinalMarks =
    Math.ceil(midTermsMarks * 0.4) + Math.ceil(finalTermMarks * 0.6);

  const result = await StudentSemesterUtils.getGrade(totalFinalMarks);

  await prisma.studentEnrolledCourse.updateMany({
    where: {
      student: {
        id: studentId,
      },
      academicSemester: {
        id: academicSemesterId,
      },
      course: {
        id: courseId,
      },
    },
    data: {
      grade: (await result).grade,
      point: Number((await result).piont),
      totalMarks: totalFinalMarks,
      status: StudentEnrolledCourseStatus.COMPLETED,
    },
  });

  const grades = await prisma.studentEnrolledCourse.findMany({
    where: {
      student: {
        id: studentId,
      },
      status: StudentEnrolledCourseStatus.COMPLETED,
    },
    include: {
      course: true,
    },
  });

  const academicResult = await StudentSemesterUtils.calcGradeAndCGPA(grades);

  const studentAcademicInfo = await prisma.studentAcademicInfo.findFirst({
    where: {
      student: {
        id: studentId,
      },
    },
  });

  if (studentAcademicInfo) {
    await prisma.studentAcademicInfo.update({
      where: {
        id: studentAcademicInfo.id,
      },
      data: {
        totalCompletedCredit: academicResult.totalCompletedCredit,
        cgpa: academicResult.cgpa,
      },
    });
  } else {
    await prisma.studentAcademicInfo.create({
      data: {
        student: {
          connect: {
            id: studentId,
          },
        },
        totalCompletedCredit: academicResult.totalCompletedCredit,
        cgpa: academicResult.cgpa,
      },
    });
  }

  return grades;
};

const getMySemesterRegisteredCourses = async (user: { userId: string }) => {
  const { userId } = user;

  const student = await prisma.student.findFirst({
    where: {
      id: userId,
    },
  });

  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: {
        in: [
          SemesterRegistrationStatus.ONGOING,
          SemesterRegistrationStatus.UPCOMING,
        ],
      },
    },
    include: {
      academicSemester: true,
    },
  });

  if (!semesterRegistration) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "No semester registration found"
    );
  }

  const studentCompletedCourse = await prisma.studentEnrolledCourse.findMany({
    where: {
      status: StudentEnrolledCourseStatus.COMPLETED,
      student: {
        id: student?.id,
      },
    },
    include: {
      course: true,
    },
  });

  const stuentCurrentSemesterTakenCourse =
    await prisma.studentSemesterRegistrationCourse.findMany({
      where: {
        student: {
          id: student?.id,
        },
        semesterRegistration: {
          id: semesterRegistration?.id,
        },
      },
      include: {
        offeredCourse: true,
        offeredCourseSection: true,
      },
    });

  const offeredCourse = await prisma.offeredCourse.findMany({
    where: {
      semesterRegistration: {
        id: semesterRegistration.id,
      },
      academicDepartment: {
        id: student?.academicDepartmentId,
      },
    },
    include: {
      course: {
        include: {
          preRequisite: {
            include: {
              preRequisite: true,
            },
          },
        },
      },
      offeredCourseSections: {
        include: {
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
      },
    },
  });

  const availableCourses = await StudentSemesterUtils.getAvailableCourses(
    offeredCourse,
    studentCompletedCourse,
    studentCompletedCourse
  );

  return availableCourses
};

export const semesterRegistrationService = {
  createSemesterRegistration,
  startNewSemester,
  getAllSemesterRegistrations,
  getSingleSemesterRegistration,
  deleteSemesterRegistration,
  updateSemesterRegistration,
  registerToNewSemester,
  enrollIntoCourse,
  withdrawCourse,
  confirmRegistration,
  getMyRegistrations,
  updateStudentMarks,
  updateFinalMarks,
  getMySemesterRegisteredCourses,
};
