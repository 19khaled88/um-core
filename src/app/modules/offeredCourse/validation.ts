import { z } from "zod";

const createOfferedCourseZodSchema = z.object({
  body: z.object({
    academicDepartmentId: z
      .string({
        required_error: "Academic department ID is required",
      })
      .min(1, "Academic department ID cannot be empty"),

    semesterRegistrationId: z
      .string({
        required_error: "Semester registration ID is required",
      })
      .min(1, "Semester registration ID cannot be empty"),
    courseIds: z
      .array(
        z
          .string({
            required_error: "Course id is required",
          })
          .min(1, "Course ID cannot be empty")
      )
      .nonempty("At least one course ID must be provided"),
  }),
});

export const OfferedCoursesValidation = {
  createOfferedCourseZodSchema,
};
