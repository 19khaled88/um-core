import { string, z } from "zod"
import { academicSemesterCode, academicSemesterMonth, academicSemesterTitle } from "./constants"


const academicSemesterZodSchema = z.object({
    body: z.object({
        title: z.enum([...academicSemesterTitle] as [string, ...string[]],{required_error:'Title is required'}),
        year: z.number({
            required_error:'Year is required'
        }),
        code: z.enum([...academicSemesterCode] as [string, ...string[]],{
            required_error:'code is required'
        }),
        startMonth: z.enum([...academicSemesterMonth] as [string, ...string[]],{
            required_error:'Start month is required'
        }),
        endMonth: z.enum([...academicSemesterMonth] as [string, ...string[]],{
            required_error:'End month is required'
        }),
    })
})

const updateAcademicSemesterZodSchema = z.object({
    body: z.object({
        title: z.enum([...academicSemesterTitle] as [string, ...string[]],{required_error:'Title is required'}).optional(),
        year: z.number({
            required_error:'Year is required'
        }).optional(),
        code: z.enum([...academicSemesterCode] as [string, ...string[]],{
            required_error:'code is required'
        }).optional(),
        startMonth: z.enum([...academicSemesterMonth] as [string, ...string[]],{
            required_error:'Start month is required'
        }).optional(),
        endMonth: z.enum([...academicSemesterMonth] as [string, ...string[]],{
            required_error:'End month is required'
        }).optional(),
    })
}).refine((data)=>(data.body.title && data.body.code) || (!data.body.title && !data.body .code),{
    message:'Either both title and code provide or update others'
})

export const AcademicSemesterValidation ={
    academicSemesterZodSchema,
    updateAcademicSemesterZodSchema
}