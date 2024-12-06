import { Course, ExamType, StudentEnrolledCourse } from "@prisma/client";
import prisma from "../../../helper/prismaKeyWrok";

interface SemesterPaymentInput {
  studentId: string;
  academicSemesterId: string;
  totalPaymentAmount: number;
}

interface StudentMarks {
  studentId: string;
  studentEnrolledCourseId: string;
  academicSemesterId: string;
}

const createSemesterPayment = async (payload: SemesterPaymentInput) => {
  const isExist = await prisma.studentSemesterPayment.findFirst({
    where: {
      student: {
        id: payload.studentId,
      },
      academicSemester: {
        id: payload.academicSemesterId,
      },
    },
  });

  if (!isExist) {
    const dataToInsert = {
      studentId: payload.studentId,
      academicSemesterId: payload.academicSemesterId,
      fullPaymentAmount: payload.totalPaymentAmount,
      partialPaymentAmount: payload.totalPaymentAmount * 0.5,
      totalDueAmount: payload.totalPaymentAmount,
      totalPaidAmount: 0,
    };

    await prisma.studentSemesterPayment.create({
      data: dataToInsert,
    });
  }
};

const createStudentsEnrolledCourseDefaultMarks = async (
  payload: StudentMarks
) => {
  const isExistMidtermData = await prisma.studentEnrolledCourseMark.findFirst({
    where: {
      examType: ExamType.MIDTERM,
      student: {
        id: payload.studentId,
      },
      studentEnrolledCourse: {
        id: payload.studentEnrolledCourseId,
      },
      academicSemester: {
        id: payload.academicSemesterId,
      },
    },
  });

  if (!isExistMidtermData) {
    await prisma.studentEnrolledCourseMark.create({
      data: {
        student: {
          connect: {
            id: payload.studentId,
          },
        },
        studentEnrolledCourse: {
          connect: {
            id: payload.studentEnrolledCourseId,
          },
        },
        academicSemester: {
          connect: {
            id: payload.academicSemesterId,
          },
        },
        examType: ExamType.MIDTERM,
      },
    });
  }

  const isExistFinalData = await prisma.studentEnrolledCourseMark.findFirst({
    where: {
      examType: ExamType.FINAL,
      student: {
        id: payload.studentId,
      },
      studentEnrolledCourse: {
        id: payload.studentEnrolledCourseId,
      },
      academicSemester: {
        id: payload.academicSemesterId,
      },
    },
  });

  if (!isExistFinalData) {
    await prisma.studentEnrolledCourseMark.create({
      data: {
        student: {
          connect: {
            id: payload.studentId,
          },
        },
        studentEnrolledCourse: {
          connect: {
            id: payload.studentEnrolledCourseId,
          },
        },
        academicSemester: {
          connect: {
            id: payload.academicSemesterId,
          },
        },
        examType: ExamType.FINAL,
      },
    });
  }
};

async function getGrade(marks: any) {
  // Define grade boundaries
  const gradeBoundaries = [
    { min: 0, max: 39, grade: "F", points: 0 },
    { min: 40, max: 49, grade: "D", points: 1 },
    { min: 50, max: 59, grade: "C", points: 2 },
    { min: 60, max: 69, grade: "B", points: 3 },
    { min: 70, max: 79, grade: "A", points: 4 },
    { min: 80, max: 100, grade: "A+", points: 5 },
  ];

  // Find the appropriate grade based on marks
  const gradeEntry = gradeBoundaries.find(
    (entry) => marks >= entry.min && marks <= entry.max
  );

  // Return the payload object with the assigned grade
  return {
    grade: gradeEntry ? gradeEntry.grade : "Invalid marks", // Handle invalid input
    piont: gradeEntry ? gradeEntry.points : "Invalid points",
  };
}

const calcGradeAndCGPA = async (
  payload: (StudentEnrolledCourse & { course: Course })[]
) => {
  if (payload.length === 0) {
    return {
      totalCompletedCredit: 0,
      cgpa: 0,
    };
  }
  let totalCredit = 0;
  let totalCGPA = 0;

  for (const grade of payload) {
    totalCGPA += grade.point || 0;
    totalCredit += grade.course.credits || 0;
  }

  const avgCGPA = Number((totalCGPA / payload.length).toFixed(2));

  return {
    totalCompletedCredit: totalCredit,
    cgpa: avgCGPA,
  };
};

const getAvailableCourses = async (
  offeredCourses: any,
  studentCompletedCourses: any,
  studentCurrentlyTakenCourses: any
) => {
  const completedCoursesId = studentCompletedCourses.map(
    (course: any) => course.courseId
  );

  const availableCourseList = offeredCourses
    .filter(
      (offeredCourse: any) =>
        !completedCoursesId.includes(offeredCourse.courseId)
    )
    .filter((course: any) => {
      const preRequisites = course.course.preRequisite;
      if (preRequisites.length > 0) {
        return true;
      } else {
        const preRequisiteIds = preRequisites.map(
          (preRequisite: any) => preRequisite.preRequisiteId
        );

        return preRequisiteIds.every((id: string) =>
          completedCoursesId.includes(id)
        );
      }
    })
    .map((course: any) => {
      const isAlreadyTakenCourse = studentCurrentlyTakenCourses.find(
        (c: any) => c.offeredCourseId === course.id
      );
      if (isAlreadyTakenCourse) {
        course.offeredCourseSections.map((section: any) => {
          if (section.id === isAlreadyTakenCourse.offeredCourseSectionId) {
            section.isTaken = true;
          } else {
            section.isTaken = false;
          }
        });

        return {
          ...course,
          isTaken: true,
        };
      } else {
        course.offeredCourseSections.map((section: any) => {
          section.isTaken = false;
        });

        return {
          ...course,
          isTaken: false,
        };
      }
    });

    return availableCourseList
};

export const StudentSemesterUtils = {
  createSemesterPayment,
  createStudentsEnrolledCourseDefaultMarks,
  getGrade,
  calcGradeAndCGPA,
  getAvailableCourses,
};
