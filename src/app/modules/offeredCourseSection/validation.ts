import { z } from "zod";

const createOfferedCourseSectionZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    maxCapacity: z.number({
      required_error: "Max capacity value is required",
    }),
    offeredCourseId: z.string({
      required_error: "offered corse id is requierd",
    }),
  }),
});

export const OfferedCoursesSectionValidation = {
  createOfferedCourseSectionZodSchema,
};
