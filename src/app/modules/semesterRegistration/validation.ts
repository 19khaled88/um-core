import { z } from "zod";
const SemesterRegistrationStatusEnum = z.enum(["UPCOMING", "ONGOING", "ENDED"]);
const createSemesterRegistrationZodSchema = z.object({
  body: z.object({
    startDate: z.string({
      required_error: "Start date is required",
    }),
    endDate: z.string({
      required_error: "End date is required",
    }),
    status: SemesterRegistrationStatusEnum.optional().default("UPCOMING"),
    minCredit: z.number().int().min(0).optional().default(0),
    maxCredit: z.number().int().min(0).optional().default(0),
    academicSemesterId: z.string({
      required_error: "Academic semester ID is required",
    }),
  }),
});

const updateSemesterRegistrationZodSchema = z.object({
    body: z.object({
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      status: z.enum(["UPCOMING", "ONGOING", "ENDED"]).optional(),
      minCredit: z.number().int().min(0).optional(),
      maxCredit: z.number().int().min(0).optional(),
      academicSemesterId: z.string().optional(),
    }),
  });

export const SemesterRegistrationValidation = {
  createSemesterRegistrationZodSchema,
  updateSemesterRegistrationZodSchema,
};