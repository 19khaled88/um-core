import { z } from "zod";

const createDepartmentZodSchema = z.object({
    body:z.object({
        title:z.string({
            required_error:'Title is required'
        }),
        academicFacultyId:z.string({
            required_error:'academic faculty is required'
        })
    })
})


const updateDepartmentZodSchema = z.object({
    body:z.object({
        title:z.string().optional(),
        academicFacultyId:z.string().optional()
    })
})


export const AcademicDepartmentValiation = {
    createDepartmentZodSchema,
    updateDepartmentZodSchema
}