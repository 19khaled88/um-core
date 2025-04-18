import { Prisma } from "@prisma/client";

export type IManagementDepartment = {
  title: string;
  syncId:string;
};

export type IManagementDepartmentFilters = {
  searchTerm?: string;
};

export type sortOrder = 'asc' | 'desc';
export type ICondition = {
  // OR?: { [key: string]: { contains: string; mode: Prisma.QueryMode } }[];
  OR?: { [key: string]: { contains: string; mode: Prisma.QueryMode } }[] | { [key: string]: number }[];
  AND?: { [key: string]: string | number | boolean | null }[];
};

export type IMnagementDepartmentEvents ={
  id:string;
  title:string;
  _id:string;
}