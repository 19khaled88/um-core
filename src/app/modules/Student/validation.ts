import { z } from "zod";
import { bloodGroup, personality } from "./contants";


const createStudentZodSchemna = z.object({
  body: z.object({
    password: z.string().optional(),
    student: z.object({
       firstName: z.string({
          required_error: "First name is required",
       }),
       middleName: z.string().optional(),
       lastName: z.string({
            required_error: "Last name is required",
       }),
       profileImage: z.string().optional(),
       email: z
       .string({
         required_error: "Email is required",
       })
       .email(),
       dateOfBirth: z.string({
        required_error: "Date of birth is required",
       }),
     
       emergencyContactNo: z.string({
        required_error: "Emergency contact number is requried",
      }),
      presentAddress: z.string({
        required_error: "Presend address is required",
      }),
      permanentAddress: z.string({
        required_error: "Permanent address is required",
      }),
      
      contactNo: z.string({
        required_error: "Contact number is required",
      }),
      gender: z.enum([...personality] as [string, ...string[]], {
        required_error: "Gender is required",
       }),
      
      bloodGroup: z.enum([...bloodGroup] as [string, ...string[]]).optional(),
      
      academicSemesterId: z.string({
        required_error: "Academic Semester is required",
      }),
      academicDepartmentId: z.string({
        required_error: "Academic department is required",
      }),
      academicFacultyId: z.string({
        required_error: "Academic faculty is required",
      }),
      
    }),
  }),
});

const updateStudentZodSchema = z.object({
  body: z.object({
    password: z.string().optional(),
    student: z
      .object({
        firstName: z
        .string({
        required_error: "First name is required",
        })
        .optional(),
        middleName: z
        .string({
        required_error: "Middle name is required",
        })
        .optional(),
        lastName: z
        .string({
        required_error: "Last name is required",
        })
        .optional(),
        dateOfBirth: z
          .string({
            required_error: "Date of birth is required",
          })
          .optional(),
        gender: z
          .enum([...personality] as [string, ...string[]], {
            required_error: "Gender is required",
          })
          .optional(),
        bloodGroup: z
          .enum([...bloodGroup] as [string, ...string[]], {
            required_error: "Blood group is required",
          })
          .optional(),
        email: z
          .string({
            required_error: "Email is required!",
          })
          .email()
          .optional(),
        contactNo: z
          .string({
            required_error: "Contact number is required",
          })
          .optional(),
        emergencyContactNo: z
          .string({
            required_error: "Emergency contact number is required",
          })
          .optional(),
        presentAddress: z
          .string({
            required_error: "Present address is required",
          })
          .optional(),
        permanentAddress: z
          .string({
            required_error: "Permanent address is required",
          })
          .optional(),
        academicSemester: z
          .string({
            required_error: "Academic semester is required",
          })
          .optional(),
        academicDepartment: z
          .string({
            required_error: "Academic Department is required",
          })
          .optional(),
        academicFaculty: z
          .string({
            required_error: "Academic faculty is required",
          })
          .optional(),
        profileImage: z.string({}).optional(),
      })
      .optional(),
  }),
});

export const StudentZodValidation = {
  createStudentZodSchemna,
  updateStudentZodSchema,
};
