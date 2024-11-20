import { z } from "zod";

const createCourseZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    code: z.string({
      required_error: "Code is required",
    }),
    creadits:z.number({
        required_error:'Credits is required'
    }),
    preRequisiteCourses:z.array(
        z.object({
            courseId:z.string({
                required_error:'Course ID is required for prerequisite'
            })
        })
    ).optional()
  }),
});

const updateCourseZodSchema = z.object({
    body: z.object({
      title: z.string().optional(), 
      code: z.string().optional(), 
      creadits: z.number().optional(), 
      preRequisiteCourses: z
        .array(
          z.object({
            courseId: z.string({
              required_error: 'Course ID is required for prerequisite',
            }),
          })
        )
        .optional(), 
    }),
  });

export const CourseValidation = {
  createCourseZodSchema,
  updateCourseZodSchema,
};
