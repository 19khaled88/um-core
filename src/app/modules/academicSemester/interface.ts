import { Prisma } from "@prisma/client";
import { Model } from "mongoose";

export type Month = "January"| "February"| "March"| "April" | "May"| "June"| "July"| "August"| "September"| "October"| "November"| "December";
export type IAcademicSemesterTitle ='Autumn' | 'Summer' | 'Fall'
export type IAcademicSemesterCode ='01' | '02' | '03'

export type IAcademicSemester ={
    title :IAcademicSemesterTitle;
    year:number;
    code:IAcademicSemesterCode;
    startMonth:Month;
    endMonth:Month;
}

export type sortOrder = 'asc' | 'desc';

export type ICondition = {
    // OR?: { [key: string]: { contains: string; mode: Prisma.QueryMode } }[];
    OR?: { [key: string]: { contains: string; mode: Prisma.QueryMode } }[] | { [key: string]: number }[];
    AND?: { [key: string]: string | number | boolean | null }[];
  };

export type AcademicSemesterModel = Model<IAcademicSemester> 


export type IAcademicSemeterFilters ={
    searchTerm? : string 
}
