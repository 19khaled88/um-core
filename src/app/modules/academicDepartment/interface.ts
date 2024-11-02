import { Prisma } from "@prisma/client";

export type ICondition = {
    // OR?: { [key: string]: { contains: string; mode: Prisma.QueryMode } }[];
    OR?: { [key: string]: { contains: string; mode: Prisma.QueryMode } }[] | { [key: string]: number }[];
    AND?: { [key: string]: string | number | boolean | null }[];
  };

export type sortOrder = 'asc' | 'desc';
export type IAcademicDepartmentFilters ={
    searchTerm? : string;
    academicFaculty?:Prisma.AcademicFacultyWhereInput['id']
}
