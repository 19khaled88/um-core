import { Prisma } from "@prisma/client";


export type sortOrder = 'asc' | 'desc';


export type IStudentFilters = {
    searchTerm?: string;
  };

export type ICondition = {
// OR?: { [key: string]: { contains: string; mode: Prisma.QueryMode } }[];
OR?: { [key: string]: { contains: string; mode: Prisma.QueryMode } }[] | { [key: string]: number }[];
AND?: { [key: string]: string | number | boolean | null }[];
};